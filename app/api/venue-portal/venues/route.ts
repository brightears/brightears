import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { withRole } from '@/lib/api-auth';
import { getCurrentUser } from '@/lib/auth';

const prisma = new PrismaClient();

/**
 * GET /api/venue-portal/venues
 *
 * List all venues for the current corporate user
 * Requires CORPORATE role
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

      const venues = await prisma.venue.findMany({
        where: {
          corporateId: user.corporate.id,
          isActive: true,
        },
        include: {
          _count: {
            select: {
              assignments: true,
              feedback: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      });

      // Get upcoming assignments count for each venue
      const venuesWithStats = await Promise.all(
        venues.map(async (venue) => {
          const upcomingAssignments = await prisma.venueAssignment.count({
            where: {
              venueId: venue.id,
              date: { gte: new Date() },
              status: 'SCHEDULED',
            },
          });

          const pendingFeedback = await prisma.venueAssignment.count({
            where: {
              venueId: venue.id,
              status: 'COMPLETED',
              feedback: null,
            },
          });

          return {
            ...venue,
            upcomingAssignments,
            pendingFeedback,
          };
        })
      );

      return NextResponse.json({ venues: venuesWithStats });
    } catch (error) {
      console.error('Error fetching venues:', error);
      return NextResponse.json(
        { error: 'Failed to fetch venues' },
        { status: 500 }
      );
    }
  });
}
