'use client'

import { useState, useEffect } from 'react'
import ImageSkeleton from './ImageSkeleton'

export type CardLayout = 'artist' | 'review' | 'booking' | 'featured' | 'compact'

interface CardSkeletonProps {
  /**
   * Layout type determines the skeleton structure
   * - artist: Full artist card with image, name, stats, CTA
   * - review: Review card with avatar, name, rating, text
   * - booking: Booking card with event details
   * - featured: Featured artist card (larger, more details)
   * - compact: Minimal card (image + title)
   */
  layout?: CardLayout

  /**
   * Show loading animation
   */
  animated?: boolean

  /**
   * Animation delay for staggered loading
   */
  animationDelay?: number

  /**
   * Custom className for additional styling
   */
  className?: string

  /**
   * Number of text lines to show
   */
  textLines?: number
}

/**
 * CardSkeleton Component
 *
 * A reusable skeleton loader for various card types in the Bright Ears platform.
 * Matches the glass morphism design system with animated shimmer effects.
 *
 * Features:
 * - Multiple layout presets
 * - Glass morphism styling
 * - Animated gradient shimmer
 * - Staggered animation support
 * - Responsive design
 *
 * @example
 * ```tsx
 * // Artist card skeleton
 * <CardSkeleton layout="artist" animationDelay={100} />
 *
 * // Review card skeleton
 * <CardSkeleton layout="review" />
 *
 * // Multiple cards with stagger
 * {[...Array(6)].map((_, i) => (
 *   <CardSkeleton key={i} layout="artist" animationDelay={i * 150} />
 * ))}
 * ```
 */
