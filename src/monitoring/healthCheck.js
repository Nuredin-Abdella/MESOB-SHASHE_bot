/**
 * Health Check and Monitoring System for MESOB Bot
 */

const db = require('../database/db');
const security = require('../middleware/security');

class HealthMonitor {
    constructor() {
        this.checks = new Map();
        this.alerts = [];
        this.metrics = {
            uptime: process.hrtime(),
            requests: 0,
            errors: 0,
            users: 0,
            memory: process.memoryUsage(),
            cpu: process.cpuUsage()
        };

        // Start monitoring
        this.startMonitoring();
    }

    /**
     * Start the monitoring system
     */
    startMonitoring() {
        // Update metrics every 30 seconds
        setInterval(() => {
            this.updateMetrics();
        }, 30000);

        // Run health checks every 2 minutes
        setInterval(() => {
            this.runHealthChecks();
        }, 120000);

        // Clean old alerts every hour
        setInterval(() => {
            this.cleanOldAlerts();
        }, 3600000);

        console.log('📊 Health monitoring system started');
    }

    /**
     * Update system metrics
     */
    updateMetrics() {
        this.metrics = {
            ...this.metrics,
            memory: process.memoryUsage(),
            cpu: process.cpuUsage(),
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Record a request
     */
    recordRequest(success = true) {
        this.metrics.requests++;
        if (!success) {
            this.metrics.errors++;
        }
    }

    /**
     * Record a new user
     */
    recordUser() {
        this.metrics.users++;
    }

    /**
     * Run all health checks
     */
    async runHealthChecks() {
        const checks = {
            database: await this.checkDatabase(),
            memory: this.checkMemory(),
            security: this.checkSecurity(),
            api: await this.checkTelegramAPI(),
            disk: this.checkDiskSpace(),
            network: await this.checkNetworkConnectivity()
        };

        this.checks.set(Date.now(), checks);

        // Keep only last 50 checks
        if (this.checks.size > 50) {
            const oldestKey = Math.min(...this.checks.keys());
            this.checks.delete(oldestKey);
        }

        // Check for alerts
        this.checkForAlerts(checks);

        return checks;
    }

    /**
     * Check database health
     */
    async checkDatabase() {
        try {
            const health = await db.healthCheck();
            return {
                status: health.database === 'healthy' ? 'ok' : 'warning',
                message: health.database,
                timestamp: health.timestamp
            };
        } catch (error) {
            return {
                status: 'error',
                message: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Check memory usage
     */
    checkMemory() {
        const memory = process.memoryUsage();
        const heapUsedMB = Math.round(memory.heapUsed / 1024 / 1024);
        const heapTotalMB = Math.round(memory.heapTotal / 1024 / 1024);
        const usage = (heapUsedMB / heapTotalMB) * 100;

        let status = 'ok';
        if (usage > 90) status = 'critical';
        else if (usage > 75) status = 'warning';

        return {
            status,
            message: `Memory usage: ${heapUsedMB}MB / ${heapTotalMB}MB (${usage.toFixed(1)}%)`,
            usage: usage,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Check security status
     */
    checkSecurity() {
        const stats = security.getSecurityStats();
        let status = 'ok';

        if (stats.blockedUsers > 10) status = 'warning';
        if (stats.blockedUsers > 50) status = 'critical';

        return {
            status,
            message: `Security: ${stats.blockedUsers} blocked users, ${stats.auditLogEntries} log entries`,
            stats,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Check Telegram API connectivity
     */
    async checkTelegramAPI() {
        try {
            const start = Date.now();
            const response = await fetch('https://api.telegram.org/bot' + process.env.BOT_TOKEN + '/getMe');
            const latency = Date.now() - start;

            if (response.ok) {
                const data = await response.json();
                return {
                    status: 'ok',
                    message: `Telegram API: Connected (${latency}ms)`,
                    latency,
                    botInfo: data.result,
                    timestamp: new Date().toISOString()
                };
            } else {
                return {
                    status: 'error',
                    message: `Telegram API: HTTP ${response.status}`,
                    timestamp: new Date().toISOString()
                };
            }
        } catch (error) {
            return {
                status: 'error',
                message: `Telegram API: ${error.message}`,
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Check disk space
     */
    checkDiskSpace() {
        try {
            const { execSync } = require('child_process');
            const output = execSync('df -h /', { encoding: 'utf8' });
            const lines = output.trim().split('\n');

            if (lines.length >= 2) {
                const parts = lines[1].split(/\s+/);
                const usage = parseInt(parts[4]);

                let status = 'ok';
                if (usage > 90) status = 'critical';
                else if (usage > 80) status = 'warning';

                return {
                    status,
                    message: `Disk usage: ${usage}%`,
                    usage,
                    timestamp: new Date().toISOString()
                };
            }
        } catch (error) {
            return {
                status: 'error',
                message: `Disk check failed: ${error.message}`,
                timestamp: new Date().toISOString()
            };
        }

        return {
            status: 'unknown',
            message: 'Could not determine disk usage',
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Check network connectivity
     */
    async checkNetworkConnectivity() {
        try {
            const start = Date.now();
            await fetch('https://api.telegram.org', { method: 'HEAD' });
            const latency = Date.now() - start;

            return {
                status: 'ok',
                message: `Network: Connected (${latency}ms)`,
                latency,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                status: 'error',
                message: `Network: ${error.message}`,
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Check for alerts based on health check results
     */
    checkForAlerts(checks) {
        const criticalChecks = Object.entries(checks).filter(([_, check]) => check.status === 'critical');
        const warningChecks = Object.entries(checks).filter(([_, check]) => check.status === 'warning');

        if (criticalChecks.length > 0) {
            this.createAlert('critical', `Critical issues detected: ${criticalChecks.map(([name]) => name).join(', ')}`);
        }

        if (warningChecks.length > 2) {
            this.createAlert('warning', `Multiple warnings: ${warningChecks.map(([name]) => name).join(', ')}`);
        }
    }

    /**
     * Create an alert
     */
    createAlert(level, message) {
        const alert = {
            id: require('crypto').randomUUID(),
            level,
            message,
            timestamp: new Date().toISOString(),
            acknowledged: false
        };

        this.alerts.push(alert);
        console.log(`🚨 ${level.toUpperCase()} ALERT: ${message}`);

        // Log to database if available
        db.logActivity({
            type: 'ALERT',
            level,
            message,
            source: 'health_monitor'
        });
    }

    /**
     * Get current health status
     */
    async getHealthStatus() {
        const latestChecks = await this.runHealthChecks();
        const uptime = process.hrtime(this.metrics.uptime);
        const uptimeSeconds = uptime[0];

        const overallStatus = this.calculateOverallStatus(latestChecks);

        return {
            status: overallStatus,
            uptime: {
                seconds: uptimeSeconds,
                human: this.formatUptime(uptimeSeconds)
            },
            checks: latestChecks,
            metrics: this.metrics,
            alerts: this.alerts.filter(alert => !alert.acknowledged).length,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Calculate overall system status
     */
    calculateOverallStatus(checks) {
        const statuses = Object.values(checks).map(check => check.status);

        if (statuses.includes('critical')) return 'critical';
        if (statuses.includes('error')) return 'error';
        if (statuses.includes('warning')) return 'warning';
        return 'ok';
    }

    /**
     * Format uptime in human readable format
     */
    formatUptime(seconds) {
        const days = Math.floor(seconds / (24 * 60 * 60));
        const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((seconds % (60 * 60)) / 60);

        return `${days}d ${hours}h ${minutes}m`;
    }

    /**
     * Clean old alerts
     */
    cleanOldAlerts() {
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        this.alerts = this.alerts.filter(alert => new Date(alert.timestamp) > oneDayAgo);
    }

    /**
     * Get metrics for monitoring dashboard
     */
    getMetrics() {
        return {
            ...this.metrics,
            uptime: process.hrtime(this.metrics.uptime)[0],
            errorRate: this.metrics.requests > 0 ? (this.metrics.errors / this.metrics.requests) * 100 : 0,
            memoryUsageMB: Math.round(this.metrics.memory.heapUsed / 1024 / 1024),
            alerts: this.alerts.length
        };
    }

    /**
     * Create health check endpoint response
     */
    async createHealthResponse() {
        const health = await this.getHealthStatus();

        return {
            status: health.status,
            service: 'MESOB Telegram Bot',
            version: process.env.npm_package_version || '1.0.0',
            timestamp: health.timestamp,
            uptime: health.uptime.human,
            checks: Object.keys(health.checks).reduce((acc, key) => {
                acc[key] = health.checks[key].status;
                return acc;
            }, {}),
            metrics: {
                requests: this.metrics.requests,
                errors: this.metrics.errors,
                users: this.metrics.users,
                memory_mb: Math.round(this.metrics.memory.heapUsed / 1024 / 1024),
                alerts: health.alerts
            }
        };
    }
}

module.exports = new HealthMonitor();