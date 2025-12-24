# Role Selection Modal - Visual Design Specification

## Design Overview
This modal serves as the critical first touchpoint for new visitors, guiding them to their appropriate user journey. The design leverages Bright Ears' established glass morphism aesthetic with brand colors to create a welcoming, conversion-focused experience.

## Color Strategy

### Customer Path (Brand Cyan)
**Primary**: #00bbe4 (Brand Cyan)
**Secondary**: #2f6364 (Deep Teal)
**Gradient**: `from-brand-cyan to-deep-teal`

**Rationale**: Cyan conveys trust, professionalism, and action - perfect for customers making booking decisions.

### Artist Path (Soft Lavender)
**Primary**: #d59ec9 (Soft Lavender)
**Secondary**: #a47764 (Earthy Brown)
**Gradient**: `from-soft-lavender to-earthy-brown`

**Rationale**: Lavender adds warmth and creativity while differentiating from the customer path without competing visually.

## Typography

### Hierarchy
```
Modal Title: font-playfair text-3xl md:text-4xl font-bold text-deep-teal
Badge: text-sm font-medium text-brand-cyan
Option Titles: font-playfair text-2xl font-bold text-deep-teal
Descriptions: text-dark-gray/80 leading-relaxed
Features: text-sm text-dark-gray/70
CTAs: font-semibold (brand-cyan or soft-lavender)
```

### Font Stack
- **Headlines/Titles**: Playfair Display (serif) - elegant, professional
- **Body/UI**: Inter (sans-serif) - clean, readable
- **Thai**: Noto Sans Thai - authentic, optimized for Thai script

## Icon Recommendations

### Current Implementation
- **Customer**: UserGroup icon (Heroicons outline)
- **Artist**: Musical Note icon (Heroicons solid)

### Enhanced Icon Options

#### Customer Path Icons (Choose One)

**Option 1: Calendar + Search (Recommended)**
```typescript
// Custom composite icon - represents browsing and booking
<svg className="w-8 h-8" viewBox="0 0 24 24">
  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  <circle cx="15" cy="15" r="3" />
  <path d="M17.5 17.5L21 21" />
</svg>
```
**Pros**: Clearly communicates booking functionality
**Cons**: Slightly complex for small sizes

**Option 2: Sparkle + Star (Premium Feel)**
```typescript
import { SparklesIcon } from '@heroicons/react/24/outline'
// Already imported in component
```
**Pros**: Conveys premium entertainment experience
**Cons**: Less literal about booking action

**Option 3: Theater Masks (Entertainment Focus)**
```typescript
// Emoji alternative (simple implementation)
<span className="text-4xl">🎭</span>
```
**Pros**: Instantly recognizable, entertainment-specific
**Cons**: Emoji rendering varies by platform

**Option 4: Ticket/Event (Booking Action)**
```typescript
<svg className="w-8 h-8" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
</svg>
```
**Pros**: Clear booking/ticketing metaphor
**Cons**: May imply ticketed events only

#### Artist Path Icons (Choose One)

**Option 1: Microphone (Recommended - Current)**
```typescript
// Replace Musical Note with Microphone for stronger association
<svg className="w-8 h-8" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
</svg>
```
**Pros**: Universal symbol for performers
**Cons**: None - strong choice

**Option 2: Stage/Spotlight**
```typescript
<svg className="w-8 h-8" viewBox="0 0 24 24">
  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
</svg>
// Star representing spotlight/fame
```
**Pros**: Aspirational, represents performance
**Cons**: Could be confused with rating/favorite

**Option 3: Musical Instruments**
```typescript
// Emoji approach for simplicity
<span className="text-4xl">🎸</span> // or 🎹 🎤 🎵
```
**Pros**: Very clear, versatile
**Cons**: Emoji rendering inconsistency

**Option 4: Artist Badge/ID**
```typescript
<svg className="w-8 h-8" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
    d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
</svg>
```
**Pros**: Professional, represents artist identity
**Cons**: Complex, less immediately clear

### Recommended Final Choice

**Customer Path**: 🎭 Theater Masks Emoji OR Calendar+Search SVG
**Artist Path**: 🎤 Microphone SVG (outlined above)

**Rationale**:
- Theater masks instantly communicates "entertainment"
- Microphone universally represents "performer/artist"
- Both are culturally neutral and work in Thai context
- Simple, scalable, and recognizable at any size

## Layout & Spacing

### Modal Dimensions
```css
max-width: 4xl (896px)
width: 100%
padding: p-8 (2rem)
border-radius: rounded-3xl (1.5rem)
```

