import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { withAnyRole } from '@/lib/api-auth';
import { getCurrentUser } from '@/lib/auth';

const prisma = new PrismaClient();

/**
 * GET /api/dj-portal/dashboard
 *
 * Aggregated stats for the logged-in DJ:
 * - Upcoming shifts this month
 * - Average rating
 * - Total shifts
 * - Next 3 upcoming performances
 * - Last 5 feedback entries
 */
export async function GET(req: NextRequest) {
  return withAnyRole(req, ['ARTIST', 'ADMIN'], async () => {
    try {
      const user = await getCurrentUser();
      const artistId = user?.artist?.id;

      if (!artistId) {
        return NextResponse.json(
          { error: 'Artist profile not found' },
          { status: 404 }
        );
      }

      const now = new Date();
      // Bangkok time: start of current month
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const [
        upcomingThisMonth,
        totalShifts,
        avgRating,
        next3,
        recentFeedback,
      ] = await Promise.all([
        // Upcoming shifts this month
        prisma.venueAssignment.count({
          where: {
            artistId,
            date: { gte: now, lte: monthEnd },
            status: 'SCHEDULED',
          },
        }),
        // Total shifts all time
        prisma.venueAssignment.count({
          where: { artistId },
        }),
        // Average rating
        prisma.venueFeedback.aggregate({
          where: { artistId },
          _avg: { overallRating: true },
          _count: { overallRating: true },
        }),
        // Next 3 upcoming performances
        prisma.venueAssignment.findMany({
          where: {
            artistId,
            date: { gte: now },
            status: 'SCHEDULED',
          },
          include: {
            venue: { select: { id: true, name: true } },
          },
          orderBy: { date: 'asc' },
          take: 3,
        }),
        // Last 5 feedback entries
        prisma.venueFeedback.findMany({
          where: { artistId },
          include: {
            venue: { select: { name: true } },
            assignment: { select: { date: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        }),
      ]);

      const response = NextResponse.json({
        stats: {
          upcomingThisMonth,
          totalShifts,
          avgRating: avgRating._avg.overallRating
            ? Math.round(avgRating._avg.overallRating * 10) / 10
            : null,
          totalRatings: avgRating._count.overallRating,
        },
        upcoming: next3.map((a) => ({
          id: a.id,
          venue: a.venue.name,
          date: a.date,
          startTime: a.startTime,
          endTime: a.endTime,
          slot: a.slot,
        })),
        recentFeedback: recentFeedback.map((f) => ({
          id: f.id,
          venue: f.venue.name,
          date: f.assignment.date,
          overallRating: f.overallRating,
          musicQuality: f.musicQuality,
          crowdEngagement: f.crowdEngagement,
          professionalism: f.professionalism,
          notes: f.notes,
        })),
      });

      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      return response;
    } catch (error) {
      console.error('Error fetching DJ dashboard:', error);
      return NextResponse.json(
        { error: 'Failed to fetch dashboard data' },
        { status: 500 }
      );
    }
  });
}
