'use client'

import { useState, useCallback, useRef } from 'react'

export interface ErrorInfo {
  message: string
  timestamp: Date
  type: 'connection' | 'message' | 'system' | 'network'
  retryable: boolean
  retryCount: number
}

interface UseErrorHandlerProps {
  maxRetries?: number
  onError?: (error: ErrorInfo) => void
  onRetry?: (error: ErrorInfo) => void
  onMaxRetriesReached?: (error: ErrorInfo) => void
}

interface UseErrorHandlerReturn {
  errors: ErrorInfo[]
  currentError: ErrorInfo | null
  hasErrors: boolean
  
  // Actions
  addError: (message: string, type: ErrorInfo['type'], retryable?: boolean) => string
  retryError: (errorId: string) => Promise<boolean>
  clearError: (errorId: string) => void
  clearAllErrors: () => void
  
  // Helpers
  getRetryDelay: (retryCount: number) => number
  isRetryable: (errorId: string) => boolean
}

export function useErrorHandler({
  maxRetries = 5,
  onError,
  onRetry,
  onMaxRetriesReached
}: UseErrorHandlerProps = {}): UseErrorHandlerReturn {
  const [errors, setErrors] = useState<(ErrorInfo & { id: string })[]>([])
  const errorIdCounter = useRef(0)

  const addError = useCallback((
    message: string,
    type: ErrorInfo['type'],
    retryable = true
  ): string => {
    const errorId = `error-${++errorIdCounter.current}`
    const error: ErrorInfo & { id: string } = {
      id: errorId,
      message,
      type,
      timestamp: new Date(),
      retryable,
      retryCount: 0
    }

    setErrors(prev => [...prev, error])
    onError?.(error)

    return errorId
  }, [onError])

  const retryError = useCallback(async (errorId: string): Promise<boolean> => {
    const error = errors.find(e => e.id === errorId)
    if (!error || !error.retryable) return false

    if (error.retryCount >= maxRetries) {
      onMaxRetriesReached?.(error)
      return false
    }

    // Update retry count
    setErrors(prev => prev.map(e => 
      e.id === errorId 
        ? { ...e, retryCount: e.retryCount + 1, timestamp: new Date() }
        : e
    ))

    onRetry?.(error)
    return true
  }, [errors, maxRetries, onRetry, onMaxRetriesReached])

  const clearError = useCallback((errorId: string) => {
    setErrors(prev => prev.filter(e => e.id !== errorId))
  }, [])

  const clearAllErrors = useCallback(() => {
    setErrors([])
  }, [])

  const getRetryDelay = useCallback((retryCount: number): number => {
    // Exponential backoff with jitter: 1s, 2s, 4s, 8s, 16s, then cap at 30s
    const baseDelay = Math.min(1000 * Math.pow(2, retryCount), 30000)
    const jitter = Math.random() * 0.3 * baseDelay
    return baseDelay + jitter
  }, [])

  const isRetryable = useCallback((errorId: string): boolean => {
    const error = errors.find(e => e.id === errorId)
    return error ? error.retryable && error.retryCount < maxRetries : false
  }, [errors, maxRetries])

  const currentError = errors.length > 0 ? errors[errors.length - 1] : null
  const hasErrors = errors.length > 0

  return {
    errors: errors.map(({ id, ...error }) => error),
    currentError: currentError ? { ...currentError, id: undefined } as ErrorInfo : null,
    hasErrors,

    // Actions
    addError,
    retryError,
    clearError,
    clearAllErrors,

    // Helpers
    getRetryDelay,
    isRetryable
  }
}