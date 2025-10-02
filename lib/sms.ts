import { Twilio } from 'twilio'

/**
 * SMS notification service using Twilio
 * Supports Thai phone numbers and international format
 */

// Initialize Twilio client (only if credentials are available)
const twilioClient =
  process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
    ? new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    : null

// SMS configuration
const SMS_CONFIG = {
  fromNumber: process.env.TWILIO_PHONE_NUMBER || '',
  maxRetries: 2,
  retryDelay: 2000, // 2 seconds
  maxLength: 160, // Standard SMS length
  // Thai SMS provider fallback
  thaiProvider: process.env.THAI_SMS_PROVIDER || 'twilio', // 'twilio' | 'thsms' | 'sms77'
}

export interface SMSResult {
  success: boolean
  messageId?: string
  error?: string
  retryCount?: number
  cost?: number
}

export interface SMSTemplate {
  message: string
  length: number
}

/**
 * Format phone number to international E.164 format
 * Handles Thai phone numbers specifically
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '')

  // Handle Thai phone numbers
  if (cleaned.startsWith('0')) {
    // Thai local format (0812345678) -> +66812345678
    cleaned = '66' + cleaned.substring(1)
  } else if (cleaned.startsWith('66')) {
    // Already in Thai international format
  } else if (cleaned.startsWith('+66')) {
    // Already formatted with +
    return cleaned
  } else {
    // Assume it needs +66 prefix
    cleaned = '66' + cleaned
  }

  return '+' + cleaned
}

/**
 * Validate Thai phone number format
 */
export function isValidThaiPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '')

  // Thai mobile numbers:
  // - Start with 0 (local) or 66 (international)
  // - Mobile prefixes: 06, 08, 09
  // - Total 10 digits (local) or 11 digits (with country code)

  const localPattern = /^0[689]\d{8}$/
  const internationalPattern = /^66[689]\d{8}$/

  return localPattern.test(cleaned) || internationalPattern.test(cleaned)
}

/**
 * Send SMS notification
 */
export async function sendSMS(
  to: string,
  message: string,
  options: {
    priority?: 'high' | 'normal'
    trackOpens?: boolean
    scheduledAt?: Date
  } = {}
): Promise<SMSResult> {
  // Validate and format phone number
  if (!isValidThaiPhone(to)) {
    return {
      success: false,
      error: 'Invalid Thai phone number format',
    }
  }

  const formattedPhone = formatPhoneNumber(to)

  // Check if Twilio is configured
  if (!twilioClient || !SMS_CONFIG.fromNumber) {
    const error = 'SMS service not configured - missing Twilio credentials'
    console.warn(error)

    // Log failed SMS attempt
    await logSMS({
      to: formattedPhone,
      message,
      status: 'failed',
      error,
    })

    return {
      success: false,
      error,
    }
  }

  // Truncate message if too long
  const truncatedMessage = message.substring(0, SMS_CONFIG.maxLength)
  if (message.length > SMS_CONFIG.maxLength) {
    console.warn(
      `SMS message truncated from ${message.length} to ${SMS_CONFIG.maxLength} characters`
    )
  }

  let lastError = ''

  // Retry logic
  for (let attempt = 0; attempt <= SMS_CONFIG.maxRetries; attempt++) {
    try {
      const result = await twilioClient.messages.create({
        body: truncatedMessage,
        from: SMS_CONFIG.fromNumber,
        to: formattedPhone,
        // Optional: Track delivery status
        statusCallback: process.env.TWILIO_STATUS_CALLBACK_URL,
      })

      // Log successful SMS
      await logSMS({
        to: formattedPhone,
        message: truncatedMessage,
        status: 'sent',
        messageId: result.sid,
        provider: 'twilio',
      })

      return {
        success: true,
        messageId: result.sid,
        retryCount: attempt,
        cost: parseFloat(result.price || '0'),
      }
    } catch (error) {
      lastError = error instanceof Error ? error.message : 'Unknown error'
      console.error(`SMS send attempt ${attempt + 1} failed:`, lastError)

      // Don't retry on the last attempt
      if (attempt < SMS_CONFIG.maxRetries) {
        await new Promise((resolve) =>
          setTimeout(resolve, SMS_CONFIG.retryDelay * (attempt + 1))
        )
      }
    }
  }

  // Log failed SMS
  await logSMS({
    to: formattedPhone,
    message: truncatedMessage,
    status: 'failed',
    error: lastError,
    provider: 'twilio',
  })

  return {
    success: false,
    error: lastError,
    retryCount: SMS_CONFIG.maxRetries,
  }
}

/**
 * Generate SMS template for artist inquiry notification
 */
