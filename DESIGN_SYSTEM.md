# Bright Ears Design System

## ⚠️ MANDATORY DESIGN RULES - APPLY TO ALL COMPONENTS

This document defines the **ONLY** colors and fonts allowed in the Bright Ears project. Any deviation from these standards requires explicit approval.

## Color Palette (USE ONLY THESE)

### 4 Brand Colors + White
```css
brand-cyan: #00bbe4     /* Primary CTAs, links, icons, active states */
deep-teal: #2f6364      /* Dark backgrounds, headers, footers */
earthy-brown: #a47764   /* Secondary buttons, warm accents */
soft-lavender: #d59ec9  /* Badges, special highlights (use sparingly) */
pure-white: #ffffff     /* Clean white for cards and text on dark */
```

### Supporting Neutrals (for backgrounds/text only)
```css
off-white: #f7f7f7      /* Main page backgrounds (not pure white) */
dark-gray: #333333      /* ALL body text (not black) */
```

### Color Usage Rules
1. **NEVER** introduce new colors
2. **NEVER** use gray variants other than #333333 for text
3. **NEVER** use black (#000000) - use dark-gray instead
4. Background should always be off-white (#f7f7f7), not white
5. Cards on light backgrounds use pure-white (#ffffff)

## Typography (STRICTLY ENFORCED)

### Font Families
```css
font-playfair    /* Playfair Display - ALL H1, H2, H3 headlines */
font-inter       /* Inter - ALL body text, buttons, UI elements */
font-noto-thai   /* Noto Sans Thai - Thai language content only */
```

### Typography Rules
1. **ALL headlines (H1-H3)** MUST use `className="font-playfair ..."`
2. **ALL body text** inherits Inter from body tag (already configured)
3. **NEVER** use font-bold without font-playfair for headlines
4. **NEVER** use system fonts or introduce new fonts

### Implementation Examples

#### Correct Headline Implementation
```jsx
<h1 className="font-playfair font-bold text-3xl text-dark-gray">
<h2 className="font-playfair font-bold text-2xl text-pure-white">
<h3 className="font-playfair font-semibold text-xl text-deep-teal">
```

#### Correct Button Implementation
```jsx
<button className="bg-brand-cyan text-pure-white font-semibold hover:bg-brand-cyan/90">
<button className="bg-earthy-brown text-pure-white font-medium hover:bg-earthy-brown/80">
```

#### Correct Card Implementation
```jsx
<div className="bg-pure-white shadow-md rounded-lg p-6">
  <h3 className="font-playfair font-bold text-lg text-dark-gray">
  <p className="text-dark-gray text-sm">
```

## Component Standards

### Hero Sections
- Background: gradient using deep-teal and earthy-brown
- Headlines: font-playfair text-pure-white
- CTAs: bg-brand-cyan with pure-white text

### Cards
- Background: pure-white with shadow
- Text: dark-gray
- Accents: brand-cyan for links/CTAs

### Navigation
- Background: off-white or transparent
- Text: deep-teal with hover states
- Active states: brand-cyan

### Forms
- Input borders: brand-cyan/30 with focus:ring-brand-cyan
- Labels: dark-gray
- Buttons: brand-cyan (primary), earthy-brown (secondary)

### Footers
- Background: deep-teal
- Text: pure-white with opacity variants
- Links: pure-white/70 hover:pure-white

## Spacing & Layout
- Use Tailwind's default spacing scale
- Consistent padding: p-4, p-6, p-8
- Consistent margins: mt-4, mt-6, mt-8
- Max width containers: max-w-7xl

## DO NOT
❌ Add new colors
❌ Use different shades of existing colors
❌ Change font families
❌ Use inline styles for colors
❌ Create custom color classes
❌ Use gradient variations not defined here

## Verification Checklist
Before implementing any component:
- [ ] Uses ONLY the 4 brand colors + white (plus off-white/dark-gray for backgrounds/text)
- [ ] Headlines use font-playfair
- [ ] Body text uses default Inter (no class needed)
- [ ] No custom colors or fonts introduced
- [ ] Follows button hierarchy (brand-cyan primary, earthy-brown secondary)
- [ ] Background is off-white, not pure white
- [ ] Text is dark-gray, not black

---
Last Updated: August 12, 2024
This is the definitive design system for Bright Ears. All components must conform to these standards.