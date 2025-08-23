'use client'

import { useEffect, useState } from 'react'

interface FloatingOrbsProps {
  count?: number
  size?: 'sm' | 'md' | 'lg'
  colors?: string[]
  className?: string
}

interface Orb {
  id: number
  x: number
  y: number
  size: number
  color: string
  animationDuration: number
  animationDelay: number
}

export default function FloatingOrbs({ 
  count = 8, 
  size = 'md',
  colors = ['brand-cyan', 'soft-lavender', 'earthy-brown', 'deep-teal'],
  className = ''
}: FloatingOrbsProps) {
  const [orbs, setOrbs] = useState<Orb[]>([])

  const sizeMap = {
    sm: { min: 20, max: 60 },
    md: { min: 40, max: 120 },
    lg: { min: 80, max: 200 }
  }

  useEffect(() => {
    const generateOrbs = () => {
      const newOrbs: Orb[] = []
      
      for (let i = 0; i < count; i++) {
        const sizeRange = sizeMap[size]
        newOrbs.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * (sizeRange.max - sizeRange.min) + sizeRange.min,
          color: colors[Math.floor(Math.random() * colors.length)],
          animationDuration: Math.random() * 10 + 15, // 15-25s
          animationDelay: Math.random() * 5
        })
      }
      
      setOrbs(newOrbs)
    }

    generateOrbs()
  }, [count, size, colors])

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {orbs.map((orb) => (
        <div
          key={orb.id}
          className={`absolute rounded-full blur-3xl opacity-20 animate-float-slow`}
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            animationDuration: `${orb.animationDuration}s`,
            animationDelay: `${orb.animationDelay}s`,
          }}
        >
          {/* Main Orb */}
          <div 
            className={`w-full h-full rounded-full bg-${orb.color}/30`}
          />
          
          {/* Inner Glow */}
          <div 
            className={`absolute inset-2 rounded-full bg-${orb.color}/20 animate-pulse`}
            style={{ animationDuration: `${orb.animationDuration * 0.7}s` }}
          />
          
          {/* Core */}
          <div 
            className={`absolute inset-4 rounded-full bg-${orb.color}/40 animate-blob`}
            style={{ animationDelay: `${orb.animationDelay * 0.5}s` }}
          />
        </div>
      ))}
      
      {/* Additional Ambient Particles */}
      <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-brand-cyan/40 rounded-full animate-float-fast" />
      <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-soft-lavender/30 rounded-full animate-float-medium" />
      <div className="absolute top-2/3 left-1/3 w-1.5 h-1.5 bg-earthy-brown/35 rounded-full animate-float-slow" />
      <div className="absolute bottom-1/4 left-2/3 w-1 h-1 bg-deep-teal/30 rounded-full animate-blob" />
      <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-brand-cyan/25 rounded-full animate-float-fast animation-delay-1000" />
    </div>
  )
}