import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { safeErrorResponse } from '@/lib/api-auth'
import { sendTestEmail } from '@/lib/email'
import { 
  sendBookingInquiryEmail,
  sendQuoteReceivedEmail,
  sendQuoteAcceptedEmail,
  sendPaymentConfirmationEmail,
  sendBookingConfirmedEmail,
  sendEventReminderEmail,
  sendBookingCompletedEmail,
  sendCancellationNoticeEmail,
  getUserLocale,
  generateDashboardUrl,
  generateSupportUrl
} from '@/lib/email-templates'

/**
 * Manual email sending and testing endpoint
 * Admin-only for testing and manual email operations
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { action, emailType, templateData, testEmail } = body

    switch (action) {
      case 'send_test':
        // Send basic test email
        if (!testEmail) {
          return NextResponse.json({ error: 'Test email address is required' }, { status: 400 })
        }

        const testResult = await sendTestEmail(testEmail)
        return NextResponse.json({
          success: testResult.success,
          message: testResult.success ? 'Test email sent successfully' : 'Failed to send test email',
          error: testResult.error,
          messageId: testResult.messageId
        })

      case 'send_template':
        // Send specific email template
        if (!emailType || !templateData) {
          return NextResponse.json({ 
            error: 'Email type and template data are required' 
          }, { status: 400 })
        }

        const templateResult = await sendTemplateEmail(emailType, templateData)
        return NextResponse.json({
          success: templateResult.success,
          message: templateResult.success ? 
            `${emailType} email sent successfully` : 
            `Failed to send ${emailType} email`,
          error: templateResult.error,
          messageId: templateResult.messageId
        })

      case 'preview_template':
        // Preview email template without sending
        if (!emailType || !templateData) {
          return NextResponse.json({ 
            error: 'Email type and template data are required' 
          }, { status: 400 })
        }

        const previewResult = await previewEmailTemplate(emailType, templateData)
        return NextResponse.json({
          success: true,
          preview: previewResult
        })

      default:
        return NextResponse.json({ 
          error: 'Invalid action. Use: send_test, send_template, or preview_template' 
        }, { status: 400 })
    }

  } catch (error) {
    return safeErrorResponse(error, 'Failed to process email request')
  }
}

/**
 * Send a specific email template
 */
async function sendTemplateEmail(emailType: string, templateData: any) {
  try {
    switch (emailType) {
      case 'booking_inquiry':
        return await sendBookingInquiryEmail({
          to: templateData.to,
          artistName: templateData.artistName || 'Test Artist',
          customerName: templateData.customerName || 'Test Customer',
          eventType: templateData.eventType || 'Wedding Performance',
          eventDate: templateData.eventDate || '2024-06-15',
          location: templateData.location || 'Bangkok, Thailand',
          duration: templateData.duration || '4 hours',
          additionalInfo: templateData.additionalInfo || 'Test booking inquiry',
          contactMethod: templateData.contactMethod || 'Email',
          bookingUrl: generateDashboardUrl('ARTIST'),
          locale: templateData.locale || 'en'
        })

      case 'quote_received':
        return await sendQuoteReceivedEmail({
          to: templateData.to,
          customerName: templateData.customerName || 'Test Customer',
          artistName: templateData.artistName || 'Test Artist',
          eventType: templateData.eventType || 'Wedding Performance',
          eventDate: templateData.eventDate || '2024-06-15',
          quotedPrice: templateData.quotedPrice || '25000',
          currency: templateData.currency || 'THB',
          depositAmount: templateData.depositAmount || '10000',
          inclusions: templateData.inclusions || ['Sound system', 'DJ equipment', '4-hour performance'],
          exclusions: templateData.exclusions || ['Transportation', 'Accommodation'],
          notes: templateData.notes || 'Looking forward to performing at your wedding!',
          validUntil: templateData.validUntil || '2024-05-15',
          quoteUrl: generateDashboardUrl('CUSTOMER'),
          locale: templateData.locale || 'en'
        })

      case 'booking_confirmed':
        return await sendBookingConfirmedEmail({
          to: templateData.to,
          customerName: templateData.customerName || 'Test Customer',
          artistName: templateData.artistName || 'Test Artist',
          bookingNumber: templateData.bookingNumber || 'BK-2024-001',
          eventType: templateData.eventType || 'Wedding Performance',
          eventDate: templateData.eventDate || '2024-06-15',
          startTime: templateData.startTime || '19:00',
          endTime: templateData.endTime || '23:00',
          venue: templateData.venue || 'Grand Ballroom',
          venueAddress: templateData.venueAddress || '123 Bangkok Street, Bangkok',
          finalPrice: templateData.finalPrice || 25000,
          currency: templateData.currency || 'THB',
          depositAmount: templateData.depositAmount || 10000,
          depositPaid: templateData.depositPaid || true,
          guestCount: templateData.guestCount || 100,
          specialRequests: templateData.specialRequests || 'Play romantic music',
          dashboardUrl: generateDashboardUrl('CUSTOMER'),
          locale: templateData.locale || 'en'
        })

      case 'payment_confirmed':
        return await sendPaymentConfirmationEmail({
          to: templateData.to,
          customerName: templateData.customerName || 'Test Customer',
          artistName: templateData.artistName || 'Test Artist',
          bookingNumber: templateData.bookingNumber || 'BK-2024-001',
          eventType: templateData.eventType || 'Wedding Performance',
          eventDate: templateData.eventDate || '2024-06-15',
          paymentAmount: templateData.paymentAmount || '10000',
          currency: templateData.currency || 'THB',
          paymentType: templateData.paymentType || 'deposit',
          paymentMethod: templateData.paymentMethod || 'PromptPay',
          transactionRef: templateData.transactionRef || 'TXN-123456',
          bookingUrl: generateDashboardUrl('CUSTOMER'),
          locale: templateData.locale || 'en'
        })

      case 'event_reminder':
        return await sendEventReminderEmail({
          to: templateData.to,
          recipientName: templateData.recipientName || 'Test User',
          recipientType: templateData.recipientType || 'customer',
          artistName: templateData.artistName || 'Test Artist',
          customerName: templateData.customerName || 'Test Customer',
          eventType: templateData.eventType || 'Wedding Performance',
          eventDate: templateData.eventDate || '2024-06-15',
          eventTime: templateData.eventTime || '19:00',
          venue: templateData.venue || 'Grand Ballroom',
          venueAddress: templateData.venueAddress || '123 Bangkok Street, Bangkok',
          duration: templateData.duration || '4 hours',
          finalPrice: templateData.finalPrice || '25000',
          currency: templateData.currency || 'THB',
          specialRequests: templateData.specialRequests,
          bookingUrl: generateDashboardUrl('CUSTOMER'),
          locale: templateData.locale || 'en'
        })

      case 'cancellation_notice':
        return await sendCancellationNoticeEmail({
          to: templateData.to,
          recipientName: templateData.recipientName || 'Test User',
          senderName: templateData.senderName || 'Admin',
          senderRole: templateData.senderRole || 'admin',
          bookingNumber: templateData.bookingNumber || 'BK-2024-001',
          eventType: templateData.eventType || 'Wedding Performance',
          eventDate: templateData.eventDate || '2024-06-15',
          venue: templateData.venue || 'Grand Ballroom',
          cancellationReason: templateData.cancellationReason || 'Customer request',
          refundAmount: templateData.refundAmount || 10000,
          currency: templateData.currency || 'THB',
          refundTimeline: templateData.refundTimeline || '3-5 business days',
          dashboardUrl: generateDashboardUrl('CUSTOMER'),
          supportUrl: generateSupportUrl(),
          locale: templateData.locale || 'en'
        })

      default:
        return { success: false, error: `Unknown email type: ${emailType}` }
    }
  } catch (error) {
    console.error(`Error sending ${emailType} email:`, error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : `Failed to send ${emailType} email` 
    }
  }
}

