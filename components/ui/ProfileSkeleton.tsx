'use client'

import { useState, useEffect } from 'react'
import ImageSkeleton from './ImageSkeleton'

interface ProfileSkeletonProps {
  /**
   * Animation delay for staggered loading
   */
  animationDelay?: number

  /**
   * Custom className for additional styling
   */
  className?: string

  /**
   * Show hero section skeleton
   */
  showHero?: boolean

  /**
   * Show tabs skeleton
   */
  showTabs?: boolean

  /**
   * Number of content sections to show
   */
  contentSections?: number
}

/**
 * ProfileSkeleton Component
 *
 * A comprehensive skeleton loader for artist profile pages.
 * Matches the actual profile layout with glass morphism design.
 *
 * Features:
 * - Hero section with cover image and profile image
 * - Action bar with pricing and CTAs
 * - Tab navigation
 * - Content sections (bio, media, packages, reviews)
 * - Glass morphism styling throughout
 *
 * @example
 * ```tsx
 * // Full profile skeleton
 * <ProfileSkeleton showHero showTabs contentSections={4} />
 *
 * // Minimal profile skeleton
 * <ProfileSkeleton showHero={false} contentSections={2} />
 * ```
 */
export default function ProfileSkeleton({
  animationDelay = 0,
  className = '',
  showHero = true,
  showTabs = true,
  contentSections = 4
}: ProfileSkeletonProps) {
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

  return (
    <div
      className={`
        min-h-screen bg-off-white
        transition-opacity duration-500
        ${isVisible ? 'opacity-100' : 'opacity-0'}
        ${className}
      `}
      role="status"
      aria-label="Loading artist profile"
      aria-busy="true"
    >
      {/* Hero Section Skeleton */}
      {showHero && (
        <div className="relative mb-8">
          {/* Cover Image Skeleton */}
          <div className="relative h-96 bg-gradient-to-r from-deep-teal to-brand-cyan overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-deep-teal/90 to-brand-cyan/90 animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

            {/* Profile Info Skeleton */}
            <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-8">
              <div className="flex items-end space-x-6 w-full">
                {/* Profile Image Skeleton */}
                <ImageSkeleton
                  aspectRatio="square"
                  size="md"
                  rounded="full"
                  className="border-4 border-pure-white shadow-xl w-40 h-40"
                />

                {/* Artist Info Skeleton */}
                <div className="flex-1 pb-2 space-y-3">
                  <SkeletonLine
                    width="w-64"
                    height="h-10"
                    className="bg-white/30"
                  />
                  <div className="flex flex-wrap items-center gap-4">
                    <SkeletonLine width="w-24" height="h-6" className="bg-white/20 rounded-full" />
                    <SkeletonLine width="w-32" height="h-6" className="bg-white/20" delay={100} />
                    <SkeletonLine width="w-40" height="h-6" className="bg-white/20" delay={200} />
                  </div>
                  <SkeletonLine
                    width="w-96"
                    height="h-5"
                    className="bg-white/20"
                    delay={300}
                  />
                </div>

                {/* Quick Stats - Desktop */}
                <div className="hidden lg:flex items-center space-x-6 pb-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="text-center space-y-2">
                      <SkeletonLine
                        width="w-16"
                        height="h-8"
                        className="bg-white/30"
                        delay={i * 100}
                      />
                      <SkeletonLine
                        width="w-20"
                        height="h-4"
                        className="bg-white/20"
                        delay={i * 100 + 50}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Action Bar Skeleton */}
          <div className="sticky top-16 z-40 bg-pure-white border-b shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center space-x-4">
                  <SkeletonLine width="w-32" height="h-8" />
                  <SkeletonLine width="w-20" height="h-6" delay={100} />
                </div>

                <div className="flex items-center space-x-3">
                  {[...Array(4)].map((_, i) => (
                    <SkeletonLine
                      key={i}
                      width="w-24"
                      height="h-10"
                      className="rounded-lg"
                      delay={i * 50}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Tab Navigation Skeleton */}
        {showTabs && (
          <div className="mb-8 border-b border-gray-200">
            <div className="flex space-x-8">
              {[...Array(5)].map((_, i) => (
                <SkeletonLine
                  key={i}
                  width="w-24"
                  height="h-10"
                  delay={i * 50}
                />
              ))}
            </div>
          </div>
        )}

        {/* Content Sections */}
        <div className="space-y-8">
          {[...Array(contentSections)].map((_, sectionIndex) => (
            <div
              key={sectionIndex}
              className="bg-white/70 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg"
            >
              {/* Section Title */}
              <SkeletonLine
                width="w-48"
                height="h-7"
                className="mb-6"
                delay={sectionIndex * 100}
              />

              {/* Section Content */}
              {sectionIndex === 0 && (
                // Bio section
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <SkeletonLine
                      key={i}
                      width={i === 3 ? 'w-3/4' : 'w-full'}
                      height="h-4"
                      delay={sectionIndex * 100 + i * 50}
                    />
                  ))}
                </div>
              )}

              {sectionIndex === 1 && (
                // Media gallery section
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <ImageSkeleton
                      key={i}
                      aspectRatio="landscape"
                      size="full"
                      rounded="lg"
                      animationDelay={sectionIndex * 100 + i * 50}
                    />
                  ))}
                </div>
              )}

              {sectionIndex === 2 && (
                // Packages section
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl p-6 space-y-4"
                    >
                      <SkeletonLine width="w-3/4" height="h-6" delay={i * 100} />
                      <SkeletonLine width="w-1/2" height="h-8" delay={i * 100 + 50} />
                      <div className="space-y-2">
                        {[...Array(4)].map((_, j) => (
                          <SkeletonLine
                            key={j}
                            width="w-full"
                            height="h-4"
                            delay={i * 100 + 100 + j * 30}
                          />
                        ))}
                      </div>
                      <SkeletonLine
                        width="w-full"
                        height="h-10"
                        className="rounded-lg"
                        delay={i * 100 + 250}
                      />
                    </div>
                  ))}
                </div>
              )}

              {sectionIndex === 3 && (
                // Reviews section
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl p-6"
                    >
                      <div className="flex items-start space-x-4">
                        <ImageSkeleton
                          aspectRatio="square"
                          size="sm"
                          rounded="full"
                          animationDelay={i * 100}
                        />
                        <div className="flex-1 space-y-3">
                          <SkeletonLine width="w-32" height="h-5" delay={i * 100} />
                          <SkeletonLine width="w-24" height="h-4" delay={i * 100 + 50} />
                          <div className="space-y-2">
                            {[...Array(3)].map((_, j) => (
                              <SkeletonLine
                                key={j}
                                width={j === 2 ? 'w-2/3' : 'w-full'}
                                height="h-4"
                                delay={i * 100 + 100 + j * 30}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {sectionIndex > 3 && (
                // Generic content section
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <SkeletonLine
                      key={i}
                      width={i === 4 ? 'w-3/4' : 'w-full'}
                      height="h-4"
                      delay={sectionIndex * 100 + i * 50}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Screen reader text */}
      <span className="sr-only">Loading artist profile, please wait...</span>
    </div>
  )
}
