import { prisma } from './prisma'
import { sendEventReminderEmail, sendBulkEmails, getUserLocale } from './email-templates'

/**
 * Event reminder system for sending notifications before upcoming events
 */

export interface ReminderConfig {
  hoursBeforeEvent: number
  reminderType: 'email' | 'notification' | 'both'
  enabled: boolean
}

// Default reminder configurations
export const DEFAULT_REMINDER_CONFIGS: ReminderConfig[] = [
  {
    hoursBeforeEvent: 48, // 2 days before
    reminderType: 'both',
    enabled: true
  },
  {
    hoursBeforeEvent: 24, // 1 day before
    reminderType: 'both',
    enabled: true
  },
  {
    hoursBeforeEvent: 4, // 4 hours before
    reminderType: 'both',
    enabled: true
  }
]

/**
 * Send event reminders for upcoming bookings
 * This function should be called by a cron job or scheduled task
 */
export async function sendEventReminders(configs: ReminderConfig[] = DEFAULT_REMINDER_CONFIGS): Promise<{
  processed: number
  sent: number
  failed: number
  errors: string[]
}> {
  const results = {
    processed: 0,
    sent: 0,
    failed: 0,
    errors: [] as string[]
  }

  try {
    console.log('Starting event reminder process...')

    for (const config of configs) {
      if (!config.enabled) continue

      const reminderResults = await processReminders(config)
      results.processed += reminderResults.processed
      results.sent += reminderResults.sent
      results.failed += reminderResults.failed
      results.errors.push(...reminderResults.errors)
    }

    console.log('Event reminder process completed:', results)
    return results

  } catch (error) {
    console.error('Error in event reminder process:', error)
    results.errors.push(error instanceof Error ? error.message : 'Unknown error')
    return results
  }
}

/**
 * Process reminders for a specific time configuration
 */
async function processReminders(config: ReminderConfig): Promise<{
  processed: number
  sent: number
  failed: number
  errors: string[]
}> {
  const results = {
    processed: 0,
    sent: 0,
    failed: 0,
    errors: [] as string[]
  }

  try {
    // Calculate target time range for reminders
    const now = new Date()
    const reminderTime = new Date(now.getTime() + config.hoursBeforeEvent * 60 * 60 * 1000)
    
    // Look for bookings within a 1-hour window around the reminder time
    const windowStart = new Date(reminderTime.getTime() - 30 * 60 * 1000) // 30 minutes before
    const windowEnd = new Date(reminderTime.getTime() + 30 * 60 * 1000)   // 30 minutes after

    console.log(`Processing ${config.hoursBeforeEvent}h reminders for events between ${windowStart.toISOString()} and ${windowEnd.toISOString()}`)

    // Find eligible bookings
    const bookings = await prisma.booking.findMany({
      where: {
        status: { in: ['CONFIRMED', 'PAID'] },
        eventDate: {
          gte: windowStart,
          lte: windowEnd
        }
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            customer: {
              select: {
                preferredLanguage: true
              }
            }
          }
        },
        artist: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                customer: {
                  select: {
                    preferredLanguage: true
                  }
                }
              }
            }
          }
        }
      }
    })

    console.log(`Found ${bookings.length} bookings for ${config.hoursBeforeEvent}h reminders`)

    for (const booking of bookings) {
      results.processed++

      try {
        // Check if reminder was already sent for this booking and timeframe
        const existingReminder = await checkExistingReminder(booking.id, config.hoursBeforeEvent)
        if (existingReminder) {
          console.log(`Reminder already sent for booking ${booking.bookingNumber} at ${config.hoursBeforeEvent}h`)
          continue
        }

        // Send notifications if enabled
        if (config.reminderType === 'notification' || config.reminderType === 'both') {
          await sendReminderNotifications(booking, config.hoursBeforeEvent)
        }

        // Send emails if enabled
        if (config.reminderType === 'email' || config.reminderType === 'both') {
          await sendReminderEmails(booking, config.hoursBeforeEvent)
        }

        // Record that reminder was sent
        await recordReminderSent(booking.id, config.hoursBeforeEvent)
        
        results.sent++
        console.log(`Reminder sent for booking ${booking.bookingNumber}`)

      } catch (error) {
        results.failed++
        const errorMsg = `Failed to send reminder for booking ${booking.bookingNumber}: ${error instanceof Error ? error.message : 'Unknown error'}`
        results.errors.push(errorMsg)
        console.error(errorMsg)
      }
    }

    return results

  } catch (error) {
    console.error(`Error processing ${config.hoursBeforeEvent}h reminders:`, error)
    results.errors.push(error instanceof Error ? error.message : 'Unknown error')
    return results
  }
}

/**
 * Send reminder notifications (in-app)
 */
