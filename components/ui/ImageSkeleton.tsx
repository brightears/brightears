'use client'

import { useState, useEffect } from 'react'

export type AspectRatio = 'square' | 'landscape' | 'portrait' | 'video' | 'hero' | 'custom'
export type SkeletonSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

interface ImageSkeletonProps {
  /**
   * Aspect ratio of the skeleton
   * - square: 1:1 (profile images, thumbnails)
   * - landscape: 4:3 (artist cards, gallery)
   * - portrait: 3:4 (vertical images)
   * - video: 16:9 (video thumbnails)
   * - hero: 21:9 (hero banners)
   * - custom: use customAspectRatio prop
   */
  aspectRatio?: AspectRatio

  /**
   * Custom aspect ratio (e.g., "16/9", "4/3")
   * Only used when aspectRatio is "custom"
   */
  customAspectRatio?: string

  /**
   * Predefined size (overrides aspectRatio)
   */
  size?: SkeletonSize

  /**
   * Custom className for additional styling
   */
  className?: string

  /**
   * Show animated shimmer effect
   */
  showShimmer?: boolean

  /**
   * Animation delay for staggered loading
   */
  animationDelay?: number

  /**
   * Border radius
   */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'

  /**
   * Accessibility label
   */
  ariaLabel?: string
}

/**
 * ImageSkeleton Component
 *
 * A reusable skeleton loader for images that matches the Bright Ears glass morphism design system.
 * Features:
 * - Multiple aspect ratios and sizes
 * - Animated gradient shimmer effect
 * - Glass morphism styling
 * - Smooth transitions
 * - Accessibility support
 *
 * @example
 * ```tsx
 * // Square profile image skeleton
 * <ImageSkeleton aspectRatio="square" size="md" rounded="full" />
 *
 * // Artist card image skeleton
 * <ImageSkeleton aspectRatio="landscape" size="lg" rounded="xl" />
 *
 * // Hero banner skeleton with delay
 * <ImageSkeleton aspectRatio="hero" animationDelay={200} />
 * ```
 */
export default function ImageSkeleton({
  aspectRatio = 'landscape',
  customAspectRatio,
  size = 'md',
  className = '',
  showShimmer = true,
  animationDelay = 0,
  rounded = 'xl',
  ariaLabel = 'Loading image'
}: ImageSkeletonProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger animation after mount with optional delay
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, animationDelay)

    return () => clearTimeout(timer)
  }, [animationDelay])

  // Aspect ratio mappings
  const aspectRatioClasses = {
    square: 'aspect-square',
    landscape: 'aspect-[4/3]',
    portrait: 'aspect-[3/4]',
    video: 'aspect-video',
    hero: 'aspect-[21/9]',
    custom: ''
  }

  // Size mappings (width for responsive scaling)
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-40 h-40',
    lg: 'w-64 h-64',
    xl: 'w-96 h-96',
    full: 'w-full h-full'
  }

  // Rounded corner mappings
  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full'
  }

  // Build the custom aspect ratio style
  const customStyle = aspectRatio === 'custom' && customAspectRatio
    ? { aspectRatio: customAspectRatio }
    : {}

  return (
    <div
      className={`
        relative overflow-hidden
        bg-gradient-to-br from-brand-cyan/20 to-deep-teal/20
        backdrop-blur-sm
        ${aspectRatioClasses[aspectRatio]}
        ${size !== 'full' ? sizeClasses[size] : ''}
        ${roundedClasses[rounded]}
        ${className}
        transition-opacity duration-500
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}
      style={customStyle}
      role="status"
      aria-label={ariaLabel}
      aria-busy="true"
    >
      {/* Glass morphism base layer */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-md" />

      {/* Gradient pulse animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-soft-lavender/10 to-earthy-brown/10 animate-pulse" />

      {/* Shimmer effect */}
      {showShimmer && (
        <div
          className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
            backgroundSize: '200% 100%'
          }}
        />
      )}

      {/* Icon placeholder in center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          className="w-12 h-12 text-brand-cyan/30 animate-pulse"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>

      {/* Screen reader text */}
      <span className="sr-only">{ariaLabel}</span>
    </div>
  )
}

// Additional shimmer keyframe animation in global CSS
// Add to your global.css or tailwind.config.ts:
/*
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
*/
