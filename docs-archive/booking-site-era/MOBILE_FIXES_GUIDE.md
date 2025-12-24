# Mobile Fixes Implementation Guide
**Bright Ears Entertainment Booking Platform**

**Version:** 1.0
**Last Updated:** October 3, 2025

---

## Table of Contents

1. [Quick Wins (1-2 hours each)](#quick-wins)
2. [Touch Target Fixes](#touch-target-fixes)
3. [Responsive Design Improvements](#responsive-design-improvements)
4. [Performance Optimizations](#performance-optimizations)
5. [iOS Safari Specific Fixes](#ios-safari-specific-fixes)
6. [Thai Market Optimizations](#thai-market-optimizations)
7. [Code Examples & Snippets](#code-examples--snippets)
8. [Testing After Fixes](#testing-after-fixes)

---

## Implementation Priority Matrix

| Priority | Issue | Files Affected | Est. Time | Impact |
|----------|-------|----------------|-----------|--------|
| 🔴 P0 | Touch targets < 44px | ArtistCard, Header, FilterSidebar | 1 hour | High |
| 🔴 P0 | iOS input zoom | QuickInquiryModal | 30 min | High |
| 🔴 P0 | Mobile filter drawer width | FilterSidebar | 15 min | High |
| 🟡 P1 | Lazy loading images | ArtistCard, Profile | 1 hour | Medium |
| 🟡 P1 | Safe area insets | MobileFloatingCTA | 30 min | Medium |
| 🟡 P1 | Modal overflow fix | QuickInquiryModal | 15 min | Medium |
| 🟡 P1 | Sticky bar positioning | EnhancedArtistProfile | 30 min | Medium |
| 🟢 P2 | Gradient performance | Hero, ArtistsPageContent | 2 hours | Low |
| 🟢 P2 | Responsive images | Multiple | 3 hours | Low |
| 🟢 P2 | Layout shift fixes | Multiple | 2 hours | Low |

**Total Estimated Time:**
- **P0 (Critical):** ~2 hours
- **P1 (High):** ~2.5 hours
- **P2 (Medium):** ~7 hours
- **Total:** ~11.5 hours (1.5 days)

---

## Quick Wins

### 1. Fix Input Zoom on iOS (15 minutes)

**Problem:** iOS Safari zooms when input font-size < 16px

**File:** `/components/booking/QuickInquiryModal.tsx`

**Current Code (lines 213, 264, 286):**
```tsx
<input
  type="text"
  className="w-full px-4 py-3 border border-gray-200 rounded-xl
             focus:ring-2 focus:ring-brand-cyan"
/>
```

**Fixed Code:**
```tsx
<input
  type="text"
  className="w-full px-4 py-3 text-base border border-gray-200 rounded-xl
             focus:ring-2 focus:ring-brand-cyan"
  // ^^^ Add text-base (16px) to prevent zoom
/>
```

**Apply to ALL inputs in:**
- QuickInquiryModal.tsx (lines 209, 260, 282, 315)
- Any other form components

---

### 2. Fix Mobile Filter Drawer Width (10 minutes)

**Problem:** Drawer width (w-80 = 320px) equals smallest viewport, causing edge cutoff

**File:** `/components/artists/FilterSidebar.tsx`

**Current Code (line 395):**
```tsx
<div className="fixed inset-y-0 left-0 w-80 max-w-full
                bg-white/95 backdrop-blur-xl">
```

**Fixed Code:**
```tsx
<div className="fixed inset-y-0 left-0 w-full max-w-[min(320px,90vw)]
                bg-white/95 backdrop-blur-xl">
  {/* Uses 90% of viewport width on small screens, max 320px on larger */}
```

---

### 3. Add Safe Area Insets for Floating CTA (20 minutes)

**Problem:** Floating CTA overlaps iOS Safari bottom bar

**File:** `/components/mobile/MobileFloatingCTA.tsx`

**Current Code (line 62):**
```tsx
<div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
```

**Fixed Code:**
```tsx
<div
  className="fixed bottom-4 left-4 right-4 z-50 md:hidden"
  style={{
    paddingBottom: 'env(safe-area-inset-bottom)',
    bottom: 'max(1rem, env(safe-area-inset-bottom))'
  }}
>
```

**Also add to:** `tailwind.config.ts`
```ts
// Add to theme.extend
padding: {
  'safe': 'env(safe-area-inset-bottom)',
  'safe-top': 'env(safe-area-inset-top)',
}
```

---

### 4. Fix Modal Content Overflow (15 minutes)

**Problem:** Modal uses `vh` which doesn't account for mobile browser chrome

**File:** `/components/booking/QuickInquiryModal.tsx`

**Current Code (line 200):**
```tsx
<div className="p-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
```

**Fixed Code:**
```tsx
<div className="p-6 max-h-[calc(100dvh-12rem)] overflow-y-auto">
  {/* 'dvh' = dynamic viewport height, accounts for browser UI */}
```

---

### 5. Improve Input Types for Mobile Keyboards (10 minutes)

**File:** `/components/booking/QuickInquiryModal.tsx`

**Current Code (line 262):**
```tsx
<input
  type="text"
  value={formData.phoneNumber}
  placeholder="081-234-5678"
/>
```

**Fixed Code:**
```tsx
<input
  type="tel"           // Shows numeric keyboard
  inputMode="tel"      // Better mobile keyboard
  pattern="[0-9-]*"    // Allows numbers and dashes
  value={formData.phoneNumber}
  placeholder="081-234-5678"
/>
```

---

## Touch Target Fixes

### Standard Touch Target Component

Create a utility component for consistent touch targets:

**New File:** `/components/ui/TouchTarget.tsx`
```tsx
import { ReactNode } from 'react'

interface TouchTargetProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  ariaLabel?: string
}

export default function TouchTarget({
  children,
  onClick,
  className = '',
  ariaLabel
}: TouchTargetProps) {
  return (
    <button
      onClick={onClick}
      className={`
        min-w-[44px] min-h-[44px]
        inline-flex items-center justify-center
        ${className}
      `}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  )
}
```

### Fix Artist Card Touch Targets

**File:** `/components/artists/ArtistCard.tsx`

**1. Favorite Button (line 125):**
```tsx
// BEFORE (40px)
<button className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/20">

// AFTER (44px)
<button className="absolute top-4 right-4 z-20 min-w-[44px] min-h-[44px]
                   flex items-center justify-center bg-white/20">
```

**2. Play Button Overlay (line 114):**
```tsx
// BEFORE
<button className="... w-16 h-16 bg-brand-cyan/90">

// AFTER (already good, but ensure minimum)
<button className="... min-w-[64px] min-h-[64px] bg-brand-cyan/90">
```

**3. Secondary Play Button (line 222):**
```tsx
// BEFORE
<button className="px-4 py-2.5 bg-white/50">

// AFTER
<button className="min-w-[44px] min-h-[44px] px-4 py-2.5 bg-white/50">
```

### Fix Filter Sidebar Checkboxes

**File:** `/components/artists/FilterSidebar.tsx`

**Current Code (line 209):**
```tsx
<input
  type="checkbox"
  className="w-4 h-4 text-brand-cyan rounded"
/>
```

**Fixed Code:**
```tsx
<label className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/50
                  cursor-pointer min-h-[44px]">
  <input
    type="checkbox"
    className="w-5 h-5 text-brand-cyan rounded flex-shrink-0"
    // Increase to w-5 h-5 (20px) and use larger tap area via label
  />
  <span className="font-inter text-sm text-dark-gray">
    {t(`categories.${category}`)}
  </span>
</label>
```

**Apply pattern to all checkboxes:**
- Lines 209, 291, 315, 342, 367

### Fix Header Mobile Menu Button

**File:** `/components/layout/Header.tsx`

**Current Code (line 214):**
```tsx
<button
  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
  className="md:hidden p-2 backdrop-blur-md border rounded-xl"
>
```

**Fixed Code:**
```tsx
<button
  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
  className="md:hidden min-w-[44px] min-h-[44px]
             flex items-center justify-center
             backdrop-blur-md border rounded-xl"
  aria-label="Toggle mobile menu"
>
```

---

## Responsive Design Improvements

### 1. Fix Artist Profile Hero Height

**File:** `/components/artists/EnhancedArtistProfile.tsx`

**Current Code (line 251):**
```tsx
<div className="relative h-96 bg-gradient-to-r from-deep-teal to-brand-cyan">
```

**Fixed Code:**
```tsx
<div className="relative min-h-[300px] sm:min-h-[350px] md:h-96
                bg-gradient-to-r from-deep-teal to-brand-cyan">
  {/* Adapts: 300px mobile, 350px tablet, 384px desktop */}
```

### 2. Fix Sticky Action Bar Top Offset

**File:** `/components/artists/EnhancedArtistProfile.tsx`

**Current Code (line 330):**
```tsx
<div className="sticky top-16 z-40 bg-pure-white border-b shadow-sm">
```

**Fixed Code:**
```tsx
<div className="sticky top-[60px] sm:top-16 md:top-16 z-40
                bg-pure-white border-b shadow-sm">
  {/* top-[60px] = 60px on mobile (header varies), top-16 = 64px on desktop */}
```

### 3. Improve Mobile Menu Width

**File:** `/components/layout/Header.tsx`

**Current Code (line 246):**
```tsx
<div className="absolute right-0 top-0 h-full w-72 bg-deep-teal/95">
```

**Fixed Code:**
```tsx
<div className="absolute right-0 top-0 h-full
                w-full max-w-xs sm:w-72 sm:max-w-none
                bg-deep-teal/95">
  {/* Responsive width: full on tiny screens, max 320px, then 288px on sm+ */}
```

### 4. Language Selector Dropdown Positioning

**File:** `/components/layout/Header.tsx`

**Current Code (line 117):**
```tsx
<div className="absolute top-full right-0 mt-2 w-48 backdrop-blur-xl">
```

**Fixed Code:**
```tsx
<div className="absolute top-full right-0 mt-2
                w-48 max-w-[calc(100vw-2rem)]
                backdrop-blur-xl">
  {/* Prevents overflow on narrow screens */}
```

### 5. Responsive Typography Improvements

**Global update pattern for better mobile readability:**

```tsx
// Small text - upgrade from text-xs (12px) to text-sm (14px)
// BEFORE
<p className="text-xs text-dark-gray/50">

// AFTER
<p className="text-sm text-dark-gray/50">

// Dense text - add line-height
// BEFORE
<p className="text-base text-dark-gray">

// AFTER
<p className="text-base leading-relaxed text-dark-gray">
```

**Apply to:**
- `/components/artists/ArtistCard.tsx` line 156
- `/components/booking/QuickInquiryModal.tsx` line 268
- Any text under 14px

---

## Performance Optimizations

### 1. Disable Mouse Tracking on Mobile (Gradient Performance)

**Files to update:**
- `/components/home/Hero.tsx`
- `/components/content/ArtistsPageContent.tsx`

**Current Code:**
```tsx
useEffect(() => {
  const handleMouseMove = (e: MouseEvent) => {
    const { clientX, clientY } = e
    const x = (clientX / window.innerWidth) * 100
    const y = (clientY / window.innerHeight) * 100
    setMousePosition({ x, y })
  }

  window.addEventListener('mousemove', handleMouseMove)
  return () => window.removeEventListener('mousemove', handleMouseMove)
}, [])
```

**Optimized Code:**
```tsx
useEffect(() => {
  // Only enable mouse tracking on desktop
  const isMobile = window.innerWidth < 768

  if (isMobile) {
    // Use static gradient position on mobile
    setMousePosition({ x: 50, y: 50 })
    return
  }

  const handleMouseMove = (e: MouseEvent) => {
    const { clientX, clientY } = e
    const x = (clientX / window.innerWidth) * 100
    const y = (clientY / window.innerHeight) * 100
    setMousePosition({ x, y })
  }

  window.addEventListener('mousemove', handleMouseMove)
  return () => window.removeEventListener('mousemove', handleMouseMove)
}, [])
```

### 2. Add Lazy Loading to Images

**Pattern for all image components:**

**File:** `/components/artists/ArtistCard.tsx` (line 89)

**Current Code:**
```tsx
<img
  src={image}
  alt={name}
  className="w-full h-full object-cover transition-transform duration-700"
/>
```

**Optimized Code:**
```tsx
<img
  src={image}
  alt={name}
  loading="lazy"
  decoding="async"
  className="w-full h-full object-cover transition-transform duration-700"
/>
```

**Apply to:**
- ArtistCard.tsx line 89
- EnhancedArtistProfile.tsx lines 263, 273
- Any other `<img>` tags

### 3. Optimize Backdrop Blur with Feature Detection

**File:** `/tailwind.config.ts` - Add plugin

**Current Config:**
```ts
plugins: [],
```

**Enhanced Config:**
```ts
plugins: [
  function({ addUtilities }) {
    const newUtilities = {
      '.glass-effect': {
        '@supports (backdrop-filter: blur(12px))': {
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
        },
        '@supports not (backdrop-filter: blur(12px))': {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
        },
      },
    }
    addUtilities(newUtilities)
  }
],
```

**Then update components:**
```tsx
// BEFORE
<div className="bg-white/70 backdrop-blur-md">

// AFTER
<div className="glass-effect">
```

### 4. Reduce Animation Complexity on Mobile

**Create mobile-aware animation classes:**

**File:** `/components/artists/ArtistCard.tsx`

**Current Code:**
```tsx
<div className="absolute top-20 left-10 w-72 h-72 bg-brand-cyan/30
                rounded-full filter blur-3xl animate-pulse" />
```

**Optimized Code:**
```tsx
<div className="absolute top-20 left-10 w-72 h-72 bg-brand-cyan/30
                rounded-full filter blur-3xl
                hidden md:block md:animate-pulse" />
  {/* Hide expensive animations on mobile */}
```

---

## iOS Safari Specific Fixes

### 1. Prevent Input Zoom (Comprehensive)

**Create utility class in global CSS:**

**File:** `/app/globals.css`
```css
/* Add after existing styles */

/* Prevent iOS input zoom */
@media screen and (max-width: 767px) {
  input[type="text"],
  input[type="email"],
  input[type="tel"],
  input[type="number"],
  input[type="password"],
  select,
  textarea {
    font-size: 16px !important;
  }
}
```

### 2. Fix iOS Safari Bottom Bar Overlap

**File:** `/app/layout.tsx` - Add viewport meta tag

**Current Code:**
```tsx
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

**Enhanced Code:**
```tsx
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, viewport-fit=cover"
/>
```

**Then use safe area in CSS:**
```css
/* In components that need safe area */
.mobile-footer {
  padding-bottom: env(safe-area-inset-bottom);
}

.mobile-header {
  padding-top: env(safe-area-inset-top);
}
```

### 3. Fix Fixed Positioning with Keyboard

**Issue:** Fixed elements jump when keyboard appears on iOS

**Solution:** Use CSS `position: sticky` instead of `fixed` where possible

**File:** `/components/artists/EnhancedArtistProfile.tsx`

**Current Code (line 330):**
```tsx
<div className="sticky top-16 z-40">
  {/* Already good - sticky is better than fixed on iOS */}
```

**For truly fixed elements, add:**
```tsx
<div
  className="fixed bottom-0 left-0 right-0"
  style={{
    // Prevent jumping on keyboard open
    position: '-webkit-sticky',
    position: 'sticky',
  }}
>
```

---

## Thai Market Optimizations

### 1. Ensure Thai Font Loading

**File:** `/app/layout.tsx`

**Add font-display optimization:**
```tsx
const notoSansThai = Noto_Sans_Thai({
  subsets: ['thai'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-noto-thai',
  display: 'swap', // Prevent invisible text during load
})
```

### 2. Optimize LINE Button for Mobile

**File:** `/components/booking/LineContactButton.tsx` (if exists)

**Ensure touch target:**
```tsx
<a
  href={`https://line.me/R/ti/p/${lineId}`}
  className="min-w-[44px] min-h-[44px]
             inline-flex items-center justify-center gap-2
             px-4 py-3 bg-green-500 text-white rounded-xl"
  target="_blank"
  rel="noopener noreferrer"
>
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    {/* LINE icon */}
  </svg>
  <span className="hidden sm:inline">Chat on LINE</span>
</a>
```

### 3. Thai Phone Number Input Formatting

**File:** `/components/booking/QuickInquiryModal.tsx`

**Add auto-formatting:**
```tsx
const formatThaiPhone = (value: string) => {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '')

  // Format as 0XX-XXX-XXXX
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`
}

// In input onChange:
onChange={(e) => {
  const formatted = formatThaiPhone(e.target.value)
  setFormData({...formData, phoneNumber: formatted})
}}
```

---

## Code Examples & Snippets

### 1. Responsive Image Component

**Create:** `/components/ui/ResponsiveImage.tsx`
```tsx
import Image from 'next/image'

interface ResponsiveImageProps {
  src: string
  alt: string
  aspectRatio?: string // e.g., "4/3", "16/9"
  className?: string
}

export default function ResponsiveImage({
  src,
  alt,
  aspectRatio = '4/3',
  className = ''
}: ResponsiveImageProps) {
  return (
    <div className={`relative w-full ${className}`} style={{ aspectRatio }}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover"
        loading="lazy"
      />
    </div>
  )
}
```

**Usage:**
```tsx
// Replace <img> tags with:
<ResponsiveImage
  src={artist.profileImage}
  alt={artist.stageName}
  aspectRatio="4/3"
  className="rounded-xl"
/>
```

### 2. Mobile-Aware Animation Hook

**Create:** `/hooks/useMobileAware.ts`
```tsx
import { useState, useEffect } from 'react'

export function useMobileAware(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [breakpoint])

  return isMobile
}
```

**Usage:**
```tsx
import { useMobileAware } from '@/hooks/useMobileAware'

function MyComponent() {
  const isMobile = useMobileAware()

  return (
    <div>
      {/* Conditional rendering */}
      {isMobile ? <MobileView /> : <DesktopView />}

      {/* Conditional props */}
      <div className={isMobile ? 'p-4' : 'p-8'}>

      {/* Conditional animations */}
      <div className={isMobile ? '' : 'animate-float'}>
    </div>
  )
}
```

### 3. Safe Area Utility Component

**Create:** `/components/ui/SafeArea.tsx`
```tsx
import { ReactNode } from 'react'

interface SafeAreaProps {
  children: ReactNode
  top?: boolean
  bottom?: boolean
  className?: string
}

export default function SafeArea({
  children,
  top = false,
  bottom = false,
  className = ''
}: SafeAreaProps) {
  const styles: React.CSSProperties = {}

  if (top) {
    styles.paddingTop = 'env(safe-area-inset-top)'
  }

  if (bottom) {
    styles.paddingBottom = 'env(safe-area-inset-bottom)'
  }

  return (
    <div className={className} style={styles}>
      {children}
    </div>
  )
}
```

**Usage:**
```tsx
<SafeArea bottom className="fixed bottom-0 left-0 right-0">
  <FloatingCTA />
</SafeArea>
```

### 4. Touch Feedback Component

**Create:** `/components/ui/TouchFeedback.tsx`
```tsx
'use client'

import { ReactNode, useState } from 'react'

interface TouchFeedbackProps {
  children: ReactNode
  onClick?: () => void
  className?: string
}

export default function TouchFeedback({
  children,
  onClick,
  className = ''
}: TouchFeedbackProps) {
  const [pressed, setPressed] = useState(false)

  return (
    <button
      className={`
        min-w-[44px] min-h-[44px]
        transition-transform active:scale-95
        ${pressed ? 'opacity-80' : 'opacity-100'}
        ${className}
      `}
      onClick={onClick}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
    >
      {children}
    </button>
  )
}
```

**Usage:**
```tsx
<TouchFeedback
  onClick={handleClick}
  className="bg-brand-cyan text-white rounded-xl px-6 py-3"
>
  Click Me
</TouchFeedback>
```

---

## Testing After Fixes

### Quick Verification Checklist

After implementing each fix, verify:

#### Touch Targets
```bash
# Open DevTools
# Run this in console to highlight small touch targets:

document.querySelectorAll('button, a, input[type="checkbox"], input[type="radio"]').forEach(el => {
  const rect = el.getBoundingClientRect()
  if (rect.width < 44 || rect.height < 44) {
    el.style.outline = '2px solid red'
    console.log('Small touch target:', el, `${rect.width}x${rect.height}`)
  }
})
```

#### iOS Input Zoom
```bash
# Test on iOS Safari or simulator
# Focus each input and verify no zoom occurs
# Inputs should have font-size: 16px or greater
```

#### Responsive Breakpoints
```bash
# Test at each breakpoint:
# 320px, 375px, 390px, 414px, 768px, 1024px
# Verify no horizontal scroll
# Verify proper layout at each size
```

#### Performance
```bash
# Run Lighthouse mobile audit:
npx lighthouse https://brightears.onrender.com \
  --emulated-form-factor=mobile \
  --throttling-method=simulate \
  --only-categories=performance \
  --output=html
```

### Regression Testing

After all fixes, run through:
1. [ ] Homepage hero and CTA
2. [ ] Artist listing and filters
3. [ ] Artist profile page
4. [ ] Quick inquiry modal
5. [ ] Mobile navigation
6. [ ] All form inputs
7. [ ] LINE integration
8. [ ] Language switcher

---

## Best Practices for Future Development

### Mobile-First Development Checklist

When creating new components, ensure:

- [ ] **Touch targets:** Minimum 44x44px
- [ ] **Touch spacing:** Minimum 8px, ideally 16px
- [ ] **Input font size:** 16px minimum (no zoom)
- [ ] **Responsive:** Test at 320px, 375px, 768px
- [ ] **Images:** Use Next.js Image with lazy loading
- [ ] **Text:** Minimum 16px body, 14px minimum for any text
- [ ] **Safe areas:** Account for iOS notches and bars
- [ ] **Performance:** Limit animations on mobile
- [ ] **Accessibility:** WCAG 2.1 AA contrast ratios

### Tailwind Mobile Patterns

```tsx
// Responsive spacing
<div className="p-4 md:p-6 lg:p-8">

// Responsive text
<h1 className="text-2xl md:text-3xl lg:text-4xl">

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Touch-friendly buttons
<button className="min-w-[44px] min-h-[44px] px-6 py-3">

// Mobile-first hiding
<div className="hidden md:block"> // Hide on mobile, show on desktop
<div className="md:hidden">       // Show on mobile, hide on desktop

// Conditional spacing
<div className="space-y-4 md:space-y-6"> // Tighter on mobile
```

---

## Quick Reference

### Common Issues & Solutions

| Issue | Solution | Code |
|-------|----------|------|
| Input zooms on iOS | Add text-base | `className="text-base"` |
| Touch target too small | Minimum 44px | `className="min-w-[44px] min-h-[44px]"` |
| Horizontal scroll | Check widths | Use `max-w-full` or `w-full` |
| Modal overflow | Use dvh | `max-h-[calc(100dvh-12rem)]` |
| Safe area overlap | Add insets | `style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}` |
| Slow animations | Disable on mobile | `hidden md:block md:animate-pulse` |
| Font loading shift | Add font-display | `display: 'swap'` in font config |
| Image layout shift | Use aspect ratio | `style={{ aspectRatio: '4/3' }}` |

### Files Modified Summary

Priority files to update:

1. **QuickInquiryModal.tsx** - Input zoom, modal overflow
2. **FilterSidebar.tsx** - Drawer width, checkboxes
3. **ArtistCard.tsx** - Touch targets, lazy loading
4. **Header.tsx** - Mobile menu, touch targets
5. **EnhancedArtistProfile.tsx** - Hero height, sticky bar
6. **MobileFloatingCTA.tsx** - Safe area insets
7. **Hero.tsx** - Gradient performance
8. **ArtistsPageContent.tsx** - Gradient performance
9. **tailwind.config.ts** - Safe area utilities, glass effect
10. **app/layout.tsx** - Viewport meta, font-display

---

## Deployment Checklist

Before deploying mobile fixes:

- [ ] All P0 (critical) issues fixed
- [ ] P1 (high) issues fixed or documented
- [ ] Code reviewed for mobile patterns
- [ ] Tested on real iOS device
- [ ] Tested on real Android device
- [ ] Lighthouse mobile score > 90
- [ ] No console errors
- [ ] Cross-browser tested (Safari, Chrome)
- [ ] Performance metrics acceptable
- [ ] Accessibility audit passed
- [ ] Thai market features verified
- [ ] Regression testing complete

---

## Support & Resources

### Documentation Links
- [iOS HIG Touch Targets](https://developer.apple.com/design/human-interface-guidelines/layout#Best-practices)
- [Material Design Touch Targets](https://m3.material.io/foundations/accessible-design/accessibility-basics#28032e45-c598-450c-b355-f9fe737b1cd8)
- [Tailwind Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [Next.js Image Optimization](https://nextjs.org/docs/app/api-reference/components/image)

### Testing Tools
- Chrome DevTools Device Mode
- Safari iOS Simulator
- BrowserStack (real devices)
- Lighthouse CI

---

**Version History:**
- v1.0 (Oct 3, 2025) - Initial implementation guide

**Maintained by:** QA Expert Agent
**Questions?** Refer to MOBILE_RESPONSIVENESS_AUDIT.md for detailed analysis
