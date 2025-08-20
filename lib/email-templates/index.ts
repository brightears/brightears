import { render } from '@react-email/render'
import { sendEmail, EmailResult, getLocalizedSubject, getUserEmailPreferences, checkEmailConsent } from '../email'

// Import email components
import BookingInquiryEmail from '../../components/email/BookingInquiryEmail'
import QuoteReceivedEmail from '../../components/email/QuoteReceivedEmail'
import QuoteAcceptedEmail from '../../components/email/QuoteAcceptedEmail'
import PaymentConfirmationEmail from '../../components/email/PaymentConfirmationEmail'
import BookingConfirmedEmail from '../../components/email/BookingConfirmedEmail'
import EventReminderEmail from '../../components/email/EventReminderEmail'
import BookingCompletedEmail from '../../components/email/BookingCompletedEmail'
import CancellationNoticeEmail from '../../components/email/CancellationNoticeEmail'

// Types for email data
export interface BookingInquiryEmailData {
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
}

export interface QuoteReceivedEmailData {
  to: string
  customerName: string
  artistName: string
  eventType: string
  eventDate: string
  quotedPrice: string
  currency: string
  depositAmount?: string
  inclusions: string[]
  exclusions?: string[]
  notes?: string
  validUntil: string
  quoteUrl: string
  locale?: 'en' | 'th'
}

export interface QuoteAcceptedEmailData {
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
}

export interface PaymentConfirmationEmailData {
  to: string
  customerName: string
  artistName: string
  bookingNumber: string
  eventType: string
  eventDate: string
  paymentAmount: string
  currency: string
  paymentType: 'deposit' | 'full' | 'remaining'
  paymentMethod: string
  transactionRef?: string
  bookingUrl: string
  locale?: 'en' | 'th'
}

export interface EventReminderEmailData {
  to: string
  recipientName: string
  recipientType: 'customer' | 'artist'
  artistName: string
  customerName: string
  eventType: string
  eventDate: string
  eventTime: string
  venue: string
  venueAddress: string
  duration: string
  finalPrice: string
  currency: string
  specialRequests?: string
  artistPhone?: string
  customerPhone?: string
  bookingUrl: string
  locale?: 'en' | 'th'
}

export interface BookingCompletedEmailData {
  to: string
  recipientName: string
  recipientType: 'customer' | 'artist'
  artistName: string
  customerName: string
  eventType: string
  eventDate: string
  bookingNumber: string
  finalPrice: string
  currency: string
  reviewUrl?: string
  locale?: 'en' | 'th'
}

export interface BookingConfirmedEmailData {
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
  depositPaid: boolean
  guestCount?: number
  specialRequests?: string
  artistContact?: string
  dashboardUrl: string
  locale?: 'en' | 'th'
}

export interface CancellationNoticeEmailData {
  to: string
  recipientName: string
  senderName: string
  senderRole: 'customer' | 'artist' | 'admin'
  bookingNumber: string
  eventType: string
  eventDate: string
  venue: string
  cancellationReason?: string
  refundAmount?: number
  currency?: string
  refundTimeline?: string
  cancellationPolicy?: string
  dashboardUrl: string
  supportUrl: string
  locale?: 'en' | 'th'
}

/**
 * Send booking inquiry email to artist
 */
export async function sendBookingInquiryEmail(data: BookingInquiryEmailData): Promise<EmailResult> {
  try {
    // Get artist user ID from email
    const { prisma } = await import('../prisma')
    const artistUser = await prisma.user.findUnique({
      where: { email: data.to },
      select: { id: true }
    })

    if (!artistUser) {
      return { success: false, error: 'Artist user not found' }
    }

    // Check email consent
    const hasConsent = await checkEmailConsent(artistUser.id, 'booking_inquiry')
    if (!hasConsent) {
      console.log(`Email consent denied for booking inquiry to ${data.to}`)
      return { success: false, error: 'User has not consented to receive booking inquiry emails' }
    }

    // Get user preferences for language
    const prefs = await getUserEmailPreferences(artistUser.id)
    const locale = data.locale || prefs?.preferredLanguage || 'en'
    
    const subject = getLocalizedSubject('booking_inquiry', locale, {
      eventType: data.eventType || 'Event'
    })

    const emailComponent = BookingInquiryEmail({
      artistName: data.artistName,
      customerName: data.customerName,
      eventType: data.eventType,
      eventDate: data.eventDate,
      location: data.location,
      duration: data.duration,
      additionalInfo: data.additionalInfo,
      contactMethod: data.contactMethod,
      bookingUrl: data.bookingUrl,
      locale,
    })

    const html = render(emailComponent)
    const text = render(emailComponent, { plainText: true })

    return await sendEmail({
      to: data.to,
      subject,
      html,
      text,
      tags: [
        { name: 'email_type', value: 'booking_inquiry' },
        { name: 'locale', value: locale },
      ],
    })
  } catch (error) {
    console.error('Error sending booking inquiry email:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email' 
    }
  }
}

