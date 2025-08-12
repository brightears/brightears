'use client'

import { useState } from 'react'

interface AvailabilitySlot {
  id: string
  date: string
  startTime: string
  endTime: string
  isAvailable: boolean
  isBooked: boolean
}

interface Booking {
  id: string
  date: string
  startTime: string
  endTime: string
  eventType: string
  venue: string
  status: string
}

interface AvailabilityCalendarProps {
  artistId: string
  availability: AvailabilitySlot[]
  bookings: Booking[]
  locale: string
}

export default function AvailabilityCalendar({ 
  artistId, 
  availability, 
  bookings, 
  locale 
}: AvailabilityCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }
    
    return days
  }

  const getDateString = (day: number | null) => {
    if (!day) return ''
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    return new Date(year, month, day).toISOString().split('T')[0]
  }

  const getDayInfo = (day: number | null) => {
    if (!day) return null
    
    const dateString = getDateString(day)
    const availabilitySlot = availability.find(slot => slot.date === dateString)
    const dayBookings = bookings.filter(booking => booking.date === dateString)
    
    return {
      date: dateString,
      availability: availabilitySlot,
      bookings: dayBookings,
      isToday: dateString === new Date().toISOString().split('T')[0]
    }
  }

  const getDayClasses = (dayInfo: any) => {
    if (!dayInfo) return 'p-2 text-gray-300'
    
    let classes = 'p-2 cursor-pointer hover:bg-gray-100 relative transition-colors'
    
    if (dayInfo.isToday) {
      classes += ' bg-brand-cyan text-pure-white hover:bg-brand-cyan/90'
    } else if (dayInfo.bookings.length > 0) {
      classes += ' bg-green-100 text-green-800'
    } else if (dayInfo.availability && !dayInfo.availability.isAvailable) {
      classes += ' bg-red-100 text-red-800'
    } else if (dayInfo.availability && dayInfo.availability.isAvailable) {
      classes += ' bg-blue-100 text-blue-800'
    } else {
      classes += ' text-dark-gray'
    }
    
    return classes
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const handleDayClick = (day: number | null) => {
    if (!day) return
    const dateString = getDateString(day)
    setSelectedDate(dateString)
    setShowAvailabilityModal(true)
  }

  const handleAvailabilityUpdate = async (date: string, isAvailable: boolean, startTime?: string, endTime?: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/artist/availability', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date,
          isAvailable,
          startTime: startTime || '09:00',
          endTime: endTime || '23:00'
        }),
      })

      if (response.ok) {
        // Refresh the page or update state
        window.location.reload()
      } else {
        alert('Error updating availability')
      }
    } catch (error) {
      alert('Error updating availability')
    }
    setIsLoading(false)
    setShowAvailabilityModal(false)
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="space-y-6">
      {/* Calendar Controls */}
      <div className="bg-pure-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-playfair text-xl font-semibold text-dark-gray">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 text-dark-gray"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-4 py-2 rounded-md bg-brand-cyan text-pure-white hover:bg-brand-cyan/90"
            >
              Today
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 text-dark-gray"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {dayNames.map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {generateCalendarDays().map((day, index) => {
            const dayInfo = getDayInfo(day)
            return (
              <div
                key={index}
                className={`min-h-[80px] border border-gray-200 ${getDayClasses(dayInfo)}`}
                onClick={() => handleDayClick(day)}
              >
                {day && (
                  <div>
                    <div className="font-medium">{day}</div>
                    {dayInfo && dayInfo.bookings.length > 0 && (
                      <div className="text-xs mt-1">
                        {dayInfo.bookings.length} booking{dayInfo.bookings.length > 1 ? 's' : ''}
                      </div>
                    )}
                    {dayInfo && dayInfo.availability && !dayInfo.availability.isAvailable && (
                      <div className="text-xs mt-1">Blocked</div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-brand-cyan rounded"></div>
            <span>Today</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
            <span>Has Bookings</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
            <span>Blocked</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded"></div>
            <span>Not Set</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-pure-white rounded-lg shadow-md p-6">
          <h3 className="font-playfair text-lg font-semibold text-dark-gray mb-4">
            Block Multiple Days
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Going on vacation? Block multiple days at once.
          </p>
          <button className="w-full bg-red-600 text-pure-white py-2 px-4 rounded-md hover:bg-red-700">
            Block Date Range
          </button>
        </div>

        <div className="bg-pure-white rounded-lg shadow-md p-6">
          <h3 className="font-playfair text-lg font-semibold text-dark-gray mb-4">
            Set Weekly Pattern
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Set your regular weekly availability schedule.
          </p>
          <button className="w-full bg-blue-600 text-pure-white py-2 px-4 rounded-md hover:bg-blue-700">
            Weekly Schedule
          </button>
        </div>

        <div className="bg-pure-white rounded-lg shadow-md p-6">
          <h3 className="font-playfair text-lg font-semibold text-dark-gray mb-4">
            Import Calendar
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Sync with Google Calendar or other calendar apps.
          </p>
          <button className="w-full bg-earthy-brown text-pure-white py-2 px-4 rounded-md hover:bg-earthy-brown/90">
            Connect Calendar
          </button>
        </div>
      </div>

      {/* Availability Modal */}
      {showAvailabilityModal && selectedDate && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div 
              className="fixed inset-0 bg-dark-gray bg-opacity-50" 
              onClick={() => setShowAvailabilityModal(false)}
            />
            <div className="relative bg-pure-white rounded-lg shadow-xl max-w-md w-full">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-playfair text-lg font-semibold text-dark-gray">
                    Set Availability
                  </h3>
                  <button
                    onClick={() => setShowAvailabilityModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="px-6 py-4">
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    Date: <strong>{new Date(selectedDate).toLocaleDateString()}</strong>
                  </p>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => handleAvailabilityUpdate(selectedDate, true)}
                    disabled={isLoading}
                    className="w-full p-3 text-left rounded-lg border-2 border-green-200 hover:border-green-300 disabled:opacity-50"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <div>
                        <div className="font-medium text-green-700">Mark as Available</div>
                        <div className="text-sm text-green-600">Accept bookings for this day</div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleAvailabilityUpdate(selectedDate, false)}
                    disabled={isLoading}
                    className="w-full p-3 text-left rounded-lg border-2 border-red-200 hover:border-red-300 disabled:opacity-50"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                      <div>
                        <div className="font-medium text-red-700">Block This Day</div>
                        <div className="text-sm text-red-600">Not available for bookings</div>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Show existing bookings if any */}
                {bookings.filter(b => b.date === selectedDate).length > 0 && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-dark-gray mb-2">Existing Bookings</h4>
                    <div className="space-y-2">
                      {bookings.filter(b => b.date === selectedDate).map(booking => (
                        <div key={booking.id} className="text-sm bg-blue-50 p-2 rounded">
                          <div className="font-medium">{booking.eventType}</div>
                          <div className="text-gray-600">{booking.startTime} - {booking.endTime}</div>
                          <div className="text-gray-600">{booking.venue}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}