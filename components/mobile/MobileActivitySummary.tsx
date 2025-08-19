'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/components/navigation'

interface ActivityItem {
  id: string
  type: 'booking_confirmed' | 'artist_registered' | 'inquiry_sent' | 'review_left' | 'profile_viewed'
  message: string
  timestamp: Date
  location?: string
}

export default function MobileActivitySummary() {
  const t = useTranslations('home.activity')
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [stats, setStats] = useState({ totalBookings: 0, totalArtists: 0, totalInquiries: 0 })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchActivitySummary()
  }, [])

  const fetchActivitySummary = async () => {
    try {
      const response = await fetch('/api/activity?limit=3&stats=true')
      const result = await response.json()
      
      if (result.success) {
        setActivities(result.data.recentActivity || [])
        if (result.data.stats) {
          setStats(result.data.stats)
        }
      }
    } catch (error) {
      console.error('Failed to fetch activity summary:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'booking_confirmed':
        return '✅'
      case 'artist_registered':
        return '🎵'
      case 'inquiry_sent':
        return '💬'
      case 'review_left':
        return '⭐'
      case 'profile_viewed':
        return '👀'
      default:
        return '📢'
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
      <div className="bg-gradient-to-r from-brand-cyan/5 to-deep-teal/5 rounded-xl p-4 border border-brand-cyan/10">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-3 w-1/2"></div>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                <div className="h-3 bg-gray-200 rounded flex-1"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-brand-cyan/5 to-deep-teal/5 rounded-xl p-4 border border-brand-cyan/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <h3 className="font-medium text-deep-teal text-sm">
            {t('title')}
          </h3>
        </div>
        <Link 
          href="/activity"
          className="text-brand-cyan text-xs font-medium hover:text-brand-cyan/80"
        >
          {t('viewAll')} →
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center">
          <div className="text-lg font-bold text-brand-cyan">{stats.totalBookings}</div>
          <div className="text-xs text-dark-gray/70">{t('totalBookings')}</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-deep-teal">{stats.totalArtists}</div>
          <div className="text-xs text-dark-gray/70">{t('totalArtists')}</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-earthy-brown">{stats.totalInquiries}</div>
          <div className="text-xs text-dark-gray/70">{t('activeInquiries')}</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-2">
        {activities.length === 0 ? (
          <div className="text-center text-dark-gray/50 py-2 text-xs">
            {t('noActivity')}
          </div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-2 text-xs">
              <span className="text-sm mt-0.5">{getActivityIcon(activity.type)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-dark-gray truncate">{activity.message}</p>
                <p className="text-dark-gray/50 text-xs">{formatTimeAgo(activity.timestamp)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}