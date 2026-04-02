import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

const querySchema = z.object({
  assignmentId: z.string().nullish(),
  venueId: z.string().nullish(),
  date: z.string().nullish(),
  slot: z.string().nullish(),
});

// Venue genre preferences — what style works at each venue
const VENUE_GENRE_PREFERENCES: Record<string, string[]> = {
  'NOBU': ['Deep House', 'Lounge', 'Nu Disco', 'Downtempo', 'Chill'],
  'Le Du Kaan': ['Deep House', 'Lounge', 'Nu Disco', 'Eclectic', 'Downtempo'],
  'LDK': ['Deep House', 'Lounge', 'Nu Disco', 'Eclectic', 'Downtempo'],
  'CRU': ['Deep House', 'Lounge', 'Downtempo', 'Chill', 'Nu Disco'],
  'Cocoa XO': ['Soulful', 'Deep House', 'Lounge', 'R&B', 'Downtempo'],
  'Horizon': ['R&B', 'Hip-Hop', 'Hip Hop', 'Afrobeats', 'Dancehall', 'Open Format'],
  'ABar': ['House', 'Tech House', 'Deep House', 'Nu Disco', 'Dance'],
};

/**
 * Normalize a time string to minutes from midnight.
 * Handles overnight shifts: times before 12:00 after a start time >= 12:00
 * are treated as next-day (add 24h).
 */
function timeToMinutes(time: string, isEnd: boolean = false, startMinutes?: number): number {
  const [h, m] = time.split(':').map(Number);
  let mins = h * 60 + m;
  // For end times: if it's before noon and the start is after noon, it's overnight
  if (isEnd && startMinutes !== undefined && mins < startMinutes && h < 12) {
    mins += 24 * 60;
  }
  return mins;
}

/**
 * Check if two time ranges overlap.
 * Handles overnight shifts (e.g., 21:00-01:00).
 */
function timesOverlap(
  startA: string, endA: string,
  startB: string, endB: string,
): boolean {
  const sA = timeToMinutes(startA);
  const eA = timeToMinutes(endA, true, sA);
  const sB = timeToMinutes(startB);
  const eB = timeToMinutes(endB, true, sB);
  return sA < eB && sB < eA;
}

/**
 * Score genre match between a DJ's genres and venue preferences.
 * Returns 0-30 points.
 */
function scoreGenreMatch(djGenres: string[], venueGenres: string[]): number {
  if (djGenres.length === 0 || venueGenres.length === 0) return 15; // neutral

  const normalize = (g: string) => g.toLowerCase().trim();
  const djNorm = djGenres.map(normalize);
  const venueNorm = venueGenres.map(normalize);

  const matches = djNorm.filter(g => venueNorm.some(vg =>
    vg.includes(g) || g.includes(vg)
  ));

  const ratio = matches.length / Math.min(djNorm.length, venueNorm.length);
  return Math.round(ratio * 30);
}

