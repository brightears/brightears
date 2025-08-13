import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      artistId,
      userId,
      eventDate,
      eventType,
      location,
      inquiryMethod = 'FORM'
    } = body

    // Validate required fields
    if (!artistId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: artistId and userId' },
        { status: 400 }
      )
    }

    // Verify artist exists
    const artist = await prisma.artist.findUnique({
      where: { id: artistId },
      select: { id: true, stageName: true }
    })

    if (!artist) {
      return NextResponse.json(
        { error: 'Artist not found' },
        { status: 404 }
      )
    }

    // Create booking inquiry record
    const inquiry = await prisma.bookingInquiry.create({
      data: {
        artistId,
        userId,
        eventDate: eventDate ? new Date(eventDate) : null,
        eventType,
        location,
        inquiryMethod,
        ipAddress: request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   '127.0.0.1',
        userAgent: request.headers.get('user-agent') || null
      }
    })

    // Create notification for the artist
    const artistUser = await prisma.user.findFirst({
      where: {
        artist: {
          id: artistId
        }
      },
      select: { id: true }
    })

    if (artistUser) {
      await prisma.notification.create({
        data: {
          userId: artistUser.id,
          type: 'booking_inquiry',
          title: 'New Booking Inquiry',
          titleTh: 'มีการสอบถามจองใหม่',
          content: `You have received a new booking inquiry${eventType ? ` for ${eventType}` : ''}.`,
          contentTh: `คุณได้รับการสอบถามการจองใหม่${eventType ? ` สำหรับงาน${eventType}` : ''}`,
          relatedId: inquiry.id,
          relatedType: 'booking_inquiry'
        }
      })
    }

    // Return success response with inquiry details
    return NextResponse.json({
      success: true,
      inquiry: {
        id: inquiry.id,
        createdAt: inquiry.createdAt,
        artistName: artist.stageName,
        eventType,
        eventDate,
        location
      }
    })

  } catch (error) {
    console.error('Error creating booking inquiry:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve booking inquiries for artists
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const artistId = searchParams.get('artistId')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    // If artistId is provided, check if current user is the artist
    if (artistId) {
      const artist = await prisma.artist.findFirst({
        where: {
          id: artistId,
          userId: session.user.id
        }
      })

      if (!artist) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    // Build where clause
    const whereClause: any = {}
    if (artistId) {
      whereClause.artistId = artistId
    } else {
      // If no artistId, find inquiries for current user's artist profile
      const userArtist = await prisma.artist.findUnique({
        where: { userId: session.user.id },
        select: { id: true }
      })
      
      if (!userArtist) {
        return NextResponse.json({ inquiries: [], total: 0 })
      }
      
      whereClause.artistId = userArtist.id
    }

    // Get inquiries with user details
    const [inquiries, total] = await Promise.all([
      prisma.bookingInquiry.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          artist: {
            select: {
              id: true,
              stageName: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: limit,
        skip: offset
      }),
      prisma.bookingInquiry.count({
        where: whereClause
      })
    ])

    return NextResponse.json({
      inquiries,
      total,
      hasMore: offset + limit < total
    })

  } catch (error) {
    console.error('Error fetching booking inquiries:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}