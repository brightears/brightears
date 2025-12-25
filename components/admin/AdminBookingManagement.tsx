'use client'

import { useState, useEffect } from 'react'
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  XMarkIcon,
  CheckIcon,
  CalendarIcon,
  BanknotesIcon,
  ChatBubbleLeftIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface Booking {
  id: string
  bookingNumber: string
  status: string
  eventDate: string
  eventLocation: string
  eventType: string
  createdAt: string
  finalPrice: number
  totalPaid: number
  remainingAmount: number
  artist: {
    id: string
    stageName: string
    name: string
    email: string
    profileImage: string | null
    verificationStatus: string
  }
  customer: {
    id: string
    name: string
    email: string
    profileImage: string | null
  }
  messageCount: number
  quotesCount: number
  paymentsCount: number
  latestQuote: {
    id: string
    amount: number
    status: string
    createdAt: string
  } | null
  paymentStatus: {
    hasDeposit: boolean
    hasPendingPayments: boolean
    lastPayment: any
  } | null
}

interface BookingSearchResponse {
  bookings: Booking[]
  pagination: {
    currentPage: number
    totalPages: number
    totalBookings: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

interface AdminBookingManagementProps {
  locale: string
}

export default function AdminBookingManagement({ locale }: AdminBookingManagementProps) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalBookings, setTotalBookings] = useState(0)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchBookings()
  }, [searchQuery, statusFilter, startDate, endDate, currentPage])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchQuery) params.set('search', searchQuery)
      if (statusFilter) params.set('status', statusFilter)
      if (startDate) params.set('startDate', startDate)
      if (endDate) params.set('endDate', endDate)
      params.set('page', currentPage.toString())
      params.set('limit', '20')

      const response = await fetch(`/api/admin/bookings?${params}`)
      if (response.ok) {
        const data: BookingSearchResponse = await response.json()
        setBookings(data.bookings)
        setTotalPages(data.pagination.totalPages)
        setTotalBookings(data.pagination.totalBookings)
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBookingAction = async (bookingId: string, action: string, data?: any) => {
    try {
      setActionLoading(true)
      let response

      switch (action) {
        case 'view':
          response = await fetch(`/api/admin/bookings/${bookingId}`)
          if (response.ok) {
            const bookingData = await response.json()
            setSelectedBooking(bookingData.booking)
            setShowBookingModal(true)
          }
          break
        case 'updateStatus':
          response = await fetch('/api/admin/bookings', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bookingId, ...data })
          })
          if (response.ok) {
            fetchBookings()
          }
          break
        case 'cancel':
          response = await fetch(`/api/admin/bookings/${bookingId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'cancel', reason: data.reason })
          })
          if (response.ok) {
            fetchBookings()
            setShowBookingModal(false)
          }
          break
        case 'refund':
          response = await fetch(`/api/admin/bookings/${bookingId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'refund', amount: data.amount, reason: data.reason })
          })
          if (response.ok) {
            fetchBookings()
            setShowBookingModal(false)
          }
          break
      }
    } catch (error) {
      console.error(`Failed to ${action} booking:`, error)
    } finally {
      setActionLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'PAID':
        return 'bg-blue-100 text-blue-800'
      case 'CONFIRMED':
        return 'bg-purple-100 text-purple-800'
      case 'QUOTED':
        return 'bg-yellow-100 text-yellow-800'
      case 'INQUIRY':
        return 'bg-gray-100 text-gray-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale === 'th' ? 'th-TH' : 'en-US')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-playfair font-bold text-dark-gray mb-2">
            Booking Management
          </h1>
          <p className="text-dark-gray/70 font-inter">
            Manage platform bookings and handle disputes
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-cyan focus:border-brand-cyan"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-cyan focus:border-brand-cyan"
            >
              <option value="">All Status</option>
              <option value="INQUIRY">Inquiry</option>
              <option value="QUOTED">Quoted</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PAID">Paid</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            {/* Date Range */}
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-cyan focus:border-brand-cyan"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-cyan focus:border-brand-cyan"
            />

            {/* Results Count */}
            <div className="flex items-center text-sm text-dark-gray/70">
              {totalBookings} bookings found
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-cyan mx-auto"></div>
              <p className="text-dark-gray/70 mt-2">Loading bookings...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Booking
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Participants
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Event
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Financial
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Activity
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {booking.bookingNumber}
                            </div>
                            <div className="flex items-center mt-1">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                                {booking.status}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Created: {formatDate(booking.createdAt)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <div className="text-sm">
                                <div className="font-medium text-gray-900">
                                  🎵 {booking.artist.stageName}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {booking.artist.email}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <div className="text-sm">
                                <div className="font-medium text-gray-900">
                                  👤 {booking.customer.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {booking.customer.email}
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {booking.eventType}
                            </div>
                            <div className="text-sm text-gray-500">
                              📍 {booking.eventLocation}
                            </div>
                            <div className="text-xs text-gray-500">
                              📅 {formatDate(booking.eventDate)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {formatCurrency(booking.finalPrice)}
                            </div>
                            <div className="text-xs text-green-600">
                              Paid: {formatCurrency(booking.totalPaid)}
                            </div>
                            {booking.remainingAmount > 0 && (
                              <div className="text-xs text-red-600">
                                Remaining: {formatCurrency(booking.remainingAmount)}
                              </div>
                            )}
                            {booking.paymentStatus?.hasPendingPayments && (
                              <div className="text-xs text-yellow-600">
                                ⏳ Pending verification
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-3 text-xs text-gray-500">
                            <div className="flex items-center">
                              <ChatBubbleLeftIcon className="w-3 h-3 mr-1" />
                              {booking.messageCount}
                            </div>
                            <div className="flex items-center">
                              <BanknotesIcon className="w-3 h-3 mr-1" />
                              {booking.paymentsCount}
                            </div>
                            <div className="flex items-center">
                              <CalendarIcon className="w-3 h-3 mr-1" />
                              {booking.quotesCount}
                            </div>
                          </div>
                          {booking.latestQuote && (
                            <div className="text-xs text-gray-500 mt-1">
                              Latest quote: {formatCurrency(booking.latestQuote.amount)}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleBookingAction(booking.id, 'view')}
                              className="text-brand-cyan hover:text-brand-cyan/80"
                              title="View Details"
                            >
                              <EyeIcon className="w-4 h-4" />
                            </button>
                            {booking.status !== 'COMPLETED' && booking.status !== 'CANCELLED' && (
                              <button
                                onClick={() => {
                                  const status = prompt('Enter new status (QUOTED, CONFIRMED, PAID, COMPLETED, CANCELLED):')
                                  if (status) {
                                    handleBookingAction(booking.id, 'updateStatus', { status })
                                  }
                                }}
                                className="text-earthy-brown hover:text-earthy-brown/80"
                                title="Update Status"
                              >
                                <PencilIcon className="w-4 h-4" />
                              </button>
                            )}
                            {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
                              <button
                                onClick={() => {
                                  const reason = prompt('Reason for cancellation:')
                                  if (reason && confirm('Are you sure you want to cancel this booking?')) {
                                    handleBookingAction(booking.id, 'cancel', { reason })
                                  }
                                }}
                                className="text-red-600 hover:text-red-800"
                                title="Cancel Booking"
                              >
                                <XMarkIcon className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{(currentPage - 1) * 20 + 1}</span> to{' '}
                        <span className="font-medium">{Math.min(currentPage * 20, totalBookings)}</span> of{' '}
                        <span className="font-medium">{totalBookings}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              page === currentPage
                                ? 'z-10 bg-brand-cyan border-brand-cyan text-white'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Loading Overlay */}
      {actionLoading && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-cyan"></div>
            <span className="text-gray-700">Processing...</span>
          </div>
        </div>
      )}
    </div>
  )
}