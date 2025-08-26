'use client'

import { useRef, useCallback, useEffect, useState } from 'react'

interface PerformanceMetrics {
  messageRenderTime: number
  connectionLatency: number
  typingLatency: number
  scrollPerformance: number
  memoryUsage: number
  reconnectionCount: number
  errorCount: number
  averageMessageDelay: number
}

interface PerformanceEvent {
  type: 'message_render' | 'connection' | 'typing' | 'scroll' | 'error' | 'reconnection'
  startTime: number
  endTime?: number
  duration?: number
  metadata?: Record<string, unknown>
}

interface UsePerformanceMonitorProps {
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void
  samplingRate?: number // How often to update metrics (ms)
  maxEvents?: number // Maximum events to keep in memory
}

interface UsePerformanceMonitorReturn {
  metrics: PerformanceMetrics
  
  // Performance tracking
  startTiming: (type: PerformanceEvent['type'], metadata?: Record<string, unknown>) => string
  endTiming: (timingId: string) => void
  recordEvent: (type: PerformanceEvent['type'], duration?: number, metadata?: Record<string, unknown>) => void
  
  // Getters
  getAverageLatency: (type: PerformanceEvent['type']) => number
  getPerformanceReport: () => string
  
  // Controls
  reset: () => void
  export: () => PerformanceEvent[]
}

