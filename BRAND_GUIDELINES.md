# Bright Ears Brand Guidelines

## Logo
- **File**: `/public/logo.png`
- **Location**: Stored as transparent PNG
- **Usage**: Display at 40px height in header, scale appropriately for other uses

## Brand Colors

### Primary Color
- **Bright Ears Cyan**: `#00CFFF` (primary brand color)
- **CSS Class**: `bg-brightears`, `text-brightears`

### Color Palette
```css
brightears: {
  DEFAULT: '#00CFFF',  // Main brand color
  50: '#E6F9FF',       // Lightest - backgrounds
  100: '#B3F0FF',      
  200: '#80E7FF',
  300: '#4DDDFF',
  400: '#1AD4FF',
  500: '#00CFFF',      // Main
  600: '#00A8D6',      // Hover states
  700: '#0082A3',      // Dark variant
  800: '#005C73',
  900: '#003643',      // Darkest
}
```

### Secondary Colors
- **Accent Orange**: `#FF6B35` - Use sparingly for important CTAs
- **Dark Text**: `#1A1A1A` - Primary text color
- **Gray Scale**: Use Tailwind default grays

## Usage Guidelines

### Buttons
- **Primary CTA**: `bg-brightears hover:bg-brightears-600`
- **Secondary CTA**: `border-brightears text-brightears hover:bg-primary-faint`
- **Tertiary**: `bg-gray-100 text-gray-700 hover:bg-gray-200`

### Gradients
- **Hero Gradient**: `from-brightears-600 to-brightears`
- **Background Gradient**: `from-primary-faint to-brightears-100`

### Focus States
- Use `focus:ring-brightears` for all interactive elements

### Typography
- Headers: Bold, dark gray (`text-gray-900`)
- Body: Regular, medium gray (`text-gray-700`)
- Subtle: Light gray (`text-gray-500`)

## Implementation Notes
- All purple/blue colors have been replaced with Bright Ears cyan
- Hover states use darker shade (`brightears-600`)
- Light backgrounds use `primary-faint` or `brightears-50`
- Maintain high contrast for accessibility