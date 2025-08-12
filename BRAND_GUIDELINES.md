# Bright Ears Brand Guidelines

## Logo
- **File**: `/public/logo.png` (BE_Logo_Transparent.png)
- **Location**: Stored as transparent PNG
- **Usage**: Display at 40px height in header, scale appropriately for other uses

## Brand Colors (Earth-Tone Palette)

### Primary Colors
- **Brand Cyan**: `#00bbe4` - Primary brand color (matches logo)
- **Deep Teal**: `#2f6364` - Dark backgrounds, anchoring
- **Earthy Brown**: `#a47764` - Warm accent, secondary buttons
- **Soft Lavender**: `#d59ec9` - Highlights, badges (use sparingly)

### Neutral Colors
- **Off-White**: `#f7f7f7` - Main backgrounds
- **Dark Gray**: `#333333` - Primary text color
- **Pure White**: `#ffffff` - Cards on dark backgrounds

### Color System
```css
/* Primary Palette */
brand-cyan: #00bbe4;     /* CTAs, links, icons, primary actions */
deep-teal: #2f6364;      /* Dark backgrounds, footers, headers */
earthy-brown: #a47764;   /* Secondary buttons, warm accents */
soft-lavender: #d59ec9;  /* Special highlights, badges */

/* Neutrals */
off-white: #f7f7f7;      /* Page backgrounds */
dark-gray: #333333;      /* Body text */
white: #ffffff;          /* Cards, text on dark */
```

## Usage Guidelines

### Color Hierarchy (Based on Gemini Analysis)
1. **Primary/Action** (#00bbe4): CTAs, links, headlines, key branding
2. **Secondary/Anchor** (#2f6364): Dark backgrounds, footers, section dividers
3. **Accent/Warmth** (#a47764): Secondary buttons, cards, info boxes
4. **Highlight** (#d59ec9): Badges, tags, special callouts (use sparingly)

### Buttons
- **Primary CTA**: `bg-brand-cyan text-white hover:bg-opacity-90`
- **Secondary CTA**: `bg-earthy-brown text-white hover:bg-opacity-90`
- **Tertiary**: `bg-off-white text-dark-gray hover:bg-gray-100`

### Backgrounds
- **Hero Section**: Deep teal (#2f6364) with white text
- **Features**: Off-white (#f7f7f7) background with white cards
- **Categories**: Earthy brown accents for warmth
- **Corporate**: Deep teal background
- **Footer**: Deep teal (#2f6364)

### Typography
- **Headers**: Bold, dark gray (#333333) on light, white on dark
- **Body**: Regular dark gray (#333333) on light backgrounds
- **White Text**: Use on deep teal backgrounds for contrast

## Design Principles
- **Balance**: Cool tech feel (cyan/teal) with warm organic tones (brown)
- **Hierarchy**: Clear visual hierarchy with color roles
- **Contrast**: Proper contrast ratios for accessibility
- **Minimal**: Clean, sophisticated, artistic aesthetic

## Implementation Notes
- Updated from purple theme to earth-tone palette (Aug 12, 2024)
- Brand cyan updated from #00CFFF to #00bbe4 to match logo
- Color palette professionally analyzed for harmony and balance
- Maintains triadic color relationship for visual appeal