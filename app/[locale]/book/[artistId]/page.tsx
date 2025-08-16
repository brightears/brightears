import { getTranslations } from 'next-intl/server'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from '@/i18n/routing'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BookingForm from '@/components/booking/BookingForm'
import LineContactButton from '@/components/booking/LineContactButton'

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
                  <div className="flex justify-between items-center">
                    <span className="text-dark-gray/70">Artist</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-dark-gray">{artist.stageName}</span>
                      {artist.verificationLevel === 'VERIFIED' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Verified
                        </span>
                      )}
                      {artist.verificationLevel === 'TRUSTED' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-soft-lavender text-pure-white">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Premium
                        </span>
                      )}
                    </div>
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
                  
                  {/* Trust Signals */}
                  <div className="pt-3 border-t">
                    <div className="flex items-center text-xs text-dark-gray/70 mb-2">
                      <svg className="w-4 h-4 mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Professional Equipment
                    </div>
                    <div className="flex items-center text-xs text-dark-gray/70 mb-2">
                      <svg className="w-4 h-4 mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Identity Verified
                    </div>
                    <div className="flex items-center text-xs text-dark-gray/70">
                      <svg className="w-4 h-4 mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                      {artist.reviews?.length || 12} Happy Clients
                    </div>
                  </div>
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

                {/* LINE Contact Integration */}
                <div className="mt-4 p-4 bg-earthy-brown/10 rounded-lg">
                  <h4 className="font-medium text-dark-gray mb-3">Quick Contact</h4>
                  <LineContactButton
                    artistName={artist.stageName}
                    artistId={artist.id}
                    lineId={artist.lineId || '@brightears'}
                  />
                  {locale === 'th' ? (
                    <p className="text-xs text-dark-gray/70 mt-2">
                      หรือติดต่อผ่าน LINE เพื่อคุยรายละเอียดเพิ่มเติม
                    </p>
                  ) : (
                    <p className="text-xs text-dark-gray/70 mt-2">
                      Chat directly via LINE for quick questions
                    </p>
                  )}
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