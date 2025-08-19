import { useState, useEffect, useRef, useCallback } from 'react'

interface UseTypingIndicatorOptions {
  bookingId: string
  enabled?: boolean
  debounceMs?: number
  autoStopMs?: number
}

export interface UseTypingIndicatorReturn {
  isTyping: boolean
  error: string | null
  startTyping: () => void
  stopTyping: () => void
  handleInputChange: (value: string) => void
  handleKeyPress: () => void
  handleInputBlur: () => void
  handleMessageSend: () => void
  clearError: () => void
}

export function useTypingIndicator({
  bookingId,
  enabled = true,
  debounceMs = 300,
  autoStopMs = 3000
}: UseTypingIndicatorOptions): UseTypingIndicatorReturn {
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Refs for managing timers
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const autoStopTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastTypingSentRef = useRef(false)

  // Send typing status to server
  const sendTypingStatus = useCallback(async (typing: boolean) => {
    if (!enabled) return

    try {
      const response = await fetch(`/api/messages/typing/${bookingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isTyping: typing }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      lastTypingSentRef.current = typing
      setError(null)
    } catch (err) {
      console.error('Error sending typing status:', err)
      setError(err instanceof Error ? err.message : 'Failed to send typing status')
    }
  }, [bookingId, enabled])

  // Start typing
  const startTyping = useCallback(() => {
    if (!enabled) return

    // Clear any existing timers
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }
    if (autoStopTimeoutRef.current) {
      clearTimeout(autoStopTimeoutRef.current)
    }

    // Set local state immediately
    setIsTyping(true)

    // Debounce the API call
    debounceTimeoutRef.current = setTimeout(() => {
      if (!lastTypingSentRef.current) {
        sendTypingStatus(true)
      }
    }, debounceMs)

    // Auto-stop typing after specified time
    autoStopTimeoutRef.current = setTimeout(() => {
      stopTyping()
    }, autoStopMs)
  }, [enabled, debounceMs, autoStopMs, sendTypingStatus])

  // Stop typing
  const stopTyping = useCallback(() => {
    if (!enabled) return

    // Clear timers
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
      debounceTimeoutRef.current = null
    }
    if (autoStopTimeoutRef.current) {
      clearTimeout(autoStopTimeoutRef.current)
      autoStopTimeoutRef.current = null
    }

    // Set local state
    setIsTyping(false)

    // Send stop typing if we previously sent start
    if (lastTypingSentRef.current) {
      sendTypingStatus(false)
    }
  }, [enabled, sendTypingStatus])

  // Handle text input changes
  const handleInputChange = useCallback((value: string) => {
    if (!enabled) return

    if (value.trim().length > 0) {
      startTyping()
    } else {
      stopTyping()
    }
  }, [enabled, startTyping, stopTyping])

  // Handle key events (for detecting when user stops typing)
  const handleKeyPress = useCallback(() => {
    if (!enabled) return
    
    startTyping()
  }, [enabled, startTyping])

  // Handle input blur (when user clicks away)
  const handleInputBlur = useCallback(() => {
    if (!enabled) return
    
    stopTyping()
  }, [enabled, stopTyping])

  // Handle form submission or message send
  const handleMessageSend = useCallback(() => {
    if (!enabled) return
    
    stopTyping()
  }, [enabled, stopTyping])

  // Cleanup on unmount or when disabled
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
      if (autoStopTimeoutRef.current) {
        clearTimeout(autoStopTimeoutRef.current)
      }
      
      // Send stop typing on cleanup if needed
      if (lastTypingSentRef.current && enabled) {
        sendTypingStatus(false)
      }
    }
  }, [enabled, sendTypingStatus])

  // Stop typing when component becomes disabled
  useEffect(() => {
    if (!enabled && isTyping) {
      stopTyping()
    }
  }, [enabled, isTyping, stopTyping])

  return {
    isTyping,
    error,
    startTyping,
    stopTyping,
    handleInputChange,
    handleKeyPress,
    handleInputBlur,
    handleMessageSend,
    clearError: () => setError(null)
  }
}