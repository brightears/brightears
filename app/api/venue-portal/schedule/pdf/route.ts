import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { SchedulePDF } from '@/lib/pdf/schedule-pdf';

/**
 * GET /api/venue-portal/schedule/pdf
 * Generate a PDF of the monthly DJ schedule for venue portal users
 * Filters to only show the user's corporate venues
 */
export async function GET(req: NextRequest) {
  try {
    // Check authentication - allow CORPORATE or ADMIN
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = user.role === 'ADMIN';
    const corporateId = user.corporate?.id;

    // Must have corporate profile unless admin
    if (!corporateId && !isAdmin) {
      return NextResponse.json({ error: 'Corporate profile required' }, { status: 403 });
    }

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const month = parseInt(searchParams.get('month') || String(new Date().getMonth() + 1));
    const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()));

    // Validate month/year
    if (isNaN(month) || month < 1 || month > 12) {
      return NextResponse.json({ error: 'Invalid month' }, { status: 400 });
    }
    if (isNaN(year) || year < 2020 || year > 2030) {
      return NextResponse.json({ error: 'Invalid year' }, { status: 400 });
    }

    // Calculate date range for the month
    const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59));

    // Fetch venues - filtered by corporate ID unless admin
    const venues = await prisma.venue.findMany({
      where: corporateId
        ? { corporateId, isActive: true }
        : { isActive: true },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        operatingHours: true,
      },
    });

    if (venues.length === 0) {
      return NextResponse.json({ error: 'No venues found' }, { status: 404 });
    }

    const venueIds = venues.map((v) => v.id);

    // Build venue columns (expand slots)
    const venueColumns: { venue: { id: string; name: string }; slot: string | null; label: string }[] = [];
    venues.forEach((venue) => {
      const hours = venue.operatingHours as { slots?: string[] } | null;
      const slots = hours?.slots;

      if (slots && slots.length > 0) {
        slots.forEach((slot) => {
          venueColumns.push({
            venue: { id: venue.id, name: venue.name },
            slot,
            label: `${venue.name} ${slot}`,
          });
        });
      } else {
        venueColumns.push({
          venue: { id: venue.id, name: venue.name },
          slot: null,
          label: venue.name,
        });
      }
    });

    // Fetch assignments for the month - filtered to user's venues
    const assignments = await prisma.venueAssignment.findMany({
      where: {
        venueId: { in: venueIds },
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
      select: {
        date: true,
        startTime: true,
        endTime: true,
        slot: true,
        specialEvent: true,
        venue: {
          select: {
            id: true,
            name: true,
          },
        },
        artist: {
          select: {
            stageName: true,
          },
        },
      },
    });

    // Format assignments for PDF
    const formattedAssignments = assignments.map((a) => ({
      date: a.date.toISOString(),
      startTime: a.startTime,
      endTime: a.endTime,
      slot: a.slot,
      specialEvent: a.specialEvent,
      venue: a.venue,
      artist: a.artist,
    }));

    // Generate timestamp
    const generatedAt = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    // Generate PDF
    const pdfBuffer = await renderToBuffer(
      SchedulePDF({
        month,
        year,
        venueColumns,
        assignments: formattedAssignments,
        generatedAt,
      })
    );

    // Return PDF as download
    const monthName = new Date(year, month - 1).toLocaleDateString('en-US', { month: 'long' });
    const filename = `DJ-Schedule-${monthName}-${year}.pdf`;

    // Convert Buffer to Uint8Array for NextResponse compatibility
    const uint8Array = new Uint8Array(pdfBuffer);

    return new NextResponse(uint8Array, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Error generating schedule PDF:', error);
    // Return detailed error in development, generic in production
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error('PDF Error details:', { message: errorMessage, stack: errorStack });
    return NextResponse.json(
      {
        error: 'Failed to generate PDF',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}
