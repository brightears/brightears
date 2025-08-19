# Bright Ears Animation Specifications
## Brand-Consistent Micro-Interactions & Animations

### Brand Animation Principles

**Professional & Premium**: Animations should feel sophisticated and trustworthy, befitting Thailand's high-end entertainment venues.

**Culturally Appropriate**: Timing and easing should feel natural to Thai users while maintaining international appeal.

**Performance-First**: All animations must maintain 60fps on mobile devices, crucial for Thai mobile-first users.

---

## 1. Brand-Specific Timing & Easing

### Core Animation Curves
```css
:root {
  /* Bright Ears Brand Easing Functions */
  --ease-premium: cubic-bezier(0.16, 1, 0.3, 1);           /* Smooth, premium feel */
  --ease-trustworthy: cubic-bezier(0.25, 0.46, 0.45, 0.94); /* Reliable, predictable */
  --ease-thai-gentle: cubic-bezier(0.23, 1, 0.32, 1);      /* Gentle, respectful */
  --ease-brand-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55); /* Subtle energy */
  
  /* Duration Standards */
  --duration-micro: 150ms;      /* Button hovers, small UI feedback */
  --duration-short: 250ms;      /* Card hovers, tooltips */
  --duration-medium: 350ms;     /* Modal entrances, page sections */
  --duration-long: 500ms;       /* Hero animations, complex transitions */
  --duration-thai-zen: 600ms;   /* For culturally appropriate slower pacing */
}
```

### Brand Color Transitions
```css
/* Color Animation Specifications */
.brand-color-transition {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-duration: var(--duration-short);
  transition-timing-function: var(--ease-premium);
}

/* Brand Cyan Hover States */
.btn-primary {
  background-color: #00bbe4;
  transition: all var(--duration-short) var(--ease-premium);
}
.btn-primary:hover {
  background-color: #009cc4;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 187, 228, 0.3);
}

/* Deep Teal Interactions */
.btn-secondary {
  background-color: #2f6364;
  transition: all var(--duration-short) var(--ease-trustworthy);
}
.btn-secondary:hover {
  background-color: #254d4e;
  box-shadow: 0 2px 8px rgba(47, 99, 100, 0.25);
}
```

---

## 2. Hero Section Animations

### Search Bar Micro-Interactions
```css
/* Enhanced Search Component Animations */
.hero-search-container {
  animation: hero-search-enter var(--duration-long) var(--ease-premium);
}

@keyframes hero-search-enter {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Search Input Focus Animation */
.hero-search-input {
  transition: all var(--duration-short) var(--ease-premium);
  transform-origin: center;
}

.hero-search-input:focus {
  transform: scale(1.02);
  box-shadow: 
    0 0 0 3px rgba(0, 187, 228, 0.1),
    0 4px 16px rgba(0, 187, 228, 0.15);
}

/* Animated Search Suggestions */
.search-suggestion {
  animation: suggestion-slide-in var(--duration-short) var(--ease-thai-gentle) both;
}

.search-suggestion:nth-child(1) { animation-delay: 50ms; }
.search-suggestion:nth-child(2) { animation-delay: 100ms; }
.search-suggestion:nth-child(3) { animation-delay: 150ms; }

@keyframes suggestion-slide-in {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Filter Expansion Animation
```css
/* Filter Panel Smooth Expansion */
.filter-panel {
  overflow: hidden;
  transition: all var(--duration-medium) var(--ease-premium);
}

.filter-panel.expanded {
  animation: filter-panel-expand var(--duration-medium) var(--ease-premium);
}

