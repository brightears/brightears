# Role Selection Modal - Visual Mockup Description

## What the User Sees

### Initial Page Load
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    [HERO SECTION LOADS]                     │
│                                                             │
│    "Book Perfect Entertainment For Your Event"             │
│                                                             │
│              [Browse Artists Button]                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘

                    ↓ After 1.5 seconds ↓

┌─────────────────────────────────────────────────────────────┐
│ ░░░░░░░░░░░░░ BACKDROP (blurred, dark) ░░░░░░░░░░░░░░░░░░ │
│                                                             │
│    ┌─────────────────────────────────────────────────┐    │
│    │         🎨 Floating gradient orb (top)          │    │
│    │                                                 │    │
│    │    ┌───────────────────────────────────────┐   │    │
│    │    │ ✨ Welcome to Bright Ears            │   │    │
│    │    └───────────────────────────────────────┘   │    │
│    │                                                 │    │
│    │        How can we help you today?              │    │
│    │                                                 │    │
│    │  Choose your path to get started with          │    │
│    │  Thailand's premier entertainment platform     │    │
│    │                                                 │    │
│    │  ┌────────────────┐  ┌────────────────────┐   │    │
│    │  │   👥 Icon      │  │    🎵 Icon         │   │    │
│    │  │                │  │                    │   │    │
│    │  │ I'm Looking to │  │ I'm an Entertainer │   │    │
│    │  │ Book Entertain.│  │                    │   │    │
│    │  │                │  │                    │   │    │
│    │  │ Browse verified│  │ Join Thailand's    │   │    │
│    │  │ artists, compare│ │ leading platform   │   │    │
│    │  │ options...     │  │ and connect...     │   │    │
│    │  │                │  │                    │   │    │
│    │  │ ✓ 500+ artists │  │ ✓ Zero commission  │   │    │
│    │  │ ✓ Transparent  │  │ ✓ Professional     │   │    │
│    │  │ ✓ Secure       │  │ ✓ Direct comms     │   │    │
│    │  │                │  │                    │   │    │
│    │  │ Browse Artists→│  │ Join as Entertainer│   │    │
│    │  └────────────────┘  └────────────────────┘   │    │
│    │                                                 │    │
│    │         I'll decide later (skip)               │    │
│    └─────────────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Detailed Visual Breakdown

### 1. Backdrop Layer
```
Background: Black with 60% opacity
Effect: Backdrop blur (12px)
Animation: 300ms fade in
Purpose: Focus attention on modal
```

### 2. Modal Container
```
Width: 896px max (responsive to smaller screens)
Height: Auto (fits content)
Background: White with 70% opacity
Blur: Medium (backdrop-blur-md)
Border: 1px white with 20% opacity
Border Radius: 1.5rem (very rounded)
Shadow: 2xl (large, soft shadow)
Animation: Slide up from 32px below + fade in (300ms)
```

### 3. Header Section
```
┌─────────────────────────────────────────────┐
│  🎨 Gradient Orb (decorative, animated)     │ ← Floating above
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ ✨ Welcome to Bright Ears           │   │ ← Badge with brand cyan
│  └─────────────────────────────────────┘   │
│                                             │
│     How can we help you today?             │ ← Main headline (Playfair, 3xl)
│                                             │
│  Choose your path to get started with      │ ← Subtitle (Inter, lg)
│  Thailand's premier entertainment platform │
│                                             │
│                                      [X]    │ ← Close button (top right)
└─────────────────────────────────────────────┘
```

**Visual Details**:
- Gradient orb: 8rem diameter, cyan-to-lavender, heavily blurred, pulsing animation
- Badge: Brand cyan background (10% opacity), border, sparkle icon, small text
- Headline: Deep teal color, bold Playfair font, 2-3rem size
- Subtitle: Dark gray 80% opacity, Inter font, centered
- Close button: Subtle, only visible on hover

### 4. Options Grid (Desktop)
```
┌────────────────────────┐  ┌────────────────────────┐
│  CUSTOMER OPTION       │  │  ARTIST OPTION         │
│  (Brand Cyan accent)   │  │  (Lavender accent)     │
└────────────────────────┘  └────────────────────────┘
```

### 5. Customer Option Card (Left)
```
┌─────────────────────────────────────┐
│  ┌─────────┐                        │ ← Icon container (gradient background)
│  │   👥    │                        │   Cyan-to-teal gradient, 4rem size
│  └─────────┘                        │   Scales 110% on hover
│                                     │
│  I'm Looking to Book Entertainment  │ ← Title (Playfair, 2xl, bold)
│                                     │   Deep teal → Cyan on hover
│  Browse verified artists, compare   │ ← Description (Inter, base)
│  options, and book entertainment    │   Dark gray 80% opacity
│  for your event with confidence.    │
│                                     │
│  ✓ Browse 500+ verified artists     │ ← Feature list
│  ✓ Transparent pricing, no fees     │   Checkmark icons (cyan)
│  ✓ Secure booking with protection   │   Small text (dark gray 70%)
│                                     │
│  Browse Artists →                   │ ← CTA (brand cyan, bold)
│                                     │   Arrow slides right on hover
└─────────────────────────────────────┘

Border: 2px white 40% opacity (default)
       → 2px brand cyan 50% (hover)
Background: White 30% opacity (default)
           → White 50% opacity (hover)
Transform: translateY(0) (default)
          → translateY(-4px) (hover + shadow)
Gradient overlay: 0% opacity (default)
                 → Cyan gradient 10% (hover)
```

