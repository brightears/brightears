import { sendEmail, renderEmailTemplate } from './email'
import { prisma } from './prisma'

/**
 * Email template helper functions for sending various types of emails
 * This module provides typed functions for all email templates in the system
 */

/**
 * Send artist inquiry notification email
 * This is sent to the artist when they receive a new booking inquiry
 */
export async function sendArtistInquiryNotification({
  to,
  artistName,
  customerName,
  customerPhone,
  customerLineId,
  eventType,
  eventDate,
  message,
  bookingId,
  dashboardUrl,
  locale = 'en',
}: {
  to: string
  artistName: string
  customerName: string
  customerPhone?: string
  customerLineId?: string
  eventType?: string
  eventDate?: string
  message?: string
  bookingId: string
  dashboardUrl: string
  locale?: 'en' | 'th'
}) {
  const { default: ArtistInquiryNotificationEmail } = await import(
    '@/components/email/ArtistInquiryNotificationEmail'
  )

  const emailComponent = ArtistInquiryNotificationEmail({
    artistName,
    customerName,
    customerPhone,
    customerLineId,
    eventType,
    eventDate,
    message,
    bookingId,
    dashboardUrl,
    locale,
  }) as any

  const { html, text } = await renderEmailTemplate(emailComponent)

  const subject =
    locale === 'th'
      ? `มีผู้สนใจจากคุณ ${customerName}`
      : `New Inquiry from ${customerName}`

  const result = await sendEmail({
    to,
    subject,
    html,
    text,
    tags: [
      { name: 'template', value: 'artist_inquiry_notification' },
      { name: 'booking_id', value: bookingId },
      { name: 'locale', value: locale },
    ],
  })

  // Log the email
  if (result.success) {
    await logEmailToDatabase({
      to: [to],
      subject,
      templateName: 'artist_inquiry_notification',
      locale,
      status: 'SENT',
      messageId: result.messageId,
      relatedId: bookingId,
      relatedType: 'booking',
    })
  } else {
    await logEmailToDatabase({
      to: [to],
      subject,
      templateName: 'artist_inquiry_notification',
      locale,
      status: 'FAILED',
      error: result.error,
      relatedId: bookingId,
      relatedType: 'booking',
    })
  }

  return result
}

/**
 * Send booking inquiry email (existing template - for customer confirmation)
 */
export async function sendBookingInquiryEmail({
  to,
  artistName,
  customerName,
  eventType,
  eventDate,
  location,
  duration,
  additionalInfo,
  contactMethod,
  bookingUrl,
  locale = 'en',
}: {
  to: string
  artistName: string
  customerName: string
  eventType?: string
  eventDate?: string
  location?: string
  duration?: string
  additionalInfo?: string
  contactMethod?: string
  bookingUrl: string
  locale?: 'en' | 'th'
}) {
  const { default: BookingInquiryEmail } = await import(
    '@/components/email/BookingInquiryEmail'
  )

  const emailComponent = BookingInquiryEmail({
    artistName,
    customerName,
    eventType,
    eventDate,
    location,
    duration,
    additionalInfo,
    contactMethod,
    bookingUrl,
    locale,
  }) as any

  const { html, text } = await renderEmailTemplate(emailComponent)

  const subject =
    locale === 'th'
      ? `การสอบถามการจองใหม่${eventType ? ` - ${eventType}` : ''}`
      : `New Booking Inquiry${eventType ? ` - ${eventType}` : ''}`

  return sendEmail({
    to,
    subject,
    html,
    text,
    tags: [
      { name: 'template', value: 'booking_inquiry' },
      { name: 'locale', value: locale },
    ],
  })
}

/**
 * Send quote received email
 */
