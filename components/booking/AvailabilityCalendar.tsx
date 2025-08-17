'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'

interface AvailabilitySlot {
  id: string
  date: Date
  startTime: Date
  endTime: Date
  isAvailable: boolean
}

interface AvailabilityCalendarProps {
  artistId: string
  selectedDate?: string
  onDateSelect: (date: string, availability?: AvailabilitySlot[]) => void
  locale: string
}

export default function AvailabilityCalendar({ 
  artistId, 
  selectedDate, 
  onDateSelect, 
  locale 
}: AvailabilityCalendarProps) {
  const t = useTranslations('booking')
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [availability, setAvailability] = useState<Record<string, AvailabilitySlot[]>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch availability for the current month
  useEffect(() => {
    fetchAvailability()
  }, [currentMonth, artistId])

  const fetchAvailability = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const year = currentMonth.getFullYear()
      const month = currentMonth.getMonth() + 1
      
      const response = await fetch(
        `/api/artists/${artistId}/availability?year=${year}&month=${month}`
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch availability')
      }
      
      const data = await response.json()
      
      // Group availability by date
      const availabilityByDate: Record<string, AvailabilitySlot[]> = {}
      
      data.availability.forEach((slot: any) => {
        const dateKey = new Date(slot.date).toISOString().split('T')[0]
        if (!availabilityByDate[dateKey]) {
          availabilityByDate[dateKey] = []
        }
        availabilityByDate[dateKey].push({
          id: slot.id,
          date: new Date(slot.date),
          startTime: new Date(slot.startTime),
          endTime: new Date(slot.endTime),
          isAvailable: slot.isAvailable
        })
      })
      
      setAvailability(availabilityByDate)
    } catch (error) {
      console.error('Error fetching availability:', error)
      setError('Failed to load availability')
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
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const isDateAvailable = (date: Date | null) => {
    if (!date) return false
    
    const dateKey = date.toISOString().split('T')[0]
    const slots = availability[dateKey]
    
    return slots && slots.length > 0 && slots.some(slot => slot.isAvailable)
  }

  const isDateInPast = (date: Date | null) => {
    if (!date) return false
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const compareDate = new Date(date)
    compareDate.setHours(0, 0, 0, 0)
    
    return compareDate < today
  }

  const handleDateClick = (date: Date | null) => {
    if (!date || isDateInPast(date) || !isDateAvailable(date)) return
    
    const dateKey = date.toISOString().split('T')[0]
    const slots = availability[dateKey] || []
    
    onDateSelect(dateKey, slots)
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
      return date.toLocaleDateString('th-TH', { 
        month: 'long', 
        year: 'numeric'
      })
    }
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    })
  }

  const weekDays = locale === 'th' 
    ? ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const days = getDaysInMonth(currentMonth)

  if (error) {
    return (
      <div className="bg-pure-white rounded-lg shadow-md p-6">
        <div className="text-center text-red-600">
          <p className="font-medium">Error loading calendar</p>
          <p className="text-sm mt-1">{error}</p>
          <button 
            onClick={fetchAvailability}
            className="mt-3 px-4 py-2 bg-brand-cyan text-white rounded-md hover:bg-brand-cyan/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-pure-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 hover:bg-off-white rounded-md transition-colors"
          disabled={loading}
        >
          <svg className="w-5 h-5 text-dark-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h3 className="font-playfair text-xl font-bold text-dark-gray">
          {formatMonthYear(currentMonth)}
        </h3>
        
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

      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-cyan"></div>
        </div>
      )}

      {!loading && (
        <>
          {/* Week days header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day, index) => (
              <div key={index} className="text-center text-sm font-medium text-dark-gray/70 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((date, index) => {
              const isSelected = date && selectedDate === date.toISOString().split('T')[0]
              const isAvailable = isDateAvailable(date)
              const isPast = isDateInPast(date)
              const isClickable = date && !isPast && isAvailable

              return (
                <button
                  key={index}
                  onClick={() => handleDateClick(date)}
                  disabled={!isClickable}
                  className={`
                    aspect-square flex items-center justify-center text-sm rounded-md transition-all
                    ${!date 
                      ? 'invisible' 
                      : isPast
                        ? 'text-gray-300 cursor-not-allowed'
                        : isAvailable
                          ? isSelected
                            ? 'bg-brand-cyan text-white shadow-md'
                            : 'text-dark-gray hover:bg-brand-cyan/10 hover:text-brand-cyan cursor-pointer'
                          : 'text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  {date && (
                    <div className="relative">
                      <span>{date.getDate()}</span>
                      {isAvailable && !isPast && (
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-brand-cyan rounded-full"></div>
                      )}
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-brand-cyan rounded-full"></div>
              <span className="text-dark-gray/70">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <span className="text-dark-gray/70">Not Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
              <span className="text-dark-gray/70">Past Date</span>
            </div>
          </div>

          {/* Selected date info */}
          {selectedDate && availability[selectedDate] && (
            <div className="mt-6 p-4 bg-off-white rounded-lg">
              <h4 className="font-medium text-dark-gray mb-2">
                Available Times - {new Date(selectedDate).toLocaleDateString(locale === 'th' ? 'th-TH' : 'en-US')}
              </h4>
              <div className="space-y-1">
                {availability[selectedDate].map((slot, index) => (
                  <div key={index} className="text-sm text-dark-gray/70">
                    {slot.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {' '}
                    {slot.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}