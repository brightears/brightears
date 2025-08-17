import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ArtistAvailabilityCalendar from '@/components/dashboard/ArtistAvailabilityCalendar'

export default async function AvailabilityPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
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
          Availability Calendar
        </h1>
        <p className="mt-2 text-dark-gray">
          Manage your availability and block dates for personal events. Click on dates to set availability or use bulk edit for multiple dates.
        </p>
      </div>

      {/* Calendar Component */}
      <ArtistAvailabilityCalendar 
        artistId={artist.id}
        locale={locale}
      />
    </div>
  )
}