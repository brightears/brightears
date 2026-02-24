/**
 * LINE Messaging API client and message builders.
 *
 * Environment variables required:
 *   LINE_CHANNEL_ACCESS_TOKEN - Long-lived channel access token
 *   LINE_CHANNEL_SECRET       - Channel secret for webhook signature verification
 */

import { messagingApi, validateSignature } from '@line/bot-sdk';

const { MessagingApiClient } = messagingApi;

// ---------------------------------------------------------------------------
// Client singleton
// ---------------------------------------------------------------------------

let _client: InstanceType<typeof MessagingApiClient> | null = null;

export function getLineClient(): InstanceType<typeof MessagingApiClient> {
  if (!_client) {
    const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    if (!token) {
      throw new Error('LINE_CHANNEL_ACCESS_TOKEN is not set');
    }
    _client = new MessagingApiClient({ channelAccessToken: token });
  }
  return _client;
}

export function getChannelSecret(): string {
  const secret = process.env.LINE_CHANNEL_SECRET;
  if (!secret) {
    throw new Error('LINE_CHANNEL_SECRET is not set');
  }
  return secret;
}

// ---------------------------------------------------------------------------
// Signature verification
// ---------------------------------------------------------------------------

export function verifySignature(body: string, signature: string): boolean {
  return validateSignature(body, getChannelSecret(), signature);
}

// ---------------------------------------------------------------------------
// Push helpers
// ---------------------------------------------------------------------------

export async function pushTextMessage(userId: string, text: string) {
  const client = getLineClient();
  await client.pushMessage({
    to: userId,
    messages: [{ type: 'text', text }],
  });
}

export async function pushFlexMessage(
  userId: string,
  altText: string,
  contents: Record<string, unknown>,
) {
  const client = getLineClient();
  await client.pushMessage({
    to: userId,
    messages: [
      {
        type: 'flex',
        altText,
        contents: contents as any,
      },
    ],
  });
}

export async function replyMessage(
  replyToken: string,
  messages: Array<Record<string, unknown>>,
) {
  const client = getLineClient();
  await client.replyMessage({
    replyToken,
    messages: messages as any,
  });
}

// ---------------------------------------------------------------------------
// Flex Message builders
// ---------------------------------------------------------------------------

/**
 * Build a DJ rating request Flex Message.
 * Shows venue, DJ name, date, and 5 star-rating buttons.
 */
export function buildDJRatingFlex(params: {
  assignmentId: string;
  djName: string;
  venueName: string;
  date: string; // e.g. "Feb 24"
  timeSlot: string; // e.g. "21:00 - 01:00"
}): Record<string, unknown> {
  const { assignmentId, djName, venueName, date, timeSlot } = params;

  return {
    type: 'bubble',
    size: 'kilo',
    header: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'text',
          text: 'Rate DJ Performance',
          weight: 'bold',
          size: 'md',
          color: '#00bbe4',
        },
      ],
      paddingBottom: 'none',
    },
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'text',
          text: djName,
          weight: 'bold',
          size: 'lg',
        },
        {
          type: 'text',
          text: `${venueName} \u2022 ${date}`,
          size: 'sm',
          color: '#999999',
          margin: 'sm',
        },
        {
          type: 'text',
          text: timeSlot,
          size: 'sm',
          color: '#999999',
        },
        {
          type: 'separator',
          margin: 'lg',
        },
        {
          type: 'text',
          text: 'How was the performance?',
          size: 'sm',
          margin: 'lg',
          color: '#666666',
        },
        {
          type: 'box',
          layout: 'horizontal',
          margin: 'md',
          spacing: 'sm',
          contents: [1, 2, 3, 4, 5].map((star) => ({
            type: 'button',
            action: {
              type: 'postback',
              label: '\u2B50'.repeat(star),
              data: `action=rate&assignmentId=${assignmentId}&rating=${star}`,
              displayText: `${star} star${star > 1 ? 's' : ''}`,
            },
            style: 'secondary',
            height: 'sm',
          })),
        },
      ],
    },
    footer: {
      type: 'box',
      layout: 'horizontal',
      spacing: 'sm',
      contents: [
        {
          type: 'button',
          action: {
            type: 'postback',
            label: 'Add Notes',
            data: `action=notes_prompt&assignmentId=${assignmentId}`,
            displayText: 'I want to add notes',
          },
          style: 'secondary',
          height: 'sm',
          flex: 1,
        },
        {
          type: 'button',
          action: {
            type: 'postback',
            label: 'Skip',
            data: `action=skip&assignmentId=${assignmentId}`,
            displayText: 'Skip this rating',
          },
          style: 'secondary',
          height: 'sm',
          flex: 1,
        },
      ],
    },
    styles: {
      header: { backgroundColor: '#f7f7f7' },
    },
  };
}

