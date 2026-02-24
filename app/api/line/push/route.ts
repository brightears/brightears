/**
 * LINE Push Notifications API
 *
 * Endpoints for sending proactive messages:
 *
 * POST /api/line/push
 *   action=feedback_requests  → Send pending feedback requests to venue managers
 *   action=dj_reminder        → Send schedule reminders to DJs playing today
 *   action=broadcast          → Send a message to all linked users (admin only)
 *
 * Protected by a simple API key (LINE_PUSH_API_KEY env var).
 * Can be called by a cron job or from the admin portal.
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { pushFlexMessage, pushTextMessage, buildDJRatingFlex, buildDJReminderFlex } from '@/lib/line';
import { hasShiftEnded, formatDateLocal } from '@/lib/venue-utils';

// ---------------------------------------------------------------------------
// Auth: Simple API key check (for cron jobs / admin calls)
// ---------------------------------------------------------------------------

function isAuthorized(req: Request): boolean {
  const apiKey = process.env.LINE_PUSH_API_KEY;
  if (!apiKey) return false;

  const authHeader = req.headers.get('authorization');
  if (authHeader === `Bearer ${apiKey}`) return true;

  const url = new URL(req.url);
  return url.searchParams.get('key') === apiKey;
}

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { action } = body;

  switch (action) {
    case 'feedback_requests':
      return await sendFeedbackRequests();
    case 'dj_reminder':
      return await sendDJReminders(body);
    case 'broadcast':
      return await sendBroadcast(body);
    default:
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  }
}

// ---------------------------------------------------------------------------
// Send feedback requests to venue managers for completed shifts
// ---------------------------------------------------------------------------

async function sendFeedbackRequests() {
  // Find assignments where:
  // 1. Shift has ended
  // 2. No feedback submitted yet
  // 3. Has a DJ (not special event)
  // 4. Venue manager has LINE linked
  const recentAssignments = await prisma.venueAssignment.findMany({
    where: {
      artistId: { not: null },
      feedback: null, // No feedback yet
      date: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
      },
    },
    include: {
      venue: {
        include: {
          corporate: {
            include: {
              user: {
                select: {
                  id: true,
                  lineUserId: true,
                  email: true,
                },
              },
            },
          },
        },
      },
      artist: {
        select: { id: true, stageName: true },
      },
    },
    orderBy: { date: 'desc' },
  });

  // Filter to only ended shifts
  const pendingFeedback = recentAssignments.filter((a) =>
    hasShiftEnded(a.date, a.endTime),
  );

  let sent = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const assignment of pendingFeedback) {
    const lineUserId = assignment.venue.corporate?.user?.lineUserId;
    if (!lineUserId) {
      skipped++;
      continue;
    }

    if (!assignment.artist) {
      skipped++;
      continue;
    }

    try {
      const dateStr = formatDate(assignment.date);
      await pushFlexMessage(
        lineUserId,
        `Rate ${assignment.artist.stageName}'s performance at ${assignment.venue.name}`,
        buildDJRatingFlex({
          assignmentId: assignment.id,
          djName: assignment.artist.stageName,
          venueName: assignment.venue.name,
          date: dateStr,
          timeSlot: `${assignment.startTime} - ${assignment.endTime}`,
        }),
      );
      sent++;
    } catch (err: any) {
      errors.push(`${assignment.id}: ${err.message}`);
    }
  }

  return NextResponse.json({
    total: pendingFeedback.length,
    sent,
    skipped,
    errors: errors.length > 0 ? errors : undefined,
  });
}

// ---------------------------------------------------------------------------
// Send schedule reminders to DJs playing today
// ---------------------------------------------------------------------------

async function sendDJReminders(body: { date?: string }) {
  // Default to today (Bangkok time)
  const now = new Date();
  const bangkokNow = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  const targetDate = body.date || formatDateLocal(bangkokNow);

  // Parse date
  const [year, month, day] = targetDate.split('-').map(Number);
  const dateStart = new Date(year, month - 1, day);
  const dateEnd = new Date(year, month - 1, day + 1);

  // Find today's assignments with linked DJs
  const assignments = await prisma.venueAssignment.findMany({
    where: {
      date: { gte: dateStart, lt: dateEnd },
      artistId: { not: null },
      status: 'SCHEDULED',
    },
    include: {
      venue: { select: { name: true } },
      artist: {
        include: {
          user: {
            select: { lineUserId: true },
          },
        },
      },
    },
  });

  let sent = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const assignment of assignments) {
    const lineUserId = assignment.artist?.user?.lineUserId;
    if (!lineUserId) {
      skipped++;
      continue;
    }

    try {
      const dateStr = formatDate(assignment.date);
      await pushFlexMessage(
        lineUserId,
        `Schedule reminder: ${assignment.venue.name} tonight`,
        buildDJReminderFlex({
          djName: assignment.artist!.stageName,
          venueName: assignment.venue.name,
          date: dateStr,
          startTime: assignment.startTime,
          endTime: assignment.endTime,
        }),
      );
      sent++;
    } catch (err: any) {
      errors.push(`${assignment.id}: ${err.message}`);
    }
  }

  return NextResponse.json({
    date: targetDate,
    total: assignments.length,
    sent,
    skipped,
    errors: errors.length > 0 ? errors : undefined,
  });
}

// ---------------------------------------------------------------------------
// Broadcast message to all linked users
// ---------------------------------------------------------------------------

async function sendBroadcast(body: { message?: string; role?: string }) {
  const { message, role } = body;
  if (!message) {
    return NextResponse.json({ error: 'message is required' }, { status: 400 });
  }

  const where: any = {
    lineUserId: { not: null },
  };
  if (role) {
    where.role = role;
  }

  const users = await prisma.user.findMany({
    where,
    select: { lineUserId: true },
  });

  let sent = 0;
  const errors: string[] = [];

  for (const user of users) {
    if (!user.lineUserId) continue;
    try {
      await pushTextMessage(user.lineUserId, message);
      sent++;
    } catch (err: any) {
      errors.push(`${user.lineUserId}: ${err.message}`);
    }
  }

  return NextResponse.json({
    total: users.length,
    sent,
    errors: errors.length > 0 ? errors : undefined,
  });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(date: Date): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}`;
}
