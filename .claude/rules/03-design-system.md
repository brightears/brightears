# Design System

## Brand Colors (4 + White)

| Color | Hex | Usage |
|-------|-----|-------|
| **brand-cyan** | #00bbe4 | Primary CTAs, links, active states |
| **deep-teal** | #2f6364 | Dark backgrounds, headers, footers |
| **earthy-brown** | #a47764 | Secondary buttons, warm accents |
| **soft-lavender** | #d59ec9 | Badges, special highlights (sparingly) |
| **pure-white** | #ffffff | Cards, text on dark backgrounds |

### Supporting Neutrals
- `off-white` (#f7f7f7) - Main page backgrounds
- `dark-gray` (#333333) - Body text

## Typography

| Element | Font |
|---------|------|
| H1-H3 Headlines | `font-playfair` (serif) |
| Body, buttons, UI | `font-inter` (sans-serif) |
| Thai content | `font-noto-thai` |

**Never use default system fonts.**

## Design Patterns

### Glass Morphism
```css
bg-white/70 backdrop-blur-md border border-white/20
```

### Dark Glass (Venue Portal)
```css
bg-white/5 backdrop-blur-sm border border-white/10
```

### Gradient Backgrounds
Use animated gradients with mouse-tracking effects on hero sections.

## Animation Classes
- `animate-blob` - 7s infinite morph
- `animate-float-slow/medium/fast` - Parallax floating
- `animate-pulse` - Breathing effect
- `animation-delay-2000/4000` - Staggered animations

## Key Rules
- Always use `brand-cyan` for interactive elements (not amber/orange)
- Venue portal uses dark theme with `brand-cyan` accents
- PDF exports use `#00bbe4` for brand color (not teal)
