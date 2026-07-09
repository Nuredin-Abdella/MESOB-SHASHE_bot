/**
 * Centralized translation dictionary for MESOB Telegram Bot
 * Supports: English (en), Amharic (am), Afaan Oromo (om)
 */

const translations = {
    // Welcome and Initial Setup
    welcome: {
        en: "🏛️ Welcome to MESOB Shashemene!\n\nYour digital gateway to government services.\n\nPlease select your preferred language:",
        am: "🏛️ ወደ መሶብ ሻሸመኔ እንኳን በደህና መጡ!\n\nየመንግስት አገልግሎቶች ዲጂታል መግቢያ።\n\nእባክዎን ተመራጭ ቋንቋዎን ይምረጡ:",
        om: "🏛️ Gara MESOB Shashamane baga nagaan dhuftan!\n\nKarra dijitaalaa tajaajila mootummaa.\n\nMaaloo afaan filattan filadhaa:"
    },

    // Language Selection
    language_selection: {
        en: "🌍 Language Selection\n\n1️⃣ English\n2️⃣ አማርኛ (Amharic)\n3️⃣ Afaan Oromo\n\nReply with 1, 2, or 3:",
        am: "🌍 ቋንቋ ምርጫ\n\n1️⃣ English\n2️⃣ አማርኛ (Amharic)\n3️⃣ Afaan Oromo\n\n1፣ 2 ወይም 3 በመላክ ይመልሱ:",
        om: "🌍 Filannoo Afaanii\n\n1️⃣ English\n2️⃣ አማርኛ (Amharic)\n3️⃣ Afaan Oromo\n\n1, 2 ykn 3 deebisaa:"
    },

    language_changed: {
        en: "✅ Language changed to English",
        am: "✅ ቋንቋ ወደ አማርኛ ተቀይሯል",
        om: "✅ Afaan gara Afaan Oromoo jijjiirame"
    },

    // Main Menu
    main_menu: {
        en: "🏠 MESOB Main Menu\n\nSelect a service:",
        am: "🏠 የመሶብ ዋና ሜኑ\n\nአገልግሎት ይምረጡ:",
        om: "🏠 Baafata Guddaa MESOB\n\nTajaajila filadhaa:"
    },

    // Menu Buttons
    menu_services: {
        en: "🏛️ Services",
        am: "🏛️ አገልግሎቶች",
        om: "🏛️ Tajaajiloota"
    },

    menu_track: {
        en: "🔍 Track Application",
        am: "🔍 ማመልከቻ ክትትል",
        om: "🔍 Iyyannoo Hordofuu"
    },

    menu_howto: {
        en: "📖 How to Use MESOB",
        am: "📖 መሶብን እንዴት መጠቀም",
        om: "📖 Akkamitti MESOB Fayyadamuu"
    },

    menu_register: {
        en: "📱 Register",
        am: "📱 ይመዝገቡ",
        om: "📱 Galmaa'u"
    },

    menu_my_applications: {
        en: "📋 My Applications",
        am: "📋 የእኔ ማመልከቻዎች",
        om: "📋 Iyyannoolee Koo"
    },

    // Registration Flow
    registration_prompt: {
        en: "📱 User Registration\n\nTo access full MESOB services, please register with your phone number.\n\nPlease enter your phone number (format: 0912345678 or +251912345678):",
        am: "📱 የተጠቃሚ ምዝገባ\n\nሙሉ የመሶብ አገልግሎቶችን ለመድረስ፣ እባክዎን በስልክ ቁጥርዎ ይመዝገቡ።\n\nእባክዎን የስልክ ቁጥርዎን ያስገቡ (ቅርጸት: 0912345678 ወይም +251912345678):",
        om: "📱 Galmaa'uu Fayyadamaa\n\nTajaajila MESOB guutuu fayyadamuuf, maaloo lakkoofsa bilbilaa keessanii galmaa'u.\n\nMaaloo lakkoofsa bilbilaa keessanii galchaa (faormaata: 0912345678 ykn +251912345678):"
    },

    registration_phone_invalid: {
        en: "❌ Invalid phone number format. Please use Ethiopian format: 0912345678 or +251912345678",
        am: "❌ የትክክለኛ ያልሆነ የስልክ ቁጥር ቅርጸት። እባክዎን የኢትዮጵያ ቅርጸት ይጠቀሙ: 0912345678 ወይም +251912345678",
        om: "❌ Faormaataa lakkoofsa bilbilaa dogoggora. Maaloo faormaataa Itoophiyaa fayyadami: 0912345678 ykn +251912345678"
    },

    registration_code_sent: {
        en: "✅ Verification code sent to your phone!\n\nPlease enter the 6-digit code you received:",
        am: "✅ የማረጋገጫ ኮድ ወደ ስልክዎ ተልኳል!\n\nእባክዎን የተቀበሉትን 6-ንልጅ ኮድ ያስገቡ:",
        om: "✅ Koodii mirkaneessaa bilbilaa keessan ergameera!\n\nMaaloo koodii lam-lamee ergame galchaa:"
    },

    registration_code_invalid: {
        en: "❌ Invalid verification code. Please try again.",
        am: "❌ የትክክለኛ ያልሆነ የማረጋገጫ ኮድ። እባክዎን እንደገና ይሞክሩ።",
        om: "❌ Koodii mirkaneessaa dogoggora. Maaloo irra deebi'ii yaaliitii."
    },

    registration_code_expired: {
        en: "❌ Verification code expired. Please request a new code.",
        am: "❌ የማረጋገጫ ኮዱ ጊዜ ወጥቷል። እባክዎን አዲስ ኮድ ይጠይቁ።",
        om: "❌ Koodii mirkaneessaa yeroon darbeera. Maaloo koodii haaraa barbaadi."
    },

    registration_success: {
        en: "✅ Registration successful!\n\nYour account is now verified and you can access all MESOB services.\n\n🎉 Welcome to MESOB!",
        am: "✅ ምዝገባ በተሳካ ሁኔታ ተጠናቀቀ!\n\nመለያዎ አሁን ተረጋግጧል እና የመሶብ አገልግሎቶችን ሁሉ ማውቀር ይችላሉ።\n\n🎉 ወደ መሶብ እንኳን በደህና መጡ!",
        om: "✅ Galmaa'uu guutameera!\n\nAkaa keessan amma mirkaneefameera fi tajaajila MESOB guutuu fayyadamuu dandeessa.\n\n🎉 Gara MESOB baga nagaan dhuftan!"
    },

    registration_already_registered: {
        en: "ℹ️ You are already registered with phone number: {phone}",
        am: "ℹ️ አስቀድሞ በስልክ ቁጥር ይመዝገባለችሁ: {phone}",
        om: "ℹ️ Ammaa lakkoofsa bilbilaa {phone} waliin galmaa'eeratte"
    },

    // Application Submission Flow
    application_select_service: {
        en: "📋 New Application\n\nPlease select the service you want to apply for:",
        am: "📋 አዲስ ማመልከቻ\n\nእባክዎን ለማመልከቻ የፈለጉትን አገልግሎት ይምረጡ:",
        om: "📋 Iyyannoo Haaraa\n\nMaaloo tajaajila barbaaddu filadhaa:"
    },

    application_upload_documents: {
        en: "📄 Document Upload\n\nPlease upload the required documents for {service}.\n\nAllowed formats: PDF, DOCX, PNG, JPG, JPEG\nMaximum size: 10MB per file\nMaximum files: 5\n\nUpload your documents now:",
        am: "📄 የሰነዶች ማስረጊያ\n\nእባክዎን ለ {service} የሚያስፈልጉ ሰነዶችን ያስረክ።\n\nየሚፈቀዱ ቅርጸቶች: PDF, DOCX, PNG, JPG, JPEG\nከፍተኛ መጠን: 10MB ለእያንዳንዱ ፋይል\nከፍተኛ ፋይሎች: 5\n\nሰነዶችዎን አሁን ያስረክ:",
        om: "📄 Erga Sanadootaa\n\nMaaloo sanadoota barbaachisaa {service} gaafachuu.\n\nFaawmaatiin fayyadamuu danda'u: PDF, DOCX, PNG, JPG, JPEG\nHanga guutu: 10MB faayilii tokkoon\nHanga faayilii: 5\n\nSanadoota keessan amma ergaa:"
    },

    application_document_uploaded: {
        en: "✅ Document uploaded successfully!\n\nDocument: {filename}\nStatus: Processing\n\nUpload more documents or type 'done' to finish:",
        am: "✅ ሰነድ በተሳካ ሁኔታ ተሰርቷል!\n\nሰነድ: {filename}\nሁኔታ: በስራ ላይ\n\nተጨማሪ ሰነዶችን ያስረክ ወይም ለማጠንቀቅ 'done' ይጻፉ:",
        om: "✅ Sanaduu guutameera ergameera!\n\nSanaduu: {filename}\nHaala: Adeemsa irratti\n\nSanadoota biyya ergaa ykn 'done' dhufuuf barreessaa:"
    },

    application_submitting: {
        en: "⏳ Submitting your application...\n\nPlease wait while we process your documents.",
        am: "⏳ ማመልከቻዎን በማስረክ ላይ...\n\nእባክዎን ሰነዶችዎን እንዴት እንሰራ ይጠብቁ።",
        om: "⏳ Iyyannoo keessan ergaa jiru...\n\nMaaloo sanadoota keessan yeroo hojii siif jiruu deebi'ii eegaa."
    },

    application_submitted: {
        en: "✅ Application submitted successfully!\n\n📋 Tracking Number: {trackingNumber}\n📊 Status: Submitted\n\nYou can track your application status anytime using the 'Track Application' menu.\n\nThank you for using MESOB!",
        am: "✅ ማመልከቻ በተሳካ ሁኔታ ተሰርቷል!\n\n📋 የማጣቀሻ ቁጥር: {trackingNumber}\n📊 ሁኔታ: ተሰርቷል\n\nየማመልከቻ ሁኔታዎን በማንኛውም ጊዜ በ'ማመልከቻ ክትትል' ሜኑ ማከታተል ይችላሉ።\n\nመሶብን ስለተጠቀሙ እናመሰንዝርሎታለን!",
        om: "✅ Iyyannoo guutameera ergameera!\n\n📋 Lakkoofsa Wabiinsa: {trackingNumber}\n📊 Haala: Ergameera\n\nHaala iyyannoo keessan yeroo muraa'een 'Iyyannoo Hordofuu' menyuutti fayyadamuun hordofuu dandeessa.\n\nMESOB fayyadameef galatoomaa!"
    },

    application_error: {
        en: "❌ Application submission failed.\n\nError: {error}\n\nPlease try again or contact support.",
        am: "❌ የማመልከቻ ማስረክ አልተሳካም።\n\nስህተት: {error}\n\nእባክዎን እንደገና ይሞክሩ ወይም ድጋፍን ያነጋግሉ።",
        om: "❌ Ergiin iyyannoo hawweera.\n\nDogoggora: {error}\n\nMaaloo irra deebi'ii yaaliitii ykn deeggarsa quunnamaa."
    },

    // Application Tracking
    application_status: {
        en: "📊 Application Status\n\nTracking Number: {trackingNumber}\nService: {service}\nStatus: {status}\n\nSubmitted: {submittedDate}\nLast Updated: {updatedDate}\n\n{notes}",
        am: "📊 የማመልከቻ ሁኔታ\n\nየማጣቀሻ ቁጥር: {trackingNumber}\nአገልግሎት: {service}\nሁኔታ: {status}\n\nተሰርቷል: {submittedDate}\nየመጨረሻ ዘገባ: {updatedDate}\n\n{notes}",
        om: "📊 Haala Iyyannoo\n\nLakkoofsa Wabiinsa: {trackingNumber}\nTajaajila: {service}\nHaala: {status}\n\nErgameera: {submittedDate}\nYeroon Xumurameera: {updatedDate}\n\n{notes}"
    },

    application_not_found: {
        en: "❌ Application not found.\n\nPlease check your tracking number and try again.",
        am: "❌ ማመልከቻ አልተገኝም።\n\nእባክዎን የማጣቀሻ ቁጥርዎን ይመርምሩ እንደገና ይሞክሩ።",
        om: "❌ Iyyannoo hin argamne.\n\nMaaloo lakkoofsa wabiinsa keessanii mirkaneessi fi irra deebi'ii yaaliitii."
    },

    // My Applications List
    my_applications: {
        en: "📋 My Applications\n\n{applications}\n\nSelect an application to view details or use the main menu.",
        am: "📋 የእኔ ማመልከቻዎች\n\n{applications}\n\nለዝርዝር ማመልከቻ ይምረጡ ወይም ዋና ሜኑን ይጠቀሙ።",
        om: "📋 Iyyannoolee Koo\n\n{applications}\n\nIyyannoo ilaaluuf filadhaa ykn baafata guddaa fayyadami."
    },

    no_applications: {
        en: "📋 No applications yet.\n\nStart a new application from the Services menu.",
        am: "📋 ምንም ማመልከቻ የለም።\n\nከአገልግሎቶች ሜኑ አዲስ ማመልከቻ ይጀምሩ።",
        om: "📋 Iyyannoo hin jiru.\n\nIyyannoo haaraa menyu tajaajilootaa irraa jalqabi."
    },

    menu_contact: {
        en: "☎️ Contact Information",
        am: "☎️ የመገናኛ መረጃ",
        om: "☎️ Odeeffannoo Quunnamtii"
    },

    menu_language: {
        en: "🌍 Change Language",
        am: "🌍 ቋንቋ ይቀይሩ",
        om: "🌍 Afaan Jijjiiruu"
    },

    menu_faq: {
        en: "❓ FAQ & Help",
        am: "❓ ጥያቄዎች እና እገዛ",
        om: "❓ Gaaffii fi Gargaarsa"
    },

    // Services
    services_title: {
        en: "🏛️ Available Services\n\nChoose the service you need:",
        am: "🏛️ ዝግጁ አገልግሎቶች\n\nየሚፈልጉትን አገልግሎት ይምረጡ:",
        om: "🏛️ Tajaajiloota Jiran\n\nTajaajila barbaaddan filadhaa:"
    },

    // Individual Services
    service_national_id: {
        en: "🆔 National ID",
        am: "🆔 ብሔራዊ መታወቂያ",
        om: "🆔 Ragaa Eenyummaa Biyyaalessaa"
    },

    service_passport: {
        en: "📘 Passport",
        am: "📘 ፓስፖርት",
        om: "📘 Paaspoortii"
    },

    service_business: {
        en: "🏢 Business Registration",
        am: "🏢 የንግድ ምዝገባ",
        om: "🏢 Galmee Daldalaa"
    },

    service_tax: {
        en: "💰 Tax Services",
        am: "💰 የግብር አገልግሎቶች",
        om: "💰 Tajaajiloota Gibiraa"
    },

    service_license: {
        en: "🚗 Driving License",
        am: "🚗 የመንዳት ፍቃድ",
        om: "🚗 Waraqaa Konkolaachisaa"
    },

    service_civil_status: {
        en: "📋 Civil Status",
        am: "📋 የማህበራዊ ሁኔታ",
        om: "📋 Haala Hawaasummaa"
    },

    service_urban_planning: {
        en: "🏗️ Urban Planning",
        am: "🏗️ የከተማ እቅድ",
        om: "🏗️ Qabxii Magaalaa"
    },

    service_elections: {
        en: "🗳️ Elections",
        am: "🗳️ ምርጫዎች",
        om: "🗳️ Muraalnoota"
    },

    service_vital_registration: {
        en: "📋 Vital Registration",
        am: "📋 የመሰረታዊ መረጃዎች ምዝገባ",
        om: "📋 Kenna Ragaalee Bu'uuraa"
    },

    service_revenue: {
        en: "💰 Revenue Collection",
        am: "💰 የገቢዎች ስብስብ",
        om: "💰 Sassaabbii Galii"
    },

    service_business_licensing: {
        en: "🏢 Business Licensing",
        am: "🏢 የንግድ ፈቃድ",
        om: "🏢 Kenna Hayyamaa Daldalaa"
    },

    service_cooperatives: {
        en: "🤝 Cooperatives & Enterprises",
        am: "🤝 ህብረት ስራ ማህበራትና ኢንተርፕራይዞች",
        om: "🤝 Waldaalee fi Intarpiraayizoota"
    },

    service_land: {
        en: "🏞️ Land Services",
        am: "🏞️ የመሬት አገልግሎቶች",
        om: "🏞️ Kenna Tajaajila Lafaa"
    },

    service_investment: {
        en: "💼 Investment Services",
        am: "💼 የኢንቨስትመንት አገልግሎቶች",
        om: "💼 Tajaajila Investimentii"
    },

    service_document_auth: {
        en: "📋 Document Authentication",
        am: "📋 የሰነዶች ማረጋገጫ",
        om: "📋 Mirkaneessa Sanadootaa"
    },

    service_transport: {
        en: "🚛 Transport & Traffic",
        am: "🚛 የትራንስፖርትና ትራፊክ",
        om: "🚛 Geejjibaa fi Traafikaa"
    },

    service_construction: {
        en: "🏗️ Construction & Design",
        am: "🏗️ የግንባታና ዲዛይን",
        om: "🏗️ Ijaarshaa fi Dizaayinii"
    },

    service_sanitation: {
        en: "🌿 Sanitation & Municipal",
        am: "🌿 የከተማ ፅዳትና ማዘጋጃ ቤታዊ",
        om: "🌿 Qulqullina fi Tajaajila Bulchiinsa"
    },

    service_social: {
        en: "👥 Social Affairs",
        am: "👥 የማህበራዊ ጉዳዮች",
        om: "👥 Dhimma Hawaasummaa"
    },

    // Service Details
    national_id_info: {
        en: "🆔 National ID Service\n\n📋 Required Documents:\n• Birth Certificate\n• 2 Photos\n• Kebele Letter\n\n⏱️ Processing Time: 3-5 days\n💵 Fee: 25 ETB\n\n📍 Visit MESOB office with documents",
        am: "🆔 የብሔራዊ መታወቂያ አገልግሎት\n\n📋 የሚያስፈልጉ ሰነዶች:\n• የልደት ሰርተፍኬት\n• 2 ፎቶግራፎች\n• የቀበሌ ደብዳቤ\n\n⏱️ የስራ ጊዜ: 3-5 ቀናት\n💵 ክፍያ: 25 ብር\n\n📍 ሰነዶችዎን ይዘው የመሶብ ቢሮ ይምጡ",
        om: "🆔 Tajaajila Ragaa Eenyummaa Biyyaalessaa\n\n📋 Sanadoota Barbaachisan:\n• Ragaa Dhaloota\n• Suuraa 2\n• Xalayaa Qabeelee\n\n⏱️ Yeroo Hojii: Guyyaa 3-5\n💵 Kaffaltii: Birr 25\n\n📍 Sanadoota keessan fudhadhuttee waajjira MESOB kottaa"
    },

    passport_info: {
        en: "📘 Passport Service\n\n📋 Required Documents:\n• National ID\n• Birth Certificate\n• 4 Photos (passport size)\n• Application Form\n\n⏱️ Processing Time: 15-20 days\n💵 Fee: 1,200 ETB\n\n📍 Submit at MESOB passport office",
        am: "📘 የፓስፖርት አገልግሎት\n\n📋 የሚያስፈልጉ ሰነዶች:\n• ብሔራዊ መታወቂያ\n• የልደት ሰርተፍኬት\n• 4 ፎቶግራፎች (የፓስፖርት ሳይዝ)\n• የማመልከቻ ቅጽ\n\n⏱️ የስራ ጊዜ: 15-20 ቀናት\n💵 ክፍያ: 1,200 ብር\n\n📍 በመሶብ ፓስፖርት ቢሮ ያስገቡ",
        om: "📘 Tajaajila Paaspoortii\n\n📋 Sanadoota Barbaachisan:\n• Ragaa Eenyummaa Biyyaalessaa\n• Ragaa Dhaloota\n• Suuraa 4 (passport size)\n• Unka Iyyannoo\n\n⏱️ Yeroo Hojii: Guyyaa 15-20\n💵 Kaffaltii: Birr 1,200\n\n📍 Waajjira paaspoortii MESOB keessatti galchaa"
    },

    civil_status_info: {
        en: "📋 Civil Status Service\n\n📋 Services Available:\n• Birth Registration\n• Marriage Registration\n• Divorce Registration\n• Death Registration\n\n⏱️ Processing Time: 1-3 days\n💵 Fee: 50-200 ETB\n\n📍 Visit Vital Registration office (Fooddaa 1)",
        am: "📋 የማህበራዊ ሁኔታ አገልግሎት\n\n📋 ዝግጁ አገልግሎቶች:\n• የልደት ምዝገባ\n• የጋብቻ ምዝገባ\n• የፍቺ ምዝገባ\n• የሞት ምዝገባ\n\n⏱️ የስራ ጊዜ: 1-3 ቀናት\n💵 ክፍያ: 50-200 ብር\n\n📍 የመሰረታዊ መረጃዎች ምዝገባ ቢሮ (ፎቅ 1) ይጎብኙ",
        om: "📋 Tajaajila Haala Hawaasummaa\n\n📋 Tajaajiloota Jiran:\n• Kenna Dhalootaa\n• Kenna Gaa'elaa\n• Kenna Hiikaa Gaa'elaa\n• Kenna Du'aa\n\n⏱️ Yeroo Hojii: Guyyaa 1-3\n💵 Kaffaltii: Birr 50-200\n\n📍 Waajjira Kenna Ragaalee Bu'uuraa (Fooddaa 1) kottaa"
    },

    urban_planning_info: {
        en: "🏗️ Urban Planning Service\n\n📋 Services Available:\n• Building Permits\n• Land Use Planning\n• Zoning Approvals\n• Site Inspections\n\n⏱️ Processing Time: 7-14 days\n💵 Fee: 500-5,000 ETB\n\n📍 Visit Urban Planning office",
        am: "🏗️ የከተማ እቅድ አገልግሎት\n\n📋 ዝግጁ አገልግሎቶች:\n• የግንባታ ፈቃዶች\n• የመሬት አጠቃቀም እቅድ\n• የክልል ማጽደቂያ\n• የቦታ አስተዳደር\n\n⏱️ የስራ ጊዜ: 7-14 ቀናት\n💵 ክፍያ: 500-5,000 ብር\n\n📍 የከተማ እቅድ ቢሮ ይጎብኙ",
        om: "🏗️ Tajaajila Qabxii Magaalaa\n\n📋 Tajaajiloota Jiran:\n• Hayyama Ijaarsaa\n• Qabxii Fayyadamaa Lafaa\n• Mirkaneessa Zooningii\n• Raggaachuu Bakka\n\n⏱️ Yeroo Hojii: Guyyaa 7-14\n💵 Kaffaltii: Birr 500-5,000\n\n📍 Waajjira Qabxii Magaalaa kottaa"
    },

    elections_info: {
        en: "🗳️ Elections Service\n\n📋 Services Available:\n• Voter Registration\n• Election Information\n• Polling Station Locations\n• Voter ID Cards\n\n⏱️ Processing Time: 1-7 days\n💵 Fee: Free\n\n📍 Visit Elections office",
        am: "🗳️ የምርጫ አገልግሎት\n\n📋 ዝግጁ አገልግሎቶች:\n• የመምረጫ ምዝገባ\n• የምርጫ መረጃ\n• የመምረጫ ቦታዎች\n• የመምረጫ መታወቂያ ካርድ\n\n⏱️ የስራ ጊዜ: 1-7 ቀናት\n💵 ክፍያ: ነፃ\n\n📍 የምርጫ ቢሮ ይጎብኙ",
        om: "🗳️ Tajaajila Muraalnoota\n\n📋 Tajaajiloota Jiran:\n• Kenna Muraalee\n• Odeeffannoo Muraalnoota\n• Iddoolee Muraalee\n• Kaardii Muraalee\n\n⏱️ Yeroo Hojii: Guyyaa 1-7\n💵 Kaffaltii: Bilisa\n\n📍 Waajjira Muraalnoota kottaa"
    },

    vital_registration_info: {
        en: "📋 Vital Registration (Fooddaa 1)\n\n📋 Services Available:\n• Birth Certificates\n• Marriage Certificates\n• Divorce Certificates\n• Death Certificates\n\n⏱️ Processing Time: 1-3 days\n💵 Fee: 50-200 ETB\n\n📍 Visit Fooddaa 1 at MESOB",
        am: "📋 የመሰረታዊ መረጃዎች ምዝገባ (ፎቅ 1)\n\n📋 ዝግጁ አገልግሎቶች:\n• የልደት ምስክር ወረቀቶች\n• የጋብቻ ምስክር ወረቀቶች\n• የፍቺ ምስክር ወረቀቶች\n• የሞት ምስክር ወረቀቶች\n\n⏱️ የስራ ጊዜ: 1-3 ቀናት\n💵 ክፍያ: 50-200 ብር\n\n📍 በመሶብ ፎቅ 1 ይጎብኙ",
        om: "📋 Kenna Ragaalee Bu'uuraa (Fooddaa 1)\n\n📋 Tajaajiloota Jiran:\n• Ragaalee Dhalootaa\n• Ragaalee Gaa'elaa\n• Ragaalee Hiikaa Gaa'elaa\n• Ragaalee Du'aa\n\n⏱️ Yeroo Hojii: Guyyaa 1-3\n💵 Kaffaltii: Birr 50-200\n\n📍 Fooddaa 1 MESOB keessatti kottaa"
    },

    revenue_info: {
        en: "💰 Revenue Collection (Fooddaa 2)\n\n📋 Services Available:\n• Tax Registration\n• Tax Payments\n• Invoice Permits\n• Revenue Assessments\n\n⏱️ Processing Time: 1-5 days\n💵 Fee: Varies by service\n\n📍 Visit Fooddaa 2 at MESOB",
        am: "💰 የገቢዎች ስብስብ (ፎቅ 2)\n\n📋 ዝግጁ አገልግሎቶች:\n• የታክስ ምዝገባ\n• የታክስ ክፍያ\n• የደረሰኝ ፈቃዶች\n• የገቢ ማገኘት\n\n⏱️ የስራ ጊዜ: 1-5 ቀናት\n💵 ክፍያ: በአገልግሎቱ ይለያያል\n\n📍 በመሶብ ፎቅ 2 ይጎብኙ",
        om: "💰 Sassaabbii Galii (Fooddaa 2)\n\n📋 Tajaajiloota Jiran:\n• Kenna Gibiraa\n• Kaffaltii Gibiraa\n• Hayyama Bilbilaa\n• Raggaachuu Sassaabbii\n\n⏱️ Yeroo Hojii: Guyyaa 1-5\n💵 Kaffaltii: Tajaajila irratti hundaa'a\n\n📍 Fooddaa 2 MESOB keessatti kottaa"
    },

    business_licensing_info: {
        en: "🏢 Business Licensing (Fooddaa 3)\n\n📋 Services Available:\n• New Business Licenses\n• License Renewals\n• Name Changes\n• Business Closures\n\n⏱️ Processing Time: 3-7 days\n💵 Fee: 500-2,000 ETB\n\n📍 Visit Fooddaa 3 at MESOB",
        am: "🏢 የንግድ ፈቃድ (ፎቅ 3)\n\n📋 ዝግጁ አገልግሎቶች:\n• አዲስ የንግድ ፈቃዶች\n• ፈቃድ እደሳዎች\n• የስም ለውጦች\n• የንግድ መዝጊያዎች\n\n⏱️ የስራ ጊዜ: 3-7 ቀናት\n💵 ክፍያ: 500-2,000 ብር\n\n📍 በመሶብ ፎቅ 3 ይጎብኙ",
        om: "🏢 Kenna Hayyamaa Daldalaa (Fooddaa 3)\n\n📋 Tajaajiloota Jiran:\n• Hayyamni Haaraa Daldalaa\n• Haaromsa Hayyamaa\n• Jijjiirraa Maqaa\n• Cabsiin Daldalaa\n\n⏱️ Yeroo Hojii: Guyyaa 3-7\n💵 Kaffaltii: Birr 500-2,000\n\n📍 Fooddaa 3 MESOB keessatti kottaa"
    },

    cooperatives_info: {
        en: "🤝 Cooperatives & Enterprises (Fooddaa 4)\n\n📋 Services Available:\n• Cooperative Registration\n• Small Enterprise Support\n• Business Development Services\n• Training Programs\n\n⏱️ Processing Time: 5-10 days\n💵 Fee: 200-1,000 ETB\n\n📍 Visit Fooddaa 4 at MESOB",
        am: "🤝 ህብረት ስራ ማህበራትና ኢንተርፕራይዞች (ፎቅ 4)\n\n📋 ዝግጁ አገልግሎቶች:\n• የህብረት ምዝገባ\n• የጥቃቅን ኢንተርፕራይዝ ድጋፍ\n• የንግድ ልማት አገልግሎቶች\n• የስልጠና ፕሮግራሞች\n\n⏱️ የስራ ጊዜ: 5-10 ቀናት\n💵 ክፍያ: 200-1,000 ብር\n\n📍 በመሶብ ፎቅ 4 ይጎብኙ",
        om: "🤝 Waldaalee fi Intarpiraayizoota (Fooddaa 4)\n\n📋 Tajaajiloota Jiran:\n• Kenna Waldaa\n• Deeggarsa Intarpiraayizii Xixiqqaa\n• Tajaajila Ijaarsa Daldalaa\n• Barreessota Baraachisaa\n\n⏱️ Yeroo Hojii: Guyyaa 5-10\n💵 Kaffaltii: Birr 200-1,000\n\n📍 Fooddaa 4 MESOB keessatti kottaa"
    },

    land_info: {
        en: "🏞️ Land Services (Fooddaa 5)\n\n📋 Services Available:\n• Property Transfers\n• Building Permits\n• Land Title Registration\n• Survey Services\n\n⏱️ Processing Time: 7-21 days\n💵 Fee: 1,000-10,000 ETB\n\n📍 Visit Fooddaa 5 at MESOB",
        am: "🏞️ የመሬት አገልግሎቶች (ፎቅ 5)\n\n📋 ዝግጁ አገልግሎቶች:\n• የንብረት ማስተላለፍ\n• የግንባታ ፈቃዶች\n• የመሬት ርስት ምዝገባ\n• የመስመር አገልግሎቶች\n\n⏱️ የስራ ጊዜ: 7-21 ቀናት\n💵 ክፍያ: 1,000-10,000 ብር\n\n📍 በመሶብ ፎቅ 5 ይጎብኙ",
        om: "🏞️ Kenna Tajaajila Lafaa (Fooddaa 5)\n\n📋 Tajaajiloota Jiran:\n• Dabarsaa Qabiyyee\n• Hayyama Ijaarsaa\n• Kenna Ragaa Lafaa\n• Tajaajila Sarwee\n\n⏱️ Yeroo Hojii: Guyyaa 7-21\n💵 Kaffaltii: Birr 1,000-10,000\n\n📍 Fooddaa 5 MESOB keessatti kottaa"
    },

    investment_info: {
        en: "💼 Investment Services (Fooddaa 6)\n\n📋 Services Available:\n• Local Investment Permits\n• Foreign Investment Permits\n• Investment Incentives\n• Business Support\n\n⏱️ Processing Time: 5-15 days\n💵 Fee: 1,000-5,000 ETB\n\n📍 Visit Fooddaa 6 at MESOB",
        am: "💼 የኢንቨስትመንት አገልግሎቶች (ፎቅ 6)\n\n📋 ዝግጁ አገልግሎቶች:\n• የሀገር ውስጥ ኢንቨስትመንት ፈቃዶች\n• የውጭ ኢንቨስትመንት ፈቃዶች\n• የኢንቨስትመንት ጉልህ አስተዳደሮች\n• የንግድ ድጋፍ\n\n⏱️ የስራ ጊዜ: 5-15 ቀናት\n💵 ክፍያ: 1,000-5,000 ብር\n\n📍 በመሶብ ፎቅ 6 ይጎብኙ",
        om: "💼 Tajaajila Investimentii (Fooddaa 6)\n\n📋 Tajaajiloota Jiran:\n• Hayyama Investimenti Biyyaa Keessaa\n• Hayyama Investimenti Alaa\n• Faayidaa Investimenti\n• Deeggarsa Daldalaa\n\n⏱️ Yeroo Hojii: Guyyaa 5-15\n💵 Kaffaltii: Birr 1,000-5,000\n\n📍 Fooddaa 6 MESOB keessatti kottaa"
    },

    document_auth_info: {
        en: "📋 Document Authentication (Fooddaa 7)\n\n📋 Services Available:\n• Document Notarization\n• Certificate Authentication\n• Legal Document Verification\n• Translation Certification\n\n⏱️ Processing Time: 1-3 days\n💵 Fee: 100-500 ETB\n\n📍 Visit Fooddaa 7 at MESOB",
        am: "📋 የሰነዶች ማረጋገጫ (ፎቅ 7)\n\n📋 ዝግጁ አገልግሎቶች:\n• የሰነዶች ኖታራይዜሽን\n• የምስክር ወረቀቶች ማረጋገጫ\n• የህጋዊ ሰነዶች ማረጋገጫ\n• የትርጉም ማረጋገጫ\n\n⏱️ የስራ ጊዜ: 1-3 ቀናት\n💵 ክፍያ: 100-500 ብር\n\n📍 በመሶብ ፎቅ 7 ይጎብኙ",
        om: "📋 Mirkaneessa Sanadoota (Fooddaa 7)\n\n📋 Tajaajiloota Jiran:\n• Nootaaraayizeshinii Sanadootaa\n• Mirkaneessa Ragaalee\n• Mirkaneessa Sanadoota Seeraa\n• Mirkaneessa Hiikkaa\n\n⏱️ Yeroo Hojii: Guyyaa 1-3\n💵 Kaffaltii: Birr 100-500\n\n📍 Fooddaa 7 MESOB keessatti kottaa"
    },

    transport_info: {
        en: "🚛 Transport & Traffic (Fooddaa 9)\n\n📋 Services Available:\n• Vehicle Registration\n• Driver's License Services\n• Traffic Permits\n• Vehicle Inspections\n\n⏱️ Processing Time: 3-7 days\n💵 Fee: 200-2,000 ETB\n\n📍 Visit Fooddaa 9 at MESOB",
        am: "🚛 የትራንስፖርትና ትራፊክ (ፎቅ 9)\n\n📋 ዝግጁ አገልግሎቶች:\n• የመኪና ምዝገባ\n• የሹፌር ፈቃድ አገልግሎቶች\n• የትራፊክ ፈቃዶች\n• የመኪና አስተዳደር\n\n⏱️ የስራ ጊዜ: 3-7 ቀናት\n💵 ክፍያ: 200-2,000 ብር\n\n📍 በመሶብ ፎቅ 9 ይጎብኙ",
        om: "🚛 Geejjibaa fi Traafikaa (Fooddaa 9)\n\n📋 Tajaajiloota Jiran:\n• Kenna Mootora\n• Tajaajila Waraqaa Konkolaachisaa\n• Hayyama Traafikaa\n• Raggaachuu Mootora\n\n⏱️ Yeroo Hojii: Guyyaa 3-7\n💵 Kaffaltii: Birr 200-2,000\n\n📍 Fooddaa 9 MESOB keessatti kottaa"
    },

    construction_info: {
        en: "🏗️ Construction & Design (Fooddaa 10)\n\n📋 Services Available:\n• Building Plan Approvals\n• Design Reviews\n• Construction Permits\n• Safety Inspections\n\n⏱️ Processing Time: 7-14 days\n💵 Fee: 500-3,000 ETB\n\n📍 Visit Fooddaa 10 at MESOB",
        am: "🏗️ የግንባታና ዲዛይን (ፎቅ 10)\n\n📋 ዝግጁ አገልግሎቶች:\n• የግንባታ እቅድ ማጽደቂያ\n• የዲዛይን ግምገር\n• የግንባታ ፈቃዶች\n• የፀጉር አስተዳደር\n\n⏱️ የስራ ጊዜ: 7-14 ቀናት\n💵 ክፍያ: 500-3,000 ብር\n\n📍 በመሶብ ፎቅ 10 ይጎብኙ",
        om: "🏗️ Ijaarshaa fi Dizaayinii (Fooddaa 10)\n\n📋 Tajaajiloota Jiran:\n• Mirkaneessa Qabxii Ijaarsaa\n• Raggaachuu Dizaayinii\n• Hayyama Ijaarsaa\n• Raggaachuu Dabarsaa\n\n⏱️ Yeroo Hojii: Guyyaa 7-14\n💵 Kaffaltii: Birr 500-3,000\n\n📍 Fooddaa 10 MESOB keessatti kottaa"
    },

    sanitation_info: {
        en: "🌿 Sanitation & Municipal (Fooddaa 11)\n\n📋 Services Available:\n• Waste Management\n• Sanitation Services\n• Municipal Permits\n• Environmental Health\n\n⏱️ Processing Time: 3-7 days\n💵 Fee: 100-1,000 ETB\n\n📍 Visit Fooddaa 11 at MESOB",
        am: "🌿 የከተማ ፅዳትና ማዘጋጃ ቤታዊ (ፎቅ 11)\n\n📋 ዝግጁ አገልግሎቶች:\n• የቆሻሻ አስተዳደር\n• የጤና አገልግሎቶች\n• የከተማ ፈቃዶች\n• የአካባቢ ጤና\n\n⏱️ የስራ ጊዜ: 3-7 ቀናት\n💵 ክፍያ: 100-1,000 ብር\n\n📍 በመሶብ ፎቅ 11 ይጎብኙ",
        om: "🌿 Qulqullina fi Tajaajila Bulchiinsa (Fooddaa 11)\n\n📋 Tajaajiloota Jiran:\n• Haaluu Qabeessaa\n• Tajaajila Qulqullinaa\n• Hayyama Bulchiinsa Magaalaa\n• Fayya Biyyoo\n\n⏱️ Yeroo Hojii: Guyyaa 3-7\n💵 Kaffaltii: Birr 100-1,000\n\n📍 Fooddaa 11 MESOB keessatti kottaa"
    },

    social_info: {
        en: "👥 Social Affairs (Fooddaa 12)\n\n📋 Services Available:\n• Social Welfare Programs\n• Women's Services\n• Children's Services\n• Disability Support\n\n⏱️ Processing Time: 3-10 days\n💵 Fee: Free or nominal\n\n📍 Visit Fooddaa 12 at MESOB",
        am: "👥 የማህበራዊ ጉዳዮች (ፎቅ 12)\n\n📋 ዝግጁ አገልግሎቶች:\n• የማህበራዊ አስተዳደር ፕሮግራሞች\n• የሴቶች አገልግሎቶች\n• የህጻናት አገልግሎቶች\n• የአካል ጉዳተኞች ድጋፍ\n\n⏱️ የስራ ጊዜ: 3-10 ቀናት\n💵 ክፍያ: ነፃ ወይም ትንሽ\n\n📍 በመሶብ ፎቅ 12 ይጎብኙ",
        om: "👥 Dhimma Hawaasummaa (Fooddaa 12)\n\n📋 Tajaajiloota Jiran:\n• Piroogiraamoota Dargaggummaa Hawaasaa\n• Tajaajila Dubartootaa\n• Tajaajila Daa'immanii\n• Deeggarsa Namoota Madaa Qaban\n\n⏱️ Yeroo Hojii: Guyyaa 3-10\n💵 Kaffaltii: Bilisa ykn xiqqaa\n\n📍 Fooddaa 12 MESOB keessatti kottaa"
    },

    // Track Application
    track_prompt: {
        en: "🔍 Track Your Application\n\nPlease enter your reference number:",
        am: "🔍 ማመልከቻዎን ይከታተሉ\n\nእባክዎን የማጣቀሻ ቁጥርዎን ያስገቡ:",
        om: "🔍 Iyyannoo Keessan Hordofaa\n\nMaaloo lakkoofsa wabiinsa keessanii galchaa:"
    },

    track_result: {
        en: "📊 Application Status\n\nReference: {ref}\nStatus: In Progress ⏳\nExpected completion: 3-5 business days\n\nYou will be notified when ready for collection.",
        am: "📊 የማመልከቻ ሁኔታ\n\nማጣቀሻ: {ref}\nሁኔታ: በሂደት ላይ ⏳\nሊጠናቀቅ የሚችልበት ጊዜ: 3-5 የስራ ቀናት\n\nለመሰብሰብ ሲዘጋጅ ማሳወቂያ ይደርሳሎታል።",
        om: "📊 Haala Iyyannoo\n\nWabiin: {ref}\nHaala: Adeemsa irratti ⏳\nYeroon xumuramu: Guyyoota hojii 3-5\n\nYommuu fuudhachuuf qophaaʼu beeksifama siif ergama."
    },

    // How to Use MESOB
    howto_content: {
        en: "📖 How to Use MESOB Services\n\n1️⃣ Choose Your Service\nSelect the government service you need from our menu\n\n2️⃣ Prepare Documents\nGather all required documents as listed\n\n3️⃣ Visit Office\nCome to MESOB office with your documents\n\n4️⃣ Submit Application\nFill forms and submit with required documents\n\n5️⃣ Make Payment\nPay the service fee at our payment counter\n\n6️⃣ Track Status\nUse this bot to track your application progress\n\n7️⃣ Collect Result\nReturn to collect your documents when notified",
        am: "📖 የመሶብ አገልግሎቶችን እንዴት መጠቀም\n\n1️⃣ አገልግሎትዎን ይምረጡ\nከሜኑ የሚፈልጉትን የመንግስት አገልግሎት ይምረጡ\n\n2️⃣ ሰነዶችን ይዘጋጁ\nእንደተዘረዘረው ሁሉንም አስፈላጊ ሰነዶች ይሰበስቡ\n\n3️⃣ ቢሮውን ይጎብኙ\nሰነዶችዎን ይዘው የመሶብ ቢሮ ይምጡ\n\n4️⃣ ማመልከቻ ያስገቡ\nቅፆችን ይሙሉ እና ከሚፈለጉ ሰነዶች ጋር ያስገቡ\n\n5️⃣ ክፍያ ይክፈሉ\nበክፍያ ቆጣሪያችን የአገልግሎት ክፍያውን ይክፈሉ\n\n6️⃣ ሁኔታን ይከታተሉ\nየማመልከቻ እድገትዎን ለመከታተል ይህንን ቦት ይጠቀሙ\n\n7️⃣ ውጤት ይሰብስቡ\nማሳወቂያ ሲደርሰዎ ሰነዶችዎን ለመሰብሰብ ይመለሱ",
        om: "📖 Akkamitti Tajaajiloota MESOB Fayyadamuu\n\n1️⃣ Tajaajila Keessan Filadhaa\nBaafata keessaa tajaajila mootummaa barbaaddan filadhaa\n\n2️⃣ Sanadoota Qopheessaa\nSanadoota barbaachisan hunda akka tarreeffametti walitti qabaa\n\n3️⃣ Waajjira Daawwadaa\nSanadoota keessan fudhadhuttee waajjira MESOB kottaa\n\n4️⃣ Iyyannoo Galchaa\nUnkalee guutaatii sanadoota barbaachisan waliin galchaa\n\n5️⃣ Kaffaltii Godhaa\nKaawuntara kaffaltii keenyaatti kaffaltii tajaajilaa kaffalaa\n\n6️⃣ Haala Hordofaa\nAdeemsa iyyannoo keessanii hordofuuf bot kana fayyadamaa\n\n7️⃣ Bu'aa Fuudhaa\nBeeksifamni yeroo dhufu sanadoota keessan fuudhuuf deebi'aa"
    },

    // Contact Information
    contact_info: {
        en: "☎️ Contact Information\n\n📍 Address:\nMESOB Shashemene Office\nShashemene, Oromia Region\nEthiopia\n\n📞 Phone: +251-46-110-0000\n📧 Email: info@mesobshashe.gov.et\n🌐 Website: https://mesobshashe.gov.et\n\n⏰ Office Hours:\nMonday - Friday: 8:30 AM - 5:00 PM\nSaturday: 8:30 AM - 12:00 PM\nSunday: Closed",
        am: "☎️ የመገናኛ መረጃ\n\n📍 አድራሻ:\nየመሶብ ሻሸመኔ ቢሮ\nሻሸመኔ፣ የኦሮሚያ ክልል\nኢትዮጵያ\n\n📞 ስልክ: +251-46-110-0000\n📧 ኢሜይል: info@mesobshashe.gov.et\n🌐 ድህረ ገጽ: https://mesobshashe.gov.et\n\n⏰ የስራ ሰአት:\nሰኞ - አርብ: ከ8:30 ጠዋት እስከ 5:00 ከሰአት\nቅዳሜ: ከ8:30 ጠዋት እስከ 12:00 ከሰአት\nእሁድ: ዝግ",
        om: "☎️ Odeeffannoo Quunnamtii\n\n📍 Teessoo:\nWaajjira MESOB Shashamane\nShashamane, Naannoo Oromiyaa\nItoophiyaa\n\n📞 Bilbilaa: +251-46-110-0000\n📧 Iimeelii: info@mesobshashe.gov.et\n🌐 Marsariitii: https://mesobshashe.gov.et\n\n⏰ Sa'aatii Hojii:\nWiixata - Jimaata: 8:30 ganama hanga 5:00 galgala\nSanbata: 8:30 ganama hanga 12:00 waareeffama\nDilbata: Cufaa"
    },

    // Greetings and Common Responses
    greeting_hello: {
        en: "Hello! 👋 Welcome to MESOB Shashemene bot. How can I help you today?",
        am: "ሰላም! 👋 ወደ የመሶብ ሻሸመኔ ቦት እንኳን በደህና መጡ። ዛሬ እንዴት ልረዳዎ?",
        om: "Akkam! 👋 Gara bot MESOB Shashamane baga nagaan dhuftan. Har'a akkamiin isin gargaaruu danda'a?"
    },

    // Error Messages
    invalid_option: {
        en: "❌ Invalid option. Please use the menu buttons or type a valid command.",
        am: "❌ ትክክል ያልሆነ ምርጫ። እባክዎን የሜኑ ቁልፎችን ይጠቀሙ ወይም ትክክለኛ ትዕዛዝ ይተይቡ።",
        om: "❌ Filannoon sirrii miti. Maaloo qabduu baafataa fayyadamaa ykn ajaja sirrii barreessaa."
    },

    error_occurred: {
        en: "❌ Something went wrong. Please try again or contact support.",
        am: "❌ የሆነ ችግር ተከሰተ። እባክዎን እንደገና ይሞክሩ ወይም ድጋፍን ያነጋግሩ።",
        om: "❌ Dogoggorri tokko uumame. Maaloo deebisaa yaali ykn deeggarsa quunnamaa."
    },

    back_to_menu: {
        en: "🔙 Back to Main Menu",
        am: "🔙 ወደ ዋና ሜኑ ተመለስ",
        om: "🔙 Gara Baafata Guddaatti Deebi'i"
    },

    track_not_found: {
        en: "❌ Application not found. Please check your tracking number.",
        am: "❌ ማመልከቻ አልተገኘም። እባክዎን የመከታተያ ቁጥርዎን ያረጋግጡ።",
        om: "❌ Iyyannoon hin argamne. Maaloo lakkoofsa hordoffii keessanii mirkanee"
    },

    // FAQ Section
    faq_title: {
        en: "❓ Frequently Asked Questions\n\nChoose a topic:",
        am: "❓ በተደጋጋሚ የሚጠየቁ ጥያቄዎች\n\nርእስ ይምረጡ:",
        om: "❓ Gaaffii Yeroo Baay'ee Gaafataman\n\nMata duree filadhaa:"
    },

    // FAQ Categories
    faq_documents: {
        en: "📄 Required Documents",
        am: "📄 የሚፈለጉ ሰነዶች",
        om: "📄 Sanadoota Barbaachisan"
    },

    faq_fees: {
        en: "💰 Service Fees",
        am: "💰 የአገልግሎት ክፍያ",
        om: "💰 Kaffaltii Tajaajilaaf"
    },

    faq_timing: {
        en: "⏰ Processing Times",
        am: "⏰ የስራ ሰአት",
        om: "⏰ Sa'aatii Hojii"
    },

    faq_general: {
        en: "🔍 General Questions",
        am: "🔍 አጠቃላይ ጥያቄዎች",
        om: "🔍 Gaaffii Waliigalaa"
    },

    // FAQ Content - Documents
    faq_documents_content: {
        en: "📄 Required Documents FAQ\n\n❓ What documents do I need for National ID?\n✅ Birth certificate, 2 photos, Kebele letter\n\n❓ What about passport documents?\n✅ National ID, birth certificate, 4 passport photos, application form\n\n❓ Do I need originals?\n✅ Yes, bring original documents plus photocopies\n\n❓ What if I lost my birth certificate?\n✅ Get a replacement from the Civil Registration office first\n\n❓ Photo requirements?\n✅ Recent photos, white background, no glasses or hats",
        am: "📄 የሚፈለጉ ሰነዶች ጥያቄዎች\n\n❓ ለብሔራዊ መታወቂያ ምን ሰነዶች ያስፈልጋሉ?\n✅ የልደት ሰርተፍኬት፣ 2 ፎቶ፣ የቀበሌ ደብዳቤ\n\n❓ ለፓስፖርት ሰነዶች ስለ?\n✅ ብሔራዊ መታወቂያ፣ የልደት ሰርተፍኬት፣ 4 የፓስፖርት ፎቶ፣ የማመልከቻ ቅጽ\n\n❓ ዋናዎቹ ያስፈልጋሉ?\n✅ አዎ፣ ዋናዎቹን ሰነዶች እና ፎቶኮፒዎችን ይዘው ይምጡ\n\n❓ የልደት ሰርተፍኬቴ ካጣሁ?\n✅ መጀመሪያ ከዜግነት ምዝገባ ቢሮ ምትክ ያግኙ\n\n❓ የፎቶ መስፈርቶች?\n✅ የቅርብ ጊዜ ፎቶ፣ ነጭ ዳራ፣ መነፅር ወይም ኮፍያ የለሽ",
        om: "📄 Gaaffii Sanadoota Barbaachisan\n\n❓ Ragaa eenyummaa biyyaalessaaf sanadoota kam barbaachisa?\n✅ Ragaa dhaloota, suuraa 2, xalayaa qabeelee\n\n❓ Sanadoota paaspoortii hoo?\n✅ Ragaa eenyummaa biyyaalessaa, ragaa dhaloota, suuraa paaspoortii 4, unka iyyannoo\n\n❓ Sanadooti jalqabaa barbaachisa?\n✅ Eeyyee, sanadoota jalqabaa fi kooppii isaanii fudhadhaa kaa\n\n❓ Ragaan dhaloota koo yoo bade?\n✅ Jalqaba waajjira galmee lammiitootaa irraa bakka bu'aa fuudhaa\n\n❓ Ulaagaalee suuraa?\n✅ Suuraa dhiyeenyaa, duubdeessoo adii, ija beekaamsaa ykn kofiyyaa hin qabaatin"
    },

    // FAQ Content - Fees
    faq_fees_content: {
        en: "💰 Service Fees FAQ\n\n❓ How much does a National ID cost?\n✅ 25 ETB for new application\n\n❓ Passport fees?\n✅ 1,200 ETB for regular processing\n\n❓ Business registration cost?\n✅ 500-2,000 ETB (depends on business type)\n\n❓ Can I pay by card?\n✅ Yes, we accept cash and cards\n\n❓ Are there express fees?\n✅ Yes, 50% extra for urgent processing\n\n❓ Renewal fees different?\n✅ Usually 50% of new application fee",
        am: "💰 የአገልግሎት ክፍያ ጥያቄዎች\n\n❓ ብሔራዊ መታወቂያ ምን ያህል ይከፈላል?\n✅ ለአዲስ ማመልከቻ 25 ብር\n\n❓ የፓስፖርት ክፍያ?\n✅ ለመደበኛ ሂደት 1,200 ብር\n\n❓ የንግድ ምዝገባ ዋጋ?\n✅ 500-2,000 ብር (በንግድ አይነት ይለያያል)\n\n❓ በካርድ መክፈል እችላለሁ?\n✅ አዎ፣ ጥሬ ገንዘብ እና ካርድ እንቀበላለን\n\n❓ የአጣዳፊ ክፍያዎች አሉ?\n✅ አዎ፣ ለአስቸኳይ ሂደት 50% ተጨማሪ\n\n❓ የታደስ ክፍያ የተለየ ነው?\n✅ አብዛኛውን ጊዜ የአዲስ ማመልከቻ ክፍያ 50%",
        om: "💰 Gaaffii Kaffaltii Tajaajilaa\n\n❓ Ragaan eenyummaa biyyaalessaa meeqa kaffalama?\n✅ Iyyannoo haaraaf Birr 25\n\n❓ Kaffaltiin paaspoortii?\n✅ Adeemsa idileef Birr 1,200\n\n❓ Gatiin galmee daldalaa?\n✅ Birr 500-2,000 (gosa daldalaa irratti hundaa'a)\n\n❓ Kaardiidhaan kaffaluu danda'aa?\n✅ Eeyyee, maallaqa fi kaardiiwwan fudhanna\n\n❓ Kaffaltiin ariifachaa jiraa?\n✅ Eeyyee, adeemsa ariifachaaf % 50 dabalataa\n\n❓ Kaffaltiin haaromfamuu adda?\n✅ Yeroo baay'ee kaffaltii iyyannoo haaraa keessaa % 50"
    },

    // FAQ Content - Processing Times
    faq_timing_content: {
        en: "⏰ Processing Times FAQ\n\n❓ How long for National ID?\n✅ 3-5 business days for regular processing\n\n❓ Passport processing time?\n✅ 15-20 business days normally\n\n❓ Can I get urgent service?\n✅ Yes, 1-2 days for urgent (extra fee applies)\n\n❓ When can I collect my documents?\n✅ We'll send SMS notification when ready\n\n❓ What if it's delayed?\n✅ Use tracking system or contact our office\n\n❓ Office hours for collection?\n✅ Monday-Friday 8:30 AM - 5:00 PM",
        am: "⏰ የሂደት ጊዜ ጥያቄዎች\n\n❓ ለብሔራዊ መታወቂያ ምን ያህል ጊዜ ይወስዳል?\n✅ ለመደበኛ ሂደት 3-5 የስራ ቀናት\n\n❓ የፓስፖርት ሂደት ጊዜ?\n✅ በመደበኛነት 15-20 የስራ ቀናት\n\n❓ አስቸኳይ አገልግሎት ማግኘት እችላለሁ?\n✅ አዎ፣ ለአስቸኳይ 1-2 ቀናት (ተጨማሪ ክፍያ ይተገበራል)\n\n❓ ሰነዶቼን መቼ መሰብሰብ እችላለሁ?\n✅ ሲዘጋጅ የኤስኤምኤስ ማሳወቂያ እንልካለን\n\n❓ ከዘገየ ምን ይሆናል?\n✅ የክትትል ስርዓቱን ይጠቀሙ ወይም ቢሮአችንን ያነጋግሩ\n\n❓ የመሰብሰብ የቢሮ ሰአት?\n✅ ሰኞ-አርብ ከ8:30 ጠዋት እስከ 5:00 ከሰአት",
        om: "⏰ Gaaffii Yeroo Adeemsa\n\n❓ Ragaa eenyummaa biyyaalessaa yeroo hammam fudhata?\n✅ Adeemsa idileef guyyoota hojii 3-5\n\n❓ Yeroon adeemsa paaspoortii?\n✅ Akka idileetti guyyoota hojii 15-20\n\n❓ Tajaajila ariifachaa argachuu nan danda'aa?\n✅ Eeyyee, ariifachaaf guyyaa 1-2 (kaffaltiin dabalataa ni raawwatama)\n\n❓ Sanadoota koo yoom walitti qabachuu danda'a?\n✅ Yeroo qophaa'u ergaa SMS siif ergina\n\n❓ Yoo harkifate maal taʼa?\n✅ Sirna hordoffii fayyadamaa ykn waajjira keenya quunnamaa\n\n❓ Sa'aatii waajjira walitti qabuuf?\n✅ Wiixata-Jimaata 8:30 ganama hanga 5:00 galgala"
    },

    // FAQ Content - General Questions  
    faq_general_content: {
        en: "🔍 General Questions FAQ\n\n❓ Do I need an appointment?\n✅ No appointment needed, but early morning is less busy\n\n❓ Can someone else submit for me?\n✅ Yes, with written authorization and their ID\n\n❓ What if I made a mistake in my application?\n✅ Contact us immediately to make corrections\n\n❓ Can I track my application online?\n✅ Yes, use this bot or our website\n\n❓ What if my documents are in another language?\n✅ You need certified translations\n\n❓ Is there disabled access?\n✅ Yes, our office is wheelchair accessible",
        am: "🔍 አጠቃላይ ጥያቄዎች\n\n❓ ቀጠሮ ያስፈልገኛል?\n✅ ቀጠሮ አያስፈልግም፣ ነገር ግን ማለዳ ላይ ህዝብ አነስተኛ ነው\n\n❓ ሌላ ሰው ለእኔ ማስገባት ይችላል?\n✅ አዎ፣ በጽሁፍ ፈቃድ እና መታወቂያቸው\n\n❓ በማመልከቻዬ ስህተት ካደረግሁ?\n✅ ማስተካከያዎችን ለማድረግ ወዲያውኑ ያነጋግሩን\n\n❓ ማመልከቻዬን በመስመር ላይ መከታተል እችላለሁ?\n✅ አዎ፣ ይህንን ቦት ወይም ድህረ ገጻችንን ይጠቀሙ\n\n❓ ሰነዶቼ በሌላ ቋንቋ ከሆኑ?\n✅ የተረጋገጡ ትርጉሞች ያስፈልጋሉ\n\n❓ የአካል ጉዳተኞች ተደራሽነት አለ?\n✅ አዎ፣ ቢሮአችን በተሽከርካሪ ወንበር ተደራሽ ነው",
        om: "🔍 Gaaffii Waliigalaa\n\n❓ Beellama na barbaachisaa?\n✅ Beellami hin barbaachisu, garuu ganama barii namni xiqqaata\n\n❓ Namni biraa naa galchuu ni danda'aa?\n✅ Eeyyee, hayyama barreeffamee fi ragaa eenyummaa isaaniitiin\n\n❓ Iyyannoo koo keessatti dogoggora yoo godhe?\n✅ Sirreeffama gochuuf battalumatti nu quunnamaa\n\n❓ Iyyannoo koo toora interneetii irratti hordofuu nan danda'aa?\n✅ Eeyyee, bot kana ykn marsariitii keenya fayyadamaa\n\n❓ Sanadoonni koo afaan biraatiin yoo jiran?\n✅ Hiikkaa mirkaneeffaman barbaachisa\n\n❓ Namoota madaa qaban dhaqqabamuu jiraa?\n✅ Eeyyee, waajjirri keenya konkolaataa teessoo rakkisaa dhaqqabamuu danda'a"
    },

    // MESOB eService Specific Q&A
    mesob_general: {
        en: "🌐 MESOB eService - General Information",
        am: "🌐 የመሶብ ኢ-ሰርቪስ - አጠቃላይ መረጃ",
        om: "🌐 eService MESOB - Odeeffannoo Waliigalaa"
    },

    mesob_general_content: {
        en: "🌐 What is Shashemene eService?\n✅ It is a digital government portal designed to provide fast, transparent, and efficient public services online for Shashemene City residents.\n\n🌐 Do I need to create an account?\n✅ Yes, you need to sign up by providing your personal details, verifying your identity, and creating a password to submit and track applications.\n\n🌐 Is using the eService platform free?\n✅ Registering and browsing the eService platform is completely free. However, official government service fees apply according to legal regulations based on the service type.\n\n🌐 What is the official website link?\n✅ The official link is eservice.shashemenecity.com",
        am: "🌐 የሻሸመኔ ኢ-ሰርቪስ ምንድን ነው?\n✅ የሻሸመኔ ከተማ ነዋሪዎች የመንግስት አገልግሎቶችን በፍጥነት፣ በግልጽነትና ጊዜ በሚቆጥብ መልኩ በዲጂታል መንገድ እንዲያገኙ የተዘጋጀ መድረክ ነው።\n\n🌐 አገልግሎቱን ለመጠቀም መመዝገብ ያስፈልጋል?\n✅ አዎ፣ ማመልከቻዎችን ለማስገባትና ያሉበትን ደረጃ ለመከታተል የግል መረጃዎን በመስጠት፣ ማረጋገጫ በመውሰድና የይለፍ ቃል በመፍጠር መመዝገብ አለብዎት።\n\n🌐 የኢ-ሰርቪስ አገልግሎትን በነፃ መጠቀም ይቻላል?\n✅ በመድረኩ ላይ መመዝገብና መረጃዎችን ማሰስ ሙሉ በሙሉ በነፃ ነው። ነገር ግን እንደየአገልግሎቱ አይነት ህጋዊ የመንግስት የአገልግሎት ክፍያዎች እንደ ህጉ ተፈጻሚ ይሆናሉ።\n\n🌐 ዋናው የድረ-ገጽ ሊንክ ምንድን ነው?\n✅ ትክክለኛው ሊንክ eservice.shashemenecity.com ነው።",
        om: "🌐 eService Shashemenee maali?\n✅ eService tajaajiloota mootummaa karaa dijitaalaa fayyadamuun ariifachiisaa, iftoomina qabu fi yeroo qusatuun hawaasa Magaalaa Shaashamanneetiif dhiyeessudha.\n\n🌐 eService fayyadamuuf galmaa'uu nan barbaachisaa?\n✅ Eeyyee. Tajaajiloota fayyadamuuf galmaa'uun dirqama. Galmee booda maqaa fayyadamaa fi jecha darbii fayyadamtee seenta.\n\n🌐 eService bilisaan fayyadamuu nan danda'aa?\n✅ Galmaa'uu fi fayyadamuun eService bilisa dha. Tajaajiloota kaffaltii gaafatan akka seeraatti kaffaltiin raawwatama.\n\n🌐 Liinkiin sirrii weebsaayitichaa maali?\n✅ Liinkiin sirriin eservice.shashemenecity.com dha."
    },

    mesob_services: {
        en: "🏛️ MESOB Service Windows",
        am: "🏛️ የመሶብ አገልግሎት መስኮቶች",
        om: "🏛️ Foddaalee Tajaajilaa MESOB"
    },

    mesob_services_content: {
        en: "🏛️ Available Service Windows (Foddaalee)\n\n📋 Fooddaa 1: Vital Registration (birth, marriage, divorce, death certificates)\n💰 Fooddaa 2: Revenue Collection (tax services, invoice permits)\n🏢 Fooddaa 3: Business Licensing (new licenses, renewals, name changes)\n🤝 Fooddaa 4: Cooperatives & Small Enterprises\n🏞️ Fooddaa 5: Land Services (property transfers, building permits)\n💼 Fooddaa 6: Investment Services (local & foreign investment permits)\n📋 Fooddaa 7: Document Authentication\n🚛 Fooddaa 9: Transport & Traffic Management\n🏗️ Fooddaa 10: Construction & Design Approvals\n🌿 Fooddaa 11: Sanitation & Municipal Services\n👥 Fooddaa 12: Social Affairs, Women & Children Services",
        am: "🏛️ ዝግጁ የአገልግሎት መስኮቶች (ፎድሊ)\n\n📋 ፎቅ 1: የመሰረታዊ መረጃዎች ምዝገባ (የልደት፣ የጋብቻ፣ የፍቺ፣ የሞት ምስክር ወረቀቶች)\n💰 ፎቅ 2: የገቢዎች ስብስብ (የታክስ አገልግሎቶች፣ የደረሰኝ ፈቃዶች)\n🏢 ፖቅ 3: የንግድ ፈቃድ (አዲስ ፈቃዶች፣ እደሳዎች፣ የስም ለውጦች)\n🤝 ፎቅ 4: ህብረት ስራ ማህበራትና ጥቃቅንና አነስተኛ ኢንተርፕራይዞች\n🏞️ ፎቅ 5: የመሬት አገልግሎቶች (የይዞታ ማስተላለፍ፣ የግንባታ ፈቃዶች)\n💼 ፎቅ 6: የኢንቨስትመንት አገልግሎቶች (የሀገር ውስጥና ውጭ ኢንቨስትመንት ፈቃዶች)\n📋 ፎቅ 7: የሰነዶች ማረጋገጫ\n🚛 ፎቅ 9: የትራንስፖርትና ትራፊክ ማኔጅመንት\n🏗️ ፎቅ 10: የግንባታና ዲዛይን ማጽደቂያዎች\n🌿 ፎቅ 11: የከተማ ፅዳትና ማዘጋጃ ቤታዊ አገልግሎቶች\n👥 ፎቅ 12: የማህበራዊ ጉዳዮች፣ የሴቶችና ህጻናት አገልግሎቶች",
        om: "🏛️ Foddaalee Tajaajilaa Jiran\n\n📋 Fooddaa 1: Kenna Ragaalee Bu'uuraa (ragaa dhalootaa, gaa'elaa, hiikaa gaa'elaa fi du'aa)\n💰 Fooddaa 2: Sassaabbii Galii (tajaajiloota gibiraa, hayyama bilbilaa)\n🏢 Fooddaa 3: Kenna Hayyama Daldalaa (hayyamni haaraa, haaromsaa, jijjiirraa maqaa)\n🤝 Fooddaa 4: Waldaalee fi Intarpiraayizoota Xixiqqaa\n🏞️ Fooddaa 5: Kenna Tajaajila Lafaa (dabarsaa qabiyyee, hayyama ijaarshaa)\n💼 Fooddaa 6: Tajaajila Investimentii (hayyama investimenti biyyaa keessaa fi alaa)\n📋 Fooddaa 7: Mirkaneessa Sanadootaa\n🚛 Fooddaa 9: Bulchiinsa Geejjibaa fi Traafikaa\n🏗️ Fooddaa 10: Mirkaneessa Ijaarshaa fi Dizaayinii\n🌿 Fooddaa 11: Qulqullina fi Tajaajila Bulchiinsa Magaalaa\n👥 Fooddaa 12: Dhimma Hawaasummaa, Dubartootaa fi Daa'immanii"
    },

    mesob_support: {
        en: "🎧 Technical Support & Help",
        am: "🎧 የቴክኒክ ድጋፍ እና እገዛ",
        om: "🎧 Deeggarsa Teeknikaa fi Gargaarsa"
    },

    mesob_support_content: {
        en: "🎧 Need Help?\n\n📞 Contact MESOB Support Line: +251 913 116898\n⏰ Monday to Friday (2:30 - 11:30 local time)\n\n💡 Common Issues:\n• Forgot Password: Click 'Forgot Password' on login page\n• Track Application: Use 'My Workspace' or enter your Tracking Number\n• Upload Issues: Ensure documents are clear and proper format\n• Payment Problems: Don't re-pay, contact support with transaction ID\n• Mobile Access: Use eservice.shashemenecity.com on your phone browser\n\n📧 Office Location: Shashemene City Administration Municipality, One-Stop Service Center (MESOB)",
        am: "🎧 እገዛ ይፈልጋሉ?\n\n📞 የመሶብ ድጋፍ መስመር ያነጋግሩ: +251 913 116898\n⏰ ከሰኞ እስከ አርብ (ከጠዋቱ 2:30 እስከ ማምሻው 11:30)\n\n💡 የተለመዱ ችግሮች:\n• የይለፍ ቃል መርሳት: በመግቢያ ገጹ 'Forgot Password' ይጫኑ\n• ማመልከቻ መከታተል: 'My Workspace' ወይም የመከታተያ ቁጥር ይጠቀሙ\n• የመጫን ችግሮች: ሰነዶች ግልጽና ትክክለኛ መሆናቸውን ያረጋግጡ\n• የክፍያ ችግሮች: ድጋሚ አይክፈሉ፣ በግብይት መለያ ቁጥር ድጋፍ ያነጋግሩ\n• በሞባይል መድረስ: eservice.shashemenecity.com በስልክ ብሮውዘርዎ ይጠቀሙ\n\n📧 የቢሮ አድራሻ: የሻሸመኔ ከተማ አስተዳደር ማዘጋጃ ቤት፣ የአንድ ማዕከል አገልግሎት (መሶብ)",
        om: "🎧 Gargaarsa barbaadduu?\n\n📞 Lakkoofsa deeggarsa MESOB quunnamaa: +251 913 116898\n⏰ Wiixata hanga Jimaataatti (sa'aatii 2:30 - 11:30)\n\n💡 Rakkoolee beekamoo:\n• Jecha darbii irraanfachuu: Fuula seensaa irratti 'Forgot Password' tuqi\n• Iyyannoo hordofuu: 'My Workspace' ykn Lakkoofsa Hordoffii fayyadami\n• Rakkoo olfeessuu: Sanadoonni ifa fi bifa sirrii ta'uu isaanii mirkaneessi\n• Rakkoo kaffaltii: Deebistee hin kaffalin, lakkoofsa daldalaa fudhadhuu deeggarsa quunnamaa\n• Karaa mobaayilaatiin argachuu: eservice.shashemenecity.com broowzarii kee irratti fayyadami\n\n📧 Bakki waajjiraa: Bulchiinsa Magaalaa Shaashmanneetti, Wiirtuu Tajaajila Boottée Tokkoo (MESOB)"
    }
};

/**
 * Get translation for a key in specified language
 * @param {string} key - Translation key
 * @param {string} lang - Language code (en, am, om)
 * @param {Object} params - Parameters for string interpolation
 * @returns {string} Translated text
 */
function getTranslation(key, lang = 'en', params = {}) {
    let text = translations[key]?.[lang] || translations[key]?.en || key;

    // Simple string interpolation
    Object.keys(params).forEach(param => {
        text = text.replace(`{${param}}`, params[param]);
    });

    return text;
}

/**
 * Get available languages
 * @returns {Object} Available language codes and names
 */
function getAvailableLanguages() {
    return {
        'en': 'English',
        'am': 'አማርኛ',
        'om': 'Afaan Oromo'
    };
}

module.exports = {
    translations,
    getTranslation,
    getAvailableLanguages
};