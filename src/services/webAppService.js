/**
 * Telegram Mini App Integration Service
 * Handles Web Apps, inline queries, deep linking, and rich media
 */

const crypto = require('crypto');
const path = require('path');
const fs = require('fs').promises;

class WebAppService {
    constructor() {
        this.webAppUrl = process.env.WEB_APP_URL || 'https://webapp.shashemenecity.com';
        this.botUsername = process.env.BOT_USERNAME || 'MesobBot';
        this.deepLinkSecret = process.env.DEEP_LINK_SECRET || 'default-secret';

        // Web App configurations
        this.webApps = {
            main: {
                url: `${this.webAppUrl}/main`,
                shortName: 'MESOB Services',
                description: 'Access all MESOB government services'
            },
            apply: {
                url: `${this.webAppUrl}/apply`,
                shortName: 'Apply Online',
                description: 'Submit new applications'
            },
            track: {
                url: `${this.webAppUrl}/track`,
                shortName: 'Track Application',
                description: 'Track your application status'
            },
            payment: {
                url: `${this.webAppUrl}/payment`,
                shortName: 'Make Payment',
                description: 'Pay for government services'
            },
            documents: {
                url: `${this.webAppUrl}/documents`,
                shortName: 'Document Manager',
                description: 'Upload and manage documents'
            },
            appointment: {
                url: `${this.webAppUrl}/appointment`,
                shortName: 'Book Appointment',
                description: 'Schedule office visits'
            }
        };

        // Inline query handlers
        this.inlineHandlers = new Map();
        this.setupInlineHandlers();
    }

    /**
     * Generate Web App URL with parameters
     */
    generateWebAppUrl(appType, parameters = {}) {
        const baseApp = this.webApps[appType];
        if (!baseApp) {
            throw new Error(`Unknown web app type: ${appType}`);
        }

        const url = new URL(baseApp.url);

        // Add parameters
        Object.entries(parameters).forEach(([key, value]) => {
            url.searchParams.set(key, value);
        });

        // Add authentication token
        const token = this.generateWebAppToken(parameters);
        url.searchParams.set('token', token);

        return url.toString();
    }

    /**
     * Generate secure token for Web App authentication
     */
    generateWebAppToken(userData) {
        const payload = {
            userId: userData.userId,
            chatId: userData.chatId,
            timestamp: Date.now(),
            expires: Date.now() + (60 * 60 * 1000) // 1 hour
        };

        const token = Buffer.from(JSON.stringify(payload)).toString('base64');
        const signature = crypto.createHmac('sha256', this.deepLinkSecret)
            .update(token)
            .digest('hex');

        return `${token}.${signature}`;
    }

    /**
     * Verify Web App token
     */
    verifyWebAppToken(token) {
        try {
            const [payload, signature] = token.split('.');

            // Verify signature
            const expectedSignature = crypto.createHmac('sha256', this.deepLinkSecret)
                .update(payload)
                .digest('hex');

            if (signature !== expectedSignature) {
                return { valid: false, error: 'Invalid signature' };
            }

            const data = JSON.parse(Buffer.from(payload, 'base64').toString());

            // Check expiration
            if (Date.now() > data.expires) {
                return { valid: false, error: 'Token expired' };
            }

            return { valid: true, data };

        } catch (error) {
            return { valid: false, error: 'Invalid token format' };
        }
    }

    /**
     * Create Web App keyboard
     */
    createWebAppKeyboard(appType, userData, customParams = {}) {
        const url = this.generateWebAppUrl(appType, {
            ...userData,
            ...customParams
        });

        return {
            text: this.webApps[appType].shortName,
            web_app: { url }
        };
    }

    /**
     * Create inline keyboard with multiple Web Apps
     */
    createMultiWebAppKeyboard(userData) {
        return {
            inline_keyboard: [
                [
                    this.createWebAppKeyboard('main', userData),
                    this.createWebAppKeyboard('apply', userData)
                ],
                [
                    this.createWebAppKeyboard('track', userData),
                    this.createWebAppKeyboard('payment', userData)
                ],
                [
                    this.createWebAppKeyboard('documents', userData),
                    this.createWebAppKeyboard('appointment', userData)
                ]
            ]
        };
    }

    /**
     * Generate deep link URLs
     */
    generateDeepLink(action, parameters = {}) {
        const payload = {
            action,
            ...parameters,
            timestamp: Date.now()
        };

        const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
        return `https://t.me/${this.botUsername}?start=${encoded}`;
    }

    /**
     * Parse deep link parameters
     */
    parseDeepLink(startParam) {
        try {
            const decoded = Buffer.from(startParam, 'base64url').toString();
            return JSON.parse(decoded);
        } catch (error) {
            return null;
        }
    }

