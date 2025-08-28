import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ProfileEditForm from '@/components/artist/ProfileEditForm'

export default async function ProfilePage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const { userId } = await auth()
  
  if (!userId) {
    redirect(`/${locale}/sign-in`)
  }

  // Get user with artist profile
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { artist: true }
  })

  if (!user || user.role !== 'ARTIST' || !user.artist) {
    redirect(`/${locale}/dashboard`)
  }

  const sessionArtist = user.artist

  // Fetch full artist data from database
  const artistData = await prisma.artist.findUnique({
    where: { id: sessionArtist.id },
    select: {
      id: true,
      stageName: true,
      realName: true,
      bio: true,
      bioTh: true,
      category: true,
      subCategories: true,
      baseCity: true,
      languages: true,
      genres: true,
      serviceAreas: true,
      hourlyRate: true,
      minimumHours: true,
      currency: true,
      travelRadius: true,
      instantBooking: true,
      advanceNotice: true,
      cancellationPolicy: true,
      website: true,
      facebook: true,
      instagram: true,
      tiktok: true,
      youtube: true,
      spotify: true,
      soundcloud: true,
      mixcloud: true,
      lineId: true,
      profileImage: true,
      coverImage: true,
    }
  })

  if (!artistData) {
    redirect(`/${locale}/dashboard`)
  }

  // Transform the data to convert Decimal to number
  const artist = {
    ...artistData,
    hourlyRate: artistData.hourlyRate ? artistData.hourlyRate.toNumber() : null,
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-playfair text-3xl font-bold text-dark-gray">
          Profile Management
        </h1>
        <p className="mt-2 text-dark-gray">
          Update your artist profile information and settings.
        </p>
      </div>

      {/* Profile Form */}
      <ProfileEditForm artist={artist} locale={locale} />
    </div>
  )
}