export function usePerformanceMonitor({
  onMetricsUpdate,
  samplingRate = 5000, // 5 seconds
  maxEvents = 1000
}: UsePerformanceMonitorProps = {}): UsePerformanceMonitorReturn {
  
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    messageRenderTime: 0,
    connectionLatency: 0,
    typingLatency: 0,
    scrollPerformance: 0,
    memoryUsage: 0,
    reconnectionCount: 0,
    errorCount: 0,
    averageMessageDelay: 0
  })
  
  const events = useRef<PerformanceEvent[]>([])
  const activeTimings = useRef(new Map<string, PerformanceEvent>())
  const timingIdCounter = useRef(0)
  const metricsUpdateInterval = useRef<ReturnType<typeof setInterval> | null>(null)
  
  // Start a performance timing
  const startTiming = useCallback((
    type: PerformanceEvent['type'], 
    metadata?: Record<string, unknown>
  ): string => {
    const timingId = `timing-${++timingIdCounter.current}`
    const event: PerformanceEvent = {
      type,
      startTime: performance.now(),
      metadata
    }
    
    activeTimings.current.set(timingId, event)
    return timingId
  }, [])
  
  // End a performance timing
  const endTiming = useCallback((timingId: string) => {
    const event = activeTimings.current.get(timingId)
    if (!event) return
    
    const endTime = performance.now()
    const duration = endTime - event.startTime
    
    const completedEvent: PerformanceEvent = {
      ...event,
      endTime,
      duration
    }
    
    // Add to events list
    events.current.push(completedEvent)
    
    // Trim events if we exceed max
    if (events.current.length > maxEvents) {
      events.current = events.current.slice(-maxEvents)
    }
    
    // Clean up active timing
    activeTimings.current.delete(timingId)
  }, [maxEvents])
  
  // Record a performance event directly
  const recordEvent = useCallback((
    type: PerformanceEvent['type'],
    duration?: number,
    metadata?: Record<string, unknown>
  ) => {
    const event: PerformanceEvent = {
      type,
      startTime: performance.now(),
      duration,
      metadata
    }
    
    events.current.push(event)
    
    if (events.current.length > maxEvents) {
      events.current = events.current.slice(-maxEvents)
    }
  }, [maxEvents])
  
  // Get average latency for a specific event type
  const getAverageLatency = useCallback((type: PerformanceEvent['type']): number => {
    const typeEvents = events.current.filter(e => e.type === type && e.duration)
    if (typeEvents.length === 0) return 0
    
    const totalDuration = typeEvents.reduce((sum, event) => sum + (event.duration || 0), 0)
    return totalDuration / typeEvents.length
  }, [])
  
  // Calculate current metrics
  const calculateMetrics = useCallback((): PerformanceMetrics => {
    const now = performance.now()
    const recentEvents = events.current.filter(e => now - e.startTime < samplingRate * 2)
    
    return {
      messageRenderTime: getAverageLatency('message_render'),
      connectionLatency: getAverageLatency('connection'),
      typingLatency: getAverageLatency('typing'),
      scrollPerformance: getAverageLatency('scroll'),
      memoryUsage: getMemoryUsage(),
      reconnectionCount: recentEvents.filter(e => e.type === 'reconnection').length,
      errorCount: recentEvents.filter(e => e.type === 'error').length,
      averageMessageDelay: getAverageLatency('message_render')
    }
  }, [samplingRate, getAverageLatency])
  
  // Get memory usage (if available)
  const getMemoryUsage = useCallback((): number => {
    if ('memory' in performance) {
      const memory = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory
      return memory ? memory.usedJSHeapSize / 1024 / 1024 : 0 // MB
    }
    return 0
  }, [])
  
  // Generate performance report
  const getPerformanceReport = useCallback((): string => {
    const report = [
      '=== Messaging Performance Report ===',
      `Total Events: ${events.current.length}`,
      `Message Render Time: ${metrics.messageRenderTime.toFixed(2)}ms`,
      `Connection Latency: ${metrics.connectionLatency.toFixed(2)}ms`,
      `Typing Latency: ${metrics.typingLatency.toFixed(2)}ms`,
      `Scroll Performance: ${metrics.scrollPerformance.toFixed(2)}ms`,
      `Memory Usage: ${metrics.memoryUsage.toFixed(2)}MB`,
      `Reconnection Count: ${metrics.reconnectionCount}`,
      `Error Count: ${metrics.errorCount}`,
      '',
      '=== Event Breakdown ===',
      ...Object.entries(
        events.current.reduce((acc, event) => {
          acc[event.type] = (acc[event.type] || 0) + 1
          return acc
        }, {} as Record<string, number>)
      ).map(([type, count]) => `${type}: ${count} events`)
    ]
    
    return report.join('\n')
  }, [metrics])
  
  // Reset all metrics
  const reset = useCallback(() => {
    events.current = []
    activeTimings.current.clear()
    setMetrics({
      messageRenderTime: 0,
      connectionLatency: 0,
      typingLatency: 0,
      scrollPerformance: 0,
      memoryUsage: 0,
      reconnectionCount: 0,
      errorCount: 0,
      averageMessageDelay: 0
    })
  }, [])
  
  // Export events for analysis
  const exportEvents = useCallback((): PerformanceEvent[] => {
    return [...events.current]
  }, [])
  
  // Update metrics periodically
  useEffect(() => {
    metricsUpdateInterval.current = setInterval(() => {
      const newMetrics = calculateMetrics()
      setMetrics(newMetrics)
      onMetricsUpdate?.(newMetrics)
    }, samplingRate)
    
    return () => {
      if (metricsUpdateInterval.current) {
        clearInterval(metricsUpdateInterval.current)
      }
    }
  }, [calculateMetrics, onMetricsUpdate, samplingRate])
  
  // Log performance warnings
  useEffect(() => {
    if (metrics.messageRenderTime > 100) {
      console.warn('High message render time detected:', metrics.messageRenderTime, 'ms')
    }
    if (metrics.connectionLatency > 1000) {
      console.warn('High connection latency detected:', metrics.connectionLatency, 'ms')
    }
    if (metrics.memoryUsage > 100) {
      console.warn('High memory usage detected:', metrics.memoryUsage, 'MB')
    }
  }, [metrics])
  
  // Browser performance monitoring
  useEffect(() => {
    // Monitor long tasks (if supported)
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.duration > 50) { // Long task threshold
              recordEvent('scroll', entry.duration, {
                name: entry.name,
                entryType: entry.entryType
              })
            }
          })
        })
        
        observer.observe({ entryTypes: ['longtask', 'measure'] })
        
        return () => observer.disconnect()
      } catch (error) {
        console.warn('Performance observer not fully supported:', error)
      }
    }
  }, [recordEvent])
  
  return {
    metrics,
    
    // Performance tracking
    startTiming,
    endTiming,
    recordEvent,
    
    // Getters
    getAverageLatency,
    getPerformanceReport,
    
    // Controls
    reset,
    export: exportEvents
  }
}