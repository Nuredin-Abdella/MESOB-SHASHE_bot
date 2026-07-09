/**
 * MESOB Shashemene Telegram Bot - Production Version
 * 
 * A multilingual government services bot supporting:
 * - English, Amharic, and Afaan Oromo
 * - Service information and tracking
 * - Dynamic keyboard navigation
 * - Comprehensive FAQ system
 */

require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const https = require('https');
const fs = require('fs');

// Validate token
if (!process.env.BOT_TOKEN) {
    console.error('❌ BOT_TOKEN is required in .env file');
    console.log('📝 Please add your Telegram bot token to the .env file:');
    console.log('   BOT_TOKEN=your_telegram_bot_token_here');
    process.exit(1);
}

console.log('🤖 MESOB Shashemene Telegram Bot Starting...');

// Configure HTTPS agent with custom CA certificate if available
let httpsAgent;
if (process.env.NODE_EXTRA_CA_CERTS && fs.existsSync(process.env.NODE_EXTRA_CA_CERTS)) {
    httpsAgent = new https.Agent({
        ca: fs.readFileSync(process.env.NODE_EXTRA_CA_CERTS),
        family: 4 // Force IPv4
    });
    console.log('✅ Using custom SSL certificate');
}

// Create bot with custom agent
const botOptions = { polling: false };
if (httpsAgent) {
    botOptions.request = {
        agent: httpsAgent
    };
}

const bot = new TelegramBot(process.env.BOT_TOKEN, botOptions);

// Import functions after bot creation to avoid circular dependency issues
let getTranslation, getUserLanguage, setUserLanguage, getUserStats, initializeUserStateManager;
let createMainMenuKeyboard, createServicesKeyboard, createFAQKeyboard, createLanguageKeyboard;

// Import workflow services
let smsService, database, documentService, applicationService;

try {
    // Import utilities
    const languageModule = require('./src/config/languages');
    const userStateModule = require('./src/utils/userState');
    const keyboardModule = require('./src/utils/keyboards');

    getTranslation = languageModule.getTranslation;
    getUserLanguage = userStateModule.getUserLanguage;
    setUserLanguage = userStateModule.setUserLanguage;
    getUserStats = userStateModule.getUserStats;
    initializeUserStateManager = userStateModule.initializeUserStateManager;

    createMainMenuKeyboard = keyboardModule.createMainMenuKeyboard;
    createServicesKeyboard = keyboardModule.createServicesKeyboard;
    createFAQKeyboard = keyboardModule.createFAQKeyboard;
    createLanguageKeyboard = keyboardModule.createLanguageKeyboard;

    // Import workflow services
    smsService = require('./src/services/smsService');
    database = require('./src/database/db');
    documentService = require('./src/services/documentService');
    applicationService = require('./src/services/applicationService');

    // Initialize database
    database.initialize();

    // Initialize user state management
    initializeUserStateManager();

    console.log('✅ All modules loaded successfully');

} catch (error) {
    console.error('❌ Failed to load modules:', error.message);
    process.exit(1);
}

/**
 * Error handlers
 */
bot.on('polling_error', (error) => {
    console.error('❌ Polling error:', error.message);
    if (error.code === 'EFATAL') {
        console.log('🔄 Fatal error detected. Attempting restart in 5 seconds...');
        setTimeout(() => {
            process.exit(1);
        }, 5000);
    }
});

/**
 * Handle all text messages
 */
