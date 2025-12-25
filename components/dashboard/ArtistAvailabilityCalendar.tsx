'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, CalendarDaysIcon, ListBulletIcon } from '@heroicons/react/24/outline'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import {
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface ArtistAvailabilityCalendarProps {
  artistId: string
  locale: string
}

type ViewMode = 'month' | 'week' | 'day'
type AvailabilityStatus = 'AVAILABLE' | 'UNAVAILABLE' | 'TENTATIVE' | 'BOOKED' | 'TRAVEL_TIME'

interface AvailabilitySlot {
  id: string
  date: Date
  startTime: Date
  endTime: Date
  status: AvailabilityStatus
  isBooked: boolean
  priceMultiplier?: number
  bufferBefore: number
  bufferAfter: number
  notes?: string
  requirements?: string
  recurringPatternId?: string
}

interface RecurringPattern {
  id: string
  name: string
  frequency: string
  startTime: string
  endTime: string
  priceMultiplier: number
  isActive: boolean
}

interface TimeSlotTemplate {
  id: string
  name: string
  duration: number
  priceMultiplier: number
  bufferBefore: number
  bufferAfter: number
  isDefault: boolean
}

export default function ArtistAvailabilityCalendar({ artistId, locale }: ArtistAvailabilityCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<ViewMode>('month')
  const [availability, setAvailability] = useState<Record<string, AvailabilitySlot[]>>({})
  const [bookings, setBookings] = useState<any[]>([])
  const [recurringPatterns, setRecurringPatterns] = useState<RecurringPattern[]>([])
  const [templates, setTemplates] = useState<TimeSlotTemplate[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [showPatternModal, setShowPatternModal] = useState(false)
  const [bulkMode, setBulkMode] = useState(false)
  const [dragMode, setDragMode] = useState(false)
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set())
  const [draggedSlot, setDraggedSlot] = useState<AvailabilitySlot | null>(null)

  const [availabilityForm, setAvailabilityForm] = useState({
    status: 'AVAILABLE' as AvailabilityStatus,
    startTime: '09:00',
    endTime: '17:00',
    priceMultiplier: 1.0,
    bufferBefore: 0,
    bufferAfter: 0,
    notes: '',
    requirements: ''
  })

  const [templateForm, setTemplateForm] = useState({
    name: '',
    duration: 120,
    priceMultiplier: 1.0,
    bufferBefore: 0,
    bufferAfter: 0,
    isDefault: false
  })

  const [patternForm, setPatternForm] = useState({
    name: '',
    frequency: 'WEEKLY',
    dayOfWeek: 1,
    startTime: '09:00',
    endTime: '17:00',
    priceMultiplier: 1.0,
    validFrom: new Date().toISOString().split('T')[0],
    validUntil: ''
  })

  useEffect(() => {
    fetchData()
  }, [currentDate, viewMode, artistId])

  useEffect(() => {
    fetchRecurringPatterns()
    fetchTemplates()
  }, [artistId])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      let startDate: Date, endDate: Date
      
      if (viewMode === 'month') {
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth()
        startDate = new Date(year, month, 1)
        endDate = new Date(year, month + 1, 0)
      } else if (viewMode === 'week') {
        startDate = new Date(currentDate)
        startDate.setDate(currentDate.getDate() - currentDate.getDay())
        endDate = new Date(startDate)
        endDate.setDate(startDate.getDate() + 6)
      } else { // day
        startDate = new Date(currentDate)
        endDate = new Date(currentDate)
      }
      
      const availabilityResponse = await fetch(
        `/api/artist/availability?startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}&view=${viewMode}`
      )
      
      if (availabilityResponse.ok) {
        const availabilityData = await availabilityResponse.json()
        const availabilityByDate: Record<string, AvailabilitySlot[]> = {}
        
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
            status: slot.status,
            isBooked: slot.isBooked,
            priceMultiplier: slot.priceMultiplier,
            bufferBefore: slot.bufferBefore,
            bufferAfter: slot.bufferAfter,
            notes: slot.notes,
            requirements: slot.requirements,
            recurringPatternId: slot.recurringPatternId
          })
        })
        setAvailability(availabilityByDate)
      }
      
      const bookingsResponse = await fetch('/api/bookings')
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json()
        const dateRangeBookings = bookingsData.bookings
          .filter((booking: any) => {
            const bookingDate = new Date(booking.eventDate)
            return bookingDate >= startDate && bookingDate <= endDate
          })
        setBookings(dateRangeBookings)
      }
    } catch (error) {
      console.error('Error fetching calendar data:', error)
    } finally {
      setLoading(false)
    }
  }, [currentDate, viewMode, artistId])

  const fetchRecurringPatterns = async () => {
    try {
      const response = await fetch('/api/artist/availability/recurring')
      if (response.ok) {
        const data = await response.json()
        setRecurringPatterns(data.patterns || [])
      }
    } catch (error) {
      console.error('Error fetching recurring patterns:', error)
    }
  }

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/artist/availability/templates')
      if (response.ok) {
        const data = await response.json()
        setTemplates(data.templates || [])
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
    }
  }

  const getViewDays = () => {
    if (viewMode === 'month') {
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth()
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
    } else if (viewMode === 'week') {
      const days = []
      const weekStart = new Date(currentDate)
      weekStart.setDate(currentDate.getDate() - currentDate.getDay())
      
      for (let i = 0; i < 7; i++) {
        const day = new Date(weekStart)
        day.setDate(weekStart.getDate() + i)
        days.push(day)
      }
      return days
    } else { // day
      return [currentDate]
    }
  }

  const getDateStatus = (date: Date | null) => {
    if (!date) return { type: 'empty', label: '', count: 0 }
    
    const dateKey = date.toISOString().split('T')[0]
    const slots = availability[dateKey] || []
    const dayBookings = bookings.filter(booking => 
      new Date(booking.eventDate).toISOString().split('T')[0] === dateKey
    )

    if (dayBookings.length > 0) {
      return { type: 'booked', label: 'Booked', count: dayBookings.length }
    }
    
    if (slots.length > 0) {
      const availableSlots = slots.filter(slot => slot.status === 'AVAILABLE')
      const tentativeSlots = slots.filter(slot => slot.status === 'TENTATIVE')
      const bookedSlots = slots.filter(slot => slot.status === 'BOOKED')
      const travelSlots = slots.filter(slot => slot.status === 'TRAVEL_TIME')
      
      if (bookedSlots.length > 0) {
        return { type: 'booked', label: 'Booked', count: bookedSlots.length }
      } else if (availableSlots.length > 0) {
        return { type: 'available', label: 'Available', count: availableSlots.length }
      } else if (tentativeSlots.length > 0) {
        return { type: 'tentative', label: 'Tentative', count: tentativeSlots.length }
      } else if (travelSlots.length > 0) {
        return { type: 'travel', label: 'Travel', count: travelSlots.length }
      } else {
        return { type: 'blocked', label: 'Unavailable', count: slots.length }
      }
    }
    
    return { type: 'unset', label: 'Not Set', count: 0 }
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    
    if (!over || active.id === over.id) return
    
    // Handle drag between dates
    const activeSlot = draggedSlot
    if (activeSlot && typeof over.id === 'string') {
      const targetDate = over.id
      moveSlotToDate(activeSlot.id, targetDate)
    }
  }, [draggedSlot])

  const moveSlotToDate = async (slotId: string, targetDate: string) => {
    try {
      const response = await fetch('/api/artist/availability', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slotId,
          date: targetDate
        })
      })
      
      if (response.ok) {
        await fetchData()
      }
    } catch (error) {
      console.error('Error moving slot:', error)
    }
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
          status: firstSlot.status,
          startTime: firstSlot.startTime.toTimeString().slice(0, 5),
          endTime: firstSlot.endTime.toTimeString().slice(0, 5),
          priceMultiplier: firstSlot.priceMultiplier || 1.0,
          bufferBefore: firstSlot.bufferBefore,
          bufferAfter: firstSlot.bufferAfter,
          notes: firstSlot.notes || '',
          requirements: firstSlot.requirements || ''
        })
      } else {
        setAvailabilityForm({
          status: 'AVAILABLE',
          startTime: '09:00',
          endTime: '17:00',
          priceMultiplier: 1.0,
          bufferBefore: 0,
          bufferAfter: 0,
          notes: '',
          requirements: ''
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

  const saveTemplate = async () => {
    try {
      const response = await fetch('/api/artist/availability/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(templateForm)
      })
      
      if (response.ok) {
        await fetchTemplates()
        setShowTemplateModal(false)
        setTemplateForm({
          name: '',
          duration: 120,
          priceMultiplier: 1.0,
          bufferBefore: 0,
          bufferAfter: 0,
          isDefault: false
        })
      }
    } catch (error) {
      console.error('Error saving template:', error)
    }
  }

  const saveRecurringPattern = async () => {
    try {
      const response = await fetch('/api/artist/availability/recurring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patternForm)
      })
      
      if (response.ok) {
        await fetchRecurringPatterns()
        setShowPatternModal(false)
        setPatternForm({
          name: '',
          frequency: 'WEEKLY',
          dayOfWeek: 1,
          startTime: '09:00',
          endTime: '17:00',
          priceMultiplier: 1.0,
          validFrom: new Date().toISOString().split('T')[0],
          validUntil: ''
        })
      }
    } catch (error) {
      console.error('Error saving pattern:', error)
    }
  }

  const applyTemplate = async (templateId: string, dates: string[]) => {
    try {
      const response = await fetch('/api/artist/availability/templates', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId,
          dates
        })
      })
      
      if (response.ok) {
        await fetchData()
      }
    } catch (error) {
      console.error('Error applying template:', error)
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
      } else if (viewMode === 'week') {
        if (direction === 'prev') {
          newDate.setDate(prev.getDate() - 7)
        } else {
          newDate.setDate(prev.getDate() + 7)
        }
      } else { // day
        if (direction === 'prev') {
          newDate.setDate(prev.getDate() - 1)
        } else {
          newDate.setDate(prev.getDate() + 1)
        }
      }
      return newDate
    })
  }

  const formatDateHeader = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {}
    
    if (viewMode === 'month') {
      options.month = 'long'
      options.year = 'numeric'
    } else if (viewMode === 'week') {
      const weekStart = new Date(date)
      weekStart.setDate(date.getDate() - date.getDay())
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      
      if (locale === 'th') {
        return `${weekStart.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })} - ${weekEnd.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}`
      }
      return `${weekStart.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} - ${weekEnd.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}`
    } else { // day
      options.weekday = 'long'
      options.day = 'numeric'
      options.month = 'long'
      options.year = 'numeric'
    }
    
    if (locale === 'th') {
      return date.toLocaleDateString('th-TH', options)
    }
    return date.toLocaleDateString('en-US', options)
  }

  const weekDays = locale === 'th' 
    ? ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const days = getViewDays()

  // Sortable slot component for drag and drop
  const SortableSlot = ({ slot, isDragging }: { slot: AvailabilitySlot; isDragging?: boolean }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
    } = useSortable({ id: slot.id })

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    }

    const getStatusColor = (status: AvailabilityStatus) => {
      switch (status) {
        case 'AVAILABLE': return 'bg-green-100 text-green-800 border-green-200'
        case 'TENTATIVE': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
        case 'BOOKED': return 'bg-soft-lavender text-white border-soft-lavender'
        case 'TRAVEL_TIME': return 'bg-blue-100 text-blue-800 border-blue-200'
        case 'UNAVAILABLE': return 'bg-red-100 text-red-800 border-red-200'
        default: return 'bg-gray-100 text-gray-800 border-gray-200'
      }
    }

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`p-2 m-1 text-xs rounded border cursor-move ${getStatusColor(slot.status)} ${
          isDragging ? 'opacity-50' : ''
        }`}
      >
        <div className="font-medium">
          {slot.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
          {slot.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        {slot.priceMultiplier !== 1.0 && (
          <div className="text-xs opacity-75">×{slot.priceMultiplier}</div>
        )}
      </div>
    )
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="space-y-6">
        <div className="bg-pure-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('prev')}
                className="p-2 hover:bg-off-white rounded-md transition-colors"
                disabled={loading}
              >
                <ChevronLeftIcon className="w-5 h-5 text-dark-gray" />
              </button>
              
              <h2 className="font-playfair text-2xl font-bold text-dark-gray">
                {formatDateHeader(currentDate)}
              </h2>
              
              <button
                onClick={() => navigate('next')}
                className="p-2 hover:bg-off-white rounded-md transition-colors"
                disabled={loading}
              >
                <ChevronRightIcon className="w-5 h-5 text-dark-gray" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              {/* View Mode Selector */}
              <div className="flex bg-off-white rounded-lg p-1">
                {(['month', 'week', 'day'] as ViewMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-3 py-1 rounded-md text-sm capitalize transition-colors ${
                      viewMode === mode
                        ? 'bg-brand-cyan text-white'
                        : 'text-dark-gray hover:bg-white'
                    }`}
                  >
                    {mode === 'month' && <CalendarDaysIcon className="w-4 h-4" />}
                    {mode === 'week' && <span>Week</span>}
                    {mode === 'day' && <span>Day</span>}
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <button
                onClick={() => setShowTemplateModal(true)}
                className="px-4 py-2 bg-off-white text-dark-gray rounded-md hover:bg-brand-cyan/10 transition-colors"
              >
                Templates
              </button>
              
              <button
                onClick={() => setShowPatternModal(true)}
                className="px-4 py-2 bg-off-white text-dark-gray rounded-md hover:bg-brand-cyan/10 transition-colors"
              >
                Patterns
              </button>
              
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
                {bulkMode ? 'Exit Bulk' : 'Bulk Edit'}
              </button>
              
              <button
                onClick={() => {
                  setDragMode(!dragMode)
                }}
                className={`px-4 py-2 rounded-md transition-colors ${
                  dragMode 
                    ? 'bg-earthy-brown text-white' 
                    : 'bg-off-white text-dark-gray hover:bg-earthy-brown/10'
                }`}
              >
                {dragMode ? 'Exit Drag' : 'Drag Mode'}
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
            {/* Week days header for month and week view */}
            {(viewMode === 'month' || viewMode === 'week') && (
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map((day, index) => (
                  <div key={index} className="text-center text-sm font-medium text-dark-gray/70 py-2">
                    {day}
                  </div>
                ))}
              </div>
            )}

            {/* Calendar grid */}
            <div className={`gap-1 ${
              viewMode === 'month' ? 'grid grid-cols-7' :
              viewMode === 'week' ? 'grid grid-cols-7' :
              'flex flex-col'
            }`}>
              {days.map((date, index) => {
                const dateKey = date?.toISOString().split('T')[0]
                const status = getDateStatus(date)
                const isSelected = bulkMode && dateKey && selectedDates.has(dateKey)
                const daySlots = dateKey ? availability[dateKey] || [] : []

                return (
                  <div
                    key={index}
                    className={`${
                      viewMode === 'month' ? 'aspect-square' : 
                      viewMode === 'week' ? 'min-h-32' : 'min-h-48'
                    } ${
                      !date ? 'invisible' : ''
                    }`}
                  >
                    {date && (
                      <div className={`h-full border rounded-lg p-2 transition-all ${
                        status.type === 'booked' ? 'bg-soft-lavender/20 border-soft-lavender' :
                        status.type === 'available' ? 'bg-green-50 border-green-200' :
                        status.type === 'tentative' ? 'bg-yellow-50 border-yellow-200' :
                        status.type === 'travel' ? 'bg-blue-50 border-blue-200' :
                        status.type === 'blocked' ? 'bg-red-50 border-red-200' :
                        'bg-gray-50 border-gray-200 hover:bg-brand-cyan/5'
                      } ${
                        isSelected ? 'ring-2 ring-brand-cyan ring-offset-2' : ''
                      }`}>
                        
                        {/* Date header */}
                        <button
                          onClick={() => handleDateClick(date)}
                          className="w-full text-left mb-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-dark-gray">
                              {viewMode === 'day' ? formatDateHeader(date) : date.getDate()}
                            </span>
                            {status.count > 0 && (
                              <span className="text-xs bg-brand-cyan text-white rounded-full px-2 py-0.5">
                                {status.count}
                              </span>
                            )}
                          </div>
                        </button>

                        {/* Availability slots */}
                        {dragMode ? (
                          <SortableContext items={daySlots.map(slot => slot.id)} strategy={verticalListSortingStrategy}>
                            <div className="space-y-1 max-h-24 overflow-y-auto">
                              {daySlots.map((slot) => (
                                <SortableSlot key={slot.id} slot={slot} />
                              ))}
                            </div>
                          </SortableContext>
                        ) : (
                          <div className="space-y-1 max-h-24 overflow-y-auto">
                            {daySlots.slice(0, viewMode === 'month' ? 2 : 10).map((slot) => (
                              <div
                                key={slot.id}
                                className={`p-1 text-xs rounded ${
                                  slot.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                                  slot.status === 'TENTATIVE' ? 'bg-yellow-100 text-yellow-800' :
                                  slot.status === 'BOOKED' ? 'bg-soft-lavender text-white' :
                                  slot.status === 'TRAVEL_TIME' ? 'bg-blue-100 text-blue-800' :
                                  'bg-red-100 text-red-800'
                                }`}
                              >
                                <div>
                                  {slot.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                                  {slot.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                {slot.priceMultiplier !== 1.0 && (
                                  <div className="opacity-75">×{slot.priceMultiplier}</div>
                                )}
                              </div>
                            ))}
                            {daySlots.length > (viewMode === 'month' ? 2 : 10) && (
                              <div className="text-xs text-dark-gray/60 text-center">
                                +{daySlots.length - (viewMode === 'month' ? 2 : 10)} more
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="mt-6 flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
                <span className="text-dark-gray/70">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded"></div>
                <span className="text-dark-gray/70">Tentative</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-soft-lavender rounded"></div>
                <span className="text-dark-gray/70">Booked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
                <span className="text-dark-gray/70">Travel Time</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
                <span className="text-dark-gray/70">Unavailable</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-50 border border-gray-200 rounded"></div>
                <span className="text-dark-gray/70">Not Set</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Enhanced Availability Modal */}
      {showAvailabilityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-pure-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-playfair text-xl font-bold text-dark-gray mb-4">
              {bulkMode 
                ? `Set Availability for ${selectedDates.size} dates`
                : `Set Availability - ${selectedDate && new Date(selectedDate).toLocaleDateString(locale === 'th' ? 'th-TH' : 'en-US')}`
              }
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-gray mb-2">
                    Status
                  </label>
                  <select
                    value={availabilityForm.status}
                    onChange={(e) => setAvailabilityForm(prev => ({ ...prev, status: e.target.value as AvailabilityStatus }))}
                    className="w-full px-3 py-2 border border-brand-cyan/30 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="TENTATIVE">Tentative</option>
                    <option value="UNAVAILABLE">Unavailable</option>
                    <option value="TRAVEL_TIME">Travel Time</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-gray mb-1">
                    Price Multiplier
                  </label>
                  <input
                    type="number"
                    min="0.1"
                    max="10"
                    step="0.1"
                    value={availabilityForm.priceMultiplier}
                    onChange={(e) => setAvailabilityForm(prev => ({ ...prev, priceMultiplier: parseFloat(e.target.value) }))}
                    className="w-full px-3 py-2 border border-brand-cyan/30 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                  />
                  <p className="text-xs text-dark-gray/60 mt-1">1.0 = normal price, 1.5 = 50% premium</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-dark-gray mb-1">
                      Buffer Before (min)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="480"
                      value={availabilityForm.bufferBefore}
                      onChange={(e) => setAvailabilityForm(prev => ({ ...prev, bufferBefore: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-brand-cyan/30 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-gray mb-1">
                      Buffer After (min)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="480"
                      value={availabilityForm.bufferAfter}
                      onChange={(e) => setAvailabilityForm(prev => ({ ...prev, bufferAfter: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-brand-cyan/30 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-gray mb-1">
                    Notes
                  </label>
                  <textarea
                    value={availabilityForm.notes}
                    onChange={(e) => setAvailabilityForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-3 py-2 border border-brand-cyan/30 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                    rows={2}
                    placeholder="Internal notes..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-gray mb-1">
                    Special Requirements
                  </label>
                  <textarea
                    value={availabilityForm.requirements}
                    onChange={(e) => setAvailabilityForm(prev => ({ ...prev, requirements: e.target.value }))}
                    className="w-full px-3 py-2 border border-brand-cyan/30 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                    rows={2}
                    placeholder="Equipment, setup requirements..."
                  />
                </div>
              </div>
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
    </DndContext>
  )
}