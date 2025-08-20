import { render } from '@react-email/render'
import { sendEmail, EmailResult, getLocalizedSubject, getUserEmailPreferences } from '../email'

// Import email components
import BookingInquiryEmail from '../../components/email/BookingInquiryEmail'
import QuoteReceivedEmail from '../../components/email/QuoteReceivedEmail'
import QuoteAcceptedEmail from '../../components/email/QuoteAcceptedEmail'
import PaymentConfirmationEmail from '../../components/email/PaymentConfirmationEmail'
import EventReminderEmail from '../../components/email/EventReminderEmail'
import BookingCompletedEmail from '../../components/email/BookingCompletedEmail'

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

/**
 * Send booking inquiry email to artist
 */
export async function sendBookingInquiryEmail(data: BookingInquiryEmailData): Promise<EmailResult> {
  try {
    // Check email preferences
    const artistPrefs = await getUserEmailPreferences(data.to)
    if (!artistPrefs?.emailNotifications) {
      return { success: false, error: 'User has disabled email notifications' }
    }

    const locale = data.locale || 'en'
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