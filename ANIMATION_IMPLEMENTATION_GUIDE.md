# Bright Ears Animation Implementation Guide
## Developer Quick Reference for Brand-Consistent Micro-Interactions

### Quick Start Checklist

**Before implementing any animation:**
1. ✅ Use brand easing curves (`--ease-premium`, `--ease-thai-gentle`, etc.)
2. ✅ Follow brand color transitions (brand-cyan, deep-teal, earthy-brown, soft-lavender)
3. ✅ Test on mobile devices (60fps requirement)
4. ✅ Include accessibility support (`prefers-reduced-motion`)
5. ✅ Use performance optimization classes (`will-animate`, `performance-optimized`)

---

## 1. Hero Section Implementations

### Enhanced Search Bar
```tsx
// components/search/EnhancedSearch.tsx
export default function EnhancedSearch({ variant = 'full' }: EnhancedSearchProps) {
  if (variant === 'hero') {
    return (
      <div className="max-w-4xl mx-auto animate-hero-search-enter">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-6 py-4 text-lg text-deep-teal bg-pure-white border-2 border-brand-cyan/30 rounded-lg 
                          focus:ring-2 focus:ring-brand-cyan focus:border-transparent focus:scale-[1.02] 
                          brand-transition shadow-lg placeholder-deep-teal/60"
              />
            </div>
            
            {/* Filter button with indicator */}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-6 py-4 text-lg font-medium text-deep-teal bg-pure-white border-2 border-deep-teal/30 
                        rounded-lg hover:bg-deep-teal/5 brand-transition shadow-lg"
            >
              {t('filters')} {hasActiveFilters && 
                <span className="ml-2 px-2 py-1 bg-soft-lavender text-pure-white text-xs rounded-full animate-count-up">
                  {Object.values(filters).filter(v => v).length}
                </span>
              }
            </button>
          </div>

          {/* Expanded filters with smooth animation */}
          {isExpanded && (
            <div className="animate-filter-panel-expand bg-pure-white/95 backdrop-blur-sm rounded-lg p-6 shadow-xl border border-brand-cyan/20">
              {/* Filter content */}
            </div>
          )}
        </form>
      </div>
    )
  }
}
```

### Search Suggestions Animation
```tsx
// Add to search suggestions
const SearchSuggestions = ({ suggestions }: { suggestions: string[] }) => (
  <div className="absolute top-full left-0 right-0 bg-pure-white rounded-lg shadow-xl border border-brand-cyan/20 mt-2 overflow-hidden">
    {suggestions.map((suggestion, index) => (
      <button
        key={suggestion}
        className={`w-full px-4 py-3 text-left hover:bg-brand-cyan/5 brand-transition 
                   animate-suggestion-slide-in animate-delay-${index * 50}`}
        onClick={() => handleSuggestionClick(suggestion)}
      >
        {suggestion}
      </button>
    ))}
  </div>
)
```

---

## 2. Featured Artists Card Animations

### Enhanced Artist Card Component
```tsx
// components/artists/ArtistCard.tsx
export default function ArtistCard({ artist, index }: { artist: Artist, index: number }) {
  return (
    <div 
      className={`bg-pure-white rounded-xl shadow-lg hover:shadow-xl brand-transition overflow-hidden 
                 group relative will-animate animate-card-entrance animate-delay-${index * 100}`}
      style={{ animationFillMode: 'both' }}
    >
      {/* Featured Badge */}
      <div className="absolute top-4 left-4 z-20">
        <span className="bg-soft-lavender text-pure-white text-xs px-2 py-1 rounded-full font-medium animate-count-up">
          ⭐ Featured
        </span>
      </div>

      {/* Availability Indicator */}
      {artist.isAvailable && (
        <div className="absolute top-4 right-4 z-20">
          <div className="flex items-center space-x-1 bg-green-500 text-pure-white text-xs px-2 py-1 rounded-full">
            <div className="w-2 h-2 bg-pure-white rounded-full animate-live-pulse"></div>
            <span>Available</span>
          </div>
        </div>
      )}

      {/* Artist Image with hover overlay */}
      <div className="relative h-64 bg-gray-200 overflow-hidden">
        <Image
          src={artist.profileImage}
          alt={artist.stageName}
          fill
          className="object-cover brand-transition group-hover:scale-105"
        />
        
        {/* Hover overlay with smooth entrance */}
        <div className="absolute inset-0 bg-gradient-to-t from-deep-teal/80 to-transparent 
                       opacity-0 group-hover:opacity-100 brand-transition z-10"></div>
        
        {/* Quick book button reveal */}
        <div className="absolute inset-0 z-30 opacity-0 group-hover:opacity-100 brand-transition">
          <div className="absolute bottom-4 left-4 right-4">
            <button className="w-full bg-brand-cyan hover:bg-brand-cyan/90 text-pure-white font-bold py-3 px-6 
                              rounded-lg brand-transition transform translate-y-5 group-hover:translate-y-0 
                              scale-90 group-hover:scale-100 shadow-lg">
              Quick Book
            </button>
          </div>
        </div>
      </div>

      {/* Card content with hover effects */}
      <div className="p-6 brand-transition group-hover:bg-off-white/50">
        {/* Artist info */}
      </div>
    </div>
  )
}
```