/**
 * Send quote received email to customer
 */
export async function sendQuoteReceivedEmail(data: QuoteReceivedEmailData): Promise<EmailResult> {
  try {
    const locale = data.locale || 'en'
    const subject = getLocalizedSubject('quote_received', locale, {
      eventType: data.eventType
    })

    const emailComponent = QuoteReceivedEmail(data)
    const html = render(emailComponent)
    const text = render(emailComponent, { plainText: true })

    return await sendEmail({
      to: data.to,
      subject,
      html,
      text,
      tags: [
        { name: 'email_type', value: 'quote_received' },
        { name: 'locale', value: locale },
      ],
    })
  } catch (error) {
    console.error('Error sending quote received email:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email' 
    }
  }
}

/**
 * Send quote accepted email to artist
 */
export async function sendQuoteAcceptedEmail(data: QuoteAcceptedEmailData): Promise<EmailResult> {
  try {
    const locale = data.locale || 'en'
    const subject = getLocalizedSubject('quote_accepted', locale)

    const emailComponent = QuoteAcceptedEmail(data)
    const html = render(emailComponent)
    const text = render(emailComponent, { plainText: true })

    return await sendEmail({
      to: data.to,
      subject,
      html,
      text,
      tags: [
        { name: 'email_type', value: 'quote_accepted' },
        { name: 'locale', value: locale },
      ],
    })
  } catch (error) {
    console.error('Error sending quote accepted email:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email' 
    }
  }
}

/**
 * Send payment confirmation email
 */
export async function sendPaymentConfirmationEmail(data: PaymentConfirmationEmailData): Promise<EmailResult> {
  try {
    const locale = data.locale || 'en'
    const subject = getLocalizedSubject('payment_confirmed', locale, {
      bookingNumber: data.bookingNumber
    })

    const emailComponent = PaymentConfirmationEmail(data)
    const html = render(emailComponent)
    const text = render(emailComponent, { plainText: true })

    return await sendEmail({
      to: data.to,
      subject,
      html,
      text,
      tags: [
        { name: 'email_type', value: 'payment_confirmation' },
        { name: 'payment_type', value: data.paymentType },
        { name: 'locale', value: locale },
      ],
    })
  } catch (error) {
    console.error('Error sending payment confirmation email:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email' 
    }
  }
}

/**
 * Send event reminder email
 */
export async function sendEventReminderEmail(data: EventReminderEmailData): Promise<EmailResult> {
  try {
    const locale = data.locale || 'en'
    const subject = getLocalizedSubject('event_reminder', locale, {
      eventType: data.eventType
    })

    const emailComponent = EventReminderEmail(data)
    const html = render(emailComponent)
    const text = render(emailComponent, { plainText: true })

    return await sendEmail({
      to: data.to,
      subject,
      html,
      text,
      tags: [
        { name: 'email_type', value: 'event_reminder' },
        { name: 'recipient_type', value: data.recipientType },
        { name: 'locale', value: locale },
      ],
    })
  } catch (error) {
    console.error('Error sending event reminder email:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email' 
    }
  }
}

/**
 * Send booking completed email
 */
export async function sendBookingCompletedEmail(data: BookingCompletedEmailData): Promise<EmailResult> {
  try {
    const locale = data.locale || 'en'
    const subject = getLocalizedSubject('booking_completed', locale)

    const emailComponent = BookingCompletedEmail(data)
    const html = render(emailComponent)
    const text = render(emailComponent, { plainText: true })

    return await sendEmail({
      to: data.to,
      subject,
      html,
      text,
      tags: [
        { name: 'email_type', value: 'booking_completed' },
        { name: 'recipient_type', value: data.recipientType },
        { name: 'locale', value: locale },
      ],
    })
  } catch (error) {
    console.error('Error sending booking completed email:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email' 
    }
  }
}

/**
 * Send multiple emails in sequence with error handling
 */
