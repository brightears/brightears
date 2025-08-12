import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ProfileEditForm from '@/components/dashboard/ProfileEditForm'
import PricingSettingsForm from '@/components/dashboard/PricingSettingsForm'
import ServiceAreasForm from '@/components/dashboard/ServiceAreasForm'
import SocialLinksForm from '@/components/dashboard/SocialLinksForm'

export default async function ProfilePage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const user = await getCurrentUser()
  
  if (!user || user.role !== 'ARTIST') {
    redirect(`/${locale}/login`)
  }

  const artist = user.artist
  if (!artist) {
    redirect(`/${locale}/dashboard`)
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