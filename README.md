# MESOB Shashemene Telegram Bot 🏛️

A production-ready multilingual Telegram bot for MESOB (Ministry of Electronic Services and Operations Bureau) Shashemene, providing digital access to government services.

## 🌟 Features

### 🌍 Multilingual Support

- **English** - Full interface support
- **አማርኛ (Amharic)** - Complete localization
- **Afaan Oromo** - Native language support
- Dynamic language switching with instant UI updates

### 🏛️ Government Services

- **National ID** - Application information and requirements
- **Passport Services** - Documentation and processing details
- **Business Registration** - Company setup and licensing
- **Tax Services** - Tax registration and certificates
- **Driving License** - License application process
- **Application Tracking** - Real-time status updates

### 🤖 Smart Features

- Intelligent message routing
- User session management
- Automatic language detection for greetings
- Context-aware responses
- Clean, intuitive keyboard navigation

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Telegram Bot Token (from [@BotFather](https://t.me/botfather))

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd mesob-telegram-bot
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**

   ```bash
   cp .env.example .env
   # Edit .env and add your bot token
   BOT_TOKEN=your_telegram_bot_token_here
   ```

4. **Start the bot**

   ```bash
   npm start
   ```

   For development with auto-reload:

   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

```
mesob-telegram-bot/
├── bot.js                      # Main bot application
├── package.json               # Dependencies and scripts
├── .env                      # Environment configuration
├── src/
│   ├── config/
│   │   └── languages.js      # Translation dictionary
│   ├── handlers/
│   │   ├── commandHandler.js # Bot commands (/start, /help)
│   │   └── messageHandler.js # Message processing logic
│   └── utils/
│       ├── keyboards.js      # Dynamic keyboard generation
│       └── userState.js      # User session management
└── README.md                 # This file
```

## 📋 Bot Commands

| Command     | Description                           |
| ----------- | ------------------------------------- |
| `/start`    | Initialize bot and language selection |
| `/help`     | Show help information and features    |
| `/language` | Change interface language             |
| `/menu`     | Return to main menu                   |
| `/stats`    | Bot statistics (admin only)           |

## 🎯 Usage Flow

1. **Start**: User sends `/start` command
2. **Language Selection**: Choose from English, Amharic, or Afaan Oromo
3. **Main Menu**: Navigate through services using keyboard buttons
4. **Service Information**: Get detailed info about government services
5. **Application Tracking**: Enter reference numbers to track status
6. **Multi-language**: Switch languages anytime

## 🛠️ Configuration

### Environment Variables

```env
# Required
BOT_TOKEN=your_telegram_bot_token_here

# Optional
NODE_ENV=development
PORT=3000
ADMIN_CHAT_ID=your_chat_id_for_admin_features
```

### Adding New Languages

To add support for additional languages:

1. **Update translations in `src/config/languages.js`**:

   ```javascript
   const translations = {
     welcome: {
       en: "Welcome!",
       am: "እንኳን በደህና መጡ!",
       om: "Baga nagaan dhuftan!",
       ti: "እንቋዕ በደሐን መፃእካ!", // Add Tigrinya
     },
     // ... add to all translation keys
   };
   ```

2. **Update language selection keyboard** in `src/utils/keyboards.js`

3. **Test thoroughly** with native speakers

## 🔧 Development

### Code Style

- Clean, modular architecture
- Comprehensive error handling
- Detailed logging for debugging
- Scalable user state management

### Key Principles

- **No hardcoded text** - All strings use translation system
- **Dynamic keyboards** - All UI elements adapt to selected language
- **Graceful fallbacks** - English used when translations missing
- **Memory efficient** - Automatic cleanup of inactive user sessions

### Testing

```bash
# Start bot in development mode
npm run dev

# Test with your Telegram account
# Send /start to your bot
```

## 📊 Monitoring

The bot includes built-in statistics and monitoring:

- **User Statistics**: Total users, language breakdown
- **Activity Tracking**: Active users in last hour/day
- **Automatic Cleanup**: Removes inactive user sessions
- **Error Logging**: Comprehensive error tracking

Access stats with `/stats` command (admin only).

## 🚀 Deployment

### Local Deployment

```bash
npm start
```

### Production Deployment

1. **Environment Setup**:

   ```bash
   NODE_ENV=production
   BOT_TOKEN=your_production_token
   ```

2. **Process Management** (using PM2):

   ```bash
   npm install -g pm2
   pm2 start bot.js --name "mesob-bot"
   pm2 startup
   pm2 save
   ```

3. **Docker** (optional):
   ```dockerfile
   FROM node:16-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   CMD ["npm", "start"]
   ```

## 🔮 Future Enhancements

### Planned Features

- [ ] **Database Integration** (MongoDB/Firebase)
- [ ] **Real API Integration** with MESOB backend
- [ ] **Document Upload** support
- [ ] **Payment Integration** for services
- [ ] **AI/NLP** for natural language processing
- [ ] **Voice Messages** support
- [ ] **Appointment Booking** system
- [ ] **Push Notifications** for application updates

### Scalability Improvements

- [ ] Redis for session management
- [ ] Webhook mode for better performance
- [ ] Load balancing for multiple bot instances
- [ ] Analytics dashboard
- [ ] Admin panel for content management

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Guidelines

- Follow existing code style
- Add translations for new features
- Test with all supported languages
- Update documentation

## 📞 Support

- **Technical Issues**: Create GitHub issue
- **MESOB Services**: Visit [https://mesobshashe.gov.et](https://mesobshashe.gov.et)
- **Bot Support**: Contact support@mesobshashe.gov.et

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Ethiopian Government Digital Transformation initiative
- MESOB Shashemene team
- Open source Telegram bot community
- Contributors and testers

---
