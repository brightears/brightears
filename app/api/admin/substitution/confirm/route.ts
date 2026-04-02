import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

const bodySchema = z.object({
  assignmentId: z.string().min(1, 'assignmentId is required'),
  artistId: z.string().min(1, 'artistId is required'),
  notes: z.string().optional(),
});

/**
 * POST /api/admin/substitution/confirm
 *
 * Confirm a DJ substitution — update the VenueAssignment with the new artist.
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = bodySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: parsed.error.issues },
        { status: 400 },
      );
    }

    const { assignmentId, artistId, notes } = parsed.data;

    // Verify the assignment exists
    const assignment = await prisma.venueAssignment.findUnique({
      where: { id: assignmentId },
      include: {
        venue: { select: { id: true, name: true } },
        artist: { select: { id: true, stageName: true } },
      },
    });

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    // Verify the replacement artist exists and is a DJ
    const newArtist = await prisma.artist.findUnique({
      where: { id: artistId },
      select: { id: true, stageName: true, profileImage: true, genres: true },
    });

    if (!newArtist) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }

    // Check the replacement DJ isn't blacked out on this date
    const blackout = await prisma.blackoutDate.findFirst({
      where: {
        artistId,
        startDate: { lte: assignment.date },
        endDate: { gte: assignment.date },
      },
    });

    if (blackout) {
      return NextResponse.json(
        { error: `${newArtist.stageName} has a blackout on this date: ${blackout.title}` },
        { status: 409 },
      );
    }

    // Check for time conflicts on the same date
    const conflicting = await prisma.venueAssignment.findFirst({
      where: {
        date: assignment.date,
        artistId,
        status: { not: 'CANCELLED' },
        id: { not: assignmentId }, // Exclude the assignment we're updating
      },
    });

    if (conflicting) {
      // Check if times actually overlap
      const sA = toMinutes(conflicting.startTime);
      const eA = toMinutes(conflicting.endTime, sA);
      const sB = toMinutes(assignment.startTime);
      const eB = toMinutes(assignment.endTime, sB);

      if (sA < eB && sB < eA) {
        return NextResponse.json(
          {
            error: `${newArtist.stageName} already has a conflicting assignment on this date`,
            conflictingAssignment: conflicting.id,
          },
          { status: 409 },
        );
      }
    }

    // Build notes — preserve context about the swap
    const previousArtist = assignment.artist?.stageName || 'unassigned';
    const swapNote = `Substitution: ${newArtist.stageName} replaces ${previousArtist}`;
    const fullNotes = notes
      ? `${swapNote}. ${notes}`
      : swapNote;

    // Update the assignment
    const updated = await prisma.venueAssignment.update({
      where: { id: assignmentId },
      data: {
        artistId,
        specialEvent: null, // Clear any special event flag
        notes: fullNotes,
      },
      include: {
        venue: { select: { id: true, name: true } },
        artist: { select: { id: true, stageName: true, profileImage: true, genres: true } },
      },
    });

    return NextResponse.json({
      success: true,
      assignment: updated,
      substitution: {
        previousArtist,
        newArtist: newArtist.stageName,
        venue: updated.venue.name,
        date: updated.date.toISOString().split('T')[0],
        startTime: updated.startTime,
        endTime: updated.endTime,
      },
    });
  } catch (error) {
    console.error('Error confirming substitution:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request body', details: error.issues },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: 'Failed to confirm substitution' },
      { status: 500 },
    );
  }
}

/** Convert time string to minutes, handling overnight */
function toMinutes(time: string, refStart?: number): number {
  const [h, m] = time.split(':').map(Number);
  let mins = h * 60 + m;
  if (refStart !== undefined && mins < refStart && h < 12) {
    mins += 24 * 60;
  }
  return mins;
}