bot.on('message', async (msg) => {
    try {
        if (!msg.text) return;

        const chatId = msg.chat.id;
        const text = msg.text.toLowerCase().trim();
        const userLang = getUserLanguage(chatId) || 'en';

        console.log(`👤 User ${msg.from.first_name || 'Unknown'}: ${msg.text}`);

        // Handle commands
        if (text.startsWith('/')) {
            switch (text) {
                case '/start':
                    const keyboard = createLanguageKeyboard();
                    await bot.sendMessage(chatId, getTranslation('welcome', 'en'));
                    return await bot.sendMessage(chatId, getTranslation('language_selection', 'en'), {
                        reply_markup: keyboard
                    });

                case '/help':
                    const helpText = `🤖 MESOB Bot Help\n\n📋 Available Commands:\n/start - Start the bot\n/help - Show this help\n/menu - Main menu\n\n🎯 Features:\n• Government services info\n• Application tracking\n• FAQ & support\n• Multilingual (English, አማርኛ, Afaan Oromo)\n\n📞 Support: +251 913 116898\n🌐 Website: eservice.shashemenecity.com`;
                    return await bot.sendMessage(chatId, helpText);

                case '/menu':
                    const menuKeyboard = createMainMenuKeyboard(userLang);
                    return await bot.sendMessage(chatId, getTranslation('main_menu', userLang), {
                        reply_markup: menuKeyboard
                    });

                case '/stats':
                    // Admin command
                    if (chatId.toString() === process.env.ADMIN_CHAT_ID) {
                        const stats = getUserStats();
                        await bot.sendMessage(chatId, `📊 Bot Statistics:\n\nTotal Users: ${stats.totalUsers}\n\nLanguages:\n🇺🇸 English: ${stats.languageBreakdown.en}\n🇪🇹 Amharic: ${stats.languageBreakdown.am}\n🇪🇹 Afaan Oromo: ${stats.languageBreakdown.om}\n❓ Unknown: ${stats.languageBreakdown.undefined}\n\nActive in last hour: ${stats.activeInLastHour}\nActive in last day: ${stats.activeInLastDay}`);
                    }
                    return;

                default:
                    await bot.sendMessage(chatId, "❓ Unknown command. Type /help to see available commands.");
                    return;
            }
        }

        // Handle language selection
        if (['1', '2', '3'].includes(text)) {
            const langMap = { '1': 'en', '2': 'am', '3': 'om' };
            const selectedLang = langMap[text];

            if (selectedLang) {
                setUserLanguage(chatId, selectedLang);
                await bot.sendMessage(chatId, getTranslation('language_changed', selectedLang));

                const keyboard = createMainMenuKeyboard(selectedLang);
                return await bot.sendMessage(chatId, getTranslation('main_menu', selectedLang), {
                    reply_markup: keyboard
                });
            }
        }

        // Handle main menu options
        if (text === getTranslation('menu_services', userLang).toLowerCase()) {
            const keyboard = createServicesKeyboard(userLang);
            return await bot.sendMessage(chatId, getTranslation('services_title', userLang), {
                reply_markup: keyboard
            });
        }

        // Handle registration flow
        if (text === getTranslation('menu_register', userLang).toLowerCase()) {
            const user = await database.getUser(chatId);
            if (user && user.personalInfo && user.personalInfo.phoneVerified) {
                return await bot.sendMessage(chatId, 
                    getTranslation('registration_already_registered', userLang, { 
                        phone: user.personalInfo.phoneNumber 
                    })
                );
            }
            return await bot.sendMessage(chatId, getTranslation('registration_prompt', userLang));
        }

        // Handle my applications
        if (text === getTranslation('menu_my_applications', userLang).toLowerCase()) {
            const user = await database.getUser(chatId);
            if (!user) {
                return await bot.sendMessage(chatId, getTranslation('no_applications', userLang));
            }
            
            // Get user applications from database
            const applications = await database.getApplicationsByChatId(chatId);
            
            if (!applications || applications.length === 0) {
                return await bot.sendMessage(chatId, getTranslation('no_applications', userLang));
            }

            // Format applications list
            const appList = applications.map((app, index) => 
                `${index + 1}. ${app.service} - ${app.trackingNumber} (${app.status})`
            ).join('\n');

            return await bot.sendMessage(chatId, 
                getTranslation('my_applications', userLang, { applications: appList })
            );
        }

        if (text === getTranslation('menu_faq', userLang).toLowerCase()) {
            const keyboard = createFAQKeyboard(userLang);
            return await bot.sendMessage(chatId, getTranslation('faq_title', userLang), {
                reply_markup: keyboard
            });
        }

        if (text === getTranslation('menu_contact', userLang).toLowerCase()) {
            await bot.sendMessage(chatId, getTranslation('contact_info', userLang));
            setTimeout(() => {
                const keyboard = createMainMenuKeyboard(userLang);
                bot.sendMessage(chatId, getTranslation('main_menu', userLang), {
                    reply_markup: keyboard
                });
            }, 3000);
            return;
        }

        if (text === getTranslation('menu_language', userLang).toLowerCase()) {
            const keyboard = createLanguageKeyboard();
            return await bot.sendMessage(chatId, getTranslation('language_selection', 'en'), {
                reply_markup: keyboard
            });
        }

        if (text === getTranslation('menu_track', userLang).toLowerCase()) {
            return await bot.sendMessage(chatId, getTranslation('track_prompt', userLang));
        }

        if (text === getTranslation('menu_howto', userLang).toLowerCase()) {
            await bot.sendMessage(chatId, getTranslation('howto_content', userLang));
            setTimeout(() => {
                const keyboard = createMainMenuKeyboard(userLang);
                bot.sendMessage(chatId, getTranslation('main_menu', userLang), {
                    reply_markup: keyboard
                });
            }, 3000);
            return;
        }

        // Handle FAQ categories
        if (text === getTranslation('faq_documents', userLang).toLowerCase()) {
            await bot.sendMessage(chatId, getTranslation('faq_documents_content', userLang));
            setTimeout(() => {
                const keyboard = createFAQKeyboard(userLang);
                bot.sendMessage(chatId, getTranslation('faq_title', userLang), {
                    reply_markup: keyboard
                });
            }, 4000);
            return;
        }

        if (text === getTranslation('faq_fees', userLang).toLowerCase()) {
            await bot.sendMessage(chatId, getTranslation('faq_fees_content', userLang));
            setTimeout(() => {
                const keyboard = createFAQKeyboard(userLang);
                bot.sendMessage(chatId, getTranslation('faq_title', userLang), {
                    reply_markup: keyboard
                });
            }, 4000);
            return;
        }

        if (text === getTranslation('faq_timing', userLang).toLowerCase()) {
            await bot.sendMessage(chatId, getTranslation('faq_timing_content', userLang));
            setTimeout(() => {
                const keyboard = createFAQKeyboard(userLang);
                bot.sendMessage(chatId, getTranslation('faq_title', userLang), {
                    reply_markup: keyboard
                });
            }, 4000);
            return;
        }

        if (text === getTranslation('faq_general', userLang).toLowerCase()) {
            await bot.sendMessage(chatId, getTranslation('faq_general_content', userLang));
            setTimeout(() => {
                const keyboard = createFAQKeyboard(userLang);
                bot.sendMessage(chatId, getTranslation('faq_title', userLang), {
                    reply_markup: keyboard
                });
            }, 4000);
            return;
        }

        if (text === getTranslation('mesob_general', userLang).toLowerCase()) {
            await bot.sendMessage(chatId, getTranslation('mesob_general_content', userLang));
            setTimeout(() => {
                const keyboard = createFAQKeyboard(userLang);
                bot.sendMessage(chatId, getTranslation('faq_title', userLang), {
                    reply_markup: keyboard
                });
            }, 4000);
            return;
        }

        if (text === getTranslation('mesob_services', userLang).toLowerCase()) {
            await bot.sendMessage(chatId, getTranslation('mesob_services_content', userLang));
            setTimeout(() => {
                const keyboard = createFAQKeyboard(userLang);
                bot.sendMessage(chatId, getTranslation('faq_title', userLang), {
                    reply_markup: keyboard
                });
            }, 4000);
            return;
        }

        if (text === getTranslation('mesob_support', userLang).toLowerCase()) {
            await bot.sendMessage(chatId, getTranslation('mesob_support_content', userLang));
            setTimeout(() => {
                const keyboard = createFAQKeyboard(userLang);
                bot.sendMessage(chatId, getTranslation('faq_title', userLang), {
                    reply_markup: keyboard
                });
            }, 4000);
            return;
        }

        // Handle service info
        if (text === getTranslation('service_national_id', userLang).toLowerCase()) {
            await bot.sendMessage(chatId, getTranslation('national_id_info', userLang));
            setTimeout(() => {
                const keyboard = createServicesKeyboard(userLang);
                bot.sendMessage(chatId, getTranslation('services_title', userLang), {
                    reply_markup: keyboard
                });
            }, 3000);
            return;
        }

        if (text === getTranslation('service_passport', userLang).toLowerCase()) {
            await bot.sendMessage(chatId, getTranslation('passport_info', userLang));
            setTimeout(() => {
                const keyboard = createServicesKeyboard(userLang);
                bot.sendMessage(chatId, getTranslation('services_title', userLang), {
                    reply_markup: keyboard
                });
            }, 3000);
            return;
        }

        // Handle new services
        const newServices = [
            'service_vital_registration',
            'service_civil_status',
            'service_business_licensing',
            'service_cooperatives',
            'service_revenue',
            'service_land',
            'service_investment',
            'service_document_auth',
            'service_transport',
            'service_construction',
            'service_sanitation',
            'service_social',
            'service_urban_planning',
            'service_elections'
        ];

        for (const service of newServices) {
            if (text === getTranslation(service, userLang).toLowerCase()) {
                // Check if user wants to apply for this service
                const user = await database.getUser(chatId);
                const isVerified = user && user.personalInfo && user.personalInfo.phoneVerified;
                
                if (isVerified) {
                    // Start application flow
                    applicationService.startApplication(chatId, userLang);
                    applicationService.setService(chatId, service.replace('service_', ''));
                    
                    await bot.sendMessage(chatId, 
                        getTranslation('application_upload_documents', userLang, { 
                            service: getTranslation(service, userLang) 
                        })
                    );
                } else {
                    // Show service info
                    const infoKey = service.replace('service_', '') + '_info';
                    await bot.sendMessage(chatId, getTranslation(infoKey, userLang));
                    setTimeout(() => {
                        const keyboard = createServicesKeyboard(userLang);
                        bot.sendMessage(chatId, getTranslation('services_title', userLang), {
                            reply_markup: keyboard
                        });
                    }, 3000);
                }
                return;
            }
        }

        // Handle back to menu
        if (text === getTranslation('back_to_menu', userLang).toLowerCase()) {
            const keyboard = createMainMenuKeyboard(userLang);
            return await bot.sendMessage(chatId, getTranslation('main_menu', userLang), {
                reply_markup: keyboard
            });
        }

        // Handle greetings
        if (['hello', 'hi', 'ሰላም', 'akkam', 'nagaa'].includes(text)) {
            await bot.sendMessage(chatId, getTranslation('greeting_hello', userLang));
            setTimeout(() => {
                const keyboard = createMainMenuKeyboard(userLang);
                bot.sendMessage(chatId, getTranslation('main_menu', userLang), {
                    reply_markup: keyboard
                });
            }, 1000);
            return;
        }

        // Check if it's a tracking number (6+ alphanumeric characters)
        if (text.length >= 6 && /^[a-z0-9]+$/i.test(text)) {
            // Real application tracking
            const application = await database.getApplication(text.toUpperCase());
            if (application) {
                const message = getTranslation('application_status', userLang, {
                    trackingNumber: application.trackingNumber,
                    service: application.service,
                    status: application.status,
                    submittedDate: application.createdAt.toLocaleDateString(),
                    updatedDate: application.updatedAt.toLocaleDateString(),
                    notes: application.notes || ''
                });
                await bot.sendMessage(chatId, message);
            } else {
                await bot.sendMessage(chatId, getTranslation('application_not_found', userLang));
            }
            setTimeout(() => {
                const keyboard = createMainMenuKeyboard(userLang);
                bot.sendMessage(chatId, getTranslation('main_menu', userLang), {
                    reply_markup: keyboard
                });
            }, 2000);
            return;
        }

        // Handle phone number input (for registration)
        if (/^\d{9,15}$/.test(text.replace(/[^0-9]/g, ''))) {
            const phoneNumber = smsService.formatPhoneNumber(text);
            
            if (!smsService.validatePhoneNumber(phoneNumber)) {
                return await bot.sendMessage(chatId, getTranslation('registration_phone_invalid', userLang));
            }

            // Check if user already registered with this phone
            const existingUser = await database.getUserByPhoneNumber(phoneNumber);
            if (existingUser) {
                return await bot.sendMessage(chatId, 
                    getTranslation('registration_already_registered', userLang, { phone: phoneNumber })
                );
            }

            // Generate and send verification code
            const code = smsService.generateVerificationCode();
            smsService.storeCode(chatId, phoneNumber, code);
            await smsService.sendVerificationCode(phoneNumber, code);

            return await bot.sendMessage(chatId, getTranslation('registration_code_sent', userLang));
        }

        // Handle verification code input (6 digits)
        if (/^\d{6}$/.test(text)) {
            const verification = smsService.verifyCode(chatId, text);
            
            if (verification.success) {
                // Update user with verified phone
                await database.updateUserPhoneVerification(chatId, verification.phoneNumber, true);
                
                // Save user to database
                const user = await database.getUser(chatId);
                if (!user) {
                    await database.saveUser({
                        chatId,
                        personalInfo: {
                            phoneNumber: verification.phoneNumber,
                            phoneVerified: true
                        }
                    });
                }

                return await bot.sendMessage(chatId, getTranslation('registration_success', userLang));
            } else {
                return await bot.sendMessage(chatId, 
                    verification.message === 'Code expired' 
                        ? getTranslation('registration_code_expired', userLang)
                        : getTranslation('registration_code_invalid', userLang)
                );
            }
        }

        // Handle application submission (user types "done")
        if (text === 'done' && applicationService.hasActiveApplication(chatId)) {
            await bot.sendMessage(chatId, getTranslation('application_submitting', userLang));
            
            const result = await applicationService.submitApplication(chatId, bot);
            
            if (result.success) {
                await bot.sendMessage(chatId, 
                    getTranslation('application_submitted', userLang, { 
                        trackingNumber: result.trackingNumber 
                    })
                );
            } else {
                await bot.sendMessage(chatId, 
                    getTranslation('application_error', userLang, { error: result.error })
                );
            }
            return;
        }

        // Handle application cancellation
        if (text === 'cancel' && applicationService.hasActiveApplication(chatId)) {
            applicationService.cancelApplication(chatId);
            await bot.sendMessage(chatId, '❌ Application cancelled.');
            return;
        }

        // Default response - handle any text including names
        console.log(`📝 Unrecognized text: "${msg.text}" - sending greeting`);
        await bot.sendMessage(chatId, getTranslation('greeting_hello', userLang));
        setTimeout(() => {
            const keyboard = createMainMenuKeyboard(userLang);
            bot.sendMessage(chatId, getTranslation('main_menu', userLang), {
                reply_markup: keyboard
            });
        }, 1000);

    } catch (error) {
        console.error('❌ Error handling message:', error);

        const errorText = {
            en: '🚫 Sorry, something went wrong. Please try again or contact support.',
            am: '🚫 ይቅርታ፣ የሆነ ችግር ተፈጥሯል። እባክዎን እንደገና ይሞክሩ ወይም ድጋፍን ያነጋግሩ።',
            om: '🚫 Dhiifama, wanti tokko dogoggore. Maaloo irra deebi\'ii yaaliitii ykn deeggarsa quunnamaa.'
        };

        try {
            await bot.sendMessage(msg.chat.id, errorText.en);
        } catch (sendError) {
            console.error('❌ Failed to send error message:', sendError);
        }
    }
});

