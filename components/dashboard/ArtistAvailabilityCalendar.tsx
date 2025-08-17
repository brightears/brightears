'use client'

import { useState, useEffect } from 'react'

interface ArtistAvailabilityCalendarProps {
  artistId: string
  locale: string
}

export default function ArtistAvailabilityCalendar({ artistId, locale }: ArtistAvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [availability, setAvailability] = useState<Record<string, any[]>>({})
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false)
  const [bulkMode, setBulkMode] = useState(false)
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set())

  const [availabilityForm, setAvailabilityForm] = useState({
    isAvailable: true,
    startTime: '09:00',
    endTime: '17:00'
  })

  useEffect(() => {
    fetchData()
  }, [currentMonth, artistId])

  const fetchData = async () => {
    setLoading(true)
    try {
      const year = currentMonth.getFullYear()
      const month = currentMonth.getMonth() + 1
      
      const availabilityResponse = await fetch(
        `/api/artist/availability?year=${year}&month=${month}`
      )
      
      if (availabilityResponse.ok) {
        const availabilityData = await availabilityResponse.json()
        const availabilityByDate: Record<string, any[]> = {}
        
        availabilityData.availability.forEach((slot: any) => {
          const dateKey = new Date(slot.date).toISOString().split('T')[0]
          if (!availabilityByDate[dateKey]) {
            availabilityByDate[dateKey] = []
          }
          availabilityByDate[dateKey].push({
            id: slot.id,
            date: new Date(slot.date),
            startTime: new Date(slot.startTime),
            endTime: new Date(slot.endTime),
            isAvailable: slot.isAvailable,
            isBooked: slot.isBooked
          })
        })
        setAvailability(availabilityByDate)
      }
      
      const bookingsResponse = await fetch('/api/bookings')
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json()
        const monthBookings = bookingsData.bookings
          .filter((booking: any) => {
            const bookingDate = new Date(booking.eventDate)
            return bookingDate.getFullYear() === year && 
                   bookingDate.getMonth() === month - 1
          })
        setBookings(monthBookings)
      }
    } catch (error) {
      console.error('Error fetching calendar data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    return days
  }

  const getDateStatus = (date: Date | null) => {
    if (!date) return { type: 'empty', label: '' }
    
    const dateKey = date.toISOString().split('T')[0]
    const slots = availability[dateKey] || []
    const dayBookings = bookings.filter(booking => 
      new Date(booking.eventDate).toISOString().split('T')[0] === dateKey
    )

    if (dayBookings.length > 0) {
      return { type: 'booked', label: 'Booked' }
    }
    
    if (slots.length > 0) {
      const hasAvailable = slots.some(slot => slot.isAvailable)
      return { 
        type: hasAvailable ? 'available' : 'blocked', 
        label: hasAvailable ? 'Available' : 'Blocked'
      }
    }
    
    return { type: 'unset', label: 'Not Set' }
  }

  const handleDateClick = (date: Date | null) => {
    if (!date) return
    
    const dateKey = date.toISOString().split('T')[0]
    
    if (bulkMode) {
      const newSelected = new Set(selectedDates)
      if (newSelected.has(dateKey)) {
        newSelected.delete(dateKey)
      } else {
        newSelected.add(dateKey)
      }
      setSelectedDates(newSelected)
    } else {
      setSelectedDate(dateKey)
      
      const existingSlots = availability[dateKey]
      if (existingSlots && existingSlots.length > 0) {
        const firstSlot = existingSlots[0]
        setAvailabilityForm({
          isAvailable: firstSlot.isAvailable,
          startTime: firstSlot.startTime.toTimeString().slice(0, 5),
          endTime: firstSlot.endTime.toTimeString().slice(0, 5)
        })
      } else {
        setAvailabilityForm({
          isAvailable: true,
          startTime: '09:00',
          endTime: '17:00'
        })
      }
      
      setShowAvailabilityModal(true)
    }
  }

  const saveAvailability = async () => {
    if (!selectedDate && selectedDates.size === 0) return
    
    const datesToUpdate = bulkMode ? Array.from(selectedDates) : [selectedDate!]
    
    try {
      if (bulkMode) {
        const response = await fetch('/api/artist/availability', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            availabilities: datesToUpdate.map(date => ({
              date,
              ...availabilityForm
            }))
          })
        })
        
        if (!response.ok) throw new Error('Failed to update availability')
      } else {
        const response = await fetch('/api/artist/availability', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date: selectedDate,
            ...availabilityForm
          })
        })
        
        if (!response.ok) throw new Error('Failed to update availability')
      }
      
      await fetchData()
      setShowAvailabilityModal(false)
      setSelectedDate(null)
      setSelectedDates(new Set())
      setBulkMode(false)
      
    } catch (error) {
      console.error('Error saving availability:', error)
      alert('Failed to save availability. Please try again.')
    }
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev)
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1)
      } else {
        newMonth.setMonth(prev.getMonth() + 1)
      }
      return newMonth
    })
  }

  const formatMonthYear = (date: Date) => {
    if (locale === 'th') {
      return date.toLocaleDateString('th-TH', { month: 'long', year: 'numeric' })
    }
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const weekDays = locale === 'th' 
    ? ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const days = getDaysInMonth(currentMonth)

  return (
    <div className="space-y-6">
      <div className="bg-pure-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-off-white rounded-md transition-colors"
              disabled={loading}
            >
              <svg className="w-5 h-5 text-dark-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <h2 className="font-playfair text-2xl font-bold text-dark-gray">
              {formatMonthYear(currentMonth)}
            </h2>
            
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-off-white rounded-md transition-colors"
              disabled={loading}
            >
              <svg className="w-5 h-5 text-dark-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setBulkMode(!bulkMode)
                setSelectedDates(new Set())
              }}
              className={`px-4 py-2 rounded-md transition-colors ${
                bulkMode 
                  ? 'bg-brand-cyan text-white' 
                  : 'bg-off-white text-dark-gray hover:bg-brand-cyan/10'
              }`}
            >
              {bulkMode ? 'Exit Bulk Mode' : 'Bulk Edit'}
            </button>
            
            {bulkMode && selectedDates.size > 0 && (
              <button
                onClick={() => setShowAvailabilityModal(true)}
                className="px-4 py-2 bg-earthy-brown text-white rounded-md hover:bg-earthy-brown/90 transition-colors"
              >
                Set Availability ({selectedDates.size} dates)
              </button>
            )}
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-cyan"></div>
          </div>
        )}

        {!loading && (
          <>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day, index) => (
                <div key={index} className="text-center text-sm font-medium text-dark-gray/70 py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map((date, index) => {
                const dateKey = date?.toISOString().split('T')[0]
                const status = getDateStatus(date)
                const isSelected = bulkMode && dateKey && selectedDates.has(dateKey)

                return (
                  <button
                    key={index}
                    onClick={() => handleDateClick(date)}
                    disabled={!date}
                    className={`
                      aspect-square flex flex-col items-center justify-center text-sm rounded-md transition-all p-2
                      ${!date 
                        ? 'invisible' 
                        : status.type === 'booked'
                          ? 'bg-soft-lavender text-white cursor-pointer'
                          : status.type === 'available'
                            ? 'bg-green-100 text-green-800 cursor-pointer hover:bg-green-200'
                            : status.type === 'blocked'
                              ? 'bg-red-100 text-red-800 cursor-pointer hover:bg-red-200'
                              : 'bg-gray-50 text-gray-600 cursor-pointer hover:bg-brand-cyan/10'
                      }
                      ${isSelected ? 'ring-2 ring-brand-cyan ring-offset-2' : ''}
                    `}
                  >
                    {date && (
                      <>
                        <span className="font-medium">{date.getDate()}</span>
                        {status.type !== 'unset' && (
                          <span className="text-xs opacity-80">{status.label}</span>
                        )}
                      </>
                    )}
                  </button>
                )
              })}
            </div>

            <div className="mt-6 flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
                <span className="text-dark-gray/70">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
                <span className="text-dark-gray/70">Blocked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-soft-lavender rounded"></div>
                <span className="text-dark-gray/70">Booked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-50 border border-gray-200 rounded"></div>
                <span className="text-dark-gray/70">Not Set</span>
              </div>
            </div>
          </>
        )}
      </div>

      {showAvailabilityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-pure-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="font-playfair text-xl font-bold text-dark-gray mb-4">
              {bulkMode 
                ? `Set Availability for ${selectedDates.size} dates`
                : `Set Availability - ${selectedDate && new Date(selectedDate).toLocaleDateString(locale === 'th' ? 'th-TH' : 'en-US')}`
              }
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-gray mb-2">
                  Availability Status
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={availabilityForm.isAvailable}
                      onChange={() => setAvailabilityForm(prev => ({ ...prev, isAvailable: true }))}
                      className="mr-2"
                    />
                    Available
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={!availabilityForm.isAvailable}
                      onChange={() => setAvailabilityForm(prev => ({ ...prev, isAvailable: false }))}
                      className="mr-2"
                    />
                    Blocked
                  </label>
                </div>
              </div>

              {availabilityForm.isAvailable && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-dark-gray mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={availabilityForm.startTime}
                      onChange={(e) => setAvailabilityForm(prev => ({ ...prev, startTime: e.target.value }))}
                      className="w-full px-3 py-2 border border-brand-cyan/30 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-gray mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={availabilityForm.endTime}
                      onChange={(e) => setAvailabilityForm(prev => ({ ...prev, endTime: e.target.value }))}
                      className="w-full px-3 py-2 border border-brand-cyan/30 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={saveAvailability}
                className="flex-1 px-4 py-2 bg-brand-cyan text-white rounded-md hover:bg-brand-cyan/90 transition-colors"
              >
                Save Availability
              </button>
              <button
                onClick={() => {
                  setShowAvailabilityModal(false)
                  setSelectedDate(null)
                  setBulkMode(false)
                  setSelectedDates(new Set())
                }}
                className="px-4 py-2 bg-gray-200 text-dark-gray rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {bookings.length > 0 && (
        <div className="bg-pure-white rounded-lg shadow-md p-6">
          <h3 className="font-playfair text-xl font-bold text-dark-gray mb-4">
            Upcoming Bookings This Month
          </h3>
          <div className="space-y-3">
            {bookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-3 bg-off-white rounded-lg">
                <div>
                  <div className="font-medium text-dark-gray">{booking.eventType}</div>
                  <div className="text-sm text-dark-gray/70">{booking.venue}</div>
                  <div className="text-sm text-dark-gray/70">
                    {new Date(booking.eventDate).toLocaleDateString()} • {' '}
                    {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {' '}
                    {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  booking.status === 'CONFIRMED' 
                    ? 'bg-green-100 text-green-800'
                    : booking.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                }`}>
                  {booking.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}