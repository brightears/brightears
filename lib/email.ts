import { Resend } from 'resend'
import { render } from '@react-email/render'
import { ReactElement } from 'react'

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY)

// Email configuration
const EMAIL_CONFIG = {
  fromAddress: process.env.EMAIL_FROM_ADDRESS || 'noreply@brightears.com',
  fromName: 'Bright Ears',
  supportEmail: process.env.EMAIL_SUPPORT_ADDRESS || 'support@brightears.com',
  replyTo: process.env.EMAIL_REPLY_TO || 'support@brightears.com',
  // Retry configuration
  maxRetries: 3,
  retryDelay: 1000, // 1 second
}

export interface EmailData {
  to: string | string[]
  subject: string
  html: string
  text?: string
  replyTo?: string
  tags?: { name: string; value: string }[]
  attachments?: Array<{
    filename: string
    content: string | Buffer
    contentType?: string
  }>
}

export interface EmailTemplate {
  subject: string
  html: string
  text?: string
}

export interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
  retryCount?: number
}

// Email logging interface
export interface EmailLog {
  id: string
  to: string[]
  subject: string
  template: string
  locale: string
  status: 'sent' | 'failed' | 'pending'
  messageId?: string
  error?: string
  retryCount: number
  createdAt: Date
  updatedAt: Date
}

/**
 * Send an email with retry logic
 */
