/**
 * LINE Account Linking
 *
 * GET /api/line/link?lineUserId=Uxxx
 *   Shows a simple form to enter email for account linking.
 *   When submitted, links the LINE user ID to the Bright Ears account.
 *
 * POST /api/line/link
 *   { lineUserId, email } → Links the accounts in the database.
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Simple HTML form for account linking (opened from LINE)
export async function GET(req: Request) {
  const url = new URL(req.url);
  const lineUserId = url.searchParams.get('lineUserId');

  if (!lineUserId) {
    return new Response('Missing lineUserId parameter', { status: 400 });
  }

  // Check if already linked
  const existing = await prisma.user.findUnique({
    where: { lineUserId },
  });

  if (existing) {
    return new Response(
      buildHTML(
        'Already Linked',
        `<p>Your LINE account is already linked to <strong>${existing.email}</strong>.</p>
         <p>You can close this window.</p>`,
      ),
      { headers: { 'Content-Type': 'text/html' } },
    );
  }

  return new Response(
    buildHTML(
      'Link Your Account',
      `<form method="POST" action="/api/line/link">
        <input type="hidden" name="lineUserId" value="${escapeHtml(lineUserId)}" />
        <label for="email">Enter your Bright Ears email:</label>
        <input type="email" id="email" name="email" required placeholder="you@brightears.io" />
        <button type="submit">Link Account</button>
      </form>`,
    ),
    { headers: { 'Content-Type': 'text/html' } },
  );
}

// Handle form submission
export async function POST(req: Request) {
  const contentType = req.headers.get('content-type') || '';
  let lineUserId: string | null = null;
  let email: string | null = null;

  if (contentType.includes('application/x-www-form-urlencoded')) {
    const formData = await req.formData();
    lineUserId = formData.get('lineUserId') as string;
    email = (formData.get('email') as string)?.toLowerCase().trim();
  } else {
    const body = await req.json();
    lineUserId = body.lineUserId;
    email = body.email?.toLowerCase().trim();
  }

  if (!lineUserId || !email) {
    return new Response(
      buildHTML('Error', '<p>Missing lineUserId or email.</p>'),
      { status: 400, headers: { 'Content-Type': 'text/html' } },
    );
  }

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return new Response(
      buildHTML(
        'Account Not Found',
        `<p>No Bright Ears account found for <strong>${escapeHtml(email)}</strong>.</p>
         <p><a href="/api/line/link?lineUserId=${escapeHtml(lineUserId)}">Try again</a></p>`,
      ),
      { status: 404, headers: { 'Content-Type': 'text/html' } },
    );
  }

  // Check if already linked to different LINE user
  if (user.lineUserId && user.lineUserId !== lineUserId) {
    return new Response(
      buildHTML(
        'Already Linked',
        '<p>This account is already linked to a different LINE user. Please contact support.</p>',
      ),
      { status: 409, headers: { 'Content-Type': 'text/html' } },
    );
  }

  // Link the account
  await prisma.user.update({
    where: { id: user.id },
    data: {
      lineUserId,
      lineLinkedAt: new Date(),
    },
  });

  return new Response(
    buildHTML(
      'Account Linked!',
      `<p>Your LINE account is now linked to <strong>${escapeHtml(email)}</strong>.</p>
       <p>You'll receive DJ feedback requests and schedule updates directly in LINE.</p>
       <p>You can close this window now.</p>`,
    ),
    { headers: { 'Content-Type': 'text/html' } },
  );
}

// ---------------------------------------------------------------------------
// HTML template
// ---------------------------------------------------------------------------

function buildHTML(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)} - Bright Ears</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #f7f7f7;
      color: #333;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .card {
      background: white;
      border-radius: 16px;
      padding: 32px;
      max-width: 400px;
      width: 100%;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
      text-align: center;
    }
    h1 {
      color: #00bbe4;
      font-size: 24px;
      margin-bottom: 16px;
    }
    p { margin-bottom: 12px; line-height: 1.5; }
    label {
      display: block;
      text-align: left;
      font-size: 14px;
      color: #666;
      margin-bottom: 8px;
    }
    input[type="email"] {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      font-size: 16px;
      margin-bottom: 16px;
      transition: border-color 0.2s;
    }
    input[type="email"]:focus {
      outline: none;
      border-color: #00bbe4;
    }
    button {
      width: 100%;
      padding: 14px;
      background: #00bbe4;
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    button:hover { background: #009fc4; }
    a { color: #00bbe4; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${escapeHtml(title)}</h1>
    ${body}
  </div>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