export async function sendBulkEmails(emails: Array<() => Promise<EmailResult>>): Promise<EmailResult[]> {
  const results: EmailResult[] = []
  
  for (const emailFunction of emails) {
    try {
      const result = await emailFunction()
      results.push(result)
      
      // Add small delay between emails to avoid rate limiting
      if (emails.length > 1) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    } catch (error) {
      results.push({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }
  
  return results
}

/**
 * Send booking confirmed email to customer
 */
export async function sendBookingConfirmedEmail(data: BookingConfirmedEmailData): Promise<EmailResult> {
  try {
    const locale = data.locale || 'en'
    const subject = getLocalizedSubject('booking_confirmed', locale, {
      eventType: data.eventType
    })

    const emailComponent = BookingConfirmedEmail({
      customerName: data.customerName,
      artistName: data.artistName,
      bookingNumber: data.bookingNumber,
      eventType: data.eventType,
      eventDate: data.eventDate,
      startTime: data.startTime,
      endTime: data.endTime,
      venue: data.venue,
      venueAddress: data.venueAddress,
      finalPrice: data.finalPrice,
      currency: data.currency,
      depositAmount: data.depositAmount,
      depositPaid: data.depositPaid,
      guestCount: data.guestCount,
      specialRequests: data.specialRequests,
      artistContact: data.artistContact,
      dashboardUrl: data.dashboardUrl,
      locale,
    })

    const html = render(emailComponent)
    const text = render(emailComponent, { plainText: true })

    return await sendEmail({
      to: data.to,
      subject,
      html,
      text,
      tags: [
        { name: 'email_type', value: 'booking_confirmed' },
        { name: 'locale', value: locale },
      ],
    })
  } catch (error) {
    console.error('Error sending booking confirmed email:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email' 
    }
  }
}

/**
 * Send cancellation notice email
 */
export async function sendCancellationNoticeEmail(data: CancellationNoticeEmailData): Promise<EmailResult> {
  try {
    const locale = data.locale || 'en'
    const subject = getLocalizedSubject('cancellation_notice', locale, {
      eventType: data.eventType
    })

    const emailComponent = CancellationNoticeEmail({
      recipientName: data.recipientName,
      senderName: data.senderName,
      senderRole: data.senderRole,
      bookingNumber: data.bookingNumber,
      eventType: data.eventType,
      eventDate: data.eventDate,
      venue: data.venue,
      cancellationReason: data.cancellationReason,
      refundAmount: data.refundAmount,
      currency: data.currency,
      refundTimeline: data.refundTimeline,
      cancellationPolicy: data.cancellationPolicy,
      dashboardUrl: data.dashboardUrl,
      supportUrl: data.supportUrl,
      locale,
    })

    const html = render(emailComponent)
    const text = render(emailComponent, { plainText: true })

    return await sendEmail({
      to: data.to,
      subject,
      html,
      text,
      tags: [
        { name: 'email_type', value: 'cancellation_notice' },
        { name: 'sender_role', value: data.senderRole },
        { name: 'locale', value: locale },
      ],
    })
  } catch (error) {
    console.error('Error sending cancellation notice email:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email' 
    }
  }
}

/**
 * Helper function to get user's preferred locale
 */
export async function getUserLocale(userId: string): Promise<'en' | 'th'> {
  try {
    const { prisma } = await import('../prisma')
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        customer: {
          select: { preferredLanguage: true }
        }
      }
    })

    // Default to English if not specified
    return (user?.customer?.preferredLanguage as 'en' | 'th') || 'en'
  } catch (error) {
    console.error('Error getting user locale:', error)
    return 'en'
  }
}

/**
 * Helper function to generate dashboard URLs
 */
export function generateDashboardUrl(userRole: string, bookingId?: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://brightears.com'
  
  switch (userRole) {
    case 'ARTIST':
      return `${baseUrl}/dashboard/artist/bookings${bookingId ? `?booking=${bookingId}` : ''}`
    case 'CUSTOMER':
      return `${baseUrl}/dashboard/customer/bookings${bookingId ? `?booking=${bookingId}` : ''}`
    case 'CORPORATE':
      return `${baseUrl}/dashboard/corporate/bookings${bookingId ? `?booking=${bookingId}` : ''}`
    case 'ADMIN':
      return `${baseUrl}/dashboard/admin/bookings${bookingId ? `/${bookingId}` : ''}`
    default:
      return `${baseUrl}/dashboard`
  }
}

/**
 * Helper function to generate support URL
 */
export function generateSupportUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://brightears.com'
  return `${baseUrl}/support`
}