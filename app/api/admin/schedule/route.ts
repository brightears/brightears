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
    const conflictMap: Record<string, string[]> = {};
    assignments.forEach((assignment) => {
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
        const [date, artistId] = key.split('-').slice(0, 2);
        return {
          date,
          artistId: key.substring(11), // Everything after date-
          venues: conflictMap[key],
        };
      });

    return NextResponse.json({
      venues,
      assignments,
      djs,
      conflicts,
      month,
      year,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
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
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { venueId, artistId, date, startTime, endTime, slot, notes } = body;

    // Validate required fields
    if (!venueId || !artistId || !date || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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
        artistId,
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
 */
export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, artistId, startTime, endTime, notes, status } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Assignment ID required' },
        { status: 400 }
      );
    }

    // Build update data
    const updateData: any = {};
    if (artistId) updateData.artistId = artistId;
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
 */
export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Assignment ID required' },
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