export function generateArtistInquirySMS({
  customerName,
  eventType,
  eventDate,
  bookingId,
  locale = 'en',
}: {
  customerName: string
  eventType: string
  eventDate?: string
  bookingId: string
  locale?: 'en' | 'th'
}): SMSTemplate {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://brightears.onrender.com'
  const shortUrl = `${baseUrl}/i/${bookingId}`

  let message: string

  if (locale === 'th') {
    // Thai version
    const dateStr = eventDate
      ? ` วันที่ ${new Date(eventDate).toLocaleDateString('th-TH', { month: 'short', day: 'numeric' })}`
      : ''
    message = `มีผู้สนใจจอง! ${customerName} ต้องการ${eventType}${dateStr} ดูรายละเอียด: ${shortUrl}`
  } else {
    // English version
    const dateStr = eventDate
      ? ` on ${new Date(eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
      : ''
    message = `New inquiry from ${customerName} for ${eventType}${dateStr}. View: ${shortUrl}`
  }

  return {
    message,
    length: message.length,
  }
}

/**
 * Generate SMS template for quote received notification
 */
export function generateQuoteReceivedSMS({
  artistName,
  eventType,
  price,
  currency = 'THB',
  bookingId,
  locale = 'en',
}: {
  artistName: string
  eventType: string
  price: number
  currency?: string
  bookingId: string
  locale?: 'en' | 'th'
}): SMSTemplate {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://brightears.onrender.com'
  const shortUrl = `${baseUrl}/b/${bookingId}`

  const formattedPrice = new Intl.NumberFormat(locale === 'th' ? 'th-TH' : 'en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price)

  let message: string

  if (locale === 'th') {
    message = `${artistName} ส่งใบเสนอราคาแล้ว! ${eventType}: ${formattedPrice} ดูรายละเอียด: ${shortUrl}`
  } else {
    message = `${artistName} sent you a quote! ${eventType}: ${formattedPrice}. View: ${shortUrl}`
  }

  return {
    message,
    length: message.length,
  }
}

/**
 * Generate SMS template for booking confirmation
 */
export function generateBookingConfirmedSMS({
  artistName,
  eventType,
  eventDate,
  eventTime,
  bookingId,
  locale = 'en',
}: {
  artistName: string
  eventType: string
  eventDate: string
  eventTime: string
  bookingId: string
  locale?: 'en' | 'th'
}): SMSTemplate {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://brightears.onrender.com'
  const shortUrl = `${baseUrl}/b/${bookingId}`

  const dateStr = new Date(eventDate).toLocaleDateString(
    locale === 'th' ? 'th-TH' : 'en-US',
    {
      month: 'short',
      day: 'numeric',
    }
  )

  let message: string

  if (locale === 'th') {
    message = `ยืนยันการจองแล้ว! ${artistName} - ${eventType} ${dateStr} ${eventTime} รายละเอียด: ${shortUrl}`
  } else {
    message = `Booking confirmed! ${artistName} - ${eventType} ${dateStr} ${eventTime}. Details: ${shortUrl}`
  }

  return {
    message,
    length: message.length,
  }
}

/**
 * Send artist inquiry SMS notification
 */
export async function sendArtistInquirySMS({
  to,
  customerName,
  eventType,
  eventDate,
  bookingId,
  locale = 'en',
}: {
  to: string
  customerName: string
  eventType: string
  eventDate?: string
  bookingId: string
  locale?: 'en' | 'th'
}): Promise<SMSResult> {
  const template = generateArtistInquirySMS({
    customerName,
    eventType,
    eventDate,
    bookingId,
    locale,
  })

  return sendSMS(to, template.message, { priority: 'high' })
}

/**
 * Log SMS to database or console
 */
async function logSMS({
  to,
  message,
  status,
  messageId,
  error,
  provider = 'twilio',
}: {
  to: string
  message: string
  status: 'sent' | 'failed'
  messageId?: string
  error?: string
  provider?: string
}) {
  // For now, log to console
  // In production, you might want to store this in a database
  console.log('SMS log:', {
    timestamp: new Date().toISOString(),
    to,
    message: message.substring(0, 50) + '...',
    status,
    messageId,
    error,
    provider,
  })

  // TODO: Implement SMS logging to database
  // You could create an SMSLog model in Prisma schema similar to EmailLog
}

/**
 * Get SMS cost estimate
 */
export function estimateSMSCost(
  messageLength: number,
  destination: string = 'TH'
): {
  segments: number
  estimatedCost: number
  currency: string
} {
  // SMS segments (160 chars per segment for basic SMS)
  const segments = Math.ceil(messageLength / 160)

  // Estimated cost per segment (Twilio pricing for Thailand)
  // Note: Actual pricing varies - check Twilio pricing page
  const costPerSegment = 0.045 // USD per segment to Thailand

  return {
    segments,
    estimatedCost: segments * costPerSegment,
    currency: 'USD',
  }
}

/**
 * Check if SMS notifications are enabled for user
 */
export async function checkSMSConsent(userId: string): Promise<boolean> {
  try {
    const { prisma } = await import('./prisma')

    // Check if user has SMS preferences stored
    // This would need to be added to your schema
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        phone: true,
        isPhoneVerified: true,
        // Add smsNotificationsEnabled field to User model if needed
      },
    })

    // User must have verified phone and not opted out
    return !!(user?.phone && user.isPhoneVerified)
  } catch (error) {
    console.error('Failed to check SMS consent:', error)
    return false
  }
}

// Export SMS configuration for use in other modules
export { SMS_CONFIG }
