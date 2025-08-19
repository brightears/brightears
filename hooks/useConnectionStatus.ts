'use client'

import { useState, useEffect, useCallback } from 'react'

export interface ConnectionStatus {
  isConnected: boolean
  connectionId?: string
  activeConnections: number
  reconnectAttempts: number
  lastSeen?: Date
  connectionQuality: 'excellent' | 'good' | 'poor' | 'disconnected'
}

interface UseConnectionStatusProps {
  onConnectionChange?: (status: ConnectionStatus) => void
  maxReconnectAttempts?: number
}

export interface UseConnectionStatusReturn {
  connectionStatus: ConnectionStatus
  updateConnectionStatus: (updates: Partial<ConnectionStatus>) => void
  incrementReconnectAttempts: () => void
  resetReconnectAttempts: () => void
  getStatusColor: () => string
  getStatusText: (locale?: string) => string
  shouldShowReconnectButton: () => boolean
}

export function useConnectionStatus({
  onConnectionChange,
  maxReconnectAttempts = 5
}: UseConnectionStatusProps = {}): UseConnectionStatusReturn {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    isConnected: false,
    activeConnections: 0,
    reconnectAttempts: 0,
    connectionQuality: 'disconnected'
  })
  
  const updateConnectionStatus = useCallback((updates: Partial<ConnectionStatus>) => {
    setConnectionStatus(prev => {
      const newStatus = { ...prev, ...updates }
      
      // Update connection quality based on various factors
      if (newStatus.isConnected) {
        if (newStatus.reconnectAttempts === 0) {
          newStatus.connectionQuality = 'excellent'
        } else if (newStatus.reconnectAttempts <= 2) {
          newStatus.connectionQuality = 'good'
        } else {
          newStatus.connectionQuality = 'poor'
        }
      } else {
        newStatus.connectionQuality = 'disconnected'
      }
      
      // Call callback if provided
      onConnectionChange?.(newStatus)
      
      return newStatus
    })
  }, [onConnectionChange])
  
  const incrementReconnectAttempts = useCallback(() => {
    updateConnectionStatus({
      reconnectAttempts: connectionStatus.reconnectAttempts + 1
    })
  }, [connectionStatus.reconnectAttempts, updateConnectionStatus])
  
  const resetReconnectAttempts = useCallback(() => {
    updateConnectionStatus({
      reconnectAttempts: 0
    })
  }, [updateConnectionStatus])
  
  const getStatusColor = useCallback(() => {
    switch (connectionStatus.connectionQuality) {
      case 'excellent':
        return 'text-green-500'
      case 'good':
        return 'text-yellow-500'
      case 'poor':
        return 'text-orange-500'
      case 'disconnected':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }, [connectionStatus.connectionQuality])
  
  const getStatusText = useCallback((locale = 'en') => {
    const isConnected = connectionStatus.isConnected
    const quality = connectionStatus.connectionQuality
    
    if (locale === 'th') {
      if (!isConnected) return 'ไม่ได้เชื่อมต่อ'
      
      switch (quality) {
        case 'excellent':
          return 'เชื่อมต่อแล้ว'
        case 'good':
          return 'เชื่อมต่อแล้ว (ปานกลาง)'
        case 'poor':
          return 'เชื่อมต่อไม่เสถียร'
        default:
          return 'ไม่ได้เชื่อมต่อ'
      }
    }
    
    // English
    if (!isConnected) return 'Disconnected'
    
    switch (quality) {
      case 'excellent':
        return 'Connected'
      case 'good':
        return 'Connected (Stable)'
      case 'poor':
        return 'Connection Issues'
      default:
        return 'Disconnected'
    }
  }, [connectionStatus.isConnected, connectionStatus.connectionQuality])
  
  const shouldShowReconnectButton = useCallback(() => {
    return !connectionStatus.isConnected && 
           connectionStatus.reconnectAttempts >= maxReconnectAttempts
  }, [connectionStatus.isConnected, connectionStatus.reconnectAttempts, maxReconnectAttempts])
  
  // Monitor connection health based on last seen timestamp
  useEffect(() => {
    if (!connectionStatus.isConnected || !connectionStatus.lastSeen) return
    
    const interval = setInterval(() => {
      const now = new Date()
      const timeSinceLastSeen = now.getTime() - connectionStatus.lastSeen!.getTime()
      
      // If we haven't heard from the server in over 45 seconds, consider connection poor
      if (timeSinceLastSeen > 45000 && connectionStatus.connectionQuality !== 'poor') {
        updateConnectionStatus({ connectionQuality: 'poor' })
      }
      // If over 90 seconds, consider disconnected
      else if (timeSinceLastSeen > 90000 && connectionStatus.isConnected) {
        updateConnectionStatus({ 
          isConnected: false,
          connectionQuality: 'disconnected'
        })
      }
    }, 10000) // Check every 10 seconds
    
    return () => clearInterval(interval)
  }, [connectionStatus.isConnected, connectionStatus.lastSeen, connectionStatus.connectionQuality, updateConnectionStatus])
  
  return {
    connectionStatus,
    updateConnectionStatus,
    incrementReconnectAttempts,
    resetReconnectAttempts,
    getStatusColor,
    getStatusText,
    shouldShowReconnectButton
  }
}