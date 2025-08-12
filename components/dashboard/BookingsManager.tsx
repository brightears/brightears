'use client'

import { useState } from 'react'

type BookingStatus = 'INQUIRY' | 'QUOTED' | 'CONFIRMED' | 'PAID' | 'COMPLETED' | 'CANCELLED'

interface Booking {
  id: string
  bookingNumber: string
  customerId: string
  customerName: string
  customerEmail: string
  eventType: string
  eventDate: string
  startTime: string
  endTime: string
  duration: number
  venue: string
  venueAddress: string
  guestCount?: number
  quotedPrice?: number
  finalPrice?: number
  currency: string
  status: BookingStatus
  specialRequests?: string
  notes?: string
  cancellationReason?: string
  createdAt: string
  confirmedAt?: string
  completedAt?: string
  cancelledAt?: string
}

interface BookingsManagerProps {
  bookings: Booking[]
  artistId: string
  locale: string
}

const statusFilters = [
  { key: 'all', label: 'All Bookings', color: 'bg-gray-100 text-gray-800' },
  { key: 'INQUIRY', label: 'New Inquiries', color: 'bg-yellow-100 text-yellow-800' },
  { key: 'CONFIRMED', label: 'Confirmed', color: 'bg-green-100 text-green-800' },
  { key: 'COMPLETED', label: 'Completed', color: 'bg-blue-100 text-blue-800' },
  { key: 'CANCELLED', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
]

export default function BookingsManager({ bookings, artistId, locale }: BookingsManagerProps) {
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const filteredBookings = selectedFilter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === selectedFilter)

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'INQUIRY':
        return 'bg-yellow-100 text-yellow-800'
      case 'QUOTED':
        return 'bg-orange-100 text-orange-800'
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
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleStatusUpdate = async (bookingId: string, newStatus: BookingStatus) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        // Refresh the page or update state
        window.location.reload()
      } else {
        alert('Error updating booking status')
      }
    } catch (error) {
      alert('Error updating booking status')
    }
    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {statusFilters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setSelectedFilter(filter.key)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                selectedFilter === filter.key
                  ? 'border-brand-cyan text-brand-cyan'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {filter.label}
              <span className={`ml-2 px-2 py-1 text-xs rounded-full ${filter.color}`}>
                {filter.key === 'all' ? bookings.length : bookings.filter(b => b.status === filter.key).length}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Bookings List */}
      <div className="bg-pure-white rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    <div className="text-4xl mb-2">📅</div>
                    <p>No bookings found for this filter</p>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-dark-gray">
                          {booking.eventType}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.venue}
                        </div>
                        <div className="text-xs text-gray-400">
                          #{booking.bookingNumber}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-dark-gray">
                          {booking.customerName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.customerEmail}
                        </div>
                        {booking.guestCount && (
                          <div className="text-xs text-gray-400">
                            {booking.guestCount} guests
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-dark-gray">
                          {formatDate(booking.eventDate)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                        </div>
                        <div className="text-xs text-gray-400">
                          {booking.duration} hours
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-dark-gray">
                        ₿{(booking.finalPrice || booking.quotedPrice || 0).toLocaleString()} {booking.currency}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="text-brand-cyan hover:text-brand-cyan/80 text-sm font-medium"
                        >
                          View
                        </button>
                        {booking.status === 'INQUIRY' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(booking.id, 'CONFIRMED')}
                              disabled={isLoading}
                              className="text-green-600 hover:text-green-800 text-sm font-medium disabled:opacity-50"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(booking.id, 'CANCELLED')}
                              disabled={isLoading}
                              className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                            >
                              Decline
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div 
              className="fixed inset-0 bg-dark-gray bg-opacity-50" 
              onClick={() => setSelectedBooking(null)}
            />
            <div className="relative bg-pure-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-pure-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-playfair text-xl font-semibold text-dark-gray">
                    Booking Details - #{selectedBooking.bookingNumber}
                  </h2>
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="px-6 py-4 space-y-6">
                {/* Status */}
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedBooking.status)}`}>
                    {selectedBooking.status}
                  </span>
                  {selectedBooking.status === 'INQUIRY' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusUpdate(selectedBooking.id, 'CONFIRMED')}
                        disabled={isLoading}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                      >
                        Accept Booking
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(selectedBooking.id, 'CANCELLED')}
                        disabled={isLoading}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                      >
                        Decline Booking
                      </button>
                    </div>
                  )}
                </div>

                {/* Event Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-playfair text-lg font-medium text-dark-gray mb-3">Event Details</h3>
                    <div className="space-y-2 text-sm">
                      <div><strong>Type:</strong> {selectedBooking.eventType}</div>
                      <div><strong>Date:</strong> {formatDate(selectedBooking.eventDate)}</div>
                      <div><strong>Time:</strong> {formatTime(selectedBooking.startTime)} - {formatTime(selectedBooking.endTime)}</div>
                      <div><strong>Duration:</strong> {selectedBooking.duration} hours</div>
                      {selectedBooking.guestCount && <div><strong>Guests:</strong> {selectedBooking.guestCount}</div>}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-playfair text-lg font-medium text-dark-gray mb-3">Client Information</h3>
                    <div className="space-y-2 text-sm">
                      <div><strong>Name:</strong> {selectedBooking.customerName}</div>
                      <div><strong>Email:</strong> {selectedBooking.customerEmail}</div>
                    </div>
                  </div>
                </div>

                {/* Venue */}
                <div>
                  <h3 className="font-playfair text-lg font-medium text-dark-gray mb-3">Venue</h3>
                  <div className="text-sm">
                    <div className="font-medium">{selectedBooking.venue}</div>
                    <div className="text-gray-600">{selectedBooking.venueAddress}</div>
                  </div>
                </div>

                {/* Pricing */}
                <div>
                  <h3 className="font-playfair text-lg font-medium text-dark-gray mb-3">Pricing</h3>
                  <div className="text-sm space-y-2">
                    {selectedBooking.quotedPrice && (
                      <div><strong>Quoted Price:</strong> ₿{selectedBooking.quotedPrice.toLocaleString()} {selectedBooking.currency}</div>
                    )}
                    {selectedBooking.finalPrice && (
                      <div><strong>Final Price:</strong> ₿{selectedBooking.finalPrice.toLocaleString()} {selectedBooking.currency}</div>
                    )}
                  </div>
                </div>

                {/* Special Requests */}
                {selectedBooking.specialRequests && (
                  <div>
                    <h3 className="font-playfair text-lg font-medium text-dark-gray mb-3">Special Requests</h3>
                    <p className="text-sm bg-gray-50 p-3 rounded-md">{selectedBooking.specialRequests}</p>
                  </div>
                )}

                {/* Notes */}
                {selectedBooking.notes && (
                  <div>
                    <h3 className="font-playfair text-lg font-medium text-dark-gray mb-3">Notes</h3>
                    <p className="text-sm bg-blue-50 p-3 rounded-md">{selectedBooking.notes}</p>
                  </div>
                )}

                {/* Cancellation Reason */}
                {selectedBooking.cancellationReason && (
                  <div>
                    <h3 className="font-playfair text-lg font-medium text-dark-gray mb-3">Cancellation Reason</h3>
                    <p className="text-sm bg-red-50 p-3 rounded-md">{selectedBooking.cancellationReason}</p>
                  </div>
                )}

                {/* Timestamps */}
                <div>
                  <h3 className="font-playfair text-lg font-medium text-dark-gray mb-3">Timeline</h3>
                  <div className="text-sm space-y-1">
                    <div><strong>Created:</strong> {formatDate(selectedBooking.createdAt)} at {formatTime(selectedBooking.createdAt)}</div>
                    {selectedBooking.confirmedAt && (
                      <div><strong>Confirmed:</strong> {formatDate(selectedBooking.confirmedAt)} at {formatTime(selectedBooking.confirmedAt)}</div>
                    )}
                    {selectedBooking.completedAt && (
                      <div><strong>Completed:</strong> {formatDate(selectedBooking.completedAt)} at {formatTime(selectedBooking.completedAt)}</div>
                    )}
                    {selectedBooking.cancelledAt && (
                      <div><strong>Cancelled:</strong> {formatDate(selectedBooking.cancelledAt)} at {formatTime(selectedBooking.cancelledAt)}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}