import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient, ArtistCategory } from '@prisma/client'
import { withRole } from '@/lib/api-auth'
import { z } from 'zod'

const prisma = new PrismaClient()

/**
 * Query parameters validation schema
 */
const querySchema = z.object({
  category: z.nativeEnum(ArtistCategory).optional(),
  city: z.string().max(50).optional(),
  search: z.string().max(100).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20)
})

/**
 * GET /api/admin/artists-list
 *
 * List all artists with performance metrics
 * Requires ADMIN role
 *
 * Query Parameters:
 * - category: DJ | BAND | SINGER | etc.
 * - city: Filter by base city
 * - search: Search by stage name or real name
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 20, max: 100)
 */
export async function GET(req: NextRequest) {
  return withRole(req, 'ADMIN', async () => {
    try {
      // Parse and validate query parameters
      const { searchParams } = new URL(req.url)
      const params = {
        category: searchParams.get('category') || undefined,
        city: searchParams.get('city') || undefined,
        search: searchParams.get('search') || undefined,
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

      const { category, city, search, page, limit } = validationResult.data

      // Build where clause
      const where: any = {}

      if (category) where.category = category
      if (city) where.baseCity = city

      // Search functionality
      if (search) {
        where.OR = [
          { stageName: { contains: search, mode: 'insensitive' } },
          { realName: { contains: search, mode: 'insensitive' } }
        ]
      }

      // Calculate pagination
      const skip = (page - 1) * limit

      // Fetch artists and total count in parallel
      const [artists, totalCount] = await Promise.all([
        prisma.artist.findMany({
          where,
          select: {
            id: true,
            stageName: true,
            realName: true,
            category: true,
            baseCity: true,
            hourlyRate: true,
            totalBookings: true,
            completedBookings: true,
            averageRating: true,
            profileImage: true,
            createdAt: true,
            updatedAt: true,
            user: {
              select: {
                email: true,
                phone: true,
                isActive: true
              }
            }
          },
          orderBy: [
            { totalBookings: 'desc' },
            { createdAt: 'desc' }
          ],
          skip,
          take: limit
        }),
        prisma.artist.count({ where })
      ])

      // Calculate pagination metadata
      const totalPages = Math.ceil(totalCount / limit)

      return NextResponse.json({
        artists,
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages
        }
      })

    } catch (error) {
      console.error('Error fetching artists:', error)

      return NextResponse.json(
        { error: 'Failed to fetch artists' },
        { status: 500 }
      )
    }
  })
}