export default function CardSkeleton({
  layout = 'artist',
  animated = true,
  animationDelay = 0,
  className = '',
  textLines = 3
}: CardSkeletonProps) {
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
        ${animated ? 'animate-pulse' : ''}
        ${lineClassName}
      `}
      style={{ animationDelay: `${delay}ms` }}
    />
  )

  // Artist card layout
  const ArtistCardSkeleton = () => (
    <div
      className={`
        group bg-white/70 backdrop-blur-md border border-white/20
        rounded-2xl overflow-hidden shadow-xl
        transition-all duration-500
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        ${className}
      `}
    >
      {/* Image skeleton */}
      <div className="relative h-64 sm:h-72">
        <ImageSkeleton
          aspectRatio="landscape"
          size="full"
          rounded="none"
          showShimmer={animated}
        />
      </div>

      {/* Content skeleton */}
      <div className="p-6 space-y-4">
        {/* Name */}
        <SkeletonLine width="w-3/4" height="h-6" />

        {/* Genre and location */}
        <SkeletonLine width="w-1/2" height="h-4" delay={100} />

        {/* Price */}
        <SkeletonLine width="w-2/3" height="h-4" delay={200} />

        {/* Stats row */}
        <div className="flex items-center justify-between pt-2">
          <SkeletonLine width="w-16" height="h-4" delay={300} />
          <SkeletonLine width="w-24" height="h-4" delay={350} />
        </div>

        {/* Action button */}
        <div className="pt-2">
          <SkeletonLine
            width="w-full"
            height="h-10"
            className="bg-gradient-to-r from-brand-cyan/20 to-deep-teal/20 rounded-xl"
            delay={400}
          />
        </div>
      </div>
    </div>
  )

  // Review card layout
  const ReviewCardSkeleton = () => (
    <div
      className={`
        bg-white/70 backdrop-blur-md border border-white/20
        rounded-xl p-6 shadow-lg
        transition-all duration-500
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        ${className}
      `}
    >
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <ImageSkeleton
          aspectRatio="square"
          size="sm"
          rounded="full"
          showShimmer={animated}
        />

        <div className="flex-1 space-y-3">
          {/* Name and rating */}
          <div className="space-y-2">
            <SkeletonLine width="w-32" height="h-5" />
            <SkeletonLine width="w-24" height="h-4" delay={100} />
          </div>

          {/* Review text */}
          {[...Array(textLines)].map((_, i) => (
            <SkeletonLine
              key={i}
              width={i === textLines - 1 ? 'w-2/3' : 'w-full'}
              height="h-4"
              delay={150 + i * 50}
            />
          ))}
        </div>
      </div>
    </div>
  )

  // Featured artist card layout (larger, more prominent)
  const FeaturedCardSkeleton = () => (
    <div
      className={`
        bg-white/70 backdrop-blur-md border border-white/20
        rounded-2xl overflow-hidden shadow-2xl
        transition-all duration-500
        ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
        ${className}
      `}
    >
      {/* Badge placeholder */}
      <div className="absolute top-4 left-4 z-10">
        <SkeletonLine width="w-20" height="h-6" className="rounded-full" />
      </div>

      {/* Image skeleton */}
      <div className="relative h-72">
        <ImageSkeleton
          aspectRatio="landscape"
          size="full"
          rounded="none"
          showShimmer={animated}
        />
      </div>

      {/* Content skeleton */}
      <div className="p-6 space-y-4">
        {/* Name and badge */}
        <div className="flex items-start justify-between">
          <SkeletonLine width="w-3/4" height="h-7" />
          <SkeletonLine width="w-8" height="h-8" className="rounded-full" delay={100} />
        </div>

        {/* Category and location */}
        <SkeletonLine width="w-1/2" height="h-4" delay={150} />

        {/* Rating */}
        <SkeletonLine width="w-40" height="h-5" delay={200} />

        {/* Recent venue box */}
        <div className="bg-brand-cyan/5 rounded-lg p-3">
          <SkeletonLine width="w-full" height="h-4" delay={250} />
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between pt-2">
          <div className="space-y-2">
            <SkeletonLine width="w-24" height="h-3" delay={300} />
            <SkeletonLine width="w-32" height="h-5" delay={350} />
          </div>
          <SkeletonLine
            width="w-28"
            height="h-10"
            className="rounded-lg"
            delay={400}
          />
        </div>
      </div>
    </div>
  )

  // Compact card layout
  const CompactCardSkeleton = () => (
    <div
      className={`
        bg-white/70 backdrop-blur-md border border-white/20
        rounded-xl overflow-hidden shadow-md
        transition-all duration-500
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        ${className}
      `}
    >
      <div className="flex items-center space-x-4 p-4">
        {/* Small image */}
        <ImageSkeleton
          aspectRatio="square"
          size="sm"
          rounded="lg"
          showShimmer={animated}
        />

        {/* Text content */}
        <div className="flex-1 space-y-2">
          <SkeletonLine width="w-3/4" height="h-5" />
          <SkeletonLine width="w-1/2" height="h-4" delay={100} />
        </div>
      </div>
    </div>
  )

  // Booking card layout
  const BookingCardSkeleton = () => (
    <div
      className={`
        bg-white/70 backdrop-blur-md border border-white/20
        rounded-xl p-6 shadow-lg
        transition-all duration-500
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        ${className}
      `}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <SkeletonLine width="w-48" height="h-6" />
          <SkeletonLine width="w-20" height="h-6" className="rounded-full" delay={50} />
        </div>

        {/* Date and time */}
        <SkeletonLine width="w-40" height="h-4" delay={100} />

        {/* Details */}
        {[...Array(3)].map((_, i) => (
          <SkeletonLine
            key={i}
            width="w-full"
            height="h-4"
            delay={150 + i * 50}
          />
        ))}

        {/* Action buttons */}
        <div className="flex space-x-3 pt-2">
          <SkeletonLine
            width="w-full"
            height="h-10"
            className="rounded-lg"
            delay={300}
          />
          <SkeletonLine
            width="w-full"
            height="h-10"
            className="rounded-lg"
            delay={350}
          />
        </div>
      </div>
    </div>
  )

  // Render appropriate layout
  switch (layout) {
    case 'artist':
      return <ArtistCardSkeleton />
    case 'review':
      return <ReviewCardSkeleton />
    case 'featured':
      return <FeaturedCardSkeleton />
    case 'compact':
      return <CompactCardSkeleton />
    case 'booking':
      return <BookingCardSkeleton />
    default:
      return <ArtistCardSkeleton />
  }
}
