'use client'

import { memo } from 'react'
import Image from 'next/image'
import type { Message } from '@/hooks/useRealtimeMessaging'

interface MessageBubbleProps {
  message: Message
  locale: string
  showSender?: boolean
  showTimestamp?: boolean
  onReply?: (messageId: string) => void
}

const DeliveryStatusIcon = memo(({ 
  status, 
  isOwn 
}: { 
  status: Message['deliveryStatus']
  isOwn: boolean 
}) => {
  if (!isOwn) return null
  
  const getStatusIcon = () => {
    switch (status) {
      case 'SENT':
        return (
          <svg 
            className="w-3 h-3 text-pure-white/50" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        )
      case 'DELIVERED':
        return (
          <div className="flex space-x-0.5">
            <svg 
              className="w-3 h-3 text-pure-white/70" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
            <svg 
              className="w-3 h-3 text-pure-white/70 -ml-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
        )
      case 'READ':
        return (
          <div className="flex space-x-0.5">
            <svg 
              className="w-3 h-3 text-pure-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
            <svg 
              className="w-3 h-3 text-pure-white -ml-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
        )
      default:
        return null
    }
  }
  
  return (
    <div className="flex items-center justify-end ml-2">
      {getStatusIcon()}
    </div>
  )
})

DeliveryStatusIcon.displayName = 'DeliveryStatusIcon'

const MessageBubble = memo(({
  message,
  locale,
  showSender = true,
  showTimestamp = true,
  onReply
}: MessageBubbleProps) => {
  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString(locale === 'th' ? 'th-TH' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    } else {
      return date.toLocaleDateString(locale === 'th' ? 'th-TH' : 'en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  const handleReplyClick = () => {
    onReply?.(message.id)
  }

  return (
    <div
      className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'} mb-3 group`}
    >
      <div className={`max-w-xs lg:max-w-md relative ${message.isOwn ? 'order-2' : 'order-1'}`}>
        {/* Parent message reference (reply indicator) */}
        {message.parentMessage && (
          <div className={`mb-2 p-2 rounded border-l-2 text-xs ${
            message.isOwn
              ? 'border-pure-white/30 bg-pure-white/10 text-pure-white/70'
              : 'border-brand-cyan/30 bg-gray-50 text-gray-600'
          }`}>
            <div className="font-medium mb-1">{message.parentMessage.senderName}</div>
            <div className="truncate">{message.parentMessage.content}</div>
          </div>
        )}

        {/* Main message bubble */}
        <div className={`px-4 py-2 rounded-lg relative ${
          message.isOwn 
            ? 'bg-brand-cyan text-pure-white rounded-br-sm' 
            : 'bg-pure-white text-dark-gray border shadow-sm rounded-bl-sm'
        }`}>
          {/* Sender info (for non-own messages) */}
          {!message.isOwn && showSender && (
            <div className="flex items-center space-x-2 mb-1">
              {message.sender.profileImage && (
                <Image
                  src={message.sender.profileImage}
                  alt={message.sender.name}
                  width={16}
                  height={16}
                  className="rounded-full object-cover"
                />
              )}
              <span className="text-xs font-medium text-gray-600">
                {message.sender.name}
              </span>
            </div>
          )}

          {/* Message content */}
          <div className="break-words whitespace-pre-wrap">
            {message.content}
          </div>

          {/* Image/File attachment */}
          {message.attachmentUrl && message.messageType === 'IMAGE' && (
            <div className="mt-2">
              <Image
                src={message.attachmentUrl}
                alt="Attachment"
                width={200}
                height={150}
                className="rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => window.open(message.attachmentUrl, '_blank')}
              />
            </div>
          )}

          {message.attachmentUrl && message.messageType === 'FILE' && (
            <div className="mt-2 p-2 bg-black/10 rounded flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
              </svg>
              <a 
                href={message.attachmentUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm underline hover:no-underline"
              >
                View File
              </a>
            </div>
          )}

          {/* Timestamp and delivery status */}
          <div className="flex items-center justify-between mt-1 text-xs">
            <div className="flex-1">
              {showTimestamp && (
                <span className={message.isOwn ? 'text-pure-white/70' : 'text-gray-500'}>
                  {formatMessageTime(message.createdAt)}
                </span>
              )}
            </div>
            
            <DeliveryStatusIcon status={message.deliveryStatus} isOwn={message.isOwn} />
          </div>

          {/* Reply button (shown on hover) */}
          {onReply && (
            <button
              onClick={handleReplyClick}
              className={`absolute top-0 ${message.isOwn ? '-left-8' : '-right-8'} opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded-full ${
                message.isOwn 
                  ? 'bg-pure-white text-brand-cyan hover:bg-gray-50' 
                  : 'bg-brand-cyan text-pure-white hover:bg-brand-cyan/90'
              }`}
              title={locale === 'th' ? 'ตอบกลับ' : 'Reply'}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </button>
          )}
        </div>

        {/* Replies */}
        {message.replies && message.replies.length > 0 && (
          <div className="mt-2 space-y-1">
            {message.replies.map((reply) => (
              <div
                key={reply.id}
                className={`text-xs p-2 rounded ${
                  message.isOwn 
                    ? 'bg-pure-white/10 text-pure-white/80 ml-4' 
                    : 'bg-gray-100 text-gray-700 mr-4'
                }`}
              >
                <div className="font-medium mb-1">{reply.senderName}</div>
                <div>{reply.content}</div>
                <div className="text-xs opacity-70 mt-1">
                  {formatMessageTime(reply.createdAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
})

MessageBubble.displayName = 'MessageBubble'

export default MessageBubble