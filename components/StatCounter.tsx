'use client'

import { useEffect, useState } from 'react'

interface StatCounterProps {
  label: string
  value: number
  suffix?: string
}

export default function StatCounter({ label, value, suffix = '' }: StatCounterProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 2000 // 2 seconds
    const steps = 60
    const increment = value / steps
    const stepDuration = duration / steps

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      if (currentStep <= steps) {
        setCount(Math.floor(increment * currentStep))
      } else {
        setCount(value)
        clearInterval(timer)
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [value])

  return (
    <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center shadow-md hover:shadow-xl transition-shadow">
      <div className="text-4xl font-bold text-brand-cyan mb-2">
        {count}{suffix}
      </div>
      <div className="text-gray-600 font-inter">{label}</div>
    </div>
  )
}
