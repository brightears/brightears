import { useState, useEffect, useRef, useCallback } from 'react'

export interface Message {
  id: string
  content: string
  messageType: 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM'
  attachmentUrl?: string
  createdAt: string
  isRead: boolean
  readAt?: string
  deliveredAt?: string
  deliveryStatus: 'SENT' | 'DELIVERED' | 'READ' | 'FAILED'
  parentMessage?: {
    id: string
    content: string
    senderName: string
  }
  replies?: Array<{
    id: string
    content: string
    createdAt: string
    senderName: string
  }>
  sender: {
    id: string
    email: string
    role: string
    name: string
    profileImage?: string
  }
  isOwn: boolean
}

export interface ConnectionState {
  status: 'connecting' | 'connected' | 'disconnected' | 'error'
  quality: 'excellent' | 'good' | 'poor' | 'disconnected'
  activeConnections: number
  lastPing?: Date
  connectionId?: string
  error?: string
}

export interface TypingUser {
  userId: string
  userName: string
  isTyping: boolean
  lastTypingAt?: string
}

interface UseRealtimeMessagingOptions {
  bookingId: string
  enabled?: boolean
  autoReconnect?: boolean
  maxReconnectAttempts?: number
}

export function useRealtimeMessaging({
  bookingId,
  enabled = true,
  autoReconnect = true,
  maxReconnectAttempts = 5
}: UseRealtimeMessagingOptions) {
  // State management
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [connectionState, setConnectionState] = useState<ConnectionState>({
    status: 'disconnected',
    quality: 'disconnected',
    activeConnections: 0
  })
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [nextCursor, setNextCursor] = useState<string | null>(null)

  // Refs
  const eventSourceRef = useRef<EventSource | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const lastPingRef = useRef<Date | null>(null)
  const isManualDisconnectRef = useRef(false)

  // Load initial messages
  const loadMessages = useCallback(async (cursor?: string) => {
    try {
      const params = new URLSearchParams()
      if (cursor) params.append('before', cursor)
      params.append('limit', '50')

      const response = await fetch(`/api/bookings/${bookingId}/messages?${params}`)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      if (cursor) {
        // Loading older messages
        setMessages(prev => [...data.messages, ...prev])
      } else {
        // Initial load or refresh
        setMessages(data.messages)
      }

      setHasMore(data.pagination.hasMore)
      setNextCursor(data.pagination.nextCursor)
      
      return data.messages
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load messages'
      setError(errorMessage)
      console.error('Error loading messages:', err)
      throw err
    }
  }, [bookingId])

  // Send a message
  const sendMessage = useCallback(async (
    content: string,
    messageType: 'TEXT' | 'IMAGE' | 'FILE' = 'TEXT',
    attachmentUrl?: string,
    parentMessageId?: string
  ) => {
    if (!content.trim() && !attachmentUrl) return null

    const tempId = `temp-${Date.now()}`
    const tempMessage: Message = {
      id: tempId,
      content: content.trim(),
      messageType,
      attachmentUrl,
      createdAt: new Date().toISOString(),
      isRead: false,
      deliveryStatus: 'SENT',
      sender: {
        id: 'current-user',
        email: '',
        role: '',
        name: 'You'
      },
      isOwn: true
    }

    // Optimistic update
    setMessages(prev => [...prev, tempMessage])

    try {
      const response = await fetch(`/api/bookings/${bookingId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content.trim(),
          messageType,
          attachmentUrl,
          parentMessageId
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      // Replace temp message with real message
      setMessages(prev => 
        prev.map(msg => msg.id === tempId ? data.message : msg)
      )

      return data.message
    } catch (err) {
      // Update temp message to show error
      setMessages(prev =>
        prev.map(msg => 
          msg.id === tempId 
            ? { ...msg, deliveryStatus: 'FAILED' as const }
            : msg
        )
      )
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message'
      setError(errorMessage)
      console.error('Error sending message:', err)
      throw err
    }
  }, [bookingId])

  // Retry failed message
  const retryMessage = useCallback(async (messageId: string) => {
    const message = messages.find(m => m.id === messageId)
    if (!message || message.deliveryStatus !== 'FAILED') return
    
    // Don't retry system messages
    if (message.messageType === 'SYSTEM') return

    // Reset status and retry
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId
          ? { ...msg, deliveryStatus: 'SENT' as const }
          : msg
      )
    )

    try {
      await sendMessage(message.content, message.messageType as 'TEXT' | 'IMAGE' | 'FILE', message.attachmentUrl)
    } catch (err) {
      // Will be handled by sendMessage
    }
  }, [messages, sendMessage])

  // Load more messages (pagination)
  const loadMoreMessages = useCallback(async () => {
    if (!hasMore || isLoading || !nextCursor) return

    setIsLoading(true)
    try {
      await loadMessages(nextCursor)
    } finally {
      setIsLoading(false)
    }
  }, [hasMore, isLoading, nextCursor, loadMessages])

  // SSE Connection management
  const connectToSSE = useCallback(() => {
    if (!enabled || eventSourceRef.current || isManualDisconnectRef.current) return

    setConnectionState(prev => ({ ...prev, status: 'connecting' }))
    
    try {
      const eventSource = new EventSource(`/api/messages/stream/${bookingId}`)
      eventSourceRef.current = eventSource

      eventSource.onopen = () => {
        setConnectionState(prev => ({
          ...prev,
          status: 'connected',
          quality: 'excellent'
        }))
        reconnectAttemptsRef.current = 0
        setError(null)
      }

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          lastPingRef.current = new Date()

          switch (data.type) {
            case 'connected':
              setConnectionState(prev => ({
                ...prev,
                status: 'connected',
                quality: 'excellent',
                activeConnections: data.activeConnections || 0,
                connectionId: data.connectionId,
                lastPing: new Date()
              }))
              break

            case 'message':
              setMessages(prev => {
                // Avoid duplicates
                if (prev.some(m => m.id === data.data.id)) return prev
                return [...prev, data.data]
              })
              break

            case 'typing':
              setTypingUsers(prev => {
                const filtered = prev.filter(u => u.userId !== data.data.userId)
                if (data.data.isTyping) {
                  return [...filtered, {
                    userId: data.data.userId,
                    userName: data.data.userName,
                    isTyping: true,
                    lastTypingAt: data.timestamp
                  }]
                }
                return filtered
              })
              break

            case 'delivery_status':
              setMessages(prev =>
                prev.map(msg =>
                  msg.id === data.data.messageId
                    ? { 
                        ...msg, 
                        deliveryStatus: data.data.status,
                        deliveredAt: data.data.status === 'DELIVERED' ? data.timestamp : msg.deliveredAt,
                        readAt: data.data.status === 'READ' ? data.timestamp : msg.readAt,
                        isRead: data.data.status === 'READ' ? true : msg.isRead
                      }
                    : msg
                )
              )
              break

            case 'ping':
              setConnectionState(prev => ({
                ...prev,
                lastPing: new Date(),
                quality: 'excellent'
              }))
              break
          }
        } catch (err) {
          console.error('Error processing SSE message:', err)
        }
      }

      eventSource.onerror = () => {
        setConnectionState(prev => ({
          ...prev,
          status: 'error',
          quality: 'disconnected'
        }))

        eventSource.close()
        eventSourceRef.current = null

        // Auto-reconnect if enabled
        if (autoReconnect && reconnectAttemptsRef.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000)
          
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++
            connectToSSE()
          }, delay)
        } else {
          setError('Connection lost. Please refresh to reconnect.')
        }
      }

    } catch (err) {
      console.error('Error creating SSE connection:', err)
      setConnectionState(prev => ({
        ...prev,
        status: 'error',
        quality: 'disconnected'
      }))
    }
  }, [enabled, bookingId, autoReconnect, maxReconnectAttempts])

  // Disconnect from SSE
  const disconnect = useCallback(() => {
    isManualDisconnectRef.current = true
    
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    setConnectionState(prev => ({
      ...prev,
      status: 'disconnected',
      quality: 'disconnected'
    }))
  }, [])

  // Reconnect manually
  const reconnect = useCallback(() => {
    isManualDisconnectRef.current = false
    reconnectAttemptsRef.current = 0
    disconnect()
    setTimeout(connectToSSE, 100)
  }, [disconnect, connectToSSE])

  // Initialize
  useEffect(() => {
    if (!enabled) return

    // Load initial messages
    setIsLoading(true)
    loadMessages()
      .then(() => {
        setIsLoading(false)
        // Connect to SSE after initial load
        connectToSSE()
      })
      .catch(() => {
        setIsLoading(false)
      })

    return () => {
      disconnect()
    }
  }, [enabled, bookingId, loadMessages, connectToSSE, disconnect])

  // Cleanup
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [])

  // Connection quality monitoring
  useEffect(() => {
    if (connectionState.status !== 'connected') return

    const interval = setInterval(() => {
      const now = new Date()
      const lastPing = lastPingRef.current || connectionState.lastPing
      
      if (!lastPing) return

      const timeSinceLastPing = now.getTime() - lastPing.getTime()
      
      let quality: ConnectionState['quality'] = 'excellent'
      if (timeSinceLastPing > 60000) {
        quality = 'disconnected'
      } else if (timeSinceLastPing > 45000) {
        quality = 'poor'
      } else if (timeSinceLastPing > 35000) {
        quality = 'good'
      }

      setConnectionState(prev => ({ ...prev, quality }))
    }, 5000)

    return () => clearInterval(interval)
  }, [connectionState.status, connectionState.lastPing])

  return {
    // Data
    messages,
    isLoading,
    error,
    connectionState,
    typingUsers,
    hasMore,

    // Actions
    sendMessage,
    retryMessage,
    loadMoreMessages,
    reconnect,
    disconnect,

    // Utils
    clearError: () => setError(null)
  }
}