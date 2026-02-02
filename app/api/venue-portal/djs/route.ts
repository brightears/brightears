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
  category: z.string().optional(),
  search: z.string().max(100).optional(),
});

/**
 * GET /api/venue-portal/djs
 *
 * List all DJs that have been assigned to this corporate's venues
 * Requires CORPORATE role
 *
 * Query Parameters:
 * - venueId: Filter by specific venue (optional)
 * - category: Filter by artist category
 * - search: Search by stage name
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
        category: searchParams.get('category') || undefined,
        search: searchParams.get('search') || undefined,
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

      const { venueId, category, search } = validationResult.data;

      // Get all venue IDs for this corporate user
      const userVenues = await prisma.venue.findMany({
        where: {
          corporateId: user.corporate.id,
          isActive: true,
        },
        select: { id: true },
      });

      const venueIds = userVenues.map((v) => v.id);

      // Verify venue belongs to user if specific venueId provided
      if (venueId && !venueIds.includes(venueId)) {
        return NextResponse.json(
          { error: 'Venue not found or access denied' },
          { status: 403 }
        );
      }

      // Find all unique artists assigned to this corporate's venues
      const artistAssignments = await prisma.venueAssignment.findMany({
        where: {
          venueId: venueId ? venueId : { in: venueIds },
        },
        select: {
          artistId: true,
        },
        distinct: ['artistId'],
      });

      const artistIds = artistAssignments
        .map((a) => a.artistId)
        .filter((id): id is string => id !== null);

      // Build artist query
      const artistWhere: any = {
        id: { in: artistIds },
      };

      if (category) {
        artistWhere.category = category;
      }

      if (search) {
        artistWhere.stageName = { contains: search, mode: 'insensitive' };
      }

      // Get artists with their stats for this corporate
      const artists = await prisma.artist.findMany({
        where: artistWhere,
        select: {
          id: true,
          stageName: true,
          profileImage: true,
          category: true,
          genres: true,
          bio: true,
          instagram: true,
          averageRating: true,
        },
      });

      // Get venue-specific stats for each artist
      const artistsWithStats = await Promise.all(
        artists.map(async (artist) => {
          // Get feedback stats for this artist at this corporate's venues
          const feedback = await prisma.venueFeedback.findMany({
            where: {
              artistId: artist.id,
              venueId: venueId ? venueId : { in: venueIds },
            },
            select: {
              overallRating: true,
              musicQuality: true,
              crowdEngagement: true,
              professionalism: true,
              wouldRebook: true,
            },
          });

          const totalAssignments = await prisma.venueAssignment.count({
            where: {
              artistId: artist.id,
              venueId: venueId ? venueId : { in: venueIds },
            },
          });

          const completedAssignments = await prisma.venueAssignment.count({
            where: {
              artistId: artist.id,
              venueId: venueId ? venueId : { in: venueIds },
              status: 'COMPLETED',
            },
          });

          // Calculate average ratings
          const avgOverallRating =
            feedback.length > 0
              ? feedback.reduce((sum, f) => sum + f.overallRating, 0) / feedback.length
              : null;

          const rebookRate =
            feedback.length > 0
              ? (feedback.filter((f) => f.wouldRebook === true).length / feedback.length) * 100
              : null;

          return {
            ...artist,
            venueStats: {
              totalAssignments,
              completedAssignments,
              feedbackCount: feedback.length,
              avgOverallRating: avgOverallRating ? Math.round(avgOverallRating * 10) / 10 : null,
              rebookRate: rebookRate ? Math.round(rebookRate) : null,
            },
          };
        })
      );

      // Sort by average rating (highest first), then by total assignments
      artistsWithStats.sort((a, b) => {
        if (b.venueStats.avgOverallRating === a.venueStats.avgOverallRating) {
          return b.venueStats.totalAssignments - a.venueStats.totalAssignments;
        }
        return (b.venueStats.avgOverallRating || 0) - (a.venueStats.avgOverallRating || 0);
      });

      return NextResponse.json({ djs: artistsWithStats });
    } catch (error) {
      console.error('Error fetching DJs:', error);
      return NextResponse.json(
        { error: 'Failed to fetch DJs' },
        { status: 500 }
      );
    }
  });
}