    /**
     * Setup inline query handlers
     */
    setupInlineHandlers() {
        // Service search
        this.inlineHandlers.set('services', async (query, userLang) => {
            const services = [
                { id: 'national_id', title: 'National ID', description: 'Apply for national identification' },
                { id: 'passport', title: 'Passport', description: 'Apply for passport services' },
                { id: 'business', title: 'Business License', description: 'Register new business' },
                { id: 'tax', title: 'Tax Services', description: 'Tax registration and services' }
            ];

            return services
                .filter(service =>
                    service.title.toLowerCase().includes(query.toLowerCase()) ||
                    service.description.toLowerCase().includes(query.toLowerCase())
                )
                .map((service, index) => ({
                    type: 'article',
                    id: `service_${service.id}_${index}`,
                    title: service.title,
                    description: service.description,
                    input_message_content: {
                        message_text: `📋 ${service.title}\n\n${service.description}\n\nClick below to start your application:`,
                        parse_mode: 'Markdown'
                    },
                    reply_markup: {
                        inline_keyboard: [[
                            {
                                text: '🌐 Apply Online',
                                web_app: {
                                    url: this.generateWebAppUrl('apply', { service: service.id })
                                }
                            }
                        ]]
                    }
                }));
        });

        // FAQ search
        this.inlineHandlers.set('faq', async (query, userLang) => {
            const faqs = [
                { q: 'How long does processing take?', a: 'Processing times vary by service: National ID (3-5 days), Passport (15-20 days)' },
                { q: 'What documents do I need?', a: 'Required documents vary by service. Check our document requirements guide.' },
                { q: 'How much does it cost?', a: 'Service fees: National ID (25 ETB), Passport (1,200 ETB)' },
                { q: 'Can I track my application?', a: 'Yes! Use your tracking number to check status anytime.' }
            ];

            return faqs
                .filter(faq =>
                    faq.q.toLowerCase().includes(query.toLowerCase()) ||
                    faq.a.toLowerCase().includes(query.toLowerCase())
                )
                .map((faq, index) => ({
                    type: 'article',
                    id: `faq_${index}`,
                    title: faq.q,
                    description: faq.a,
                    input_message_content: {
                        message_text: `❓ **${faq.q}**\n\n${faq.a}`,
                        parse_mode: 'Markdown'
                    }
                }));
        });

        // Application tracking
        this.inlineHandlers.set('track', async (query, userLang) => {
            if (query.length < 6) {
                return [{
                    type: 'article',
                    id: 'track_help',
                    title: 'Enter Tracking Number',
                    description: 'Please enter at least 6 characters of your tracking number',
                    input_message_content: {
                        message_text: '🔍 To track your application, please enter your complete tracking number.',
                        parse_mode: 'Markdown'
                    }
                }];
            }

            // Mock tracking results (in production, this would query the actual database)
            return [{
                type: 'article',
                id: `track_${query}`,
                title: `Track Application: ${query}`,
                description: 'Click to check your application status',
                input_message_content: {
                    message_text: `🔍 Checking status for tracking number: ${query}\n\nClick below to view detailed status:`,
                    parse_mode: 'Markdown'
                },
                reply_markup: {
                    inline_keyboard: [[
                        {
                            text: '📊 View Status',
                            web_app: {
                                url: this.generateWebAppUrl('track', { trackingNumber: query })
                            }
                        }
                    ]]
                }
            }];
        });
    }

    /**
     * Handle inline queries
     */
    async handleInlineQuery(query, userLang = 'en') {
        try {
            const [command, ...searchTerms] = query.split(' ');
            const searchQuery = searchTerms.join(' ');

            const handler = this.inlineHandlers.get(command);
            if (!handler) {
                return this.getDefaultInlineResults(query, userLang);
            }

            return await handler(searchQuery, userLang);

        } catch (error) {
            console.error('Inline query error:', error);
            return [{
                type: 'article',
                id: 'error',
                title: 'Search Error',
                description: 'Something went wrong with your search',
                input_message_content: {
                    message_text: '❌ Search error occurred. Please try again.',
                    parse_mode: 'Markdown'
                }
            }];
        }
    }