/**
 * Preview email template without sending
 */
async function previewEmailTemplate(emailType: string, templateData: any) {
  const { render } = await import('@react-email/render')
  
  try {
    let component
    
    switch (emailType) {
      case 'booking_inquiry':
        const { default: BookingInquiryEmail } = await import('@/components/email/BookingInquiryEmail')
        component = BookingInquiryEmail({
          artistName: templateData.artistName || 'Test Artist',
          customerName: templateData.customerName || 'Test Customer',
          eventType: templateData.eventType || 'Wedding Performance',
          eventDate: templateData.eventDate || '2024-06-15',
          location: templateData.location || 'Bangkok, Thailand',
          duration: templateData.duration || '4 hours',
          additionalInfo: templateData.additionalInfo || 'Test booking inquiry',
          contactMethod: templateData.contactMethod || 'Email',
          bookingUrl: generateDashboardUrl('ARTIST'),
          locale: templateData.locale || 'en'
        })
        break

      case 'booking_confirmed':
        const { default: BookingConfirmedEmail } = await import('@/components/email/BookingConfirmedEmail')
        component = BookingConfirmedEmail({
          customerName: templateData.customerName || 'Test Customer',
          artistName: templateData.artistName || 'Test Artist',
          bookingNumber: templateData.bookingNumber || 'BK-2024-001',
          eventType: templateData.eventType || 'Wedding Performance',
          eventDate: templateData.eventDate || '2024-06-15',
          startTime: templateData.startTime || '19:00',
          endTime: templateData.endTime || '23:00',
          venue: templateData.venue || 'Grand Ballroom',
          venueAddress: templateData.venueAddress || '123 Bangkok Street, Bangkok',
          finalPrice: templateData.finalPrice || 25000,
          currency: templateData.currency || 'THB',
          depositAmount: templateData.depositAmount || 10000,
          depositPaid: templateData.depositPaid || true,
          guestCount: templateData.guestCount || 100,
          dashboardUrl: generateDashboardUrl('CUSTOMER'),
          locale: templateData.locale || 'en'
        })
        break

      default:
        throw new Error(`Preview not implemented for email type: ${emailType}`)
    }

    const html = render(component)
    const text = render(component, { plainText: true })

    return {
      emailType,
      html,
      text,
      templateData
    }
    
  } catch (error) {
    console.error(`Error previewing ${emailType} email:`, error)
    throw error
  }
}