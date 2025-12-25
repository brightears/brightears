'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'

interface BookingStatusTrackerProps {
  bookingId: string
  currentStatus: string
  locale: string
  userRole: 'ARTIST' | 'CUSTOMER'
  onStatusUpdate?: () => void
}

type BookingStatus = 'INQUIRY' | 'QUOTED' | 'CONFIRMED' | 'PAID' | 'COMPLETED' | 'CANCELLED'

const statusFlow: BookingStatus[] = ['INQUIRY', 'QUOTED', 'CONFIRMED', 'PAID', 'COMPLETED']

export default function BookingStatusTracker({ 
  bookingId, 
  currentStatus, 
  locale, 
  userRole,
  onStatusUpdate 
}: BookingStatusTrackerProps) {
  const t = useTranslations('bookingStatus')
  const [isLoading, setIsLoading] = useState(false)
  const [customNote, setCustomNote] = useState('')
  const [showNoteInput, setShowNoteInput] = useState(false)

  const getStatusColor = (status: BookingStatus, isCurrent: boolean = false) => {
    if (status === 'CANCELLED') return 'bg-red-500'
    if (isCurrent) {
      switch (status) {
        case 'INQUIRY': return 'bg-yellow-500'
        case 'QUOTED': return 'bg-orange-500'
        case 'CONFIRMED': return 'bg-green-500'
        case 'PAID': return 'bg-blue-500'
        case 'COMPLETED': return 'bg-purple-500'
        default: return 'bg-gray-500'
      }
    }
    
    const currentIndex = statusFlow.indexOf(currentStatus as BookingStatus)
    const statusIndex = statusFlow.indexOf(status)
    
    if (statusIndex <= currentIndex) return 'bg-green-500'
    return 'bg-gray-300'
  }

  const getStatusText = (status: BookingStatus) => {
    const statusMap = {
      'INQUIRY': { en: 'Inquiry Submitted', th: 'ส่งคำขอแล้ว' },
      'QUOTED': { en: 'Quote Provided', th: 'ให้ใบเสนอราคาแล้ว' },
      'CONFIRMED': { en: 'Booking Confirmed', th: 'ยืนยันการจองแล้ว' },
      'PAID': { en: 'Payment Received', th: 'ได้รับชำระเงินแล้ว' },
      'COMPLETED': { en: 'Event Completed', th: 'งานเสร็จสิ้น' },
      'CANCELLED': { en: 'Cancelled', th: 'ยกเลิก' }
    }
    return locale === 'th' ? statusMap[status].th : statusMap[status].en
  }

  const canUpdateStatus = (targetStatus: BookingStatus) => {
    if (userRole === 'CUSTOMER') {
      // Customers can only cancel inquiries
      return currentStatus === 'INQUIRY' && targetStatus === 'CANCELLED'
    }
    
    // Artists can update status in sequence
    const currentIndex = statusFlow.indexOf(currentStatus as BookingStatus)
    const targetIndex = statusFlow.indexOf(targetStatus)
    
    switch (targetStatus) {
      case 'QUOTED':
        return currentStatus === 'INQUIRY'
      case 'CONFIRMED':
        return currentStatus === 'INQUIRY' || currentStatus === 'QUOTED'
      case 'PAID':
        return currentStatus === 'CONFIRMED'
      case 'COMPLETED':
        return currentStatus === 'PAID'
      case 'CANCELLED':
        return ['INQUIRY', 'QUOTED', 'CONFIRMED'].includes(currentStatus as BookingStatus)
      default:
        return false
    }
  }

  const updateBookingStatus = async (newStatus: BookingStatus, note?: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          notes: note,
          cancellationReason: newStatus === 'CANCELLED' ? note : undefined
        }),
      })

      if (response.ok) {
        onStatusUpdate?.()
      } else {
        const error = await response.json()
        alert(error.error || t('updateError'))
      }
    } catch (error) {
      alert(t('updateError'))
    } finally {
      setIsLoading(false)
      setShowNoteInput(false)
      setCustomNote('')
    }
  }

  const handleStatusClick = (status: BookingStatus) => {
    if (!canUpdateStatus(status) || isLoading) return

    if (status === 'CANCELLED' || status === 'QUOTED') {
      setShowNoteInput(true)
    } else {
      updateBookingStatus(status)
    }
  }

  return (
    <div className="space-y-6">
      {/* Status Timeline */}
      <div className="relative">
        <div className="flex items-center justify-between">
          {statusFlow.map((status, index) => {
            const isActive = status === currentStatus
            const canUpdate = canUpdateStatus(status)
            
            return (
              <div key={status} className="flex flex-col items-center relative flex-1">
                {/* Status Circle */}
                <button
                  onClick={() => handleStatusClick(status)}
                  disabled={!canUpdate || isLoading}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium
                    ${getStatusColor(status, isActive)}
                    ${canUpdate && !isLoading ? 'cursor-pointer hover:scale-105' : 'cursor-default'}
                    ${isLoading ? 'opacity-50' : ''}
                    transition-all duration-200
                  `}
                >
                  {isActive && isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </button>
                
                {/* Status Label */}
                <span className={`
                  mt-2 text-xs text-center
                  ${isActive ? 'font-semibold text-dark-gray' : 'text-gray-500'}
                `}>
                  {getStatusText(status)}
                </span>
                
                {/* Connector Line */}
                {index < statusFlow.length - 1 && (
                  <div className={`
                    absolute top-5 left-1/2 transform -translate-y-1/2 w-full h-0.5
                    ${statusFlow.indexOf(currentStatus as BookingStatus) > index ? 'bg-green-500' : 'bg-gray-300'}
                  `} style={{ marginLeft: '20px', width: 'calc(100% - 40px)' }} />
                )}
              </div>
            )
          })}
        </div>

        {/* Cancelled Status (separate) */}
        {currentStatus === 'CANCELLED' && (
          <div className="mt-4 flex justify-center">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white text-sm font-medium">
                ✕
              </div>
              <span className="mt-2 text-xs font-semibold text-red-600">
                {getStatusText('CANCELLED')}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Status Update Actions */}
      {userRole === 'ARTIST' && currentStatus !== 'COMPLETED' && currentStatus !== 'CANCELLED' && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-dark-gray mb-3">{t('quickActions')}</h4>
          <div className="flex flex-wrap gap-2">
            {currentStatus === 'INQUIRY' && (
              <>
                <button
                  onClick={() => setShowNoteInput(true)}
                  disabled={isLoading}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 text-sm"
                >
                  {t('sendQuote')}
                </button>
                <button
                  onClick={() => updateBookingStatus('CONFIRMED')}
                  disabled={isLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm"
                >
                  {t('acceptDirectly')}
                </button>
              </>
            )}
            
            {currentStatus === 'QUOTED' && (
              <button
                onClick={() => updateBookingStatus('CONFIRMED')}
                disabled={isLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm"
              >
                {t('confirmBooking')}
              </button>
            )}
            
            {currentStatus === 'CONFIRMED' && (
              <button
                onClick={() => updateBookingStatus('PAID')}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
              >
                {t('markAsPaid')}
              </button>
            )}
            
            {currentStatus === 'PAID' && (
              <button
                onClick={() => updateBookingStatus('COMPLETED')}
                disabled={isLoading}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 text-sm"
              >
                {t('markAsCompleted')}
              </button>
            )}

            {['INQUIRY', 'QUOTED', 'CONFIRMED'].includes(currentStatus) && (
              <button
                onClick={() => setShowNoteInput(true)}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm"
              >
                {t('cancelBooking')}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Customer Actions */}
      {userRole === 'CUSTOMER' && currentStatus === 'INQUIRY' && (
        <div className="bg-yellow-50 rounded-lg p-4">
          <h4 className="font-medium text-dark-gray mb-3">{t('pendingResponse')}</h4>
          <p className="text-sm text-gray-600 mb-3">{t('pendingResponseDescription')}</p>
          <button
            onClick={() => setShowNoteInput(true)}
            disabled={isLoading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm"
          >
            {t('cancelRequest')}
          </button>
        </div>
      )}

      {/* Note Input Modal */}
      {showNoteInput && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-dark-gray bg-opacity-50" onClick={() => setShowNoteInput(false)} />
            <div className="relative bg-pure-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="font-playfair text-lg font-semibold text-dark-gray mb-4">
                {currentStatus === 'INQUIRY' && userRole === 'ARTIST' ? t('sendQuote') : 
                 currentStatus === 'INQUIRY' && userRole === 'CUSTOMER' ? t('cancelRequest') : 
                 t('addNote')}
              </h3>
              
              <textarea
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder={t('notePlaceholder')}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent"
                rows={4}
                required
              />
              
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={() => setShowNoteInput(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-dark-gray rounded-lg hover:bg-gray-300"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={() => {
                    if (currentStatus === 'INQUIRY' && userRole === 'ARTIST') {
                      updateBookingStatus('QUOTED', customNote)
                    } else {
                      updateBookingStatus('CANCELLED', customNote)
                    }
                  }}
                  disabled={!customNote.trim() || isLoading}
                  className="flex-1 px-4 py-2 bg-brand-cyan text-pure-white rounded-lg hover:bg-brand-cyan/80 disabled:opacity-50"
                >
                  {isLoading ? t('sending') : t('send')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}