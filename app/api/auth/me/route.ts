import { NextResponse } from 'next/server';
import { auth as clerkAuth, currentUser } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/auth/me
 * Returns the current user's role from the database (optimized for fast redirect)
 */
export async function GET() {
  try {
    const { userId } = await clerkAuth();

    if (!userId) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    // Get Clerk user's email
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const email = clerkUser.emailAddresses[0]?.emailAddress;

    // Optimized query: only fetch role (no includes for faster response)
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
