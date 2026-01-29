import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

/**
 * GET /api/admin/venues
 * List all venues with their stats
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const venues = await prisma.venue.findMany({
      orderBy: { name: 'asc' },
      include: {
        corporate: {
          select: {
            companyName: true,
          },
        },
        _count: {
          select: {
            assignments: true,
            feedback: true,
          },
        },
      },
    });

    return NextResponse.json({ venues });
  } catch (error) {
    console.error('Error fetching venues:', error);
    return NextResponse.json(
      { error: 'Failed to fetch venues' },
      { status: 500 }
    );
  }
}
