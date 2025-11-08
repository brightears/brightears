import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient, ApplicationStatus, ArtistCategory } from '@prisma/client'
import { withRole } from '@/lib/api-auth'
import { z } from 'zod'

const prisma = new PrismaClient()

/**
 * Query parameters validation schema
 */
const querySchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'ALL']).optional().default('ALL'),
  category: z.nativeEnum(ArtistCategory).optional(),
  search: z.string().max(100).optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20)
})

/**
 * GET /api/admin/applications
 *
 * List all applications with filtering and pagination
 * Requires ADMIN role
 *
 * Query Parameters:
 * - status: PENDING | APPROVED | REJECTED | ALL (default: ALL)
 * - category: DJ | BAND | SINGER | etc.
 * - search: Search by name, email, phone
 * - dateFrom: ISO8601 date
 * - dateTo: ISO8601 date
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 20, max: 100)
 */
export async function GET(req: NextRequest) {
  return withRole(req, 'ADMIN', async () => {
    try {
      // Parse and validate query parameters
      const { searchParams } = new URL(req.url)
      const params = {
        status: searchParams.get('status') || 'ALL',
        category: searchParams.get('category') || undefined,
        search: searchParams.get('search') || undefined,
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

      const { status, category, search, dateFrom, dateTo, page, limit } = validationResult.data

      // Build where clause
      const where: any = {}

      // Filter by status
      if (status !== 'ALL') {
        where.status = status as ApplicationStatus
      }

      // Filter by category
      if (category) {
        where.category = category
      }

      // Search functionality
      if (search) {
        where.OR = [
          { applicantName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search } },
          { stageName: { contains: search, mode: 'insensitive' } }
        ]
      }

      // Date range filter
      if (dateFrom || dateTo) {
        where.submittedAt = {}
        if (dateFrom) {
          where.submittedAt.gte = new Date(dateFrom)
        }
        if (dateTo) {
          where.submittedAt.lte = new Date(dateTo)
        }
      }

      // Calculate pagination
      const skip = (page - 1) * limit

      // Fetch applications and total count in parallel
      const [applications, totalCount] = await Promise.all([
        prisma.application.findMany({
          where,
          select: {
            id: true,
            applicantName: true,
            email: true,
            phone: true,
            lineId: true,
            stageName: true,
            category: true,
            status: true,
            submittedAt: true,
            reviewedAt: true,
            profilePhotoUrl: true,
            baseLocation: true
          },
          orderBy: [
            { status: 'asc' }, // PENDING first
            { submittedAt: 'desc' } // Newest first
          ],
          skip,
          take: limit
        }),
        prisma.application.count({ where })
      ])

      // Calculate pagination metadata
      const totalPages = Math.ceil(totalCount / limit)

      return NextResponse.json({
        applications,
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages
        }
      })

    } catch (error) {
      console.error('Error fetching applications:', error)

      return NextResponse.json(
        { error: 'Failed to fetch applications' },
        { status: 500 }
      )
    }
  })
}
