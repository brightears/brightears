'use client'

import { memo, useRef, useEffect, useState, useCallback } from 'react'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'
import type { Message, TypingUser as TypingIndicatorType } from '@/hooks/useRealtimeMessaging'

interface MessagesListProps {
  messages: Message[]
  typingIndicators: TypingIndicatorType[]
  locale: string
  onLoadMore: () => Promise<boolean>
  onReply?: (messageId: string) => void
  hasMoreMessages: boolean
  isLoadingMore: boolean
  isLoading: boolean
  error: string | null
  className?: string
}

const DateDivider = memo(({ date, locale }: { date: string; locale: string }) => {
  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === now.toDateString()) {
      return locale === 'th' ? 'วันนี้' : 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return locale === 'th' ? 'เมื่อวาน' : 'Yesterday'
    } else {
      return date.toLocaleDateString(locale === 'th' ? 'th-TH' : 'en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      })
    }
  }

  return (
    <div className="text-center my-4">
      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
        {formatDateHeader(date)}
      </span>
    </div>
  )
})

DateDivider.displayName = 'DateDivider'

const LoadMoreButton = memo(({ 
  onLoadMore, 
  isLoading, 
  locale 
}: { 
  onLoadMore: () => void
  isLoading: boolean
  locale: string 
}) => (
  <div className="text-center py-4">
    <button
      onClick={onLoadMore}
      disabled={isLoading}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
        isLoading
          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          <span>{locale === 'th' ? 'กำลังโหลด...' : 'Loading...'}</span>
        </div>
      ) : (
        <span>{locale === 'th' ? 'โหลดข้อความเก่า' : 'Load older messages'}</span>
      )}
    </button>
  </div>
))

LoadMoreButton.displayName = 'LoadMoreButton'

const EmptyState = memo(({ locale }: { locale: string }) => (
  <div className="text-center py-12">
    <div className="text-6xl mb-4">💬</div>
    <h3 className="font-playfair text-lg font-semibold text-dark-gray mb-2">
      {locale === 'th' ? 'ยังไม่มีข้อความ' : 'No messages yet'}
    </h3>
    <p className="text-gray-600">
      {locale === 'th' 
        ? 'เริ่มต้นการสนทนาโดยการส่งข้อความแรกของคุณ'
        : 'Start the conversation by sending your first message'
      }
    </p>
  </div>
))

EmptyState.displayName = 'EmptyState'

const ErrorState = memo(({ 
  error, 
  locale, 
  onRetry 
}: { 
  error: string
  locale: string
  onRetry: () => void
}) => (
  <div className="text-center py-8">
    <div className="text-red-500 text-4xl mb-4">⚠️</div>
    <p className="text-red-600 mb-4">
      {locale === 'th' ? 'เกิดข้อผิดพลาดในการโหลดข้อความ' : 'Error loading messages'}
    </p>
    <p className="text-sm text-gray-600 mb-4">{error}</p>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-brand-cyan text-pure-white rounded-lg hover:bg-brand-cyan/90"
    >
      {locale === 'th' ? 'ลองใหม่' : 'Try Again'}
    </button>
  </div>
))

ErrorState.displayName = 'ErrorState'

const MessagesList = memo(({
  messages,
  typingIndicators,
  locale,
  onLoadMore,
  onReply,
  hasMoreMessages,
  isLoadingMore,
  isLoading,
  error,
  className = ''
}: MessagesListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)
  const [userScrolled, setUserScrolled] = useState(false)
  
  // Group messages by date
  const groupMessagesByDate = useCallback((messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {}
    
    messages.forEach(message => {
      const date = new Date(message.createdAt).toDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
    })
    
    return Object.entries(groups).map(([date, messages]) => ({
      date,
      messages: messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    }))
  }, [])

  const messageGroups = groupMessagesByDate(messages)

  // Auto-scroll to bottom for new messages
  useEffect(() => {
    if (shouldAutoScroll && !userScrolled) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, shouldAutoScroll, userScrolled])

  // Handle scroll events
  const handleScroll = useCallback(() => {
    if (!messagesContainerRef.current) return
    
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
    const scrolledToBottom = scrollHeight - scrollTop <= clientHeight + 50
    
    setUserScrolled(!scrolledToBottom)
    setShouldAutoScroll(scrolledToBottom)

    // Load more messages when scrolling to top
    if (scrollTop < 100 && hasMoreMessages && !isLoadingMore) {
      const prevScrollHeight = scrollHeight
      onLoadMore().then(() => {
        // Maintain scroll position after loading more messages
        requestAnimationFrame(() => {
          if (messagesContainerRef.current) {
            const newScrollHeight = messagesContainerRef.current.scrollHeight
            messagesContainerRef.current.scrollTop = newScrollHeight - prevScrollHeight
          }
        })
      })
    }
  }, [hasMoreMessages, isLoadingMore, onLoadMore])

  const scrollToBottom = useCallback(() => {
    setShouldAutoScroll(true)
    setUserScrolled(false)
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  if (error) {
    return (
      <div className={`flex-1 overflow-y-auto ${className}`}>
        <ErrorState 
          error={error} 
          locale={locale} 
          onRetry={() => window.location.reload()} 
        />
      </div>
    )
  }

  if (isLoading && messages.length === 0) {
    return (
      <div className={`flex-1 overflow-y-auto ${className}`}>
        <div className="text-center py-8">
          <div className="w-8 h-8 border-2 border-brand-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">
            {locale === 'th' ? 'กำลังโหลดข้อความ...' : 'Loading messages...'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col relative">
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className={`flex-1 overflow-y-auto px-4 py-4 space-y-1 ${className}`}
        style={{ scrollBehavior: 'auto' }}
      >
        {/* Load more button at top */}
        {hasMoreMessages && (
          <LoadMoreButton 
            onLoadMore={onLoadMore} 
            isLoading={isLoadingMore} 
            locale={locale} 
          />
        )}

        {/* Empty state */}
        {messages.length === 0 && !isLoading && (
          <EmptyState locale={locale} />
        )}

        {/* Messages grouped by date */}
        {messageGroups.map(group => (
          <div key={group.date}>
            <DateDivider date={group.date} locale={locale} />
            {group.messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                locale={locale}
                onReply={onReply}
              />
            ))}
          </div>
        ))}

        {/* Typing indicators */}
        <TypingIndicator 
          typingUsers={typingIndicators} 
          locale={locale}
          className="mb-4"
        />

        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to bottom button */}
      {userScrolled && (
        <div className="absolute bottom-4 right-4">
          <button
            onClick={scrollToBottom}
            className="p-2 bg-brand-cyan text-pure-white rounded-full shadow-lg hover:bg-brand-cyan/90 transition-all duration-200 hover:scale-105"
            title={locale === 'th' ? 'เลื่อนไปด้านล่าง' : 'Scroll to bottom'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            {messages.length > 0 && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            )}
          </button>
        </div>
      )}
    </div>
  )
})

MessagesList.displayName = 'MessagesList'

export default MessagesList