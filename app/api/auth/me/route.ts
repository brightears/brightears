import { NextResponse } from 'next/server';
import { auth as clerkAuth, currentUser, clerkClient } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/auth/me
 * Returns the current user's role and syncs it to Clerk's publicMetadata
 * for faster subsequent logins (no API call needed).
 */
export async function GET() {
  try {
    const { userId } = await clerkAuth();

    if (!userId) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    // Get Clerk user
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const email = clerkUser.emailAddresses[0]?.emailAddress;

    // Optimized query: only fetch role
    const user = await prisma.user.findFirst({
      where: {
        OR: email ? [{ email }, { id: userId }] : [{ id: userId }],
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    // Sync role to Clerk's publicMetadata if not already set
    // This enables instant redirects on future logins (no API call needed)
    const clerkRole = clerkUser.publicMetadata?.role as string | undefined;
    if (clerkRole !== user.role) {
      try {
        const client = await clerkClient();
        await client.users.updateUserMetadata(userId, {
          publicMetadata: {
            ...clerkUser.publicMetadata,
            role: user.role,
          },
        });
      } catch (syncError) {
        // Non-critical - log but don't fail the request
        console.error('Failed to sync role to Clerk:', syncError);
      }
    }

    return NextResponse.json({
      user: {
        id: user.id,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error fetching current user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}
