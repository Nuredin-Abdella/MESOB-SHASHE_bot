/**
 * SMS Verification Service
 * Handles phone number verification for user registration
 */

const crypto = require('crypto');

class SMSService {
    constructor() {
        this.verificationCodes = new Map();
        this.codeExpiry = 5 * 60 * 1000; // 5 minutes
    }

    /**
     * Generate a 6-digit verification code
     */
    generateVerificationCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    /**
     * Store verification code
     */
    storeCode(chatId, phoneNumber, code) {
        this.verificationCodes.set(chatId, {
            phoneNumber,
            code,
            expiresAt: Date.now() + this.codeExpiry
        });
    }

    /**
     * Verify code
     */
    verifyCode(chatId, code) {
        const stored = this.verificationCodes.get(chatId);
        
        if (!stored) {
            return { success: false, message: 'No verification code found' };
        }

        if (Date.now() > stored.expiresAt) {
            this.verificationCodes.delete(chatId);
            return { success: false, message: 'Code expired' };
        }

        if (stored.code !== code) {
            return { success: false, message: 'Invalid code' };
        }

        const phoneNumber = stored.phoneNumber;
        this.verificationCodes.delete(chatId);
        
        return { success: true, phoneNumber };
    }

    /**
     * Send verification code (mock implementation)
     * In production, integrate with SMS gateway like Twilio, AWS SNS, or local provider
     */
    async sendVerificationCode(phoneNumber, code) {
        console.log(`📱 SMS Verification Code for ${phoneNumber}: ${code}`);
        
        // TODO: Integrate with actual SMS service
        // Example with Twilio:
        // const twilio = require('twilio');
        // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        // await client.messages.create({
        //     body: `Your MESOB verification code is: ${code}`,
        //     from: process.env.TWILIO_PHONE_NUMBER,
        //     to: phoneNumber
        // });

        return { success: true, message: 'Code sent successfully' };
    }

    /**
     * Format phone number to Ethiopian format
     */
    formatPhoneNumber(phoneNumber) {
        // Remove all non-digit characters
        let cleaned = phoneNumber.replace(/\D/g, '');
        
        // Add country code if missing
        if (cleaned.startsWith('0')) {
            cleaned = '251' + cleaned.substring(1);
        }
        
        if (!cleaned.startsWith('251')) {
            cleaned = '251' + cleaned;
        }
        
        return '+' + cleaned;
    }

    /**
     * Validate phone number
     */
    validatePhoneNumber(phoneNumber) {
        const cleaned = phoneNumber.replace(/\D/g, '');
        
        // Ethiopian phone numbers: 251 followed by 9 digits
        const ethiopianPhoneRegex = /^251[9]\d{8}$/;
        
        return ethiopianPhoneRegex.test(cleaned);
    }

    /**
     * Clean up expired codes
     */
    cleanupExpiredCodes() {
        const now = Date.now();
        for (const [chatId, data] of this.verificationCodes.entries()) {
            if (now > data.expiresAt) {
                this.verificationCodes.delete(chatId);
            }
        }
    }
}

module.exports = new SMSService();