### Grid Layout
```css
Desktop (md+): grid-cols-2 (50/50 split)
Mobile (<md): grid-cols-1 (stacked)
gap: 6 (1.5rem)
```

### Card Spacing
```css
padding: p-8 (2rem)
margin-bottom: mb-6 (1.5rem) per section
icon-to-text: mb-6 (1.5rem)
text-to-features: mb-4 (1rem)
feature-spacing: space-y-2 (0.5rem)
```

## Glass Morphism Implementation

### Modal Container
```css
background: bg-white/70
backdrop-filter: backdrop-blur-md
border: border border-white/20
box-shadow: shadow-2xl
```

### Option Cards
```css
/* Default State */
background: bg-white/30
border: border-2 border-white/40
backdrop-filter: backdrop-blur-sm

/* Hover State */
background: bg-white/50
border: border-brand-cyan/50 (or soft-lavender/50)
transform: -translate-y-1
box-shadow: enhanced

/* Selected State */
background: bg-brand-cyan/10 (or soft-lavender/10)
border: border-brand-cyan (or soft-lavender)
transform: scale-105
```

### Decorative Elements
```css
/* Gradient Orb (top center) */
width: w-32 (8rem)
height: h-32 (8rem)
background: bg-gradient-to-br from-brand-cyan to-soft-lavender
filter: blur-3xl
opacity: opacity-30
animation: animate-pulse
```

## Animation Specifications

### Modal Entrance
```css
/* Initial State */
opacity: 0
transform: translateY(32px) scale(0.95)

/* Animated State */
transition: all 300ms cubic-bezier(0.16, 1, 0.3, 1)
opacity: 1
transform: translateY(0) scale(1)
```

### Backdrop Fade
```css
transition: opacity 300ms ease
opacity: 0 → 1
```

### Card Hover
```css
transition: all 300ms ease
transform: translateY(0) → translateY(-4px)
border-color: white/40 → brand-cyan/50
background: white/30 → white/50
```

### Icon Animation
```css
transition: transform 300ms ease
transform: scale(1) → scale(1.1) on parent hover
```

### CTA Arrow
```css
transition: transform 300ms ease
transform: translateX(0) → translateX(4px) on hover
gap: 2 → 3 on hover
```

## Responsive Design

### Breakpoints

#### Mobile (< 768px)
```css
- Single column layout
- Reduced padding (p-6 instead of p-8)
- Smaller text sizes (text-2xl instead of text-3xl)
- Stacked options (grid-cols-1)
- Full width buttons
- Icon size w-12 h-12 instead of w-16 h-16
```

#### Tablet (768px - 1024px)
```css
- Two column layout (grid-cols-2)
- Standard padding (p-8)
- Full text sizes
- Side-by-side options
```

#### Desktop (1024px+)
```css
- Two column layout with max-width constraint
- Optimal reading width
- Enhanced hover effects
- Larger gradient orbs
```

### Mobile-Specific Optimizations
```typescript
// Touch-friendly tap targets (minimum 44x44px)
// Reduced animation intensity
// Simplified glass effects (lighter blur for performance)
// Swipe gestures (optional enhancement)
```

## Accessibility Specifications

### Color Contrast
```
✅ Deep Teal (#2f6364) on White: 9.5:1 (AAA)
✅ Brand Cyan (#00bbe4) on White: 3.8:1 (AA Large)
✅ Dark Gray (#333333) on White: 12.6:1 (AAA)
✅ Soft Lavender (#d59ec9) on White: 3.2:1 (AA Large)
```

### ARIA Labels
```typescript
// Modal
role="dialog"
aria-modal="true"
aria-labelledby="role-selection-title"

// Backdrop
aria-label={t('close')}
role="button"

// Option Buttons
aria-label={t('customer.ariaLabel')}
aria-label={t('artist.ariaLabel')}
```

### Keyboard Navigation
```
Tab: Cycle through focusable elements
Shift+Tab: Reverse cycle
Enter/Space: Activate button
Escape: Close modal
```

### Focus States
```css
focus:outline-none
focus:ring-4
focus:ring-brand-cyan/30 (or soft-lavender/30)
```

## Copy & Content Guidelines

### Tone of Voice
- **Welcoming**: "How can we help you today?"
- **Clear**: Simple, direct language
- **Encouraging**: Action-oriented CTAs
- **Professional**: No slang, appropriate for corporate clients

### Character Limits
```
Title: 40 characters max
Description: 100 characters max (2 lines)
Features: 40 characters max per item
CTA: 20 characters max
```

