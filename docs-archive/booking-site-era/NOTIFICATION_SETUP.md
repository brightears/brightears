# Notification System Setup Guide

## Overview

The Bright Ears notification system sends artist inquiry alerts via **Email** and **SMS** to ensure artists never miss a booking opportunity. This guide covers setup, configuration, and usage.

---

## Features

### Email Notifications
- Professional HTML email templates with bilingual support (EN/TH)
- Powered by **Resend** API for reliable delivery
- Automatic retry logic (up to 3 attempts)
- Email logging and tracking in database
- User preference management

### SMS Notifications
- SMS alerts for time-sensitive inquiries
- **Twilio** integration with Thai phone number support
- Automatic formatting for international numbers (+66...)
- Message truncation to 160 characters
- Cost estimation and tracking

### In-App Notifications
- Real-time dashboard notifications
- Persistent notification history
- Read/unread status tracking

---

## Prerequisites

### 1. Email Service (Resend)

**Sign up:** https://resend.com

**Get API Key:**
1. Create Resend account
2. Verify your sending domain (or use Resend's test domain for development)
3. Generate API key from dashboard
4. Add to environment variables

**Pricing:**
- Free tier: 3,000 emails/month
- Pro: $20/month for 50,000 emails

### 2. SMS Service (Twilio)

**Sign up:** https://www.twilio.com

**Get Credentials:**
1. Create Twilio account
2. Get phone number (preferably Thai number for local rates)
3. Copy Account SID and Auth Token
4. Add to environment variables

**Pricing (Thailand):**
- SMS to Thai mobile: ~$0.045 USD per message
- Buy Thai number: ~$1-2 USD/month

**Thai Phone Number Formats:**
```
Local:   0812345678
International: +66812345678
```

---

## Environment Setup

Add to your `.env` file:

```bash
# ============================================
# EMAIL NOTIFICATIONS (REQUIRED)
# ============================================
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxx"
EMAIL_FROM_ADDRESS="noreply@brightears.com"
EMAIL_SUPPORT_ADDRESS="support@brightears.com"
EMAIL_REPLY_TO="support@brightears.com"

# ============================================
# SMS NOTIFICATIONS (REQUIRED FOR THAI MARKET)
# ============================================
TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
TWILIO_AUTH_TOKEN="your_auth_token_here"
TWILIO_PHONE_NUMBER="+1234567890"  # Your Twilio number

# Optional: Delivery tracking
TWILIO_STATUS_CALLBACK_URL="https://brightears.com/api/webhooks/twilio/status"

# ============================================
# APPLICATION SETTINGS
# ============================================
NEXT_PUBLIC_APP_URL="https://brightears.onrender.com"
```

---

## Database Schema

The notification system uses the existing Prisma schema. Key models:

### EmailLog
Tracks all email notifications:
```prisma
model EmailLog {
  id            String      @id @default(uuid())
  toAddresses   String[]
  subject       String
  templateName  String
  locale        String      @default("en")
  status        EmailStatus @default(QUEUED)
  messageId     String?
  error         String?
  relatedId     String?
  relatedType   String?
  sentAt        DateTime?
  createdAt     DateTime    @default(now())
}
```

### EmailPreference
User notification preferences:
```prisma
model EmailPreference {
  id                   String  @id @default(uuid())
  userId               String  @unique
  emailNotifications   Boolean @default(true)
  bookingInquiries     Boolean @default(true)
  quoteUpdates         Boolean @default(true)
  eventReminders       Boolean @default(true)
  preferredLanguage    String  @default("en")
}
```

### Notification
In-app notifications:
```prisma
model Notification {
  id          String   @id @default(uuid())
  userId      String
  type        String
  title       String
  content     String
  relatedId   String?
  isRead      Boolean  @default(false)
  createdAt   DateTime @default(now())
}
```

**Note:** These models already exist in your schema. No migration needed.

---

## Usage

### Artist Inquiry Notification

When a customer submits an inquiry, the system automatically:

1. Creates booking with INQUIRY status
2. Sends email to artist with inquiry details
3. Sends SMS alert to artist's phone
4. Creates in-app notification
5. Logs all notification attempts

**Example (Automatic in Quick Inquiry API):**
```typescript
import { notifyArtistOfInquiry } from '@/lib/notifications'

const result = await notifyArtistOfInquiry({
  bookingId: booking.id,
  artistId: artist.id,
  customerId: customer.id,
  customerName: 'John Doe',
  customerPhone: '+66812345678',
  eventType: 'WEDDING',
  eventDate: '2024-12-25',
  message: 'Looking for DJ for wedding reception',
})

console.log(result)
// {
//   email: { sent: true, messageId: 'em_xxx' },
//   sms: { sent: true, messageId: 'SM_xxx' },
//   success: true,
//   errors: []
// }
```

### Email Templates

**Available Templates:**
1. `ArtistInquiryNotificationEmail` - New inquiry alert for artists
2. `BookingInquiryEmail` - Confirmation for customers
3. `QuoteReceivedEmail` - Quote notification for customers
4. `PaymentConfirmationEmail` - Payment receipt
5. `BookingConfirmedEmail` - Booking confirmation
6. `EventReminderEmail` - 24hr event reminder
7. `BookingCompletedEmail` - Post-event review request
8. `CancellationNoticeEmail` - Cancellation notice

**Bilingual Support:**
All templates support English and Thai via `locale` parameter.

### SMS Templates

**Available SMS Templates:**
```typescript
// Artist inquiry
generateArtistInquirySMS({
  customerName: 'John',
  eventType: 'Wedding',
  eventDate: '2024-12-25',
  bookingId: 'bk_123',
  locale: 'en'
})
// "New inquiry from John for Wedding on Dec 25. View: https://brightears.com/i/bk_123"

// Quote received
generateQuoteReceivedSMS({
  artistName: 'DJ Mike',
  eventType: 'Wedding',
  price: 25000,
  currency: 'THB',
  bookingId: 'bk_123',
  locale: 'th'
})
// "DJ Mike ส่งใบเสนอราคาแล้ว! Wedding: ฿25,000 ดูรายละเอียด: https://..."

// Booking confirmed
generateBookingConfirmedSMS({
  artistName: 'DJ Mike',
  eventType: 'Wedding',
  eventDate: '2024-12-25',
  eventTime: '18:00',
  bookingId: 'bk_123',
  locale: 'en'
})
// "Booking confirmed! DJ Mike - Wedding Dec 25 18:00. Details: https://..."
```

---

## Notification Preferences

Artists can control notification settings:

**Default Preferences:**
- Email notifications: **Enabled**
- SMS notifications: **Enabled** (if phone verified)
- Booking inquiries: **Enabled**
- Event reminders: **Enabled**

**User Settings API:**
```typescript
// Check if user has SMS enabled
const smsEnabled = await checkSMSConsent(userId)

// Get email preferences
const prefs = await getUserEmailPreferences(userId)

// Update preferences
await updateUserEmailPreferences(userId, {
  bookingInquiries: true,
  eventReminders: false,
  preferredLanguage: 'th'
})
```

---

## Testing

### Test Email Notification

```bash
# Using the admin email API
curl -X POST https://brightears.com/api/email/send \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "send_test",
    "testEmail": "your-email@example.com"
  }'
```

### Test SMS Notification

```typescript
import { sendSMS } from '@/lib/sms'

const result = await sendSMS(
  '+66812345678',
  'Test SMS from Bright Ears notification system'
)

console.log(result)
```

### Development Mode

Without Resend/Twilio configured, notifications will:
- Log to console instead of sending
- Mark as failed in database
- Continue without blocking inquiry creation

---

## Error Handling

### Graceful Degradation

The system continues working even if notifications fail:

1. **Inquiry created successfully** → User notified of success
2. **Notification attempts logged** → Can retry manually
3. **API doesn't block** → Fast response time maintained
4. **Errors logged** → Can monitor and debug

### Retry Logic

**Email:**
- Max retries: 3
- Retry delay: 1s, 2s, 3s (exponential backoff)

**SMS:**
- Max retries: 2
- Retry delay: 2s, 4s

### Error Monitoring

```typescript
// Get notification stats
const stats = await getNotificationStats({
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-01-31')
})

// Returns:
// {
//   emails: [
//     { status: 'SENT', _count: 450 },
//     { status: 'FAILED', _count: 12 }
//   ]
// }
```

---

## Cost Optimization

### Email Costs
- **Free tier sufficient** for most use cases
- Average: 2-3 emails per booking
- 1,000 bookings/month = ~3,000 emails (still free)

### SMS Costs
- **Only send for high-priority events**
- Current: Artist inquiries only
- Estimated: $0.045 × 1,000 inquiries = **$45/month**

**Cost Reduction Strategies:**
1. Allow artists to opt-out of SMS
2. Use SMS only for verified artists
3. Batch non-urgent notifications
4. Use in-app notifications as primary method

---

## Monitoring & Analytics

### Dashboard Metrics

Track these KPIs:
- Email delivery rate
- SMS delivery rate
- Average notification response time
- Artist engagement with notifications
- Failed notification patterns

### Logs

**Email logs:**
```sql
SELECT
  templateName,
  status,
  COUNT(*) as count,
  AVG(EXTRACT(EPOCH FROM (sentAt - createdAt))) as avg_delivery_time
FROM "EmailLog"
WHERE createdAt > NOW() - INTERVAL '30 days'
GROUP BY templateName, status;
```

**Notification activity:**
```sql
SELECT
  type,
  COUNT(*) as total,
  SUM(CASE WHEN isRead THEN 1 ELSE 0 END) as read_count
FROM "Notification"
WHERE createdAt > NOW() - INTERVAL '7 days'
GROUP BY type;
```

---

## Troubleshooting

### Email Not Sending

**Check:**
1. `RESEND_API_KEY` is set correctly
2. Sending domain is verified in Resend
3. Email address is valid
4. Check Resend dashboard for errors
5. Review `/logs/email` for detailed errors

**Common issues:**
- Invalid API key → Check Resend dashboard
- Domain not verified → Verify in Resend settings
- Rate limit exceeded → Upgrade plan or wait

### SMS Not Sending

**Check:**
1. `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN` are correct
2. `TWILIO_PHONE_NUMBER` is active
3. Phone number format is valid (+66...)
4. Twilio account has credit
5. Check Twilio console for delivery logs

**Common issues:**
- Invalid phone format → Use `formatPhoneNumber()` helper
- Insufficient funds → Add credit to Twilio account
- Number not verified (trial) → Verify recipient in Twilio console

### Artist Not Receiving Notifications

**Check:**
1. Artist has verified email address
2. Artist has verified phone number
3. Artist hasn't disabled notifications
4. Check `EmailPreference` table
5. Review notification logs in database

---

## Production Checklist

Before going live:

- [ ] Set up Resend account with verified domain
- [ ] Configure Twilio with Thai phone number
- [ ] Set all environment variables in Render
- [ ] Test email delivery to real addresses
- [ ] Test SMS delivery to Thai numbers
- [ ] Verify notification logging is working
- [ ] Set up monitoring alerts for failed notifications
- [ ] Document notification costs in budget
- [ ] Train support team on notification system
- [ ] Create notification preference UI for artists

---

## Support

**Email issues:** Check Resend status page and logs
**SMS issues:** Check Twilio console and account status
**Database issues:** Review Prisma logs and migrations

**Need help?** Contact the development team or create an issue in the repository.

---

**Last Updated:** October 2, 2025
**Version:** 1.0.0
