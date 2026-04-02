import { getCurrentUser } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import DJFeedbackContent from './DJFeedbackContent';

const prisma = new PrismaClient();

async function getFeedbackData(artistId: string) {
  const [feedback, aggregate] = await Promise.all([
    prisma.venueFeedback.findMany({
      where: { artistId },
      include: {
        venue: { select: { name: true } },
        assignment: { select: { date: true, startTime: true, endTime: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.venueFeedback.aggregate({
      where: { artistId },
      _avg: {
        overallRating: true,
        musicQuality: true,
        crowdEngagement: true,
        professionalism: true,
      },
      _count: { overallRating: true },
    }),
  ]);

  return {
    feedback: feedback.map((f) => ({
      id: f.id,
      venue: f.venue.name,
      date: f.assignment.date.toISOString(),
      startTime: f.assignment.startTime,
      endTime: f.assignment.endTime,
      overallRating: f.overallRating,
      musicQuality: f.musicQuality,
      crowdEngagement: f.crowdEngagement,
      professionalism: f.professionalism,
      notes: f.notes,
      crowdLevel: f.crowdLevel,
      guestMix: f.guestMix,
      createdAt: f.createdAt.toISOString(),
    })),
    averages: {
      overall: aggregate._avg.overallRating
        ? Math.round(aggregate._avg.overallRating * 10) / 10
        : null,
      musicQuality: aggregate._avg.musicQuality
        ? Math.round(aggregate._avg.musicQuality * 10) / 10
        : null,
      crowdEngagement: aggregate._avg.crowdEngagement
        ? Math.round(aggregate._avg.crowdEngagement * 10) / 10
        : null,
      professionalism: aggregate._avg.professionalism
        ? Math.round(aggregate._avg.professionalism * 10) / 10
        : null,
      totalRatings: aggregate._count.overallRating,
    },
  };
}

export default async function DJFeedbackPage({
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

  const data = await getFeedbackData(user.artist.id);

  return <DJFeedbackContent data={data} locale={locale} />;
}
