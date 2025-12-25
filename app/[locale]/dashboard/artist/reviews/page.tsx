import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ReviewsManager from '@/components/dashboard/ReviewsManager'

export default async function ReviewsPage({
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

  // Mock reviews data - will be replaced with real API calls
  const mockReviews = [
    {
      id: '1',
      bookingId: 'booking1',
      reviewerId: 'customer1',
      reviewerName: 'Sarah Johnson',
      reviewerEmail: 'sarah@example.com',
      rating: 5,
      comment: 'Amazing DJ! The crowd was dancing all night. Very professional and played exactly what we wanted. Highly recommend!',
      commentTh: null,
      punctuality: 5,
      performance: 5,
      professionalism: 5,
      valueForMoney: 4,
      isVerified: true,
      isPublic: true,
      createdAt: '2024-08-10T14:30:00Z',
      artistResponse: 'Thank you so much! It was a pleasure playing at your wedding. Wishing you both happiness!',
      respondedAt: '2024-08-11T09:15:00Z',
      eventType: 'Wedding Reception',
      eventDate: '2024-08-05T19:00:00Z',
      venue: 'Grand Hyatt Bangkok'
    },
    {
      id: '2',
      bookingId: 'booking2',
      reviewerId: 'customer2',
      reviewerName: 'Michael Chen',
      reviewerEmail: 'michael@example.com',
      rating: 4,
      comment: 'Good performance overall. Music selection was great and kept the party going. Only minor issue was the sound was a bit loud at times.',
      commentTh: null,
      punctuality: 5,
      performance: 4,
      professionalism: 5,
      valueForMoney: 4,
      isVerified: true,
      isPublic: true,
      createdAt: '2024-08-08T16:45:00Z',
      artistResponse: null,
      respondedAt: null,
      eventType: 'Birthday Party',
      eventDate: '2024-08-03T20:00:00Z',
      venue: 'Private Residence'
    },
    {
      id: '3',
      bookingId: 'booking3',
      reviewerId: 'customer3',
      reviewerName: 'Lisa Williams',
      reviewerEmail: 'lisa@example.com',
      rating: 5,
      comment: 'Absolutely fantastic! Perfect music for our corporate event. Very responsive to requests and great communication throughout.',
      commentTh: null,
      punctuality: 5,
      performance: 5,
      professionalism: 5,
      valueForMoney: 5,
      isVerified: true,
      isPublic: true,
      createdAt: '2024-08-02T11:20:00Z',
      artistResponse: 'Thank you for the wonderful review! I enjoyed playing for your team event.',
      respondedAt: '2024-08-02T18:30:00Z',
      eventType: 'Corporate Event',
      eventDate: '2024-07-28T18:30:00Z',
      venue: 'Centara Grand'
    },
    {
      id: '4',
      bookingId: 'booking4',
      reviewerId: 'customer4',
      reviewerName: 'David Park',
      reviewerEmail: 'david@example.com',
      rating: 3,
      comment: 'Average performance. The music was okay but not very engaging. Expected more energy and crowd interaction.',
      commentTh: null,
      punctuality: 4,
      performance: 3,
      professionalism: 4,
      valueForMoney: 3,
      isVerified: true,
      isPublic: true,
      createdAt: '2024-07-25T13:10:00Z',
      artistResponse: null,
      respondedAt: null,
      eventType: 'Private Party',
      eventDate: '2024-07-20T19:00:00Z',
      venue: 'Private Villa'
    }
  ]

  // Calculate stats
  const stats = {
    totalReviews: mockReviews.length,
    averageRating: mockReviews.reduce((sum, review) => sum + review.rating, 0) / mockReviews.length,
    responseRate: Math.round((mockReviews.filter(r => r.artistResponse).length / mockReviews.length) * 100),
    ratingBreakdown: {
      5: mockReviews.filter(r => r.rating === 5).length,
      4: mockReviews.filter(r => r.rating === 4).length,
      3: mockReviews.filter(r => r.rating === 3).length,
      2: mockReviews.filter(r => r.rating === 2).length,
      1: mockReviews.filter(r => r.rating === 1).length
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-playfair text-3xl font-bold text-dark-gray">
          Reviews & Ratings
        </h1>
        <p className="mt-2 text-dark-gray">
          View and respond to client reviews to build trust and improve your service.
        </p>
      </div>

      {/* Reviews Manager */}
      <ReviewsManager 
        artistId={artist.id}
        reviews={mockReviews}
        stats={stats}
        locale={locale}
      />
    </div>
  )
}