    /**
     * Get default inline results
     */
    getDefaultInlineResults(query, userLang) {
        const commands = [
            { cmd: 'services', desc: 'Search government services' },
            { cmd: 'faq', desc: 'Search frequently asked questions' },
            { cmd: 'track', desc: 'Track application status' }
        ];

        if (!query) {
            return commands.map((cmd, index) => ({
                type: 'article',
                id: `cmd_${cmd.cmd}`,
                title: `${cmd.cmd}: ${cmd.desc}`,
                description: `Type "${cmd.cmd} your search term"`,
                input_message_content: {
                    message_text: `💡 **Available Commands:**\n\n${commands.map(c => `• \`${c.cmd}\` - ${c.desc}`).join('\n')}\n\n**Usage:** Type command followed by search term\n**Example:** \`services passport\``,
                    parse_mode: 'Markdown'
                }
            }));
        }

        // General search across all categories
        return [{
            type: 'article',
            id: 'general_search',
            title: `Search: "${query}"`,
            description: 'Click to search all MESOB services and information',
            input_message_content: {
                message_text: `🔍 Searching for: "${query}"\n\nClick below to open the web app and search:`,
                parse_mode: 'Markdown'
            },
            reply_markup: {
                inline_keyboard: [[
                    {
                        text: '🌐 Search in Web App',
                        web_app: {
                            url: this.generateWebAppUrl('main', { search: query })
                        }
                    }
                ]]
            }
        }];
    }

    /**
     * Create switch inline query button
     */
    createSwitchInlineButton(query, text = null) {
        return {
            text: text || `🔍 Search: ${query}`,
            switch_inline_query_current_chat: query
        };
    }

    /**
     * Rich media message templates
     */
    createRichMediaMessage(type, data) {
        const templates = {
            service_card: {
                type: 'photo',
                photo: data.imageUrl || 'https://via.placeholder.com/800x400?text=MESOB+Service',
                caption: `🏛️ **${data.title}**\n\n${data.description}\n\n⏱️ Processing Time: ${data.processingTime}\n💰 Fee: ${data.fee} ETB`,
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [[
                        {
                            text: '📋 Apply Now',
                            web_app: { url: this.generateWebAppUrl('apply', { service: data.serviceId }) }
                        },
                        {
                            text: '📖 Learn More',
                            callback_data: `service_info_${data.serviceId}`
                        }
                    ]]
                }
            },

            application_status: {
                type: 'photo',
                photo: data.statusImageUrl || 'https://via.placeholder.com/800x400?text=Application+Status',
                caption: `📊 **Application Status Update**\n\n🏷️ Tracking: ${data.trackingNumber}\n📋 Status: ${data.status}\n📅 Last Update: ${data.lastUpdate}\n\n${data.message || ''}`,
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [[
                        {
                            text: '🔍 View Details',
                            web_app: { url: this.generateWebAppUrl('track', { trackingNumber: data.trackingNumber }) }
                        }
                    ]]
                }
            },

            document_guide: {
                type: 'document',
                document: data.documentUrl,
                caption: `📄 **${data.title}**\n\n${data.description}\n\n📥 Download this guide for detailed requirements and instructions.`,
                parse_mode: 'Markdown'
            },

            video_tutorial: {
                type: 'video',
                video: data.videoUrl,
                caption: `🎥 **${data.title}**\n\n${data.description}\n\nWatch this tutorial to learn how to use MESOB services effectively.`,
                parse_mode: 'Markdown'
            }
        };

        return templates[type] || null;
    }

    /**
     * Create interactive game/quiz
     */
    createServiceQuiz(userLang = 'en') {
        const questions = [
            {
                question: 'What documents do you need for a National ID?',
                options: ['Birth Certificate only', 'Birth Certificate + Photos + Kebele Letter', 'Just a photo', 'Nothing special'],
                correct: 1,
                explanation: 'You need: Birth Certificate, 2 photos, and Kebele letter for National ID application.'
            }
        ];

        // This would integrate with Telegram's game platform
        return {
            type: 'game',
            game_short_name: 'mesob_service_quiz'
        };
    }

    /**
     * Create story/channel content
     */
    createStoryContent(type, data) {
        const stories = {
            service_highlight: {
                media: [{
                    type: 'photo',
                    media: data.imageUrl,
                    caption: `🌟 Featured Service: ${data.serviceName}\n\nSimplified process, faster results!\n\n#MESOB #GovernmentServices`
                }],
                duration: 24 * 60 * 60 // 24 hours
            },

            success_story: {
                media: [{
                    type: 'video',
                    media: data.videoUrl,
                    caption: `✅ Success Story\n\n"${data.testimonial}"\n\n- ${data.customerName}\n\n#MesobSuccess #HappyCustomer`
                }],
                duration: 24 * 60 * 60
            }
        };

        return stories[type] || null;
    }

    /**
     * Generate sharing URLs
     */
    generateShareUrl(content, platform = 'telegram') {
        const shareUrls = {
            telegram: `https://t.me/share/url?url=${encodeURIComponent(content.url)}&text=${encodeURIComponent(content.text)}`,
            whatsapp: `https://wa.me/?text=${encodeURIComponent(content.text + ' ' + content.url)}`,
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(content.text)}&url=${encodeURIComponent(content.url)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(content.url)}`
        };

        return shareUrls[platform] || shareUrls.telegram;
    }

    /**
     * Create share keyboard
     */
    createShareKeyboard(content) {
        return {
            inline_keyboard: [[
                { text: '📱 Share on Telegram', url: this.generateShareUrl(content, 'telegram') },
                { text: '💬 Share on WhatsApp', url: this.generateShareUrl(content, 'whatsapp') }
            ], [
                { text: '🐦 Share on Twitter', url: this.generateShareUrl(content, 'twitter') },
                { text: '📘 Share on Facebook', url: this.generateShareUrl(content, 'facebook') }
            ]]
        };
    }
}

module.exports = new WebAppService();