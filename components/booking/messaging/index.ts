// Enhanced Real-time Messaging Components and Hooks
// This file provides a complete real-time messaging system for BookingMessaging

// Core Components
export { default as MessageBubble } from './MessageBubble'
export { default as MessagesList } from './MessagesList'
export { default as MessageInput } from './MessageInput'
export { default as TypingIndicator } from './TypingIndicator'
export { default as ConnectionStatus } from './ConnectionStatus'
export { default as MessagingErrorBoundary } from './MessagingErrorBoundary'

// Enhanced Messaging Container
export { default as EnhancedBookingMessaging } from '../EnhancedBookingMessaging'

// Core Hooks
export { 
  useRealtimeMessaging, 
  type Message, 
  type ConnectionState as ConnectionStatusType,
  type TypingUser as TypingIndicatorType
} from '../../../hooks/useRealtimeMessaging'

export { 
  useConnectionStatus,
  type UseConnectionStatusReturn 
} from '../../../hooks/useConnectionStatus'

export { 
  useTypingIndicator,
  type UseTypingIndicatorReturn 
} from '../../../hooks/useTypingIndicator'

// Export main hooks that are commonly used
export { usePerformanceMonitor } from '../../../hooks/usePerformanceMonitor'