import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { safeErrorResponse } from '@/lib/api-auth'
import { 
  getUserEmailPreferences, 
  updateUserEmailPreferences,
  checkEmailConsent
} from '@/lib/email'

/**
 * Get user's email preferences
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const preferences = await getUserEmailPreferences(user.id)
    
    if (!preferences) {
      return NextResponse.json({ error: 'User preferences not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      preferences: {
        email: preferences.email,
        emailVerified: preferences.emailVerified,
        preferredLanguage: preferences.preferredLanguage,
        emailNotifications: preferences.emailNotifications,
        marketingEmails: preferences.marketingEmails,
        eventReminders: preferences.eventReminders,
        systemNotifications: preferences.systemNotifications,
        bookingInquiries: preferences.bookingInquiries,
        quoteRequests: preferences.quoteRequests,
        quoteUpdates: preferences.quoteUpdates,
        paymentConfirmations: preferences.paymentConfirmations,
      }
    })

  } catch (error) {
    return safeErrorResponse(error, 'Failed to get email preferences')
  }
}

/**
 * Update user's email preferences
 */
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()
    const {
      emailNotifications,
      marketingEmails,
      eventReminders,
      systemNotifications,
      bookingInquiries,
      quoteRequests,
      quoteUpdates,
      paymentConfirmations,
      preferredLanguage
    } = body

    // Validate input
    if (preferredLanguage && !['en', 'th'].includes(preferredLanguage)) {
      return NextResponse.json(
        { error: 'Invalid preferred language. Must be "en" or "th"' },
        { status: 400 }
      )
    }

    // Update preferences
    const result = await updateUserEmailPreferences(user.id, {
      emailNotifications,
      marketingEmails,
      eventReminders,
      systemNotifications,
      bookingInquiries,
      quoteRequests,
      quoteUpdates,
      paymentConfirmations,
      preferredLanguage
    })

    return NextResponse.json({
      success: true,
      message: 'Email preferences updated successfully',
      preferences: result.preferences
    })

  } catch (error) {
    return safeErrorResponse(error, 'Failed to update email preferences')
  }
}

/**
 * Check email consent for specific email type
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()
    const { emailType, action } = body

    if (action === 'check_consent') {
      if (!emailType) {
        return NextResponse.json(
          { error: 'Email type is required for consent check' },
          { status: 400 }
        )
      }

      const hasConsent = await checkEmailConsent(user.id, emailType)
      
      return NextResponse.json({
        success: true,
        hasConsent,
        emailType,
        userId: user.id
      })

    } else if (action === 'unsubscribe') {
      // Handle unsubscribe action
      if (!emailType) {
        return NextResponse.json(
          { error: 'Email type is required for unsubscribe' },
          { status: 400 }
        )
      }

      // Map email types to preference fields
      const preferenceMap: Record<string, string> = {
        'booking_inquiry': 'bookingInquiries',
        'quote_received': 'quoteUpdates',
        'quote_accepted': 'quoteUpdates',
        'payment_confirmed': 'paymentConfirmations',
        'booking_confirmed': 'emailNotifications',
        'event_reminder': 'eventReminders',
        'marketing': 'marketingEmails',
        'system': 'systemNotifications'
      }

      const preferenceField = preferenceMap[emailType]
      if (!preferenceField) {
        return NextResponse.json(
          { error: 'Invalid email type for unsubscribe' },
          { status: 400 }
        )
      }

      const updateData = { [preferenceField]: false }
      await updateUserEmailPreferences(user.id, updateData)

      return NextResponse.json({
        success: true,
        message: `Successfully unsubscribed from ${emailType} emails`,
        emailType,
        unsubscribed: true
      })

    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use "check_consent" or "unsubscribe"' },
        { status: 400 }
      )
    }

  } catch (error) {
    return safeErrorResponse(error, 'Failed to process email preference action')
  }
}