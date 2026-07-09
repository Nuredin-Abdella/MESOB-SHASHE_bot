/**
 * Enhanced Keyboard Utilities with Inline Keyboards and Modern Features
 */

const { getTranslation } = require('../config/languages');

/**
 * Create main menu with inline keyboard for better UX
 */
function createMainMenuKeyboard(userLang) {
    return {
        inline_keyboard: [
            [
                { text: getTranslation('menu_services', userLang), callback_data: 'services' },
                { text: getTranslation('menu_track', userLang), callback_data: 'track' }
            ],
            [
                { text: getTranslation('menu_faq', userLang), callback_data: 'faq' },
                { text: getTranslation('menu_contact', userLang), callback_data: 'contact' }
            ],
            [
                { text: getTranslation('menu_howto', userLang), callback_data: 'howto' },
                { text: getTranslation('menu_language', userLang), callback_data: 'language' }
            ],
            [
                {
                    text: '🌐 Open MESOB Web App',
                    web_app: { url: 'https://eservice.shashemenecity.com' }
                }
            ]
        ]
    };
}

/**
 * Create services menu with inline keyboard
 */
function createServicesKeyboard(userLang) {
    return {
        inline_keyboard: [
            [
                { text: getTranslation('service_national_id', userLang), callback_data: 'service_national_id' },
                { text: getTranslation('service_passport', userLang), callback_data: 'service_passport' }
            ],
            [
                { text: getTranslation('service_business', userLang), callback_data: 'service_business' },
                { text: getTranslation('service_tax', userLang), callback_data: 'service_tax' }
            ],
            [
                { text: getTranslation('service_license', userLang), callback_data: 'service_license' }
            ],
            [
                {
                    text: '📋 Apply Online',
                    web_app: { url: 'https://eservice.shashemenecity.com/apply' }
                },
                { text: '🔙 Back', callback_data: 'main_menu' }
            ]
        ]
    };
}

/**
 * Create FAQ keyboard with enhanced navigation
 */
function createFAQKeyboard(userLang) {
    return {
        inline_keyboard: [
            [
                { text: getTranslation('faq_documents', userLang), callback_data: 'faq_documents' },
                { text: getTranslation('faq_fees', userLang), callback_data: 'faq_fees' }
            ],
            [
                { text: getTranslation('faq_timing', userLang), callback_data: 'faq_timing' },
                { text: getTranslation('faq_general', userLang), callback_data: 'faq_general' }
            ],
            [
                { text: getTranslation('mesob_general', userLang), callback_data: 'mesob_general' },
                { text: getTranslation('mesob_services', userLang), callback_data: 'mesob_services' }
            ],
            [
                { text: getTranslation('mesob_support', userLang), callback_data: 'mesob_support' }
            ],
            [
                {
                    text: '🔍 Search FAQ',
                    switch_inline_query_current_chat: 'faq:'
                },
                { text: '🔙 Back', callback_data: 'main_menu' }
            ]
        ]
    };
}

/**
 * Create language selection keyboard
 */
function createLanguageKeyboard() {
    return {
        inline_keyboard: [
            [{ text: '🇺🇸 English', callback_data: 'lang_en' }],
            [{ text: '🇪🇹 አማርኛ (Amharic)', callback_data: 'lang_am' }],
            [{ text: '🇪🇹 Afaan Oromo', callback_data: 'lang_om' }]
        ]
    };
}

/**
 * Create application tracking keyboard
 */
function createTrackingKeyboard(userLang) {
    return {
        inline_keyboard: [
            [
                { text: '📱 Enter Tracking Number', callback_data: 'enter_tracking' },
                { text: '📋 My Applications', callback_data: 'my_applications' }
            ],
            [
                {
                    text: '🌐 Check Online',
                    web_app: { url: 'https://eservice.shashemenecity.com/track' }
                }
            ],
            [
                { text: '🔙 Back', callback_data: 'main_menu' }
            ]
        ]
    };
}

/**
 * Create contact options keyboard
 */
function createContactKeyboard(userLang) {
    return {
        inline_keyboard: [
            [
                { text: '📞 Call Support', url: 'tel:+251913116898' },
                { text: '🌐 Visit Website', url: 'https://eservice.shashemenecity.com' }
            ],
            [
                { text: '📧 Send Email', url: 'mailto:support@mesobshashe.gov.et' },
                { text: '📍 Get Directions', callback_data: 'get_directions' }
            ],
            [
                { text: '💬 Live Chat', web_app: { url: 'https://eservice.shashemenecity.com/chat' } }
            ],
            [
                { text: '🔙 Back', callback_data: 'main_menu' }
            ]
        ]
    };
}

/**
 * Create payment keyboard
 */
function createPaymentKeyboard(userLang, amount, serviceType) {
    return {
        inline_keyboard: [
            [
                {
                    text: `💳 Pay ${amount} ETB`,
                    web_app: { url: `https://eservice.shashemenecity.com/payment?amount=${amount}&service=${serviceType}` }
                }
            ],
            [
                { text: '🏦 CBE Birr', callback_data: `pay_cbe_${serviceType}` },
                { text: '📱 Telebirr', callback_data: `pay_telebirr_${serviceType}` }
            ],
            [
                { text: '💰 Payment History', callback_data: 'payment_history' },
                { text: '🧾 Get Receipt', callback_data: 'get_receipt' }
            ],
            [
                { text: '🔙 Back', callback_data: 'services' }
            ]
        ]
    };
}

/**
 * Create admin panel keyboard (for authorized users)
 */
function createAdminKeyboard(userLang) {
    return {
        inline_keyboard: [
            [
                { text: '📊 Bot Statistics', callback_data: 'admin_stats' },
                { text: '👥 User Management', callback_data: 'admin_users' }
            ],
            [
                { text: '📋 Applications', callback_data: 'admin_applications' },
                { text: '🔒 Security Logs', callback_data: 'admin_security' }
            ],
            [
                { text: '⚙️ Bot Settings', callback_data: 'admin_settings' },
                { text: '💾 Backup Data', callback_data: 'admin_backup' }
            ],
            [
                { text: '🔙 Back to User Mode', callback_data: 'main_menu' }
            ]
        ]
    };
}

/**
 * Remove keyboard (for cleanup)
 */
function removeKeyboard() {
    return { remove_keyboard: true };
}

module.exports = {
    createMainMenuKeyboard,
    createServicesKeyboard,
    createFAQKeyboard,
    createLanguageKeyboard,
    createTrackingKeyboard,
    createContactKeyboard,
    createPaymentKeyboard,
    createAdminKeyboard,
    removeKeyboard
};