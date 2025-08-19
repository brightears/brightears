'use client'

import { useState, useRef, useCallback, KeyboardEvent } from 'react'
import { useTypingIndicator } from '@/hooks/useTypingIndicator'

interface MessageInputProps {
  onSendMessage: (content: string, parentMessageId?: string) => Promise<boolean>
  bookingId: string
  replyToMessage?: {
    id: string
    content: string
    senderName: string
  }
  onCancelReply?: () => void
  disabled?: boolean
  placeholder?: string
  locale: string
  className?: string
}

export default function MessageInput({
  onSendMessage,
  bookingId,
  replyToMessage,
  onCancelReply,
  disabled = false,
  placeholder,
  locale,
  className = ''
}: MessageInputProps) {
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { handleInputChange } = useTypingIndicator({
    bookingId,
    enabled: !disabled,
    debounceMs: 300,
    autoStopMs: 2000
  })

  const getPlaceholder = () => {
    if (placeholder) return placeholder
    return locale === 'th' ? 'พิมพ์ข้อความ...' : 'Type a message...'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isSending || disabled) return

    setIsSending(true)
    
    try {
      const success = await onSendMessage(message.trim(), replyToMessage?.id)
      if (success) {
        setMessage('')
        if (replyToMessage) {
          onCancelReply?.()
        }
        // Reset textarea height
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto'
        }
      }
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  const handleInputChangeWithTyping = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setMessage(value)
    
    // Handle typing indicator
    handleInputChange(value)
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [handleInputChange])

  const isDisabled = disabled || isSending

  return (
    <div className={`border-t border-gray-200 bg-pure-white ${className}`}>
      {/* Reply indicator */}
      {replyToMessage && (
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              <span className="text-gray-600">
                {locale === 'th' ? 'ตอบกลับ' : 'Replying to'} <span className="font-medium">{replyToMessage.senderName}</span>
              </span>
            </div>
            <button
              onClick={onCancelReply}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mt-1 text-xs text-gray-500 truncate max-w-md">
            {replyToMessage.content}
          </div>
        </div>
      )}

      {/* Message input */}
      <form onSubmit={handleSubmit} className="px-4 py-3">
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleInputChangeWithTyping}
              onKeyDown={handleKeyDown}
              placeholder={getPlaceholder()}
              disabled={isDisabled}
              rows={1}
              className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent resize-none transition-all duration-200 ${
                isDisabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-pure-white'
              }`}
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
            
            {/* Character count indicator (optional) */}
            {message.length > 1800 && (
              <div className={`absolute bottom-1 right-1 text-xs px-1 ${
                message.length > 2000 ? 'text-red-500' : 'text-yellow-600'
              }`}>
                {message.length}/2000
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isDisabled || !message.trim() || message.length > 2000}
            className={`flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 ${
              isDisabled || !message.trim() || message.length > 2000
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-brand-cyan hover:bg-brand-cyan/90 active:scale-95'
            } text-pure-white`}
          >
            {isSending ? (
              <div className="w-5 h-5 border-2 border-pure-white/30 border-t-pure-white rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>

        {/* Helper text */}
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>
            {locale === 'th' 
              ? 'กด Enter เพื่อส่ง หรือ Shift + Enter เพื่อขึ้นบรรทัดใหม่'
              : 'Press Enter to send, or Shift + Enter for a new line'
            }
          </span>
          
          {/* Connection status indicator */}
          {disabled && (
            <span className="text-orange-500">
              {locale === 'th' ? 'การเชื่อมต่อขาดหาย' : 'Connection lost'}
            </span>
          )}
        </div>
      </form>
    </div>
  )
}