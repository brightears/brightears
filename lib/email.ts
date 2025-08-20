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
export function renderEmailTemplate(component: ReactElement): EmailTemplate {
  const html = render(component)
  const text = render(component, { plainText: true })
  
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
      select: {
        email: true,
        emailVerified: true,
        // You could add email preferences fields to the User model
        // emailNotifications: true,
        // marketingEmails: true,
      }
    })

    return {
      email: user?.email,
      emailVerified: !!user?.emailVerified,
      emailNotifications: true, // Default to true, could be user preference
      marketingEmails: false, // Default to false for compliance
    }
  } catch (error) {
    console.error('Failed to get user email preferences:', error)
    return null
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