export async function sendQuoteReceivedEmail({
  to,
  customerName,
  artistName,
  eventType,
  eventDate,
  quotedPrice,
  currency,
  depositAmount,
  inclusions,
  exclusions,
  notes,
  validUntil,
  quoteUrl,
  locale = 'en',
}: {
  to: string
  customerName: string
  artistName: string
  eventType: string
  eventDate: string
  quotedPrice: string
  currency: string
  depositAmount?: string
  inclusions?: string[]
  exclusions?: string[]
  notes?: string
  validUntil: string
  quoteUrl: string
  locale?: 'en' | 'th'
}) {
  const { default: QuoteReceivedEmail } = await import(
    '@/components/email/QuoteReceivedEmail'
  )

  const emailComponent = QuoteReceivedEmail({
    customerName,
    artistName,
    eventType,
    eventDate,
    quotedPrice,
    currency,
    depositAmount,
    inclusions: inclusions || [],
    exclusions,
    notes,
    validUntil,
    quoteUrl,
    locale,
  }) as any

  const { html, text } = await renderEmailTemplate(emailComponent)

  const subject =
    locale === 'th'
      ? `ได้รับใบเสนอราคาสำหรับ ${eventType}`
      : `Quote Received for ${eventType}`

  return sendEmail({
    to,
    subject,
    html,
    text,
    tags: [
      { name: 'template', value: 'quote_received' },
      { name: 'locale', value: locale },
    ],
  })
}

/**
 * Send quote accepted email to artist
 */
export async function sendQuoteAcceptedEmail({
  to,
  artistName,
  customerName,
  eventType,
  eventDate,
  eventTime,
  venue,
  acceptedPrice,
  currency,
  depositAmount,
  customerNotes,
  bookingUrl,
  locale = 'en',
}: {
  to: string
  artistName: string
  customerName: string
  eventType: string
  eventDate: string
  eventTime: string
  venue: string
  acceptedPrice: string
  currency: string
  depositAmount?: string
  customerNotes?: string
  bookingUrl: string
  locale?: 'en' | 'th'
}) {
  const { default: QuoteAcceptedEmail } = await import(
    '@/components/email/QuoteAcceptedEmail'
  )

  const emailComponent = QuoteAcceptedEmail({
    artistName,
    customerName,
    eventType,
    eventDate,
    eventTime,
    venue,
    acceptedPrice,
    currency,
    depositAmount,
    customerNotes,
    bookingUrl,
    locale,
  }) as any

  const { html, text } = await renderEmailTemplate(emailComponent)

  const subject =
    locale === 'th'
      ? `ใบเสนอราคาของคุณได้รับการยอมรับ!`
      : `Your Quote Has Been Accepted!`

  return sendEmail({
    to,
    subject,
    html,
    text,
    tags: [
      { name: 'template', value: 'quote_accepted' },
      { name: 'locale', value: locale },
    ],
  })
}

/**
 * Send payment confirmation email
 */
export async function sendPaymentConfirmationEmail({
  to,
  customerName,
  artistName,
  bookingNumber,
  eventType,
  eventDate,
  paymentAmount,
  currency,
  paymentType,
  paymentMethod,
  transactionRef,
  bookingUrl,
  locale = 'en',
}: {
  to: string
  customerName: string
  artistName: string
  bookingNumber: string
  eventType: string
  eventDate: string
  paymentAmount: string
  currency: string
  paymentType: string
  paymentMethod: string
  transactionRef?: string
  bookingUrl: string
  locale?: 'en' | 'th'
}) {
  const { default: PaymentConfirmationEmail } = await import(
    '@/components/email/PaymentConfirmationEmail'
  )

  const emailComponent = PaymentConfirmationEmail({
    customerName,
    artistName,
    bookingNumber,
    eventType,
    eventDate,
    paymentAmount,
    currency,
    paymentType: paymentType as 'deposit' | 'full' | 'remaining',
    paymentMethod,
    transactionRef,
    bookingUrl,
    locale,
  }) as any

  const { html, text } = await renderEmailTemplate(emailComponent)

  const subject =
    locale === 'th'
      ? `ยืนยันการชำระเงิน - ${bookingNumber}`
      : `Payment Confirmed - ${bookingNumber}`

  return sendEmail({
    to,
    subject,
    html,
    text,
    tags: [
      { name: 'template', value: 'payment_confirmed' },
      { name: 'booking_number', value: bookingNumber },
      { name: 'locale', value: locale },
    ],
  })
}

/**
 * Send booking confirmed email
 */
