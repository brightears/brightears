'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

interface ReconnectionConfig {
  maxAttempts: number
  initialDelay: number
  maxDelay: number
  backoffFactor: number
  jitterRange: number
}

interface ReconnectionState {
  isReconnecting: boolean
  attemptCount: number
  nextRetryIn: number
  lastAttemptAt?: Date
  lastSuccessAt?: Date
}

interface UseReconnectionManagerProps {
  onReconnect: () => Promise<boolean>
  config?: Partial<ReconnectionConfig>
  enabled?: boolean
  onReconnectionSuccess?: () => void
  onReconnectionFailed?: (attemptCount: number) => void
  onMaxAttemptsReached?: () => void
}

interface UseReconnectionManagerReturn {
  state: ReconnectionState
  
  // Actions
  startReconnection: () => void
  stopReconnection: () => void
  attemptReconnection: () => Promise<boolean>
  reset: () => void
  
  // Helpers
  getNextDelay: () => number
  canReconnect: () => boolean
}

const DEFAULT_CONFIG: ReconnectionConfig = {
  maxAttempts: 10,
  initialDelay: 1000,     // 1 second
  maxDelay: 30000,        // 30 seconds
  backoffFactor: 1.5,     // Exponential backoff factor
  jitterRange: 0.3        // ±30% jitter
}

export function useReconnectionManager({
  onReconnect,
  config = {},
  enabled = true,
  onReconnectionSuccess,
  onReconnectionFailed,
  onMaxAttemptsReached
}: UseReconnectionManagerProps): UseReconnectionManagerReturn {
  
  const finalConfig = { ...DEFAULT_CONFIG, ...config }
  
  const [state, setState] = useState<ReconnectionState>({
    isReconnecting: false,
    attemptCount: 0,
    nextRetryIn: 0
  })
  
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const mountedRef = useRef(true)
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])
  
  const getNextDelay = useCallback((): number => {
    const { initialDelay, maxDelay, backoffFactor, jitterRange } = finalConfig
    const { attemptCount } = state
    
    // Calculate exponential backoff
    const baseDelay = Math.min(
      initialDelay * Math.pow(backoffFactor, attemptCount),
      maxDelay
    )
    
    // Add jitter to avoid thundering herd
    const jitter = (Math.random() - 0.5) * 2 * jitterRange * baseDelay
    
    return Math.max(baseDelay + jitter, 100) // Minimum 100ms
  }, [finalConfig, state.attemptCount])
  
  const canReconnect = useCallback((): boolean => {
    return enabled && 
           state.attemptCount < finalConfig.maxAttempts &&
           !state.isReconnecting
  }, [enabled, state.attemptCount, state.isReconnecting, finalConfig.maxAttempts])
  
  const attemptReconnection = useCallback(async (): Promise<boolean> => {
    if (!canReconnect()) return false
    
    setState(prev => ({
      ...prev,
      isReconnecting: true,
      attemptCount: prev.attemptCount + 1,
      lastAttemptAt: new Date()
    }))
    
    try {
      const success = await onReconnect()
      
      if (!mountedRef.current) return false
      
      if (success) {
        setState(prev => ({
          ...prev,
          isReconnecting: false,
          nextRetryIn: 0,
          lastSuccessAt: new Date()
        }))
        
        onReconnectionSuccess?.()
        return true
      } else {
        setState(prev => ({
          ...prev,
          isReconnecting: false
        }))
        
        onReconnectionFailed?.(state.attemptCount + 1)
        return false
      }
    } catch (error) {
      console.error('Reconnection attempt failed:', error)
      
      if (!mountedRef.current) return false
      
      setState(prev => ({
        ...prev,
        isReconnecting: false
      }))
      
      onReconnectionFailed?.(state.attemptCount + 1)
      return false
    }
  }, [canReconnect, onReconnect, onReconnectionSuccess, onReconnectionFailed, state.attemptCount])
  
  const startReconnection = useCallback(() => {
    if (!enabled || state.isReconnecting) return
    
    // Clear any existing timers
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    
    const scheduleNextAttempt = () => {
      if (!canReconnect()) {
        if (state.attemptCount >= finalConfig.maxAttempts) {
          onMaxAttemptsReached?.()
        }
        return
      }
      
      const delay = getNextDelay()
      let countdown = Math.ceil(delay / 1000)
      
      // Update countdown every second
      setState(prev => ({ ...prev, nextRetryIn: countdown }))
      
      intervalRef.current = setInterval(() => {
        countdown--
        if (mountedRef.current) {
          setState(prev => ({ ...prev, nextRetryIn: Math.max(0, countdown) }))
        }
        
        if (countdown <= 0) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
        }
      }, 1000)
      
      // Schedule the actual reconnection attempt
      timeoutRef.current = setTimeout(async () => {
        if (!mountedRef.current) return
        
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
        
        setState(prev => ({ ...prev, nextRetryIn: 0 }))
        
        const success = await attemptReconnection()
        
        // If failed, schedule next attempt
        if (!success && canReconnect()) {
          scheduleNextAttempt()
        }
      }, delay)
    }
    
    // Start immediately or schedule first attempt
    if (state.attemptCount === 0) {
      attemptReconnection().then(success => {
        if (!success && canReconnect()) {
          scheduleNextAttempt()
        }
      })
    } else {
      scheduleNextAttempt()
    }
  }, [enabled, state.isReconnecting, state.attemptCount, canReconnect, finalConfig.maxAttempts, onMaxAttemptsReached, getNextDelay, attemptReconnection])
  
  const stopReconnection = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    
    setState(prev => ({
      ...prev,
      isReconnecting: false,
      nextRetryIn: 0
    }))
  }, [])
  
  const reset = useCallback(() => {
    stopReconnection()
    setState({
      isReconnecting: false,
      attemptCount: 0,
      nextRetryIn: 0
    })
  }, [stopReconnection])
  
  return {
    state,
    
    // Actions
    startReconnection,
    stopReconnection,
    attemptReconnection,
    reset,
    
    // Helpers
    getNextDelay,
    canReconnect
  }
}