@keyframes filter-panel-expand {
  0% {
    max-height: 0;
    opacity: 0;
    transform: translateY(-10px);
  }
  50% {
    opacity: 0.5;
  }
  100% {
    max-height: 300px;
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## 3. Featured Artists Card Interactions

### Card Hover States
```css
/* Premium Card Hover Animation */
.artist-card {
  transition: all var(--duration-short) var(--ease-premium);
  transform-origin: center bottom;
}

.artist-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 
    0 8px 32px rgba(47, 99, 100, 0.15),
    0 0 0 1px rgba(0, 187, 228, 0.1);
}

/* Image Overlay Animation */
.artist-card .image-overlay {
  opacity: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(47, 99, 100, 0.8) 100%);
  transition: opacity var(--duration-short) var(--ease-premium);
}

.artist-card:hover .image-overlay {
  opacity: 1;
}

/* Quick Book Button Reveal */
.artist-card .quick-book-btn {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
  transition: all var(--duration-short) var(--ease-brand-bounce);
}

.artist-card:hover .quick-book-btn {
  opacity: 1;
  transform: translateY(0) scale(1);
  transition-delay: 100ms;
}
```

### Staggered Card Entrance
```css
/* Staggered Animation for Artist Grid */
.artist-grid .artist-card {
  animation: card-entrance var(--duration-thai-zen) var(--ease-premium) both;
}

.artist-grid .artist-card:nth-child(1) { animation-delay: 0ms; }
.artist-grid .artist-card:nth-child(2) { animation-delay: 100ms; }
.artist-grid .artist-card:nth-child(3) { animation-delay: 200ms; }
.artist-grid .artist-card:nth-child(4) { animation-delay: 300ms; }
.artist-grid .artist-card:nth-child(5) { animation-delay: 400ms; }
.artist-grid .artist-card:nth-child(6) { animation-delay: 500ms; }

@keyframes card-entrance {
  0% {
    opacity: 0;
    transform: translateY(40px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
```

---

## 4. Activity Feed Real-Time Animations

### Living Indicators
```css
/* Real-Time Activity Pulse */
.activity-live-indicator {
  animation: live-pulse 2s var(--ease-premium) infinite;
}

@keyframes live-pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

/* New Activity Item Animation */
.activity-item {
  animation: activity-slide-in var(--duration-medium) var(--ease-thai-gentle) both;
}

@keyframes activity-slide-in {
  0% {
    opacity: 0;
    transform: translateX(-20px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

/* Activity Icon Animations */
.activity-icon {
  transition: all var(--duration-micro) var(--ease-premium);
}

.activity-item:hover .activity-icon {
  transform: scale(1.1) rotate(5deg);
}
```

### Stats Counter Animation
```css
/* Counting Animation for Statistics */
.stats-counter {
  animation: count-up var(--duration-long) var(--ease-trustworthy);
}

@keyframes count-up {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
```

---

## 5. Scroll-Triggered Animations

### Section Reveal Animation
```css
/* Intersection Observer Triggered Animations */
.scroll-reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: all var(--duration-thai-zen) var(--ease-premium);
}

.scroll-reveal.revealed {
  opacity: 1;
  transform: translateY(0);
}

/* Brand-specific scroll effects */
.scroll-reveal-title {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
  transition: all var(--duration-medium) var(--ease-premium);
}

.scroll-reveal-title.revealed {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* Content blocks with staggered reveal */
.scroll-reveal-content {
  opacity: 0;
  transform: translateY(25px);
  transition: all var(--duration-medium) var(--ease-thai-gentle);
}

.scroll-reveal-content.revealed {
  opacity: 1;
  transform: translateY(0);
}
```

---

## 6. Category Selection Interactions

### Interactive Category Pills
```css
/* Category Button Animation */
.category-pill {
  transition: all var(--duration-short) var(--ease-premium);
  position: relative;
  overflow: hidden;
}

.category-pill::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 187, 228, 0.2), transparent);
  transition: left var(--duration-medium) var(--ease-premium);
}

.category-pill:hover::before {
  left: 100%;
}

.category-pill:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 187, 228, 0.25);
}

/* Active Category State */
.category-pill.active {
  background-color: #00bbe4;
  color: white;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 187, 228, 0.4);
}
```

---

## 7. Modal & Booking Animations

### Quick Booking Modal
```css
/* Modal Entrance */
.modal-backdrop {
  animation: backdrop-fade-in var(--duration-short) var(--ease-premium);
}

@keyframes backdrop-fade-in {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

.modal-content {
  animation: modal-slide-up var(--duration-medium) var(--ease-brand-bounce);
}

@keyframes modal-slide-up {
  0% {
    opacity: 0;
    transform: translateY(50px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Progress Bar Animation */
.booking-progress {
  transition: width var(--duration-medium) var(--ease-premium);
}

/* Step Transition */
.booking-step {
  animation: step-transition var(--duration-short) var(--ease-thai-gentle);
}

@keyframes step-transition {
  0% {
    opacity: 0;
    transform: translateX(20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
```

---

## 8. Loading States

### Brand-Consistent Spinners
```css
/* Primary Loading Spinner */
.loader-primary {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 187, 228, 0.2);
  border-top: 3px solid #00bbe4;
  border-radius: 50%;
  animation: loader-spin 1s var(--ease-premium) infinite;
}

@keyframes loader-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Skeleton Loading Animation */
.skeleton {
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Thai-Cultural Loading Pattern */
.loader-thai-pattern {
  position: relative;
  width: 50px;
  height: 50px;
}

.loader-thai-pattern::before,
.loader-thai-pattern::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  border: 2px solid transparent;
  border-top-color: #00bbe4;
  animation: thai-loader 1.2s var(--ease-thai-gentle) infinite;
}

.loader-thai-pattern::before {
  width: 50px;
  height: 50px;
}

.loader-thai-pattern::after {
  width: 30px;
  height: 30px;
  top: 10px;
  left: 10px;
  animation-duration: 0.8s;
  animation-direction: reverse;
}

@keyframes thai-loader {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

---

## 9. Mobile-Specific Animations

### Touch Feedback
```css
/* Mobile Touch Response */
.touch-feedback {
  position: relative;
  overflow: hidden;
}

.touch-feedback::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(0, 187, 228, 0.3);
  transform: translate(-50%, -50%);
  transition: width var(--duration-short) var(--ease-premium),
              height var(--duration-short) var(--ease-premium);
}

.touch-feedback:active::before {
  width: 200px;
  height: 200px;
}

/* Swipe Indicators */
.swipe-indicator {
  animation: swipe-hint 2s var(--ease-thai-gentle) infinite;
}

@keyframes swipe-hint {
  0%, 100% { transform: translateX(0); opacity: 1; }
  50% { transform: translateX(10px); opacity: 0.7; }
}
```

---

## 10. Accessibility Considerations

### Reduced Motion Support
```css
/* Respect user preferences for reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  /* Keep essential loading indicators */
  .loader-primary,
  .loading-spinner {
    animation: none;
    border-top-color: #00bbe4;
  }
  
  /* Maintain accessibility feedback */
  .focus-indicator {
    outline: 2px solid #00bbe4;
    outline-offset: 2px;
  }
}
```

### High Contrast Mode
```css
/* High contrast mode support */
@media (prefers-contrast: high) {
  .brand-color-transition {
    border: 2px solid;
  }
  
  .artist-card:hover {
    border-color: #00bbe4;
    box-shadow: none;
  }
}
```

---

## 11. Performance Optimization

### GPU Acceleration
```css
/* Optimize animations for mobile performance */
.will-animate {
  will-change: transform, opacity;
}

.performance-optimized {
  transform: translateZ(0); /* Force GPU acceleration */
  backface-visibility: hidden;
}

/* Remove will-change after animation */
.animation-complete {
  will-change: auto;
}
```

---

## Implementation Notes

### 1. **Consistency Requirements**
- All animations must use the defined brand easing curves
- Color transitions must follow the brand palette exactly
- Timing should respect Thai cultural preferences for gentler pacing

### 2. **Performance Standards**
- Maximum 60fps on Thai mobile devices
- Animations must degrade gracefully on slower connections
- Use CSS transforms and opacity for best performance

### 3. **Cultural Sensitivity**
- Avoid overly aggressive or flashy animations
- Maintain professional, trustworthy feel
- Consider Buddhist cultural values of moderation

### 4. **Testing Requirements**
- Test on common Thai mobile devices
- Verify accessibility compliance
- Check performance on 3G connections

This specification ensures all animations maintain Bright Ears' premium, trustworthy brand while providing excellent user experience for both Thai and international users.