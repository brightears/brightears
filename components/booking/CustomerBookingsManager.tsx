'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import BookingMessaging from './BookingMessaging'

type BookingStatus = 'INQUIRY' | 'QUOTED' | 'CONFIRMED' | 'PAID' | 'COMPLETED' | 'CANCELLED'

interface Booking {
  id: string
  bookingNumber: string
  artistId: string
  artistName: string
  artistImage?: string
  artistCategory: string
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
  lastMessage?: {
    id: string
    content: string
    createdAt: string
    isRead: boolean
    sender: {
      id: string
      role: string
    }
  } | null
  unreadMessages: number
}

interface CustomerBookingsManagerProps {
  bookings: Booking[]
  locale: string
}

const statusFilters = [
  { key: 'all', label: 'All Bookings', labelTh: 'ทั้งหมด', color: 'bg-gray-100 text-gray-800' },
  { key: 'INQUIRY', label: 'Pending', labelTh: 'รอตอบ', color: 'bg-yellow-100 text-yellow-800' },
  { key: 'CONFIRMED', label: 'Confirmed', labelTh: 'ยืนยันแล้ว', color: 'bg-green-100 text-green-800' },
  { key: 'COMPLETED', label: 'Completed', labelTh: 'เสร็จสิ้น', color: 'bg-blue-100 text-blue-800' },
  { key: 'CANCELLED', label: 'Cancelled', labelTh: 'ยกเลิก', color: 'bg-red-100 text-red-800' }
]

