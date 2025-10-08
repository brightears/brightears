'use client'

import { useState, useEffect } from 'react'

interface HeroSkeletonProps {
  /**
   * Show badge skeleton above title
   */
  showBadge?: boolean

  /**
   * Show CTA buttons
   */
  showCTA?: boolean

  /**
   * Number of subtitle lines
   */
  subtitleLines?: number

  /**
   * Animation delay for staggered loading
   */
  animationDelay?: number

  /**
   * Custom className for additional styling
   */
  className?: string

  /**
   * Variant type for different hero layouts
   */
  variant?: 'default' | 'compact' | 'centered'
}

/**
 * HeroSkeleton Component
 *
 * A skeleton loader for hero sections matching Bright Ears glass morphism design.
 * Provides smooth loading state for hero banners with proper layout dimensions.
 *
 * Features:
 * - Glass morphism styling
 * - Shimmer animation overlay
 * - Multiple variants for different layouts
 * - Configurable elements (badge, CTA, subtitle lines)
 * - Accessibility support
 *
 * @example
 * ```tsx
 * // Full hero skeleton
 * <HeroSkeleton showBadge showCTA subtitleLines={2} />
 *
 * // Compact hero skeleton
 * <HeroSkeleton variant="compact" showCTA={false} />
 *
 * // Centered hero skeleton with delay
 * <HeroSkeleton variant="centered" animationDelay={200} />
 * ```
 */
export default function HeroSkeleton({
  showBadge = true,
  showCTA = true,
  subtitleLines = 2,
  animationDelay = 0,
  className = '',
  variant = 'default'
}: HeroSkeletonProps) {
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
        bg-gradient-to-r from-white/20 via-white/30 to-white/20
        ${height}
        ${width === 'full' ? 'w-full' : width}
        rounded-lg
        animate-pulse
        ${lineClassName}
      `}
      style={{ animationDelay: `${delay}ms` }}
    />
  )

  // Variant layouts
  const renderContent = () => {
    switch (variant) {
      case 'compact':
        return (
          <>
            {/* Compact title */}
            <div className="space-y-3 mb-6">
              <SkeletonLine width="w-3/4" height="h-10" />
              <SkeletonLine width="w-2/3" height="h-10" delay={100} />
            </div>

            {/* Compact subtitle */}
            <div className="space-y-2 mb-8 max-w-2xl">
              <SkeletonLine width="w-full" height="h-5" delay={200} />
            </div>

            {/* CTA */}
            {showCTA && (
              <div className="flex gap-4 justify-start">
                <SkeletonLine width="w-40" height="h-12" className="rounded-full bg-brand-cyan/30" delay={300} />
              </div>
            )}
          </>
        )

      case 'centered':
        return (
          <>
            {/* Badge centered */}
            {showBadge && (
              <div className="flex justify-center mb-6">
                <SkeletonLine width="w-64" height="h-8" className="rounded-full bg-soft-lavender/20" />
              </div>
            )}

            {/* Title centered */}
            <div className="space-y-4 mb-6 flex flex-col items-center">
              <SkeletonLine width="w-3/4 max-w-3xl" height="h-12" delay={100} />
              <SkeletonLine width="w-2/3 max-w-2xl" height="h-12" delay={200} />
            </div>

            {/* Subtitle centered */}
            <div className="space-y-3 mb-8 max-w-3xl mx-auto">
              {[...Array(subtitleLines)].map((_, i) => (
                <SkeletonLine
                  key={i}
                  width={i === subtitleLines - 1 ? 'w-5/6' : 'w-full'}
                  height="h-6"
                  delay={300 + i * 50}
                />
              ))}
            </div>

            {/* CTA buttons centered */}
            {showCTA && (
              <div className="flex gap-4 justify-center">
                <SkeletonLine width="w-48" height="h-14" className="rounded-full bg-brand-cyan/30" delay={400} />
                <SkeletonLine width="w-48" height="h-14" className="rounded-full bg-white/20" delay={450} />
              </div>
            )}
          </>
        )

      default:
        return (
          <>
            {/* Badge */}
            {showBadge && (
              <SkeletonLine width="w-64" height="h-8" className="rounded-full bg-soft-lavender/20 mb-6" />
            )}

            {/* H1 title skeleton */}
            <div className="space-y-4 mb-6">
              <SkeletonLine width="w-3/4" height="h-12" delay={100} />
              <SkeletonLine width="w-2/3" height="h-12" delay={200} />
            </div>

            {/* Subtitle skeleton */}
            <div className="space-y-3 mb-8 max-w-3xl">
              {[...Array(subtitleLines)].map((_, i) => (
                <SkeletonLine
                  key={i}
                  width={i === subtitleLines - 1 ? 'w-5/6' : 'w-full'}
                  height="h-6"
                  delay={300 + i * 50}
                />
              ))}
            </div>

            {/* CTA buttons */}
            {showCTA && (
              <div className="flex gap-4">
                <SkeletonLine width="w-48" height="h-14" className="rounded-full bg-brand-cyan/30" delay={400} />
                <SkeletonLine width="w-48" height="h-14" className="rounded-full bg-white/20" delay={450} />
              </div>
            )}
          </>
        )
    }
  }

  return (
    <div
      className={`
        relative overflow-hidden py-20 lg:py-28
        transition-opacity duration-500
        ${isVisible ? 'opacity-100' : 'opacity-0'}
        ${className}
      `}
      role="status"
      aria-busy="true"
      aria-label="Loading hero section"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {renderContent()}
      </div>

      {/* Shimmer effect overlay */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] pointer-events-none">
        <div
          className="h-full w-full"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)'
          }}
        />
      </div>

      {/* Screen reader text */}
      <span className="sr-only">Loading hero section, please wait...</span>
    </div>
  )
}
