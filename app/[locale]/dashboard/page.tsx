import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default async function DashboardPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }

  const getDashboardContent = () => {
    switch (user.role) {
      case 'ARTIST':
        return {
          title: 'Artist Dashboard',
          description: `Welcome back, ${user.artist?.stageName || 'Artist'}!`,
          stats: [
            { label: 'Total Bookings', value: 'Coming Soon' },
            { label: 'Completed Bookings', value: 'Coming Soon' },
            { label: 'Average Rating', value: 'Coming Soon' },
          ],
          quickActions: [
            { label: 'Update Profile', href: '/dashboard/artist/profile' },
            { label: 'Manage Availability', href: '/dashboard/artist/availability' },
            { label: 'View Bookings', href: '/dashboard/artist/bookings' },
          ]
        }
      case 'CUSTOMER':
        return {
          title: 'Customer Dashboard',
          description: `Welcome back, ${user.customer?.firstName || user.email?.split('@')[0] || 'Customer'}!`,
          stats: [
            { label: 'Bookings Made', value: 'Coming Soon' },
            { label: 'Favorite Artists', value: 'Coming Soon' },
            { label: 'Upcoming Events', value: 'Coming Soon' },
          ],
          quickActions: [
            { label: 'Browse Artists', href: '/artists' },
            { label: 'My Bookings', href: '/dashboard/customer/bookings' },
            { label: 'Favorites', href: '/dashboard/customer/favorites' },
          ]
        }
      case 'CORPORATE':
        return {
          title: 'Corporate Dashboard',
          description: `Welcome back, ${user.corporate?.contactPerson || 'Corporate User'}!`,
          stats: [
            { label: 'Active Contracts', value: 'Coming Soon' },
            { label: 'This Month Bookings', value: 'Coming Soon' },
            { label: 'Company Venues', value: 'Coming Soon' },
          ],
          quickActions: [
            { label: 'Browse Artists', href: '/artists' },
            { label: 'Manage Contracts', href: '/dashboard/corporate/contracts' },
            { label: 'Company Profile', href: '/dashboard/corporate/profile' },
          ]
        }
      case 'ADMIN':
        return {
          title: 'Admin Dashboard',
          description: 'Welcome to the admin panel',
          stats: [
            { label: 'Total Users', value: 'Coming Soon' },
            { label: 'Total Artists', value: 'Coming Soon' },
            { label: 'Total Bookings', value: 'Coming Soon' },
          ],
          quickActions: [
            { label: 'Manage Users', href: '/dashboard/admin/users' },
            { label: 'Manage Artists', href: '/dashboard/admin/artists' },
            { label: 'View Reports', href: '/dashboard/admin/reports' },
          ]
        }
      default:
        return {
          title: 'Dashboard',
          description: 'Welcome to your dashboard',
          stats: [],
          quickActions: []
        }
    }
  }

  const { title, description, stats, quickActions } = getDashboardContent()

  return (
    <>
      <Header />
      <main className="min-h-screen bg-off-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-playfair text-3xl font-bold text-dark-gray">
              {title}
            </h1>
            <p className="mt-2 text-dark-gray">{description}</p>
            <div className="mt-2 text-sm text-brand-cyan font-medium">
              Role: {user.role} | Email: {user.email}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-pure-white rounded-lg shadow-md p-6">
                <div className="text-2xl font-bold text-brand-cyan">
                  {stat.value}
                </div>
                <div className="text-sm text-dark-gray">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-pure-white rounded-lg shadow-md p-6">
            <h2 className="font-playfair text-xl font-semibold text-dark-gray mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <a
                  key={index}
                  href={action.href}
                  className="block p-4 text-center bg-off-white hover:bg-brand-cyan hover:text-pure-white rounded-lg transition-colors"
                >
                  {action.label}
                </a>
              ))}
            </div>
          </div>

          {/* Role-specific information */}
          {user.role === 'ARTIST' && user.artist && (
            <div className="mt-8 bg-pure-white rounded-lg shadow-md p-6">
              <h2 className="font-playfair text-xl font-semibold text-dark-gray mb-4">
                Artist Profile Summary
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Stage Name:</strong> {user.artist.stageName}
                </div>
                <div>
                  <strong>Category:</strong> Coming Soon
                </div>
                <div>
                  <strong>Base City:</strong> Coming Soon
                </div>
                <div>
                  <strong>Verification:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    user.artist.verificationLevel === 'VERIFIED' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.artist.verificationLevel}
                  </span>
                </div>
              </div>
            </div>
          )}

          {user.role === 'CORPORATE' && user.corporate && (
            <div className="mt-8 bg-pure-white rounded-lg shadow-md p-6">
              <h2 className="font-playfair text-xl font-semibold text-dark-gray mb-4">
                Company Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Company:</strong> {user.corporate.companyName}
                </div>
                <div>
                  <strong>Contact Person:</strong> {user.corporate.contactPerson}
                </div>
                <div>
                  <strong>Venue Type:</strong> Coming Soon
                </div>
                <div>
                  <strong>Number of Venues:</strong> Coming Soon
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}