async function sendReminderNotifications(booking: any, hoursBeforeEvent: number): Promise<void> {
  const timeText = hoursBeforeEvent === 24 ? 'tomorrow' : 
                   hoursBeforeEvent === 48 ? 'in 2 days' :
                   `in ${hoursBeforeEvent} hours`

  const timeTextTh = hoursBeforeEvent === 24 ? 'พรุ่งนี้' :
                     hoursBeforeEvent === 48 ? 'ในอีก 2 วัน' :
                     `ในอีก ${hoursBeforeEvent} ชั่วโมง`

  // Create notifications for both customer and artist
  await Promise.all([
    // Customer notification
    prisma.notification.create({
      data: {
        userId: booking.customerId,
        type: 'event_reminder',
        title: `Event Reminder: ${timeText}`,
        titleTh: `แจ้งเตือนงาน: ${timeTextTh}`,
        content: `Your ${booking.eventType} event with ${booking.artist.stageName} is ${timeText}. Don't forget to prepare!`,
        contentTh: `งาน ${booking.eventType} ของคุณกับ ${booking.artist.stageName} จะเริ่ม${timeTextTh} อย่าลืมเตรียมตัว!`,
        relatedId: booking.id,
        relatedType: 'booking'
      }
    }),
    // Artist notification
    prisma.notification.create({
      data: {
        userId: booking.artist.userId,
        type: 'event_reminder',
        title: `Event Reminder: ${timeText}`,
        titleTh: `แจ้งเตือนงาน: ${timeTextTh}`,
        content: `Your performance for ${booking.customer.name || 'the customer'} is ${timeText}. Time to prepare!`,
        contentTh: `การแสดงของคุณสำหรับ ${booking.customer.name || 'ลูกค้า'} จะเริ่ม${timeTextTh} ถึงเวลาเตรียมตัว!`,
        relatedId: booking.id,
        relatedType: 'booking'
      }
    })
  ])
}

/**
 * Send reminder emails
 */
async function sendReminderEmails(booking: any, hoursBeforeEvent: number): Promise<void> {
  const formattedEventDate = new Date(booking.eventDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const formattedEventTime = new Date(booking.startTime).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })

  // Send emails to both customer and artist
  await sendBulkEmails([
    // Customer email
    async () => {
      const customerLocale = await getUserLocale(booking.customerId)
      const bookingUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/customer/bookings`

      return sendEventReminderEmail({
        to: booking.customer.email,
        recipientName: booking.customer.name || 'Customer',
        recipientType: 'customer',
        artistName: booking.artist.stageName,
        customerName: booking.customer.name || 'Customer',
        eventType: booking.eventType,
        eventDate: formattedEventDate,
        eventTime: formattedEventTime,
        venue: booking.venue,
        venueAddress: booking.venueAddress,
        duration: `${booking.duration} hours`,
        finalPrice: (booking.finalPrice || booking.quotedPrice)?.toFixed(2),
        currency: 'THB',
        specialRequests: booking.specialRequests,
        bookingUrl,
        locale: customerLocale,
      })
    },
    // Artist email
    async () => {
      const artistLocale = await getUserLocale(booking.artist.userId)
      const bookingUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/artist/bookings`

      return sendEventReminderEmail({
        to: booking.artist.user.email,
        recipientName: booking.artist.stageName,
        recipientType: 'artist',
        artistName: booking.artist.stageName,
        customerName: booking.customer.name || 'Customer',
        eventType: booking.eventType,
        eventDate: formattedEventDate,
        eventTime: formattedEventTime,
        venue: booking.venue,
        venueAddress: booking.venueAddress,
        duration: `${booking.duration} hours`,
        finalPrice: (booking.finalPrice || booking.quotedPrice)?.toFixed(2),
        currency: 'THB',
        specialRequests: booking.specialRequests,
        bookingUrl,
        locale: artistLocale,
      })
    }
  ])
}

/**
 * Check if reminder was already sent for this booking and timeframe
 */
async function checkExistingReminder(bookingId: string, hoursBeforeEvent: number): Promise<boolean> {
  // For now, check if notification exists - in production you might want a separate reminders table
  const existingNotification = await prisma.notification.findFirst({
    where: {
      relatedId: bookingId,
      relatedType: 'booking',
      type: 'event_reminder',
      createdAt: {
        gte: new Date(Date.now() - 2 * 60 * 60 * 1000) // Within last 2 hours
      }
    }
  })

  return !!existingNotification
}

/**
 * Record that a reminder was sent (for deduplication)
 */
async function recordReminderSent(bookingId: string, hoursBeforeEvent: number): Promise<void> {
  // In a production system, you might want to create a separate reminders table
  // For now, we rely on the notifications as a record
  console.log(`Reminder recorded for booking ${bookingId} at ${hoursBeforeEvent}h before event`)
}

/**
 * Manual reminder sending for testing or specific bookings
 */
export async function sendManualReminder(bookingId: string, hoursBeforeEvent: number = 24): Promise<boolean> {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            customer: {
              select: {
                preferredLanguage: true
              }
            }
          }
        },
        artist: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                customer: {
                  select: {
                    preferredLanguage: true
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!booking) {
      throw new Error('Booking not found')
    }

    if (!['CONFIRMED', 'PAID'].includes(booking.status)) {
      throw new Error('Booking must be confirmed or paid to send reminders')
    }

    await sendReminderNotifications(booking, hoursBeforeEvent)
    await sendReminderEmails(booking, hoursBeforeEvent)

    console.log(`Manual reminder sent for booking ${booking.bookingNumber}`)
    return true

  } catch (error) {
    console.error('Error sending manual reminder:', error)
    return false
  }
}

/**
 * Get upcoming events that need reminders (for monitoring/debugging)
 */
export async function getUpcomingEvents(hoursAhead: number = 72): Promise<any[]> {
  const now = new Date()
  const futureTime = new Date(now.getTime() + hoursAhead * 60 * 60 * 1000)

  const bookings = await prisma.booking.findMany({
    where: {
      status: { in: ['CONFIRMED', 'PAID'] },
      eventDate: {
        gte: now,
        lte: futureTime
      }
    },
    include: {
      customer: {
        select: {
          name: true,
          email: true
        }
      },
      artist: {
        select: {
          stageName: true,
          user: {
            select: {
              email: true
            }
          }
        }
      }
    },
    orderBy: {
      eventDate: 'asc'
    }
  })

  return bookings
}