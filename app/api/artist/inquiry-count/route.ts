import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Get the authenticated user from Clerk
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Find the user and their artist profile
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: userId },  // Clerk ID stored as user ID
          { email: userId } // Fallback
        ]
      },
      include: { artist: true }
    })

    if (!user || !user.artist) {
      return NextResponse.json(
        { error: 'Artist profile not found' },
        { status: 404 }
      )
    }

    // Count new inquiries (INQUIRY status bookings)
    const inquiryCount = await prisma.booking.count({
      where: {
        artistId: user.artist.id,
        status: 'INQUIRY'
      }
    })

    // Also count unread messages for a more comprehensive notification
    const unreadMessagesCount = await prisma.message.count({
      where: {
        booking: {
          artistId: user.artist.id
        },
        senderId: {
          not: user.id
        },
        isRead: false
      }
    })

    return NextResponse.json({
      count: inquiryCount,
      unreadMessages: unreadMessagesCount,
      total: inquiryCount + (unreadMessagesCount > 0 ? 1 : 0)
    })

  } catch (error) {
    console.error('Error fetching inquiry count:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inquiry count' },
      { status: 500 }
    )
  }
}