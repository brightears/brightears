import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

const querySchema = z.object({
  month: z.coerce.number().int().min(1).max(12).nullish(),
  year: z.coerce.number().int().min(2020).max(2030).nullish(),
  venueId: z.string().nullish(),
});

/**
 * GET /api/admin/schedule
 * Fetch all venue assignments for a given month (cross-venue view)
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
      month: searchParams.get('month'),
      year: searchParams.get('year'),
      venueId: searchParams.get('venueId'),
    });

    // Default to current month/year
    const now = new Date();
    const month = params.month || now.getMonth() + 1;
    const year = params.year || now.getFullYear();

    // Calculate date range for the month
    const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59)); // Last day of month

    // Build where clause
    const whereClause: any = {
      date: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (params.venueId) {
      whereClause.venueId = params.venueId;
    }

    // Fetch all venues (for column headers)
    const venues = await prisma.venue.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        operatingHours: true,
      },
    });

    // Fetch all assignments for the month
    const assignments = await prisma.venueAssignment.findMany({
      where: whereClause,
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
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
          },
        },
        feedback: {
          select: {
            id: true,
            overallRating: true,
          },
        },
      },
    });

    // Get all DJs (for the DJ dropdown)
    const djs = await prisma.artist.findMany({
      where: {
        category: 'DJ',
      },
      orderBy: { stageName: 'asc' },
      select: {
        id: true,
        stageName: true,
        profileImage: true,
        genres: true,
      },
    });

    // Check for potential conflicts (same DJ at multiple venues on same day)
    // Skip special events (no artistId)
    const conflictMap: Record<string, string[]> = {};
    assignments.forEach((assignment) => {
      if (!assignment.artistId) return; // Skip special events
      const dateKey = assignment.date.toISOString().split('T')[0];
      const djKey = `${dateKey}-${assignment.artistId}`;
      if (!conflictMap[djKey]) {
        conflictMap[djKey] = [];
      }
      conflictMap[djKey].push(assignment.venue.name);
    });

    const conflicts = Object.entries(conflictMap)
      .filter(([, venues]) => venues.length > 1)
      .map(([key]) => {
        // Key format: "YYYY-MM-DD-artistId"
        // Date has 2 dashes, so we need to handle carefully
        const parts = key.split('-');
        const date = `${parts[0]}-${parts[1]}-${parts[2]}`;
        const artistId = parts.slice(3).join('-'); // Handle artistIds that might contain dashes
        return {
          date,
          artistId,
          venues: conflictMap[key],
        };
      });

    const response = NextResponse.json({
      venues,
      assignments,
      djs,
      conflicts,
      month,
      year,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    return response;
  } catch (error) {
    console.error('Error fetching schedule:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to fetch schedule' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/schedule
 * Create a new venue assignment
 * Supports either DJ assignment (artistId) or special event (specialEvent)
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { venueId, artistId, specialEvent, date, startTime, endTime, slot, notes } = body;

    // Validate required fields - need either artistId OR specialEvent
    if (!venueId || !date || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Missing required fields (venueId, date, startTime, endTime)' },
        { status: 400 }
      );
    }

    if (!artistId && !specialEvent) {
      return NextResponse.json(
        { error: 'Must provide either artistId or specialEvent' },
        { status: 400 }
      );
    }

    // Validate time format (HH:MM, allowing 24:00 for end-of-day)
    const timeRegex = /^([01]?[0-9]|2[0-4]):([0-5][0-9])$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return NextResponse.json(
        { error: 'Invalid time format. Use HH:MM (e.g., 20:00)' },
        { status: 400 }
      );
    }

    // Validate startTime < endTime (24:00 = end of day = 1440 minutes)
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    if (startMinutes >= endMinutes) {
      return NextResponse.json(
        { error: 'End time must be after start time' },
        { status: 400 }
      );
    }

    // Parse date
    const assignmentDate = new Date(date);

    // Check for existing assignment at same venue/date/slot
    const existing = await prisma.venueAssignment.findFirst({
      where: {
        venueId,
        date: assignmentDate,
        slot: slot || null,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'An assignment already exists for this venue, date, and slot' },
        { status: 409 }
      );
    }

    // Create the assignment
    const assignment = await prisma.venueAssignment.create({
      data: {
        venueId,
        artistId: artistId || null,
        specialEvent: specialEvent || null,
        date: assignmentDate,
        startTime,
        endTime,
        slot: slot || null,
        status: assignmentDate > new Date() ? 'SCHEDULED' : 'COMPLETED',
        notes,
      },
      include: {
        venue: { select: { id: true, name: true } },
        artist: { select: { id: true, stageName: true, profileImage: true } },
      },
    });

    return NextResponse.json({ success: true, assignment });
  } catch (error) {
    console.error('Error creating assignment:', error);
    return NextResponse.json(
      { error: 'Failed to create assignment' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/schedule
 * Update an existing venue assignment
 * Supports switching between DJ assignment and special event
 */
