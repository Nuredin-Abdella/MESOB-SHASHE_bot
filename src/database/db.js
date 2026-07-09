/**
 * Database Layer for MESOB Bot
 * Handles MongoDB connections and data operations
 */

const { MongoClient } = require('mongodb');
const security = require('../middleware/security');

class DatabaseManager {
    constructor() {
        this.client = null;
        this.db = null;
        this.collections = {};
        this.isConnected = false;

        // MongoDB connection URL (fallback to in-memory if not provided)
        this.mongoUrl = process.env.MONGODB_URL || null;

        // In-memory fallback storage
        this.memoryStorage = {
            users: new Map(),
            sessions: new Map(),
            applications: new Map(),
            auditLogs: [],
            analytics: new Map()
        };
    }

    /**
     * Initialize database connection
     */
    async initialize() {
        if (this.mongoUrl) {
            try {
                console.log('🔗 Connecting to MongoDB...');
                this.client = new MongoClient(this.mongoUrl);
                await this.client.connect();

                this.db = this.client.db('mesob_bot');
                this.collections = {
                    users: this.db.collection('users'),
                    sessions: this.db.collection('sessions'),
                    applications: this.db.collection('applications'),
                    auditLogs: this.db.collection('audit_logs'),
                    analytics: this.db.collection('analytics')
                };

                // Create indexes for better performance
                await this.createIndexes();

                this.isConnected = true;
                console.log('✅ MongoDB connected successfully');
                return true;
            } catch (error) {
                console.error('❌ MongoDB connection failed:', error.message);
                console.log('📝 Using in-memory storage fallback');
                return false;
            }
        } else {
            console.log('📝 No MongoDB URL provided, using in-memory storage');
            return false;
        }
    }

