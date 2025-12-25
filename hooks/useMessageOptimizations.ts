'use client'

import { useMemo, useCallback, useRef } from 'react'
import type { Message } from './useRealtimeMessaging'

interface MessageGroup {
  date: string
  messages: Message[]
  senderGroups: Array<{
    senderId: string
    senderName: string
    isOwn: boolean
    messages: Message[]
    timeSpan: {
      start: Date
      end: Date
    }
  }>
}

interface UseMessageOptimizationsProps {
  messages: Message[]
  currentUserId?: string
  groupingThreshold?: number // Minutes to group consecutive messages from same sender
}

interface UseMessageOptimizationsReturn {
  // Optimized data structures
  messageGroups: MessageGroup[]
  messageLookup: Map<string, Message>
  unreadCount: number
  lastSeenMessage: Message | null
  
  // Performance helpers
  getMessageById: (messageId: string) => Message | undefined
  isMessageVisible: (messageId: string, viewportTop: number, viewportBottom: number) => boolean
  getVisibleMessageIds: (viewportTop: number, viewportBottom: number) => string[]
  
  // Grouping utilities
  shouldGroupMessages: (msg1: Message, msg2: Message) => boolean
  getMessagePosition: (messageId: string) => 'first' | 'middle' | 'last' | 'single'
}

export function useMessageOptimizations({
  messages,
  currentUserId,
  groupingThreshold = 5 // 5 minutes
}: UseMessageOptimizationsProps): UseMessageOptimizationsReturn {
  
  // Message lookup map for O(1) access
  const messageLookup = useMemo(() => {
    const lookup = new Map<string, Message>()
    messages.forEach(message => {
      lookup.set(message.id, message)
    })
    return lookup
  }, [messages])
  
  // Message positions cache for efficient grouping
  const messagePositions = useRef(new Map<string, 'first' | 'middle' | 'last' | 'single'>())
  
  // Group messages by date and sender for efficient rendering
  const messageGroups = useMemo(() => {
    const groups: { [date: string]: Message[] } = {}
    
    // Group by date first
    messages.forEach(message => {
      const date = new Date(message.createdAt).toDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
    })
    
    // Convert to optimized structure with sender grouping
    return Object.entries(groups).map(([date, dateMessages]) => {
      // Sort messages by time
      const sortedMessages = dateMessages.sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
      
      // Group consecutive messages from same sender
      const senderGroups: MessageGroup['senderGroups'] = []
      let currentGroup: MessageGroup['senderGroups'][0] | null = null
      
      sortedMessages.forEach((message, index) => {
        const messageTime = new Date(message.createdAt).getTime()
        const shouldStartNewGroup = !currentGroup || 
          currentGroup.senderId !== message.sender.id ||
          (currentGroup.timeSpan.end.getTime() + groupingThreshold * 60 * 1000) < messageTime
        
        if (shouldStartNewGroup) {
          if (currentGroup) {
            senderGroups.push(currentGroup)
          }
          currentGroup = {
            senderId: message.sender.id,
            senderName: message.sender.name,
            isOwn: message.isOwn,
            messages: [message],
            timeSpan: {
              start: new Date(message.createdAt),
              end: new Date(message.createdAt)
            }
          }
        } else if (currentGroup) {
          currentGroup.messages.push(message)
          currentGroup.timeSpan.end = new Date(message.createdAt)
        }
      })
      
      if (currentGroup) {
        senderGroups.push(currentGroup)
      }
      
      return {
        date,
        messages: sortedMessages,
        senderGroups
      }
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [messages, groupingThreshold])
  
  // Calculate unread messages count
  const unreadCount = useMemo(() => {
    return messages.filter(message => !message.isOwn && !message.isRead).length
  }, [messages])
  
  // Get last seen message
  const lastSeenMessage = useMemo(() => {
    const ownMessages = messages.filter(m => m.isOwn)
    if (ownMessages.length === 0) return null
    
    return ownMessages.reduce((latest, current) => {
      const currentTime = new Date(current.createdAt).getTime()
      const latestTime = new Date(latest.createdAt).getTime()
      return currentTime > latestTime ? current : latest
    })
  }, [messages])
  
  // Fast message lookup
  const getMessageById = useCallback((messageId: string): Message | undefined => {
    return messageLookup.get(messageId)
  }, [messageLookup])
  
  // Determine if two messages should be grouped together
  const shouldGroupMessages = useCallback((msg1: Message, msg2: Message): boolean => {
    if (msg1.sender.id !== msg2.sender.id) return false
    
    const time1 = new Date(msg1.createdAt).getTime()
    const time2 = new Date(msg2.createdAt).getTime()
    const timeDiff = Math.abs(time2 - time1) / (1000 * 60) // Minutes
    
    return timeDiff <= groupingThreshold
  }, [groupingThreshold])
  
  // Get message position in a group (for styling)
  const getMessagePosition = useCallback((messageId: string): 'first' | 'middle' | 'last' | 'single' => {
    // Check cache first
    if (messagePositions.current.has(messageId)) {
      return messagePositions.current.get(messageId)!
    }
    
    const message = messageLookup.get(messageId)
    if (!message) return 'single'
    
    // Find message in groups
    for (const group of messageGroups) {
      for (const senderGroup of group.senderGroups) {
        const messageIndex = senderGroup.messages.findIndex(m => m.id === messageId)
        if (messageIndex !== -1) {
          let position: 'first' | 'middle' | 'last' | 'single'
          
          if (senderGroup.messages.length === 1) {
            position = 'single'
          } else if (messageIndex === 0) {
            position = 'first'
          } else if (messageIndex === senderGroup.messages.length - 1) {
            position = 'last'
          } else {
            position = 'middle'
          }
          
          // Cache the result
          messagePositions.current.set(messageId, position)
          return position
        }
      }
    }
    
    return 'single'
  }, [messageLookup, messageGroups])
  
  // Virtual scrolling helpers (for future implementation)
  const isMessageVisible = useCallback((
    messageId: string, 
    viewportTop: number, 
    viewportBottom: number
  ): boolean => {
    // This would be implemented with intersection observer
    // or manual viewport calculations in a full virtual scrolling solution
    return true // Simplified for now
  }, [])
  
  const getVisibleMessageIds = useCallback((
    viewportTop: number, 
    viewportBottom: number
  ): string[] => {
    // This would return only visible message IDs for virtual scrolling
    return messages.map(m => m.id) // Simplified for now
  }, [messages])
  
  // Clear position cache when messages change significantly
  useMemo(() => {
    if (messagePositions.current.size > messages.length * 2) {
      messagePositions.current.clear()
    }
  }, [messages.length])
  
  return {
    messageGroups,
    messageLookup,
    unreadCount,
    lastSeenMessage,
    
    // Performance helpers
    getMessageById,
    isMessageVisible,
    getVisibleMessageIds,
    
    // Grouping utilities
    shouldGroupMessages,
    getMessagePosition
  }
}