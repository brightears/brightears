# Artist Inquiry Notification System - Implementation Guide

## Quick Start

This guide walks you through setting up the complete notification system for artist inquiries.

---

## Step 1: Install Dependencies

```bash
cd brightears
npm install twilio
```

The system already has these installed:
- `resend` - Email service
- `@react-email/components` - Email templates
- `@prisma/client` - Database ORM

---

## Step 2: Configure Environment Variables

### Development (.env.local)

```bash
# Copy from .env.example
cp .env.example .env.local

# Edit .env.local with your credentials
```

### Required Variables

```bash
# Email Service (Resend)
RESEND_API_KEY="re_xxx"  # Get from https://resend.com/api-keys
EMAIL_FROM_ADDRESS="noreply@brightears.com"
EMAIL_SUPPORT_ADDRESS="support@brightears.com"
EMAIL_REPLY_TO="support@brightears.com"

# SMS Service (Twilio)
TWILIO_ACCOUNT_SID="ACxxxxx"  # From https://console.twilio.com
TWILIO_AUTH_TOKEN="your_token"
TWILIO_PHONE_NUMBER="+1234567890"  # Your Twilio number

# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Database (already configured)
DATABASE_URL="postgresql://..."
```

---

## Step 3: Set Up Resend (Email)

### Create Account
1. Go to https://resend.com
2. Sign up with your email
3. Verify your email address

### Get API Key
1. Go to **API Keys** section
2. Click **Create API Key**
3. Name it "Bright Ears Production"
4. Copy the key (starts with `re_`)
5. Add to `.env.local`: `RESEND_API_KEY="re_xxx"`

### Verify Domain (Production Only)
For development, you can use Resend's test domain. For production:

1. Go to **Domains** section
2. Add `brightears.com`
3. Add DNS records (provided by Resend)
4. Wait for verification (~30 minutes)

### Test Email
```bash
# Send test email from your app
curl -X POST http://localhost:3000/api/email/send \
  -H "Content-Type: application/json" \
  -d '{
    "action": "send_test",
    "testEmail": "your-email@example.com"
  }'
```

---

## Step 4: Set Up Twilio (SMS)

### Create Account
1. Go to https://www.twilio.com
2. Sign up and verify your phone number
3. You'll get free trial credit

### Get Credentials
1. From **Console Dashboard**, copy:
   - **Account SID** (starts with `AC`)
   - **Auth Token** (click to reveal)
2. Add to `.env.local`

### Get Phone Number
1. Go to **Phone Numbers** > **Manage** > **Buy a number**
2. Search for numbers in your country
3. For Thailand: Search "+66" numbers (more expensive but better delivery)
4. For testing: Use any US number (~$1/month)
5. Copy the number (format: `+1234567890`)
6. Add to `.env.local`: `TWILIO_PHONE_NUMBER="+1234567890"`

### Add Test Number (Trial Account Only)
If using trial account:
1. Go to **Phone Numbers** > **Verified Caller IDs**
2. Add the artist's phone number you want to test with
3. They'll receive verification code

### Test SMS
```typescript
// In your app or test file
import { sendSMS } from '@/lib/sms'

const result = await sendSMS(
  '+66812345678',  // Thai number
  'Test from Bright Ears!'
)

console.log(result)
```

---

## Step 5: Database Setup

The notification system uses existing Prisma schema. Ensure migrations are up to date:

```bash
# Generate Prisma client
npx prisma generate

# Check if migrations are needed
npx prisma migrate status

# If needed, run migrations
npx prisma migrate dev
```

**Required tables** (already in schema):
- `EmailLog` - Email delivery tracking
- `EmailPreference` - User notification preferences
- `Notification` - In-app notifications
- `User` - User accounts with email/phone
- `Artist` - Artist profiles
- `Booking` - Booking records

---

## Step 6: Test the Complete Flow

### 1. Start Development Server
```bash
npm run dev
```

### 2. Create Test Artist
Go to http://localhost:3000 and:
1. Register as artist with your email
2. Add your phone number to profile
3. Verify email and phone

### 3. Submit Test Inquiry

Go to an artist profile and click "Get Quote":
```javascript
// Form data:
{
  firstName: "Test Customer",
  phoneNumber: "0812345678",  // Your test number
  eventDate: "2024-12-25",
  eventType: "WEDDING",
  message: "Looking for DJ for wedding"
}
```

### 4. Check Notifications

**Email:**
- Check your inbox for "New Inquiry from Test Customer"
- Should arrive within 10 seconds
- Check spam folder if not in inbox

**SMS:**
- Check your phone for text message
- Format: "New inquiry from Test Customer for WEDDING on Dec 25. View: [link]"

**Console Logs:**
```
[NOTIFICATION] Inquiry notification sent to Artist Name:
  email: sent
  sms: sent
  success: true
  errors: []
```

---

## Step 7: Production Deployment (Render)

### Add Environment Variables in Render

1. Go to Render dashboard
2. Select "brightears" service
3. Go to **Environment** tab
4. Add all variables from `.env.local`:

