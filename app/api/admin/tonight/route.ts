import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { getBangkokToday } from '@/lib/venue-utils';

const BANGKOK_OFFSET_MS = 7 * 60 * 60 * 1000;

/**
 * Authenticate via Clerk session (ADMIN role) or VINYL_API_KEY header.
 * Returns true if authorized.
 */
async function isAuthorized(req: NextRequest): Promise<boolean> {
  // Check VINYL_API_KEY header first (for programmatic access)
  const vinylKey = process.env.VINYL_API_KEY;
  if (vinylKey) {
    const authHeader = req.headers.get('authorization');
    if (authHeader === `Bearer ${vinylKey}`) return true;

    const headerKey = req.headers.get('x-vinyl-api-key');
    if (headerKey === vinylKey) return true;
  }

  // Fall back to Clerk session auth
  const user = await getCurrentUser();
  return !!(user && user.role === 'ADMIN');
}

/**
 * Parse a time string "HH:MM" into total minutes from midnight.
 */
function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Determine the live status of a slot based on current Bangkok time.
 */
function getSlotStatus(
  assignmentDate: Date,
  startTime: string,
  endTime: string,
  assignmentStatus: string,
  artistId: string | null,
  specialEvent: string | null
): string {
  if (!artistId && !specialEvent) return 'empty';
  if (assignmentStatus === 'CANCELLED') return 'cancelled';
  if (assignmentStatus === 'NO_SHOW') return 'no_show';
  if (assignmentStatus === 'COMPLETED') return 'completed';

  // Calculate Bangkok "now"
  const now = new Date();
  const bangkokNow = new Date(now.getTime() + BANGKOK_OFFSET_MS);

  // Build start/end datetimes from the assignment date + time strings
  const startMins = timeToMinutes(startTime);
  const endMins = timeToMinutes(endTime);

  const startDT = new Date(assignmentDate);
  startDT.setHours(Math.floor(startMins / 60), startMins % 60, 0, 0);

  const endDT = new Date(assignmentDate);
  endDT.setHours(Math.floor(endMins / 60), endMins % 60, 0, 0);
  // Overnight: if end time is before start time (e.g., 02:00 end for a 21:00 start)
  if (endMins <= startMins) {
    endDT.setDate(endDT.getDate() + 1);
  }

  if (bangkokNow < startDT) return 'upcoming';
  if (bangkokNow >= startDT && bangkokNow < endDT) return 'active';
  return 'completed';
}

/**
 * GET /api/admin/tonight
 *
 * Returns all venue assignments for a given date (defaults to today in Bangkok
 * timezone), organized by venue with status indicators and summary alerts.
 *
 * Query params:
 *   date — ISO date string (YYYY-MM-DD), defaults to Bangkok today
 */
export async function GET(req: NextRequest) {
  try {
    if (!(await isAuthorized(req))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Determine target date
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get('date');

    let targetDate: Date;
    if (dateParam) {
      // Parse as local date (no timezone shift)
      const [y, m, d] = dateParam.split('-').map(Number);
      targetDate = new Date(Date.UTC(y, m - 1, d));
    } else {
      targetDate = getBangkokToday();
      // getBangkokToday returns a local-shifted Date — normalize to UTC midnight
      const y = targetDate.getFullYear();
      const m = targetDate.getMonth();
      const d = targetDate.getDate();
      targetDate = new Date(Date.UTC(y, m, d));
    }

    const dateStr = targetDate.toISOString().split('T')[0];

    // Fetch all active venues
    const venues = await prisma.venue.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
      },
    });

    // Fetch assignments for the target date
    const assignments = await prisma.venueAssignment.findMany({
      where: {
        date: targetDate,
      },
      orderBy: [{ startTime: 'asc' }],
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
            genres: true,
          },
        },
        feedback: {
          select: {
            id: true,
            overallRating: true,
            notes: true,
            crowdLevel: true,
          },
        },
      },
    });

    // Build a map of venueId → assignments
    const venueAssignmentMap = new Map<string, typeof assignments>();
    for (const a of assignments) {
      const list = venueAssignmentMap.get(a.venueId) || [];
      list.push(a);
      venueAssignmentMap.set(a.venueId, list);
    }

    // Build response
    const alerts: string[] = [];
    let totalSlots = 0;
    let filled = 0;
    let empty = 0;
    let specialEvents = 0;

    const venueResults = venues.map((venue) => {
      const venueAssignments = venueAssignmentMap.get(venue.id) || [];

      // If no assignments at all for this venue, it's an empty slot
      if (venueAssignments.length === 0) {
        totalSlots++;
        empty++;
        alerts.push(`${venue.name}: No assignment tonight`);
        return {
          venueId: venue.id,
          venueName: venue.name,
          slots: [] as any[],
        };
      }

      const slots = venueAssignments.map((a) => {
        totalSlots++;

        const slotStatus = getSlotStatus(
          a.date,
          a.startTime,
          a.endTime,
          a.status,
          a.artistId,
          a.specialEvent
        );

        if (a.specialEvent) {
          specialEvents++;
        } else if (a.artistId) {
          filled++;
        } else {
          empty++;
          alerts.push(`${venue.name}: Empty slot (${a.startTime}-${a.endTime})`);
        }

        // Alert on problematic statuses
        if (a.status === 'NO_SHOW') {
          alerts.push(`${venue.name}: NO SHOW — ${a.artist?.stageName || 'Unknown DJ'}`);
        } else if (a.status === 'CANCELLED') {
          alerts.push(`${venue.name}: CANCELLED — ${a.artist?.stageName || 'slot'} (${a.startTime}-${a.endTime})`);
        }

        return {
          assignmentId: a.id,
          slot: a.slot,
          startTime: a.startTime,
          endTime: a.endTime,
          status: a.status,
          slotStatus,
          artist: a.artist
            ? {
                id: a.artist.id,
                stageName: a.artist.stageName,
                profileImage: a.artist.profileImage,
                genres: a.artist.genres,
              }
            : null,
          specialEvent: a.specialEvent,
          feedback: a.feedback
            ? {
                id: a.feedback.id,
                overallRating: a.feedback.overallRating,
                notes: a.feedback.notes,
                crowdLevel: a.feedback.crowdLevel,
              }
            : null,
        };
      });

      return {
        venueId: venue.id,
        venueName: venue.name,
        slots,
      };
    });

    const response = NextResponse.json({
      date: dateStr,
      venues: venueResults,
      summary: {
        totalSlots,
        filled,
        empty,
        specialEvents,
        alerts,
      },
    });
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    return response;
  } catch (error) {
    console.error('Error fetching tonight dashboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tonight dashboard' },
      { status: 500 }
    );
  }
}
