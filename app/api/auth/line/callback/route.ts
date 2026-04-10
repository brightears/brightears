/**
 * LINE Login — OAuth callback endpoint
 *
 * GET /api/auth/line/callback?code=...&state=...
 *
 * Exchanges the authorization code for an access token, fetches the
 * user's LINE profile, and stores it in an httpOnly cookie for the
 * subsequent Clerk sign-up flow to pick up.
 *
 * Flow:
 * 1. Validate state cookie matches query param (CSRF protection)
 * 2. Exchange code for access token at LINE token endpoint
 * 3. Verify ID token and extract user profile (sub = LINE userId)
 * 4. Fetch extended profile (display name, picture) from LINE profile API
 * 5. Store profile in secure cookie
 * 6. Redirect to /sign-up or /sign-up/venue with the cookie set
 * 7. The sign-up page reads the cookie to pre-fill name/email and
 *    shows "Continuing as [LINE Name]"
 * 8. After Clerk sign-up completes, /auth-redirect page links the
 *    LINE userId to the newly created user (follow-up endpoint)
 */

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const channelId = process.env.LINE_LOGIN_CHANNEL_ID;
  const channelSecret = process.env.LINE_LOGIN_CHANNEL_SECRET;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://brightears.io';

  if (!channelId || !channelSecret) {
    return NextResponse.redirect(`${appUrl}/sign-up?line_error=not_configured`);
  }

  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(`${appUrl}/sign-up?line_error=${encodeURIComponent(error)}`);
  }

  if (!code || !state) {
    return NextResponse.redirect(`${appUrl}/sign-up?line_error=missing_code`);
  }

  // CSRF protection — state cookie must match
  const stateCookie = req.cookies.get('line_oauth_state')?.value;
  const roleCookie = req.cookies.get('line_oauth_role')?.value || 'ARTIST';
  if (!stateCookie || stateCookie !== state) {
    return NextResponse.redirect(`${appUrl}/sign-up?line_error=state_mismatch`);
  }

  try {
    const redirectUri = `${appUrl}/api/auth/line/callback`;

    // Exchange code for token
    const tokenRes = await fetch('https://api.line.me/oauth2/v2.1/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: channelId,
        client_secret: channelSecret,
      }).toString(),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      console.error('[LINE Login] Token exchange failed:', errText);
      return NextResponse.redirect(`${appUrl}/sign-up?line_error=token_exchange_failed`);
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    const idToken = tokenData.id_token;

    // Fetch user profile
    const profileRes = await fetch('https://api.line.me/v2/profile', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!profileRes.ok) {
      console.error('[LINE Login] Profile fetch failed');
      return NextResponse.redirect(`${appUrl}/sign-up?line_error=profile_fetch_failed`);
    }

    const profile = await profileRes.json();
    // profile = { userId, displayName, pictureUrl?, statusMessage? }

    // Decode email from id_token if present (JWT, but we only need the payload)
    let email: string | undefined;
    if (idToken) {
      try {
        const payloadBase64 = idToken.split('.')[1];
        const payload = JSON.parse(
          Buffer.from(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8')
        );
        email = payload.email;
      } catch {
        // no email in token, continue
      }
    }

    // Route based on requested role
    const redirectPath =
      roleCookie === 'CORPORATE' ? '/sign-up/venue?line=1' : '/sign-up?line=1';

    const response = NextResponse.redirect(`${appUrl}${redirectPath}`);

    // Store the LINE profile in a short-lived cookie for the sign-up page to read
    response.cookies.set(
      'line_profile',
      JSON.stringify({
        userId: profile.userId,
        displayName: profile.displayName,
        pictureUrl: profile.pictureUrl || null,
        email: email || null,
      }),
      {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 30, // 30 minutes
        path: '/',
      }
    );

    // Clear the OAuth state cookies
    response.cookies.delete('line_oauth_state');
    response.cookies.delete('line_oauth_role');

    return response;
  } catch (err: any) {
    console.error('[LINE Login] callback error:', err);
    return NextResponse.redirect(`${appUrl}/sign-up?line_error=unknown`);
  }
}
