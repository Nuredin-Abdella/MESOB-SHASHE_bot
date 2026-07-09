/**
 * Telegram Payments Integration Service
 * Handles Telegram Payments API, Ethiopian payment gateways, and transaction management
 */

const crypto = require('crypto');
const axios = require('axios');

class PaymentService {
    constructor() {
        this.providerToken = process.env.TELEGRAM_PAYMENTS_TOKEN;
        this.currency = 'ETB'; // Ethiopian Birr
        this.supportedPaymentMethods = ['telegram', 'telebirr', 'cbe_birr', 'bank_transfer'];

        // Ethiopian payment gateways
        this.gateways = {
            telebirr: {
                baseUrl: process.env.TELEBIRR_API_URL,
                merchantCode: process.env.TELEBIRR_MERCHANT_CODE,
                apiKey: process.env.TELEBIRR_API_KEY
            },
            cbe: {
                baseUrl: process.env.CBE_API_URL,
                merchantId: process.env.CBE_MERCHANT_ID,
                apiKey: process.env.CBE_API_KEY
            }
        };

        this.transactions = new Map();
        this.paymentCallbacks = new Map();
    }

    /**
     * Create Telegram invoice
     */
    async createTelegramInvoice(paymentData) {
        try {
            const invoice = {
                title: paymentData.title,
                description: paymentData.description,
                payload: JSON.stringify({
                    applicationId: paymentData.applicationId,
                    serviceType: paymentData.serviceType,
                    userId: paymentData.userId,
                    timestamp: Date.now()
                }),
                provider_token: this.providerToken,
                currency: this.currency,
                prices: [{
                    label: paymentData.serviceLabel,
                    amount: Math.round(paymentData.amount * 100) // Convert to smallest currency unit
                }],
                max_tip_amount: Math.round(paymentData.amount * 0.1 * 100), // 10% tip
                suggested_tip_amounts: [
                    Math.round(paymentData.amount * 0.05 * 100), // 5%
                    Math.round(paymentData.amount * 0.1 * 100),  // 10%
                    Math.round(paymentData.amount * 0.15 * 100)  // 15%
                ],
                photo_url: paymentData.photoUrl || 'https://eservice.shashemenecity.com/images/mesob-logo.png',
                photo_size: 512,
                photo_width: 512,
                photo_height: 512,
                need_name: true,
                need_phone_number: true,
                need_email: false,
                need_shipping_address: false,
                send_phone_number_to_provider: true,
                send_email_to_provider: false,
                is_flexible: false
            };

            return {
                success: true,
                invoice
            };

        } catch (error) {
            console.error('Failed to create Telegram invoice:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Process Telebirr payment
     */
    async processTelebirrPayment(paymentData) {
        try {
            const transactionId = this.generateTransactionId();
            const gateway = this.gateways.telebirr;

            const payload = {
                merchantCode: gateway.merchantCode,
                amount: paymentData.amount,
                currency: this.currency,
                transactionId,
                customerPhone: paymentData.customerPhone,
                description: paymentData.description,
                callbackUrl: `${process.env.BASE_URL}/api/payments/telebirr/callback`,
                returnUrl: `${process.env.BASE_URL}/api/payments/telebirr/return`
            };

            // Sign the request
            const signature = this.signTelebirrRequest(payload, gateway.apiKey);
            payload.signature = signature;

            const response = await axios.post(`${gateway.baseUrl}/api/v1/payment/initiate`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${gateway.apiKey}`
                }
            });

            // Store transaction
            this.transactions.set(transactionId, {
                id: transactionId,
                type: 'telebirr',
                status: 'pending',
                amount: paymentData.amount,
                applicationId: paymentData.applicationId,
                userId: paymentData.userId,
                createdAt: new Date(),
                gatewayResponse: response.data
            });

            return {
                success: true,
                transactionId,
                paymentUrl: response.data.paymentUrl,
                qrCode: response.data.qrCode,
                expiresAt: response.data.expiresAt
            };

        } catch (error) {
            console.error('Telebirr payment failed:', error);
            return {
                success: false,
                error: error.message,
                errorCode: error.response?.data?.code || 'TELEBIRR_ERROR'
            };
        }
    }

    /**
     * Process CBE Birr payment
     */
    async processCBEPayment(paymentData) {
        try {
            const transactionId = this.generateTransactionId();
            const gateway = this.gateways.cbe;

            const payload = {
                merchantId: gateway.merchantId,
                amount: paymentData.amount,
                currency: this.currency,
                orderId: transactionId,
                customerInfo: {
                    phone: paymentData.customerPhone,
                    name: paymentData.customerName
                },
                description: paymentData.description,
                notifyUrl: `${process.env.BASE_URL}/api/payments/cbe/notify`,
                returnUrl: `${process.env.BASE_URL}/api/payments/cbe/return`
            };

            // Generate timestamp and nonce
            const timestamp = Math.floor(Date.now() / 1000);
            const nonce = crypto.randomBytes(16).toString('hex');

            // Sign the request
            const signature = this.signCBERequest(payload, gateway.apiKey, timestamp, nonce);

            const response = await axios.post(`${gateway.baseUrl}/payment/create`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Merchant-Id': gateway.merchantId,
                    'X-Timestamp': timestamp,
                    'X-Nonce': nonce,
                    'X-Signature': signature
                }
            });

            // Store transaction
            this.transactions.set(transactionId, {
                id: transactionId,
                type: 'cbe_birr',
                status: 'pending',
                amount: paymentData.amount,
                applicationId: paymentData.applicationId,
                userId: paymentData.userId,
                createdAt: new Date(),
                gatewayResponse: response.data
            });

            return {
                success: true,
                transactionId,
                paymentUrl: response.data.redirectUrl,
                qrCode: response.data.qrData,
                reference: response.data.paymentReference
            };

        } catch (error) {
            console.error('CBE payment failed:', error);
            return {
                success: false,
                error: error.message,
                errorCode: error.response?.data?.errorCode || 'CBE_ERROR'
            };
        }
    }

    /**
     * Handle payment pre-checkout query
     */
    async handlePreCheckout(preCheckoutQuery) {
        try {
            const payload = JSON.parse(preCheckoutQuery.invoice_payload);

            // Validate payment
            const validation = await this.validatePayment(payload);

            if (!validation.valid) {
                return {
                    ok: false,
                    error_message: validation.error
                };
            }

            // Store pre-checkout info
            this.paymentCallbacks.set(preCheckoutQuery.id, {
                userId: preCheckoutQuery.from.id,
                payload,
                orderInfo: preCheckoutQuery.order_info,
                timestamp: Date.now()
            });

            return { ok: true };

        } catch (error) {
            console.error('Pre-checkout validation failed:', error);
            return {
                ok: false,
                error_message: 'Payment validation failed'
            };
        }
    }

    /**
     * Handle successful payment
     */
    async handleSuccessfulPayment(successfulPayment) {
        try {
            const payload = JSON.parse(successfulPayment.invoice_payload);
            const preCheckout = this.paymentCallbacks.get(successfulPayment.telegram_payment_charge_id);

            // Create transaction record
            const transaction = {
                id: this.generateTransactionId(),
                type: 'telegram',
                status: 'completed',
                amount: successfulPayment.total_amount / 100, // Convert from smallest unit
                currency: successfulPayment.currency,
                applicationId: payload.applicationId,
                userId: payload.userId,
                telegramChargeId: successfulPayment.telegram_payment_charge_id,
                providerChargeId: successfulPayment.provider_payment_charge_id,
                orderInfo: preCheckout?.orderInfo,
                completedAt: new Date(),
                createdAt: new Date()
            };

            this.transactions.set(transaction.id, transaction);

            // Process the payment (update application, send notifications, etc.)
            await this.processCompletedPayment(transaction);

            return {
                success: true,
                transactionId: transaction.id,
                receipt: await this.generateReceipt(transaction)
            };

        } catch (error) {
            console.error('Payment processing failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Validate payment before processing
     */
    async validatePayment(payload) {
        try {
            // Check if application exists and is valid
            const governmentApi = require('./governmentApi');
            const application = await governmentApi.getApplication(payload.applicationId);

            if (!application.success) {
                return {
                    valid: false,
                    error: 'Application not found'
                };
            }

            // Check if payment is required
            if (!application.data.paymentRequired) {
                return {
                    valid: false,
                    error: 'Payment not required for this application'
                };
            }

            // Check if already paid
            if (application.data.paymentStatus === 'paid') {
                return {
                    valid: false,
                    error: 'Application already paid'
                };
            }

            return { valid: true };

        } catch (error) {
            return {
                valid: false,
                error: 'Payment validation failed'
            };
        }
    }

    /**
     * Process completed payment
     */
    async processCompletedPayment(transaction) {
        try {
            // Update application payment status
            const governmentApi = require('./governmentApi');
            await governmentApi.updatePaymentStatus(transaction.applicationId, {
                status: 'paid',
                transactionId: transaction.id,
                amount: transaction.amount,
                paymentMethod: transaction.type,
                paidAt: transaction.completedAt
            });

            // Send confirmation to user
            const bot = require('../bot-enhanced').bot;
            await bot.sendMessage(transaction.userId,
                `✅ Payment Confirmed!\n\n` +
                `💳 Transaction ID: ${transaction.id}\n` +
                `💰 Amount: ${transaction.amount} ${transaction.currency}\n` +
                `📋 Application: ${transaction.applicationId}\n\n` +
                `Your application will now be processed.`
            );

            // Log transaction for audit
            console.log('Payment completed:', transaction);

        } catch (error) {
            console.error('Failed to process completed payment:', error);
        }
    }

    /**
     * Generate payment receipt
     */
    async generateReceipt(transaction) {
        const receipt = {
            id: crypto.randomUUID(),
            transactionId: transaction.id,
            amount: transaction.amount,
            currency: transaction.currency,
            paymentMethod: transaction.type,
            applicationId: transaction.applicationId,
            paidAt: transaction.completedAt,
            receiptUrl: `${process.env.BASE_URL}/receipts/${transaction.id}`,
            qrCode: await this.generateReceiptQR(transaction.id)
        };

        // In production, this would be stored in database
        return receipt;
    }

    /**
     * Generate QR code for receipt
     */
    async generateReceiptQR(transactionId) {
        // This would integrate with a QR code generation service
        const receiptUrl = `${process.env.BASE_URL}/receipts/verify/${transactionId}`;
        return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(receiptUrl)}`;
    }

    /**
     * Handle payment callbacks from gateways
     */
    async handlePaymentCallback(gateway, callbackData) {
        try {
            let transaction;
            let isValid = false;

            switch (gateway) {
                case 'telebirr':
                    isValid = this.verifyTelebirrCallback(callbackData);
                    if (isValid) {
                        transaction = this.transactions.get(callbackData.transactionId);
                        if (transaction) {
                            transaction.status = callbackData.status;
                            transaction.gatewayReference = callbackData.reference;
                            transaction.completedAt = new Date();
                        }
                    }
                    break;

                case 'cbe':
                    isValid = this.verifyCBECallback(callbackData);
                    if (isValid) {
                        transaction = this.transactions.get(callbackData.orderId);
                        if (transaction) {
                            transaction.status = callbackData.status;
                            transaction.gatewayReference = callbackData.paymentReference;
                            transaction.completedAt = new Date();
                        }
                    }
                    break;
            }

            if (isValid && transaction && callbackData.status === 'success') {
                await this.processCompletedPayment(transaction);
            }

            return { success: isValid };

        } catch (error) {
            console.error('Payment callback error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Generate transaction ID
     */
    generateTransactionId() {
        const timestamp = Date.now().toString(36);
        const random = crypto.randomBytes(4).toString('hex');
        return `TXN-${timestamp}-${random}`.toUpperCase();
    }

    /**
     * Sign Telebirr request
     */
    signTelebirrRequest(payload, apiKey) {
        const sortedKeys = Object.keys(payload).sort();
        const signString = sortedKeys.map(key => `${key}=${payload[key]}`).join('&');

        return crypto.createHmac('sha256', apiKey)
            .update(signString)
            .digest('hex');
    }

    /**
     * Sign CBE request
     */
    signCBERequest(payload, apiKey, timestamp, nonce) {
        const signString = `${JSON.stringify(payload)}${timestamp}${nonce}`;

        return crypto.createHmac('sha256', apiKey)
            .update(signString)
            .digest('base64');
    }

    /**
     * Verify Telebirr callback
     */
    verifyTelebirrCallback(callbackData) {
        try {
            const gateway = this.gateways.telebirr;
            const expectedSignature = this.signTelebirrRequest(
                { ...callbackData },
                gateway.apiKey
            );

            return callbackData.signature === expectedSignature;
        } catch (error) {
            return false;
        }
    }

    /**
     * Verify CBE callback
     */
    verifyCBECallback(callbackData) {
        try {
            const gateway = this.gateways.cbe;
            const signString = JSON.stringify(callbackData);
            const expectedSignature = crypto.createHmac('sha256', gateway.apiKey)
                .update(signString)
                .digest('base64');

            return callbackData.signature === expectedSignature;
        } catch (error) {
            return false;
        }
    }

    /**
     * Refund payment
     */
    async refundPayment(transactionId, reason = 'User request') {
        try {
            const transaction = this.transactions.get(transactionId);
            if (!transaction) {
                return { success: false, error: 'Transaction not found' };
            }

            if (transaction.status !== 'completed') {
                return { success: false, error: 'Cannot refund non-completed transaction' };
            }

            // Process refund based on payment method
            let refundResult;
            switch (transaction.type) {
                case 'telegram':
                    // Telegram doesn't support automatic refunds
                    refundResult = { success: false, error: 'Manual refund required for Telegram payments' };
                    break;

                case 'telebirr':
                    refundResult = await this.processTelebirrRefund(transaction);
                    break;

                case 'cbe_birr':
                    refundResult = await this.processCBERefund(transaction);
                    break;

                default:
                    refundResult = { success: false, error: 'Unsupported payment method for refund' };
            }

            if (refundResult.success) {
                transaction.status = 'refunded';
                transaction.refundedAt = new Date();
                transaction.refundReason = reason;
                transaction.refundReference = refundResult.refundReference;
            }

            return refundResult;

        } catch (error) {
            console.error('Refund failed:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get transaction details
     */
    getTransaction(transactionId) {
        return this.transactions.get(transactionId) || null;
    }

    /**
     * Get user payment history
     */
    getUserPaymentHistory(userId) {
        return Array.from(this.transactions.values())
            .filter(tx => tx.userId === userId)
            .sort((a, b) => b.createdAt - a.createdAt);
    }

    /**
     * Get payment statistics
     */
    getPaymentStats() {
        const transactions = Array.from(this.transactions.values());
        const now = Date.now();
        const last24h = now - (24 * 60 * 60 * 1000);
        const last30d = now - (30 * 24 * 60 * 60 * 1000);

        return {
            total: {
                count: transactions.length,
                amount: transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0)
            },
            last24h: {
                count: transactions.filter(tx => tx.createdAt.getTime() > last24h).length,
                amount: transactions
                    .filter(tx => tx.createdAt.getTime() > last24h)
                    .reduce((sum, tx) => sum + (tx.amount || 0), 0)
            },
            last30d: {
                count: transactions.filter(tx => tx.createdAt.getTime() > last30d).length,
                amount: transactions
                    .filter(tx => tx.createdAt.getTime() > last30d)
                    .reduce((sum, tx) => sum + (tx.amount || 0), 0)
            },
            byMethod: transactions.reduce((acc, tx) => {
                acc[tx.type] = (acc[tx.type] || 0) + 1;
                return acc;
            }, {}),
            byStatus: transactions.reduce((acc, tx) => {
                acc[tx.status] = (acc[tx.status] || 0) + 1;
                return acc;
            }, {})
        };
    }
}

module.exports = new PaymentService();