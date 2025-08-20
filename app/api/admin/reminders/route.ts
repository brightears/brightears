import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { safeErrorResponse } from '@/lib/api-auth'
import { sendEventReminders, sendManualReminder, getUpcomingEvents, DEFAULT_REMINDER_CONFIGS } from '@/lib/event-reminder'

/**
 * Admin endpoint for managing event reminders
 */

// GET - Get upcoming events and reminder status
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    
    // Only admins can access reminder management
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const hoursAhead = parseInt(searchParams.get('hoursAhead') || '72')

    const upcomingEvents = await getUpcomingEvents(hoursAhead)

    return NextResponse.json({
      upcomingEvents: upcomingEvents.map(booking => ({
        id: booking.id,
        bookingNumber: booking.bookingNumber,
        eventType: booking.eventType,
        eventDate: booking.eventDate,
        startTime: booking.startTime,
        venue: booking.venue,
        status: booking.status,
        customer: {
          name: booking.customer.name,
          email: booking.customer.email
        },
        artist: {
          stageName: booking.artist.stageName,
          email: booking.artist.user.email
        },
        finalPrice: Number(booking.finalPrice || booking.quotedPrice || 0)
      })),
      reminderConfigs: DEFAULT_REMINDER_CONFIGS,
      hoursAhead
    })

  } catch (error) {
    return safeErrorResponse(error, 'Failed to fetch upcoming events')
  }
}

// POST - Trigger reminder sending
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    
    // Only admins can trigger reminders
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { action, bookingId, hoursBeforeEvent } = body

    if (action === 'send_all_reminders') {
      // Send all scheduled reminders
      console.log('Admin triggered: sending all event reminders')
      const results = await sendEventReminders()
      
      return NextResponse.json({
        success: true,
        action: 'send_all_reminders',
        results: {
          processed: results.processed,
          sent: results.sent,
          failed: results.failed,
          errors: results.errors
        },
        message: `Processed ${results.processed} bookings, sent ${results.sent} reminders, ${results.failed} failed`
      })

    } else if (action === 'send_manual_reminder') {
      // Send manual reminder for specific booking
      if (!bookingId) {
        return NextResponse.json(
          { error: 'bookingId is required for manual reminders' },
          { status: 400 }
        )
      }

      const hours = hoursBeforeEvent || 24
      console.log(`Admin triggered: sending manual reminder for booking ${bookingId}`)
      
      const success = await sendManualReminder(bookingId, hours)
      
      if (success) {
        return NextResponse.json({
          success: true,
          action: 'send_manual_reminder',
          bookingId,
          hoursBeforeEvent: hours,
          message: `Manual reminder sent for booking ${bookingId}`
        })
      } else {
        return NextResponse.json(
          { error: 'Failed to send manual reminder' },
          { status: 500 }
        )
      }

    } else if (action === 'test_reminders') {
      // Test reminder system with upcoming events
      console.log('Admin triggered: testing reminder system')
      
      const upcomingEvents = await getUpcomingEvents(48) // Next 48 hours
      const testResults = []

      for (const booking of upcomingEvents.slice(0, 5)) { // Test with first 5 events
        try {
          const success = await sendManualReminder(booking.id, 24)
          testResults.push({
            bookingId: booking.id,
            bookingNumber: booking.bookingNumber,
            success
          })
        } catch (error) {
          testResults.push({
            bookingId: booking.id,
            bookingNumber: booking.bookingNumber,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      }

      return NextResponse.json({
        success: true,
        action: 'test_reminders',
        testResults,
        message: `Tested reminders for ${testResults.length} bookings`
      })

    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use: send_all_reminders, send_manual_reminder, or test_reminders' },
        { status: 400 }
      )
    }

  } catch (error) {
    return safeErrorResponse(error, 'Failed to process reminder request')
  }
}

// PUT - Cron endpoint for scheduled reminder processing
export async function PUT(request: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET || 'default-secret-change-in-production'
    
    if (authHeader !== `Bearer ${cronSecret}`) {
      console.warn('Unauthorized cron request attempted')
      return NextResponse.json({ error: 'Unauthorized cron request' }, { status: 401 })
    }

    console.log('Cron job: Starting scheduled reminder process...')
    
    // Run the reminder process
    const results = await sendEventReminders()
    
    console.log('Cron job: Reminder process completed', results)
    
    return NextResponse.json({
      success: true,
      message: 'Scheduled reminders processed successfully',
      timestamp: new Date().toISOString(),
      results: {
        processed: results.processed,
        sent: results.sent,
        failed: results.failed,
        errorCount: results.errors.length
      }
    })

  } catch (error) {
    console.error('Cron job: Error in scheduled reminder process:', error)
    return safeErrorResponse(error, 'Failed to process scheduled reminders')
  }
}