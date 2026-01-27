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
  date: z.string().optional(), // ISO date string YYYY-MM-DD
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(20),
});

/**
 * Night feedback submission schema
 */
const nightFeedbackSchema = z.object({
  venueId: z.string(), // Not UUID - venue IDs are human-readable strings
  date: z.string(), // ISO date string YYYY-MM-DD

  // Overall rating (required)
  overallNightRating: z.number().int().min(1).max(5),

  // Crowd metrics
  peakBusyTime: z.string().optional(),
  peakCrowdLevel: z.enum(['Light', 'Moderate', 'Busy', 'Packed']).optional(),
  estimatedHeadcount: z.number().int().min(0).optional(),

  // Nationality breakdown (percentages)
  pctThai: z.number().int().min(0).max(100).optional().default(0),
  pctWestern: z.number().int().min(0).max(100).optional().default(0),
  pctAsian: z.number().int().min(0).max(100).optional().default(0),
  pctMiddleEastern: z.number().int().min(0).max(100).optional().default(0),
  pctOther: z.number().int().min(0).max(100).optional().default(0),

  // Guest type breakdown (percentages)
  pctTourists: z.number().int().min(0).max(100).optional().default(0),
  pctLocals: z.number().int().min(0).max(100).optional().default(0),
  pctBusiness: z.number().int().min(0).max(100).optional().default(0),
  pctHotelGuests: z.number().int().min(0).max(100).optional().default(0),

  // External factors
  weatherCondition: z.string().optional(),
  specialEvent: z.string().optional(),

  // Comments
  generalNotes: z.string().max(2000).optional(),
  operationalIssues: z.string().max(2000).optional(),
});

/**
 * GET /api/venue-portal/night-feedback
 *
 * Fetch night feedback for corporate venues
 * Requires CORPORATE role
 *
 * Query Parameters:
 * - venueId: Filter by specific venue
 * - date: Get feedback for specific date (YYYY-MM-DD)
 * - startDate/endDate: Date range filter
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 20, max: 50)
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
        date: searchParams.get('date') || undefined,
        startDate: searchParams.get('startDate') || undefined,
        endDate: searchParams.get('endDate') || undefined,
        page: searchParams.get('page') || '1',
        limit: searchParams.get('limit') || '20',
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

      const { venueId, date, startDate, endDate, page, limit } =
        validationResult.data;

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

      const skip = (page - 1) * limit;

      // Build where clause
      const where: any = {
        venueId: venueId ? venueId : { in: venueIds },
      };

      // Single date filter
      if (date) {
        where.date = new Date(date);
      }
      // Date range filter
      else if (startDate || endDate) {
        where.date = {};
        if (startDate) where.date.gte = new Date(startDate);
        if (endDate) where.date.lte = new Date(endDate);
      }

      const [nightFeedback, total] = await Promise.all([
        prisma.venueNightFeedback.findMany({
          where,
          include: {
            venue: {
              select: { id: true, name: true },
            },
          },
          orderBy: { date: 'desc' },
          skip,
          take: limit,
        }),
        prisma.venueNightFeedback.count({ where }),
      ]);

      return NextResponse.json({
        nightFeedback,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error('Error fetching night feedback:', error);
      return NextResponse.json(
        { error: 'Failed to fetch night feedback' },
        { status: 500 }
      );
    }
  });
}

/**
 * POST /api/venue-portal/night-feedback
 *
 * Submit or update night feedback for a venue on a specific date
 * Requires CORPORATE role
 *
 * If feedback already exists for that venue/date, it will be updated (upsert)
 */
