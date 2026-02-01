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
  artistId: z.string().optional(), // Not UUID - artist IDs are human-readable strings
  pending: z.enum(['true', 'false']).optional(),
  history: z.enum(['true', 'false']).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(20),
});

/**
 * Feedback submission schema (simplified)
 */
const feedbackSchema = z.object({
  assignmentId: z.string(), // Not UUID - assignment IDs are human-readable strings
  overallRating: z.number().int().min(1).max(5),
  notes: z.string().max(2000).optional(),
  // Venue context (passed from Night Feedback in wizard)
  crowdLevel: z.enum(['Light', 'Moderate', 'Busy', 'Packed']).optional(),
  guestMix: z.enum(['Tourists', 'Locals', 'Business', 'Mixed']).optional(),
});

/**
 * GET /api/venue-portal/feedback
 *
 * List feedback for corporate venues
 * Requires CORPORATE role
 *
 * Query Parameters:
 * - venueId: Filter by specific venue
 * - artistId: Filter by specific artist
 * - pending: If 'true', return assignments needing feedback
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
        artistId: searchParams.get('artistId') || undefined,
        pending: searchParams.get('pending') || undefined,
        history: searchParams.get('history') || undefined,
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

      const { venueId, artistId, pending, history, page, limit } = validationResult.data;

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

      // Helper: Check if a shift has ended (date + endTime < now)
      // endTime is in Bangkok time (UTC+7), server runs in UTC
      const hasShiftEnded = (assignmentDate: Date, endTime: string): boolean => {
        const [hours, mins] = endTime.split(':').map(Number);
        const BANGKOK_OFFSET_HOURS = 7;
        const endDateTime = new Date(assignmentDate);
        // Convert Bangkok time to UTC: Bangkok 21:00 = UTC 14:00
        endDateTime.setUTCHours(hours - BANGKOK_OFFSET_HOURS, mins, 0, 0);
        return endDateTime <= new Date();
      };

      // If pending=true, return assignments needing feedback
      // A DJ is ready for feedback when their shift has ended (date + endTime < now)
      if (pending === 'true') {
        const now = new Date();
        const where: any = {
          venueId: venueId ? venueId : { in: venueIds },
          feedback: null,
          artistId: { not: null }, // Only DJ assignments, not special events
          date: { lte: now }, // Date is today or earlier
        };

        if (artistId) {
          where.artistId = artistId;
        }

        // Fetch candidates, then filter by endTime in application code
        // (Prisma can't compare date + time string as datetime)
        const candidates = await prisma.venueAssignment.findMany({
          where,
          include: {
            venue: {
              select: { id: true, name: true },
            },
            artist: {
              select: {
                id: true,
                stageName: true,
                profileImage: true,
                category: true,
              },
            },
          },
          orderBy: { date: 'desc' },
        });

        // Filter to only assignments where the shift has actually ended
        const allPending = candidates.filter(a => hasShiftEnded(a.date, a.endTime));

        // Apply pagination
        const total = allPending.length;
        const pendingAssignments = allPending.slice(skip, skip + limit);

        return NextResponse.json({
          assignments: pendingAssignments,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        });
      }

      // If history=true, return ALL assignments where shift has ended (with or without feedback)
      if (history === 'true') {
        const now = new Date();
        const where: any = {
          venueId: venueId ? venueId : { in: venueIds },
          artistId: { not: null }, // Only DJ assignments
          date: { lte: now },
        };

        if (artistId) {
          where.artistId = artistId;
        }

        // Fetch candidates, then filter by endTime
        const candidates = await prisma.venueAssignment.findMany({
          where,
          include: {
            venue: {
              select: { id: true, name: true },
            },
            artist: {
              select: {
                id: true,
                stageName: true,
                profileImage: true,
                category: true,
              },
            },
            feedback: {
              select: {
                id: true,
                overallRating: true,
                createdAt: true,
              },
            },
          },
          orderBy: { date: 'desc' },
        });

        // Filter to only assignments where the shift has ended
        const allHistory = candidates.filter(a => hasShiftEnded(a.date, a.endTime));

        // Apply pagination
        const total = allHistory.length;
        const historyAssignments = allHistory.slice(skip, skip + limit);

        return NextResponse.json({
          assignments: historyAssignments,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        });
      }

      // Otherwise, return submitted feedback
      const where: any = {
        venueId: venueId ? venueId : { in: venueIds },
      };

      if (artistId) {
        where.artistId = artistId;
      }

      const [feedback, total] = await Promise.all([
        prisma.venueFeedback.findMany({
          where,
          include: {
            venue: {
              select: { id: true, name: true },
            },
            artist: {
              select: {
                id: true,
                stageName: true,
                profileImage: true,
                category: true,
              },
            },
            assignment: {
              select: {
                date: true,
                startTime: true,
                endTime: true,
                slot: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.venueFeedback.count({ where }),
      ]);

      return NextResponse.json({
        feedback,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error('Error fetching feedback:', error);
      return NextResponse.json(
        { error: 'Failed to fetch feedback' },
        { status: 500 }
      );
    }
  });
}

/**
 * POST /api/venue-portal/feedback
 *
 * Submit feedback for a completed assignment
 * Requires CORPORATE role
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
      const validationResult = feedbackSchema.safeParse(body);

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

      // Get the assignment and verify it belongs to this corporate's venue
      const assignment = await prisma.venueAssignment.findUnique({
        where: { id: data.assignmentId },
        include: {
          venue: {
            select: { corporateId: true },
          },
          feedback: true,
        },
      });

      if (!assignment) {
        return NextResponse.json(
          { error: 'Assignment not found' },
          { status: 404 }
        );
      }

      if (assignment.venue.corporateId !== user.corporate.id) {
        return NextResponse.json(
          { error: 'Access denied' },
          { status: 403 }
        );
      }

      if (assignment.status !== 'COMPLETED') {
        return NextResponse.json(
          { error: 'Can only submit feedback for completed assignments' },
          { status: 400 }
        );
      }

      if (assignment.feedback) {
        return NextResponse.json(
          { error: 'Feedback already submitted for this assignment' },
          { status: 400 }
        );
      }

      // Cannot submit feedback for special events (no DJ assigned)
      if (!assignment.artistId) {
        return NextResponse.json(
          { error: 'Cannot submit feedback for special events without a DJ' },
          { status: 400 }
        );
      }

      // Create feedback
      const feedback = await prisma.venueFeedback.create({
        data: {
          assignmentId: data.assignmentId,
          venueId: assignment.venueId,
          artistId: assignment.artistId,
          submittedBy: user.id,
          overallRating: data.overallRating,
          notes: data.notes,
          crowdLevel: data.crowdLevel,
          guestMix: data.guestMix,
        },
        include: {
          venue: {
            select: { id: true, name: true },
          },
          artist: {
            select: {
              id: true,
              stageName: true,
            },
          },
        },
      });

      return NextResponse.json(
        { feedback, message: 'Feedback submitted successfully' },
        { status: 201 }
      );
    } catch (error) {
      console.error('Error submitting feedback:', error);
      return NextResponse.json(
        { error: 'Failed to submit feedback' },
        { status: 500 }
      );
    }
  });
}
