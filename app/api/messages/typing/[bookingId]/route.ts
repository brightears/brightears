import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { SSEManager } from '@/lib/sse-manager'
import { z } from 'zod'

const typingSchema = z.object({
  isTyping: z.boolean()
})

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ bookingId: string }> }
) {
  try {
    const { bookingId } = await context.params
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify user has access to this booking
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        OR: [
          { customerId: user.id },
          { artist: { userId: user.id } }
        ]
      },
      include: {
        customer: {
          include: {
            customer: true
          }
        },
        artist: true
      }
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found or access denied' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { isTyping } = typingSchema.parse(body)

    // Update or create typing indicator
    await prisma.typingIndicator.upsert({
      where: {
        userId_bookingId: {
          userId: user.id,
          bookingId
        }
      },
      update: {
        isTyping,
        lastTypingAt: new Date()
      },
      create: {
        userId: user.id,
        bookingId,
        isTyping,
        lastTypingAt: new Date()
      }
    })

    // Get user name for display based on role
    let userName = user.email || 'User'
    if (user.role === 'CUSTOMER') {
      if (user.customer) {
        userName = `${user.customer.firstName || ''} ${user.customer.lastName || ''}`.trim() || user.email || 'Customer'
      }
    } else if (user.role === 'ARTIST') {
      userName = user.artist?.stageName || user.email || 'Artist'
    } else if (user.role === 'CORPORATE' && user.corporate) {
      userName = user.corporate.companyName || user.email || 'Corporate'
    }

    // Broadcast typing indicator to other connected clients
    await SSEManager.broadcastTyping(bookingId, user.id, isTyping, userName)

    return NextResponse.json({
      success: true,
      isTyping,
      userId: user.id,
      userName
    })

  } catch (error) {
    console.error('Error updating typing indicator:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint to fetch current typing indicators
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ bookingId: string }> }
) {
  try {
    const { bookingId } = await context.params
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify user has access to this booking
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        OR: [
          { customerId: user.id },
          { artist: { userId: user.id } }
        ]
      }
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found or access denied' },
        { status: 404 }
      )
    }

    // Clean up stale typing indicators (older than 5 seconds)
    const fiveSecondsAgo = new Date(Date.now() - 5000)
    await prisma.typingIndicator.updateMany({
      where: {
        bookingId,
        lastTypingAt: {
          lt: fiveSecondsAgo
        }
      },
      data: {
        isTyping: false
      }
    })

    // Get current typing indicators
    const typingIndicators = await prisma.typingIndicator.findMany({
      where: {
        bookingId,
        isTyping: true,
        userId: {
          not: user.id // Exclude current user
        }
      },
      include: {
        user: {
          include: {
            customer: true,
            artist: true
          }
        }
      }
    })

    // Format response with user names
    const formattedIndicators = typingIndicators.map(indicator => {
      let userName = indicator.user.email || 'User'
      
      // Try to use the name field from database User model
      if ('name' in indicator.user && indicator.user.name) {
        userName = indicator.user.name
      }
      
      // Override with role-specific names if available
      if (indicator.user.role === 'CUSTOMER' && indicator.user.customer) {
        const fullName = `${indicator.user.customer.firstName || ''} ${indicator.user.customer.lastName || ''}`.trim()
        if (fullName) userName = fullName
      } else if (indicator.user.role === 'ARTIST' && indicator.user.artist) {
        userName = indicator.user.artist.stageName || userName
      }

      return {
        userId: indicator.userId,
        userName,
        isTyping: indicator.isTyping,
        lastTypingAt: indicator.lastTypingAt
      }
    })

    return NextResponse.json({
      typingIndicators: formattedIndicators
    })

  } catch (error) {
    console.error('Error fetching typing indicators:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}