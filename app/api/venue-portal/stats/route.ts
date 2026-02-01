import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { withRole } from '@/lib/api-auth';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

const prisma = new PrismaClient();

/**
 * Query parameters validation schema
 */
const querySchema = z.object({
  venueId: z.string().optional(), // Not UUID - venue IDs are human-readable strings
  period: z.enum(['week', 'month', 'quarter', 'year', 'all']).optional().default('month'),
});

/**
 * GET /api/venue-portal/stats
 *
 * Get aggregate statistics for corporate venues
 * Requires CORPORATE role
 *
 * Query Parameters:
 * - venueId: Filter by specific venue (optional)
 * - period: Time period for stats (week, month, quarter, year, all)
 */
export async function GET(req: NextRequest) {
  return withRole(req, 'CORPORATE', async () => {
    try {
      const user = await getCurrentUser();

      if (!user?.corporate?.id) {
        return NextResponse.json(
          { error: 'Corporate profile not found' },
          { status: 404 }
        );
      }

      // Parse query parameters
      const { searchParams } = new URL(req.url);
      const params = {
        venueId: searchParams.get('venueId') || undefined,
        period: searchParams.get('period') || 'month',
      };

      const validationResult = querySchema.safeParse(params);

      if (!validationResult.success) {
        return NextResponse.json(
          {
            error: 'Invalid query parameters',
            details: validationResult.error.issues,
          },
          { status: 400 }
        );
      }

      const { venueId, period } = validationResult.data;

      // Get all venue IDs for this corporate user
      const userVenues = await prisma.venue.findMany({
        where: {
          corporateId: user.corporate.id,
          isActive: true,
        },
        select: { id: true, name: true },
      });

      const venueIds = userVenues.map((v) => v.id);

      // Verify venue belongs to user if specific venueId provided
      if (venueId && !venueIds.includes(venueId)) {
        return NextResponse.json(
          { error: 'Venue not found or access denied' },
          { status: 403 }
        );
      }

      // Calculate date range based on period
      const now = new Date();
      let startDate: Date | undefined;

      switch (period) {
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'quarter':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case 'year':
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        case 'all':
        default:
          startDate = undefined;
      }

      const dateFilter = startDate ? { gte: startDate } : undefined;
      const targetVenueIds = venueId ? [venueId] : venueIds;

      // Get assignment stats
      const [
        totalAssignments,
        completedAssignments,
        upcomingAssignments,
        cancelledAssignments,
      ] = await Promise.all([
        prisma.venueAssignment.count({
          where: {
            venueId: { in: targetVenueIds },
            date: dateFilter,
          },
        }),
        prisma.venueAssignment.count({
          where: {
            venueId: { in: targetVenueIds },
            status: 'COMPLETED',
            date: dateFilter,
          },
        }),
        prisma.venueAssignment.count({
          where: {
            venueId: { in: targetVenueIds },
            status: 'SCHEDULED',
            date: { gte: now },
          },
        }),
        prisma.venueAssignment.count({
          where: {
            venueId: { in: targetVenueIds },
            status: 'CANCELLED',
            date: dateFilter,
          },
        }),
      ]);

      // Get feedback stats
      const feedback = await prisma.venueFeedback.findMany({
        where: {
          venueId: { in: targetVenueIds },
          createdAt: dateFilter,
        },
        select: {
          overallRating: true,
          musicQuality: true,
          crowdEngagement: true,
          professionalism: true,
          wouldRebook: true,
        },
      });

      const totalFeedback = feedback.length;
      const avgOverallRating =
        totalFeedback > 0
          ? feedback.reduce((sum, f) => sum + f.overallRating, 0) / totalFeedback
          : null;
      const avgMusicQuality =
        totalFeedback > 0
          ? feedback.filter((f) => f.musicQuality).reduce((sum, f) => sum + (f.musicQuality || 0), 0) /
            feedback.filter((f) => f.musicQuality).length
          : null;
      const avgCrowdEngagement =
        totalFeedback > 0
          ? feedback.filter((f) => f.crowdEngagement).reduce((sum, f) => sum + (f.crowdEngagement || 0), 0) /
            feedback.filter((f) => f.crowdEngagement).length
          : null;
      const avgProfessionalism =
        totalFeedback > 0
          ? feedback.filter((f) => f.professionalism).reduce((sum, f) => sum + (f.professionalism || 0), 0) /
            feedback.filter((f) => f.professionalism).length
          : null;
      const rebookRate =
        totalFeedback > 0
          ? (feedback.filter((f) => f.wouldRebook === true).length / totalFeedback) * 100
          : null;

      // Pending feedback count
      const pendingFeedback = await prisma.venueAssignment.count({
        where: {
          venueId: { in: targetVenueIds },
          status: 'COMPLETED',
          feedback: null,
        },
      });

      // Get unique DJs count
      const uniqueDJs = await prisma.venueAssignment.findMany({
        where: {
          venueId: { in: targetVenueIds },
          date: dateFilter,
        },
        select: { artistId: true },
        distinct: ['artistId'],
      });

      // Get top-rated DJs
      const topDJsRaw = await prisma.venueFeedback.groupBy({
        by: ['artistId'],
        where: {
          venueId: { in: targetVenueIds },
          createdAt: dateFilter,
        },
        _avg: {
          overallRating: true,
        },
        _count: {
          id: true,
        },
        having: {
          id: {
            _count: {
              gte: 1,
            },
          },
        },
        orderBy: {
          _avg: {
            overallRating: 'desc',
          },
        },
        take: 5,
      });

      // Get artist details for top DJs
      const topDJs = await Promise.all(
        topDJsRaw.map(async (dj) => {
          const artist = await prisma.artist.findUnique({
            where: { id: dj.artistId },
            select: {
              id: true,
              stageName: true,
              profileImage: true,
              category: true,
            },
          });

          return {
            ...artist,
            avgRating: dj._avg.overallRating ? Math.round(dj._avg.overallRating * 10) / 10 : null,
            feedbackCount: dj._count.id,
          };
        })
      );

      // Rating distribution
      const ratingDistribution = {
        1: feedback.filter((f) => f.overallRating === 1).length,
        2: feedback.filter((f) => f.overallRating === 2).length,
        3: feedback.filter((f) => f.overallRating === 3).length,
        4: feedback.filter((f) => f.overallRating === 4).length,
        5: feedback.filter((f) => f.overallRating === 5).length,
      };

      // Get night report data for crowd insights
      const nightReports = await prisma.venueNightFeedback.findMany({
        where: {
          venueId: { in: targetVenueIds },
          createdAt: dateFilter,
        },
        select: {
          crowdNationality: true,
          crowdType: true,
          overallNightRating: true,
          peakBusyTime: true,
          peakCrowdLevel: true,
          weatherCondition: true,
          date: true,
        },
      });

      // Aggregate crowd nationality distribution
      const nationalityCount: Record<string, number> = {};
      nightReports.forEach((r) => {
        if (r.crowdNationality) {
          nationalityCount[r.crowdNationality] = (nationalityCount[r.crowdNationality] || 0) + 1;
        }
      });

      // Aggregate crowd type distribution
      const crowdTypeCount: Record<string, number> = {};
      nightReports.forEach((r) => {
        if (r.crowdType) {
          crowdTypeCount[r.crowdType] = (crowdTypeCount[r.crowdType] || 0) + 1;
        }
      });

      // Aggregate peak busy time distribution
      const peakBusyTimeCount: Record<string, number> = {};
      nightReports.forEach((r) => {
        if (r.peakBusyTime) {
          peakBusyTimeCount[r.peakBusyTime] = (peakBusyTimeCount[r.peakBusyTime] || 0) + 1;
        }
      });

      // Aggregate crowd level distribution
      const crowdLevelCount: Record<string, number> = {};
      nightReports.forEach((r) => {
        if (r.peakCrowdLevel) {
          crowdLevelCount[r.peakCrowdLevel] = (crowdLevelCount[r.peakCrowdLevel] || 0) + 1;
        }
      });

      // Aggregate weather distribution
      const weatherCount: Record<string, number> = {};
      nightReports.forEach((r) => {
        if (r.weatherCondition) {
          weatherCount[r.weatherCondition] = (weatherCount[r.weatherCondition] || 0) + 1;
        }
      });

      // Get recent notes with venue names
      const notesWithVenue = await prisma.venueNightFeedback.findMany({
        where: {
          venueId: { in: targetVenueIds },
          createdAt: dateFilter,
          notes: { not: null },
        },
        select: {
          notes: true,
          date: true,
          venue: { select: { name: true } },
        },
        orderBy: { date: 'desc' },
        take: 10,
      });

      const recentNotes = notesWithVenue
        .filter((r) => r.notes && r.notes.trim())
        .map((r) => ({
          note: r.notes!,
          date: r.date.toISOString().split('T')[0],
          venueName: r.venue.name,
        }));

      // Average business rating
      const nightRatings = nightReports.filter((r) => r.overallNightRating && r.overallNightRating > 0);
      const avgBusinessRating = nightRatings.length > 0
        ? nightRatings.reduce((sum, r) => sum + (r.overallNightRating || 0), 0) / nightRatings.length
        : null;

      return NextResponse.json({
        overview: {
          totalAssignments,
          completedAssignments,
          upcomingAssignments,
          cancelledAssignments,
          uniqueDJs: uniqueDJs.length,
          completionRate:
            totalAssignments > 0
              ? Math.round((completedAssignments / totalAssignments) * 100)
              : null,
        },
        feedback: {
          totalFeedback,
          avgOverallRating: avgOverallRating ? Math.round(avgOverallRating * 10) / 10 : null,
          ratingDistribution,
        },
        nightReports: {
          totalReports: nightReports.length,
          avgBusinessRating: avgBusinessRating ? Math.round(avgBusinessRating * 10) / 10 : null,
          crowdNationality: nationalityCount,
          crowdType: crowdTypeCount,
          peakBusyTime: peakBusyTimeCount,
          crowdLevel: crowdLevelCount,
          weather: weatherCount,
          recentNotes: recentNotes,
        },
        topDJs,
        venues: userVenues,
        period,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      return NextResponse.json(
        { error: 'Failed to fetch statistics' },
        { status: 500 }
      );
    }
  });
}