export async function POST(req: NextRequest) {
  return withRole(req, 'CORPORATE', async () => {
    try {
      const user = await getCurrentUser();

      if (!user?.corporate?.id) {
        return NextResponse.json(
          { error: 'Corporate profile not found' },
          { status: 404 }
        );
      }

      const body = await req.json();
      const validationResult = nightFeedbackSchema.safeParse(body);

      if (!validationResult.success) {
        return NextResponse.json(
          {
            error: 'Validation failed',
            details: validationResult.error.issues,
          },
          { status: 400 }
        );
      }

      const data = validationResult.data;

      // Verify venue belongs to this corporate user
      const venue = await prisma.venue.findFirst({
        where: {
          id: data.venueId,
          corporateId: user.corporate.id,
          isActive: true,
        },
      });

      if (!venue) {
        return NextResponse.json(
          { error: 'Venue not found or access denied' },
          { status: 403 }
        );
      }

      // Validate nationality percentages sum to 100 (if any provided)
      const nationalitySum =
        (data.pctThai || 0) +
        (data.pctWestern || 0) +
        (data.pctAsian || 0) +
        (data.pctMiddleEastern || 0) +
        (data.pctOther || 0);

      if (nationalitySum > 0 && nationalitySum !== 100) {
        return NextResponse.json(
          {
            error: 'Nationality percentages must sum to 100',
            details: { sum: nationalitySum },
          },
          { status: 400 }
        );
      }

      // Validate guest type percentages sum to 100 (if any provided)
      const guestTypeSum =
        (data.pctTourists || 0) +
        (data.pctLocals || 0) +
        (data.pctBusiness || 0) +
        (data.pctHotelGuests || 0);

      if (guestTypeSum > 0 && guestTypeSum !== 100) {
        return NextResponse.json(
          {
            error: 'Guest type percentages must sum to 100',
            details: { sum: guestTypeSum },
          },
          { status: 400 }
        );
      }

      const feedbackDate = new Date(data.date);

      // Upsert: create or update night feedback
      const nightFeedback = await prisma.venueNightFeedback.upsert({
        where: {
          venueId_date: {
            venueId: data.venueId,
            date: feedbackDate,
          },
        },
        create: {
          venueId: data.venueId,
          date: feedbackDate,
          submittedBy: user.id,
          overallNightRating: data.overallNightRating,
          peakBusyTime: data.peakBusyTime,
          peakCrowdLevel: data.peakCrowdLevel,
          estimatedHeadcount: data.estimatedHeadcount,
          pctThai: data.pctThai || 0,
          pctWestern: data.pctWestern || 0,
          pctAsian: data.pctAsian || 0,
          pctMiddleEastern: data.pctMiddleEastern || 0,
          pctOther: data.pctOther || 0,
          pctTourists: data.pctTourists || 0,
          pctLocals: data.pctLocals || 0,
          pctBusiness: data.pctBusiness || 0,
          pctHotelGuests: data.pctHotelGuests || 0,
          weatherCondition: data.weatherCondition,
          specialEvent: data.specialEvent,
          generalNotes: data.generalNotes,
          operationalIssues: data.operationalIssues,
        },
        update: {
          submittedBy: user.id,
          overallNightRating: data.overallNightRating,
          peakBusyTime: data.peakBusyTime,
          peakCrowdLevel: data.peakCrowdLevel,
          estimatedHeadcount: data.estimatedHeadcount,
          pctThai: data.pctThai || 0,
          pctWestern: data.pctWestern || 0,
          pctAsian: data.pctAsian || 0,
          pctMiddleEastern: data.pctMiddleEastern || 0,
          pctOther: data.pctOther || 0,
          pctTourists: data.pctTourists || 0,
          pctLocals: data.pctLocals || 0,
          pctBusiness: data.pctBusiness || 0,
          pctHotelGuests: data.pctHotelGuests || 0,
          weatherCondition: data.weatherCondition,
          specialEvent: data.specialEvent,
          generalNotes: data.generalNotes,
          operationalIssues: data.operationalIssues,
        },
        include: {
          venue: {
            select: { id: true, name: true },
          },
        },
      });

      return NextResponse.json(
        { nightFeedback, message: 'Night feedback saved successfully' },
        { status: 201 }
      );
    } catch (error) {
      console.error('Error saving night feedback:', error);
      return NextResponse.json(
        { error: 'Failed to save night feedback' },
        { status: 500 }
      );
    }
  });
}