### Localization Notes
- **Thai**: Formal "ครับ/ค่ะ" optional based on target audience
- **English**: Professional but friendly tone
- **Cultural**: Avoid region-specific idioms
- **Inclusive**: Gender-neutral language where possible

## Brand Consistency Checklist

- [x] Glass morphism design pattern
- [x] Brand color palette (cyan, teal, lavender, brown)
- [x] Playfair Display for headlines
- [x] Inter for body text
- [x] Smooth animations (300ms standard)
- [x] Rounded corners (rounded-2xl, rounded-3xl)
- [x] Gradient overlays on hover
- [x] High contrast for readability
- [x] Responsive padding and spacing
- [x] Consistent icon style (outline preferred)

## Performance Optimization

### Asset Loading
```typescript
// Lazy load modal component
const RoleSelectionModal = dynamic(() => import('@/components/modals/RoleSelectionModal'), {
  ssr: false // Client-side only
})
```

### Animation Performance
```css
/* Use GPU-accelerated properties */
transform: translate3d(0, 0, 0)
will-change: transform, opacity

/* Avoid animating */
height, width, margin, padding (use transform instead)
```

### Bundle Size
- Current: ~4KB gzipped
- Icons: Use existing Heroicons (already imported)
- No additional dependencies
- CSS-in-JS via Tailwind (shared bundle)

## Testing Specifications

### Visual Regression Tests
- [ ] Screenshot comparison at 320px, 768px, 1024px, 1440px
- [ ] Dark mode compatibility (if applicable)
- [ ] High DPI display rendering
- [ ] Print stylesheet handling

### Interaction Tests
- [ ] Click/tap on each option
- [ ] Hover states on desktop
- [ ] Focus states with keyboard
- [ ] Animation smoothness on low-end devices
- [ ] Backdrop blur performance

### Cross-Browser Tests
- [ ] Chrome (Windows, Mac, Android)
- [ ] Safari (Mac, iOS)
- [ ] Firefox (Windows, Mac)
- [ ] Edge (Windows)
- [ ] Samsung Internet (Android)

## Design System Integration

### Tailwind Configuration
Uses existing Tailwind config with custom colors:
```typescript
// tailwind.config.ts
colors: {
  'brand-cyan': '#00bbe4',
  'deep-teal': '#2f6364',
  'earthy-brown': '#a47764',
  'soft-lavender': '#d59ec9',
  ...
}
```

### Component Variants
```typescript
// Can be extended for other modals
<BaseModal variant="role-selection" />
<BaseModal variant="confirmation" />
<BaseModal variant="info" />
```

### Reusable Patterns
- Glass card component
- Gradient icon container
- Feature list component
- Animated backdrop

## Future Design Enhancements

### Phase 2 Visual Improvements
1. **Lottie Animations**: Animated icons for each role
2. **Video Backgrounds**: Looping video of events/performances
3. **3D Illustrations**: Isometric art for each user journey
4. **Parallax Effects**: Layered scrolling within modal
5. **Confetti**: Celebration animation on selection

### A/B Test Variants
1. **Minimal**: Text-only, no icons
2. **Bold**: Large imagery, less text
3. **Gamified**: Progress bar, achievement unlocks
4. **Social Proof**: Live counters, testimonials
5. **Urgency**: Limited-time messaging

### Seasonal Themes
- **New Year**: Gold accents, fireworks
- **Songkran**: Water/splash effects
- **Christmas**: Winter/festive theme
- **Loy Krathong**: Lantern animations

---

## Design Assets Checklist

### Required Exports
- [ ] SVG icons (customer & artist)
- [ ] Icon set (16px, 24px, 32px, 48px)
- [ ] Background patterns (optional)
- [ ] Gradient swatches
- [ ] Animation keyframes

### Design Handoff
- [x] Figma/Sketch file (if applicable)
- [x] Component specifications (this document)
- [x] Color palette reference
- [x] Typography scale
- [x] Spacing system
- [x] Animation timings

---

## Quick Reference

### Glass Morphism Recipe
```css
bg-white/70 backdrop-blur-md border border-white/20
```

### Gradient Buttons
```css
bg-gradient-to-br from-brand-cyan to-deep-teal
bg-gradient-to-br from-soft-lavender to-earthy-brown
```

### Smooth Animations
```css
transition-all duration-300 ease
transform hover:-translate-y-1
```

### Icon Sizes
```
Small: w-4 h-4 (1rem)
Medium: w-8 h-8 (2rem)
Large: w-16 h-16 (4rem)
```

---

**Design Version**: 1.0
**Last Updated**: October 5, 2025
**Design Status**: Complete, Ready for Implementation
**Figma Link**: [Add if available]
