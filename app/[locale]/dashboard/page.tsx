import { redirect } from '@/i18n/routing'
import { getCurrentUser } from '@/lib/auth'
import { getTranslations } from 'next-intl/server'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

interface DashboardPageProps {
  params: Promise<{
    locale: string
  }>
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params
  const user = await getCurrentUser()
  const t = await getTranslations({ locale, namespace: 'dashboard' })

  if (!user) {
    redirect('/login')
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-off-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="font-playfair text-3xl font-bold text-dark-gray">
              Welcome back, {user.name || user.email}!
            </h1>
            <p className="mt-2 text-dark-gray">
              Role: {user.role}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Customer Dashboard */}
            {user.role === 'CUSTOMER' && (
              <>
                <Link href="/bookings" className="bg-pure-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <h3 className="font-playfair text-xl font-bold text-dark-gray mb-2">My Bookings</h3>
                  <p className="text-dark-gray/70">View and manage your bookings</p>
                </Link>
                
                <Link href="/favorites" className="bg-pure-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <h3 className="font-playfair text-xl font-bold text-dark-gray mb-2">Favorite Artists</h3>
                  <p className="text-dark-gray/70">Your saved artists</p>
                </Link>
                
                <Link href="/profile" className="bg-pure-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <h3 className="font-playfair text-xl font-bold text-dark-gray mb-2">My Profile</h3>
                  <p className="text-dark-gray/70">Update your information</p>
                </Link>
              </>
            )}

            {/* Artist Dashboard */}
            {user.role === 'ARTIST' && (
              <>
                <Link href="/artist/profile" className="bg-pure-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <h3 className="font-playfair text-xl font-bold text-dark-gray mb-2">My Profile</h3>
                  <p className="text-dark-gray/70">Manage your artist profile</p>
                </Link>
                
                <Link href="/artist/bookings" className="bg-pure-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <h3 className="font-playfair text-xl font-bold text-dark-gray mb-2">Booking Requests</h3>
                  <p className="text-dark-gray/70">Respond to booking inquiries</p>
                </Link>
                
                <Link href="/artist/calendar" className="bg-pure-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <h3 className="font-playfair text-xl font-bold text-dark-gray mb-2">Availability</h3>
                  <p className="text-dark-gray/70">Manage your calendar</p>
                </Link>
                
                <Link href="/artist/media" className="bg-pure-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <h3 className="font-playfair text-xl font-bold text-dark-gray mb-2">Media Gallery</h3>
                  <p className="text-dark-gray/70">Upload photos and videos</p>
                </Link>
                
                <Link href="/artist/analytics" className="bg-pure-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <h3 className="font-playfair text-xl font-bold text-dark-gray mb-2">Analytics</h3>
                  <p className="text-dark-gray/70">View profile performance</p>
                </Link>
                
                <Link href="/artist/reviews" className="bg-pure-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <h3 className="font-playfair text-xl font-bold text-dark-gray mb-2">Reviews</h3>
                  <p className="text-dark-gray/70">Customer feedback</p>
                </Link>
              </>
            )}

            {/* Corporate Dashboard */}
            {user.role === 'CORPORATE' && (
              <>
                <Link href="/corporate/bookings" className="bg-pure-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <h3 className="font-playfair text-xl font-bold text-dark-gray mb-2">Bookings</h3>
                  <p className="text-dark-gray/70">Manage all venue bookings</p>
                </Link>
                
                <Link href="/corporate/artists" className="bg-pure-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <h3 className="font-playfair text-xl font-bold text-dark-gray mb-2">Preferred Artists</h3>
                  <p className="text-dark-gray/70">Your trusted performers</p>
                </Link>
                
                <Link href="/corporate/events" className="bg-pure-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <h3 className="font-playfair text-xl font-bold text-dark-gray mb-2">Events Calendar</h3>
                  <p className="text-dark-gray/70">Upcoming performances</p>
                </Link>
                
                <Link href="/corporate/profile" className="bg-pure-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <h3 className="font-playfair text-xl font-bold text-dark-gray mb-2">Company Profile</h3>
                  <p className="text-dark-gray/70">Update venue information</p>
                </Link>
                
                <Link href="/corporate/invoices" className="bg-pure-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <h3 className="font-playfair text-xl font-bold text-dark-gray mb-2">Invoices</h3>
                  <p className="text-dark-gray/70">Billing and payments</p>
                </Link>
              </>
            )}

            {/* Admin Dashboard */}
            {user.role === 'ADMIN' && (
              <>
                <Link href="/admin/users" className="bg-pure-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <h3 className="font-playfair text-xl font-bold text-dark-gray mb-2">Users</h3>
                  <p className="text-dark-gray/70">Manage all users</p>
                </Link>
                
                <Link href="/admin/artists" className="bg-pure-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <h3 className="font-playfair text-xl font-bold text-dark-gray mb-2">Artists</h3>
                  <p className="text-dark-gray/70">Verify and manage artists</p>
                </Link>
                
                <Link href="/admin/bookings" className="bg-pure-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <h3 className="font-playfair text-xl font-bold text-dark-gray mb-2">Bookings</h3>
                  <p className="text-dark-gray/70">All platform bookings</p>
                </Link>
                
                <Link href="/admin/analytics" className="bg-pure-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <h3 className="font-playfair text-xl font-bold text-dark-gray mb-2">Analytics</h3>
                  <p className="text-dark-gray/70">Platform statistics</p>
                </Link>
              </>
            )}
          </div>

          {/* Quick Stats */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-brand-cyan text-pure-white rounded-lg p-6">
              <h4 className="font-playfair text-lg font-bold mb-2">Total Bookings</h4>
              <p className="text-3xl font-bold">0</p>
            </div>
            
            <div className="bg-deep-teal text-pure-white rounded-lg p-6">
              <h4 className="font-playfair text-lg font-bold mb-2">This Month</h4>
              <p className="text-3xl font-bold">0</p>
            </div>
            
            <div className="bg-earthy-brown text-pure-white rounded-lg p-6">
              <h4 className="font-playfair text-lg font-bold mb-2">Messages</h4>
              <p className="text-3xl font-bold">0</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}