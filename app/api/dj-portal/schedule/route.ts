import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { withAnyRole } from '@/lib/api-auth';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

const prisma = new PrismaClient();

const querySchema = z.object({
  month: z.string().optional(), // YYYY-MM format
  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'ALL']).optional().default('ALL'),
});

/**
 * GET /api/dj-portal/schedule
 *
 * All venue assignments for the logged-in DJ.
 * Filterable by month and status.
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

      const { searchParams } = new URL(req.url);
      const params = {
        month: searchParams.get('month') || undefined,
        status: searchParams.get('status') || 'ALL',
      };

      const validationResult = querySchema.safeParse(params);
      if (!validationResult.success) {
        return NextResponse.json(
          { error: 'Invalid query parameters', details: validationResult.error.issues },
          { status: 400 }
        );
      }

      const { month, status } = validationResult.data;

      // Build where clause
      const where: any = { artistId };

      if (month) {
        const [year, mon] = month.split('-').map(Number);
        const startDate = new Date(year, mon - 1, 1);
        const endDate = new Date(year, mon, 0); // last day of month
        where.date = { gte: startDate, lte: endDate };
      }

      if (status !== 'ALL') {
        where.status = status;
      }

      const assignments = await prisma.venueAssignment.findMany({
        where,
        include: {
          venue: { select: { id: true, name: true } },
          feedback: {
            select: { overallRating: true },
          },
        },
        orderBy: { date: 'desc' },
      });

      const response = NextResponse.json({
        assignments: assignments.map((a) => ({
          id: a.id,
          venue: a.venue.name,
          venueId: a.venue.id,
          date: a.date,
          startTime: a.startTime,
          endTime: a.endTime,
          slot: a.slot,
          status: a.status,
          specialEvent: a.specialEvent,
          rating: a.feedback?.overallRating || null,
        })),
      });

      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      return response;
    } catch (error) {
      console.error('Error fetching DJ schedule:', error);
      return NextResponse.json(
        { error: 'Failed to fetch schedule' },
        { status: 500 }
      );
    }
  });
}
