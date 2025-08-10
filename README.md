# Bright Ears - Entertainment Booking Platform

A commission-free entertainment booking platform for Thailand, connecting venues with DJs, bands, singers, and musicians.

## 🚀 Deployment on Render

### Quick Deploy
1. Connect your GitHub repository to Render
2. Render will auto-detect the `render.yaml` configuration
3. Environment variables will be automatically set up
4. Database will be provisioned automatically

### Manual Setup on Render

1. **Create a new Web Service**
   - Connect to GitHub repo: `brightears/brightears`
   - Branch: `main`
   - Root Directory: `.` (leave blank)
   - Runtime: Node
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Region: Singapore (for Thailand proximity)

2. **Environment Variables**
   ```
   NODE_ENV=production
   NEXTAUTH_URL=https://brightears.io
   NEXT_PUBLIC_URL=https://brightears.io
   ```

3. **Create PostgreSQL Database**
   - Name: `brightears-db`
   - Region: Singapore
   - Version: 15

4. **Custom Domain**
   - Add `brightears.io` in Render settings
   - Update DNS records as instructed

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Run development server
npm run dev

# Open http://localhost:3000
```

## 🌐 Features

- **Bilingual Support**: English/Thai with instant switching
- **No Commission**: Direct bookings between artists and venues
- **SEO Optimized**: Built for search engine visibility
- **Mobile First**: Responsive design for all devices
- **Corporate Focus**: Tailored for hotels and venues
- **Line Integration Ready**: For Thai market messaging

## 📁 Project Structure

```
brightears/
├── app/
│   ├── [locale]/        # Bilingual routing
│   └── api/             # API routes
├── components/          # React components
├── messages/            # Translations (EN/TH)
├── public/             # Static assets
├── .claude/agents/     # AI development assistants
└── render.yaml         # Render deployment config
```

## 🔧 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Render)
- **Deployment**: Render.com
- **i18n**: next-intl

## 📊 Database Schema (Coming Soon)

- Artists (DJs, Bands, Singers, Musicians)
- Bookings
- Reviews
- Users (Artists, Customers, Corporate)
- Messages

## 🚦 Health Check

- Endpoint: `https://brightears.io/api/health`
- Returns: `{ status: 'healthy', timestamp: '...', service: 'brightears-platform' }`

## 🔐 Environment Variables

See `.env.example` for all required variables.

## 📈 Monitoring

- Render provides built-in monitoring
- Health check endpoint for uptime monitoring
- Google Analytics ready (add GA_MEASUREMENT_ID)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Push to GitHub
4. Render auto-deploys from main branch

## 📄 License

© 2024 Bright Ears Entertainment Co., Ltd. All rights reserved.

## 📞 Support

- Email: info@brightears.io
- Location: Bangkok, Thailand
