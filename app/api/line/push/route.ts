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
import { pushFlexMessage, pushTextMessage, pushTextAndImageMessage, buildDJRatingFlex, buildGroupScheduleFlex } from '@/lib/line';
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
    case 'send_message':
      return await sendDirectMessage(body);
    default:
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  }
}

// ---------------------------------------------------------------------------
// Send feedback requests to venue managers for completed shifts
// ---------------------------------------------------------------------------

async function sendFeedbackRequests() {
  // Calculate the "performance day" in Bangkok timezone.
  // A performance night spans 6pm-6am. If it's past midnight but before
  // 6am Bangkok, we're still in last night's session (use yesterday's date).
  const now = new Date();
  const bangkokNow = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  const bangkokHour = bangkokNow.getUTCHours();
  const performanceDayStart = new Date(Date.UTC(
    bangkokNow.getUTCFullYear(),
    bangkokNow.getUTCMonth(),
    bangkokNow.getUTCDate(),
    0, 0, 0
  ));
  if (bangkokHour < 6) {
    performanceDayStart.setUTCDate(performanceDayStart.getUTCDate() - 1);
  }

  // --- Defense: Expire old backlog to prevent death spiral ---
  // Assignments before the current performance day get marked as "sent"
  // so they never retry or resurface.
  const expiredBacklog = await prisma.venueAssignment.updateMany({
    where: {
      artistId: { not: null },
      feedback: null,
      feedbackRequestSentAt: null,
      date: { lt: performanceDayStart },
    },
    data: { feedbackRequestSentAt: new Date() },
  });
  if (expiredBacklog.count > 0) {
    console.log(`[LINE Push] Expired ${expiredBacklog.count} old backlog assignments (before performance day)`);
  }

  // Find TODAY's assignments where:
  // 1. Shift has ended (checked after query via hasShiftEnded)
  // 2. No feedback submitted yet
  // 3. Has a DJ (not special event)
  // 4. Venue has manager group or manager has LINE linked
  const recentAssignments = await prisma.venueAssignment.findMany({
    where: {
      artistId: { not: null },
      feedback: null, // No feedback yet
      feedbackRequestSentAt: null, // Not already sent
      date: { gte: performanceDayStart }, // Current performance night only
    },
    include: {
      venue: {
        select: {
          id: true,
          name: true,
          lineManagerGroupId: true,
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
  let rateLimited = false;
  const errors: string[] = [];

  for (const assignment of pendingFeedback) {
    // Prefer manager group, fall back to individual LINE user
    const target = assignment.venue.lineManagerGroupId
      || assignment.venue.corporate?.user?.lineUserId
      || null;
    if (!target) {
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
        target,
        `Rate ${assignment.artist.stageName}'s performance at ${assignment.venue.name}`,
        buildDJRatingFlex({
          assignmentId: assignment.id,
          djName: assignment.artist.stageName,
          venueName: assignment.venue.name,
          date: dateStr,
          timeSlot: `${assignment.startTime} - ${assignment.endTime}`,
        }),
      );
      // Mark as sent so it won't be re-sent
      await prisma.venueAssignment.update({
        where: { id: assignment.id },
        data: { feedbackRequestSentAt: new Date() },
      });
      sent++;
      // Throttle to avoid LINE 429 rate limits
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err: any) {
      // Circuit breaker: stop immediately on rate limit
      if (err.status === 429 || err.statusCode === 429) {
        console.error(`[LINE Push] 429 rate limit hit — stopping feedback batch`);
        errors.push(`${assignment.id}: 429 rate limited (circuit breaker triggered)`);
        rateLimited = true;
        break;
      }
      errors.push(`${assignment.id}: ${err.message}`);
    }
  }

  // After sending rating cards, send a Night Report reminder to each target
  // (one per target, not per assignment)
  // Skip entirely if we hit a rate limit during feedback
  let nightReportCount = 0;
  if (!rateLimited) {
    const remindedTargets = new Set<string>();
    for (const assignment of pendingFeedback) {
      const target = assignment.venue.lineManagerGroupId
        || assignment.venue.corporate?.user?.lineUserId
        || null;
      if (!target || remindedTargets.has(target)) continue;
      remindedTargets.add(target);

      try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://brightears.io';
        await pushFlexMessage(
          target,
          'Submit your Night Report on the venue portal',
          {
            type: 'bubble',
            size: 'kilo',
            body: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'text',
                  text: 'Night Report',
                  weight: 'bold',
                  size: 'md',
                  color: '#00bbe4',
                },
                {
                  type: 'text',
                  text: 'Submit your detailed night report (crowd level, peak time, weather & more) on the venue portal.',
                  size: 'sm',
                  color: '#999999',
                  wrap: true,
                  margin: 'md',
                },
              ],
            },
            footer: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'button',
                  action: {
                    type: 'uri',
                    label: 'Open Night Report',
                    uri: `${baseUrl}/venue-portal/feedback`,
                  },
                  style: 'primary',
                  color: '#00bbe4',
                },
              ],
            },
          },
        );
        nightReportCount++;
        // Throttle night report reminders too
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (err: any) {
        // Non-critical — don't fail the whole request
        console.error(`[LINE Push] Night report reminder failed for ${target}:`, err.message);
      }
    }
  } else {
    console.log(`[LINE Push] Skipping night report reminders due to rate limit`);
  }

  return NextResponse.json({
    total: pendingFeedback.length,
    sent,
    skipped,
    nightReportReminders: nightReportCount,
    backlogExpired: expiredBacklog.count,
    rateLimited,
    errors: errors.length > 0 ? errors : undefined,
  });
}

