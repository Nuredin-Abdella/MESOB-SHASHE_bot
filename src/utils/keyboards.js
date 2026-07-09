/**
 * Keyboard Utilities for MESOB Telegram Bot
 * Creates dynamic keyboard layouts based on user language
 */

const { getTranslation } = require('../config/languages');

/**
 * Create main menu keyboard
 */
function createMainMenuKeyboard(userLang) {
    return {
        keyboard: [
            [
                { text: getTranslation('menu_services', userLang) },
                { text: getTranslation('menu_track', userLang) }
            ],
            [
                { text: getTranslation('menu_my_applications', userLang) },
                { text: getTranslation('menu_register', userLang) }
            ],
            [
                { text: getTranslation('menu_howto', userLang) },
                { text: getTranslation('menu_faq', userLang) }
            ],
            [
                { text: getTranslation('menu_contact', userLang) },
                { text: getTranslation('menu_language', userLang) }
            ]
        ],
        resize_keyboard: true,
        one_time_keyboard: false
    };
}

/**
 * Create services menu keyboard
 */
function createServicesKeyboard(userLang) {
    return {
        keyboard: [
            [
                { text: getTranslation('service_national_id', userLang) },
                { text: getTranslation('service_passport', userLang) }
            ],
            [
                { text: getTranslation('service_vital_registration', userLang) },
                { text: getTranslation('service_civil_status', userLang) }
            ],
            [
                { text: getTranslation('service_business_licensing', userLang) },
                { text: getTranslation('service_cooperatives', userLang) }
            ],
            [
                { text: getTranslation('service_revenue', userLang) },
                { text: getTranslation('service_land', userLang) }
            ],
            [
                { text: getTranslation('service_investment', userLang) },
                { text: getTranslation('service_document_auth', userLang) }
            ],
            [
                { text: getTranslation('service_transport', userLang) },
                { text: getTranslation('service_construction', userLang) }
            ],
            [
                { text: getTranslation('service_sanitation', userLang) },
                { text: getTranslation('service_social', userLang) }
            ],
            [
                { text: getTranslation('service_urban_planning', userLang) },
                { text: getTranslation('service_elections', userLang) }
            ],
            [
                { text: getTranslation('back_to_menu', userLang) }
            ]
        ],
        resize_keyboard: true,
        one_time_keyboard: false
    };
}

/**
 * Create FAQ menu keyboard
 */
function createFAQKeyboard(userLang) {
    return {
        keyboard: [
            [
                { text: getTranslation('faq_documents', userLang) },
                { text: getTranslation('faq_fees', userLang) }
            ],
            [
                { text: getTranslation('faq_timing', userLang) },
                { text: getTranslation('faq_general', userLang) }
            ],
            [
                { text: getTranslation('mesob_general', userLang) },
                { text: getTranslation('mesob_services', userLang) }
            ],
            [
                { text: getTranslation('mesob_support', userLang) }
            ],
            [
                { text: getTranslation('back_to_menu', userLang) }
            ]
        ],
        resize_keyboard: true,
        one_time_keyboard: false
    };
}

/**
 * Create language selection keyboard
 */
function createLanguageKeyboard() {
    return {
        keyboard: [
            [{ text: '1️⃣ English' }],
            [{ text: '2️⃣ አማርኛ (Amharic)' }],
            [{ text: '3️⃣ Afaan Oromo' }]
        ],
        resize_keyboard: true,
        one_time_keyboard: true
    };
}

/**
 * Create inline keyboard
 */
function createInlineKeyboard(userLang, actions) {
    const keyboard = actions.map(action => [
        {
            text: getTranslation(action.textKey, userLang),
            callback_data: action.callbackData
        }
    ]);

    return {
        inline_keyboard: keyboard
    };
}

/**
 * Create back button keyboard
 */
function createBackKeyboard(userLang) {
    return {
        keyboard: [
            [{ text: getTranslation('back_to_menu', userLang) }]
        ],
        resize_keyboard: true,
        one_time_keyboard: false
    };
}

/**
 * Create yes/no confirmation keyboard
 */
function createConfirmationKeyboard(userLang) {
    const yesText = {
        en: '✅ Yes',
        am: '✅ አዎ',
        om: '✅ Eeyyee'
    };

    const noText = {
        en: '❌ No',
        am: '❌ አይ',
        om: '❌ Lakki'
    };

    return {
        inline_keyboard: [
            [
                { text: yesText[userLang], callback_data: 'confirm_yes' },
                { text: noText[userLang], callback_data: 'confirm_no' }
            ]
        ]
    };
}

/**
 * Remove keyboard
 */
function removeKeyboard() {
    return {
        remove_keyboard: true
    };
}

/**
 * Create contact sharing keyboard
 */
function createContactKeyboard(userLang) {
    const shareContactText = {
        en: '📞 Share Contact',
        am: '📞 መገናኛ ያካፍሉ',
        om: '📞 Quunnamtii Qooddaa'
    };

    const skipText = {
        en: '⏭️ Skip',
        am: '⏭️ ዝለል',
        om: '⏭️ Darbuu'
    };

    return {
        keyboard: [
            [
                {
                    text: shareContactText[userLang],
                    request_contact: true
                }
            ],
            [{ text: skipText[userLang] }]
        ],
        resize_keyboard: true,
        one_time_keyboard: true
    };
}

/**
 * Create location sharing keyboard
 */
function createLocationKeyboard(userLang) {
    const shareLocationText = {
        en: '📍 Share Location',
        am: '📍 አካባቢ ያካፍሉ',
        om: '📍 Bakka Qooddaa'
    };

    const skipText = {
        en: '⏭️ Skip',
        am: '⏭️ ዝለል',
        om: '⏭️ Darbuu'
    };

    return {
        keyboard: [
            [
                {
                    text: shareLocationText[userLang],
                    request_location: true
                }
            ],
            [{ text: skipText[userLang] }]
        ],
        resize_keyboard: true,
        one_time_keyboard: true
    };
}

module.exports = {
    createMainMenuKeyboard,
    createServicesKeyboard,
    createFAQKeyboard,
    createLanguageKeyboard,
    createInlineKeyboard,
    createBackKeyboard,
    createConfirmationKeyboard,
    removeKeyboard,
    createContactKeyboard,
    createLocationKeyboard
};