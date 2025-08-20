# BrightEars Email Notification System

## Overview

The BrightEars platform features a comprehensive email notification system that handles all booking lifecycle notifications in both English and Thai languages. The system is built with reliability, deliverability, and user experience as core priorities.

## Features

### ✅ Email Templates
- **Booking Inquiry** - When customer submits initial inquiry
- **Quote Received** - When artist sends quote to customer  
- **Quote Accepted** - When customer accepts quote
- **Payment Confirmation** - When payments are processed
- **Booking Confirmed** - When booking moves to confirmed status
- **Event Reminder** - 24h and 1h before event
- **Booking Completed** - After event completion
- **Cancellation Notice** - When bookings are cancelled

### ✅ Bilingual Support
- All templates available in English and Thai
- Dynamic language selection based on user preference
- Proper Thai language formatting and cultural considerations
- Automatic language detection from user profiles

### ✅ Email Infrastructure
- Resend email service integration with fallback support
- Email queue system for reliable delivery
- Email logging and delivery tracking
- Rate limiting and retry logic
- Circuit breaker pattern for system resilience

### ✅ Integration Points
- Automatic triggers on booking status changes
- Payment processing notifications
- Quote management workflows
- Event reminder scheduling
- User preference management

## Technical Architecture

### Core Components

1. **Email Service Layer** (`/lib/email.ts`)
   - Resend integration
   - Retry logic with exponential backoff
   - Email validation and formatting
   - Localization support

2. **Email Templates** (`/components/email/`)
   - React Email components
   - Bilingual template support
   - Responsive design
   - Brand-consistent styling

3. **Email Queue System** (`/lib/email-queue.ts`)
   - Reliable delivery with retry mechanisms
   - Circuit breaker pattern
   - Email validation
   - Performance monitoring

4. **Email Logger** (`/lib/email-logger.ts`)
   - Database logging with Prisma
   - File-based fallback logging
   - Analytics and reporting
   - Error tracking

5. **Event Reminder System** (`/lib/event-reminder.ts`)
   - Automated scheduling (24h, 4h before events)
   - Cron job integration
   - Multiple reminder configurations
   - Manual trigger support

### Database Schema

The system includes comprehensive database models for email tracking:

```sql
-- Email logging and delivery tracking
model EmailLog {
  id                String
  toAddresses       String[]
  subject           String
  templateName      String
  locale            String
  status            EmailStatus
  messageId         String?
  error             String?
  retryCount        Int
  relatedId         String?
  relatedType       String?
  sentAt            DateTime?
  deliveredAt       DateTime?
  metadata          Json?
  -- ... additional fields
}

-- User email preferences
model EmailPreference {
  id                     String
  userId                 String
  emailNotifications     Boolean
  marketingEmails        Boolean
  eventReminders         Boolean
  preferredLanguage      String
  frequency              EmailFrequency
  -- ... additional fields
}

-- Email queue for reliable delivery
model EmailQueue {
  id                String
  toAddresses       String[]
  subject           String
  htmlContent       String
  templateName      String
  status            EmailQueueStatus
  priority          Int
  scheduledAt       DateTime
  -- ... additional fields
}
```

## API Endpoints

### Email Management

1. **Email Preferences** - `/api/email/preferences`
   - `GET` - Get user's email preferences
   - `PUT` - Update user's email preferences
   - `POST` - Check consent or unsubscribe from specific email types

2. **Email Sending** - `/api/email/send` (Admin only)
   - Send test emails
   - Send specific templates
   - Preview email templates

3. **Event Reminders** - `/api/admin/reminders`
   - `GET` - Get upcoming events and reminder status
   - `POST` - Trigger manual reminders
   - `PUT` - Cron endpoint for scheduled processing

### Automatic Triggers

Email notifications are automatically triggered at these points:

- **Booking Status Changes** (`/api/bookings/[id]/status`)
- **Payment Processing** (`/api/payments/verify`)
- **Quote Management** (`/api/quotes/[id]/accept`)
- **Quote Creation** (`/api/quotes`)
- **Booking Inquiries** (`/api/bookings/inquiry`)

## Usage Guide

### Basic Email Sending

```typescript
import { sendBookingConfirmedEmail } from '@/lib/email-templates'

// Send booking confirmation
const result = await sendBookingConfirmedEmail({
  to: customer.email,
  customerName: customer.name,
  artistName: artist.stageName,
  bookingNumber: booking.bookingNumber,
  eventType: booking.eventType,
  // ... other required fields
  locale: 'th' // or 'en'
})

if (result.success) {
  console.log('Email sent successfully:', result.messageId)
} else {
  console.error('Email failed:', result.error)
}
```

