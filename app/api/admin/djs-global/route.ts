import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

const querySchema = z.object({
  search: z.string().nullish(),
  category: z.string().nullish(),
  sortBy: z.enum(['rating', 'shows', 'name']).nullish().default('rating'),
});

/**
 * GET /api/admin/djs-global
 * Fetch all DJs with global ratings aggregated across ALL venues
 */
export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const params = querySchema.parse({
      search: searchParams.get('search'),
      category: searchParams.get('category'),
      sortBy: searchParams.get('sortBy'),
    });

    // Build where clause for artists
    const whereClause: any = {
      category: 'DJ',
    };

    if (params.search) {
      whereClause.OR = [
        { stageName: { contains: params.search, mode: 'insensitive' } },
        { realName: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    // Fetch all DJs
    const artists = await prisma.artist.findMany({
      where: whereClause,
      orderBy: { stageName: 'asc' },
      select: {
        id: true,
        stageName: true,
        realName: true,
        profileImage: true,
        category: true,
        genres: true,
        bio: true,
        instagram: true,
        mixcloud: true,
        hourlyRate: true,
        baseCity: true,
      },
    });

    // Get date ranges for trends
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Fetch all venues for breakdown
    const venues = await prisma.venue.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
    });

    // Aggregate stats for each DJ
    const djsWithStats = await Promise.all(
      artists.map(async (artist) => {
        // Get all feedback for this DJ across all venues
        const allFeedback = await prisma.venueFeedback.findMany({
          where: { artistId: artist.id },
          select: {
            overallRating: true,
            venueId: true,
            createdAt: true,
          },
        });

        // Get assignment counts
        const assignmentStats = await prisma.venueAssignment.groupBy({
          by: ['status'],
          where: { artistId: artist.id },
          _count: { id: true },
        });

        const totalAssignments = assignmentStats.reduce(
          (sum, s) => sum + s._count.id,
          0
        );
        const completedAssignments =
          assignmentStats.find((s) => s.status === 'COMPLETED')?._count.id || 0;

        // Calculate global average rating
        const globalAvgRating =
          allFeedback.length > 0
            ? Math.round(
                (allFeedback.reduce((sum, f) => sum + f.overallRating, 0) /
                  allFeedback.length) *
                  10
              ) / 10
            : null;

        // Calculate per-venue breakdown
        const venueBreakdown = venues.map((venue) => {
          const venueFeedback = allFeedback.filter((f) => f.venueId === venue.id);
          const avgRating =
            venueFeedback.length > 0
              ? Math.round(
                  (venueFeedback.reduce((sum, f) => sum + f.overallRating, 0) /
                    venueFeedback.length) *
                    10
                ) / 10
              : null;

          return {
            venueId: venue.id,
            venueName: venue.name,
            feedbackCount: venueFeedback.length,
            avgRating,
          };
        }).filter((v) => v.feedbackCount > 0);

        // Calculate trend (this month vs last month)
        const thisMonthFeedback = allFeedback.filter(
          (f) => new Date(f.createdAt) >= thisMonthStart
        );
        const lastMonthFeedback = allFeedback.filter(
          (f) =>
            new Date(f.createdAt) >= lastMonthStart &&
            new Date(f.createdAt) <= lastMonthEnd
        );

        const thisMonthAvg =
          thisMonthFeedback.length > 0
            ? thisMonthFeedback.reduce((sum, f) => sum + f.overallRating, 0) /
              thisMonthFeedback.length
            : null;
        const lastMonthAvg =
          lastMonthFeedback.length > 0
            ? lastMonthFeedback.reduce((sum, f) => sum + f.overallRating, 0) /
              lastMonthFeedback.length
            : null;

        let trend: { direction: 'up' | 'down' | 'stable'; change: number } | null =
          null;
        if (thisMonthAvg !== null && lastMonthAvg !== null) {
          const change = Math.round((thisMonthAvg - lastMonthAvg) * 10) / 10;
          trend = {
            direction: change > 0.2 ? 'up' : change < -0.2 ? 'down' : 'stable',
            change,
          };
        }

        // Get upcoming shows count
        const upcomingShows = await prisma.venueAssignment.count({
          where: {
            artistId: artist.id,
            status: 'SCHEDULED',
            date: { gte: now },
          },
        });

        return {
          ...artist,
          globalStats: {
            avgRating: globalAvgRating,
            totalFeedback: allFeedback.length,
            totalAssignments,
            completedAssignments,
            upcomingShows,
            trend,
          },
          venueBreakdown,
        };
      })
    );

    // Sort based on sortBy parameter
    const sortedDJs = [...djsWithStats].sort((a, b) => {
      switch (params.sortBy) {
        case 'rating':
          // Sort by rating (nulls last), then by feedback count
          if (a.globalStats.avgRating === null && b.globalStats.avgRating === null)
            return 0;
          if (a.globalStats.avgRating === null) return 1;
          if (b.globalStats.avgRating === null) return -1;
          if (b.globalStats.avgRating !== a.globalStats.avgRating) {
            return b.globalStats.avgRating - a.globalStats.avgRating;
          }
          return b.globalStats.totalFeedback - a.globalStats.totalFeedback;

        case 'shows':
          return b.globalStats.totalAssignments - a.globalStats.totalAssignments;

        case 'name':
          return a.stageName.localeCompare(b.stageName);

        default:
          return 0;
      }
    });

    // Calculate summary stats
    const summary = {
      totalDJs: sortedDJs.length,
      djsWithRatings: sortedDJs.filter((d) => d.globalStats.avgRating !== null)
        .length,
      avgGlobalRating:
        sortedDJs.filter((d) => d.globalStats.avgRating !== null).length > 0
          ? Math.round(
              (sortedDJs
                .filter((d) => d.globalStats.avgRating !== null)
                .reduce((sum, d) => sum + (d.globalStats.avgRating || 0), 0) /
                sortedDJs.filter((d) => d.globalStats.avgRating !== null).length) *
                10
            ) / 10
          : null,
      totalFeedback: sortedDJs.reduce(
        (sum, d) => sum + d.globalStats.totalFeedback,
        0
      ),
      trendingUp: sortedDJs.filter(
        (d) => d.globalStats.trend?.direction === 'up'
      ).length,
      trendingDown: sortedDJs.filter(
        (d) => d.globalStats.trend?.direction === 'down'
      ).length,
    };

    return NextResponse.json({
      djs: sortedDJs,
      venues,
      summary,
    });
  } catch (error) {
    console.error('Error fetching global DJ stats:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to fetch DJ stats' },
      { status: 500 }
    );
  }
}