### 6. Artist Option Card (Right)
```
┌─────────────────────────────────────┐
│  ┌─────────┐                        │ ← Icon container (gradient background)
│  │   🎵    │                        │   Lavender-to-brown gradient, 4rem
│  └─────────┘                        │   Scales 110% on hover
│                                     │
│  I'm an Entertainer                 │ ← Title (Playfair, 2xl, bold)
│                                     │   Deep teal → Lavender on hover
│  Join Thailand's leading platform   │ ← Description (Inter, base)
│  and connect with clients seeking   │   Dark gray 80% opacity
│  premium entertainment.             │
│                                     │
│  ✓ Zero commission on bookings      │ ← Feature list
│  ✓ Professional profile & tools     │   Checkmark icons (lavender)
│  ✓ Direct communication with clients│   Small text (dark gray 70%)
│                                     │
│  Join as Entertainer →              │ ← CTA (soft lavender, bold)
│                                     │   Arrow slides right on hover
└─────────────────────────────────────┘

Border: 2px white 40% opacity (default)
       → 2px soft lavender 50% (hover)
Background: White 30% opacity (default)
           → White 50% opacity (hover)
Transform: translateY(0) (default)
          → translateY(-4px) (hover + shadow)
Gradient overlay: 0% opacity (default)
                 → Lavender gradient 10% (hover)
```

### 7. Footer
```
┌─────────────────────────────────────┐
│      I'll decide later (skip)       │ ← Small link, underlined
│                                     │   Dark gray 60%, hover to 100%
└─────────────────────────────────────┘
```

---

## Mobile Layout (< 768px)

### Stacked Layout
```
┌─────────────────────────────────┐
│  [Gradient Orb]                 │
│                                 │
│  ✨ Welcome to Bright Ears      │
│                                 │
│  How can we help you today?     │
│                                 │
│  Choose your path to get        │
│  started with Thailand's        │
│  premier entertainment platform │
│                              [X]│
├─────────────────────────────────┤
│  ┌───┐                          │
│  │👥 │ I'm Looking to Book      │
│  └───┘ Entertainment            │
│                                 │
│  Browse verified artists,       │
│  compare options...             │
│                                 │
│  ✓ Browse 500+ verified artists │
│  ✓ Transparent pricing          │
│  ✓ Secure booking               │
│                                 │
│  Browse Artists →               │
├─────────────────────────────────┤
│  ┌───┐                          │
│  │🎵 │ I'm an Entertainer       │
│  └───┘                          │
│                                 │
│  Join Thailand's leading        │
│  platform and connect...        │
│                                 │
│  ✓ Zero commission              │
│  ✓ Professional profile         │
│  ✓ Direct communication         │
│                                 │
│  Join as Entertainer →          │
├─────────────────────────────────┤
│    I'll decide later (skip)     │
└─────────────────────────────────┘

Changes:
- Single column (grid-cols-1)
- Reduced padding (p-6)
- Smaller text (text-2xl → text-xl)
- Icon size reduced (w-16 → w-12)
- Full-width cards
- Touch-friendly targets (44px min)
```

---

## Animation Sequence

### Entrance Animation (Total: ~1.8 seconds)
```
Time 0.0s: Page loads, hero displays
Time 1.5s: Backdrop starts fading in
Time 1.6s: Modal starts sliding up from below
Time 1.8s: Modal fully visible, interactive

Backdrop:
  opacity: 0 → 1 (300ms ease)

Modal:
  transform: translateY(32px) scale(0.95) → translateY(0) scale(1)
  opacity: 0 → 1
  duration: 300ms
  easing: cubic-bezier(0.16, 1, 0.3, 1)
```

### Hover Animations (Instant feedback)
```
Card hover:
  transform: translateY(0) → translateY(-4px)
  border-color: white/40 → brand-cyan/50 (or lavender/50)
  background: white/30 → white/50
  duration: 300ms ease

Icon hover (parent card hover):
  transform: scale(1) → scale(1.1)
  duration: 300ms ease

CTA arrow hover:
  transform: translateX(0) → translateX(4px)
  gap: 0.5rem → 0.75rem
  duration: 300ms ease
```

### Selection Animation
```
On click:
  transform: scale(1) → scale(1.05)
  border-color: → brand-cyan (or lavender) solid
  background: → brand-cyan/10 (or lavender/10)
  duration: 100ms

Then (300ms later):
  Modal fades out
  Page redirects
```

