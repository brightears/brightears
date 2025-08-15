import { Link } from '@/components/navigation'

interface Booking {
  id: string
  bookingNumber: string
  eventType: string
  eventDate: string
  venue: string
  status: 'INQUIRY' | 'QUOTED' | 'CONFIRMED' | 'PAID' | 'COMPLETED' | 'CANCELLED'
  amount: number
}

interface RecentBookingsProps {
  bookings: Booking[]
  locale: string
}

export default function RecentBookings({ bookings, locale }: RecentBookingsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'INQUIRY':
        return 'bg-gray-100 text-gray-800'
      case 'QUOTED':
        return 'bg-yellow-100 text-yellow-800'
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800'
      case 'PAID':
        return 'bg-blue-100 text-blue-800'
      case 'COMPLETED':
        return 'bg-purple-100 text-purple-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="bg-pure-white rounded-lg shadow-md">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="font-playfair text-xl font-semibold text-dark-gray">
            Recent Bookings
          </h2>
          <Link
            href={`/${locale}/dashboard/artist/bookings`}
            className="text-brand-cyan hover:text-brand-cyan/80 text-sm font-medium"
          >
            View All
          </Link>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Event
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Venue
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No bookings found
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-dark-gray">
                        {booking.eventType}
                      </div>
                      <div className="text-sm text-gray-500">
                        #{booking.bookingNumber}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-gray">
                    {formatDate(booking.eventDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-gray">
                    {booking.venue}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-dark-gray">
                    ₿{booking.amount.toLocaleString()} THB
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}