/**
 * GET /api/admin/substitution
 *
 * Find ranked replacement DJ candidates for a venue assignment gap.
 * Accepts either assignmentId OR (venueId + date + slot).
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const params = querySchema.parse({
      assignmentId: searchParams.get('assignmentId'),
      venueId: searchParams.get('venueId'),
      date: searchParams.get('date'),
      slot: searchParams.get('slot'),
    });

    // Resolve the gap — either from an existing assignment or from params
    let venue: { id: string; name: string } | null = null;
    let gapDate: Date;
    let gapSlot: string | null = null;
    let gapStartTime: string;
    let gapEndTime: string;
    let assignmentId: string | null = null;

    if (params.assignmentId) {
      const assignment = await prisma.venueAssignment.findUnique({
        where: { id: params.assignmentId },
        include: { venue: { select: { id: true, name: true } } },
      });

      if (!assignment) {
        return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
      }

      venue = assignment.venue;
      gapDate = assignment.date;
      gapSlot = assignment.slot;
      gapStartTime = assignment.startTime;
      gapEndTime = assignment.endTime;
      assignmentId = assignment.id;
    } else if (params.venueId && params.date) {
      const venueRecord = await prisma.venue.findUnique({
        where: { id: params.venueId },
        select: { id: true, name: true, operatingHours: true },
      });

      if (!venueRecord) {
        return NextResponse.json({ error: 'Venue not found' }, { status: 404 });
      }

      venue = venueRecord;
      gapDate = new Date(params.date);
      gapSlot = params.slot || null;

      // Try to find an existing assignment for this venue/date/slot
      const existing = await prisma.venueAssignment.findFirst({
        where: {
          venueId: params.venueId,
          date: gapDate,
          slot: gapSlot,
        },
      });

      if (existing) {
        gapStartTime = existing.startTime;
        gapEndTime = existing.endTime;
        assignmentId = existing.id;
      } else {
        // Use venue operating hours as fallback
        const hours = venueRecord.operatingHours as { startTime?: string; endTime?: string } | null;
        gapStartTime = hours?.startTime || '20:00';
        gapEndTime = hours?.endTime || '01:00';
      }
    } else {
      return NextResponse.json(
        { error: 'Provide either assignmentId or venueId + date' },
        { status: 400 },
      );
    }

    // Format date for queries
    const dateStr = gapDate.toISOString().split('T')[0];

    // Determine venue genre preferences
    // First check static map, then fall back to historical data
    let venueGenres = VENUE_GENRE_PREFERENCES[venue.name] || [];

    if (venueGenres.length === 0) {
      // Look at past assignments to determine what genres this venue books
      const pastAssignments = await prisma.venueAssignment.findMany({
        where: {
          venueId: venue.id,
          artistId: { not: null },
        },
        include: {
          artist: { select: { genres: true } },
        },
        orderBy: { date: 'desc' },
        take: 50,
      });

      const genreCounts: Record<string, number> = {};
      for (const a of pastAssignments) {
        if (a.artist?.genres) {
          for (const g of a.artist.genres) {
            genreCounts[g] = (genreCounts[g] || 0) + 1;
          }
        }
      }

      venueGenres = Object.entries(genreCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([g]) => g);
    }

    // Get all DJs
    const allDjs = await prisma.artist.findMany({
      where: { category: 'DJ' },
      select: {
        id: true,
        stageName: true,
        genres: true,
        profileImage: true,
      },
    });

    // Get blackout dates for the target date (all artists)
    const blackouts = await prisma.blackoutDate.findMany({
      where: {
        startDate: { lte: gapDate },
        endDate: { gte: gapDate },
      },
      select: { artistId: true },
    });
    const blackedOutArtistIds = new Set(blackouts.map(b => b.artistId));

    // Get all assignments on the same date to check conflicts
    const sameDayAssignments = await prisma.venueAssignment.findMany({
      where: {
        date: gapDate,
        artistId: { not: null },
        status: { not: 'CANCELLED' },
      },
      select: {
        artistId: true,
        startTime: true,
        endTime: true,
        venueId: true,
      },
    });

    // Get venue history for all DJs at this venue
    const venueHistory = await prisma.venueAssignment.findMany({
      where: {
        venueId: venue.id,
        artistId: { not: null },
        status: { in: ['COMPLETED', 'SCHEDULED'] },
      },
      select: {
        artistId: true,
        date: true,
      },
      orderBy: { date: 'desc' },
    });

    // Build venue history map: artistId -> { count, lastDate }
    const venueHistoryMap: Record<string, { count: number; lastDate: Date }> = {};
    for (const vh of venueHistory) {
      if (!vh.artistId) continue;
      if (!venueHistoryMap[vh.artistId]) {
        venueHistoryMap[vh.artistId] = { count: 0, lastDate: vh.date };
      }
      venueHistoryMap[vh.artistId].count++;
      if (vh.date > venueHistoryMap[vh.artistId].lastDate) {
        venueHistoryMap[vh.artistId].lastDate = vh.date;
      }
    }

    // Get average ratings for all DJs
    const feedbackAgg = await prisma.venueFeedback.groupBy({
      by: ['artistId'],
      _avg: { overallRating: true },
      _count: { overallRating: true },
    });
    const ratingMap: Record<string, { avg: number; count: number }> = {};
    for (const f of feedbackAgg) {
      ratingMap[f.artistId] = {
        avg: f._avg.overallRating || 0,
        count: f._count.overallRating,
      };
    }

    // Score each DJ
    type Candidate = {
      artistId: string;
      stageName: string;
      genres: string[];
      score: number;
      breakdown: {
        genreMatch: number;
        venueHistory: number;
        rating: number;
        availability: number;
        noConflict: number;
      };
      averageRating: number | null;
      lastPlayedHere: string | null;
      profileImage: string | null;
    };

    const candidates: Candidate[] = [];

    for (const dj of allDjs) {
      // Skip DJs on blackout
      if (blackedOutArtistIds.has(dj.id)) continue;

      // Check for time conflicts on the same day
      const djSameDaySlots = sameDayAssignments.filter(a => a.artistId === dj.id);
      const hasConflict = djSameDaySlots.some(a =>
        timesOverlap(a.startTime, a.endTime, gapStartTime, gapEndTime)
      );

      // If the DJ has a direct time conflict, exclude them
      if (hasConflict) continue;

      // Genre match (0-30)
      const genreMatch = scoreGenreMatch(dj.genres, venueGenres);

      // Venue history (0-25)
      let venueHistoryScore = 0;
      const history = venueHistoryMap[dj.id];
      if (history) {
        // Base: played here before (10 points)
        venueHistoryScore = 10;

        // Recency bonus (up to 10 points): more recent = higher
        const daysSinceLastPlay = Math.floor(
          (gapDate.getTime() - history.lastDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysSinceLastPlay <= 7) venueHistoryScore += 10;
        else if (daysSinceLastPlay <= 14) venueHistoryScore += 8;
        else if (daysSinceLastPlay <= 30) venueHistoryScore += 6;
        else if (daysSinceLastPlay <= 60) venueHistoryScore += 4;
        else venueHistoryScore += 2;

        // Frequency bonus (up to 5 points)
        venueHistoryScore += Math.min(history.count, 5);
      }

      // Rating (0-15)
      let ratingScore = 7.5; // neutral default
      let averageRating: number | null = null;
      const djRating = ratingMap[dj.id];
      if (djRating && djRating.count > 0) {
        averageRating = Math.round(djRating.avg * 10) / 10;
        // Scale: 1-5 rating maps to 0-15 points
        ratingScore = (djRating.avg / 5) * 15;
      }

      // Availability (20 points) — already confirmed not blacked out
      const availabilityScore = 20;

      // No conflict (10 points) — already confirmed no overlap
      // But penalize slightly if DJ has other gigs that day (fatigue factor)
      let noConflictScore = 10;
      if (djSameDaySlots.length > 0) {
        noConflictScore = 5; // Has non-overlapping gigs, partial score
      }

      const totalScore = Math.round(
        genreMatch + venueHistoryScore + ratingScore + availabilityScore + noConflictScore
      );

      candidates.push({
        artistId: dj.id,
        stageName: dj.stageName,
        genres: dj.genres,
        score: totalScore,
        breakdown: {
          genreMatch,
          venueHistory: venueHistoryScore,
          rating: Math.round(ratingScore * 10) / 10,
          availability: availabilityScore,
          noConflict: noConflictScore,
        },
        averageRating,
        lastPlayedHere: history ? history.lastDate.toISOString().split('T')[0] : null,
        profileImage: dj.profileImage || null,
      });
    }

    // Sort by score descending
    candidates.sort((a, b) => b.score - a.score);

    return NextResponse.json({
      gap: {
        assignmentId,
        venue: venue.name,
        venueId: venue.id,
        date: dateStr,
        slot: gapSlot,
        startTime: gapStartTime,
        endTime: gapEndTime,
      },
      candidates,
      totalCandidates: candidates.length,
    });
  } catch (error) {
    console.error('Error finding substitution candidates:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: error.issues },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: 'Failed to find substitution candidates' },
      { status: 500 },
    );
  }
}
