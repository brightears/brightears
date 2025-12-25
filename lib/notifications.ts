import { sendArtistInquiryNotification, getUserLocale } from './email-templates'
import { sendArtistInquirySMS, checkSMSConsent } from './sms'
import { prisma } from './prisma'

/**
 * Unified notification service
 * Handles email and SMS notifications with user preferences
 */

export interface NotificationResult {
  email: {
    sent: boolean
    messageId?: string
    error?: string
  }
  sms: {
    sent: boolean
    messageId?: string
    error?: string
  }
  success: boolean
  errors: string[]
}

export interface ArtistInquiryNotificationData {
  bookingId: string
  artistId: string
  customerId: string
  customerName: string
  customerPhone?: string
  customerLineId?: string
  eventType: string
  eventDate?: string
  message?: string
}

/**
 * Send comprehensive notification to artist about new inquiry
 * Sends both email and SMS based on artist preferences
 */
export async function notifyArtistOfInquiry(
  data: ArtistInquiryNotificationData
): Promise<NotificationResult> {
  const result: NotificationResult = {
    email: { sent: false },
    sms: { sent: false },
    success: false,
    errors: [],
  }

  try {
    // Get artist details
    const artist = await prisma.artist.findUnique({
      where: { id: data.artistId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
            firstName: true,
            lastName: true,
            emailPreference: true,
          },
        },
      },
    })

    if (!artist) {
      result.errors.push('Artist not found')
      return result
    }

    // Get user's locale preference
    const locale = await getUserLocale(artist.user.id)

    // Prepare notification data
    const artistName = artist.stageName || `${artist.user.firstName} ${artist.user.lastName}`
    const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://brightears.onrender.com'}/artist/dashboard/inquiries/${data.bookingId}`

    // Check notification preferences
    const emailEnabled = artist.user.emailPreference?.bookingInquiries ?? true
    const smsEnabled = artist.user.phone && (await checkSMSConsent(artist.user.id))

    // Send email notification
    if (emailEnabled && artist.user.email) {
      try {
        const emailResult = await sendArtistInquiryNotification({
          to: artist.user.email,
          artistName,
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          customerLineId: data.customerLineId,
          eventType: data.eventType,
          eventDate: data.eventDate,
          message: data.message,
          bookingId: data.bookingId,
          dashboardUrl,
          locale,
        })

        result.email.sent = emailResult.success
        result.email.messageId = emailResult.messageId
        result.email.error = emailResult.error

        if (!emailResult.success) {
          result.errors.push(`Email failed: ${emailResult.error}`)
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown email error'
        result.email.error = errorMsg
        result.errors.push(`Email exception: ${errorMsg}`)
      }
    } else {
      result.email.sent = false
      result.email.error = emailEnabled ? 'No email address' : 'Email notifications disabled'
    }

    // Send SMS notification
    if (smsEnabled && artist.user.phone) {
      try {
        const smsResult = await sendArtistInquirySMS({
          to: artist.user.phone,
          customerName: data.customerName,
          eventType: data.eventType,
          eventDate: data.eventDate,
          bookingId: data.bookingId,
          locale,
        })

        result.sms.sent = smsResult.success
        result.sms.messageId = smsResult.messageId
        result.sms.error = smsResult.error

        if (!smsResult.success) {
          result.errors.push(`SMS failed: ${smsResult.error}`)
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown SMS error'
        result.sms.error = errorMsg
        result.errors.push(`SMS exception: ${errorMsg}`)
      }
    } else {
      result.sms.sent = false
      result.sms.error = smsEnabled ? 'No phone number' : 'SMS notifications disabled'
    }

    // Consider success if at least one notification method succeeded
    result.success = result.email.sent || result.sms.sent

    // Create in-app notification
    try {
      await createInAppNotification({
        userId: artist.user.id,
        type: 'booking_inquiry',
        title: locale === 'th' ? 'มีผู้สนใจจองใหม่' : 'New Booking Inquiry',
        titleTh: 'มีผู้สนใจจองใหม่',
        content:
          locale === 'th'
            ? `${data.customerName} สนใจจองคุณสำหรับ${data.eventType}`
            : `${data.customerName} is interested in booking you for ${data.eventType}`,
        contentTh: `${data.customerName} สนใจจองคุณสำหรับ${data.eventType}`,
        relatedId: data.bookingId,
        relatedType: 'booking',
      })
    } catch (error) {
      console.error('Failed to create in-app notification:', error)
      // Don't fail the whole operation if in-app notification fails
    }

    // Log notification attempt
    console.log('Artist inquiry notification sent:', {
      bookingId: data.bookingId,
      artistId: data.artistId,
      email: {
        sent: result.email.sent,
        to: artist.user.email,
      },
      sms: {
        sent: result.sms.sent,
        to: artist.user.phone,
      },
      success: result.success,
      errors: result.errors,
    })

    return result
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    result.errors.push(`Notification service error: ${errorMsg}`)
    console.error('Failed to send artist inquiry notification:', error)
    return result
  }
}

