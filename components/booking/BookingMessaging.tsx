'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { useSession } from 'next-auth/react'
import Image from 'next/image'

interface Message {
  id: string
  content: string
  createdAt: string
  isRead: boolean
  readAt?: string
  sender: {
    id: string
    email: string
    role: string
    name: string
    profileImage?: string
  }
  isOwn: boolean
}

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

interface BookingMessagingProps {
  booking: Booking
  locale: string
  onClose: () => void
}

export default function BookingMessaging({ booking, locale, onClose }: BookingMessagingProps) {
  const t = useTranslations('messaging')
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchMessages()
  }, [booking.id])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/bookings/${booking.id}/messages`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    setIsSending(true)
    try {
      const response = await fetch(`/api/bookings/${booking.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newMessage.trim() }),
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(prev => [...prev, data.message])
        setNewMessage('')
      } else {
        alert(t('sendError'))
      }
    } catch (error) {
      alert(t('sendError'))
    } finally {
      setIsSending(false)
    }
  }

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

  const groupMessagesByDate = (messages: Message[]) => {
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
      messages
    }))
  }

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

  const messageGroups = groupMessagesByDate(messages)

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
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="text-gray-500">{t('loadingMessages')}</div>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="font-playfair text-lg font-semibold text-dark-gray mb-2">
                  {t('noMessages')}
                </h3>
                <p className="text-gray-600">
                  {t('startConversation')}
                </p>
              </div>
            ) : (
              messageGroups.map(group => (
                <div key={group.date}>
                  {/* Date Header */}
                  <div className="text-center mb-4">
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">
                      {formatDateHeader(group.date)}
                    </span>
                  </div>

                  {/* Messages for this date */}
                  {group.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'} mb-4`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.isOwn 
                          ? 'bg-brand-cyan text-pure-white' 
                          : 'bg-gray-100 text-dark-gray'
                      }`}>
                        {!message.isOwn && (
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
                            <span className="text-xs font-medium">
                              {message.sender.name}
                            </span>
                          </div>
                        )}
                        <p className="break-words">{message.content}</p>
                        <div className="flex items-center justify-end space-x-1 mt-1">
                          <span className={`text-xs ${
                            message.isOwn ? 'text-pure-white/70' : 'text-gray-500'
                          }`}>
                            {formatMessageTime(message.createdAt)}
                          </span>
                          {message.isOwn && (
                            <div className="flex space-x-1">
                              <svg 
                                className={`w-3 h-3 ${
                                  message.isRead ? 'text-pure-white' : 'text-pure-white/50'
                                }`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth={3} 
                                  d="M5 13l4 4L19 7" 
                                />
                              </svg>
                              {message.isRead && (
                                <svg 
                                  className="w-3 h-3 text-pure-white" 
                                  fill="none" 
                                  stroke="currentColor" 
                                  viewBox="0 0 24 24"
                                >
                                  <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={3} 
                                    d="M5 13l4 4L19 7" 
                                  />
                                </svg>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          {booking.status !== 'CANCELLED' && (
            <div className="bg-pure-white border-t border-gray-200 px-6 py-4">
              <form onSubmit={sendMessage} className="flex space-x-3">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={t('typeMessage')}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-transparent resize-none"
                  rows={2}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      sendMessage(e)
                    }
                  }}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || isSending}
                  className="px-4 py-2 bg-brand-cyan text-pure-white rounded-lg hover:bg-brand-cyan/80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSending ? (
                    <div className="w-5 h-5 border-2 border-pure-white/30 border-t-pure-white rounded-full animate-spin" />
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                </button>
              </form>
              <p className="text-xs text-gray-500 mt-2">
                {t('pressEnterToSend')}
              </p>
            </div>
          )}

          {booking.status === 'CANCELLED' && (
            <div className="bg-red-50 border-t border-red-200 px-6 py-4">
              <p className="text-sm text-red-800 text-center">
                {t('bookingCancelled')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}