export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, artistId, specialEvent, startTime, endTime, notes, status } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Assignment ID required' },
        { status: 400 }
      );
    }

    // Build update data
    const updateData: any = {};

    // Handle artistId and specialEvent - they are mutually exclusive
    if (artistId !== undefined) {
      updateData.artistId = artistId || null;
      // Clear specialEvent when setting a DJ
      if (artistId) {
        updateData.specialEvent = null;
      }
    }
    if (specialEvent !== undefined) {
      updateData.specialEvent = specialEvent || null;
      // Clear artistId when setting a special event
      if (specialEvent) {
        updateData.artistId = null;
      }
    }

    if (startTime) updateData.startTime = startTime;
    if (endTime) updateData.endTime = endTime;
    if (notes !== undefined) updateData.notes = notes;
    if (status) updateData.status = status;

    const assignment = await prisma.venueAssignment.update({
      where: { id },
      data: updateData,
      include: {
        venue: { select: { id: true, name: true } },
        artist: { select: { id: true, stageName: true, profileImage: true } },
      },
    });

    return NextResponse.json({ success: true, assignment });
  } catch (error) {
    console.error('Error updating assignment:', error);
    return NextResponse.json(
      { error: 'Failed to update assignment' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/schedule
 * Delete a venue assignment
 *
 * Single delete: ?id=xxx
 * Bulk delete by month: ?month=1&year=2026
 */
export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    // Bulk delete by month
    if (month && year) {
      const monthNum = parseInt(month);
      const yearNum = parseInt(year);
      const includeFeedback = searchParams.get('includeFeedback') === 'true';

      const startDate = new Date(Date.UTC(yearNum, monthNum - 1, 1, 0, 0, 0));
      const endDate = new Date(Date.UTC(yearNum, monthNum, 0, 23, 59, 59));

      const assignmentResult = await prisma.venueAssignment.deleteMany({
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      let feedbackDeleted = 0;
      if (includeFeedback) {
        // Also delete night feedback for this month
        const feedbackResult = await prisma.venueNightFeedback.deleteMany({
          where: {
            date: {
              gte: startDate,
              lte: endDate,
            },
          },
        });
        feedbackDeleted = feedbackResult.count;
      }

      return NextResponse.json({
        success: true,
        deleted: assignmentResult.count,
        feedbackDeleted,
        message: `Deleted ${assignmentResult.count} assignments${includeFeedback ? ` and ${feedbackDeleted} night feedback records` : ''} from ${month}/${year}`
      });
    }

    // Single delete by ID
    if (!id) {
      return NextResponse.json(
        { error: 'Assignment ID or month/year required' },
        { status: 400 }
      );
    }

    await prisma.venueAssignment.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    return NextResponse.json(
      { error: 'Failed to delete assignment' },
      { status: 500 }
    );
  }
}
