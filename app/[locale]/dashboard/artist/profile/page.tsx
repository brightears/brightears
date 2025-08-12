import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ProfileEditForm from '@/components/dashboard/ProfileEditForm'
import PricingSettingsForm from '@/components/dashboard/PricingSettingsForm'
import ServiceAreasForm from '@/components/dashboard/ServiceAreasForm'
import SocialLinksForm from '@/components/dashboard/SocialLinksForm'

export default async function ProfilePage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const user = await getCurrentUser()
  
  if (!user || user.role !== 'ARTIST') {
    redirect(`/${locale}/login`)
  }

  const sessionArtist = user.artist
  if (!sessionArtist) {
    redirect(`/${locale}/dashboard`)
  }

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

      {/* Profile Forms */}
      <div className="space-y-8">
        {/* Basic Information */}
        <ProfileEditForm artist={artist} locale={locale} />
        
        {/* Pricing & Availability Settings */}
        <PricingSettingsForm artist={artist} locale={locale} />
        
        {/* Service Areas */}
        <ServiceAreasForm artist={artist} locale={locale} />
        
        {/* Social Media Links */}
        <SocialLinksForm artist={artist} locale={locale} />
      </div>
    </div>
  )
}