export async function sendBookingConfirmedEmail({
  to,
  customerName,
  artistName,
  bookingNumber,
  eventType,
  eventDate,
  startTime,
  endTime,
  venue,
  venueAddress,
  finalPrice,
  currency,
  depositAmount,
  depositPaid,
  guestCount,
  specialRequests,
  dashboardUrl,
  locale = 'en',
}: {
  to: string
  customerName: string
  artistName: string
  bookingNumber: string
  eventType: string
  eventDate: string
  startTime: string
  endTime: string
  venue: string
  venueAddress: string
  finalPrice: number
  currency: string
  depositAmount?: number
  depositPaid?: boolean
  guestCount?: number
  specialRequests?: string
  dashboardUrl: string
  locale?: 'en' | 'th'
}) {
  const { default: BookingConfirmedEmail } = await import(
    '@/components/email/BookingConfirmedEmail'
  )

  const emailComponent = BookingConfirmedEmail({
    customerName,
    artistName,
    bookingNumber,
    eventType,
    eventDate,
    startTime,
    endTime,
    venue,
    venueAddress,
    finalPrice,
    currency,
    depositAmount,
    depositPaid: depositPaid || false,
    guestCount,
    specialRequests,
    dashboardUrl,
    locale,
  }) as any

  const { html, text } = await renderEmailTemplate(emailComponent)

  const subject =
    locale === 'th' ? `ยืนยันการจอง - ${eventType}` : `Booking Confirmed - ${eventType}`

  return sendEmail({
    to,
    subject,
    html,
    text,
    tags: [
      { name: 'template', value: 'booking_confirmed' },
      { name: 'booking_number', value: bookingNumber },
      { name: 'locale', value: locale },
    ],
  })
}

/**
 * Send event reminder email
 */
export async function sendEventReminderEmail({
  to,
  recipientName,
  recipientType,
  artistName,
  customerName,
  eventType,
  eventDate,
  eventTime,
  venue,
  venueAddress,
  duration,
  finalPrice,
  currency,
  specialRequests,
  artistPhone,
  customerPhone,
  bookingUrl,
  locale = 'en',
}: {
  to: string
  recipientName: string
  recipientType: string
  artistName: string
  customerName: string
  eventType: string
  eventDate: string
  eventTime: string
  venue: string
  venueAddress: string
  duration?: string
  finalPrice?: string
  currency?: string
  specialRequests?: string
  artistPhone?: string
  customerPhone?: string
  bookingUrl: string
  locale?: 'en' | 'th'
}) {
  const { default: EventReminderEmail } = await import(
    '@/components/email/EventReminderEmail'
  )

  const emailComponent = EventReminderEmail({
    recipientName,
    recipientType: recipientType as 'customer' | 'artist',
    artistName,
    customerName,
    eventType,
    eventDate,
    eventTime,
    venue,
    venueAddress,
    duration: duration || '',
    finalPrice: finalPrice || '',
    currency: currency || 'THB',
    specialRequests,
    artistPhone,
    customerPhone,
    bookingUrl,
    locale,
  }) as any

  const { html, text } = await renderEmailTemplate(emailComponent)

  const subject =
    locale === 'th'
      ? `แจ้งเตือนงาน: ${eventType} พรุ่งนี้`
      : `Event Reminder: ${eventType} Tomorrow`

  return sendEmail({
    to,
    subject,
    html,
    text,
    tags: [
      { name: 'template', value: 'event_reminder' },
      { name: 'locale', value: locale },
    ],
  })
}

/**
 * Send booking completed email
 */
export async function sendBookingCompletedEmail({
  to,
  recipientName,
  recipientType,
  artistName,
  customerName,
  bookingNumber,
  eventType,
  eventDate,
  finalPrice,
  currency,
  reviewUrl,
  locale = 'en',
}: {
  to: string
  recipientName: string
  recipientType: string
  artistName: string
  customerName: string
  bookingNumber: string
  eventType: string
  eventDate: string
  finalPrice: string
  currency: string
  reviewUrl: string
  locale?: 'en' | 'th'
}) {
  const { default: BookingCompletedEmail } = await import(
    '@/components/email/BookingCompletedEmail'
  )

  const emailComponent = BookingCompletedEmail({
    recipientName,
    recipientType: recipientType as 'customer' | 'artist',
    artistName,
    customerName,
    bookingNumber,
    eventType,
    eventDate,
    finalPrice,
    currency,
    reviewUrl,
    locale,
  }) as any

  const { html, text } = await renderEmailTemplate(emailComponent)

  const subject =
    locale === 'th' ? 'การจองเสร็จสิ้น - ขอบคุณ!' : 'Booking Completed - Thank You!'

  return sendEmail({
    to,
    subject,
    html,
    text,
    tags: [
      { name: 'template', value: 'booking_completed' },
      { name: 'locale', value: locale },
    ],
  })
}

