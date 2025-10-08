'use client'

import { useState, useEffect } from 'react'

interface ListSkeletonProps {
  /**
   * Number of list items
   */
  count?: number

  /**
   * Show item icons/avatars
   */
  showIcons?: boolean

  /**
   * List item variant
   */
  variant?: 'simple' | 'detailed' | 'accordion'

  /**
   * Animation delay for staggered loading
   */
  animationDelay?: number

  /**
   * Custom className for additional styling
   */
  className?: string

  /**
   * Number of detail lines per item (for 'detailed' variant)
   */
  detailLines?: number
}

/**
 * ListSkeleton Component
 *
 * A skeleton loader for list sections matching Bright Ears glass morphism design.
 * Displays placeholder loading state for FAQ lists, review lists, feature lists, etc.
 *
 * Features:
 * - Multiple list variants (simple, detailed, accordion)
 * - Glass morphism styling
 * - Optional icons/avatars
 * - Configurable item count and detail lines
 * - Accessibility support
 *
 * @example
 * ```tsx
 * // Simple list
 * <ListSkeleton count={5} variant="simple" />
 *
 * // Detailed list with icons
 * <ListSkeleton count={3} variant="detailed" showIcons detailLines={2} />
 *
 * // FAQ accordion skeleton
 * <ListSkeleton count={8} variant="accordion" />
 * ```
 */
export default function ListSkeleton({
  count = 5,
  showIcons = false,
  variant = 'simple',
  animationDelay = 0,
  className = '',
  detailLines = 2
}: ListSkeletonProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, animationDelay)

    return () => clearTimeout(timer)
  }, [animationDelay])

  // Base skeleton line component
  const SkeletonLine = ({
    width = 'full',
    height = 'h-4',
    className: lineClassName = '',
    delay = 0
  }: {
    width?: string
    height?: string
    className?: string
    delay?: number
  }) => (
    <div
      className={`
        bg-gradient-to-r from-brand-cyan/20 via-soft-lavender/20 to-brand-cyan/20
        ${height}
        ${width === 'full' ? 'w-full' : width}
        rounded
        animate-pulse
        ${lineClassName}
      `}
      style={{ animationDelay: `${delay}ms` }}
    />
  )

  // Icon/Avatar skeleton
  const IconSkeleton = ({ delay = 0 }: { delay?: number }) => (
    <SkeletonLine
      width="w-10"
      height="h-10"
      className="rounded-full bg-brand-cyan/20 flex-shrink-0"
      delay={delay}
    />
  )

  // Simple list item
  const SimpleListItem = ({ index }: { index: number }) => (
    <div
      className={`
        bg-white/70 backdrop-blur-md border border-white/20
        rounded-lg p-4
        transition-all duration-500
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="flex items-center space-x-4">
        {showIcons && <IconSkeleton delay={index * 50} />}
        <SkeletonLine width="w-3/4" height="h-5" delay={index * 50 + 50} />
      </div>
    </div>
  )

  // Detailed list item
  const DetailedListItem = ({ index }: { index: number }) => (
    <div
      className={`
        bg-white/70 backdrop-blur-md border border-white/20
        rounded-xl p-6
        transition-all duration-500
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start space-x-4">
        {showIcons && <IconSkeleton delay={index * 50} />}
        <div className="flex-1 space-y-3">
          {/* Title */}
          <SkeletonLine width="w-3/4" height="h-6" delay={index * 50} />

          {/* Detail lines */}
          {[...Array(detailLines)].map((_, i) => (
            <SkeletonLine
              key={i}
              width={i === detailLines - 1 ? 'w-2/3' : 'w-full'}
              height="h-4"
              delay={index * 50 + (i + 1) * 50}
            />
          ))}
        </div>
      </div>
    </div>
  )

  // Accordion list item
  const AccordionListItem = ({ index }: { index: number }) => (
    <div
      className={`
        bg-white/70 backdrop-blur-md border border-white/20
        rounded-xl overflow-hidden
        transition-all duration-500
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/20">
        <SkeletonLine width="w-2/3" height="h-5" delay={index * 50} />
        <SkeletonLine
          width="w-6"
          height="h-6"
          className="rounded bg-brand-cyan/20"
          delay={index * 50 + 50}
        />
      </div>
    </div>
  )

  // Render list items based on variant
  const renderListItem = (index: number) => {
    switch (variant) {
      case 'detailed':
        return <DetailedListItem key={index} index={index} />
      case 'accordion':
        return <AccordionListItem key={index} index={index} />
      case 'simple':
      default:
        return <SimpleListItem key={index} index={index} />
    }
  }

  return (
    <div
      className={`
        space-y-4
        ${className}
      `}
      role="status"
      aria-busy="true"
      aria-label="Loading list"
    >
      {[...Array(count)].map((_, index) => renderListItem(index))}

      {/* Screen reader text */}
      <span className="sr-only">Loading list, please wait...</span>
    </div>
  )
}
