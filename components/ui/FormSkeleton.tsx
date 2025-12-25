'use client'

import { useState, useEffect } from 'react'

interface FormSkeletonProps {
  /**
   * Number of input fields
   */
  fields?: number

  /**
   * Show textarea field
   */
  showTextarea?: boolean

  /**
   * Show submit button
   */
  showSubmitButton?: boolean

  /**
   * Form layout variant
   */
  variant?: 'default' | 'compact' | 'inline'

  /**
   * Animation delay for staggered loading
   */
  animationDelay?: number

  /**
   * Custom className for additional styling
   */
  className?: string

  /**
   * Show form title
   */
  showTitle?: boolean
}

/**
 * FormSkeleton Component
 *
 * A skeleton loader for form sections matching Bright Ears glass morphism design.
 * Displays placeholder loading state for contact forms, inquiry forms, etc.
 *
 * Features:
 * - Multiple layout variants
 * - Glass morphism styling
 * - Configurable field count
 * - Optional textarea and submit button
 * - Accessibility support
 *
 * @example
 * ```tsx
 * // Contact form skeleton
 * <FormSkeleton fields={4} showTextarea showSubmitButton showTitle />
 *
 * // Compact inquiry form
 * <FormSkeleton fields={2} variant="compact" showSubmitButton />
 *
 * // Inline search form
 * <FormSkeleton fields={1} variant="inline" showSubmitButton={false} />
 * ```
 */
export default function FormSkeleton({
  fields = 3,
  showTextarea = false,
  showSubmitButton = true,
  variant = 'default',
  animationDelay = 0,
  className = '',
  showTitle = false
}: FormSkeletonProps) {
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

  // Input field skeleton
  const InputFieldSkeleton = ({ index }: { index: number }) => (
    <div className="space-y-2">
      {/* Label */}
      <SkeletonLine
        width="w-24"
        height="h-4"
        delay={index * 50}
      />
      {/* Input */}
      <SkeletonLine
        width="w-full"
        height="h-12"
        className="rounded-lg bg-white/10 backdrop-blur-sm border border-white/20"
        delay={index * 50 + 50}
      />
    </div>
  )

  // Render form based on variant
  const renderForm = () => {
    switch (variant) {
      case 'compact':
        return (
          <div className="space-y-4">
            {showTitle && (
              <SkeletonLine width="w-48" height="h-6" className="mb-6" />
            )}

            {[...Array(fields)].map((_, i) => (
              <InputFieldSkeleton key={i} index={i} />
            ))}

            {showTextarea && (
              <div className="space-y-2">
                <SkeletonLine width="w-32" height="h-4" delay={fields * 50} />
                <SkeletonLine
                  width="w-full"
                  height="h-24"
                  className="rounded-lg bg-white/10 backdrop-blur-sm border border-white/20"
                  delay={fields * 50 + 50}
                />
              </div>
            )}

            {showSubmitButton && (
              <div className="pt-2">
                <SkeletonLine
                  width="w-full"
                  height="h-12"
                  className="rounded-lg bg-brand-cyan/30"
                  delay={(fields + (showTextarea ? 1 : 0)) * 50 + 100}
                />
              </div>
            )}
          </div>
        )

      case 'inline':
        return (
          <div className="flex gap-3">
            <SkeletonLine
              width="flex-1"
              height="h-12"
              className="rounded-lg bg-white/10 backdrop-blur-sm border border-white/20"
            />
            {showSubmitButton && (
              <SkeletonLine
                width="w-32"
                height="h-12"
                className="rounded-lg bg-brand-cyan/30"
                delay={100}
              />
            )}
          </div>
        )

      default:
        return (
          <>
            {showTitle && (
              <SkeletonLine width="w-64" height="h-8" className="mb-8" />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {[...Array(fields)].map((_, i) => (
                <InputFieldSkeleton key={i} index={i} />
              ))}
            </div>

            {showTextarea && (
              <div className="space-y-2 mb-6">
                <SkeletonLine width="w-32" height="h-4" delay={fields * 50} />
                <SkeletonLine
                  width="w-full"
                  height="h-32"
                  className="rounded-lg bg-white/10 backdrop-blur-sm border border-white/20"
                  delay={fields * 50 + 50}
                />
              </div>
            )}

            {showSubmitButton && (
              <div className="flex justify-start">
                <SkeletonLine
                  width="w-48"
                  height="h-14"
                  className="rounded-full bg-brand-cyan/30"
                  delay={(fields + (showTextarea ? 1 : 0)) * 50 + 100}
                />
              </div>
            )}
          </>
        )
    }
  }

  return (
    <div
      className={`
        transition-opacity duration-500
        ${isVisible ? 'opacity-100' : 'opacity-0'}
        ${className}
      `}
      role="status"
      aria-busy="true"
      aria-label="Loading form"
    >
      {renderForm()}

      {/* Screen reader text */}
      <span className="sr-only">Loading form, please wait...</span>
    </div>
  )
}
