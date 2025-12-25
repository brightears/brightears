'use client'

import { memo } from 'react'
import type { ConnectionStatus as ConnectionStatusType } from '@/hooks/useConnectionStatus'

interface ConnectionStatusProps {
  connectionStatus: ConnectionStatusType
  locale: string
  onReconnect?: () => void
  showActiveUsers?: boolean
  className?: string
}

const ConnectionIcon = memo(({ 
  quality, 
  isConnected 
}: { 
  quality: ConnectionStatusType['connectionQuality']
  isConnected: boolean 
}) => {
  if (!isConnected) {
    return (
      <div className="relative">
        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636L5.636 18.364m12.728 0L5.636 5.636" />
        </svg>
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
      </div>
    )
  }

  switch (quality) {
    case 'excellent':
      return (
        <div className="flex items-center space-x-1">
          <div className="w-2 h-4 bg-green-500 rounded-sm" />
          <div className="w-2 h-3 bg-green-500 rounded-sm" />
          <div className="w-2 h-2 bg-green-500 rounded-sm" />
        </div>
      )
    case 'good':
      return (
        <div className="flex items-center space-x-1">
          <div className="w-2 h-4 bg-yellow-500 rounded-sm" />
          <div className="w-2 h-3 bg-yellow-500 rounded-sm" />
          <div className="w-2 h-2 bg-gray-300 rounded-sm" />
        </div>
      )
    case 'poor':
      return (
        <div className="flex items-center space-x-1">
          <div className="w-2 h-4 bg-orange-500 rounded-sm animate-pulse" />
          <div className="w-2 h-3 bg-gray-300 rounded-sm" />
          <div className="w-2 h-2 bg-gray-300 rounded-sm" />
        </div>
      )
    default:
      return (
        <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
      )
  }
})

ConnectionIcon.displayName = 'ConnectionIcon'

const ConnectionStatus = memo(({
  connectionStatus,
  locale,
  onReconnect,
  showActiveUsers = true,
  className = ''
}: ConnectionStatusProps) => {
  const getStatusText = () => {
    if (locale === 'th') {
      switch (connectionStatus.connectionQuality) {
        case 'excellent':
          return 'เชื่อมต่อแล้ว'
        case 'good':
          return 'เชื่อมต่อแล้ว'
        case 'poor':
          return 'การเชื่อมต่อไม่เสถียร'
        case 'disconnected':
          return 'ไม่ได้เชื่อมต่อ'
        default:
          return 'กำลังเชื่อมต่อ...'
      }
    }

    // English
    switch (connectionStatus.connectionQuality) {
      case 'excellent':
        return 'Connected'
      case 'good':
        return 'Connected'
      case 'poor':
        return 'Connection Issues'
      case 'disconnected':
        return 'Disconnected'
      default:
        return 'Connecting...'
    }
  }

  const getStatusColor = () => {
    switch (connectionStatus.connectionQuality) {
      case 'excellent':
        return 'text-green-600'
      case 'good':
        return 'text-yellow-600'
      case 'poor':
        return 'text-orange-600'
      case 'disconnected':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const shouldShowReconnectButton = () => {
    return !connectionStatus.isConnected && 
           connectionStatus.reconnectAttempts >= 3
  }

  const getActiveUsersText = () => {
    if (!connectionStatus.isConnected || connectionStatus.activeConnections <= 1) return ''
    
    const count = connectionStatus.activeConnections
    if (locale === 'th') {
      return count === 2 ? ' • อีก 1 คนออนไลน์' : ` • อีก ${count - 1} คนออนไลน์`
    }
    return count === 2 ? ' • 1 other online' : ` • ${count - 1} others online`
  }

  return (
    <div className={`flex items-center justify-between px-3 py-2 bg-gray-50 border-b text-xs ${className}`}>
      <div className="flex items-center space-x-2">
        <ConnectionIcon 
          quality={connectionStatus.connectionQuality} 
          isConnected={connectionStatus.isConnected} 
        />
        
        <span className={`font-medium ${getStatusColor()}`}>
          {getStatusText()}
          {showActiveUsers && getActiveUsersText()}
        </span>
        
        {connectionStatus.reconnectAttempts > 0 && connectionStatus.isConnected && (
          <span className="text-gray-500">
            ({locale === 'th' ? 'เชื่อมต่อใหม่' : 'Reconnected'})
          </span>
        )}
      </div>

      {shouldShowReconnectButton() && onReconnect && (
        <button
          onClick={onReconnect}
          className="px-2 py-1 bg-brand-cyan text-pure-white rounded text-xs hover:bg-brand-cyan/90 transition-colors"
        >
          {locale === 'th' ? 'เชื่อมต่อใหม่' : 'Reconnect'}
        </button>
      )}

      {connectionStatus.lastSeen && connectionStatus.connectionQuality === 'poor' && (
        <span className="text-gray-400">
          {locale === 'th' ? 'ออนไลน์ล่าสุด' : 'Last seen'} {
            new Date(connectionStatus.lastSeen).toLocaleTimeString(
              locale === 'th' ? 'th-TH' : 'en-US',
              { hour: '2-digit', minute: '2-digit' }
            )
          }
        </span>
      )}
    </div>
  )
})

ConnectionStatus.displayName = 'ConnectionStatus'

export default ConnectionStatus