/**
 * Handle callback queries (inline keyboard buttons)
 */
bot.on('callback_query', async (callbackQuery) => {
    try {
        const chatId = callbackQuery.message.chat.id;
        const data = callbackQuery.data;

        console.log(`🔘 Callback from ${chatId}: ${data}`);

        // Acknowledge the callback
        await bot.answerCallbackQuery(callbackQuery.id);

        // Handle different callback data
        switch (data) {
            case 'confirm_yes':
                await bot.sendMessage(chatId, '✅ Confirmed!');
                break;
            case 'confirm_no':
                await bot.sendMessage(chatId, '❌ Cancelled!');
                break;
            default:
                console.log(`🤷 Unknown callback data: ${data}`);
        }

    } catch (error) {
        console.error('❌ Error handling callback query:', error);
    }
});

/**
 * Handle document uploads
 */
bot.on('document', async (msg) => {
    try {
        const chatId = msg.chat.id;
        const userLang = getUserLanguage(chatId) || 'en';
        
        console.log(`📄 Document received from ${chatId}:`, msg.document.file_name);

        // Check if user has active application
        if (!applicationService.hasActiveApplication(chatId)) {
            await bot.sendMessage(chatId, '❌ Please start an application first by selecting a service.');
            return;
        }

        const result = await documentService.processTelegramDocument(
            bot,
            msg.document.file_id,
            chatId,
            null, // applicationId - will be set on submission
            'general' // documentType
        );

        if (result.success) {
            // Add document to application
            applicationService.addDocument(chatId, result.documentId, msg.document.file_name);
            
            await bot.sendMessage(chatId, 
                getTranslation('application_document_uploaded', userLang, { 
                    filename: msg.document.file_name 
                })
            );
        } else {
            await bot.sendMessage(chatId, `❌ ${result.error}`);
        }

    } catch (error) {
        console.error('❌ Error handling document:', error);
    }
});

