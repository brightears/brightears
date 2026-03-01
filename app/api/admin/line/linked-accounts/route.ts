import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// GET: List all users with linked LINE accounts
export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const linkedUsers = await prisma.user.findMany({
    where: { lineUserId: { not: null } },
    select: {
      id: true,
      email: true,
      name: true,
      lineLinkedAt: true,
      corporate: { select: { companyName: true } },
    },
    orderBy: { lineLinkedAt: 'desc' },
  });

  return NextResponse.json(linkedUsers);
}

// DELETE: Unlink a user's LINE account
export async function DELETE(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { userId } = await req.json();
  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: userId },
    data: { lineUserId: null, lineLinkedAt: null },
  });

  return NextResponse.json({ success: true });
}
