import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AvailabilityCalendar from '@/components/dashboard/AvailabilityCalendar'

export default async function AvailabilityPage({
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

  // Mock availability data - will be replaced with real API calls
  const mockAvailability = [
    {
      id: '1',
      date: '2024-08-15',
      startTime: '09:00',
      endTime: '17:00',
      isAvailable: true,
      isBooked: false
    },
    {
      id: '2',
      date: '2024-08-16',
      startTime: '18:00',
      endTime: '23:00',
      isAvailable: true,
      isBooked: true // Has a booking
    },
    {
      id: '3',
      date: '2024-08-17',
      startTime: '00:00',
      endTime: '23:59',
      isAvailable: false, // Blocked day
      isBooked: false
    }
  ]

  const mockBookings = [
    {
      id: '1',
      date: '2024-08-16',
      startTime: '19:00',
      endTime: '23:00',
      eventType: 'Wedding Reception',
      venue: 'Grand Hyatt Bangkok',
      status: 'CONFIRMED'
    },
    {
      id: '2',
      date: '2024-08-20',
      startTime: '18:30',
      endTime: '22:30',
      eventType: 'Corporate Event',
      venue: 'Centara Grand',
      status: 'CONFIRMED'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-playfair text-3xl font-bold text-dark-gray">
          Availability Calendar
        </h1>
        <p className="mt-2 text-dark-gray">
          Manage your availability and block dates for personal events.
        </p>
      </div>

      {/* Calendar Component */}
      <AvailabilityCalendar 
        artistId={artist.id}
        availability={mockAvailability}
        bookings={mockBookings}
        locale={locale}
      />
    </div>
  )
}