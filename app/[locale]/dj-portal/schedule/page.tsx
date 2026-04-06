import { getCurrentUser } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import DJScheduleContent from './DJScheduleContent';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

async function getScheduleData(artistId: string) {
  const assignments = await prisma.venueAssignment.findMany({
    where: { artistId },
    include: {
      venue: { select: { id: true, name: true } },
      feedback: { select: { overallRating: true } },
    },
    orderBy: { date: 'desc' },
  });

  return assignments.map((a) => ({
    id: a.id,
    venue: a.venue.name,
    venueId: a.venue.id,
    date: a.date.toISOString(),
    startTime: a.startTime,
    endTime: a.endTime,
    slot: a.slot,
    status: a.status,
    specialEvent: a.specialEvent,
    rating: a.feedback?.overallRating || null,
  }));
}

export default async function DJSchedulePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const user = await getCurrentUser();

  if (!user?.artist?.id) {
    return (
      <div className="text-white text-center py-12">
        <p>{locale === 'th' ? 'ไม่พบโปรไฟล์ศิลปิน' : 'Artist profile not found.'}</p>
      </div>
    );
  }

  const assignments = await getScheduleData(user.artist.id);

  return <DJScheduleContent assignments={assignments} locale={locale} />;
}
