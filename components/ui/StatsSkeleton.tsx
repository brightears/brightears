'use client'

import { useState, useEffect } from 'react'

interface StatsSkeletonProps {
  /**
   * Number of stat items to display
   */
  count?: number

  /**
   * Layout variant
   */
  variant?: 'horizontal' | 'grid' | 'vertical'

  /**
   * Animation delay for staggered loading
   */
  animationDelay?: number

  /**
   * Custom className for additional styling
   */
  className?: string

  /**
   * Show icons above stats
   */
  showIcons?: boolean
}

/**
 * StatsSkeleton Component
 *
 * A skeleton loader for statistics sections matching Bright Ears glass morphism design.
 * Displays placeholder loading state for numerical stats with labels.
 *
 * Features:
 * - Multiple layout variants (horizontal, grid, vertical)
 * - Glass morphism card styling
 * - Shimmer animation
 * - Configurable stat count
 * - Optional icon placeholders
 * - Accessibility support
 *
 * @example
 * ```tsx
 * // Horizontal stats (default)
 * <StatsSkeleton count={4} variant="horizontal" />
 *
 * // Grid layout with icons
 * <StatsSkeleton count={6} variant="grid" showIcons />
 *
 * // Vertical stats with delay
 * <StatsSkeleton count={3} variant="vertical" animationDelay={200} />
 * ```
 */
export default function StatsSkeleton({
  count = 4,
  variant = 'horizontal',
  animationDelay = 0,
  className = '',
  showIcons = false
}: StatsSkeletonProps) {
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

  // Single stat item skeleton
  const StatItem = ({ index }: { index: number }) => (
    <div
      className={`
        bg-white/70 backdrop-blur-md border border-white/20
        rounded-xl p-6
        transition-all duration-500
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Icon placeholder */}
      {showIcons && (
        <div className="mb-4">
          <SkeletonLine
            width="w-12"
            height="h-12"
            className="rounded-full bg-brand-cyan/20"
            delay={index * 50}
          />
        </div>
      )}

      {/* Stat value */}
      <SkeletonLine
        width="w-24"
        height="h-10"
        className="mb-3"
        delay={index * 50 + 100}
      />

      {/* Stat label */}
      <SkeletonLine
        width="w-32"
        height="h-5"
        delay={index * 50 + 150}
      />
    </div>
  )

  // Get container classes based on variant
  const getContainerClasses = () => {
    switch (variant) {
      case 'grid':
        return 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
      case 'vertical':
        return 'flex flex-col space-y-6'
      case 'horizontal':
      default:
        return 'flex flex-col sm:flex-row gap-6 justify-center items-center'
    }
  }

  return (
    <div
      className={`
        relative
        ${getContainerClasses()}
        ${className}
      `}
      role="status"
      aria-busy="true"
      aria-label="Loading statistics"
    >
      {[...Array(count)].map((_, index) => (
        <StatItem key={index} index={index} />
      ))}

      {/* Screen reader text */}
      <span className="sr-only">Loading statistics, please wait...</span>
    </div>
  )
}
