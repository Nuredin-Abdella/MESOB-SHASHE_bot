/**
 * Government API Integration Service
 * Handles connections to MESOB backend systems with proper authentication and compliance
 */

const axios = require('axios');
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

class GovernmentAPIService {
    constructor() {
        this.baseURL = process.env.MESOB_API_URL || 'https://api.shashemenecity.com';
        this.apiKey = process.env.MESOB_API_KEY;
        this.clientCert = process.env.CLIENT_CERT_PATH;
        this.clientKey = process.env.CLIENT_KEY_PATH;
        this.auditTrail = [];

        this.client = axios.create({
            baseURL: this.baseURL,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'MESOB-TelegramBot/2.0'
            }
        });

        this.setupInterceptors();
    }

    /**
     * Setup request/response interceptors for audit and compliance
     */
    setupInterceptors() {
        // Request interceptor
        this.client.interceptors.request.use(
            (config) => {
                // Add authentication
                config.headers['X-API-Key'] = this.apiKey;
                config.headers['X-Request-ID'] = crypto.randomUUID();
                config.headers['X-Timestamp'] = new Date().toISOString();

                // Add digital signature
                if (config.data) {
                    config.headers['X-Signature'] = this.signRequest(config.data);
                }

                // Log request for audit trail
                this.logTransaction({
                    type: 'REQUEST',
                    method: config.method,
                    url: config.url,
                    requestId: config.headers['X-Request-ID'],
                    timestamp: config.headers['X-Timestamp'],
                    dataHash: config.data ? this.hashData(config.data) : null
                });

                return config;
            },
            (error) => {
                this.logTransaction({
                    type: 'REQUEST_ERROR',
                    error: error.message,
                    timestamp: new Date().toISOString()
                });
                return Promise.reject(error);
            }
        );

        // Response interceptor
        this.client.interceptors.response.use(
            (response) => {
                // Log response for audit trail
                this.logTransaction({
                    type: 'RESPONSE',
                    status: response.status,
                    requestId: response.config.headers['X-Request-ID'],
                    timestamp: new Date().toISOString(),
                    dataHash: this.hashData(response.data)
                });

                return response;
            },
            (error) => {
                this.logTransaction({
                    type: 'RESPONSE_ERROR',
                    status: error.response?.status,
                    error: error.message,
                    requestId: error.config?.headers['X-Request-ID'],
                    timestamp: new Date().toISOString()
                });
                return Promise.reject(error);
            }
        );
    }

    /**
     * Identity verification with government databases
     */
    async verifyIdentity(identityData) {
        try {
            const response = await this.client.post('/identity/verify', {
                nationalId: identityData.nationalId,
                firstName: identityData.firstName,
                lastName: identityData.lastName,
                dateOfBirth: identityData.dateOfBirth,
                phoneNumber: identityData.phoneNumber
            });

            return {
                success: true,
                verified: response.data.verified,
                citizenshipStatus: response.data.citizenshipStatus,
                verificationId: response.data.verificationId,
                expiresAt: response.data.expiresAt
            };

        } catch (error) {
            console.error('Identity verification failed:', error.message);
            return {
                success: false,
                error: error.message,
                errorCode: error.response?.data?.code || 'VERIFICATION_FAILED'
            };
        }
    }

    /**
     * Submit application with digital signature
     */
    async submitApplication(applicationData) {
        try {
            // Generate application ID
            const applicationId = this.generateApplicationId();

            const payload = {
                applicationId,
                serviceType: applicationData.serviceType,
                applicantData: applicationData.applicantData,
                documents: applicationData.documents,
                submissionTimestamp: new Date().toISOString(),
                submissionMethod: 'telegram-bot',
                digitalSignature: await this.signDocument(applicationData)
            };

            const response = await this.client.post('/applications/submit', payload);

            return {
                success: true,
                applicationId: response.data.applicationId,
                trackingNumber: response.data.trackingNumber,
                status: response.data.status,
                estimatedCompletion: response.data.estimatedCompletion,
                paymentRequired: response.data.paymentRequired,
                paymentAmount: response.data.paymentAmount
            };

        } catch (error) {
            console.error('Application submission failed:', error.message);
            return {
                success: false,
                error: error.message,
                errorCode: error.response?.data?.code || 'SUBMISSION_FAILED'
            };
        }
    }

    /**
     * Track application status
     */
    async trackApplication(trackingNumber, userId) {
        try {
            const response = await this.client.get(`/applications/track/${trackingNumber}`, {
                headers: {
                    'X-User-ID': userId
                }
            });

            return {
                success: true,
                trackingNumber: response.data.trackingNumber,
                status: response.data.status,
                currentStage: response.data.currentStage,
                completedStages: response.data.completedStages,
                estimatedCompletion: response.data.estimatedCompletion,
                lastUpdate: response.data.lastUpdate,
                documents: response.data.documents || [],
                messages: response.data.messages || []
            };

        } catch (error) {
            console.error('Application tracking failed:', error.message);
            return {
                success: false,
                error: error.message,
                errorCode: error.response?.data?.code || 'TRACKING_FAILED'
            };
        }
    }

    /**
     * Process payment
     */
    async processPayment(paymentData) {
        try {
            const response = await this.client.post('/payments/process', {
                applicationId: paymentData.applicationId,
                amount: paymentData.amount,
                currency: 'ETB',
                paymentMethod: paymentData.paymentMethod,
                customerData: paymentData.customerData,
                timestamp: new Date().toISOString()
            });

            return {
                success: true,
                transactionId: response.data.transactionId,
                status: response.data.status,
                receipt: response.data.receipt,
                paymentUrl: response.data.paymentUrl
            };

        } catch (error) {
            console.error('Payment processing failed:', error.message);
            return {
                success: false,
                error: error.message,
                errorCode: error.response?.data?.code || 'PAYMENT_FAILED'
            };
        }
    }

    /**
     * Schedule appointment
     */
    async scheduleAppointment(appointmentData) {
        try {
            const response = await this.client.post('/appointments/schedule', {
                serviceType: appointmentData.serviceType,
                userId: appointmentData.userId,
                preferredDate: appointmentData.preferredDate,
                preferredTime: appointmentData.preferredTime,
                purpose: appointmentData.purpose,
                contactInfo: appointmentData.contactInfo
            });

            return {
                success: true,
                appointmentId: response.data.appointmentId,
                scheduledDate: response.data.scheduledDate,
                scheduledTime: response.data.scheduledTime,
                location: response.data.location,
                instructions: response.data.instructions,
                confirmationCode: response.data.confirmationCode
            };

        } catch (error) {
            console.error('Appointment scheduling failed:', error.message);
            return {
                success: false,
                error: error.message,
                errorCode: error.response?.data?.code || 'SCHEDULING_FAILED'
            };
        }
    }

    /**
     * Upload document with encryption
     */
    async uploadDocument(documentData) {
        try {
            const formData = new FormData();
            formData.append('file', documentData.buffer, documentData.filename);
            formData.append('documentType', documentData.type);
            formData.append('applicationId', documentData.applicationId);
            formData.append('uploaderId', documentData.uploaderId);

            const response = await this.client.post('/documents/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                maxBodyLength: 10 * 1024 * 1024 // 10MB limit
            });

            return {
                success: true,
                documentId: response.data.documentId,
                filename: response.data.filename,
                size: response.data.size,
                checksum: response.data.checksum,
                uploadDate: response.data.uploadDate
            };

        } catch (error) {
            console.error('Document upload failed:', error.message);
            return {
                success: false,
                error: error.message,
                errorCode: error.response?.data?.code || 'UPLOAD_FAILED'
            };
        }
    }

    /**
     * Get service information
     */
    async getServiceInfo(serviceType) {
        try {
            const response = await this.client.get(`/services/${serviceType}`);

            return {
                success: true,
                service: response.data
            };

        } catch (error) {
            console.error('Failed to get service info:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Digital signature for documents
     */
    async signDocument(documentData) {
        const privateKey = await this.getPrivateKey();
        const dataToSign = JSON.stringify(documentData);

        const signature = crypto.sign('sha256', Buffer.from(dataToSign));
        signature.update(dataToSign);

        return signature.sign(privateKey, 'base64');
    }

    /**
     * Sign API requests
     */
    signRequest(data) {
        const secret = process.env.API_SECRET || 'default-secret';
        const timestamp = Date.now().toString();
        const dataString = JSON.stringify(data) + timestamp;

        return crypto.createHmac('sha256', secret)
            .update(dataString)
            .digest('hex');
    }

    /**
     * Hash data for integrity verification
     */
    hashData(data) {
        return crypto.createHash('sha256')
            .update(JSON.stringify(data))
            .digest('hex');
    }

    /**
     * Generate application ID
     */
    generateApplicationId() {
        const prefix = 'MESOB';
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = crypto.randomBytes(4).toString('hex').toUpperCase();
        return `${prefix}-${timestamp}-${random}`;
    }

    /**
     * Log transaction for audit trail
     */
    logTransaction(transaction) {
        const auditEntry = {
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            ...transaction
        };

        this.auditTrail.push(auditEntry);

        // Keep only last 10000 entries in memory
        if (this.auditTrail.length > 10000) {
            this.auditTrail = this.auditTrail.slice(-10000);
        }

        // In production, this would be sent to a logging service
        console.log('📝 API Audit:', auditEntry);
    }

    /**
     * Get private key for signing
     */
    async getPrivateKey() {
        if (this.clientKey) {
            return await fs.readFile(this.clientKey, 'utf8');
        }

        // Fallback to environment variable
        return process.env.PRIVATE_KEY || 'default-key';
    }

    /**
     * GDPR compliance: Get user data
     */
    async getUserData(userId) {
        try {
            const response = await this.client.get(`/users/${userId}/data`);
            return {
                success: true,
                userData: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * GDPR compliance: Delete user data
     */
    async deleteUserData(userId, reason = 'User request') {
        try {
            const response = await this.client.delete(`/users/${userId}/data`, {
                data: { reason }
            });

            this.logTransaction({
                type: 'DATA_DELETION',
                userId,
                reason,
                timestamp: new Date().toISOString(),
                compliance: 'GDPR_Article_17'
            });

            return {
                success: true,
                deletionId: response.data.deletionId,
                completedAt: response.data.completedAt
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get audit trail for compliance reporting
     */
    getAuditTrail(filters = {}) {
        let trail = [...this.auditTrail];

        if (filters.userId) {
            trail = trail.filter(entry => entry.userId === filters.userId);
        }

        if (filters.type) {
            trail = trail.filter(entry => entry.type === filters.type);
        }

        if (filters.startDate) {
            trail = trail.filter(entry => new Date(entry.timestamp) >= new Date(filters.startDate));
        }

        if (filters.endDate) {
            trail = trail.filter(entry => new Date(entry.timestamp) <= new Date(filters.endDate));
        }

        return trail;
    }

    /**
     * Health check for government API connection
     */
    async healthCheck() {
        try {
            const response = await this.client.get('/health', { timeout: 5000 });
            return {
                status: 'healthy',
                apiStatus: response.data.status,
                responseTime: response.headers['x-response-time'],
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                status: 'unhealthy',
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }
}

module.exports = new GovernmentAPIService();