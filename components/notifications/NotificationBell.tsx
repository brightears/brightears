'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { isValidSession } from '@/lib/auth'
import Link from 'next/link'

interface Notification {
  id: string
  type: string
  title: string
  titleTh?: string
  content: string
  contentTh?: string
  relatedId?: string
  relatedType?: string
  isRead: boolean
  createdAt: string
}

interface NotificationBellProps {
  locale: string
}

export default function NotificationBell({ locale }: NotificationBellProps) {
  const { data: session } = useSession()
  const t = useTranslations('notifications')
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isValidSession(session)) {
      fetchNotifications()
      // Set up polling for new notifications
      const interval = setInterval(fetchNotifications, 30000) // Check every 30 seconds
      return () => clearInterval(interval)
    }
  }, [session])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications?limit=10')
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications)
        setUnreadCount(data.unreadCount)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const markAsRead = async (notificationId?: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'mark_as_read',
          notificationId
        }),
      })
      
      if (notificationId) {
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      } else {
        setNotifications(prev => 
          prev.map(n => ({ ...n, isRead: true }))
        )
        setUnreadCount(0)
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking_request':
        return '📅'
      case 'booking_update':
        return '✅'
      case 'message':
        return '💬'
      case 'payment':
        return '💰'
      case 'review':
        return '⭐'
      default:
        return '🔔'
    }
  }

  const getNotificationLink = (notification: Notification) => {
    switch (notification.type) {
      case 'booking_request':
      case 'booking_update':
        if (isValidSession(session) && session.user.role === 'ARTIST') {
          return `/${locale}/dashboard/artist/bookings`
        } else {
          return `/${locale}/bookings`
        }
      case 'message':
        if (isValidSession(session) && session.user.role === 'ARTIST') {
          return `/${locale}/dashboard/artist/bookings`
        } else {
          return `/${locale}/bookings`
        }
      default:
        return `/${locale}/dashboard`
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60)
      return diffInMinutes <= 1 ? t('justNow') : t('minutesAgo', { minutes: diffInMinutes })
    } else if (diffInHours < 24) {
      return t('hoursAgo', { hours: Math.floor(diffInHours) })
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return diffInDays === 1 ? t('yesterday') : t('daysAgo', { days: diffInDays })
    }
  }

  if (!isValidSession(session)) return null

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-brand-cyan transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5V9a6 6 0 10-12 0v3l-5 5h5m7 0v1a3 3 0 01-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-pure-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-dark-gray">{t('title')}</h3>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAsRead()}
                  className="text-sm text-brand-cyan hover:text-brand-cyan/80"
                >
                  {t('markAllRead')}
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                <div className="text-4xl mb-2">🔔</div>
                <p>{t('noNotifications')}</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <Link
                  key={notification.id}
                  href={getNotificationLink(notification)}
                  onClick={() => {
                    if (!notification.isRead) {
                      markAsRead(notification.id)
                    }
                    setIsOpen(false)
                  }}
                  className={`block px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-medium text-dark-gray truncate ${
                          !notification.isRead ? 'font-semibold' : ''
                        }`}>
                          {locale === 'th' && notification.titleTh ? notification.titleTh : notification.title}
                        </h4>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-brand-cyan rounded-full flex-shrink-0 ml-2" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {locale === 'th' && notification.contentTh ? notification.contentTh : notification.content}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatTime(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-200">
              <Link
                href={`/${locale}/dashboard`}
                onClick={() => setIsOpen(false)}
                className="text-sm text-brand-cyan hover:text-brand-cyan/80 text-center block"
              >
                {t('viewAll')}
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}