import { getCurrentUser } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import DJProfileContent from './DJProfileContent';

const prisma = new PrismaClient();

async function getProfileData(artistId: string) {
  const artist = await prisma.artist.findUnique({
    where: { id: artistId },
    select: {
      id: true,
      stageName: true,
      realName: true,
      bio: true,
      bioTh: true,
      category: true,
      genres: true,
      profileImage: true,
      coverImage: true,
      baseCity: true,
      languages: true,
      website: true,
      facebook: true,
      instagram: true,
      tiktok: true,
      youtube: true,
      spotify: true,
      contactEmail: true,
      contactPhone: true,
    },
  });

  return artist;
}

export default async function DJProfilePage({
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

  const artist = await getProfileData(user.artist.id);

  if (!artist) {
    return (
      <div className="text-white text-center py-12">
        <p>{locale === 'th' ? 'ไม่พบโปรไฟล์ศิลปิน' : 'Artist profile not found.'}</p>
      </div>
    );
  }

  return <DJProfileContent artist={artist} locale={locale} />;
}