/**
 * Send cancellation notice email
 */
export async function sendCancellationNoticeEmail({
  to,
  recipientName,
  senderName,
  senderRole,
  bookingNumber,
  eventType,
  eventDate,
  venue,
  cancellationReason,
  refundAmount,
  currency,
  refundTimeline,
  dashboardUrl,
  supportUrl,
  locale = 'en',
}: {
  to: string
  recipientName: string
  senderName: string
  senderRole: string
  bookingNumber: string
  eventType: string
  eventDate: string
  venue: string
  cancellationReason: string
  refundAmount?: number
  currency?: string
  refundTimeline?: string
  dashboardUrl: string
  supportUrl: string
  locale?: 'en' | 'th'
}) {
  const { default: CancellationNoticeEmail } = await import(
    '@/components/email/CancellationNoticeEmail'
  )

  const emailComponent = CancellationNoticeEmail({
    recipientName,
    senderName,
    senderRole: senderRole as 'artist' | 'customer' | 'admin',
    bookingNumber,
    eventType,
    eventDate,
    venue,
    cancellationReason,
    refundAmount,
    currency,
    refundTimeline,
    dashboardUrl,
    supportUrl,
    locale,
  }) as any

  const { html, text } = await renderEmailTemplate(emailComponent)

  const subject =
    locale === 'th' ? `ยกเลิกการจอง - ${eventType}` : `Booking Cancelled - ${eventType}`

  return sendEmail({
    to,
    subject,
    html,
    text,
    tags: [
      { name: 'template', value: 'cancellation_notice' },
      { name: 'booking_number', value: bookingNumber },
      { name: 'locale', value: locale },
    ],
  })
}

/**
 * Get user's locale preference
 */
export async function getUserLocale(userId: string): Promise<'en' | 'th'> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        customer: {
          select: {
            preferredLanguage: true,
          },
        },
        artist: {
          select: {
            languages: true,
          },
        },
      },
    })

    if (!user) return 'en'

    // Check customer preferred language
    if (user.customer?.preferredLanguage) {
      return user.customer.preferredLanguage as 'en' | 'th'
    }

    // Check artist languages
    if (user.artist?.languages?.includes('th')) {
      return 'th'
    }

    return 'en'
  } catch (error) {
    console.error('Error getting user locale:', error)
    return 'en'
  }
}

/**
 * Generate dashboard URL for a specific user role
 */
export function generateDashboardUrl(role: 'ARTIST' | 'CUSTOMER' | 'CORPORATE' | 'ADMIN'): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const dashboardPaths = {
    ARTIST: '/artist/dashboard',
    CUSTOMER: '/customer/dashboard',
    CORPORATE: '/corporate/dashboard',
    ADMIN: '/admin/dashboard',
  }

  return `${baseUrl}${dashboardPaths[role]}`
}

/**
 * Generate support URL
 */
export function generateSupportUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${baseUrl}/support`
}

/**
 * Generate booking detail URL
 */
export function generateBookingUrl(bookingId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${baseUrl}/booking/${bookingId}`
}

/**
 * Send multiple emails in bulk (for sending to multiple recipients)
 * Useful for sending notifications to both customer and artist
 */
export async function sendBulkEmails(emailTasks: Array<() => Promise<any>>): Promise<void> {
  try {
    await Promise.all(emailTasks.map(task => task().catch(error => {
      console.error('Failed to send bulk email:', error)
      return null
    })))
  } catch (error) {
    console.error('Error in bulk email sending:', error)
  }
}

/**
 * Log email to database
 */
async function logEmailToDatabase({
  to,
  subject,
  templateName,
  locale,
  status,
  messageId,
  error,
  relatedId,
  relatedType,
}: {
  to: string[]
  subject: string
  templateName: string
  locale: string
  status: 'SENT' | 'FAILED'
  messageId?: string
  error?: string
  relatedId?: string
  relatedType?: string
}) {
  try {
    await prisma.emailLog.create({
      data: {
        toAddresses: to,
        subject,
        templateName,
        locale,
        status,
        messageId,
        error,
        relatedId,
        relatedType,
        sentAt: status === 'SENT' ? new Date() : undefined,
      },
    })
  } catch (error) {
    console.error('Failed to log email to database:', error)
  }
}
