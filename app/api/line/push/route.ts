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
import { pushFlexMessage, pushTextMessage, buildDJRatingFlex, buildGroupScheduleFlex } from '@/lib/line';
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

  // Find today's assignments with venue lineGroupId
  const assignments = await prisma.venueAssignment.findMany({
    where: {
      date: { gte: dateStart, lt: dateEnd },
      artistId: { not: null },
      status: 'SCHEDULED',
    },
    include: {
      venue: { select: { id: true, name: true, lineGroupId: true } },
      artist: { select: { id: true, stageName: true } },
    },
  });

  // Group assignments by lineGroupId (multiple venues can share one group)
  const groupMap = new Map<
    string,
    Array<{ venueName: string; djName: string; startTime: string; endTime: string }>
  >();

  let skipped = 0;
  for (const assignment of assignments) {
    const groupId = assignment.venue.lineGroupId;
    if (!groupId) {
      skipped++;
      continue;
    }
    if (!assignment.artist) {
      skipped++;
      continue;
    }

    if (!groupMap.has(groupId)) {
      groupMap.set(groupId, []);
    }
    groupMap.get(groupId)!.push({
      venueName: assignment.venue.name,
      djName: assignment.artist.stageName,
      startTime: assignment.startTime,
      endTime: assignment.endTime,
    });
  }

  let sent = 0;
  const errors: string[] = [];
  const dateStr = formatDate(dateStart);

  // Send one combined message per LINE group
  for (const [groupId, slots] of groupMap) {
    // Group slots by venue for the Flex Message
    const venueMap = new Map<string, Array<{ djName: string; startTime: string; endTime: string }>>();
    for (const slot of slots) {
      if (!venueMap.has(slot.venueName)) {
        venueMap.set(slot.venueName, []);
      }
      venueMap.get(slot.venueName)!.push({
        djName: slot.djName,
        startTime: slot.startTime,
        endTime: slot.endTime,
      });
    }

    const venues = Array.from(venueMap.entries()).map(([venueName, venueSlots]) => ({
      venueName,
      slots: venueSlots,
    }));

    try {
      await pushFlexMessage(
        groupId,
        `Tonight's DJ Schedule - ${dateStr}`,
        buildGroupScheduleFlex({ date: dateStr, venues }),
      );
      sent++;
    } catch (err: any) {
      errors.push(`group ${groupId}: ${err.message}`);
    }
  }

  return NextResponse.json({
    date: targetDate,
    total: assignments.length,
    sent,
    skipped,
    groups: groupMap.size,
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
