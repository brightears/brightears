import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import DashboardStatsGrid from '@/components/dashboard/DashboardStatsGrid'
import RecentBookings from '@/components/dashboard/RecentBookings'
import QuickActions from '@/components/dashboard/QuickActions'
import UpcomingEvents from '@/components/dashboard/UpcomingEvents'

type BookingStatus = 'INQUIRY' | 'QUOTED' | 'CONFIRMED' | 'PAID' | 'COMPLETED' | 'CANCELLED'

interface MockBooking {
  id: string
  bookingNumber: string
  eventType: string
  eventDate: string
  venue: string
  status: BookingStatus
  amount: number
}

export default async function ArtistDashboardPage({
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

  const artist = user.artist

  // Mock data for now - will be replaced with real API calls
  const stats = {
    totalBookings: 34,
    completedBookings: 28,
    earnings: 125000, // THB - mock data
    averageRating: 4.6
  }

  const recentBookings: MockBooking[] = [
    {
      id: '1',
      bookingNumber: 'BE001',
      eventType: 'Wedding Reception',
      eventDate: '2024-08-20',
      venue: 'Grand Hyatt Bangkok',
      status: 'CONFIRMED' as BookingStatus,
      amount: 15000
    },
    {
      id: '2',
      bookingNumber: 'BE002',
      eventType: 'Corporate Event',
      eventDate: '2024-08-25',
      venue: 'Centara Grand',
      status: 'QUOTED' as BookingStatus,
      amount: 20000
    }
  ]

  const upcomingEvents = [
    {
      id: '1',
      title: 'Wedding Reception',
      date: '2024-08-20',
      time: '19:00',
      venue: 'Grand Hyatt Bangkok'
    },
    {
      id: '2',
      title: 'Corporate Gala',
      date: '2024-08-25',
      time: '18:30',
      venue: 'Centara Grand'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="font-playfair text-3xl font-bold text-dark-gray">
          Welcome back, {artist.stageName}!
        </h1>
        <p className="mt-2 text-dark-gray">
          Here's your performance overview and upcoming bookings.
        </p>
      </div>

      {/* Stats Grid */}
      <DashboardStatsGrid stats={stats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Bookings */}
          <RecentBookings bookings={recentBookings} locale={locale} />
          
          {/* Quick Actions */}
          <QuickActions locale={locale} />
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-8">
          {/* Upcoming Events */}
          <UpcomingEvents events={upcomingEvents} />
          
          {/* Profile Completion */}
          <div className="bg-pure-white rounded-lg shadow-md p-6">
            <h3 className="font-playfair text-lg font-semibold text-dark-gray mb-4">
              Profile Completion
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Basic Info</span>
                <span className="text-green-600 font-medium">Complete</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Media Gallery</span>
                <span className="text-yellow-600 font-medium">2/5 Photos</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Availability</span>
                <span className="text-red-600 font-medium">Incomplete</span>
              </div>
            </div>
            <div className="mt-4 bg-gray-200 rounded-full h-2">
              <div className="bg-brand-cyan h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
            <p className="mt-2 text-xs text-gray-500">60% Complete</p>
          </div>

          {/* Notifications */}
          <div className="bg-pure-white rounded-lg shadow-md p-6">
            <h3 className="font-playfair text-lg font-semibold text-dark-gray mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-brand-cyan rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-dark-gray">New booking request</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-dark-gray">Booking confirmed</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-soft-lavender rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-dark-gray">New review received</p>
                  <p className="text-xs text-gray-500">3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}