/**
 * Build a simple confirmation message after rating.
 */
export function buildRatingConfirmFlex(params: {
  djName: string;
  rating: number;
}): Record<string, unknown> {
  const stars = '\u2B50'.repeat(params.rating);
  return {
    type: 'bubble',
    size: 'kilo',
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'text',
          text: '\u2705 Rating Saved',
          weight: 'bold',
          size: 'md',
          color: '#00bbe4',
        },
        {
          type: 'text',
          text: `${params.djName}: ${stars}`,
          size: 'sm',
          margin: 'md',
        },
        {
          type: 'text',
          text: 'Thank you for your feedback!',
          size: 'xs',
          color: '#999999',
          margin: 'sm',
        },
      ],
    },
  };
}

/**
 * Build a welcome message for new followers with account linking prompt.
 */
export function buildWelcomeFlex(linkUrl: string): Record<string, unknown> {
  return {
    type: 'bubble',
    size: 'mega',
    header: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'text',
          text: 'Welcome to Bright Ears',
          weight: 'bold',
          size: 'lg',
          color: '#00bbe4',
        },
      ],
    },
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'text',
          text: 'Link your Bright Ears account to receive DJ schedule updates and submit feedback directly in LINE.',
          wrap: true,
          size: 'sm',
          color: '#666666',
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
            label: 'Link My Account',
            uri: linkUrl,
          },
          style: 'primary',
          color: '#00bbe4',
        },
      ],
    },
  };
}

/**
 * Build a DJ schedule reminder message.
 */
export function buildDJReminderFlex(params: {
  djName: string;
  venueName: string;
  date: string;
  startTime: string;
  endTime: string;
}): Record<string, unknown> {
  return {
    type: 'bubble',
    size: 'kilo',
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'text',
          text: '\uD83C\uDFB5 Schedule Reminder',
          weight: 'bold',
          size: 'md',
          color: '#00bbe4',
        },
        {
          type: 'separator',
          margin: 'md',
        },
        {
          type: 'text',
          text: `Hi ${params.djName}!`,
          size: 'sm',
          margin: 'lg',
        },
        {
          type: 'text',
          text: `You're playing tonight at ${params.venueName}`,
          size: 'sm',
          wrap: true,
          margin: 'sm',
        },
        {
          type: 'box',
          layout: 'horizontal',
          margin: 'lg',
          contents: [
            {
              type: 'text',
              text: 'Date',
              size: 'xs',
              color: '#999999',
              flex: 1,
            },
            {
              type: 'text',
              text: params.date,
              size: 'xs',
              flex: 2,
            },
          ],
        },
        {
          type: 'box',
          layout: 'horizontal',
          margin: 'sm',
          contents: [
            {
              type: 'text',
              text: 'Time',
              size: 'xs',
              color: '#999999',
              flex: 1,
            },
            {
              type: 'text',
              text: `${params.startTime} - ${params.endTime}`,
              size: 'xs',
              flex: 2,
            },
          ],
        },
      ],
    },
  };
}
