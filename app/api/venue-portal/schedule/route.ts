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
  venueId: z.string().uuid().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'ALL']).optional().default('ALL'),
});

/**
 * GET /api/venue-portal/schedule
 *
 * Get DJ assignments/schedule for corporate venues
 * Requires CORPORATE role
 *
 * Query Parameters:
 * - venueId: Filter by specific venue (optional)
 * - startDate: Start date for range filter (ISO8601)
 * - endDate: End date for range filter (ISO8601)
 * - status: SCHEDULED | COMPLETED | CANCELLED | NO_SHOW | ALL
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
        startDate: searchParams.get('startDate') || undefined,
        endDate: searchParams.get('endDate') || undefined,
        status: searchParams.get('status') || 'ALL',
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

      const { venueId, startDate, endDate, status } = validationResult.data;

      // First, get all venue IDs for this corporate user
      const userVenues = await prisma.venue.findMany({
        where: {
          corporateId: user.corporate.id,
          isActive: true,
        },
        select: { id: true },
      });

      const venueIds = userVenues.map((v) => v.id);

      // Build where clause
      const where: any = {
        venueId: venueId ? venueId : { in: venueIds },
      };

      // Verify venue belongs to user if specific venueId provided
      if (venueId && !venueIds.includes(venueId)) {
        return NextResponse.json(
          { error: 'Venue not found or access denied' },
          { status: 403 }
        );
      }

      // Date range filter
      if (startDate || endDate) {
        where.date = {};
        if (startDate) {
          where.date.gte = new Date(startDate);
        }
        if (endDate) {
          where.date.lte = new Date(endDate);
        }
      }

      // Status filter
      if (status !== 'ALL') {
        where.status = status;
      }

      // Fetch assignments with artist details
      const assignments = await prisma.venueAssignment.findMany({
        where,
        include: {
          venue: {
            select: {
              id: true,
              name: true,
            },
          },
          artist: {
            select: {
              id: true,
              stageName: true,
              profileImage: true,
              category: true,
              genres: true,
            },
          },
          feedback: {
            select: {
              id: true,
              overallRating: true,
            },
          },
        },
        orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
      });

      return NextResponse.json({ assignments });
    } catch (error) {
      console.error('Error fetching schedule:', error);
      return NextResponse.json(
        { error: 'Failed to fetch schedule' },
        { status: 500 }
      );
    }
  });
}
