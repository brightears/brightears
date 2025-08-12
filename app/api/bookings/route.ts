import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    let whereClause: any = {}

    // Filter by user role
    if (user.role === 'ARTIST') {
      const artist = await prisma.artist.findUnique({
        where: { userId: user.id }
      })
      
      if (!artist) {
        return NextResponse.json({ error: 'Artist profile not found' }, { status: 404 })
      }
      
      whereClause.artistId = artist.id
    } else {
      whereClause.customerId = user.id
    }

    // Filter by status if provided
    if (status && status !== 'all') {
      whereClause.status = status
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        customer: {
          select: {
            email: true,
            customer: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        },
        artist: {
          select: {
            stageName: true,
            profileImage: true,
            category: true
          }
        },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            content: true,
            createdAt: true,
            isRead: true,
            sender: {
              select: {
                email: true,
                role: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    })

    const total = await prisma.booking.count({
      where: whereClause
    })

    // Format the response
    const formattedBookings = bookings.map(booking => ({
      ...booking,
      customerName: booking.customer.customer ? 
        `${booking.customer.customer.firstName || ''} ${booking.customer.customer.lastName || ''}`.trim() ||
        booking.customer.email :
        booking.customer.email,
      customerEmail: booking.customer.email,
      artistName: booking.artist.stageName,
      artistImage: booking.artist.profileImage,
      artistCategory: booking.artist.category,
      lastMessage: booking.messages[0] || null,
      unreadMessages: booking.messages.filter(m => !m.isRead && m.sender.role !== user.role).length
    }))

    return NextResponse.json({
      bookings: formattedBookings,
      total,
      limit,
      offset
    })

  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      artistId,
      eventType,
      eventDate,
      startTime,
      endTime,
      duration,
      venue,
      venueAddress,
      guestCount,
      specialRequests,
      budgetRange,
      contactPhone,
      notes
    } = body

    // Validate required fields
    if (!artistId || !eventType || !eventDate || !startTime || !endTime || !venue || !venueAddress) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 })
    }

    // Validate dates
    const eventDateTime = new Date(eventDate)
    const startDateTime = new Date(startTime)
    const endDateTime = new Date(endTime)

    if (eventDateTime < new Date()) {
      return NextResponse.json({ 
        error: 'Event date cannot be in the past' 
      }, { status: 400 })
    }

    if (endDateTime <= startDateTime) {
      return NextResponse.json({ 
        error: 'End time must be after start time' 
      }, { status: 400 })
    }

    // Check if artist exists
    const artist = await prisma.artist.findUnique({
      where: { id: artistId },
      include: {
        user: true
      }
    })

    if (!artist) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 })
    }

    // Check artist availability (basic check - can be enhanced)
    const conflictingBookings = await prisma.booking.findMany({
      where: {
        artistId: artistId,
        eventDate: eventDateTime,
        status: {
          in: ['CONFIRMED', 'PAID', 'COMPLETED']
        },
        OR: [
          {
            AND: [
              { startTime: { lte: startDateTime } },
              { endTime: { gt: startDateTime } }
            ]
          },
          {
            AND: [
              { startTime: { lt: endDateTime } },
              { endTime: { gte: endDateTime } }
            ]
          },
          {
            AND: [
              { startTime: { gte: startDateTime } },
              { endTime: { lte: endDateTime } }
            ]
          }
        ]
      }
    })

    if (conflictingBookings.length > 0) {
      return NextResponse.json({ 
        error: 'Artist is not available at this time slot' 
      }, { status: 409 })
    }

    // Calculate estimated price (if hourly rate is available)
    let estimatedPrice = null
    if (artist.hourlyRate && duration) {
      estimatedPrice = Number(artist.hourlyRate) * duration
      // Apply minimum hours
      if (duration < artist.minimumHours) {
        estimatedPrice = Number(artist.hourlyRate) * artist.minimumHours
      }
    }

    // Create booking inquiry
    const booking = await prisma.booking.create({
      data: {
        customerId: user.id,
        artistId: artistId,
        eventType,
        eventDate: eventDateTime,
        startTime: startDateTime,
        endTime: endDateTime,
        duration: duration || Math.ceil((endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60)),
        venue,
        venueAddress,
        guestCount: guestCount ? parseInt(guestCount) : null,
        quotedPrice: estimatedPrice || 0,
        currency: artist.currency,
        specialRequests,
        notes: [notes, budgetRange ? `Budget range: ${budgetRange}` : null, contactPhone ? `Contact phone: ${contactPhone}` : null]
          .filter(Boolean)
          .join('\n'),
        status: 'INQUIRY'
      },
      include: {
        customer: {
          select: {
            email: true,
            customer: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        },
        artist: {
          select: {
            stageName: true,
            profileImage: true
          }
        }
      }
    })

    // Create notification for artist
    await prisma.notification.create({
      data: {
        userId: artist.userId,
        type: 'booking_request',
        title: 'New Booking Request',
        titleTh: 'คำขอจองใหม่',
        content: `You have received a new booking request for ${eventType} on ${eventDateTime.toLocaleDateString()}`,
        contentTh: `คุณได้รับคำขอจองใหม่สำหรับ ${eventType} ในวันที่ ${eventDateTime.toLocaleDateString()}`,
        relatedId: booking.id,
        relatedType: 'booking'
      }
    })

    return NextResponse.json({
      success: true,
      booking: {
        ...booking,
        customerName: booking.customer.customer ? 
          `${booking.customer.customer.firstName || ''} ${booking.customer.customer.lastName || ''}`.trim() ||
          booking.customer.email :
          booking.customer.email,
        customerEmail: booking.customer.email,
        artistName: booking.artist.stageName,
        artistImage: booking.artist.profileImage
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}