export async function sendEmail(emailData: EmailData): Promise<EmailResult> {
  let lastError: string = ''
  
  for (let attempt = 0; attempt <= EMAIL_CONFIG.maxRetries; attempt++) {
    try {
      const result = await resend.emails.send({
        from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.fromAddress}>`,
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text,
        replyTo: emailData.replyTo || EMAIL_CONFIG.replyTo,
        tags: emailData.tags,
        attachments: emailData.attachments,
      })

      // Log successful email
      await logEmail({
        to: Array.isArray(emailData.to) ? emailData.to : [emailData.to],
        subject: emailData.subject,
        template: 'unknown', // Will be overridden by specific functions
        locale: 'en',
        status: 'sent',
        messageId: result.data?.id,
        retryCount: attempt,
      })

      return {
        success: true,
        messageId: result.data?.id,
        retryCount: attempt,
      }
    } catch (error) {
      lastError = error instanceof Error ? error.message : 'Unknown error'
      console.error(`Email send attempt ${attempt + 1} failed:`, lastError)
      
      // Don't retry on the last attempt
      if (attempt < EMAIL_CONFIG.maxRetries) {
        await new Promise(resolve => setTimeout(resolve, EMAIL_CONFIG.retryDelay * (attempt + 1)))
      }
    }
  }

  // Log failed email
  await logEmail({
    to: Array.isArray(emailData.to) ? emailData.to : [emailData.to],
    subject: emailData.subject,
    template: 'unknown',
    locale: 'en',
    status: 'failed',
    error: lastError,
    retryCount: EMAIL_CONFIG.maxRetries,
  })

  return {
    success: false,
    error: lastError,
    retryCount: EMAIL_CONFIG.maxRetries,
  }
}

/**
 * Render a React email component to HTML and text
 */
export async function renderEmailTemplate(component: ReactElement): Promise<EmailTemplate> {
  const html = await render(component)
  const text = await render(component, { plainText: true })
  
  return {
    subject: '', // Will be set by individual template functions
    html,
    text,
  }
}

/**
 * Log email activity to database
 */
async function logEmail(logData: Partial<EmailLog>): Promise<void> {
  try {
    // Import prisma here to avoid circular dependencies
    const { prisma } = await import('./prisma')
    
    // For now, we'll just log to console
    // In production, you might want to store this in a separate emails table
    console.log('Email log:', {
      timestamp: new Date().toISOString(),
      to: logData.to?.join(', '),
      subject: logData.subject,
      status: logData.status,
      messageId: logData.messageId,
      error: logData.error,
      retryCount: logData.retryCount,
    })
    
    // TODO: Implement email logging to database
    // You could create an EmailLog model in Prisma schema if needed
    
  } catch (error) {
    console.error('Failed to log email:', error)
  }
}

/**
 * Get email preferences for a user
 */
export async function getUserEmailPreferences(userId: string) {
  try {
    const { prisma } = await import('./prisma')
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        customer: {
          select: {
            preferredLanguage: true
          }
        },
        artist: {
          select: {
            languages: true
          }
        }
      }
    })

    if (!user) return null

    // Determine user's preferred language
    let preferredLanguage = 'en'
    if (user.customer?.preferredLanguage) {
      preferredLanguage = user.customer.preferredLanguage
    } else if (user.artist?.languages?.includes('th')) {
      preferredLanguage = 'th'
    }

    return {
      email: user.email,
      emailVerified: !!user.emailVerified,
      preferredLanguage: preferredLanguage as 'en' | 'th',
      // Default email preferences - in production these could be stored in the database
      emailNotifications: true, // Booking updates, quotes, etc.
      marketingEmails: false, // Promotional emails (GDPR compliance)
      eventReminders: true, // Event reminder notifications
      systemNotifications: true, // Important system updates
      // Artist-specific preferences
      bookingInquiries: user.role === 'ARTIST' ? true : false,
      quoteRequests: user.role === 'ARTIST' ? true : false,
      // Customer-specific preferences  
      quoteUpdates: user.role === 'CUSTOMER' ? true : false,
      paymentConfirmations: user.role === 'CUSTOMER' ? true : false,
    }
  } catch (error) {
    console.error('Failed to get user email preferences:', error)
    return null
  }
}

/**
 * Update user email preferences
 */
export async function updateUserEmailPreferences(
  userId: string, 
  preferences: {
    emailNotifications?: boolean
    marketingEmails?: boolean
    eventReminders?: boolean
    systemNotifications?: boolean
    bookingInquiries?: boolean
    quoteRequests?: boolean
    quoteUpdates?: boolean
    paymentConfirmations?: boolean
    preferredLanguage?: 'en' | 'th'
  }
) {
  try {
    const { prisma } = await import('./prisma')
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        customer: true,
        artist: true
      }
    })

    if (!user) {
      throw new Error('User not found')
    }

    // Update language preference based on user type
    if (preferences.preferredLanguage) {
      if (user.customer) {
        await prisma.customer.update({
          where: { userId: userId },
          data: {
            preferredLanguage: preferences.preferredLanguage
          }
        })
      } else if (user.artist) {
        // For artists, update their languages array
        const currentLanguages = user.artist.languages || []
        let updatedLanguages = [...currentLanguages]
        
        if (preferences.preferredLanguage === 'th' && !updatedLanguages.includes('th')) {
          updatedLanguages.push('th')
        } else if (preferences.preferredLanguage === 'en' && !updatedLanguages.includes('en')) {
          updatedLanguages.unshift('en') // Add English to the beginning
        }

        await prisma.artist.update({
          where: { userId: userId },
          data: {
            languages: updatedLanguages
          }
        })
      }
    }

    // Note: Email preferences would need to be stored in a separate table or
    // added as fields to the User model. For now, we'll just log the update.
    console.log(`Email preferences updated for user ${userId}:`, preferences)

    return {
      success: true,
      preferences: {
        ...preferences,
        updatedAt: new Date()
      }
    }

  } catch (error) {
    console.error('Failed to update user email preferences:', error)
    throw error
  }
}

/**
 * Check if user has consented to specific email type
 */
export async function checkEmailConsent(userId: string, emailType: string): Promise<boolean> {
  try {
    const preferences = await getUserEmailPreferences(userId)
    
    if (!preferences) return false

    // Check specific email type consent
    switch (emailType) {
      case 'booking_inquiry':
        return preferences.bookingInquiries
      case 'quote_received':
      case 'quote_accepted':
        return preferences.quoteUpdates || preferences.emailNotifications
      case 'payment_confirmed':
        return preferences.paymentConfirmations || preferences.emailNotifications
      case 'booking_confirmed':
      case 'cancellation_notice':
        return preferences.emailNotifications
      case 'event_reminder':
        return preferences.eventReminders
      case 'marketing':
        return preferences.marketingEmails
      case 'system':
        return preferences.systemNotifications
      default:
        return preferences.emailNotifications
    }
  } catch (error) {
    console.error('Failed to check email consent:', error)
    // Default to allowing emails if we can't check preferences
    return true
  }
}

/**
 * Validate email address format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Get localized subject based on user's preferred language
 */
export function getLocalizedSubject(
  subjectKey: string, 
  locale: string = 'en',
  variables: Record<string, string> = {}
): string {
  // This would integrate with your i18n system
  // For now, returning a basic implementation
  const subjects: Record<string, Record<string, string>> = {
    en: {
      booking_inquiry: 'New Booking Inquiry - {eventType}',
      quote_received: 'Quote Received for {eventType}',
      quote_accepted: 'Your Quote Has Been Accepted!',
      payment_confirmed: 'Payment Confirmed - {bookingNumber}',
      booking_confirmed: 'Booking Confirmed - {eventType}',
      event_reminder: 'Event Reminder: {eventType} Tomorrow',
      booking_completed: 'Booking Completed - Thank You!',
      cancellation_notice: 'Booking Cancelled - {eventType}',
      admin_notification: 'Admin Alert: {alertType}',
    },
    th: {
      booking_inquiry: 'การสอบถามการจองใหม่ - {eventType}',
      quote_received: 'ได้รับใบเสนอราคาสำหรับ {eventType}',
      quote_accepted: 'ใบเสนอราคาของคุณได้รับการยอมรับ!',
      payment_confirmed: 'ยืนยันการชำระเงิน - {bookingNumber}',
      booking_confirmed: 'ยืนยันการจอง - {eventType}',
      event_reminder: 'แจ้งเตือนงาน: {eventType} พรุ่งนี้',
      booking_completed: 'การจองเสร็จสิ้น - ขอบคุณ!',
      cancellation_notice: 'ยกเลิกการจอง - {eventType}',
      admin_notification: 'แจ้งเตือนผู้ดูแลระบบ: {alertType}',
    }
  }

  let subject = subjects[locale]?.[subjectKey] || subjects.en[subjectKey] || subjectKey
  
  // Replace variables in subject
  Object.entries(variables).forEach(([key, value]) => {
    subject = subject.replace(`{${key}}`, value)
  })

  return subject
}

/**
 * Send test email (for development/testing)
 */
export async function sendTestEmail(to: string): Promise<EmailResult> {
  return sendEmail({
    to,
    subject: 'Test Email from Bright Ears',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Test Email</h1>
        <p>This is a test email from the Bright Ears platform.</p>
        <p>If you received this, the email system is working correctly!</p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          Sent at: ${new Date().toISOString()}
        </p>
      </div>
    `,
    text: `Test Email\n\nThis is a test email from the Bright Ears platform.\nIf you received this, the email system is working correctly!\n\nSent at: ${new Date().toISOString()}`,
  })
}

// Export email configuration for use in other modules
export { EMAIL_CONFIG }