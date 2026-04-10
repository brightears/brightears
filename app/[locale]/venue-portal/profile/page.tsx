import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import VenueProfileClient from './VenueProfileClient';

export const dynamic = 'force-dynamic';

export default async function VenueProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/sign-in?redirect_url=/${locale}/venue-portal/profile`);
  }
  if (user.role !== 'CORPORATE' && user.role !== 'ADMIN') {
    redirect(`/${locale}`);
  }

  const where: any =
    user.role === 'ADMIN'
      ? { isActive: true }
      : { corporate: { userId: user.id }, isActive: true };

  const venues = await prisma.venue.findMany({
    where,
    select: {
      id: true,
      name: true,
      venueType: true,
      address: true,
      city: true,
      contactPerson: true,
      contactEmail: true,
      contactPhone: true,
      operatingHours: true,
    },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="max-w-3xl mx-auto">
      <VenueProfileClient venues={venues as any} />
    </div>
  );
}
