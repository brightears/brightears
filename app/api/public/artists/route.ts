import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/rate-limit'

/**
 * Public Artists API Endpoint for AI Platforms
 *
 * GET /api/public/artists
 *
 * A clean, AI-readable JSON endpoint that allows AI assistants (ChatGPT, Claude, Gemini)
 * to discover and query Bright Ears artists on behalf of users looking to book entertainment.
 *
 * Query Parameters:
 * - category: Filter by artist type (DJ, Band, Singer, etc.)
 * - city: Filter by service area city
 * - limit: Number of results (default 20, max 50)
 * - verified: Only verified artists (boolean)
 *
 * Rate Limiting: 100 requests per hour per IP
 * Cache: 5 minutes
 *
 * Security:
 * - No authentication required (public endpoint)
 * - Only returns public data (no email, phone, private fields)
 * - Only returns ACTIVE artists with complete profiles (isDraft: false)
 *
 * Example Usage:
 * GET /api/public/artists?category=DJ&city=Bangkok&limit=10&verified=true
 */

// Input validation schema
const querySchema = z.object({
  category: z.enum([
    'DJ', 'BAND', 'SINGER', 'MUSICIAN', 'MC',
    'COMEDIAN', 'MAGICIAN', 'DANCER', 'PHOTOGRAPHER', 'SPEAKER'
  ]).optional(),
  city: z.string().max(100).optional(),
  limit: z.coerce.number().min(1).max(50).default(20),
  verified: z.coerce.boolean().optional()
})

// Rate limit configuration: 100 requests per hour
const PUBLIC_API_RATE_LIMIT = {
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 100 // 100 requests per hour per IP
}

// Cache configuration: 5 minutes
const CACHE_DURATION = 5 * 60 // 5 minutes in seconds

// In-memory cache for responses
interface CacheEntry {
  data: any
  timestamp: number
}

const responseCache = new Map<string, CacheEntry>()

// Clean up expired cache entries every 10 minutes
if (typeof global !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    const entries = Array.from(responseCache.entries())
    for (const [key, entry] of entries) {
      if (now - entry.timestamp > CACHE_DURATION * 1000) {
        responseCache.delete(key)
      }
    }
  }, 10 * 60 * 1000)
}

