'use client'

import { useState, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, CalendarDaysIcon } from '@heroicons/react/24/outline'

interface PublicAvailabilityCalendarProps {
  artistId: string
  locale?: string
}

type DayStatus = 'AVAILABLE' | 'BOOKED' | 'UNAVAILABLE' | 'PARTIAL'

interface CalendarDay {
  date: string
  status: DayStatus
  partiallyAvailable: boolean
}

interface AvailabilityData {
  dates: CalendarDay[]
}

export default function PublicAvailabilityCalendar({ artistId, locale = 'en' }: PublicAvailabilityCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month')
  const [availability, setAvailability] = useState<Record<string, CalendarDay>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAvailability()
  }, [currentDate, viewMode, artistId])

  const fetchAvailability = async () => {
    setLoading(true)
    setError(null)

    try {
      const { startDate, endDate } = getDateRange()

      const response = await fetch(
        `/api/artists/${artistId}/availability?startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch availability')
      }

      const data: AvailabilityData = await response.json()

      // Convert array to record for quick lookup
      const availabilityRecord: Record<string, CalendarDay> = {}
      data.dates.forEach(day => {
        availabilityRecord[day.date] = day
      })

      setAvailability(availabilityRecord)
    } catch (err) {
      console.error('Error fetching availability:', err)
      setError('Unable to load availability. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const getDateRange = () => {
    let startDate: Date, endDate: Date

    if (viewMode === 'month') {
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth()
      startDate = new Date(year, month, 1)
      endDate = new Date(year, month + 1, 0)
    } else {
      // week view
      startDate = new Date(currentDate)
      startDate.setDate(currentDate.getDate() - currentDate.getDay())
      endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + 6)
    }

    return { startDate, endDate }
  }

  const getCalendarDays = () => {
    if (viewMode === 'month') {
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth()
      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)
      const daysInMonth = lastDay.getDate()
      const startingDayOfWeek = firstDay.getDay()

      const days: (Date | null)[] = []

      // Add empty cells for days before month starts
      for (let i = 0; i < startingDayOfWeek; i++) {
        days.push(null)
      }

      // Add all days in month
      for (let day = 1; day <= daysInMonth; day++) {
        days.push(new Date(year, month, day))
      }

      return days
    } else {
      // week view
      const days: Date[] = []
      const weekStart = new Date(currentDate)
      weekStart.setDate(currentDate.getDate() - currentDate.getDay())

      for (let i = 0; i < 7; i++) {
        const day = new Date(weekStart)
        day.setDate(weekStart.getDate() + i)
        days.push(day)
      }

      return days
    }
  }

  const getDayStatus = (date: Date | null): { status: DayStatus; label: string; color: string } => {
    if (!date) return { status: 'UNAVAILABLE', label: '', color: '' }

    const dateKey = date.toISOString().split('T')[0]
    const dayData = availability[dateKey]

    // Don't show past dates as available
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (date < today) {
      return {
        status: 'UNAVAILABLE',
        label: 'Past',
        color: 'bg-gray-100 text-gray-400 cursor-default'
      }
    }

    if (!dayData) {
      return {
        status: 'UNAVAILABLE',
        label: 'Not Set',
        color: 'bg-gray-50 text-gray-400 hover:bg-gray-100'
      }
    }

    switch (dayData.status) {
      case 'AVAILABLE':
        return {
          status: 'AVAILABLE',
          label: 'Available',
          color: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
        }
      case 'PARTIAL':
        return {
          status: 'PARTIAL',
          label: 'Limited',
          color: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
        }
      case 'BOOKED':
        return {
          status: 'BOOKED',
          label: 'Booked',
          color: 'bg-soft-lavender/20 text-soft-lavender border-soft-lavender/30'
        }
      case 'UNAVAILABLE':
      default:
        return {
          status: 'UNAVAILABLE',
          label: 'Unavailable',
          color: 'bg-red-50 text-red-700 border-red-200'
        }
    }
  }

  const navigate = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (viewMode === 'month') {
        if (direction === 'prev') {
          newDate.setMonth(prev.getMonth() - 1)
        } else {
          newDate.setMonth(prev.getMonth() + 1)
        }
      } else {
        // week view
        if (direction === 'prev') {
          newDate.setDate(prev.getDate() - 7)
        } else {
          newDate.setDate(prev.getDate() + 7)
        }
      }
      return newDate
    })
  }

  const formatDateHeader = () => {
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      year: 'numeric'
    }

    if (viewMode === 'week') {
      const weekStart = new Date(currentDate)
      weekStart.setDate(currentDate.getDate() - currentDate.getDay())
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)

      return locale === 'th'
        ? `${weekStart.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })} - ${weekEnd.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}`
        : `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
    }

    return locale === 'th'
      ? currentDate.toLocaleDateString('th-TH', options)
      : currentDate.toLocaleDateString('en-US', options)
  }

  const isToday = (date: Date | null): boolean => {
    if (!date) return false
    const today = new Date()
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear()
  }

  const weekDays = locale === 'th'
    ? ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const days = getCalendarDays()

  if (error) {
    return (
      <div className="bg-pure-white rounded-lg p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-700 font-medium mb-2">Unable to Load Calendar</p>
          <p className="text-sm text-red-600">{error}</p>
          <button
            onClick={fetchAvailability}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-pure-white rounded-lg shadow-sm overflow-hidden">
      {/* Glass morphism header */}
      <div className="bg-gradient-to-r from-brand-cyan to-deep-teal p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('prev')}
              className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-all"
              disabled={loading}
              aria-label="Previous"
            >
              <ChevronLeftIcon className="w-5 h-5 text-white" />
            </button>

            <h3 className="font-playfair text-xl font-bold text-white min-w-[200px] text-center">
              {formatDateHeader()}
            </h3>

            <button
              onClick={() => navigate('next')}
              className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-all"
              disabled={loading}
              aria-label="Next"
            >
              <ChevronRightIcon className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-white/20 backdrop-blur-sm rounded-lg p-1">
            <button
              onClick={() => setViewMode('month')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === 'month'
                  ? 'bg-white text-brand-cyan shadow-sm'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <CalendarDaysIcon className="w-4 h-4 inline mr-1" />
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === 'week'
                  ? 'bg-white text-brand-cyan shadow-sm'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Week
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-cyan"></div>
          </div>
        ) : (
          <>
            {/* Week day headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {weekDays.map((day, index) => (
                <div
                  key={index}
                  className="text-center text-sm font-medium text-dark-gray/70 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className={`grid grid-cols-7 gap-2 ${viewMode === 'month' ? 'auto-rows-fr' : ''}`}>
              {days.map((date, index) => {
                const { color, label } = getDayStatus(date)
                const today = isToday(date)

                return (
                  <div
                    key={index}
                    className={`
                      ${viewMode === 'month' ? 'aspect-square' : 'min-h-[100px]'}
                      ${!date ? 'invisible' : ''}
                    `}
                  >
                    {date && (
                      <div
                        className={`
                          h-full border rounded-lg p-2 transition-all
                          ${color}
                          ${today ? 'ring-2 ring-brand-cyan ring-offset-2' : ''}
                        `}
                      >
                        {/* Date number */}
                        <div className="flex items-center justify-between mb-1">
                          <span className={`
                            text-sm font-medium
                            ${today ? 'bg-brand-cyan text-white rounded-full w-6 h-6 flex items-center justify-center text-xs' : ''}
                          `}>
                            {date.getDate()}
                          </span>
                        </div>

                        {/* Status label for week view */}
                        {viewMode === 'week' && label && (
                          <div className="mt-2">
                            <span className="text-xs font-medium">
                              {label}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Legend */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm font-medium text-dark-gray mb-3">Legend:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-50 border border-green-200 rounded"></div>
                  <span className="text-sm text-dark-gray">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-50 border border-yellow-200 rounded"></div>
                  <span className="text-sm text-dark-gray">Limited Slots</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-soft-lavender/20 border border-soft-lavender/30 rounded"></div>
                  <span className="text-sm text-dark-gray">Booked</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-50 border border-red-200 rounded"></div>
                  <span className="text-sm text-dark-gray">Unavailable</span>
                </div>
              </div>

              <div className="mt-4 p-4 bg-brand-cyan/5 rounded-lg border border-brand-cyan/20">
                <p className="text-sm text-dark-gray/80">
                  <strong className="text-brand-cyan">💡 Tip:</strong> This artist is in high demand!
                  Booked dates show this artist's popularity. Contact early to secure your preferred date.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
