'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  locale?: string
}

interface State {
  hasError: boolean
  error: Error | null
  errorId: string | null
  retryCount: number
}

class MessagingErrorBoundary extends Component<Props, State> {
  private retryTimeoutId: NodeJS.Timeout | null = null

  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorId: null,
      retryCount: 0
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorId: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    console.error('MessagingErrorBoundary caught an error:', error, errorInfo)
    
    // Call the onError callback if provided
    this.props.onError?.(error, errorInfo)

    // Log to external service if needed
    this.logErrorToService(error, errorInfo)
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId)
    }
  }

  private logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // In a real application, you would send this to your error tracking service
    // like Sentry, LogRocket, etc.
    if (process.env.NODE_ENV === 'production') {
      console.log('Error would be logged to service:', {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      })
    }
  }

  private handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorId: null,
      retryCount: prevState.retryCount + 1
    }))
  }

  private handleAutoRetry = () => {
    // Auto-retry after 3 seconds for the first 2 attempts
    if (this.state.retryCount < 2) {
      this.retryTimeoutId = setTimeout(() => {
        this.handleRetry()
      }, 3000)
    }
  }

  private getErrorMessage = () => {
    const { locale } = this.props
    const { error } = this.state

    if (!error) return ''

    // Check for specific error types and provide user-friendly messages
    if (error.message.includes('Network')) {
      return locale === 'th' 
        ? 'เกิดปัญหาการเชื่อมต่อเครือข่าย กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต'
        : 'Network connection problem. Please check your internet connection.'
    }

    if (error.message.includes('timeout')) {
      return locale === 'th'
        ? 'การเชื่อมต่อหมดเวลา กรุณาลองใหม่อีกครั้ง'
        : 'Connection timed out. Please try again.'
    }

    if (error.message.includes('unauthorized') || error.message.includes('401')) {
      return locale === 'th'
        ? 'การตรวจสอบสิทธิ์ล้มเหลว กรุณาเข้าสู่ระบบใหม่'
        : 'Authentication failed. Please log in again.'
    }

    // Generic error message
    return locale === 'th'
      ? 'เกิดข้อผิดพลาดในระบบข้อความ กรุณาลองใหม่อีกครั้ง'
      : 'An error occurred in the messaging system. Please try again.'
  }

  render() {
    const { locale = 'en', children, fallback } = this.props
    const { hasError, retryCount } = this.state

    if (hasError) {
      // Auto-retry logic
      if (retryCount === 0) {
        this.handleAutoRetry()
      }

      // Custom fallback UI
      if (fallback) {
        return fallback
      }

      // Default error UI
      return (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            
            <h3 className="font-playfair text-xl font-semibold text-dark-gray mb-4">
              {locale === 'th' ? 'เกิดข้อผิดพลาด' : 'Something went wrong'}
            </h3>
            
            <p className="text-gray-600 mb-6 text-sm">
              {this.getErrorMessage()}
            </p>

            {/* Retry countdown for auto-retry */}
            {retryCount < 2 && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center justify-center space-x-2 text-yellow-700">
                  <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm">
                    {locale === 'th' 
                      ? 'กำลังลองเชื่อมต่อใหม่อัตโนมัติ...' 
                      : 'Auto-retrying connection...'}
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full px-6 py-3 bg-brand-cyan text-pure-white font-medium rounded-lg hover:bg-brand-cyan/90 transition-colors"
              >
                {locale === 'th' ? 'ลองใหม่' : 'Try Again'}
              </button>

              <button
                onClick={() => window.location.reload()}
                className="w-full px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                {locale === 'th' ? 'รีเฟรชหน้า' : 'Refresh Page'}
              </button>
            </div>

            {/* Error details for development */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Error Details (Development Only)
                </summary>
                <pre className="mt-2 p-3 bg-gray-100 text-xs text-red-600 rounded overflow-auto max-h-32">
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            <p className="text-xs text-gray-400 mt-4">
              {locale === 'th' 
                ? `ข้อผิดพลาดเลขที่: ${this.state.errorId}` 
                : `Error ID: ${this.state.errorId}`
              }
            </p>
          </div>
        </div>
      )
    }

    return children
  }
}

export default MessagingErrorBoundary