    /**
     * Create database indexes
     */
    async createIndexes() {
        try {
            await this.collections.users.createIndex({ chatId: 1 }, { unique: true });
            await this.collections.users.createIndex({ userId: 1 });
            await this.collections.sessions.createIndex({ chatId: 1 });
            await this.collections.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 86400 }); // 24 hours
            await this.collections.applications.createIndex({ trackingNumber: 1 }, { unique: true });
            await this.collections.applications.createIndex({ chatId: 1 });
            await this.collections.auditLogs.createIndex({ timestamp: 1 });
            await this.collections.analytics.createIndex({ date: 1 });
        } catch (error) {
            console.error('❌ Failed to create indexes:', error.message);
        }
    }

    /**
     * User management
     */
    async saveUser(userData) {
        const encryptedData = {
            ...userData,
            personalInfo: security.encryptData(userData.personalInfo || {}),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        if (this.isConnected) {
            try {
                await this.collections.users.replaceOne(
                    { chatId: userData.chatId },
                    encryptedData,
                    { upsert: true }
                );
                return true;
            } catch (error) {
                console.error('❌ Failed to save user to MongoDB:', error.message);
            }
        }

        // Fallback to memory storage
        this.memoryStorage.users.set(userData.chatId.toString(), encryptedData);
        return true;
    }

    async getUser(chatId) {
        if (this.isConnected) {
            try {
                const user = await this.collections.users.findOne({ chatId });
                if (user && user.personalInfo) {
                    user.personalInfo = security.decryptData(user.personalInfo);
                }
                return user;
            } catch (error) {
                console.error('❌ Failed to get user from MongoDB:', error.message);
            }
        }

        // Fallback to memory storage
        const user = this.memoryStorage.users.get(chatId.toString());
        if (user && user.personalInfo) {
            user.personalInfo = security.decryptData(user.personalInfo);
        }
        return user;
    }

    async getUserByPhoneNumber(phoneNumber) {
        if (this.isConnected) {
            try {
                const user = await this.collections.users.findOne({ 
                    'personalInfo.phoneNumber': phoneNumber 
                });
                if (user && user.personalInfo) {
                    user.personalInfo = security.decryptData(user.personalInfo);
                }
                return user;
            } catch (error) {
                console.error('❌ Failed to get user by phone from MongoDB:', error.message);
            }
        }

        // Fallback to memory storage
        for (const [chatId, userData] of this.memoryStorage.users.entries()) {
            if (userData.personalInfo && userData.personalInfo.phoneNumber === phoneNumber) {
                if (userData.personalInfo) {
                    userData.personalInfo = security.decryptData(userData.personalInfo);
                }
                return userData;
            }
        }
        return null;
    }

    async updateUserPhoneVerification(chatId, phoneNumber, isVerified = false) {
        if (this.isConnected) {
            try {
                const user = await this.collections.users.findOne({ chatId });
                if (user) {
                    const personalInfo = user.personalInfo ? security.decryptData(user.personalInfo) : {};
                    personalInfo.phoneNumber = phoneNumber;
                    personalInfo.phoneVerified = isVerified;
                    
                    await this.collections.users.updateOne(
                        { chatId },
                        { 
                            $set: { 
                                personalInfo: security.encryptData(personalInfo),
                                updatedAt: new Date()
                            }
                        }
                    );
                    return true;
                }
            } catch (error) {
                console.error('❌ Failed to update user phone verification:', error.message);
            }
        }

        // Fallback to memory storage
        const user = this.memoryStorage.users.get(chatId.toString());
        if (user) {
            if (!user.personalInfo) user.personalInfo = {};
            user.personalInfo.phoneNumber = phoneNumber;
            user.personalInfo.phoneVerified = isVerified;
            user.personalInfo = security.encryptData(user.personalInfo);
            user.updatedAt = new Date();
        }
        return true;
    }

    /**
     * Application tracking
     */
    async createApplication(applicationData) {
        const trackingNumber = this.generateTrackingNumber();
        const application = {
            trackingNumber,
            ...applicationData,
            status: 'submitted',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        if (this.isConnected) {
            try {
                await this.collections.applications.insertOne(application);
            } catch (error) {
                console.error('❌ Failed to save application to MongoDB:', error.message);
            }
        }

        // Fallback to memory storage
        this.memoryStorage.applications.set(trackingNumber, application);
        return trackingNumber;
    }

    async getApplication(trackingNumber) {
        if (this.isConnected) {
            try {
                return await this.collections.applications.findOne({ trackingNumber });
            } catch (error) {
                console.error('❌ Failed to get application from MongoDB:', error.message);
            }
        }

        // Fallback to memory storage
        return this.memoryStorage.applications.get(trackingNumber);
    }

    async updateApplicationStatus(trackingNumber, status, notes = '') {
        const updateData = {
            status,
            notes,
            updatedAt: new Date()
        };

        if (this.isConnected) {
            try {
                await this.collections.applications.updateOne(
                    { trackingNumber },
                    { $set: updateData }
                );
            } catch (error) {
                console.error('❌ Failed to update application in MongoDB:', error.message);
            }
        }

        // Fallback to memory storage
        const application = this.memoryStorage.applications.get(trackingNumber);
        if (application) {
            Object.assign(application, updateData);
        }
    }

    async getApplicationsByChatId(chatId) {
        if (this.isConnected) {
            try {
                return await this.collections.applications.find({ chatId }).toArray();
            } catch (error) {
                console.error('❌ Failed to get applications from MongoDB:', error.message);
            }
        }

        // Fallback to memory storage
        return Array.from(this.memoryStorage.applications.values())
            .filter(app => app.chatId === chatId);
    }

    /**
     * Audit logging
     */
    async logActivity(activityData) {
        const logEntry = {
            ...activityData,
            timestamp: new Date(),
            id: require('crypto').randomUUID()
        };

        if (this.isConnected) {
            try {
                await this.collections.auditLogs.insertOne(logEntry);
            } catch (error) {
                console.error('❌ Failed to save audit log to MongoDB:', error.message);
            }
        }

        // Fallback to memory storage
        this.memoryStorage.auditLogs.push(logEntry);

        // Keep only last 1000 entries in memory
        if (this.memoryStorage.auditLogs.length > 1000) {
            this.memoryStorage.auditLogs.shift();
        }
    }

    /**
     * Analytics tracking
     */
    async trackAnalytics(event, data) {
        const today = new Date().toISOString().split('T')[0];
        const analyticsData = {
            date: today,
            event,
            data,
            timestamp: new Date()
        };

        if (this.isConnected) {
            try {
                await this.collections.analytics.updateOne(
                    { date: today, event },
                    {
                        $inc: { count: 1 },
                        $push: { data: { $each: [data], $slice: -100 } }
                    },
                    { upsert: true }
                );
            } catch (error) {
                console.error('❌ Failed to save analytics to MongoDB:', error.message);
            }
        }

        // Fallback to memory storage
        const key = `${today}_${event}`;
        const existing = this.memoryStorage.analytics.get(key) || { count: 0, data: [] };
        existing.count++;
        existing.data.push(data);
        this.memoryStorage.analytics.set(key, existing);
    }

    /**
     * Generate unique tracking number
     */
    generateTrackingNumber() {
        const prefix = 'MESOB';
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substr(2, 4).toUpperCase();
        return `${prefix}${timestamp}${random}`;
    }

    /**
     * Get database statistics
     */
    async getStats() {
        const stats = {
            connected: this.isConnected,
            storage: this.isConnected ? 'MongoDB' : 'Memory'
        };

        if (this.isConnected) {
            try {
                stats.users = await this.collections.users.countDocuments();
                stats.applications = await this.collections.applications.countDocuments();
                stats.auditLogs = await this.collections.auditLogs.countDocuments();
            } catch (error) {
                stats.error = error.message;
            }
        } else {
            stats.users = this.memoryStorage.users.size;
            stats.applications = this.memoryStorage.applications.size;
            stats.auditLogs = this.memoryStorage.auditLogs.length;
        }

        return stats;
    }

    /**
     * Backup data
     */
    async backupData() {
        if (!this.isConnected) {
            return {
                users: Array.from(this.memoryStorage.users.entries()),
                applications: Array.from(this.memoryStorage.applications.entries()),
                auditLogs: this.memoryStorage.auditLogs,
                analytics: Array.from(this.memoryStorage.analytics.entries()),
                timestamp: new Date().toISOString()
            };
        }

        try {
            const backup = {
                users: await this.collections.users.find({}).toArray(),
                applications: await this.collections.applications.find({}).toArray(),
                auditLogs: await this.collections.auditLogs.find({}).limit(1000).toArray(),
                analytics: await this.collections.analytics.find({}).toArray(),
                timestamp: new Date().toISOString()
            };
            return backup;
        } catch (error) {
            console.error('❌ Backup failed:', error.message);
            return null;
        }
    }

    /**
     * Health check
     */
    async healthCheck() {
        const health = {
            database: 'unknown',
            timestamp: new Date().toISOString()
        };

        if (this.isConnected) {
            try {
                await this.db.admin().ping();
                health.database = 'healthy';
            } catch (error) {
                health.database = 'unhealthy';
                health.error = error.message;
            }
        } else {
            health.database = 'memory_fallback';
        }

        return health;
    }

    /**
     * Graceful shutdown
     */
    async close() {
        if (this.client) {
            await this.client.close();
            console.log('✅ Database connection closed');
        }
    }
}

module.exports = new DatabaseManager();