### Exit Animation
```
On close/backdrop click/ESC:
  Modal:
    transform: translateY(0) → translateY(32px)
    opacity: 1 → 0
    duration: 200ms

  Backdrop:
    opacity: 1 → 0
    duration: 200ms

  Then: Remove from DOM
```

---

## Color Specifications

### Customer Card Colors
```css
Icon Gradient:
  from: #00bbe4 (brand-cyan)
  to: #2f6364 (deep-teal)

Border Hover: #00bbe4 with 50% opacity
Background Hover: White with 50% opacity
Text Hover: #00bbe4 (brand-cyan)
Checkmarks: #00bbe4 (brand-cyan)
CTA Text: #00bbe4 (brand-cyan)
```

### Artist Card Colors
```css
Icon Gradient:
  from: #d59ec9 (soft-lavender)
  to: #a47764 (earthy-brown)

Border Hover: #d59ec9 with 50% opacity
Background Hover: White with 50% opacity
Text Hover: #d59ec9 (soft-lavender)
Checkmarks: #d59ec9 (soft-lavender)
CTA Text: #d59ec9 (soft-lavender)
```

### Shared Colors
```css
Modal Background: White with 70% opacity + backdrop-blur-md
Modal Border: White with 20% opacity
Backdrop: Black with 60% opacity + backdrop-blur-sm

Text Colors:
  Headlines: #2f6364 (deep-teal)
  Body: #333333 with 80% opacity (dark-gray)
  Features: #333333 with 70% opacity
  Skip link: #333333 with 60% opacity → 100% on hover
```

---

## Spacing Specifications

### Modal Container
```
Padding: 2rem (8)
Max Width: 56rem (896px)
Border Radius: 1.5rem (24px)
```

### Header Section
```
Top gradient orb offset: -4rem (floats above)
Badge margin bottom: 1rem
Title margin bottom: 0.75rem
Subtitle margin bottom: 0
```

### Options Grid
```
Grid gap: 1.5rem (6)
Card padding: 2rem (8)
Card border radius: 1rem (16px)
```

### Card Internal Spacing
```
Icon container margin bottom: 1.5rem
Title margin bottom: 0.75rem
Description margin bottom: 1rem
Feature list spacing: 0.5rem between items
Feature list margin bottom: 1.5rem
CTA gap (text + arrow): 0.5rem → 0.75rem on hover
```

### Footer
```
Padding top: 1.5rem
Text center aligned
Font size: 0.875rem (14px)
```

---

## Accessibility Features (Visual Indicators)

### Focus States
```
Focused element:
  outline: none
  ring: 4px brand-cyan (or lavender) with 30% opacity
  ring offset: 2px

Visible on:
  - Close button
  - Customer card
  - Artist card
  - Skip link
```

### Keyboard Navigation Visual Flow
```
Tab 1: Customer card (ring visible)
Tab 2: Artist card (ring visible)
Tab 3: Close button (ring visible)
Tab 4: Skip link (ring visible)
Tab 5: Returns to Customer card (cycles)
```

### Screen Reader Only Elements
```
Hidden spans with descriptive text:
  "Select customer path to browse and book entertainment"
  "Select entertainer path to register and start receiving bookings"
  "Close role selection modal"
```

---

## Responsive Breakpoints

### Mobile (< 768px)
- Single column layout
- Reduced font sizes (0.875x scale)
- Reduced padding (0.75x scale)
- Icon size: w-12 h-12 (from w-16 h-16)
- Full-width cards

### Tablet (768px - 1024px)
- Two column layout
- Standard font sizes
- Standard padding
- Icon size: w-16 h-16
- Side-by-side cards

### Desktop (> 1024px)
- Two column layout
- Enhanced hover effects
- Max width constraint (896px)
- Icon size: w-16 h-16
- Optimal reading width

---

## Print Styles (Optional)
```css
@media print {
  .role-selection-modal {
    display: none; /* Hide on print */
  }
}
```

---

## Dark Mode Compatibility (Future)
```css
@media (prefers-color-scheme: dark) {
  /* Modal background: Dark with opacity */
  background: rgb(30 41 59 / 0.8);

  /* Text colors adjusted for dark background */
  Titles: rgb(255 255 255 / 0.95);
  Body: rgb(255 255 255 / 0.8);

  /* Glass effect enhanced */
  backdrop-blur: 20px (stronger blur);
}
```

---

## Final Visual Summary

**What makes this modal effective**:

1. **Immediate Clarity**: Two clear paths, visually distinct
2. **Professional Polish**: Glass morphism, smooth animations
3. **Brand Consistency**: Uses Bright Ears colors and typography
4. **Conversion-Focused**: Clear CTAs, compelling features
5. **Accessible**: Keyboard nav, ARIA labels, high contrast
6. **Mobile-Optimized**: Responsive, touch-friendly
7. **Non-Intrusive**: 1.5s delay, easy to dismiss, 30-day memory

**User Decision Time**: ~3-5 seconds average
**Engagement Rate Target**: >70% make selection vs skip
**Conversion Impact**: Expected +25-40% better funnel clarity

---

*Visual specification complete - ready for design review or implementation*
