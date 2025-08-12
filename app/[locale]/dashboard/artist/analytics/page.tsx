import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AnalyticsDashboard from '@/components/dashboard/AnalyticsDashboard'

export default async function AnalyticsPage({
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

  // Mock analytics data - will be replaced with real API calls
  const mockAnalytics = {
    earnings: {
      total: 125000,
      thisMonth: 18500,
      lastMonth: 22000,
      monthlyData: [
        { month: 'Jan', earnings: 15000, bookings: 3 },
        { month: 'Feb', earnings: 18000, bookings: 4 },
        { month: 'Mar', earnings: 22000, bookings: 5 },
        { month: 'Apr', earnings: 16500, bookings: 3 },
        { month: 'May', earnings: 24000, bookings: 6 },
        { month: 'Jun', earnings: 20500, bookings: 4 },
        { month: 'Jul', earnings: 22000, bookings: 5 },
        { month: 'Aug', earnings: 18500, bookings: 4 }
      ]
    },
    bookings: {
      total: 34,
      thisMonth: 4,
      completed: 28,
      cancelled: 2,
      conversionRate: 85,
      weeklyBookings: [
        { week: 'Week 1', bookings: 2 },
        { week: 'Week 2', bookings: 1 },
        { week: 'Week 3', bookings: 3 },
        { week: 'Week 4', bookings: 2 }
      ]
    },
    performance: {
      averageRating: 4.6,
      responseRate: 92,
      responseTime: 4, // hours
      rebookingRate: 35,
      profileViews: 1250,
      inquiries: 45
    },
    demographics: {
      eventTypes: [
        { type: 'Wedding', count: 12, percentage: 35 },
        { type: 'Corporate', count: 8, percentage: 24 },
        { type: 'Birthday Party', count: 6, percentage: 18 },
        { type: 'Private Event', count: 5, percentage: 15 },
        { type: 'Other', count: 3, percentage: 8 }
      ],
      locations: [
        { type: 'Bangkok', count: 20, percentage: 59 },
        { type: 'Chiang Mai', count: 6, percentage: 18 },
        { type: 'Phuket', count: 4, percentage: 12 },
        { type: 'Pattaya', count: 2, percentage: 6 },
        { type: 'Other', count: 2, percentage: 5 }
      ],
      timeSlots: [
        { type: '6-9 PM', count: 15, percentage: 44 },
        { type: '9-12 PM', count: 10, percentage: 29 },
        { type: '12-3 AM', count: 6, percentage: 18 },
        { type: '3-6 PM', count: 3, percentage: 9 }
      ]
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-playfair text-3xl font-bold text-dark-gray">
          Analytics & Earnings
        </h1>
        <p className="mt-2 text-dark-gray">
          Track your performance, earnings, and understand your client demographics.
        </p>
      </div>

      {/* Analytics Dashboard */}
      <AnalyticsDashboard 
        artistId={artist.id}
        analytics={mockAnalytics}
        locale={locale}
      />
    </div>
  )
}