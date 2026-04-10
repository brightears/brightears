/**
 * LINE Login — Link endpoint
 *
 * POST /api/auth/line/link
 *
 * Called after Clerk sign-up completes. Reads the line_profile cookie
 * set by the callback endpoint and writes the lineUserId onto the
 * currently signed-in User, then clears the cookie.
 *
 * This finishes the bridge between LINE OAuth pre-fill → Clerk sign-up →
 * User.lineUserId permanently linked.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
    }

    const profileCookie = req.cookies.get('line_profile')?.value;
    if (!profileCookie) {
      return NextResponse.json({ error: 'No LINE profile cookie' }, { status: 400 });
    }

    let profile: { userId: string; displayName: string; pictureUrl?: string | null };
    try {
      profile = JSON.parse(profileCookie);
    } catch {
      return NextResponse.json({ error: 'Invalid cookie' }, { status: 400 });
    }

    if (!profile.userId) {
      return NextResponse.json({ error: 'Missing LINE userId' }, { status: 400 });
    }

    // Link the LINE userId to the current user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lineUserId: profile.userId,
        lineLinkedAt: new Date(),
      },
    });

    // Clear the cookie
    const response = NextResponse.json({
      success: true,
      linked: profile.userId,
      displayName: profile.displayName,
    });
    response.cookies.delete('line_profile');
    return response;
  } catch (err: any) {
    console.error('[LINE Login] link error:', err);
    return NextResponse.json({ error: 'Failed to link' }, { status: 500 });
  }
}

/**
 * GET /api/auth/line/link — Check if there's a pending LINE profile
 * in the cookie. Used by the post-sign-up page to decide whether to
 * auto-link and show a success toast.
 */
export async function GET(req: NextRequest) {
  const profileCookie = req.cookies.get('line_profile')?.value;
  if (!profileCookie) {
    return NextResponse.json({ pending: false });
  }

  try {
    const profile = JSON.parse(profileCookie);
    return NextResponse.json({
      pending: true,
      displayName: profile.displayName,
      pictureUrl: profile.pictureUrl,
    });
  } catch {
    return NextResponse.json({ pending: false });
  }
}