/**
 * Handle photo uploads
 */
bot.on('photo', async (msg) => {
    try {
        const chatId = msg.chat.id;
        const userLang = getUserLanguage(chatId) || 'en';
        
        // Get the highest resolution photo
        const photo = msg.photo[msg.photo.length - 1];
        console.log(`📷 Photo received from ${chatId}`);

        // Check if user has active application
        if (!applicationService.hasActiveApplication(chatId)) {
            await bot.sendMessage(chatId, '❌ Please start an application first by selecting a service.');
            return;
        }

        const result = await documentService.processTelegramDocument(
            bot,
            photo.file_id,
            chatId,
            null, // applicationId
            'photo' // documentType
        );

        if (result.success) {
            // Add document to application
            applicationService.addDocument(chatId, result.documentId, 'photo.jpg');
            
            await bot.sendMessage(chatId, 
                getTranslation('application_document_uploaded', userLang, { 
                    filename: 'photo.jpg' 
                })
            );
        } else {
            await bot.sendMessage(chatId, `❌ ${result.error}`);
        }

    } catch (error) {
        console.error('❌ Error handling photo:', error);
    }
});

/**
 * Handle contact sharing
 */
bot.on('contact', async (msg) => {
    try {
        const chatId = msg.chat.id;
        console.log(`📞 Contact received from ${chatId}:`, msg.contact);

        await bot.sendMessage(chatId, '📞 Thank you for sharing your contact! This helps us provide better service.');

    } catch (error) {
        console.error('❌ Error handling contact:', error);
    }
});