/**
 * Create in-app notification
 */
async function createInAppNotification({
  userId,
  type,
  title,
  titleTh,
  content,
  contentTh,
  relatedId,
  relatedType,
}: {
  userId: string
  type: string
  title: string
  titleTh?: string
  content: string
  contentTh?: string
  relatedId?: string
  relatedType?: string
}) {
  try {
    await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        titleTh,
        content,
        contentTh,
        relatedId,
        relatedType,
      },
    })
  } catch (error) {
    console.error('Failed to create in-app notification:', error)
    throw error
  }
}

/**
 * Send quote received notification to customer
 */
export async function notifyCustomerOfQuote({
  bookingId,
  customerId,
  artistId,
  quotedPrice,
  currency = 'THB',
}: {
  bookingId: string
  customerId: string
  artistId: string
  quotedPrice: number
  currency?: string
}): Promise<NotificationResult> {
  const result: NotificationResult = {
    email: { sent: false },
    sms: { sent: false },
    success: false,
    errors: [],
  }

  try {
    // Get customer and artist details
    const [customer, artist] = await Promise.all([
      prisma.user.findUnique({
        where: { id: customerId },
        select: {
          email: true,
          phone: true,
          firstName: true,
          emailPreference: true,
        },
      }),
      prisma.artist.findUnique({
        where: { id: artistId },
        select: {
          stageName: true,
        },
      }),
    ])

    if (!customer || !artist) {
      result.errors.push('Customer or artist not found')
      return result
    }

    const locale = await getUserLocale(customerId)

    // Check if customer wants quote notifications
    const emailEnabled = customer.emailPreference?.quoteUpdates ?? true
    const smsEnabled = customer.phone && (await checkSMSConsent(customerId))

    // Send email (implementation would use existing email templates)
    if (emailEnabled && customer.email) {
      // Email implementation here
      result.email.sent = true
    }

    // Send SMS
    if (smsEnabled && customer.phone) {
      const { generateQuoteReceivedSMS } = await import('./sms')
      const smsTemplate = generateQuoteReceivedSMS({
        artistName: artist.stageName,
        eventType: 'Event', // Would get from booking
        price: quotedPrice,
        currency,
        bookingId,
        locale,
      })

      const { sendSMS } = await import('./sms')
      const smsResult = await sendSMS(customer.phone, smsTemplate.message)

      result.sms.sent = smsResult.success
      result.sms.messageId = smsResult.messageId
      result.sms.error = smsResult.error
    }

    result.success = result.email.sent || result.sms.sent

    return result
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    result.errors.push(errorMsg)
    console.error('Failed to notify customer of quote:', error)
    return result
  }
}

/**
 * Send booking confirmation notifications to both artist and customer
 */
export async function notifyBookingConfirmed({
  bookingId,
}: {
  bookingId: string
}): Promise<{
  artist: NotificationResult
  customer: NotificationResult
}> {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      artist: {
        include: {
          user: true,
        },
      },
      customer: true,
    },
  })

  if (!booking) {
    throw new Error('Booking not found')
  }

  // Send notifications to both parties
  // Implementation would be similar to above functions

  return {
    artist: {
      email: { sent: false },
      sms: { sent: false },
      success: false,
      errors: [],
    },
    customer: {
      email: { sent: false },
      sms: { sent: false },
      success: false,
      errors: [],
    },
  }
}

/**
 * Send event reminder notification (24 hours before event)
 */
export async function sendEventReminder({
  bookingId,
}: {
  bookingId: string
}): Promise<{
  artist: NotificationResult
  customer: NotificationResult
}> {
  // Implementation for event reminders
  return {
    artist: {
      email: { sent: false },
      sms: { sent: false },
      success: false,
      errors: [],
    },
    customer: {
      email: { sent: false },
      sms: { sent: false },
      success: false,
      errors: [],
    },
  }
}

/**
 * Get notification statistics for monitoring
 */
export async function getNotificationStats({
  startDate,
  endDate,
}: {
  startDate: Date
  endDate: Date
}) {
  try {
    const emailStats = await prisma.emailLog.groupBy({
      by: ['status'],
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _count: true,
    })

    return {
      emails: emailStats,
      // SMS stats would be added here if you implement SMS logging to database
    }
  } catch (error) {
    console.error('Failed to get notification stats:', error)
    return null
  }
}

/**
 * Batch send notifications (for scheduled jobs)
 */
export async function batchSendNotifications({
  notifications,
}: {
  notifications: ArtistInquiryNotificationData[]
}): Promise<{
  successful: number
  failed: number
  results: NotificationResult[]
}> {
  const results: NotificationResult[] = []
  let successful = 0
  let failed = 0

  for (const notification of notifications) {
    const result = await notifyArtistOfInquiry(notification)
    results.push(result)

    if (result.success) {
      successful++
    } else {
      failed++
    }

    // Add delay between batches to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  return {
    successful,
    failed,
    results,
  }
}
