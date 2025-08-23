'use client'

import { useEffect, useState } from 'react'

interface MouseFollowerProps {
  children: React.ReactNode
}

export default function MouseFollower({ children }: MouseFollowerProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isPointer, setIsPointer] = useState(false)

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      
      // Check if hovering over interactive element
      const target = e.target as HTMLElement
      const isInteractive = target.tagName === 'BUTTON' || 
                          target.tagName === 'A' ||
                          target.tagName === 'INPUT' ||
                          target.closest('button') ||
                          target.closest('a') ||
                          target.closest('[role="button"]')
      
      setIsPointer(Boolean(isInteractive))
    }

    window.addEventListener('mousemove', updateMousePosition)
    return () => window.removeEventListener('mousemove', updateMousePosition)
  }, [])

  return (
    <div className="relative">
      {children}
      
      {/* Premium Mouse Follower */}
      <div 
        className="fixed pointer-events-none z-50 transition-all duration-300 ease-out"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* Main Cursor */}
        <div className={`w-8 h-8 rounded-full border-2 transition-all duration-300 ${
          isPointer 
            ? 'bg-brand-cyan/20 border-brand-cyan scale-150 animate-pulse' 
            : 'bg-transparent border-brand-cyan/50 scale-100'
        }`} />
        
        {/* Inner Dot */}
        <div className={`absolute top-1/2 left-1/2 w-2 h-2 rounded-full transition-all duration-300 ${
          isPointer
            ? 'bg-brand-cyan scale-0'
            : 'bg-brand-cyan scale-100 -translate-x-1/2 -translate-y-1/2'
        }`} />
        
        {/* Trailing Effect */}
        <div 
          className="absolute top-1/2 left-1/2 w-16 h-16 rounded-full bg-gradient-to-r from-brand-cyan/10 to-soft-lavender/10 -translate-x-1/2 -translate-y-1/2 animate-ping opacity-20"
          style={{ animationDuration: '2s' }}
        />
      </div>
    </div>
  )
}