// ---------------------------------------------------------------------------
// Send schedule reminders to DJs and venue managers
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

  // Find today's assignments
  const assignments = await prisma.venueAssignment.findMany({
    where: {
      date: { gte: dateStart, lt: dateEnd },
      artistId: { not: null },
      status: 'SCHEDULED',
    },
    include: {
      venue: { select: { id: true, name: true, lineGroupId: true, lineManagerGroupId: true } },
      artist: { select: { id: true, stageName: true } },
    },
  });

  type SlotInfo = { venueName: string; djName: string; startTime: string; endTime: string };

  // Group assignments by lineGroupId (DJ groups) and lineManagerGroupId (manager groups)
  const djGroupMap = new Map<string, SlotInfo[]>();
  const mgrGroupMap = new Map<string, SlotInfo[]>();

  let skipped = 0;
  for (const assignment of assignments) {
    if (!assignment.artist) {
      skipped++;
      continue;
    }

    const slot: SlotInfo = {
      venueName: assignment.venue.name,
      djName: assignment.artist.stageName,
      startTime: assignment.startTime,
      endTime: assignment.endTime,
    };

    // DJ group
    const djGid = assignment.venue.lineGroupId;
    if (djGid) {
      if (!djGroupMap.has(djGid)) djGroupMap.set(djGid, []);
      djGroupMap.get(djGid)!.push(slot);
    }

    // Manager group
    const mgrGid = assignment.venue.lineManagerGroupId;
    if (mgrGid) {
      if (!mgrGroupMap.has(mgrGid)) mgrGroupMap.set(mgrGid, []);
      mgrGroupMap.get(mgrGid)!.push(slot);
    }

    if (!djGid && !mgrGid) skipped++;
  }

  let sent = 0;
  const errors: string[] = [];
  const dateStr = formatDate(dateStart);
  const sentGroups = new Set<string>();

  // Helper: send schedule flex to a group
  async function sendToGroup(groupId: string, slots: SlotInfo[]) {
    if (sentGroups.has(groupId)) return; // Deduplicate
    sentGroups.add(groupId);

    const venueMap = new Map<string, Array<{ djName: string; startTime: string; endTime: string }>>();
    for (const slot of slots) {
      if (!venueMap.has(slot.venueName)) venueMap.set(slot.venueName, []);
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
      // Throttle to avoid LINE 429 rate limits
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err: any) {
      errors.push(`group ${groupId}: ${err.message}`);
    }
  }

  // Send to DJ groups
  for (const [groupId, slots] of djGroupMap) {
    await sendToGroup(groupId, slots);
  }

  // Send to manager groups
  for (const [groupId, slots] of mgrGroupMap) {
    await sendToGroup(groupId, slots);
  }

  return NextResponse.json({
    date: targetDate,
    total: assignments.length,
    sent,
    skipped,
    djGroups: djGroupMap.size,
    managerGroups: mgrGroupMap.size,
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
// Send a direct message to a LINE group or user (used by Vinyl)
// ---------------------------------------------------------------------------

async function sendDirectMessage(body: { to?: string; text?: string; imageUrl?: string }) {
  const { to, text, imageUrl } = body;
  if (!to || !text) {
    return NextResponse.json({ error: 'Missing "to" or "text"' }, { status: 400 });
  }

  try {
    if (imageUrl) {
      await pushTextAndImageMessage(to, text, imageUrl);
    } else {
      await pushTextMessage(to, text);
    }
    return NextResponse.json({ sent: true, to, imageUrl: imageUrl ?? null });
  } catch (err: any) {
    console.error('[LINE Push] send_message error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to send' }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(date: Date): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}`;
}
