/**
 * LINE Login — OAuth initiation endpoint
 *
 * GET /api/auth/line/start?role=ARTIST|CORPORATE
 *
 * Redirects the user to LINE's OAuth 2.1 authorization endpoint.
 * On success, LINE will redirect back to /api/auth/line/callback with
 * an authorization code.
 *
 * Env vars required (set via single-key PUT on Render):
 * - LINE_LOGIN_CHANNEL_ID      (from LINE Developers Console)
 * - LINE_LOGIN_CHANNEL_SECRET  (from LINE Developers Console)
 * - NEXT_PUBLIC_APP_URL        (already set — used for callback URL)
 *
 * If the env vars aren't set, returns 503 with a setup instruction
 * message — allowing the button to be rendered but gracefully
 * explaining it's not yet wired up.
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const channelId = process.env.LINE_LOGIN_CHANNEL_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://brightears.io';

  if (!channelId) {
    return NextResponse.json(
      {
        error: 'LINE Login is not yet configured.',
        hint: 'An admin needs to set LINE_LOGIN_CHANNEL_ID and LINE_LOGIN_CHANNEL_SECRET env vars from the LINE Developers Console.',
      },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(req.url);
  const role = searchParams.get('role') || 'ARTIST';

  // Generate a CSRF-protection state parameter and store it in a cookie
  const state = crypto.randomBytes(16).toString('hex');
  const nonce = crypto.randomBytes(16).toString('hex');

  const redirectUri = `${appUrl}/api/auth/line/callback`;
  const scope = 'profile openid email';

  const lineAuthUrl = new URL('https://access.line.me/oauth2/v2.1/authorize');
  lineAuthUrl.searchParams.set('response_type', 'code');
  lineAuthUrl.searchParams.set('client_id', channelId);
  lineAuthUrl.searchParams.set('redirect_uri', redirectUri);
  lineAuthUrl.searchParams.set('state', state);
  lineAuthUrl.searchParams.set('scope', scope);
  lineAuthUrl.searchParams.set('nonce', nonce);

  const response = NextResponse.redirect(lineAuthUrl.toString());
  response.cookies.set('line_oauth_state', state, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 10, // 10 minutes
    path: '/',
  });
  response.cookies.set('line_oauth_role', role, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 10,
    path: '/',
  });

  return response;
}
