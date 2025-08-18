'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { ActivityItem } from '@/lib/activity-tracker'

interface ActivityFeedProps {
  className?: string
  showStats?: boolean
  autoRefresh?: boolean
  refreshInterval?: number // in seconds
}

interface ActivityStats {
  totalBookings: number
  totalArtists: number
  totalInquiries: number
}

export default function ActivityFeed({ 
  className = '', 
  showStats = true, 
  autoRefresh = true,
  refreshInterval = 30 
}: ActivityFeedProps) {
  const t = useTranslations('home.activity')
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [stats, setStats] = useState<ActivityStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchActivity = async () => {
    try {
      const response = await fetch(`/api/activity?limit=8&stats=${showStats}`)
      const result = await response.json()
      
      if (result.success) {
        setActivities(result.data.recentActivity || [])
        if (showStats && result.data.stats) {
          setStats(result.data.stats)
        }
        setError(null)
      } else {
        setError(result.error || 'Failed to load activity')
      }
    } catch (err) {
      setError('Network error')
      console.error('Activity fetch error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchActivity()
    
    if (autoRefresh) {
      const interval = setInterval(fetchActivity, refreshInterval * 1000)
      return () => clearInterval(interval)
    }
  }, [autoRefresh, refreshInterval, showStats])

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'booking_confirmed':
        return (
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )
      case 'artist_registered':
        return (
          <div className="w-8 h-8 bg-brand-cyan/10 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-brand-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        )
      case 'inquiry_sent':
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        )
      case 'review_left':
        return (
          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
        )
      case 'profile_viewed':
        return (
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
        )
      default:
        return (
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )
    }
  }

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - new Date(timestamp).getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    
    if (diffMinutes < 1) return t('justNow')
    if (diffMinutes < 60) return t('minutesAgo', { minutes: diffMinutes })
    if (diffHours < 24) return t('hoursAgo', { hours: diffHours })
    
    const diffDays = Math.floor(diffHours / 24)
    return t('daysAgo', { days: diffDays })
  }

  if (isLoading) {
    return (
      <div className={`bg-pure-white rounded-xl shadow-lg p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mt-1"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`bg-pure-white rounded-xl shadow-lg p-6 ${className}`}>
        <div className="text-center text-gray-500">
          <svg className="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-sm">{t('loadError')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-pure-white rounded-xl shadow-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-brand-cyan to-deep-teal rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-pure-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <h3 className="font-playfair font-bold text-lg text-deep-teal">{t('title')}</h3>
            <p className="text-sm text-dark-gray/70">{t('subtitle')}</p>
          </div>
        </div>
        
        {/* Live indicator */}
        <div className="flex items-center space-x-2 text-sm text-green-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="font-medium">{t('live')}</span>
        </div>
      </div>

      {/* Stats */}
      {showStats && stats && (
        <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gradient-to-r from-brand-cyan/5 to-deep-teal/5 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-brand-cyan">{stats.totalBookings}</div>
            <div className="text-xs text-dark-gray/70 uppercase tracking-wide">{t('totalBookings')}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-deep-teal">{stats.totalArtists}</div>
            <div className="text-xs text-dark-gray/70 uppercase tracking-wide">{t('totalArtists')}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-earthy-brown">{stats.totalInquiries}</div>
            <div className="text-xs text-dark-gray/70 uppercase tracking-wide">{t('activeInquiries')}</div>
          </div>
        </div>
      )}

      {/* Activity Feed */}
      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-sm">{t('noActivity')}</p>
          </div>
        ) : (
          activities.map((activity, index) => (
            <div 
              key={activity.id}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-off-white transition-colors duration-200"
              style={{
                animation: `slideInUp 0.5s ease-out ${index * 0.1}s both`
              }}
            >
              {getActivityIcon(activity.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-dark-gray leading-relaxed">
                  {activity.message}
                </p>
                <p className="text-xs text-dark-gray/50 mt-1">
                  {formatTimeAgo(activity.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Auto-refresh indicator */}
      {autoRefresh && (
        <div className="flex items-center justify-center mt-4 pt-4 border-t border-off-white">
          <div className="flex items-center space-x-2 text-xs text-dark-gray/50">
            <svg className="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{t('autoRefresh', { seconds: refreshInterval })}</span>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}