export default function CustomerBookingsManager({ bookings, locale }: CustomerBookingsManagerProps) {
  const t = useTranslations('customerBookings')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showMessaging, setShowMessaging] = useState(false)
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

  const getStatusText = (status: BookingStatus) => {
    const statusMap = {
      'INQUIRY': { en: 'Pending Response', th: 'รอตอบ' },
      'QUOTED': { en: 'Quote Received', th: 'ได้รับใบเสนอราคา' },
      'CONFIRMED': { en: 'Confirmed', th: 'ยืนยันแล้ว' },
      'PAID': { en: 'Paid', th: 'ชำระแล้ว' },
      'COMPLETED': { en: 'Completed', th: 'เสร็จสิ้น' },
      'CANCELLED': { en: 'Cancelled', th: 'ยกเลิก' }
    }
    return locale === 'th' ? statusMap[status].th : statusMap[status].en
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale === 'th' ? 'th-TH' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString(locale === 'th' ? 'th-TH' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm(t('confirmCancel'))) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: 'CANCELLED',
          cancellationReason: 'Cancelled by customer'
        }),
      })

      if (response.ok) {
        window.location.reload()
      } else {
        alert(t('cancelError'))
      }
    } catch (error) {
      alert(t('cancelError'))
    }
    setIsLoading(false)
  }

  const canCancel = (booking: Booking) => {
    return booking.status === 'INQUIRY' || booking.status === 'QUOTED'
  }

  const canMessage = (booking: Booking) => {
    return booking.status !== 'CANCELLED'
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statusFilters.filter(f => f.key !== 'all').map((filter) => {
          const count = bookings.filter(b => b.status === filter.key).length
          return (
            <div key={filter.key} className="bg-pure-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-dark-gray">{count}</p>
                  <p className="text-sm text-gray-600">
                    {locale === 'th' ? filter.labelTh : filter.label}
                  </p>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${filter.color}`}>
                  <span className="text-lg">📅</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

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
              {locale === 'th' ? filter.labelTh : filter.label}
              <span className={`ml-2 px-2 py-1 text-xs rounded-full ${filter.color}`}>
                {filter.key === 'all' ? bookings.length : bookings.filter(b => b.status === filter.key).length}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-playfair font-semibold text-dark-gray mb-2">
              {t('noBookings')}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('noBookingsDescription')}
            </p>
            <Link 
              href={`/${locale}/artists`}
              className="inline-block px-6 py-3 bg-brand-cyan text-pure-white font-semibold rounded-lg hover:bg-brand-cyan/80 transition"
            >
              {t('browseArtists')}
            </Link>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-pure-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    {booking.artistImage && (
                      <Image
                        src={booking.artistImage}
                        alt={booking.artistName}
                        width={60}
                        height={60}
                        className="rounded-full object-cover"
                      />
                    )}
                    <div>
                      <h3 className="font-playfair text-lg font-semibold text-dark-gray">
                        {booking.artistName}
                      </h3>
                      <p className="text-sm text-gray-600">{booking.artistCategory}</p>
                      <p className="text-sm text-gray-500">#{booking.bookingNumber}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 flex items-center space-x-3">
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                      {getStatusText(booking.status)}
                    </span>
                    {booking.unreadMessages > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {booking.unreadMessages} {t('newMessages')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Event Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">{t('event')}</p>
                    <p className="font-medium">{booking.eventType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('dateTime')}</p>
                    <p className="font-medium">{formatDate(booking.eventDate)}</p>
                    <p className="text-sm text-gray-500">
                      {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('venue')}</p>
                    <p className="font-medium">{booking.venue}</p>
                  </div>
                </div>

                {/* Pricing */}
                {(booking.quotedPrice || booking.finalPrice) && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">{t('price')}</p>
                    <p className="text-lg font-semibold text-brand-cyan">
                      ฿{(booking.finalPrice || booking.quotedPrice || 0).toLocaleString()} {booking.currency}
                    </p>
                  </div>
                )}

                {/* Last Message Preview */}
                {booking.lastMessage && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <div className="flex justify-between items-start">
                      <p className="text-sm text-gray-700 flex-1">
                        <strong>
                          {booking.lastMessage.sender.role === 'ARTIST' ? booking.artistName : t('you')}:
                        </strong> {' '}
                        {booking.lastMessage.content.length > 100 
                          ? `${booking.lastMessage.content.substring(0, 100)}...`
                          : booking.lastMessage.content
                        }
                      </p>
                      <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                        {formatDate(booking.lastMessage.createdAt)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="px-4 py-2 text-brand-cyan border border-brand-cyan rounded-lg hover:bg-brand-cyan hover:text-pure-white transition"
                  >
                    {t('viewDetails')}
                  </button>
                  
                  {canMessage(booking) && (
                    <button
                      onClick={() => {
                        setSelectedBooking(booking)
                        setShowMessaging(true)
                      }}
                      className="px-4 py-2 bg-brand-cyan text-pure-white rounded-lg hover:bg-brand-cyan/80 transition"
                    >
                      {t('message')}
                      {booking.unreadMessages > 0 && (
                        <span className="ml-2 bg-white text-brand-cyan px-2 py-1 text-xs rounded-full">
                          {booking.unreadMessages}
                        </span>
                      )}
                    </button>
                  )}
                  
                  {canCancel(booking) && (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      disabled={isLoading}
                      className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-600 hover:text-pure-white transition disabled:opacity-50"
                    >
                      {t('cancel')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && !showMessaging && (
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
                    {t('bookingDetails')} - #{selectedBooking.bookingNumber}
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
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedBooking.status)}`}>
                    {getStatusText(selectedBooking.status)}
                  </span>
                  {selectedBooking.status === 'INQUIRY' && (
                    <p className="text-sm text-gray-600">{t('pendingResponse')}</p>
                  )}
                </div>

                {/* Artist Info */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-playfair text-lg font-medium text-dark-gray mb-3">{t('artistInfo')}</h3>
                  <div className="flex items-center space-x-4">
                    {selectedBooking.artistImage && (
                      <Image
                        src={selectedBooking.artistImage}
                        alt={selectedBooking.artistName}
                        width={50}
                        height={50}
                        className="rounded-full object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium">{selectedBooking.artistName}</p>
                      <p className="text-sm text-gray-600">{selectedBooking.artistCategory}</p>
                    </div>
                  </div>
                </div>

                {/* Event Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-playfair text-lg font-medium text-dark-gray mb-3">{t('eventDetails')}</h3>
                    <div className="space-y-2 text-sm">
                      <div><strong>{t('type')}:</strong> {selectedBooking.eventType}</div>
                      <div><strong>{t('date')}:</strong> {formatDate(selectedBooking.eventDate)}</div>
                      <div><strong>{t('time')}:</strong> {formatTime(selectedBooking.startTime)} - {formatTime(selectedBooking.endTime)}</div>
                      <div><strong>{t('duration')}:</strong> {selectedBooking.duration} {t('hours')}</div>
                      {selectedBooking.guestCount && <div><strong>{t('guests')}:</strong> {selectedBooking.guestCount}</div>}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-playfair text-lg font-medium text-dark-gray mb-3">{t('venueInfo')}</h3>
                    <div className="space-y-2 text-sm">
                      <div><strong>{t('name')}:</strong> {selectedBooking.venue}</div>
                      <div><strong>{t('address')}:</strong> {selectedBooking.venueAddress}</div>
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                {(selectedBooking.quotedPrice || selectedBooking.finalPrice) && (
                  <div>
                    <h3 className="font-playfair text-lg font-medium text-dark-gray mb-3">{t('pricing')}</h3>
                    <div className="text-sm space-y-2">
                      {selectedBooking.quotedPrice && (
                        <div><strong>{t('quotedPrice')}:</strong> ฿{selectedBooking.quotedPrice.toLocaleString()} {selectedBooking.currency}</div>
                      )}
                      {selectedBooking.finalPrice && (
                        <div><strong>{t('finalPrice')}:</strong> ฿{selectedBooking.finalPrice.toLocaleString()} {selectedBooking.currency}</div>
                      )}
                    </div>
                  </div>
                )}

                {/* Special Requests */}
                {selectedBooking.specialRequests && (
                  <div>
                    <h3 className="font-playfair text-lg font-medium text-dark-gray mb-3">{t('specialRequests')}</h3>
                    <p className="text-sm bg-gray-50 p-3 rounded-md">{selectedBooking.specialRequests}</p>
                  </div>
                )}

                {/* Notes */}
                {selectedBooking.notes && (
                  <div>
                    <h3 className="font-playfair text-lg font-medium text-dark-gray mb-3">{t('notes')}</h3>
                    <p className="text-sm bg-blue-50 p-3 rounded-md">{selectedBooking.notes}</p>
                  </div>
                )}

                {/* Timeline */}
                <div>
                  <h3 className="font-playfair text-lg font-medium text-dark-gray mb-3">{t('timeline')}</h3>
                  <div className="text-sm space-y-1">
                    <div><strong>{t('created')}:</strong> {formatDate(selectedBooking.createdAt)} at {formatTime(selectedBooking.createdAt)}</div>
                    {selectedBooking.confirmedAt && (
                      <div><strong>{t('confirmed')}:</strong> {formatDate(selectedBooking.confirmedAt)} at {formatTime(selectedBooking.confirmedAt)}</div>
                    )}
                    {selectedBooking.completedAt && (
                      <div><strong>{t('completed')}:</strong> {formatDate(selectedBooking.completedAt)} at {formatTime(selectedBooking.completedAt)}</div>
                    )}
                    {selectedBooking.cancelledAt && (
                      <div><strong>{t('cancelled')}:</strong> {formatDate(selectedBooking.cancelledAt)} at {formatTime(selectedBooking.cancelledAt)}</div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-4 border-t">
                  {canMessage(selectedBooking) && (
                    <button
                      onClick={() => setShowMessaging(true)}
                      className="px-4 py-2 bg-brand-cyan text-pure-white rounded-lg hover:bg-brand-cyan/80 transition"
                    >
                      {t('message')} {selectedBooking.artistName}
                    </button>
                  )}
                  
                  {canCancel(selectedBooking) && (
                    <button
                      onClick={() => handleCancelBooking(selectedBooking.id)}
                      disabled={isLoading}
                      className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-600 hover:text-pure-white transition disabled:opacity-50"
                    >
                      {t('cancelBooking')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messaging Modal */}
      {selectedBooking && showMessaging && (
        <BookingMessaging
          booking={selectedBooking}
          locale={locale}
          onClose={() => {
            setShowMessaging(false)
            setSelectedBooking(null)
          }}
        />
      )}
    </div>
  )
}