import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, VenueAssignmentStatus } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * POST /api/admin/seed-january
 *
 * Seeds January 2026 completed assignments for testing feedback/statistics.
 * This is a one-time use endpoint - can be removed after testing.
 */
export async function POST(req: NextRequest) {
  try {
    // Get venues
    const venues = await prisma.venue.findMany({
      select: { id: true, name: true },
    });

    if (venues.length === 0) {
      return NextResponse.json({ error: 'No venues found' }, { status: 404 });
    }

    // Get artists
    const artists = await prisma.artist.findMany({
      select: { id: true, stageName: true },
      take: 10,
    });

    if (artists.length === 0) {
      return NextResponse.json({ error: 'No artists found' }, { status: 404 });
    }

    // January 2026 dates
    const januaryDates = [
      new Date('2026-01-05'),
      new Date('2026-01-08'),
      new Date('2026-01-10'),
      new Date('2026-01-12'),
      new Date('2026-01-15'),
      new Date('2026-01-18'),
      new Date('2026-01-20'),
      new Date('2026-01-22'),
      new Date('2026-01-25'),
      new Date('2026-01-28'),
    ];

    let created = 0;
    let skipped = 0;
    const results: string[] = [];

    for (const venue of venues) {
      for (let i = 0; i < januaryDates.length; i++) {
        const date = januaryDates[i];
        const artist = artists[i % artists.length];

        // Check if assignment already exists
        const existing = await prisma.venueAssignment.findFirst({
          where: {
            venueId: venue.id,
            date: date,
          },
        });

        if (existing) {
          skipped++;
          continue;
        }

        await prisma.venueAssignment.create({
          data: {
            venueId: venue.id,
            artistId: artist.id,
            date: date,
            startTime: '20:00',
            endTime: '01:00',
            slot: null,
            status: VenueAssignmentStatus.COMPLETED,
            notes: 'January 2026 test assignment',
          },
        });

        created++;
        results.push(`${venue.name} - ${date.toISOString().split('T')[0]} - ${artist.stageName}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Created ${created} assignments, skipped ${skipped} existing`,
      created: results,
    });
  } catch (error) {
    console.error('Error seeding January data:', error);
    return NextResponse.json(
      { error: 'Failed to seed data', details: String(error) },
      { status: 500 }
    );
  }
}
