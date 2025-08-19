'use client'

import { useState, useRef, useCallback, useEffect, useMemo } from 'react'

interface VirtualItem {
  index: number
  start: number
  size: number
  end: number
}

interface UseVirtualScrollProps {
  size: number
  estimateSize: number
  scrollElement?: HTMLElement | null
  overscan?: number
  horizontal?: boolean
  paddingStart?: number
  paddingEnd?: number
  onScrollToIndex?: (index: number) => void
}

interface UseVirtualScrollReturn {
  virtualItems: VirtualItem[]
  totalSize: number
  scrollToIndex: (index: number, align?: 'start' | 'center' | 'end' | 'auto') => void
  scrollToOffset: (offset: number) => void
  measureElement: (index: number, element: HTMLElement) => void
}

export function useVirtualScroll({
  size,
  estimateSize,
  scrollElement,
  overscan = 3,
  horizontal = false,
  paddingStart = 0,
  paddingEnd = 0,
  onScrollToIndex
}: UseVirtualScrollProps): UseVirtualScrollReturn {
  const [scrollOffset, setScrollOffset] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  
  // Cache for measured sizes
  const sizeMap = useRef(new Map<number, number>())
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  // Get the size of an item (measured or estimated)
  const getItemSize = useCallback((index: number): number => {
    return sizeMap.current.get(index) ?? estimateSize
  }, [estimateSize])
  
  // Calculate total size of all items
  const totalSize = useMemo(() => {
    let total = paddingStart + paddingEnd
    for (let i = 0; i < size; i++) {
      total += getItemSize(i)
    }
    return total
  }, [size, getItemSize, paddingStart, paddingEnd])
  
  // Calculate which items should be visible
  const virtualItems = useMemo(() => {
    if (!scrollElement) return []
    
    const containerSize = horizontal 
      ? scrollElement.clientWidth 
      : scrollElement.clientHeight
    
    const items: VirtualItem[] = []
    let offset = paddingStart
    
    // Find the first visible item
    let start = 0
    while (start < size && offset + getItemSize(start) < scrollOffset) {
      offset += getItemSize(start)
      start++
    }
    
    // Add overscan before
    const visibleStart = Math.max(0, start - overscan)
    
    // Calculate visible items
    offset = paddingStart
    for (let i = 0; i < visibleStart; i++) {
      offset += getItemSize(i)
    }
    
    for (let i = visibleStart; i < size; i++) {
      const itemSize = getItemSize(i)
      const itemStart = offset
      const itemEnd = itemStart + itemSize
      
      items.push({
        index: i,
        start: itemStart,
        size: itemSize,
        end: itemEnd
      })
      
      offset = itemEnd
      
      // Stop if we've gone beyond the visible area plus overscan
      if (itemStart > scrollOffset + containerSize + (overscan * estimateSize)) {
        break
      }
    }
    
    return items
  }, [
    scrollElement, 
    size, 
    scrollOffset, 
    getItemSize, 
    overscan, 
    estimateSize, 
    paddingStart,
    horizontal
  ])
  
  // Measure an element and cache its size
  const measureElement = useCallback((index: number, element: HTMLElement) => {
    const size = horizontal ? element.offsetWidth : element.offsetHeight
    const currentSize = sizeMap.current.get(index)
    
    if (currentSize !== size) {
      sizeMap.current.set(index, size)
      
      // Force re-calculation if the size changed significantly
      if (Math.abs(size - (currentSize ?? estimateSize)) > 1) {
        // Trigger a re-render by updating scroll offset slightly
        setScrollOffset(prev => prev + 0.01)
      }
    }
  }, [horizontal, estimateSize])
  
  // Scroll to a specific index
  const scrollToIndex = useCallback((
    index: number, 
    align: 'start' | 'center' | 'end' | 'auto' = 'auto'
  ) => {
    if (!scrollElement) return
    
    const containerSize = horizontal 
      ? scrollElement.clientWidth 
      : scrollElement.clientHeight
    
    // Calculate offset to the item
    let offset = paddingStart
    for (let i = 0; i < index; i++) {
      offset += getItemSize(i)
    }
    
    const itemSize = getItemSize(index)
    let targetOffset = offset
    
    switch (align) {
      case 'start':
        targetOffset = offset
        break
      case 'end':
        targetOffset = offset + itemSize - containerSize
        break
      case 'center':
        targetOffset = offset + (itemSize - containerSize) / 2
        break
      case 'auto':
      default:
        // Auto align based on current position
        if (offset < scrollOffset) {
          targetOffset = offset // Align to start
        } else if (offset + itemSize > scrollOffset + containerSize) {
          targetOffset = offset + itemSize - containerSize // Align to end
        } else {
          return // Item is already visible
        }
        break
    }
    
    // Clamp target offset
    const maxOffset = totalSize - containerSize
    targetOffset = Math.max(0, Math.min(targetOffset, maxOffset))
    
    scrollElement.scrollTo({
      [horizontal ? 'left' : 'top']: targetOffset,
      behavior: 'smooth'
    })
    
    onScrollToIndex?.(index)
  }, [scrollElement, getItemSize, totalSize, paddingStart, horizontal, onScrollToIndex])
  
  // Scroll to a specific offset
  const scrollToOffset = useCallback((offset: number) => {
    if (!scrollElement) return
    
    scrollElement.scrollTo({
      [horizontal ? 'left' : 'top']: offset,
      behavior: 'smooth'
    })
  }, [scrollElement, horizontal])
  
  // Handle scroll events
  useEffect(() => {
    if (!scrollElement) return
    
    const handleScroll = () => {
      const newOffset = horizontal 
        ? scrollElement.scrollLeft 
        : scrollElement.scrollTop
      
      setScrollOffset(newOffset)
      setIsScrolling(true)
      
      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      
      // Set scrolling to false after scrolling stops
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false)
      }, 150)
    }
    
    scrollElement.addEventListener('scroll', handleScroll, { passive: true })
    
    // Initial measurement
    handleScroll()
    
    return () => {
      scrollElement.removeEventListener('scroll', handleScroll)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [scrollElement, horizontal])
  
  // Clear size cache when size changes significantly
  useEffect(() => {
    if (sizeMap.current.size > size * 2) {
      sizeMap.current.clear()
    }
  }, [size])
  
  return {
    virtualItems,
    totalSize,
    scrollToIndex,
    scrollToOffset,
    measureElement
  }
}