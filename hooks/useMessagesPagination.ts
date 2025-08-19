'use client'

import { useState, useCallback, useRef } from 'react'
import type { Message } from './useRealtimeMessaging'

interface UseMessagesPaginationProps {
  bookingId: string
  initialMessages?: Message[]
  pageSize?: number
  onMessagesLoaded?: (messages: Message[]) => void
}

interface PaginationInfo {
  hasMore: boolean
  nextCursor: string | null
  currentPage: number
  totalLoaded: number
}

interface UseMessagesPaginationReturn {
  messages: Message[]
  paginationInfo: PaginationInfo
  isLoading: boolean
  isLoadingMore: boolean
  error: string | null
  
  // Actions
  loadInitialMessages: () => Promise<boolean>
  loadMoreMessages: () => Promise<boolean>
  addMessage: (message: Message) => void
  updateMessage: (messageId: string, updates: Partial<Message>) => void
  prependMessages: (messages: Message[]) => void
  reset: () => void
}

export function useMessagesPagination({
  bookingId,
  initialMessages = [],
  pageSize = 20,
  onMessagesLoaded
}: UseMessagesPaginationProps): UseMessagesPaginationReturn {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    hasMore: true,
    nextCursor: null,
    currentPage: 1,
    totalLoaded: initialMessages.length
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Track if we're currently loading to prevent duplicate requests
  const loadingRef = useRef(false)
  
  const loadInitialMessages = useCallback(async (): Promise<boolean> => {
    if (loadingRef.current) return false
    
    setIsLoading(true)
    setError(null)
    loadingRef.current = true
    
    try {
      const params = new URLSearchParams({
        limit: pageSize.toString(),
        page: '1'
      })
      
      const response = await fetch(`/api/bookings/${bookingId}/messages?${params}`)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const result = await response.json()
      
      if (result.messages) {
        setMessages(result.messages)
        setPaginationInfo({
          hasMore: result.pagination?.hasMore || false,
          nextCursor: result.pagination?.nextCursor || null,
          currentPage: 1,
          totalLoaded: result.messages.length
        })
        
        onMessagesLoaded?.(result.messages)
        return true
      } else {
        throw new Error('Invalid response format')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load messages'
      setError(errorMessage)
      console.error('Error loading initial messages:', err)
      return false
    } finally {
      setIsLoading(false)
      loadingRef.current = false
    }
  }, [bookingId, pageSize, onMessagesLoaded])
  
  const loadMoreMessages = useCallback(async (): Promise<boolean> => {
    if (loadingRef.current || isLoadingMore || !paginationInfo.hasMore) {
      return false
    }
    
    setIsLoadingMore(true)
    setError(null)
    loadingRef.current = true
    
    try {
      const params = new URLSearchParams({
        limit: pageSize.toString(),
        ...(paginationInfo.nextCursor && { before: paginationInfo.nextCursor })
      })
      
      const response = await fetch(`/api/bookings/${bookingId}/messages?${params}`)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const result = await response.json()
      
      if (result.messages && result.messages.length > 0) {
        setMessages(prevMessages => {
          // Remove duplicates and prepend older messages
          const existingIds = new Set(prevMessages.map(msg => msg.id))
          const newMessages = result.messages.filter((msg: Message) => !existingIds.has(msg.id))
          return [...newMessages, ...prevMessages]
        })
        
        setPaginationInfo(prev => ({
          hasMore: result.pagination?.hasMore || false,
          nextCursor: result.pagination?.nextCursor || null,
          currentPage: prev.currentPage + 1,
          totalLoaded: prev.totalLoaded + result.messages.length
        }))
        
        onMessagesLoaded?.(result.messages)
        return true
      } else {
        // No more messages available
        setPaginationInfo(prev => ({ ...prev, hasMore: false }))
        return false
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load more messages'
      setError(errorMessage)
      console.error('Error loading more messages:', err)
      return false
    } finally {
      setIsLoadingMore(false)
      loadingRef.current = false
    }
  }, [bookingId, pageSize, paginationInfo.hasMore, paginationInfo.nextCursor, isLoadingMore, onMessagesLoaded])
  
  const addMessage = useCallback((message: Message) => {
    setMessages(prev => {
      // Check if message already exists
      if (prev.some(msg => msg.id === message.id)) {
        return prev
      }
      // Add to the end (newest messages)
      return [...prev, message]
    })
    
    setPaginationInfo(prev => ({
      ...prev,
      totalLoaded: prev.totalLoaded + 1
    }))
  }, [])
  
  const updateMessage = useCallback((messageId: string, updates: Partial<Message>) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, ...updates } : msg
      )
    )
  }, [])
  
  const prependMessages = useCallback((newMessages: Message[]) => {
    if (newMessages.length === 0) return
    
    setMessages(prev => {
      // Remove duplicates and add to the beginning (older messages)
      const existingIds = new Set(prev.map(msg => msg.id))
      const uniqueMessages = newMessages.filter(msg => !existingIds.has(msg.id))
      return [...uniqueMessages, ...prev]
    })
    
    setPaginationInfo(prev => ({
      ...prev,
      totalLoaded: prev.totalLoaded + newMessages.length
    }))
  }, [])
  
  const reset = useCallback(() => {
    setMessages(initialMessages)
    setPaginationInfo({
      hasMore: true,
      nextCursor: null,
      currentPage: 1,
      totalLoaded: initialMessages.length
    })
    setIsLoading(false)
    setIsLoadingMore(false)
    setError(null)
    loadingRef.current = false
  }, [initialMessages])
  
  return {
    messages,
    paginationInfo,
    isLoading,
    isLoadingMore,
    error,
    
    // Actions
    loadInitialMessages,
    loadMoreMessages,
    addMessage,
    updateMessage,
    prependMessages,
    reset
  }
}