/**
 * Optimized artist query helpers for better performance
 * These functions reduce N+1 query problems and improve database efficiency
 */

import { prisma } from '@/lib/prisma'

/**
 * Get artist stats with aggregated review data
 * Reduces query count from O(n) to O(1) for review aggregation
 *
 * @param artistIds - Array of artist IDs to get stats for
 * @returns Map of artistId to { averageRating, reviewCount }
 */
export async function getArtistReviewStats(artistIds: string[]) {
  // Batch query all review stats in a single database call
  const reviewStats = await prisma.review.groupBy({
    by: ['artistId'],
    where: {
      artistId: { in: artistIds },
      isPublic: true // Only count public reviews
    },
    _avg: {
      rating: true
    },
    _count: {
      id: true
    }
  })

  // Convert to Map for O(1) lookup
  const statsMap = new Map()
  for (const stat of reviewStats) {
    statsMap.set(stat.artistId, {
      averageRating: stat._avg.rating ? parseFloat(stat._avg.rating.toFixed(1)) : 0,
      reviewCount: stat._count.id
    })
  }

  return statsMap
}

/**
 * Get completed bookings count for multiple artists
 *
 * @param artistIds - Array of artist IDs
 * @returns Map of artistId to completedBookingsCount
 */
export async function getArtistBookingCounts(artistIds: string[]) {
  const bookingCounts = await prisma.booking.groupBy({
    by: ['artistId'],
    where: {
      artistId: { in: artistIds },
      status: 'COMPLETED'
    },
    _count: {
      id: true
    }
  })

  const countsMap = new Map()
  for (const count of bookingCounts) {
    countsMap.set(count.artistId, count._count.id)
  }

  return countsMap
}

/**
 * Enriched artist listing query with optimized aggregations
 * This replaces the inefficient pattern of loading all reviews per artist
 *
 * @param where - Prisma where clause for filtering
 * @param orderBy - Prisma orderBy clause for sorting
 * @param skip - Number of records to skip (pagination)
 * @param take - Number of records to return (pagination)
 * @returns Artists with computed stats
 */
export async function getArtistsWithStats(
  where: any,
  orderBy: any,
  skip: number = 0,
  take: number = 20
) {
  // Single query to get all base artist data
  const artists = await prisma.artist.findMany({
    where,
    skip,
    take,
    include: {
      user: {
        select: {
          id: true,
          email: true,
          isActive: true
        }
      }
    },
    orderBy
  })

  // Get artist IDs for batch queries
  const artistIds = artists.map(a => a.id)

  // Parallel batch queries for stats (way more efficient than N+1)
  const [reviewStatsMap, bookingCountsMap] = await Promise.all([
    getArtistReviewStats(artistIds),
    getArtistBookingCounts(artistIds)
  ])

  // Enrich artists with computed stats
  const enrichedArtists = artists.map(artist => {
    const reviewStats = reviewStatsMap.get(artist.id) || { averageRating: 0, reviewCount: 0 }
    const completedBookings = bookingCountsMap.get(artist.id) || 0

    return {
      ...artist,
      averageRating: reviewStats.averageRating,
      reviewCount: reviewStats.reviewCount,
      completedBookings,
      // Convert Decimal to number for JSON serialization
      hourlyRate: artist.hourlyRate ? parseFloat(artist.hourlyRate.toString()) : null
    }
  })

  return enrichedArtists
}

/**
 * Get total count of artists matching filter (for pagination)
 */
export async function getArtistCount(where: any) {
  return await prisma.artist.count({ where })
}
