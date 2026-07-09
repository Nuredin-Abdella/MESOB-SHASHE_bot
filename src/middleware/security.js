/**
 * Security Middleware for MESOB Bot
 * Implements rate limiting, input validation, and security measures
 */

const crypto = require('crypto');

class SecurityMiddleware {
    constructor() {
        this.rateLimits = new Map(); // chatId -> { count, resetTime }
        this.blockedUsers = new Set();
        this.auditLog = [];

        // Rate limiting configuration
        this.RATE_LIMIT = {
            messages: 20, // messages per window
            window: 60000, // 1 minute
            blockDuration: 300000 // 5 minutes
        };

        // Clean up expired rate limits every 5 minutes
        setInterval(() => this.cleanupRateLimits(), 300000);
    }

    /**
     * Rate limiting middleware
     */
    rateLimit(chatId, userId) {
        const now = Date.now();
        const key = `${chatId}_${userId}`;

        if (this.blockedUsers.has(key)) {
            return { allowed: false, reason: 'User temporarily blocked due to spam' };
        }

        const userLimit = this.rateLimits.get(key);

        if (!userLimit || now > userLimit.resetTime) {
            // Reset or create new limit window
            this.rateLimits.set(key, {
                count: 1,
                resetTime: now + this.RATE_LIMIT.window
            });
            return { allowed: true };
        }

        if (userLimit.count >= this.RATE_LIMIT.messages) {
            // Block user temporarily
            this.blockedUsers.add(key);
            setTimeout(() => {
                this.blockedUsers.delete(key);
            }, this.RATE_LIMIT.blockDuration);

            this.logSecurityEvent({
                type: 'RATE_LIMIT_EXCEEDED',
                chatId,
                userId,
                timestamp: now
            });

            return { allowed: false, reason: 'Rate limit exceeded. Please try again later.' };
        }

        // Increment count
        userLimit.count++;
        return { allowed: true };
    }

    /**
     * Input validation and sanitization
     */
    validateInput(text, type = 'general') {
        if (!text || typeof text !== 'string') {
            return { valid: false, error: 'Invalid input format' };
        }

        // Basic XSS protection
        const dangerousPatterns = [
            /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            /javascript:/gi,
            /on\w+\s*=/gi,
            /data:text\/html/gi
        ];

        for (const pattern of dangerousPatterns) {
            if (pattern.test(text)) {
                return { valid: false, error: 'Potentially malicious content detected' };
            }
        }

        // Type-specific validation
        switch (type) {
            case 'tracking_number':
                if (!/^[A-Z0-9]{6,20}$/i.test(text)) {
                    return { valid: false, error: 'Invalid tracking number format' };
                }
                break;

            case 'phone':
                if (!/^\+?[\d\s\-\(\)]{7,15}$/i.test(text)) {
                    return { valid: false, error: 'Invalid phone number format' };
                }
                break;

            case 'email':
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(text)) {
                    return { valid: false, error: 'Invalid email format' };
                }
                break;

            case 'general':
                if (text.length > 1000) {
                    return { valid: false, error: 'Message too long' };
                }
                break;
        }

        return { valid: true, sanitized: text.trim() };
    }

    /**
     * User authentication token generation
     */
    generateUserToken(chatId, userId) {
        const payload = {
            chatId,
            userId,
            timestamp: Date.now(),
            expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        };

        const token = Buffer.from(JSON.stringify(payload)).toString('base64');
        return token;
    }

    /**
     * Verify user token
     */
    verifyUserToken(token) {
        try {
            const payload = JSON.parse(Buffer.from(token, 'base64').toString());

            if (Date.now() > payload.expires) {
                return { valid: false, error: 'Token expired' };
            }

            return { valid: true, payload };
        } catch (error) {
            return { valid: false, error: 'Invalid token' };
        }
    }

    /**
     * Log security events
     */
    logSecurityEvent(event) {
        const logEntry = {
            ...event,
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString()
        };

        this.auditLog.push(logEntry);

        // Keep only last 1000 events in memory
        if (this.auditLog.length > 1000) {
            this.auditLog.shift();
        }

        // Log to console for monitoring
        console.log(`🔒 Security Event:`, logEntry);
    }

    /**
     * Clean up expired rate limits
     */
    cleanupRateLimits() {
        const now = Date.now();
        for (const [key, limit] of this.rateLimits.entries()) {
            if (now > limit.resetTime) {
                this.rateLimits.delete(key);
            }
        }
    }

    /**
     * Get security statistics
     */
    getSecurityStats() {
        return {
            activeRateLimits: this.rateLimits.size,
            blockedUsers: this.blockedUsers.size,
            auditLogEntries: this.auditLog.length,
            recentEvents: this.auditLog.slice(-10)
        };
    }

    /**
     * Data encryption utilities
     */
    encryptData(data, key = process.env.ENCRYPTION_KEY || 'default-key') {
        const cipher = crypto.createCipher('aes192', key);
        let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }

    decryptData(encryptedData, key = process.env.ENCRYPTION_KEY || 'default-key') {
        try {
            const decipher = crypto.createDecipher('aes192', key);
            let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return JSON.parse(decrypted);
        } catch (error) {
            return null;
        }
    }
}

module.exports = new SecurityMiddleware();