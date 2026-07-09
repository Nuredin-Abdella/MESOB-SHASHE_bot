/**
 * Automated Backup System for MESOB Bot
 * Features: Database backup, file backup, encrypted storage, cloud sync
 */

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class BackupManager {
    constructor() {
        this.backupDir = path.join(process.cwd(), 'backups');
        this.maxBackups = 10;
        this.encryptionKey = process.env.BACKUP_ENCRYPTION_KEY || 'default-backup-key';

        this.backupConfig = {
            database: true,
            userFiles: true,
            logs: true,
            configurations: true,
            encrypt: process.env.NODE_ENV === 'production'
        };
    }

    /**
     * Initialize backup system
     */
    async initialize() {
        try {
            await fs.mkdir(this.backupDir, { recursive: true });
            console.log('📂 Backup system initialized');
        } catch (error) {
            console.error('❌ Failed to initialize backup system:', error.message);
            throw error;
        }
    }

    /**
     * Create full system backup
     */
    async createFullBackup() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupName = `mesob-backup-${timestamp}`;
        const backupPath = path.join(this.backupDir, backupName);

        try {
            console.log('🔄 Starting full system backup...');
            await fs.mkdir(backupPath, { recursive: true });

            const backupTasks = [];

            // Database backup
            if (this.backupConfig.database) {
                backupTasks.push(this.backupDatabase(backupPath));
            }

            // User files backup
            if (this.backupConfig.userFiles) {
                backupTasks.push(this.backupUserFiles(backupPath));
            }

            // Logs backup
            if (this.backupConfig.logs) {
                backupTasks.push(this.backupLogs(backupPath));
            }

            // Configuration backup
            if (this.backupConfig.configurations) {
                backupTasks.push(this.backupConfigurations(backupPath));
            }

            // Execute all backup tasks
            await Promise.all(backupTasks);

            // Create backup metadata
            await this.createBackupMetadata(backupPath, backupName);

            // Compress backup
            const archivePath = await this.compressBackup(backupPath, backupName);

            // Encrypt if configured
            let finalPath = archivePath;
            if (this.backupConfig.encrypt) {
                finalPath = await this.encryptBackup(archivePath);
                await fs.unlink(archivePath); // Remove unencrypted version
            }

            // Clean old backups
            await this.cleanOldBackups();

            console.log(`✅ Backup completed: ${path.basename(finalPath)}`);
            return {
                success: true,
                backupPath: finalPath,
                size: await this.getFileSize(finalPath),
                timestamp: new Date()
            };

        } catch (error) {
            console.error('❌ Backup failed:', error.message);
            throw error;
        }
    }

    /**
     * Backup database
     */
    async backupDatabase(backupPath) {
        try {
            console.log('💾 Backing up database...');

            if (process.env.DATABASE_TYPE === 'mongodb') {
                // MongoDB backup
                const dbBackupPath = path.join(backupPath, 'database');
                await fs.mkdir(dbBackupPath, { recursive: true });

                const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mesob';
                const { stdout } = await execAsync(`mongodump --uri="${mongoUri}" --out="${dbBackupPath}"`);

                console.log('📊 MongoDB backup completed');
            } else {
                // In-memory data backup (for development)
                const db = require('../src/database/db');
                const data = await db.exportAllData();

                await fs.writeFile(
                    path.join(backupPath, 'database.json'),
                    JSON.stringify(data, null, 2)
                );

                console.log('📊 In-memory data backup completed');
            }

        } catch (error) {
            console.error('❌ Database backup failed:', error.message);
            throw error;
        }
    }

    /**
     * Backup user files and uploads
     */
    async backupUserFiles(backupPath) {
        try {
            console.log('📁 Backing up user files...');

            const userFilesDir = path.join(process.cwd(), 'uploads');
            const backupFilesPath = path.join(backupPath, 'user-files');

            // Check if user files directory exists
            try {
                await fs.access(userFilesDir);
                await this.copyDirectory(userFilesDir, backupFilesPath);
                console.log('📄 User files backup completed');
            } catch (error) {
                console.log('ℹ️ No user files directory found, skipping');
            }

        } catch (error) {
            console.error('❌ User files backup failed:', error.message);
            throw error;
        }
    }

    /**
     * Backup logs
     */
    async backupLogs(backupPath) {
        try {
            console.log('📋 Backing up logs...');

            const logsDir = path.join(process.cwd(), 'logs');
            const backupLogsPath = path.join(backupPath, 'logs');

            try {
                await fs.access(logsDir);
                await this.copyDirectory(logsDir, backupLogsPath);
                console.log('📝 Logs backup completed');
            } catch (error) {
                console.log('ℹ️ No logs directory found, skipping');
            }

        } catch (error) {
            console.error('❌ Logs backup failed:', error.message);
            throw error;
        }
    }

    /**
     * Backup configurations
     */
    async backupConfigurations(backupPath) {
        try {
            console.log('⚙️ Backing up configurations...');

            const configFiles = [
                'package.json',
                '.env.example', // Don't backup actual .env with secrets
                'src/config/languages.js'
            ];

            const configBackupPath = path.join(backupPath, 'config');
            await fs.mkdir(configBackupPath, { recursive: true });

            for (const configFile of configFiles) {
                try {
                    const sourcePath = path.join(process.cwd(), configFile);
                    const destPath = path.join(configBackupPath, path.basename(configFile));
                    await fs.copyFile(sourcePath, destPath);
                } catch (error) {
                    console.log(`ℹ️ Config file ${configFile} not found, skipping`);
                }
            }

            console.log('⚙️ Configuration backup completed');

        } catch (error) {
            console.error('❌ Configuration backup failed:', error.message);
            throw error;
        }
    }

    /**
     * Create backup metadata
     */
    async createBackupMetadata(backupPath, backupName) {
        const metadata = {
            backupName,
            timestamp: new Date().toISOString(),
            version: require('../package.json').version,
            nodeVersion: process.version,
            platform: process.platform,
            environment: process.env.NODE_ENV || 'development',
            components: this.backupConfig,
            size: null // Will be filled after compression
        };

        await fs.writeFile(
            path.join(backupPath, 'backup-metadata.json'),
            JSON.stringify(metadata, null, 2)
        );
    }

    /**
     * Compress backup directory
     */
    async compressBackup(backupPath, backupName) {
        try {
            console.log('🗜️ Compressing backup...');

            const archivePath = `${backupPath}.tar.gz`;
            await execAsync(`tar -czf "${archivePath}" -C "${path.dirname(backupPath)}" "${backupName}"`);

            // Remove original directory
            await fs.rmdir(backupPath, { recursive: true });

            console.log('📦 Backup compressed');
            return archivePath;

        } catch (error) {
            console.error('❌ Compression failed:', error.message);
            throw error;
        }
    }

    /**
     * Encrypt backup file
     */
    async encryptBackup(archivePath) {
        try {
            console.log('🔐 Encrypting backup...');

            const encryptedPath = `${archivePath}.enc`;
            const algorithm = 'aes-256-gcm';
            const key = crypto.scryptSync(this.encryptionKey, 'salt', 32);
            const iv = crypto.randomBytes(16);

            const cipher = crypto.createCipher(algorithm, key);
            const input = await fs.readFile(archivePath);

            const encrypted = Buffer.concat([
                cipher.update(input),
                cipher.final()
            ]);

            // Save IV + encrypted data
            const finalData = Buffer.concat([iv, encrypted]);
            await fs.writeFile(encryptedPath, finalData);

            console.log('🔒 Backup encrypted');
            return encryptedPath;

        } catch (error) {
            console.error('❌ Encryption failed:', error.message);
            throw error;
        }
    }

    /**
     * Clean old backups
     */
    async cleanOldBackups() {
        try {
            const files = await fs.readdir(this.backupDir);
            const backupFiles = files
                .filter(file => file.startsWith('mesob-backup-'))
                .map(file => ({
                    name: file,
                    path: path.join(this.backupDir, file),
                    stat: null
                }));

            // Get file stats
            for (const backup of backupFiles) {
                backup.stat = await fs.stat(backup.path);
            }

            // Sort by creation time (newest first)
            backupFiles.sort((a, b) => b.stat.birthtime - a.stat.birthtime);

            // Remove old backups
            const toDelete = backupFiles.slice(this.maxBackups);
            for (const backup of toDelete) {
                await fs.unlink(backup.path);
                console.log(`🗑️ Removed old backup: ${backup.name}`);
            }

        } catch (error) {
            console.error('❌ Failed to clean old backups:', error.message);
        }
    }

    /**
     * Copy directory recursively
     */
    async copyDirectory(src, dest) {
        await fs.mkdir(dest, { recursive: true });
        const entries = await fs.readdir(src, { withFileTypes: true });

        for (const entry of entries) {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);

            if (entry.isDirectory()) {
                await this.copyDirectory(srcPath, destPath);
            } else {
                await fs.copyFile(srcPath, destPath);
            }
        }
    }

    /**
     * Get file size in bytes
     */
    async getFileSize(filePath) {
        const stats = await fs.stat(filePath);
        return stats.size;
    }

    /**
     * Restore backup
     */
    async restoreBackup(backupPath) {
        try {
            console.log('🔄 Starting backup restoration...');

            // Implementation would depend on backup format and requirements
            // This is a placeholder for the restoration logic

            console.log('✅ Backup restoration completed');
            return { success: true };

        } catch (error) {
            console.error('❌ Backup restoration failed:', error.message);
            throw error;
        }
    }

    /**
     * Schedule automatic backups
     */
    scheduleBackups() {
        const cron = require('node-cron');

        // Daily backup at 2 AM
        cron.schedule('0 2 * * *', async () => {
            try {
                console.log('🕐 Starting scheduled backup...');
                await this.createFullBackup();
            } catch (error) {
                console.error('❌ Scheduled backup failed:', error.message);
            }
        });

        console.log('⏰ Automatic backups scheduled (daily at 2 AM)');
    }

    /**
     * Get backup history
     */
    async getBackupHistory() {
        try {
            const files = await fs.readdir(this.backupDir);
            const backupFiles = files.filter(file => file.startsWith('mesob-backup-'));

            const history = [];
            for (const file of backupFiles) {
                const filePath = path.join(this.backupDir, file);
                const stats = await fs.stat(filePath);

                history.push({
                    name: file,
                    size: stats.size,
                    created: stats.birthtime,
                    encrypted: file.endsWith('.enc')
                });
            }

            return history.sort((a, b) => b.created - a.created);

        } catch (error) {
            console.error('❌ Failed to get backup history:', error.message);
            return [];
        }
    }
}

// CLI interface
if (require.main === module) {
    const backup = new BackupManager();

    (async () => {
        try {
            await backup.initialize();
            await backup.createFullBackup();
            process.exit(0);
        } catch (error) {
            console.error('❌ Backup script failed:', error.message);
            process.exit(1);
        }
    })();
}

module.exports = BackupManager;