---

## 3. Activity Feed Real-Time Animations

### Enhanced Activity Feed
```tsx
// components/home/ActivityFeed.tsx
export default function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [newActivity, setNewActivity] = useState<ActivityItem | null>(null)

  // Add new activity with animation
  const addNewActivity = (activity: ActivityItem) => {
    setNewActivity(activity)
    setTimeout(() => {
      setActivities(prev => [activity, ...prev.slice(0, 7)])
      setNewActivity(null)
    }, 350) // Match animation duration
  }

  return (
    <div className="bg-pure-white rounded-xl shadow-lg p-6">
      {/* Header with live indicator */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-brand-cyan to-deep-teal rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-pure-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <h3 className="font-playfair font-bold text-lg text-deep-teal">Live Activity</h3>
            <p className="text-sm text-dark-gray/70">Real-time platform updates</p>
          </div>
        </div>
        
        {/* Animated live indicator */}
        <div className="flex items-center space-x-2 text-sm text-green-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-live-pulse"></div>
          <span className="font-medium">LIVE</span>
        </div>
      </div>

      {/* Activity items */}
      <div className="space-y-4">
        {/* New activity with entrance animation */}
        {newActivity && (
          <div className="animate-activity-slide-in p-3 rounded-lg bg-brand-cyan/5 border border-brand-cyan/20">
            <ActivityItem activity={newActivity} isNew={true} />
          </div>
        )}
        
        {/* Existing activities */}
        {activities.map((activity, index) => (
          <div 
            key={activity.id}
            className="animate-activity-slide-in p-3 rounded-lg hover:bg-off-white brand-transition"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <ActivityItem activity={activity} />
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## 4. Interactive Category Selection

### Animated Category Pills
```tsx
// components/home/Categories.tsx
export default function Categories() {
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  return (
    <div className="flex flex-wrap gap-3">
      {categories.map((category, index) => (
        <button
          key={category.value}
          onClick={() => setSelectedCategory(category.value)}
          className={`px-4 py-2 rounded-full border-2 brand-transition relative overflow-hidden
                     animate-suggestion-slide-in touch-feedback
                     ${selectedCategory === category.value 
                       ? 'bg-brand-cyan text-pure-white border-brand-cyan scale-105 shadow-lg' 
                       : 'text-deep-teal border-deep-teal/30 hover:border-brand-cyan hover:text-brand-cyan brand-hover-lift'
                     }`}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <span className="relative z-10">{category.label}</span>
          {/* Shimmer effect on hover */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full 
                         bg-gradient-to-r from-transparent via-white/20 to-transparent 
                         transition-transform duration-500"></div>
        </button>
      ))}
    </div>
  )
}
```

---

## 5. Enhanced Loading States

### Brand-Consistent Loaders
```tsx
// components/ui/LoadingSpinner.tsx
export default function LoadingSpinner({ 
  size = 'md', 
  variant = 'primary',
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  if (variant === 'thai-pattern') {
    return (
      <div className={`relative ${sizeClasses[size]} ${className}`}>
        <div className="absolute inset-0 border-2 border-transparent border-t-brand-cyan rounded-full animate-thai-loader"></div>
        <div className="absolute inset-2 border-2 border-transparent border-t-deep-teal rounded-full animate-thai-loader" 
             style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
      </div>
    )
  }

  return (
    <div className={`animate-loader-spin ${sizeClasses[size]} ${className}`}>
      <svg className="h-full w-full text-brand-cyan" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
  )
}

// Skeleton loading for cards
export function SkeletonCard() {
  return (
    <div className="bg-pure-white rounded-xl shadow-lg overflow-hidden animate-card-entrance">
      <div className="h-64 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-skeleton-loading"></div>
      <div className="p-6 space-y-4">
        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-skeleton-loading"></div>
        <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-3/4 animate-skeleton-loading"></div>
        <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-skeleton-loading"></div>
      </div>
    </div>
  )
}
```

---

## 6. Modal and Booking Animations

### Enhanced Quick Booking Modal
```tsx
// components/booking/QuickBookingModal.tsx
export default function QuickBookingModal({ isOpen, onClose }: QuickBookingModalProps) {
  const [step, setStep] = useState(1)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-backdrop-fade-in">
      <div className="bg-pure-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-modal-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-cyan to-deep-teal px-6 py-4 text-pure-white">
          <div className="flex items-center justify-between">
            <h3 className="font-playfair font-bold text-xl">Quick Booking</h3>
            <button
              onClick={onClose}
              className="text-pure-white/80 hover:text-pure-white brand-transition hover:scale-110"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-3 bg-off-white border-b">
          <div className="flex items-center justify-between text-sm text-dark-gray/70 mb-2">
            <span>Step {step}/4</span>
            <span>~2 minutes</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-brand-cyan to-deep-teal h-2 rounded-full brand-transition"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Step content with smooth transitions */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="animate-step-transition">
            {step === 1 && <StepOne />}
            {step === 2 && <StepTwo />}
            {step === 3 && <StepThree />}
            {step === 4 && <SuccessStep />}
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

## 7. Scroll-Triggered Animations

### Intersection Observer Hook
```tsx
// hooks/useScrollReveal.ts
import { useEffect, useRef, useState } from 'react'

export function useScrollReveal(threshold = 0.1) {
  const [isRevealed, setIsRevealed] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return [ref, isRevealed] as const
}

// Usage in components
export function AnimatedSection({ children }: { children: React.ReactNode }) {
  const [ref, isRevealed] = useScrollReveal()

  return (
    <section 
      ref={ref}
      className={`scroll-reveal ${isRevealed ? 'revealed' : ''}`}
    >
      {children}
    </section>
  )
}
```

---

## 8. Mobile-Specific Optimizations

### Touch-Optimized Interactions
```tsx
// For mobile cards and buttons
export function TouchOptimizedButton({ children, ...props }: ButtonProps) {
  return (
    <button 
      {...props}
      className={`touch-feedback brand-transition active:scale-95 ${props.className}`}
    >
      {children}
    </button>
  )
}

// Swipe indicators for carousels
export function SwipeIndicator() {
  return (
    <div className="flex items-center text-dark-gray/50 text-sm">
      <span>Swipe for more</span>
      <div className="ml-2 animate-swipe-hint">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  )
}
```

---

## 9. Performance Best Practices

### Animation Lifecycle Management
```tsx
// Use this pattern for complex animations
export function AnimatedComponent() {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleAnimationStart = () => {
    setIsAnimating(true)
    // Add will-animate class for performance
  }

  const handleAnimationEnd = () => {
    setIsAnimating(false)
    // Remove will-animate class to save memory
  }

  return (
    <div 
      className={`brand-transition ${isAnimating ? 'will-animate' : 'animation-complete'}`}
      onAnimationStart={handleAnimationStart}
      onAnimationEnd={handleAnimationEnd}
    >
      {/* Content */}
    </div>
  )
}
```

---

## 10. Testing Checklist

### Before Deployment
```bash
# Performance testing
- [ ] Animations maintain 60fps on Thai mobile devices
- [ ] No layout shifts during animations
- [ ] Animations degrade gracefully on slow connections

# Accessibility testing
- [ ] Respects prefers-reduced-motion
- [ ] Works with high contrast mode
- [ ] Keyboard navigation not disrupted

# Brand consistency
- [ ] Uses only approved easing curves
- [ ] Colors match brand palette exactly
- [ ] Timing feels appropriate for Thai market

# Cross-browser testing
- [ ] Works on Safari iOS (common in Thailand)
- [ ] Works on Chrome Android
- [ ] Fallbacks for older browsers
```

This implementation guide provides practical, copy-paste examples while maintaining Bright Ears' brand consistency and premium user experience standards.