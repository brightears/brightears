import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import BookingsManager from '@/components/dashboard/BookingsManager'

export default async function BookingsPage({
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

  // Mock bookings data - will be replaced with real API calls
  const mockBookings = [
    {
      id: '1',
      bookingNumber: 'BE001',
      customerId: 'customer1',
      customerName: 'John Smith',
      customerEmail: 'john@example.com',
      eventType: 'Wedding Reception',
      eventDate: '2024-08-20T19:00:00Z',
      startTime: '2024-08-20T19:00:00Z',
      endTime: '2024-08-20T23:00:00Z',
      duration: 4,
      venue: 'Grand Hyatt Bangkok',
      venueAddress: '494 Rajdamri Road, Pathum Wan, Bangkok',
      guestCount: 150,
      quotedPrice: 15000,
      finalPrice: 15000,
      currency: 'THB',
      status: 'CONFIRMED',
      specialRequests: 'Please play some jazz during cocktail hour',
      notes: 'Customer prefers upbeat music for dancing',
      createdAt: '2024-08-10T10:00:00Z',
      confirmedAt: '2024-08-11T14:30:00Z'
    },
    {
      id: '2',
      bookingNumber: 'BE002',
      customerId: 'customer2',
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah@example.com',
      eventType: 'Corporate Event',
      eventDate: '2024-08-25T18:30:00Z',
      startTime: '2024-08-25T18:30:00Z',
      endTime: '2024-08-25T22:30:00Z',
      duration: 4,
      venue: 'Centara Grand at CentralWorld',
      venueAddress: '999/99 Rama I Road, Pathum Wan, Bangkok',
      guestCount: 200,
      quotedPrice: 20000,
      currency: 'THB',
      status: 'INQUIRY',
      specialRequests: 'Need background music during dinner, dance music after 9 PM',
      createdAt: '2024-08-12T09:15:00Z'
    },
    {
      id: '3',
      bookingNumber: 'BE003',
      customerId: 'customer3',
      customerName: 'Michael Chen',
      customerEmail: 'michael@example.com',
      eventType: 'Birthday Party',
      eventDate: '2024-08-15T20:00:00Z',
      startTime: '2024-08-15T20:00:00Z',
      endTime: '2024-08-16T01:00:00Z',
      duration: 5,
      venue: 'Private Residence',
      venueAddress: 'Sukhumvit 55, Watthana, Bangkok',
      guestCount: 50,
      quotedPrice: 12000,
      finalPrice: 12000,
      currency: 'THB',
      status: 'COMPLETED',
      specialRequests: 'Mix of 80s and current hits',
      createdAt: '2024-07-20T16:00:00Z',
      confirmedAt: '2024-07-21T11:00:00Z',
      completedAt: '2024-08-16T01:30:00Z'
    },
    {
      id: '4',
      bookingNumber: 'BE004',
      customerId: 'customer4',
      customerName: 'Lisa Williams',
      customerEmail: 'lisa@example.com',
      eventType: 'Graduation Party',
      eventDate: '2024-08-30T19:00:00Z',
      startTime: '2024-08-30T19:00:00Z',
      endTime: '2024-08-30T23:00:00Z',
      duration: 4,
      venue: 'Bangkok University',
      venueAddress: 'Rangsit Campus, Pathum Thani',
      guestCount: 100,
      quotedPrice: 18000,
      currency: 'THB',
      status: 'CANCELLED',
      specialRequests: 'Fun party music for young adults',
      cancellationReason: 'Event postponed due to weather concerns',
      createdAt: '2024-08-05T13:20:00Z',
      cancelledAt: '2024-08-08T10:45:00Z'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-playfair text-3xl font-bold text-dark-gray">
          Bookings Management
        </h1>
        <p className="mt-2 text-dark-gray">
          Review, accept, and manage your booking requests.
        </p>
      </div>

      {/* Bookings Manager */}
      <BookingsManager bookings={mockBookings} artistId={artist.id} locale={locale} />
    </div>
  )
}