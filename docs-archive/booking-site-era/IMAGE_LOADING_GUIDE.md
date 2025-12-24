# Image Loading Guide - Bright Ears Platform

## Overview

This guide explains how to implement proper image loading states with skeleton loaders throughout the Bright Ears platform. All components follow the glass morphism design system and provide excellent UX on slow connections (common in Thailand).

**Last Updated:** October 3, 2025
**Status:** Production Ready

---

## Table of Contents

1. [Core Components](#core-components)
2. [Usage Examples](#usage-examples)
3. [Next.js Image Optimization](#nextjs-image-optimization)
4. [Design System Compliance](#design-system-compliance)
5. [Performance Best Practices](#performance-best-practices)
6. [Accessibility](#accessibility)
7. [Testing Checklist](#testing-checklist)
8. [Troubleshooting](#troubleshooting)

---

## Core Components

### 1. ImageSkeleton Component

**Location:** `/components/ui/ImageSkeleton.tsx`

A reusable skeleton loader for individual images with multiple aspect ratios and glass morphism styling.

#### Features
- Multiple aspect ratios (square, landscape, portrait, video, hero, custom)
- Predefined sizes (sm, md, lg, xl, full)
- Animated gradient shimmer effect
- Glass morphism background
- Smooth fade-in transitions
- Accessibility support (ARIA labels)
- Staggered animation delays for multiple images

#### Props

```typescript
interface ImageSkeletonProps {
  aspectRatio?: 'square' | 'landscape' | 'portrait' | 'video' | 'hero' | 'custom'
  customAspectRatio?: string  // e.g., "16/9", "4/3"
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  className?: string
  showShimmer?: boolean
  animationDelay?: number  // in milliseconds
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  ariaLabel?: string
}
```

#### Usage Examples

```tsx
// Square profile image skeleton
<ImageSkeleton
  aspectRatio="square"
  size="md"
  rounded="full"
  ariaLabel="Loading profile image"
/>

// Artist card image skeleton (landscape 4:3)
<ImageSkeleton
  aspectRatio="landscape"
  size="full"
  rounded="xl"
  showShimmer={true}
/>

// Hero banner skeleton with custom aspect ratio
<ImageSkeleton
  aspectRatio="custom"
  customAspectRatio="21/9"
  size="full"
  rounded="none"
/>

// Multiple images with staggered animation
{images.map((_, i) => (
  <ImageSkeleton
    key={i}
    aspectRatio="landscape"
    size="lg"
    animationDelay={i * 100}
  />
))}
```

---

### 2. CardSkeleton Component

**Location:** `/components/ui/CardSkeleton.tsx`

A comprehensive skeleton loader for various card types (artist cards, reviews, bookings, etc.).

#### Features
- Multiple layout presets (artist, review, booking, featured, compact)
- Glass morphism card styling
- Animated gradient shimmer on text lines
- Staggered animation support
- Matches actual card layouts precisely
- Responsive design

#### Props

```typescript
interface CardSkeletonProps {
  layout?: 'artist' | 'review' | 'booking' | 'featured' | 'compact'
  animated?: boolean
  animationDelay?: number
  className?: string
  textLines?: number  // For review/text-heavy layouts
}
```

#### Layout Types

**Artist Card Layout:**
- Profile image skeleton (landscape 4:3)
- Name placeholder
- Genre and location placeholders
- Price placeholder
- Stats row (followers, rating)
- CTA button placeholder

**Review Card Layout:**
- Avatar skeleton (square, rounded-full)
- Name and rating placeholders
- Review text lines (configurable)

**Featured Card Layout:**
- Larger image skeleton
- Badge placeholder
- Enhanced content area
- Recent venue box
- Price and CTA section

**Compact Card Layout:**
- Small square image
- Title and subtitle only

**Booking Card Layout:**
- Header with status badge
- Date/time placeholder
- Event details
- Action buttons

#### Usage Examples

```tsx
// Artist card skeleton
<CardSkeleton layout="artist" animationDelay={100} />

// Review card with custom text lines
<CardSkeleton layout="review" textLines={5} />

// Grid of artist cards with staggered animation
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {[...Array(6)].map((_, i) => (
    <CardSkeleton
      key={i}
      layout="artist"
      animated={true}
      animationDelay={i * 150}
    />
  ))}
</div>

// Featured artist carousel
<CardSkeleton layout="featured" />

// Compact list item
<CardSkeleton layout="compact" />
```

---

### 3. ProfileSkeleton Component

**Location:** `/components/ui/ProfileSkeleton.tsx`

A comprehensive skeleton loader for full artist profile pages.

#### Features
- Hero section with cover and profile images
- Action bar with pricing and CTAs
- Tab navigation skeleton
- Multiple content sections (bio, media, packages, reviews)
- Matches actual profile layout structure
- Glass morphism throughout

#### Props

```typescript
interface ProfileSkeletonProps {
  animationDelay?: number
  className?: string
  showHero?: boolean
  showTabs?: boolean
  contentSections?: number
}
```

#### Usage Example

```tsx
// Full profile skeleton
<ProfileSkeleton
  showHero={true}
  showTabs={true}
  contentSections={4}
/>

// Minimal profile skeleton (no hero)
<ProfileSkeleton
  showHero={false}
  contentSections={2}
/>
```

---

## Usage Examples

### Artist Card with Image Loading

```tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import ImageSkeleton from '@/components/ui/ImageSkeleton'

export default function ArtistCard({ artist }) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl overflow-hidden">
      {/* Image Container */}
      <div className="relative h-64">
        {/* Skeleton - shown while loading */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0">
            <ImageSkeleton
              aspectRatio="landscape"
              size="full"
              rounded="none"
              showShimmer={true}
            />
          </div>
        )}

        {/* Optimized Image */}
        {!imageError ? (
          <Image
            src={artist.image}
            alt={`${artist.name} - Artist Profile`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-cover transition-opacity duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true)
              setImageLoaded(true)
            }}
            loading="lazy"
            quality={85}
          />
        ) : (
          // Fallback for failed loads
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-cyan/30 to-deep-teal/30">
            <div className="text-6xl">🎵</div>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-6">
        <h3>{artist.name}</h3>
        {/* ... rest of card content */}
      </div>
    </div>
  )
}
```

### Artist Listing with Skeleton Grid

```tsx
'use client'

import { useState, useEffect } from 'react'
import ArtistCard from './ArtistCard'
import CardSkeleton from '@/components/ui/CardSkeleton'

export default function ArtistListing() {
  const [artists, setArtists] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchArtists()
  }, [])

  const fetchArtists = async () => {
    setLoading(true)
    const response = await fetch('/api/artists')
    const data = await response.json()
    setArtists(data.artists)
    setLoading(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          // Show skeleton cards while loading
          [...Array(6)].map((_, i) => (
            <CardSkeleton
              key={i}
              layout="artist"
              animated={true}
              animationDelay={i * 100}
            />
          ))
        ) : (
          // Show actual artist cards
          artists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))
        )}
      </div>
    </div>
  )
}
```

### Profile Page with Full Skeleton

```tsx
'use client'

import { useState, useEffect } from 'react'
import ProfileSkeleton from '@/components/ui/ProfileSkeleton'
import ArtistProfile from './ArtistProfile'

export default function ArtistProfilePage({ artistId }) {
  const [artist, setArtist] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchArtist()
  }, [artistId])

  const fetchArtist = async () => {
    setLoading(true)
    const response = await fetch(`/api/artists/${artistId}`)
    const data = await response.json()
    setArtist(data)
    setLoading(false)
  }

  if (loading) {
    return <ProfileSkeleton showHero showTabs contentSections={4} />
  }

  return <ArtistProfile artist={artist} />
}
```

---

## Next.js Image Optimization

### Configuration

The platform is configured to support multiple image sources in `/next.config.ts`:

```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'res.cloudinary.com',
      pathname: '/**',
    },
    // ... other sources
  ],
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
}
```

### Best Practices

#### 1. Use Proper Sizes Prop

```tsx
// Artist card (in a 3-column grid on desktop)
<Image
  src={image}
  alt={alt}
  fill
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  // Mobile: full width, Tablet: 50% width, Desktop: 33% width (3 cols)
/>

// Hero image (always full width)
<Image
  src={heroImage}
  alt={alt}
  fill
  sizes="100vw"
/>

// Profile image (fixed size)
<Image
  src={profileImage}
  alt={alt}
  width={160}
  height={160}
  sizes="160px"
/>
```

#### 2. Loading Priority

```tsx
// Above-fold hero image - load immediately
<Image
  src={heroImage}
  alt={alt}
  fill
  priority
  loading="eager"
/>

// Below-fold images - lazy load
<Image
  src={cardImage}
  alt={alt}
  fill
  loading="lazy"
/>
```

#### 3. Quality Settings

```tsx
// Profile/hero images - high quality
<Image quality={90} />

// Card images - balanced quality
<Image quality={85} />

// Thumbnails - lower quality acceptable
<Image quality={75} />
```

#### 4. Error Handling

```tsx
const [imageError, setImageError] = useState(false)

<Image
  src={image}
  alt={alt}
  onError={() => {
    setImageError(true)
    setImageLoaded(true)
  }}
/>

{imageError && (
  <div className="fallback-image">
    {/* Fallback content */}
  </div>
)}
```

---

## Design System Compliance

All skeleton components match the Bright Ears glass morphism design system:

### Colors

```css
/* Skeleton base gradients */
background: linear-gradient(to bottom right,
  rgba(0, 187, 228, 0.2),   /* brand-cyan/20 */
  rgba(47, 99, 100, 0.2)     /* deep-teal/20 */
);

/* Shimmer effect */
background: linear-gradient(90deg,
  transparent,
  rgba(255, 255, 255, 0.3),
  transparent
);

/* Text line skeletons */
background: linear-gradient(to right,
  rgba(0, 187, 228, 0.2),    /* brand-cyan/20 */
  rgba(213, 158, 201, 0.2),  /* soft-lavender/20 */
  rgba(0, 187, 228, 0.2)     /* brand-cyan/20 */
);
```

### Glass Morphism

```css
.skeleton-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

### Animations

```css
/* Pulse animation for skeleton elements */
animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;

/* Shimmer animation for images */
animation: shimmer 2s infinite;

/* Fade-in when loaded */
transition: opacity 500ms ease-in-out;
```

---

## Performance Best Practices

### 1. Minimize Layout Shifts (CLS)

Always provide proper aspect ratios to prevent content jumping:

```tsx
// Good - prevents layout shift
<ImageSkeleton aspectRatio="landscape" />
<Image fill sizes="..." />

// Bad - causes layout shift
<div className="h-auto">
  <Image />
</div>
```

### 2. Lazy Load Below-Fold Images

```tsx
// Hero image (above fold) - eager load
<Image loading="eager" priority />

// Card images (below fold) - lazy load
<Image loading="lazy" />
```

### 3. Optimize Animation Performance

Use only `transform` and `opacity` for animations (GPU-accelerated):

```css
/* Good - GPU accelerated */
.skeleton {
  transform: translateX(-100%);
  opacity: 0;
}

/* Bad - causes repaints */
.skeleton {
  left: -100%;
  background-color: changing-color;
}
```

### 4. Image Format Support

The platform automatically serves modern formats:
- AVIF (best compression)
- WebP (good compression, wide support)
- JPEG/PNG (fallback)

### 5. Responsive Image Sizes

Configure proper breakpoints:

```tsx
sizes="
  (max-width: 640px) 100vw,
  (max-width: 1024px) 50vw,
  (max-width: 1536px) 33vw,
  25vw
"
```

---

## Accessibility

All skeleton components include proper accessibility features:

### ARIA Attributes

```tsx
<ImageSkeleton
  ariaLabel="Loading artist profile image"
/>

// Renders:
<div
  role="status"
  aria-label="Loading artist profile image"
  aria-busy="true"
>
  <span className="sr-only">Loading artist profile image</span>
</div>
```

### Screen Reader Support

```tsx
// Skeleton components include screen reader text
<span className="sr-only">Loading content, please wait...</span>

// Images have descriptive alt text
<Image
  src={image}
  alt={`${artist.name} - ${genre} artist profile image`}
/>
```

### Keyboard Navigation

All interactive elements maintain focus during loading:

```tsx
// Disabled state during loading
<button
  disabled={loading}
  aria-busy={loading}
>
  {loading ? 'Loading...' : 'View Profile'}
</button>
```

### Reduced Motion Support

Respects user preferences for reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  .skeleton,
  .shimmer,
  .pulse {
    animation: none !important;
    transition: none !important;
  }
}
```

---

## Testing Checklist

### Before Deployment

- [ ] **Visual Testing**
  - [ ] Skeletons match final layout dimensions
  - [ ] No layout shifts when content loads
  - [ ] Smooth transitions between skeleton and content
  - [ ] Glass morphism styling is consistent

- [ ] **Network Testing**
  - [ ] Test on simulated 3G connection (DevTools Network throttling)
  - [ ] Test on actual 3G/4G mobile device in Thailand
  - [ ] Verify images lazy load correctly
  - [ ] Check that above-fold images load eagerly

- [ ] **Performance Testing**
  - [ ] Lighthouse CLS score < 0.1
  - [ ] Lighthouse LCP score < 2.5s
  - [ ] No janky animations (60fps maintained)
  - [ ] Memory usage is reasonable

- [ ] **Accessibility Testing**
  - [ ] Screen reader announces loading states
  - [ ] ARIA attributes are correct
  - [ ] Keyboard navigation works during loading
  - [ ] Reduced motion is respected

- [ ] **Cross-Browser Testing**
  - [ ] Chrome/Edge (Chromium)
  - [ ] Safari (especially mobile Safari for Thailand market)
  - [ ] Firefox
  - [ ] Mobile browsers (iOS Safari, Chrome Mobile)

- [ ] **Device Testing**
  - [ ] iPhone (various models)
  - [ ] Android devices (Samsung, common in Thailand)
  - [ ] Tablets
  - [ ] Desktop (various screen sizes)

### Network Throttling Settings

For realistic Thailand market testing:

```
Slow 3G:
- Download: 400 Kbps
- Upload: 200 Kbps
- Latency: 300ms

Fast 3G:
- Download: 1.6 Mbps
- Upload: 750 Kbps
- Latency: 150ms

4G:
- Download: 4 Mbps
- Upload: 3 Mbps
- Latency: 50ms
```

---

## Troubleshooting

### Issue: Images not loading from external sources

**Solution:** Check `next.config.ts` remotePatterns:

```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'res.cloudinary.com',
      pathname: '/**',
    },
  ],
}
```

### Issue: Skeleton doesn't match final layout

**Solution:** Ensure skeleton uses same aspect ratio and dimensions:

```tsx
// Skeleton
<ImageSkeleton aspectRatio="landscape" size="full" />

// Actual image
<Image fill className="aspect-[4/3]" />
```

### Issue: Layout shifts when image loads

**Solution:** Always specify aspect ratio:

```tsx
<div className="relative aspect-[4/3]">
  <Image fill />
</div>
```

### Issue: Animations causing performance issues

**Solution:** Check that only transform/opacity are animated:

```css
/* Good */
.skeleton {
  transform: translateX(-100%);
  opacity: 0;
  transition: transform 500ms, opacity 500ms;
}

/* Bad */
.skeleton {
  left: -100%;
  background: changing-color;
  transition: all 500ms;
}
```

### Issue: Skeleton flash before image loads

**Solution:** Use proper initial state:

```tsx
const [imageLoaded, setImageLoaded] = useState(false)

// Show skeleton until image loads
{!imageLoaded && <ImageSkeleton />}
<Image onLoad={() => setImageLoaded(true)} />
```

### Issue: FOUC (Flash of Unstyled Content)

**Solution:** Ensure skeleton is rendered server-side:

```tsx
// Component must be 'use client' if using state
'use client'

// Or use Suspense for server components
<Suspense fallback={<CardSkeleton />}>
  <ArtistCard />
</Suspense>
```

---

## Component File Locations

```
/components/ui/
├── ImageSkeleton.tsx       # Individual image skeleton loader
├── CardSkeleton.tsx        # Card skeleton loader (multiple layouts)
└── ProfileSkeleton.tsx     # Full profile page skeleton

/components/artists/
├── ArtistCard.tsx          # Updated with ImageSkeleton
├── EnhancedArtistProfile.tsx  # Updated with ProfileSkeleton
└── EnhancedArtistListing.tsx  # Updated with CardSkeleton

/components/home/
└── FeaturedArtists.tsx     # Updated with CardSkeleton

/app/globals.css            # Shimmer animation keyframes

/next.config.ts             # Image optimization config

/docs/
└── IMAGE_LOADING_GUIDE.md  # This file
```

---

## Quick Reference

### Common Skeleton Patterns

```tsx
// Artist card skeleton
<CardSkeleton layout="artist" animationDelay={100} />

// Profile page skeleton
<ProfileSkeleton showHero showTabs contentSections={4} />

// Image skeleton (landscape)
<ImageSkeleton aspectRatio="landscape" size="full" rounded="xl" />

// Staggered grid
{[...Array(6)].map((_, i) => (
  <CardSkeleton key={i} layout="artist" animationDelay={i * 150} />
))}
```

### Common Image Patterns

```tsx
// Artist card image
<Image
  src={image}
  alt={`${name} - Artist`}
  fill
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  loading="lazy"
  quality={85}
  onLoad={() => setImageLoaded(true)}
  onError={() => setImageError(true)}
/>

// Hero image
<Image
  src={heroImage}
  alt="Hero banner"
  fill
  sizes="100vw"
  priority
  loading="eager"
  quality={90}
/>

// Profile avatar
<Image
  src={avatar}
  alt={`${name} avatar`}
  width={160}
  height={160}
  className="rounded-full"
  priority
  quality={90}
/>
```

---

## Support

For questions or issues:
- Review this guide
- Check component PropTypes and JSDoc comments
- Review existing implementations in the codebase
- Test on actual Thai mobile networks when possible

**Remember:** The Thai market often experiences slower mobile connections. Always test on throttled networks and prioritize performance and loading experience.

---

**Version:** 1.0.0
**Last Updated:** October 3, 2025
**Maintained By:** Bright Ears Development Team
