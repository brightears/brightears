import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient, BookingStatus } from '@prisma/client'
import { withRole } from '@/lib/api-auth'
import { z } from 'zod'

const prisma = new PrismaClient()

/**
 * Query parameters validation schema
 */
const querySchema = z.object({
  status: z.nativeEnum(BookingStatus).optional(),
  artistId: z.string().uuid().optional(),
  customerId: z.string().uuid().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20)
})

/**
 * GET /api/admin/bookings-list
 *
 * List all bookings with filtering and pagination
 * Requires ADMIN role
 *
 * Query Parameters:
 * - status: INQUIRY | QUOTED | CONFIRMED | PAID | COMPLETED | CANCELLED
 * - artistId: Filter by specific artist
 * - customerId: Filter by specific customer
 * - dateFrom: Event date filter (ISO8601)
 * - dateTo: Event date filter (ISO8601)
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 20, max: 100)
 */
export async function GET(req: NextRequest) {
  return withRole(req, 'ADMIN', async () => {
    try {
      // Parse and validate query parameters
      const { searchParams } = new URL(req.url)
      const params = {
        status: searchParams.get('status') || undefined,
        artistId: searchParams.get('artistId') || undefined,
        customerId: searchParams.get('customerId') || undefined,
        dateFrom: searchParams.get('dateFrom') || undefined,
        dateTo: searchParams.get('dateTo') || undefined,
        page: searchParams.get('page') || '1',
        limit: searchParams.get('limit') || '20'
      }

      const validationResult = querySchema.safeParse(params)

      if (!validationResult.success) {
        return NextResponse.json(
          {
            error: 'Invalid query parameters',
            details: validationResult.error.issues
          },
          { status: 400 }
        )
      }

      const { status, artistId, customerId, dateFrom, dateTo, page, limit } = validationResult.data

      // Build where clause
      const where: any = {}

      if (status) where.status = status
      if (artistId) where.artistId = artistId
      if (customerId) where.customerId = customerId

      // Event date range filter
      if (dateFrom || dateTo) {
        where.eventDate = {}
        if (dateFrom) where.eventDate.gte = new Date(dateFrom)
        if (dateTo) where.eventDate.lte = new Date(dateTo)
      }

      // Calculate pagination
      const skip = (page - 1) * limit

      // Fetch bookings and total count in parallel
      const [bookings, totalCount] = await Promise.all([
        prisma.booking.findMany({
          where,
          select: {
            id: true,
            bookingNumber: true,
            artist: {
              select: {
                id: true,
                stageName: true,
                profileImage: true
              }
            },
            customer: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            eventType: true,
            eventDate: true,
            venue: true,
            quotedPrice: true,
            finalPrice: true,
            status: true,
            createdAt: true
          },
          orderBy: [
            { eventDate: 'desc' },
            { createdAt: 'desc' }
          ],
          skip,
          take: limit
        }),
        prisma.booking.count({ where })
      ])

      // Calculate pagination metadata
      const totalPages = Math.ceil(totalCount / limit)

      return NextResponse.json({
        bookings,
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages
        }
      })

    } catch (error) {
      console.error('Error fetching bookings:', error)

      return NextResponse.json(
        { error: 'Failed to fetch bookings' },
        { status: 500 }
      )
    }
  })
}
