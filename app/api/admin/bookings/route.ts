import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { safeErrorResponse } from '@/lib/api-auth'

// Validation schema for booking search/filter
const bookingSearchSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['INQUIRY', 'QUOTED', 'CONFIRMED', 'PAID', 'COMPLETED', 'CANCELLED']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  sortBy: z.enum(['createdAt', 'eventDate', 'finalPrice', 'status']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20)
})

// Validation schema for booking updates
const updateBookingSchema = z.object({
  status: z.enum(['INQUIRY', 'QUOTED', 'CONFIRMED', 'PAID', 'COMPLETED', 'CANCELLED']).optional(),
  adminNotes: z.string().max(1000).optional(),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).optional()
})

// GET - Get all bookings with filtering and pagination (Admin only)
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    
    // Only admins can access booking management
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const queryParams = Object.fromEntries(searchParams.entries())
    
    // Validate query parameters
    const validationResult = bookingSearchSchema.safeParse(queryParams)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid search parameters', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const { search, status, startDate, endDate, sortBy, sortOrder, page, limit } = validationResult.data
    const offset = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { bookingNumber: { contains: search, mode: 'insensitive' } },
        { artist: { stageName: { contains: search, mode: 'insensitive' } } },
        { customer: { user: { email: { contains: search, mode: 'insensitive' } } } },
        { customer: { user: { firstName: { contains: search, mode: 'insensitive' } } } },
        { customer: { user: { lastName: { contains: search, mode: 'insensitive' } } } }
      ]
    }
    
    if (status) {
      where.status = status
    }

    if (startDate && endDate) {
      where.eventDate = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    // Get total count for pagination
    const totalBookings = await prisma.booking.count({ where })

    // Get bookings with related data
    const bookings = await prisma.booking.findMany({
      where,
      include: {
        artist: {
          select: {
            id: true,
            stageName: true,
            verificationStatus: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                profileImage: true
              }
            }
          }
        },
        customer: {
          select: {
            id: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                profileImage: true
              }
            }
          }
        },
        payments: {
          select: {
            id: true,
            amount: true,
            status: true,
            paymentType: true,
            paymentMethod: true,
            createdAt: true
          }
        },
        quotes: {
          select: {
            id: true,
            quotedPrice: true,
            status: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            messages: true
          }
        }
      },
      orderBy: { [sortBy]: sortOrder },
      take: limit,
      skip: offset
    })

    // Format booking data for admin view
    const formattedBookings = bookings.map(booking => {
      const totalPaid = booking.payments
        .filter(p => p.status === 'verified')
        .reduce((sum, payment) => sum + Number(payment.amount), 0)
      
      const latestQuote = booking.quotes.find(q => q.status === 'ACCEPTED') || booking.quotes[0]

      return {
        id: booking.id,
        bookingNumber: booking.bookingNumber,
        status: booking.status,
        eventDate: booking.eventDate,
        eventLocation: booking.eventLocation,
        eventType: booking.eventType,
        createdAt: booking.createdAt,
        finalPrice: Number(booking.finalPrice || booking.quotedPrice || 0),
        totalPaid,
        remainingAmount: Math.max(0, Number(booking.finalPrice || booking.quotedPrice || 0) - totalPaid),
        
        // Participant info
        artist: {
          id: booking.artist.id,
          stageName: booking.artist.stageName,
          name: `${booking.artist.user.firstName} ${booking.artist.user.lastName}`,
          email: booking.artist.user.email,
          profileImage: booking.artist.user.profileImage,
          verificationStatus: booking.artist.verificationStatus
        },
        customer: {
          id: booking.customer.id,
          name: `${booking.customer.user.firstName} ${booking.customer.user.lastName}`,
          email: booking.customer.user.email,
          profileImage: booking.customer.user.profileImage
        },
        
        // Engagement data
        messageCount: booking._count.messages,
        quotesCount: booking.quotes.length,
        paymentsCount: booking.payments.length,
        
        // Latest quote info
        latestQuote: latestQuote ? {
          id: latestQuote.id,
          amount: Number(latestQuote.quotedPrice),
          status: latestQuote.status,
          createdAt: latestQuote.createdAt
        } : null,
        
        // Payment status
        paymentStatus: booking.payments.length > 0 ? {
          hasDeposit: booking.payments.some(p => p.paymentType === 'deposit' && p.status === 'verified'),
          hasPendingPayments: booking.payments.some(p => p.status === 'pending'),
          lastPayment: booking.payments[booking.payments.length - 1]
        } : null
      }
    })

    return NextResponse.json({
      bookings: formattedBookings,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalBookings / limit),
        totalBookings,
        hasNextPage: offset + limit < totalBookings,
        hasPreviousPage: page > 1
      }
    })

  } catch (error) {
    return safeErrorResponse(error, 'Failed to fetch bookings')
  }
}

// PATCH - Update booking status/notes (Admin only)
export async function PATCH(request: NextRequest) {
  try {
    const user = await requireAuth()
    
    // Only admins can update bookings
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { bookingId, ...updateData } = body
    
    // Validate input data
    const validationResult = updateBookingSchema.safeParse(updateData)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid update data', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      )
    }

    // Check if booking exists
    const existingBooking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        artist: true,
        customer: true
      }
    })

    if (!existingBooking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    const validatedData = validationResult.data

    // Update booking
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        ...validatedData,
        adminNotes: validatedData.adminNotes ? 
          `${existingBooking.adminNotes || ''}\n[${new Date().toISOString()}] Admin: ${validatedData.adminNotes}`.trim() :
          existingBooking.adminNotes
      },
      include: {
        artist: true,
        customer: true
      }
    })

    // Create notifications for status changes
    if (validatedData.status && validatedData.status !== existingBooking.status) {
      // Notify customer
      await prisma.notification.create({
        data: {
          userId: existingBooking.customer.userId,
          type: 'booking_status_changed',
          title: 'Booking Status Updated',
          titleTh: 'สถานะการจองได้รับการอัพเดท',
          content: `Your booking ${existingBooking.bookingNumber} status has been updated to ${validatedData.status} by an administrator.`,
          contentTh: `สถานะการจอง ${existingBooking.bookingNumber} ของคุณได้รับการอัพเดทเป็น ${validatedData.status} โดยผู้ดูแลระบบ`,
          relatedId: bookingId,
          relatedType: 'booking'
        }
      })

      // Notify artist
      await prisma.notification.create({
        data: {
          userId: existingBooking.artist.userId,
          type: 'booking_status_changed',
          title: 'Booking Status Updated',
          titleTh: 'สถานะการจองได้รับการอัพเดท',
          content: `Booking ${existingBooking.bookingNumber} status has been updated to ${validatedData.status} by an administrator.`,
          contentTh: `สถานะการจอง ${existingBooking.bookingNumber} ได้รับการอัพเดทเป็น ${validatedData.status} โดยผู้ดูแลระบบ`,
          relatedId: bookingId,
          relatedType: 'booking'
        }
      })
    }

    return NextResponse.json({
      booking: updatedBooking,
      message: 'Booking updated successfully'
    })

  } catch (error) {
    return safeErrorResponse(error, 'Failed to update booking')
  }
}