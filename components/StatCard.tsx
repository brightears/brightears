'use client'

import { useEffect, useState, useRef } from 'react'

interface StatCardProps {
  value: string
  label: string
  primary?: boolean
  className?: string
}

/**
 * Enhanced StatCard component with visual hierarchy and count-up animation
 *
 * Features:
 * - PRIMARY variant: Larger size, cyan accent, cyan border, stronger shadow
 * - SECONDARY variant: Standard size, white text, subtle styling
 * - Count-up animation: Numbers animate from 0 to target value
 * - Supports special formats: "500+", "10K+", "4.9★"
 *
 * Usage:
 * <StatCard value="500+" label="Bangkok Venues" primary={true} />
 * <StatCard value="10K+" label="Events Delivered" />
 */
export default function StatCard({ value, label, primary = false, className = '' }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState<string>('0')
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Intersection Observer for scroll-triggered animation
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.3 }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    // Parse the value to extract number and suffix
    const match = value.match(/^([\d.]+)(.*)$/)
    if (!match) {
      setDisplayValue(value)
      return
    }

    const [, numStr, suffix] = match
    const targetNum = parseFloat(numStr)

    // Animation settings
    const duration = 2000 // 2 seconds
    const steps = 60
    const increment = targetNum / steps
    const stepDuration = duration / steps

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      if (currentStep <= steps) {
        const currentValue = increment * currentStep
        // Format based on whether it's a decimal or integer
        const formatted = numStr.includes('.')
          ? currentValue.toFixed(1)
          : Math.floor(currentValue).toString()
        setDisplayValue(formatted + suffix)
      } else {
        setDisplayValue(value)
        clearInterval(timer)
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [value, isVisible])

  return (
    <div
      ref={cardRef}
      className={`
        ${primary ? 'p-8' : 'p-6'}
        ${primary ? 'border-brand-cyan/50 shadow-lg shadow-brand-cyan/20' : 'border-white/10'}
        bg-white/5 backdrop-blur-md border rounded-2xl transition-all duration-300
        ${primary ? 'hover:scale-105' : 'hover:-translate-y-1 hover:shadow-xl'}
        ${className}
      `}
    >
      <div
        className={`
          font-playfair font-bold mb-2
          ${primary ? 'text-5xl text-brand-cyan' : 'text-4xl text-white'}
          ${primary ? 'group-hover:scale-110' : 'group-hover:scale-110'}
          transition-transform duration-300
        `}
      >
        {displayValue}
      </div>
      <div className="font-inter text-white/70 text-sm uppercase tracking-wider">
        {label}
      </div>
    </div>
  )
}