```
RESEND_API_KEY
EMAIL_FROM_ADDRESS
EMAIL_SUPPORT_ADDRESS
EMAIL_REPLY_TO
TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN
TWILIO_PHONE_NUMBER
NEXT_PUBLIC_APP_URL=https://brightears.onrender.com
```

5. Click **Save Changes**
6. Service will auto-deploy

### Verify Production

1. Wait for deployment to complete
2. Check logs: `render logs`
3. Submit test inquiry through live site
4. Verify email and SMS delivery

---

## Monitoring & Troubleshooting

### Check Email Logs

```sql
-- In Prisma Studio or psql
SELECT
  toAddresses,
  subject,
  templateName,
  status,
  error,
  createdAt
FROM "EmailLog"
ORDER BY createdAt DESC
LIMIT 10;
```

### Check Notification Logs

Look for these console logs:
```
[NOTIFICATION] New inquiry for [Artist] from [Customer]
[NOTIFICATION] Inquiry notification sent to [Artist]:
  email: sent | failed
  sms: sent | failed
  success: true | false
```

### Common Issues

**Email not sending:**
- ✓ Check RESEND_API_KEY is correct
- ✓ Check Resend dashboard for errors
- ✓ Verify domain in production
- ✓ Check email address is valid

**SMS not sending:**
- ✓ Check Twilio credentials are correct
- ✓ Check phone number format (+66...)
- ✓ Verify Twilio account has credit
- ✓ Check Twilio console for delivery logs
- ✓ For trial: verify recipient number

**Notifications blocking API:**
- Notifications are async (fire-and-forget)
- Check for syntax errors in notification code
- Review console for error stack traces

---

## Features Implemented

### Email Notifications ✅
- [x] Professional HTML email template
- [x] Bilingual support (EN/TH)
- [x] Artist inquiry details included
- [x] Direct link to dashboard
- [x] Retry logic (3 attempts)
- [x] Error logging
- [x] User preference checking

### SMS Notifications ✅
- [x] Twilio integration
- [x] Thai phone number support
- [x] Auto-formatting (+66...)
- [x] 160-character limit enforcement
- [x] Bilingual messages
- [x] Short URL for mobile
- [x] Cost estimation
- [x] Retry logic (2 attempts)

### In-App Notifications ✅
- [x] Database notification record
- [x] Real-time dashboard updates
- [x] Read/unread tracking
- [x] Notification history

### API Integration ✅
- [x] Quick inquiry API triggers notifications
- [x] Async notification (non-blocking)
- [x] Graceful error handling
- [x] Comprehensive logging

---

## Cost Estimates

### Monthly Costs (1,000 inquiries)

**Email (Resend):**
- 3,000 emails/month = **FREE** (within free tier)
- Pro plan if needed = **$20/month**

**SMS (Twilio):**
- 1,000 SMS to Thailand = **$45/month** ($0.045 each)
- US numbers cheaper: ~$20/month

**Total estimated:** $45-65/month for 1,000 inquiries

### Cost Optimization
- Email is always free (up to 3,000/month)
- SMS only for high-priority (inquiries)
- Allow artists to opt-out of SMS
- Use in-app notifications as primary

---

## Next Steps

### Phase 1 (Current) ✅
- [x] Email notifications
- [x] SMS notifications
- [x] In-app notifications
- [x] Basic preferences

### Phase 2 (Future)
- [ ] LINE integration (Thai market preferred)
- [ ] Push notifications (browser/mobile)
- [ ] Notification preferences UI
- [ ] Digest mode (daily/weekly summaries)
- [ ] Advanced scheduling

### Phase 3 (Advanced)
- [ ] Notification templates management
- [ ] A/B testing for messages
- [ ] Analytics dashboard
- [ ] AI-powered send time optimization

---

## Support

**Email Configuration:** Check Resend documentation and dashboard
**SMS Configuration:** Check Twilio console and logs
**Code Issues:** Review `/lib/notifications.ts` and API routes

**Need help?** Create an issue or contact the development team.

---

## Files Reference

### Core Implementation Files
```
brightears/
├── lib/
│   ├── notifications.ts          # Main notification service
│   ├── sms.ts                     # SMS service (Twilio)
│   ├── email.ts                   # Email service (Resend)
│   └── email-templates.ts         # Email template helpers
├── components/
│   └── email/
│       ├── ArtistInquiryNotificationEmail.tsx
│       └── BaseEmailTemplate.tsx
├── app/api/
│   └── inquiries/
│       └── quick/
│           └── route.ts           # API with notifications
├── prisma/
│   └── schema.prisma              # Database schema
├── .env.example                   # Environment template
├── NOTIFICATION_SETUP.md          # Detailed setup guide
└── IMPLEMENTATION_GUIDE.md        # This file
```

---

**Implementation Complete!** 🎉

The notification system is production-ready and will automatically send email and SMS alerts when customers submit inquiries to artists.

**Last Updated:** October 2, 2025
