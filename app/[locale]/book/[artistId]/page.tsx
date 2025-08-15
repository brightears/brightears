import { getTranslations } from 'next-intl/server'

interface BookingPageProps {
  params: Promise<{
    locale: string
    artistId: string
  }>
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { locale, artistId } = await params
  const t = await getTranslations({ locale, namespace: 'booking' })

  return (
    <div className="min-h-screen bg-off-white py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="font-playfair text-3xl font-bold text-dark-gray mb-8">
          Book Artist
        </h1>
        <div className="bg-pure-white rounded-lg shadow-md p-6">
          <p className="text-dark-gray">
            Booking form for artist {artistId} coming soon...
          </p>
        </div>
      </div>
    </div>
  )
}