import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';

// GET — get or create referral code + stats
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Find existing referral code or create one
    let referral = await prisma.referral.findFirst({
      where: { referrerUserId: user.id, referredUserId: null },
    });

    if (!referral) {
      // Generate unique code: BE-XXXXXX
      const code = `BE-${randomBytes(3).toString('hex').toUpperCase()}`;
      referral = await prisma.referral.create({
        data: {
          referrerUserId: user.id,
          code,
        },
      });
    }

    // Get referral stats
    const totalReferrals = await prisma.referral.count({
      where: { referrerUserId: user.id, referredUserId: { not: null } },
    });

    const totalCreditsEarned = await prisma.referral.aggregate({
      where: { referrerUserId: user.id },
      _sum: { creditsEarned: true },
    });

    const recentReferrals = await prisma.referral.findMany({
      where: { referrerUserId: user.id, referredUserId: { not: null } },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        status: true,
        creditsEarned: true,
        createdAt: true,
        creditedAt: true,
      },
    });

    return NextResponse.json({
      code: referral.code,
      referralLink: `https://brightears.io/sign-up?ref=${referral.code}`,
      stats: {
        totalReferrals,
        totalCreditsEarned: totalCreditsEarned._sum.creditsEarned || 0,
      },
      recentReferrals,
    });
  } catch (error) {
    console.error('Referral error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST — claim a referral (called during sign-up when ?ref= code is present)
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { code } = await req.json();
    if (!code) {
      return NextResponse.json({ error: 'Referral code required' }, { status: 400 });
    }

    // Find the referral
    const referral = await prisma.referral.findUnique({
      where: { code },
    });

    if (!referral) {
      return NextResponse.json({ error: 'Invalid referral code' }, { status: 404 });
    }

    // Can't refer yourself
    if (referral.referrerUserId === user.id) {
      return NextResponse.json({ error: 'Cannot use your own referral code' }, { status: 400 });
    }

    // Check if this user already claimed a referral
    const existingClaim = await prisma.referral.findFirst({
      where: { referredUserId: user.id },
    });

    if (existingClaim) {
      return NextResponse.json({ error: 'You have already used a referral code' }, { status: 400 });
    }

    // Create a new referral record for this claim (keep the original code active for more referrals)
    const claim = await prisma.referral.create({
      data: {
        referrerUserId: referral.referrerUserId,
        referredUserId: user.id,
        code: `${code}-${user.id.substring(0, 6)}`, // Unique per claim
        status: 'signed_up',
      },
    });

    // Give the new user 5 bonus credits (on top of the 12 free default)
    const newUserAccount = await prisma.creditAccount.upsert({
      where: { userId: user.id },
      create: { userId: user.id, balance: 17, totalPurchased: 0 }, // 12 free + 5 bonus
      update: { balance: { increment: 5 } },
    });

    await prisma.creditTransaction.create({
      data: {
        accountId: newUserAccount.id,
        type: 'REFERRAL_BONUS',
        amount: 5,
        description: 'Referral signup bonus',
      },
    });

    // Give the referrer 10 credits (on top of the 12 free default)
    const referrerAccount = await prisma.creditAccount.upsert({
      where: { userId: referral.referrerUserId },
      create: { userId: referral.referrerUserId, balance: 22 }, // 12 free + 10 referral
      update: { balance: { increment: 10 } },
    });

    await prisma.creditTransaction.create({
      data: {
        accountId: referrerAccount.id,
        type: 'REFERRAL_EARNED',
        amount: 10,
        description: `Referral bonus: new user signed up`,
      },
    });

    // Update the claim
    await prisma.referral.update({
      where: { id: claim.id },
      data: {
        status: 'credited',
        creditsEarned: 10,
        creditedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      bonusCredits: 5,
      message: 'Referral claimed! You received 5 bonus credits.',
    });
  } catch (error) {
    console.error('Referral claim error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
