'use client'

import { memo } from 'react'
import type { TypingUser as TypingIndicatorType } from '@/hooks/useRealtimeMessaging'

interface TypingIndicatorProps {
  typingUsers: TypingIndicatorType[]
  locale: string
  className?: string
}

const TypingDots = memo(() => (
  <div className="flex space-x-1">
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
  </div>
))

TypingDots.displayName = 'TypingDots'

const TypingIndicator = memo(({
  typingUsers,
  locale,
  className = ''
}: TypingIndicatorProps) => {
  if (typingUsers.length === 0) {
    return null
  }

  const formatTypingText = (users: TypingIndicatorType[]) => {
    if (users.length === 0) return ''
    
    if (locale === 'th') {
      if (users.length === 1) {
        return `${users[0].userName} กำลังพิมพ์...`
      } else if (users.length === 2) {
        return `${users[0].userName} และ ${users[1].userName} กำลังพิมพ์...`
      } else {
        return `${users[0].userName} และอีก ${users.length - 1} คน กำลังพิมพ์...`
      }
    }
    
    // English
    if (users.length === 1) {
      return `${users[0].userName} is typing...`
    } else if (users.length === 2) {
      return `${users[0].userName} and ${users[1].userName} are typing...`
    } else {
      return `${users[0].userName} and ${users.length - 1} others are typing...`
    }
  }

  return (
    <div className={`flex items-center space-x-3 px-4 py-2 ${className}`}>
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <TypingDots />
        <span className="italic">
          {formatTypingText(typingUsers)}
        </span>
      </div>
    </div>
  )
})

TypingIndicator.displayName = 'TypingIndicator'

export default TypingIndicator