/**
 * Handle location sharing
 */
bot.on('location', async (msg) => {
    try {
        const chatId = msg.chat.id;
        console.log(`📍 Location received from ${chatId}:`, msg.location);

        await bot.sendMessage(chatId, '📍 Thank you for sharing your location! This helps us direct you to the nearest MESOB office.');

    } catch (error) {
        console.error('❌ Error handling location:', error);
    }
});

/**
 * Graceful shutdown handling
 */
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down MESOB Telegram Bot...');

    // Get final statistics
    const finalStats = getUserStats();
    console.log('📊 Final Statistics:', finalStats);

    // Stop polling
    bot.stopPolling();

    console.log('✅ Bot shutdown complete');
    process.exit(0);
});

/**
 * Unhandled promise rejection handler
 */
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

/**
 * Start bot
 */
bot.getMe().then((botInfo) => {
    console.log('✅ MESOB Shashemene Bot Connected Successfully!');
    console.log(`🤖 Bot Name: ${botInfo.first_name}`);
    console.log(`👤 Username: @${botInfo.username}`);
    console.log(`🆔 Bot ID: ${botInfo.id}`);
    console.log('🌍 Languages: English, አማርኛ, Afaan Oromo');
    console.log('🚀 Ready to serve MESOB users!');
    console.log('📝 Send /start to begin interaction');

    // Start polling after successful connection
    return bot.startPolling();
}).then(() => {
    console.log('✅ Bot is running! Send /start to your bot to test it.');
}).catch((error) => {
    console.error('❌ Failed to start bot:', error.message);
    process.exit(1);
});

// Export bot instance for testing purposes
module.exports = bot;