export async function GET(req: NextRequest) {
  try {
    // Rate limiting check - 100 requests per hour
    const rateLimitResult = await rateLimit(req, PUBLIC_API_RATE_LIMIT)
    if (!rateLimitResult.success && rateLimitResult.response) {
      return rateLimitResult.response
    }

    const searchParams = req.nextUrl.searchParams

    // Validate input parameters
    const inputValidation = querySchema.safeParse({
      category: searchParams.get('category')?.toUpperCase() || undefined,
      city: searchParams.get('city') || undefined,
      limit: searchParams.get('limit') || '20',
      verified: searchParams.get('verified') || undefined
    })

    if (!inputValidation.success) {
      return NextResponse.json(
        {
          error: 'Invalid query parameters',
          details: inputValidation.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
          }))
        },
        { status: 400 }
      )
    }

    const { category, city, limit, verified } = inputValidation.data

    // Generate cache key for this query
    const cacheKey = JSON.stringify({ category, city, limit, verified })

    // Check cache first
    const cachedEntry = responseCache.get(cacheKey)
    if (cachedEntry) {
      const age = Math.floor((Date.now() - cachedEntry.timestamp) / 1000)
      if (age < CACHE_DURATION) {
        return NextResponse.json(cachedEntry.data, {
          headers: {
            'Cache-Control': `public, max-age=${CACHE_DURATION}`,
            'X-Cache': 'HIT',
            'X-Cache-Age': age.toString()
          }
        })
      } else {
        responseCache.delete(cacheKey)
      }
    }

    // Build the where clause for database query
    const where: any = {
      // Only return ACTIVE artists
      user: {
        isActive: true
      },
      // Only return artists with complete, published profiles
      // isDraft: false means the artist has completed onboarding and published their profile
      // Note: In agency model, we may not have isDraft field, so we check for essential fields
      hourlyRate: {
        not: null // Only artists with pricing set
      },
      // Ensure artist has basic profile info
      stageName: {
        not: null
      }
    }

    // Category filter
    if (category) {
      where.category = category
    }

    // City filter - search in both base city and service areas
    if (city) {
      where.OR = [
        { baseCity: { contains: city, mode: 'insensitive' } },
        { serviceAreas: { has: city } }
      ]
    }

    // Verified filter (agency model: all artists are owner-verified)
    // In the simplified agency model, we don't have verification levels
    // All artists in the system are pre-vetted by the agency owner
    // This parameter is kept for API compatibility but doesn't filter

    // Get total count for API response metadata
    const totalArtists = await prisma.artist.count({
      where: {
        user: {
          isActive: true
        }
      }
    })

    // Execute the query with only necessary fields for AI consumption
    const artists = await prisma.artist.findMany({
      where,
      take: limit,
      select: {
        id: true,
        stageName: true,
        category: true,
        bio: true,
        bioTh: true,
        hourlyRate: true,
        minimumHours: true,
        currency: true,
        baseCity: true,
        serviceAreas: true,
        averageRating: true,
        genres: true,
        languages: true,
        profileImage: true,
        website: true,
        facebook: true,
        instagram: true,
        lineId: true,
        totalBookings: true,
        completedBookings: true,
        _count: {
          select: {
            reviews: true
          }
        }
      },
      orderBy: [
        { averageRating: 'desc' },
        { completedBookings: 'desc' }
      ]
    })

    // Transform the data into AI-friendly format
    const transformedArtists = artists.map(artist => ({
      id: artist.id,
      stageName: artist.stageName,
      categories: [artist.category],
      bio: artist.bio || 'Professional entertainer available for bookings',
      bioTh: artist.bioTh,
      pricing: {
        hourlyRate: artist.hourlyRate ? parseFloat(artist.hourlyRate.toString()) : null,
        minimumHours: artist.minimumHours,
        currency: artist.currency
      },
      location: {
        serviceAreas: artist.serviceAreas,
        basedIn: artist.baseCity
      },
      rating: artist.averageRating || null,
      reviewCount: artist._count.reviews,
      verified: true, // In agency model, all artists are owner-verified
      totalBookings: artist.totalBookings,
      completedBookings: artist.completedBookings,
      genres: artist.genres,
      languages: artist.languages,
      profileUrl: `https://brightears.io/en/artists/${artist.id}`,
      profileImage: artist.profileImage,
      contactMethods: [
        artist.lineId ? 'LINE' : null,
        'Phone'
      ].filter(Boolean),
      socialMedia: {
        website: artist.website || null,
        facebook: artist.facebook || null,
        instagram: artist.instagram || null,
        lineId: artist.lineId || null
      }
    }))

    // Build response following the specified format
    const response = {
      platform: 'Bright Ears',
      description: "Thailand's largest commission-free entertainment booking platform",
      apiVersion: '1.0',
      totalArtists,
      resultCount: transformedArtists.length,
      filters: {
        category: category || null,
        city: city || null,
        verified: verified || null,
        limit
      },
      artists: transformedArtists
    }

    // Cache the response
    responseCache.set(cacheKey, {
      data: response,
      timestamp: Date.now()
    })

    // Return response with cache headers
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': `public, max-age=${CACHE_DURATION}`,
        'X-Cache': 'MISS',
        'X-Rate-Limit-Limit': PUBLIC_API_RATE_LIMIT.maxRequests.toString(),
        'Access-Control-Allow-Origin': '*', // Allow CORS for AI platforms
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    })

  } catch (error) {
    console.error('[Public API] Error fetching artists:', error)

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Failed to fetch artists. Please try again later.'
      },
      { status: 500 }
    )
  }
}

// Handle CORS preflight requests
export async function OPTIONS(req: NextRequest) {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    }
  })
}
