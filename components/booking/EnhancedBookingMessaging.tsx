'use client'

import { useState, useCallback, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRealtimeMessaging, type Message } from '@/hooks/useRealtimeMessaging'
import { useConnectionStatus } from '@/hooks/useConnectionStatus'
import ConnectionStatus from './messaging/ConnectionStatus'
import MessagesList from './messaging/MessagesList'
import MessageInput from './messaging/MessageInput'

interface Booking {
  id: string
  bookingNumber: string
  artistName: string
  artistImage?: string
  artistCategory: string
  eventType: string
  eventDate: string
  status: string
  venue: string
}

interface EnhancedBookingMessagingProps {
  booking: Booking
  locale: string
  onClose: () => void
}

export default function EnhancedBookingMessaging({ 
  booking, 
  locale, 
  onClose 
}: EnhancedBookingMessagingProps) {
  const t = useTranslations('messaging')
  const { data: session } = useSession()
  const [replyToMessage, setReplyToMessage] = useState<{
    id: string
    content: string
    senderName: string
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Connection status management
  const {
    connectionStatus,
    updateConnectionStatus,
    resetReconnectAttempts,
    shouldShowReconnectButton
  } = useConnectionStatus({
    onConnectionChange: (status) => {
      if (status.isConnected) {
        setError(null)
      }
    },
    maxReconnectAttempts: 5
  })


  // Real-time messaging with SSE
  const {
    messages,
    typingUsers,
    isLoading,
    error: messagingError,
    sendMessage: sendRealtimeMessage,
    loadMoreMessages,
    reconnect,
    hasMore
  } = useRealtimeMessaging({
    bookingId: booking.id,
    enabled: !!session?.user
  })

  // Handle reply functionality
  const handleReply = useCallback((messageId: string) => {
    const message = messages.find(m => m.id === messageId)
    if (message) {
      setReplyToMessage({
        id: message.id,
        content: message.content,
        senderName: message.sender.name
      })
    }
  }, [messages])

  const handleCancelReply = useCallback(() => {
    setReplyToMessage(null)
  }, [])

  // Handle message sending
  const handleSendMessage = useCallback(async (content: string, parentMessageId?: string): Promise<boolean> => {
    if (!content.trim()) return false
    
    try {
      const result = await sendRealtimeMessage(content, 'TEXT', undefined, parentMessageId)
      if (!result) {
        setError(t('sendError') || 'Failed to send message')
        return false
      }
      return true
    } catch (err) {
      console.error('Error sending message:', err)
      setError(t('sendError') || 'Failed to send message')
      return false
    }
  }, [sendRealtimeMessage, t])

  // Handle reconnection
  const handleReconnect = useCallback(() => {
    setError(null)
    resetReconnectAttempts()
    reconnect()
  }, [reconnect, resetReconnectAttempts])

  // Update connection status from SSE events
  useMemo(() => {
    updateConnectionStatus({
      isConnected: !messagingError,
      reconnectAttempts: messagingError ? connectionStatus.reconnectAttempts + 1 : 0
    })
  }, [messagingError, updateConnectionStatus, connectionStatus.reconnectAttempts])

  // Combined error state
  const combinedError = error || messagingError

  // Determine if messaging should be disabled
  const isMessagingDisabled = booking.status === 'CANCELLED' || !connectionStatus.isConnected

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="flex h-full">
        <div className="fixed inset-0 bg-dark-gray bg-opacity-50" onClick={onClose} />
        
        <div className="relative ml-auto bg-pure-white shadow-xl max-w-2xl w-full flex flex-col">
          {/* Header */}
          <div className="bg-pure-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {booking.artistImage && (
                  <Image
                    src={booking.artistImage}
                    alt={booking.artistName}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                )}
                <div>
                  <h2 className="font-playfair text-lg font-semibold text-dark-gray">
                    {booking.artistName}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {booking.eventType} • {booking.venue}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Connection Status */}
          <ConnectionStatus
            connectionStatus={connectionStatus}
            locale={locale}
            onReconnect={shouldShowReconnectButton() ? handleReconnect : undefined}
            showActiveUsers={true}
          />

          {/* Error Banner */}
          {combinedError && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-700">
                  {combinedError}
                </p>
              </div>
            </div>
          )}

          {/* Messages List */}
          <MessagesList
            messages={messages}
            typingIndicators={typingUsers}
            locale={locale}
            onLoadMore={async () => { await loadMoreMessages(); return true }}
            onReply={handleReply}
            hasMoreMessages={hasMore}
            isLoadingMore={isLoading}
            isLoading={isLoading}
            error={combinedError}
          />

          {/* Message Input */}
          {!isMessagingDisabled && (
            <MessageInput
              onSendMessage={handleSendMessage}
              bookingId={booking.id}
              replyToMessage={replyToMessage || undefined}
              onCancelReply={handleCancelReply}
              disabled={isMessagingDisabled}
              placeholder={t('typeMessage')}
              locale={locale}
            />
          )}

          {/* Disabled State Messages */}
          {booking.status === 'CANCELLED' && (
            <div className="bg-red-50 border-t border-red-200 px-6 py-4">
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-800 font-medium">
                  {t('bookingCancelled')}
                </p>
              </div>
            </div>
          )}

          {!connectionStatus.isConnected && booking.status !== 'CANCELLED' && (
            <div className="bg-yellow-50 border-t border-yellow-200 px-6 py-4">
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.82-.833-2.592 0L3.232 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-sm text-yellow-800">
                  {locale === 'th' 
                    ? 'การเชื่อมต่อขาดหาย - ข้อความอาจไม่ส่งได้'
                    : 'Connection lost - messages may not send'
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}