### Email Preferences

```typescript
import { getUserEmailPreferences, checkEmailConsent } from '@/lib/email'

// Check if user consents to specific email type
const hasConsent = await checkEmailConsent(userId, 'booking_inquiry')

if (hasConsent) {
  // Send email
}

// Get user preferences
const prefs = await getUserEmailPreferences(userId)
const locale = prefs?.preferredLanguage || 'en'
```

### Event Reminders

```typescript
import { sendEventReminders, sendManualReminder } from '@/lib/event-reminder'

// Send all scheduled reminders (called by cron job)
const results = await sendEventReminders()

// Send manual reminder for specific booking
const success = await sendManualReminder(bookingId, 24) // 24 hours before
```

## Environment Configuration

Required environment variables:

```bash
# Email Service (Resend)
RESEND_API_KEY="re_your_resend_api_key_here"
EMAIL_FROM_ADDRESS="noreply@brightears.com"
EMAIL_SUPPORT_ADDRESS="support@brightears.com"
EMAIL_REPLY_TO="support@brightears.com"

# Application URLs
NEXT_PUBLIC_APP_URL="https://brightears.com"

# Cron Job Security
CRON_SECRET="your-secure-cron-secret"

# Email Configuration
EMAIL_MAX_RETRIES="3"
EMAIL_RETRY_DELAY="1000"
EMAIL_QUEUE_ENABLED="true"
```

## Deployment Setup

### 1. Database Migration

Run the Prisma migration to add email tables:

```bash
npx prisma migrate dev --name add_email_system
```

### 2. Cron Job Setup

Set up a cron job to trigger reminders. Example for Vercel Cron:

```json
// vercel.json
{
  "cron": [
    {
      "path": "/api/admin/reminders",
      "schedule": "0 */4 * * *"
    }
  ]
}
```

For other platforms, call the endpoint with proper authentication:

```bash
curl -X PUT "https://brightears.com/api/admin/reminders" \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### 3. Email Service Setup

1. Create a Resend account at https://resend.com
2. Add your domain and verify DNS records
3. Generate an API key
4. Add the API key to your environment variables

## Monitoring and Analytics

### Email Logs

The system logs all email activity to the database and provides:

- Delivery status tracking
- Error logging and retry information
- Template usage analytics
- Performance metrics

### Admin Dashboard Features

- View upcoming events requiring reminders
- Manual email sending and testing
- Email preference management
- Delivery analytics and reporting

## Testing

### Manual Testing

Use the admin endpoint to test email templates:

```bash
# Send test email
curl -X POST "/api/email/send" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "send_test",
    "testEmail": "test@example.com"
  }'

# Preview template
curl -X POST "/api/email/send" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "preview_template",
    "emailType": "booking_confirmed",
    "templateData": {
      "customerName": "Test Customer",
      "artistName": "Test Artist",
      "eventType": "Wedding"
    }
  }'
```

### Automated Testing

The system includes circuit breakers and fallback mechanisms to handle:

- Email service outages
- Network timeouts
- Rate limiting
- Invalid email addresses
- Template rendering errors

## Error Handling and Fallbacks

1. **Retry Logic**: Automatic retries with exponential backoff
2. **Circuit Breaker**: Prevents cascading failures during outages
3. **Fallback Logging**: File-based logging when database is unavailable
4. **Graceful Degradation**: System continues without email if service fails
5. **Error Notifications**: Admin notifications for persistent failures

## Security Considerations

1. **Email Consent**: User preference checking before sending
2. **Rate Limiting**: Prevents abuse and spam
3. **Input Validation**: All email data is validated and sanitized
4. **Cron Security**: Secure authentication for scheduled tasks
5. **GDPR Compliance**: Unsubscribe and preference management

## Performance Optimizations

1. **Batching**: Bulk email operations where appropriate
2. **Caching**: Template compilation caching
3. **Async Processing**: Non-blocking email sending
4. **Connection Pooling**: Efficient database connections
5. **Circuit Breaking**: Prevents resource exhaustion

## Future Enhancements

Potential improvements for the email system:

1. **Advanced Analytics**: Email open/click tracking
2. **A/B Testing**: Template performance testing
3. **Advanced Scheduling**: More flexible reminder configurations
4. **Integration Options**: Additional email service providers
5. **Rich Templates**: More sophisticated email designs
6. **Automation Rules**: User-defined email automation

## Support and Maintenance

For issues with the email system:

1. Check email logs in the database
2. Verify environment configuration
3. Test email service connectivity
4. Review cron job execution logs
5. Monitor email queue status

The system is designed to be robust and self-healing, with comprehensive logging to help diagnose any issues.