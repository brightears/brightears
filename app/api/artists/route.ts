import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { safeErrorResponse } from '@/lib/api-auth'
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import { searchCache, CACHE_TTL } from '@/lib/search-cache'

/**
 * Browse Artists API - Simplified Filters for Early-Stage Marketplace
 *
 * Supported query parameters:
 * - search: string (searches stageName, bio, bioTh)
 * - categories: comma-separated string (DJ, BAND, SINGER, etc.)
 * - city: string (bangkok, phuket, etc.)
 * - verifiedOnly: boolean (true = only VERIFIED/TRUSTED artists)
 * - sort: string (featured, rating, price_low, price_high, most_booked, newest)
 * - page: number
 * - limit: number
 *
 * Removed parameters (no longer supported):
 * - minPrice, maxPrice (pricing is flexible, shown on artist cards)
 * - genres (category-specific, shown on artist profiles)
 * - languages (shown on artist profiles)
 * - verificationLevels array (simplified to verifiedOnly boolean)
 * - availability (dynamic, handled in search logic)
 */

// Input validation schema for artist search
const searchSchema = z.object({
  // Basic search
  search: z.string().max(200).optional(),

  // Categories (multiple)
  categories: z.array(z.string()).optional(),

  // Location
  city: z.string().max(100).optional(),

  // Simplified verification filter (replaces verificationLevels array)
  verifiedOnly: z.boolean().optional(),

  // Sorting
  sort: z.enum(['featured', 'rating', 'price_low', 'price_high', 'most_booked', 'newest']).optional(),

  // Pagination
  page: z.number().min(1).max(1000).default(1),
  limit: z.number().min(1).max(100).default(20)
})

// Helper function to determine sort order
function getOrderBy(sort?: string) {
  switch (sort) {
    case 'rating':
      return [
        { averageRating: 'desc' as const },
        { reviewCount: 'desc' as const }
      ]
    case 'price_low':
      return [
        { hourlyRate: 'asc' as const },
        { averageRating: 'desc' as const }
      ]
    case 'price_high':
      return [
        { hourlyRate: 'desc' as const },
        { averageRating: 'desc' as const }
      ]
    case 'most_booked':
      return [
        { completedBookings: 'desc' as const },
        { averageRating: 'desc' as const }
      ]
    case 'newest':
      return [{ createdAt: 'desc' as const }]
    case 'featured':
    default:
      return [
        { verificationLevel: 'desc' as const },
        { averageRating: 'desc' as const },
        { completedBookings: 'desc' as const }
      ]
  }
}

export async function GET(req: NextRequest) {
  try {
    // Rate limiting check - 60 requests per minute for search
    const rateLimitResult = await rateLimit(req, RATE_LIMITS.search)
    if (!rateLimitResult.success && rateLimitResult.response) {
      return rateLimitResult.response
    }

    const searchParams = req.nextUrl.searchParams

    // Parse array parameters
    const parseArray = (param: string | null) => {
      if (!param) return undefined
      try {
        return JSON.parse(param)
      } catch {
        return param.split(',').filter(Boolean)
      }
    }

    // Validate input parameters
    const inputValidation = searchSchema.safeParse({
      search: searchParams.get('search') || undefined,
      categories: parseArray(searchParams.get('categories')),
      city: searchParams.get('city') || undefined,
      verifiedOnly: searchParams.get('verifiedOnly') === 'true',
      sort: searchParams.get('sort') as any || 'featured',
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20')
    })

    if (!inputValidation.success) {
      return NextResponse.json(
        { error: 'Invalid search parameters', details: inputValidation.error.issues },
        { status: 400 }
      )
    }

    const {
      search,
      categories,
      city,
      verifiedOnly,
      sort,
      page,
      limit
    } = inputValidation.data

    const skip = (page - 1) * limit

    // Generate cache key for this search
    const cacheKey = searchCache.generateKey({
      search,
      categories,
      city,
      verifiedOnly,
      sort,
      page,
      limit
    })

    // Check cache first
    const cachedResult = searchCache.get(cacheKey)
    if (cachedResult) {
      return NextResponse.json({
        ...cachedResult,
        cached: true,
        cacheTimestamp: new Date().toISOString()
      })
    }

    // Build the where clause
    const where: any = {
      user: {
        isActive: true
      }
    }

    const conditions: any[] = []

    // Text search across multiple fields
    if (search) {
      conditions.push({
        OR: [
          { stageName: { contains: search, mode: 'insensitive' } },
          { bio: { contains: search, mode: 'insensitive' } },
          { bioTh: { contains: search, mode: 'insensitive' } },
          { genres: { hasSome: search.split(' ').filter(s => s.length > 0) } }
        ]
      })
    }

    // Categories filter (multiple)
    if (categories && categories.length > 0) {
      conditions.push({
        OR: [
          { category: { in: categories } },
          { subCategories: { hasSome: categories } }
        ]
      })
    }

    // Location filter
    if (city) {
      conditions.push({
        OR: [
          { baseCity: { contains: city, mode: 'insensitive' } },
          { serviceAreas: { has: city } }
        ]
      })
    }

    // Simplified verification filter - show only verified artists if requested
    // VERIFIED = Artists who have completed verification
    // TRUSTED = Top-tier verified artists with proven track record
    // Excludes: UNVERIFIED, PENDING, BASIC, REJECTED
    if (verifiedOnly) {
      conditions.push({
        verificationLevel: {
          in: ['VERIFIED', 'TRUSTED']
        }
      })
    }

    // Combine all conditions
    if (conditions.length > 0) {
      where.AND = conditions
    }

    // Execute the query with pagination
    const [artists, total] = await Promise.all([
      prisma.artist.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              isActive: true
            }
          },
          reviews: {
            select: {
              rating: true
            }
          },
          _count: {
            select: {
              bookings: {
                where: {
                  status: 'COMPLETED'
                }
              }
            }
          }
        },
        orderBy: getOrderBy(sort)
      }),
      prisma.artist.count({ where })
    ])

    // Transform the data for the response
    const artistsWithStats = artists.map(artist => {
      const ratings = artist.reviews.map(r => r.rating)
      const averageRating = ratings.length > 0
        ? parseFloat((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1))
        : 0

      const { reviews, user, hourlyRate, _count, ...artistData } = artist

      return {
        ...artistData,
        averageRating,
        reviewCount: ratings.length,
        completedBookings: _count.bookings,
        hourlyRate: hourlyRate ? parseFloat(hourlyRate.toString()) : null
      }
    })

    const response = {
      artists: artistsWithStats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      },
      filters: {
        search,
        categories,
        city,
        verifiedOnly,
        sort
      }
    }

    // Cache the result (3 minutes for search results)
    searchCache.set(cacheKey, response, CACHE_TTL.SEARCH_RESULTS)

    return NextResponse.json(response)

  } catch (error) {
    return safeErrorResponse(error, 'Failed to fetch artists')
  }
}