import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { withAnyRole } from '@/lib/api-auth';
import { getCurrentUser } from '@/lib/auth';

const prisma = new PrismaClient();

/**
 * GET /api/dj-portal/feedback
 *
 * All VenueFeedback for the logged-in DJ.
 * Returns ratings, notes, venue, and date — ordered newest first.
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

      const [feedback, aggregate] = await Promise.all([
        prisma.venueFeedback.findMany({
          where: { artistId },
          include: {
            venue: { select: { name: true } },
            assignment: { select: { date: true, startTime: true, endTime: true } },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.venueFeedback.aggregate({
          where: { artistId },
          _avg: {
            overallRating: true,
            musicQuality: true,
            crowdEngagement: true,
            professionalism: true,
          },
          _count: { overallRating: true },
        }),
      ]);

      const response = NextResponse.json({
        feedback: feedback.map((f) => ({
          id: f.id,
          venue: f.venue.name,
          date: f.assignment.date,
          startTime: f.assignment.startTime,
          endTime: f.assignment.endTime,
          overallRating: f.overallRating,
          musicQuality: f.musicQuality,
          crowdEngagement: f.crowdEngagement,
          professionalism: f.professionalism,
          notes: f.notes,
          crowdLevel: f.crowdLevel,
          guestMix: f.guestMix,
          createdAt: f.createdAt,
        })),
        averages: {
          overall: aggregate._avg.overallRating
            ? Math.round(aggregate._avg.overallRating * 10) / 10
            : null,
          musicQuality: aggregate._avg.musicQuality
            ? Math.round(aggregate._avg.musicQuality * 10) / 10
            : null,
          crowdEngagement: aggregate._avg.crowdEngagement
            ? Math.round(aggregate._avg.crowdEngagement * 10) / 10
            : null,
          professionalism: aggregate._avg.professionalism
            ? Math.round(aggregate._avg.professionalism * 10) / 10
            : null,
          totalRatings: aggregate._count.overallRating,
        },
      });

      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      return response;
    } catch (error) {
      console.error('Error fetching DJ feedback:', error);
      return NextResponse.json(
        { error: 'Failed to fetch feedback' },
        { status: 500 }
      );
    }
  });
}
