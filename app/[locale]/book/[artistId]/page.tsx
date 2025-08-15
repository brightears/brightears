import { getTranslations } from 'next-intl/server'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from '@/i18n/routing'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BookingForm from '@/components/booking/BookingForm'

interface BookingPageProps {
  params: Promise<{
    locale: string
    artistId: string
  }>
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { locale, artistId } = await params
  const t = await getTranslations({ locale, namespace: 'booking' })
  const user = await getCurrentUser()

  if (!user) {
    redirect({
      href: `/login?redirect=/book/${artistId}`,
      locale
    })
    return null // TypeScript needs this even though redirect throws
  }

  // Fetch artist details
  const artistResponse = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/artists/${artistId}`,
    { cache: 'no-store' }
  )
  
  if (!artistResponse.ok) {
    redirect({
      href: '/artists',
      locale
    })
  }
  
  const artist = await artistResponse.json()

  return (
    <>
      <Header />
      <main className="min-h-screen bg-off-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="font-playfair text-3xl font-bold text-dark-gray">
              Book {artist.stageName}
            </h1>
            <p className="mt-2 text-dark-gray/70">
              {artist.category} • {artist.baseCity}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              <BookingForm artist={artist} userId={user.id} locale={locale} />
            </div>

            {/* Artist Summary */}
            <div className="lg:col-span-1">
              <div className="bg-pure-white rounded-lg shadow-md p-6 sticky top-20">
                <h3 className="font-playfair text-xl font-bold text-dark-gray mb-4">
                  Booking Summary
                </h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-dark-gray/70">Artist</span>
                    <span className="font-medium text-dark-gray">{artist.stageName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark-gray/70">Category</span>
                    <span className="font-medium text-dark-gray">{artist.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark-gray/70">Base Rate</span>
                    <span className="font-medium text-brand-cyan">
                      ฿{artist.hourlyRate?.toLocaleString() || '2,500'}/hr
                    </span>
                  </div>
                  {artist.minimumHours && (
                    <div className="flex justify-between">
                      <span className="text-dark-gray/70">Min. Hours</span>
                      <span className="font-medium text-dark-gray">{artist.minimumHours}</span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium text-dark-gray mb-2">Cancellation Policy</h4>
                  <p className="text-sm text-dark-gray/70">
                    {artist.cancellationPolicy || 'Free cancellation up to 48 hours before the event. 50% charge for cancellations within 48 hours.'}
                  </p>
                </div>

                <div className="mt-6 p-4 bg-soft-lavender/10 rounded-lg">
                  <p className="text-sm text-dark-gray">
                    <strong>No commission fees!</strong> You pay the artist directly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}