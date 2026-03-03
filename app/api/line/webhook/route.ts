/**
 * LINE Messaging API Webhook
 *
 * Receives events from LINE:
 *   - follow:   User adds the bot (no action — account linking disabled)
 *   - postback: User taps a button (star rating, skip, notes prompt)
 *   - message:  User sends text (feedback notes only)
 *
 * Webhook URL to configure in LINE Developers Console:
 *   https://brightears.io/api/line/webhook
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  verifySignature,
  replyMessage,
  pushFlexMessage,
  pushTextMessage,
  buildRatingConfirmFlex,
} from '@/lib/line';

// Admin LINE userId (hardcoded — only admin receives DMs)
const ADMIN_LINE_USER_ID = 'Ue15ee59be451bbc916f46d53b86b8eec';

// Conversation state stored in-memory (fine for small scale).
// Maps LINE userId → pending action context.
const conversationState = new Map<
  string,
  {
    action: 'awaiting_notes';
    assignmentId?: string;
    rating?: number;
    expiresAt: number;
  }
>();

// Clean up expired states every 10 minutes
function cleanExpiredStates() {
  const now = Date.now();
  for (const [key, state] of conversationState) {
    if (state.expiresAt < now) {
      conversationState.delete(key);
    }
  }
}
setInterval(cleanExpiredStates, 10 * 60 * 1000);

// ---------------------------------------------------------------------------
// Webhook handler
// ---------------------------------------------------------------------------

export async function POST(req: Request) {
  const signature = req.headers.get('x-line-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
  }

  const body = await req.text();

  // Verify webhook authenticity
  if (!verifySignature(body, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
  }

  // Return 200 quickly — process events asynchronously
  const { events } = JSON.parse(body);

  // Process events (don't await — return 200 immediately)
  processEvents(events).catch((err) => {
    console.error('[LINE Webhook] Error processing events:', err);
  });

  return NextResponse.json({ received: true });
}

// LINE webhook verification (GET request from LINE to verify endpoint)
export async function GET() {
  return NextResponse.json({ status: 'ok' });
}

// ---------------------------------------------------------------------------
// Event processors
// ---------------------------------------------------------------------------

async function processEvents(events: any[]) {
  for (const event of events) {
    try {
      switch (event.type) {
        case 'follow':
          await handleFollow(event);
          break;
        case 'postback':
          await handlePostback(event);
          break;
        case 'message':
          // Only respond to text messages in 1:1 chats, not in groups
          if (event.message.type === 'text' && event.source.type === 'user') {
            await handleTextMessage(event);
          }
          break;
        case 'join':
          await handleJoin(event);
          break;
        default:
          break;
      }
    } catch (err) {
      console.error(`[LINE Webhook] Error handling ${event.type}:`, err);
    }
  }
}

// ---------------------------------------------------------------------------
// Follow: New user adds the bot
// ---------------------------------------------------------------------------

async function handleFollow(event: any) {
  // No account linking — admin LINE is hardcoded
  await replyMessage(event.replyToken, [
    {
      type: 'text',
      text: `Welcome to Bright Ears! 🎧`,
    },
  ]);
}

// ---------------------------------------------------------------------------
// Postback: Button taps (ratings, skip, notes prompt)
// ---------------------------------------------------------------------------

async function handlePostback(event: any) {
  const lineUserId = event.source.userId;
  const groupId = event.source.groupId;
  const isGroupEvent = event.source.type === 'group' && !!groupId;

  const data = new URLSearchParams(event.postback.data);
  const action = data.get('action');
  const assignmentId = data.get('assignmentId');

  // Group postbacks: verify via manager group, no account linking needed
  if (isGroupEvent) {
    await handleGroupPostback(event, groupId, action, assignmentId, lineUserId);
    return;
  }

  // --- 1:1 postbacks below (existing flow) ---

  // Find linked user
  const user = await prisma.user.findUnique({
    where: { lineUserId },
    include: { corporate: true },
  });

  if (!user || !user.corporate) {
    await replyMessage(event.replyToken, [
      {
        type: 'text',
        text: 'Your LINE account is not linked to a Bright Ears venue. Please contact support.',
      },
    ]);
    return;
  }

  switch (action) {
    case 'rate': {
      const rating = parseInt(data.get('rating') || '0', 10);
      if (!assignmentId || rating < 1 || rating > 5) {
        await replyMessage(event.replyToken, [
          { type: 'text', text: 'Invalid rating. Please try again.' },
        ]);
        return;
      }
      await submitRating(event, user, assignmentId, rating);
      break;
    }

    case 'notes_prompt': {
      if (!assignmentId) return;
      // Set state to capture next text message as notes
      conversationState.set(lineUserId, {
        action: 'awaiting_notes',
        assignmentId,
        expiresAt: Date.now() + 30 * 60 * 1000,
      });
      await replyMessage(event.replyToken, [
        {
          type: 'text',
          text: 'Please type your feedback notes for this DJ:',
        },
      ]);
      break;
    }

    case 'skip': {
      await replyMessage(event.replyToken, [
        { type: 'text', text: 'Skipped. You can still rate this DJ on the venue portal.' },
      ]);
      break;
    }

    default:
      break;
  }
}

// ---------------------------------------------------------------------------
// Group postback: Rating from a manager group (no account linking needed)
// ---------------------------------------------------------------------------

async function handleGroupPostback(
  event: any,
  groupId: string,
  action: string | null,
  assignmentId: string | null,
  tapperLineUserId: string,
) {
  // Verify this group is linked as a manager group
  const venue = await prisma.venue.findFirst({
    where: { lineManagerGroupId: groupId },
    select: { id: true, name: true },
  });

  if (!venue) {
    // Not a linked manager group — ignore silently
    return;
  }

  switch (action) {
    case 'rate': {
      const data = new URLSearchParams(event.postback.data);
      const rating = parseInt(data.get('rating') || '0', 10);
      if (!assignmentId || rating < 1 || rating > 5) {
        await replyMessage(event.replyToken, [
          { type: 'text', text: 'Invalid rating. Please try again.' },
        ]);
        return;
      }
      await submitGroupRating(event, venue, assignmentId, rating, tapperLineUserId, groupId);
      break;
    }

    case 'notes_prompt': {
      await replyMessage(event.replyToken, [
        { type: 'text', text: 'To add notes, visit the venue portal.' },
      ]);
      break;
    }

    case 'skip': {
      await replyMessage(event.replyToken, [
        { type: 'text', text: 'Skipped. You can still rate this DJ on the venue portal.' },
      ]);
      break;
    }

    default:
      break;
  }
}

async function submitGroupRating(
  event: any,
  venue: { id: string; name: string },
  assignmentId: string,
  rating: number,
  tapperLineUserId: string,
  groupId: string,
) {
  const assignment = await prisma.venueAssignment.findUnique({
    where: { id: assignmentId },
    include: {
      venue: { select: { id: true, name: true } },
      artist: { select: { id: true, stageName: true } },
      feedback: { select: { id: true } },
    },
  });

  if (!assignment) {
    await replyMessage(event.replyToken, [
      { type: 'text', text: 'Assignment not found.' },
    ]);
    return;
  }

  // Verify assignment belongs to the venue linked to this manager group
  if (assignment.venue.id !== venue.id) {
    await replyMessage(event.replyToken, [
      { type: 'text', text: 'This assignment is not for your venue.' },
    ]);
    return;
  }

  if (assignment.feedback) {
    await replyMessage(event.replyToken, [
      { type: 'text', text: 'Feedback already submitted for this performance.' },
    ]);
    return;
  }

  if (!assignment.artistId || !assignment.artist) {
    await replyMessage(event.replyToken, [
      { type: 'text', text: 'Cannot rate special events (no DJ assigned).' },
    ]);
    return;
  }

  // Resolve submittedBy: try tapper's User record, fallback to group identifier
  let submittedBy = `line-group-${groupId}`;
  const tapperUser = await prisma.user.findUnique({
    where: { lineUserId: tapperLineUserId },
    select: { id: true },
  });
  if (tapperUser) {
    submittedBy = tapperUser.id;
  }

  await prisma.venueFeedback.create({
    data: {
      assignmentId,
      venueId: venue.id,
      artistId: assignment.artistId,
      submittedBy,
      overallRating: rating,
    },
  });

  if (assignment.status !== 'COMPLETED') {
    await prisma.venueAssignment.update({
      where: { id: assignmentId },
      data: { status: 'COMPLETED' },
    });
  }

  await replyMessage(event.replyToken, [
    {
      type: 'flex',
      altText: `Rated ${assignment.artist.stageName}: ${'⭐'.repeat(rating)}`,
      contents: buildRatingConfirmFlex({
        djName: assignment.artist.stageName,
        rating,
      }),
    } as any,
  ]);
}

// ---------------------------------------------------------------------------
// Text message: Notes or account linking email
// ---------------------------------------------------------------------------

async function handleTextMessage(event: any) {
  const lineUserId = event.source.userId;
  const text = event.message.text.trim();
  const state = conversationState.get(lineUserId);

  // Handle pending notes
  if (state?.action === 'awaiting_notes' && state.assignmentId) {
    conversationState.delete(lineUserId);
    await submitNotesForAssignment(event, lineUserId, state.assignmentId, text);
    return;
  }

  // Ignore other messages — bot stays silent unless handling a specific flow
}

// ---------------------------------------------------------------------------
// Business logic
// ---------------------------------------------------------------------------

async function submitRating(
  event: any,
  user: any,
  assignmentId: string,
  rating: number,
) {
  // Check assignment exists and belongs to user's venues
  const assignment = await prisma.venueAssignment.findUnique({
    where: { id: assignmentId },
    include: {
      venue: { select: { id: true, name: true, corporateId: true } },
      artist: { select: { id: true, stageName: true } },
      feedback: { select: { id: true } },
    },
  });

  if (!assignment) {
    await replyMessage(event.replyToken, [
      { type: 'text', text: 'Assignment not found.' },
    ]);
    return;
  }

  if (assignment.venue.corporateId !== user.corporate.id) {
    await replyMessage(event.replyToken, [
      { type: 'text', text: 'This assignment is not for your venue.' },
    ]);
    return;
  }

  if (assignment.feedback) {
    await replyMessage(event.replyToken, [
      { type: 'text', text: 'Feedback already submitted for this performance.' },
    ]);
    return;
  }

  if (!assignment.artistId || !assignment.artist) {
    await replyMessage(event.replyToken, [
      { type: 'text', text: 'Cannot rate special events (no DJ assigned).' },
    ]);
    return;
  }

  // Create feedback
  await prisma.venueFeedback.create({
    data: {
      assignmentId,
      venueId: assignment.venue.id,
      artistId: assignment.artistId,
      submittedBy: user.id,
      overallRating: rating,
    },
  });

  // Mark assignment as completed
  if (assignment.status !== 'COMPLETED') {
    await prisma.venueAssignment.update({
      where: { id: assignmentId },
      data: { status: 'COMPLETED' },
    });
  }

  // Confirm
  await replyMessage(event.replyToken, [
    {
      type: 'flex',
      altText: `Rated ${assignment.artist.stageName}: ${'⭐'.repeat(rating)}`,
      contents: buildRatingConfirmFlex({
        djName: assignment.artist.stageName,
        rating,
      }),
    } as any,
  ]);
}

async function submitNotesForAssignment(
  event: any,
  lineUserId: string,
  assignmentId: string,
  notes: string,
) {
  // Find feedback for this assignment
  const feedback = await prisma.venueFeedback.findUnique({
    where: { assignmentId },
    include: { artist: { select: { stageName: true } } },
  });

  if (feedback) {
    // Update existing feedback with notes
    await prisma.venueFeedback.update({
      where: { id: feedback.id },
      data: { notes },
    });
    await replyMessage(event.replyToken, [
      {
        type: 'text',
        text: `Notes added for ${feedback.artist.stageName}. Thank you!`,
      },
    ]);
  } else {
    // No feedback yet — prompt to rate first
    await replyMessage(event.replyToken, [
      {
        type: 'text',
        text: 'Please rate the DJ first by tapping a star rating, then you can add notes.',
      },
    ]);
  }
}


// ---------------------------------------------------------------------------
// Join: Bot added to a group chat
// ---------------------------------------------------------------------------

async function handleJoin(event: any) {
  const groupId = event.source.groupId;
  if (!groupId) return;

  console.log(`[LINE Webhook] Bot joined group: ${groupId}`);

  // Clean greeting in the group
  await replyMessage(event.replyToken, [
    {
      type: 'text',
      text: `Bright Ears connected! 🎧`,
    },
  ]);

  // DM the Group ID to admin
  await pushTextMessage(
    ADMIN_LINE_USER_ID,
    `New group joined!\n\nGroup ID:\n${groupId}\n\nPaste this in admin → LINE Group Links (DJ Group or Manager Group).`
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

