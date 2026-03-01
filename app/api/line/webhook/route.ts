/**
 * LINE Messaging API Webhook
 *
 * Receives events from LINE:
 *   - follow:   User adds the bot → send welcome + link prompt
 *   - postback: User taps a button (star rating, skip, notes prompt)
 *   - message:  User sends text (feedback notes, account linking email)
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
  buildWelcomeFlex,
  buildRatingConfirmFlex,
} from '@/lib/line';

// Conversation state stored in-memory (fine for small scale).
// Maps LINE userId → pending action context.
const conversationState = new Map<
  string,
  {
    action: 'awaiting_notes' | 'awaiting_email';
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
  const lineUserId = event.source.userId;

  // Check if this LINE user is already linked
  const existingUser = await prisma.user.findUnique({
    where: { lineUserId },
  });

  if (existingUser) {
    await replyMessage(event.replyToken, [
      {
        type: 'text',
        text: `Welcome back! Your account (${existingUser.email}) is already linked.`,
      },
    ]);
    return;
  }

  // Prompt to link account
  const linkUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://brightears.io'}/api/line/link?lineUserId=${lineUserId}`;

  await replyMessage(event.replyToken, [
    {
      type: 'flex',
      altText: 'Welcome to Bright Ears - Link your account',
      contents: buildWelcomeFlex(linkUrl),
    } as any,
  ]);
}

// ---------------------------------------------------------------------------
// Postback: Button taps (ratings, skip, notes prompt)
// ---------------------------------------------------------------------------

async function handlePostback(event: any) {
  const lineUserId = event.source.userId;
  const data = new URLSearchParams(event.postback.data);
  const action = data.get('action');
  const assignmentId = data.get('assignmentId');

  // Find linked user
  const user = await prisma.user.findUnique({
    where: { lineUserId },
    include: { corporate: true },
  });

  if (!user || !user.corporate) {
    await replyMessage(event.replyToken, [
      {
        type: 'text',
        text: 'Please link your Bright Ears account first. Type your account email to get started.',
      },
    ]);
    conversationState.set(lineUserId, {
      action: 'awaiting_email',
      expiresAt: Date.now() + 30 * 60 * 1000, // 30 min
    });
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

  // Handle account linking via email
  if (state?.action === 'awaiting_email' || looksLikeEmail(text)) {
    conversationState.delete(lineUserId);
    await linkAccountByEmail(event, lineUserId, text.toLowerCase());
    return;
  }

  // Default response
  await replyMessage(event.replyToken, [
    {
      type: 'text',
      text: 'Hi! I handle DJ feedback and schedule notifications. If you need to link your account, type your Bright Ears email.',
    },
  ]);
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

async function linkAccountByEmail(
  event: any,
  lineUserId: string,
  email: string,
) {
  if (!looksLikeEmail(email)) {
    await replyMessage(event.replyToken, [
      { type: 'text', text: 'That doesn\'t look like an email. Please type your Bright Ears account email.' },
    ]);
    return;
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { corporate: true },
  });

  if (!user) {
    await replyMessage(event.replyToken, [
      {
        type: 'text',
        text: `No Bright Ears account found for ${email}. Please check the email and try again.`,
      },
    ]);
    return;
  }

  // Check if already linked to a different LINE user
  if (user.lineUserId && user.lineUserId !== lineUserId) {
    await replyMessage(event.replyToken, [
      {
        type: 'text',
        text: 'This account is already linked to a different LINE user. Please contact support.',
      },
    ]);
    return;
  }

  // Link the account
  await prisma.user.update({
    where: { id: user.id },
    data: {
      lineUserId,
      lineLinkedAt: new Date(),
    },
  });

  const roleName = user.corporate ? 'Venue Manager' : 'User';
  await replyMessage(event.replyToken, [
    {
      type: 'text',
      text: `Account linked! ${roleName} account (${email}) is now connected. You'll receive DJ feedback requests and schedule updates here.`,
    },
  ]);
}

// ---------------------------------------------------------------------------
// Join: Bot added to a group chat
// ---------------------------------------------------------------------------

async function handleJoin(event: any) {
  const groupId = event.source.groupId;
  if (!groupId) return;

  console.log(`[LINE Webhook] Bot joined group: ${groupId}`);

  // Send the group ID in the chat so admin can copy it
  await replyMessage(event.replyToken, [
    {
      type: 'text',
      text: `Bright Ears bot connected!\n\nGroup ID: ${groupId}\n\nUse this ID to link this group to a venue in the admin portal.`,
    },
  ]);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function looksLikeEmail(text: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
}
