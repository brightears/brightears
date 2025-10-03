# Mobile Testing Checklist
**Bright Ears Entertainment Booking Platform**

**Version:** 1.0
**Last Updated:** October 3, 2025
**Platform:** brightears.onrender.com

---

## Testing Device Categories

### 📱 **Target Devices for Testing**

#### Priority 1: Thai Market Devices (Most Common)
- [ ] **iPhone 12/13 (390x844)** - 25% market share in Thailand
- [ ] **Samsung Galaxy A52 (412x915)** - 20% market share
- [ ] **iPhone 14 Pro (393x852)** - Growing adoption
- [ ] **Xiaomi Redmi Note 11 (393x851)** - Budget segment leader
- [ ] **OPPO A77 (360x780)** - Popular in Thailand

#### Priority 2: Edge Cases
- [ ] **iPhone SE (375x667)** - Smallest modern iPhone
- [ ] **Galaxy S23 Ultra (412x915)** - Large Android flagship
- [ ] **iPad Mini 6 (744x1133)** - Small tablet
- [ ] **iPad Air (820x1180)** - Standard tablet

#### Priority 3: Legacy Support
- [ ] **iPhone 8 (375x667)** - Still in use
- [ ] **iPhone X (375x812)** - Common used device
- [ ] **Generic Android (360x640)** - Entry-level devices

---

## Screen Size Categories

### 📐 **Viewport Breakpoints to Test**

| Category | Width | Devices | Priority |
|----------|-------|---------|----------|
| **Extra Small** | 320px | iPhone SE (old), small Android | Medium |
| **Small Phone** | 375px | iPhone 8, iPhone SE 2022 | High |
| **Standard Phone** | 390-414px | iPhone 12-14, most Android | Critical |
| **Large Phone** | 428-430px | iPhone 14 Plus/Pro Max | High |
| **Small Tablet** | 768px | iPad Mini, Android tablets | Medium |
| **Large Tablet** | 1024px+ | iPad Pro, large tablets | Low |

### Testing Commands (Chrome DevTools)
```javascript
// Set custom viewport widths
// 320px - Smallest
// 375px - iPhone SE
// 390px - iPhone 12/13
// 393px - iPhone 14 Pro
// 414px - iPhone Plus series
// 430px - iPhone 14 Pro Max
// 768px - iPad Mini
// 1024px - iPad Pro
```

---

## Browser Testing Requirements

### 🌐 **Target Browsers**

#### iOS (Safari)
- [ ] **Safari iOS 16** (iPhone 12/13)
- [ ] **Safari iOS 17** (iPhone 14/15)
- [ ] **Safari iOS 15** (Legacy support)

**Known iOS Safari Issues to Test:**
- [ ] Input focus zoom (font-size < 16px)
- [ ] Bottom bar overlap (safe-area-inset-bottom)
- [ ] Backdrop-filter support
- [ ] Fixed position behavior with keyboard
- [ ] Date picker behavior

#### Android (Chrome)
- [ ] **Chrome 118+** (Latest)
- [ ] **Chrome 110-117** (Recent versions)
- [ ] **Samsung Internet** (Popular in Thailand)
- [ ] **Firefox Mobile** (Secondary)

**Known Android Issues to Test:**
- [ ] Keyboard overlap behavior
- [ ] System back button interaction
- [ ] Touch target size variance
- [ ] Font rendering differences

---

## Feature-by-Feature Testing

### 1. Landing Page (`/`)

#### Hero Section
- [ ] **Viewport 320px**
  - [ ] Heading text doesn't break awkwardly
  - [ ] CTA buttons stack vertically
  - [ ] No horizontal scroll
  - [ ] Badge fits on screen

- [ ] **Viewport 375px**
  - [ ] Stats cards display properly (3 columns)
  - [ ] Gradient background renders smoothly
  - [ ] Scroll indicator visible

- [ ] **Viewport 768px**
  - [ ] Stats cards properly spaced
  - [ ] Text size scales appropriately
  - [ ] Animations perform smoothly

#### Interactive Elements
- [ ] "Find Entertainment Now" button (44x44px minimum)
- [ ] "How It Works" button (44x44px minimum)
- [ ] Language selector touch target
- [ ] Mobile menu hamburger (44x44px minimum)

#### Performance
- [ ] Page loads under 3 seconds on 3G
- [ ] Gradient animations don't lag
- [ ] No layout shift on font load
- [ ] Images load progressively

---

### 2. Artist Listing Page (`/artists`)

#### Filter System
- [ ] **Mobile Filter Button**
  - [ ] Touch target minimum 44x44px
  - [ ] Icon clearly visible
  - [ ] Tap response immediate

- [ ] **Filter Drawer**
  - [ ] Opens smoothly from left
  - [ ] Backdrop blur renders correctly
  - [ ] Close button accessible (44x44px)
  - [ ] Scrollable when content exceeds screen
  - [ ] Doesn't exceed viewport width (320px test)

- [ ] **Filter Options**
  - [ ] Checkboxes touchable (44x44px)
  - [ ] Select dropdowns open properly
  - [ ] Price inputs don't zoom on focus (iOS)
  - [ ] Clear All button accessible

#### Artist Cards
- [ ] **Card Grid**
  - [ ] 1 column on mobile (< 768px)
  - [ ] 2 columns on tablet (768-1024px)
  - [ ] 3 columns on desktop (> 1024px)
  - [ ] Proper gap spacing (16px minimum)

- [ ] **Card Elements**
  - [ ] Featured badge doesn't overlap
  - [ ] Artist image scales properly
  - [ ] "View Profile" indicator shows on tap
  - [ ] Play button (44x44px touch target)
  - [ ] Favorite button (44x44px touch target)
  - [ ] "Get Quote" button (44x44px touch target)
  - [ ] Rating stars readable
  - [ ] Hourly rate clearly visible

#### Search & Sort
- [ ] Search bar full width on mobile
- [ ] Sort dropdown accessible
- [ ] Results count readable
- [ ] Pagination buttons (44x44px)

---

### 3. Artist Profile Page (`/artists/[id]`)

#### Hero Section
- [ ] **Profile Header**
  - [ ] Hero height adapts (320px: min-height, 768px: fixed)
  - [ ] Profile image displays properly
  - [ ] Verification badge visible
  - [ ] Artist name doesn't overflow
  - [ ] Category badge readable
  - [ ] Rating stars properly sized

- [ ] **Quick Stats (Desktop Only)**
  - [ ] Hidden on mobile (< 1024px)
  - [ ] Shows on desktop (> 1024px)

#### Sticky Action Bar
- [ ] Sticks to top on scroll
- [ ] Doesn't overlap header
- [ ] Price clearly visible
- [ ] "Get Quote" button accessible (44x44px)
- [ ] LINE button accessible (44x44px)
- [ ] Favorite button accessible (44x44px)
- [ ] Share button accessible (44x44px)
- [ ] Buttons don't overlap on narrow screens

#### Content Tabs
- [ ] Tab labels readable
- [ ] Swipe gesture works (if implemented)
- [ ] Content scrolls within viewport
- [ ] Media gallery functional
- [ ] Package cards display properly

---

### 4. Quick Inquiry Modal

#### Modal Behavior
- [ ] **Open/Close**
  - [ ] Opens centered on screen
  - [ ] Backdrop visible and tappable
  - [ ] Close button accessible (44x44px)
  - [ ] ESC key closes modal
  - [ ] Prevents body scroll when open

- [ ] **Content Area**
  - [ ] Header gradient renders properly
  - [ ] Artist image visible
  - [ ] Modal doesn't exceed viewport height
  - [ ] Scrollable when content overflows
  - [ ] Safe area insets respected (iOS)

#### Form Fields
- [ ] **Name Input**
  - [ ] Font size 16px+ (no iOS zoom)
  - [ ] Touch target height 44px+
  - [ ] Focus state visible
  - [ ] Placeholder readable

- [ ] **Contact Method Buttons**
  - [ ] Phone/LINE buttons (44x44px each)
  - [ ] Active state clearly indicated
  - [ ] Touch response immediate
  - [ ] Spacing adequate (16px gap)

- [ ] **Phone/LINE Input**
  - [ ] Keyboard type correct (tel/text)
  - [ ] Font size 16px+
  - [ ] No zoom on focus
  - [ ] Helper text readable

- [ ] **Event Date**
  - [ ] Calendar icon visible
  - [ ] Date picker opens properly
  - [ ] Min date validation works
  - [ ] Selected date displays clearly

- [ ] **Event Type Dropdown**
  - [ ] Options readable
  - [ ] Selection clear
  - [ ] Dropdown doesn't overflow screen

- [ ] **Message Textarea**
  - [ ] Resizable on tablet+
  - [ ] Fixed on mobile
  - [ ] 3 rows visible
  - [ ] No zoom on focus

#### Submit Flow
- [ ] Submit button (44px height minimum)
- [ ] Loading state visible
- [ ] Error messages readable
- [ ] Success confirmation clear
- [ ] Booking ID displayed

---

### 5. Navigation & Header

#### Mobile Menu
- [ ] **Hamburger Menu**
  - [ ] Touch target 44x44px
  - [ ] Opens from right smoothly
  - [ ] Backdrop blur works
  - [ ] Menu width appropriate (< 90vw)
  - [ ] Close on backdrop tap
  - [ ] Close on X button (44x44px)

- [ ] **Menu Items**
  - [ ] All links tappable (44px height)
  - [ ] Active state visible
  - [ ] Stagger animation smooth
  - [ ] CTA buttons prominent
  - [ ] "For Artists" link clear

#### Language Selector
- [ ] Button accessible (44x44px)
- [ ] Current language visible
- [ ] Dropdown doesn't overflow screen
- [ ] Language options tappable (44px height)
- [ ] Selection updates immediately

#### Scroll Behavior
- [ ] Header becomes sticky on scroll
- [ ] Background blur activates
- [ ] Border appears
- [ ] Logo remains visible
- [ ] No jump/shift on scroll

---

### 6. Forms & Input Behavior

#### General Input Testing
- [ ] **Focus Behavior (iOS)**
  - [ ] Font size 16px minimum
  - [ ] No zoom on focus
  - [ ] Keyboard pushes content up
  - [ ] Field remains visible with keyboard
  - [ ] Keyboard dismisses properly

- [ ] **Input Types**
  - [ ] `type="tel"` for phone numbers
  - [ ] `type="email"` for emails
  - [ ] `type="date"` for dates
  - [ ] `type="text"` for general input

- [ ] **Validation**
  - [ ] Error messages visible
  - [ ] Error states clear (red border)
  - [ ] Success states clear (green indicator)
  - [ ] Required fields marked

#### Touch Interaction
- [ ] Input padding adequate (12px+)
- [ ] Tap target height 44px+
- [ ] Clear button accessible (if present)
- [ ] Autocomplete suggestions tappable

---

### 7. Images & Media

#### Image Loading
- [ ] **Artist Profile Images**
  - [ ] Loads without layout shift
  - [ ] Proper aspect ratio maintained
  - [ ] Lazy loading works
  - [ ] Fallback image shows on error

- [ ] **Artist Card Images**
  - [ ] Scales with container
  - [ ] Object-fit: cover works
  - [ ] Hover effects smooth (if applicable on touch)
  - [ ] No pixelation on retina screens

- [ ] **Gallery/Carousel**
  - [ ] Swipe gesture works
  - [ ] Indicators visible
  - [ ] Full-screen mode accessible
  - [ ] Close button reachable (44x44px)

#### Responsive Images
- [ ] Appropriate size serves to mobile
- [ ] WebP format supported (fallback)
- [ ] Loading="lazy" implemented
- [ ] Srcset defined for different densities

---

### 8. Typography & Readability

#### Font Sizes
- [ ] **Body Text**
  - [ ] Minimum 16px on mobile
  - [ ] Line height 1.5+ for readability
  - [ ] Color contrast 4.5:1 minimum

- [ ] **Headings**
  - [ ] H1: 2rem (32px) on mobile
  - [ ] H2: 1.5rem (24px) on mobile
  - [ ] H3: 1.25rem (20px) on mobile
  - [ ] Scales up on larger screens

- [ ] **Small Text**
  - [ ] Minimum 14px (not 12px)
  - [ ] Used sparingly
  - [ ] High contrast

#### Thai Language
- [ ] Noto Sans Thai loads correctly
- [ ] Thai characters don't break
- [ ] Line height appropriate
- [ ] No font fallback issues
- [ ] Mixed EN/TH renders properly

---

### 9. Touch Interactions

#### Touch Target Checklist
- [ ] **Minimum 44x44px**
  - [ ] All buttons
  - [ ] All links
  - [ ] Checkbox/radio inputs
  - [ ] Icon buttons
  - [ ] Navigation items

- [ ] **Spacing**
  - [ ] 8px minimum between targets
  - [ ] 16px for critical actions
  - [ ] No overlapping touch areas

- [ ] **Feedback**
  - [ ] Active state on tap
  - [ ] Hover states (if applicable)
  - [ ] Loading states visible
  - [ ] Disabled states clear

#### Gesture Support
- [ ] Tap (single touch)
- [ ] Double tap (zoom, if needed)
- [ ] Swipe (carousels, drawers)
- [ ] Pinch zoom (disabled on UI, enabled on images)
- [ ] Long press (contextual menus, if any)

---

### 10. Performance Testing

#### Load Performance
- [ ] **First Contentful Paint**
  - [ ] < 1.5s on 4G
  - [ ] < 3s on 3G
  - [ ] < 5s on 2G

- [ ] **Time to Interactive**
  - [ ] < 3s on 4G
  - [ ] < 5s on 3G

- [ ] **Largest Contentful Paint**
  - [ ] < 2.5s on 4G
  - [ ] < 4s on 3G

#### Runtime Performance
- [ ] Animations at 60fps
- [ ] No jank on scroll
- [ ] Smooth filter drawer open/close
- [ ] Modal animations smooth
- [ ] Gradient backgrounds performant
- [ ] Backdrop blur doesn't lag

#### Resource Usage
- [ ] Images optimized (WebP)
- [ ] Fonts subset to needed glyphs
- [ ] JavaScript bundle < 200KB
- [ ] CSS bundle < 50KB
- [ ] Total page size < 1MB

---

### 11. Accessibility on Mobile

#### Screen Reader Testing
- [ ] **iOS VoiceOver**
  - [ ] All interactive elements labeled
  - [ ] Headings announced properly
  - [ ] Forms navigable
  - [ ] Error messages announced

- [ ] **Android TalkBack**
  - [ ] Similar to VoiceOver
  - [ ] Touch exploration works
  - [ ] Swipe navigation functional

#### Keyboard Navigation (Tablet)
- [ ] Tab order logical
- [ ] Focus visible
- [ ] Skip links available
- [ ] Modal trap focus

#### Visual Accessibility
- [ ] Color contrast ratio 4.5:1
- [ ] No color-only indicators
- [ ] Text scalable (zoom to 200%)
- [ ] Touch targets clear

---

### 12. Edge Cases & Error Handling

#### Network Conditions
- [ ] **Offline**
  - [ ] Graceful error message
  - [ ] Retry mechanism
  - [ ] Cached content displays

- [ ] **Slow Connection**
  - [ ] Loading states visible
  - [ ] Progressive enhancement
  - [ ] Timeout handling

- [ ] **Failed Requests**
  - [ ] Clear error messages
  - [ ] Retry button accessible
  - [ ] No broken UI

#### Content Edge Cases
- [ ] **Long Artist Names**
  - [ ] Truncate with ellipsis
  - [ ] No overflow
  - [ ] Full name on tap/hover

- [ ] **Missing Images**
  - [ ] Placeholder displays
  - [ ] Initials fallback
  - [ ] No broken image icon

- [ ] **Empty States**
  - [ ] "No artists found" clear
  - [ ] Search tips visible
  - [ ] CTA to browse all

---

## Thai Market Specific Testing

### LINE Integration
- [ ] LINE button displays correctly
- [ ] LINE icon renders properly
- [ ] LINE ID shown (@brightears)
- [ ] Deep link works (opens LINE app)
- [ ] Fallback for LINE not installed

### PromptPay Integration
- [ ] QR code minimum 200x200px
- [ ] QR code centered on screen
- [ ] Clear instructions visible
- [ ] Screenshot hint provided
- [ ] Amount clearly displayed

### Language & Localization
- [ ] EN/TH toggle works
- [ ] Thai fonts load correctly
- [ ] Numbers format correctly (Thai uses Arabic numerals)
- [ ] Currency displays as ฿ (Baht)
- [ ] Date format appropriate (Buddhist calendar option)

### Cultural Considerations
- [ ] Buddhist holiday awareness (calendar)
- [ ] Wai/polite language in Thai
- [ ] Local payment methods prominent
- [ ] Thai phone number format (0X-XXX-XXXX)

---

## Testing Tools & Setup

### Browser DevTools
```javascript
// Chrome DevTools Device Emulation
// 1. Open DevTools (F12)
// 2. Click Device Toolbar (Ctrl+Shift+M)
// 3. Select device or set custom dimensions
// 4. Test touch events (enable touch simulation)
```

### Network Throttling
```javascript
// Chrome DevTools Network Tab
// Presets:
// - Fast 3G (1.6 Mbps down, 750 Kbps up)
// - Slow 3G (400 Kbps down, 400 Kbps up)
// - Offline
```

### Lighthouse Mobile Audit
```bash
# Run from command line
npx lighthouse https://brightears.onrender.com \
  --emulated-form-factor=mobile \
  --throttling-method=simulate \
  --output=html \
  --output-path=./lighthouse-mobile-report.html
```

### Real Device Testing
- [ ] BrowserStack (cloud devices)
- [ ] Firebase Test Lab (Android)
- [ ] Physical devices (priority devices from list)

---

## Test Report Template

### Device: [Device Name]
**OS Version:** [iOS/Android Version]
**Browser:** [Safari/Chrome/etc]
**Screen Size:** [Width x Height]
**Date:** [Test Date]

#### ✅ Passed Tests
- List all passed tests

#### ❌ Failed Tests
- [ ] **Issue:** [Description]
  - **Severity:** Critical/High/Medium/Low
  - **Steps to Reproduce:**
    1. Step 1
    2. Step 2
  - **Expected:** [Expected behavior]
  - **Actual:** [Actual behavior]
  - **Screenshot:** [Link/attachment]

#### 📝 Notes
- Additional observations
- Performance notes
- Suggestions

---

## Sign-off Checklist

### Before Production Release
- [ ] All critical issues resolved
- [ ] High priority issues resolved or documented
- [ ] Medium issues triaged
- [ ] Performance benchmarks met
- [ ] Accessibility standards met (WCAG 2.1 AA)
- [ ] Thai market features verified
- [ ] Cross-browser testing complete
- [ ] Real device testing complete
- [ ] Stakeholder approval obtained

### Regression Testing (After Updates)
- [ ] Run full checklist on changed features
- [ ] Smoke test all major flows
- [ ] Verify no new issues introduced
- [ ] Performance regression check

---

## Quick Mobile Test (15 minutes)

**Priority smoke test for rapid iteration:**

1. **Homepage** (2 min)
   - [ ] Loads without errors
   - [ ] Hero CTA works
   - [ ] Mobile menu opens

2. **Artist Listing** (3 min)
   - [ ] Cards display properly
   - [ ] Filter drawer opens
   - [ ] Search works

3. **Artist Profile** (3 min)
   - [ ] Page loads
   - [ ] Get Quote button works
   - [ ] Sticky bar functions

4. **Quick Inquiry** (3 min)
   - [ ] Modal opens
   - [ ] Form submits
   - [ ] Success message shows

5. **Navigation** (2 min)
   - [ ] All main links work
   - [ ] Language toggle works
   - [ ] No console errors

6. **Performance** (2 min)
   - [ ] Pages load quickly
   - [ ] Animations smooth
   - [ ] No visible lag

---

## Resources

### Testing Documentation
- [Chrome DevTools Device Mode](https://developer.chrome.com/docs/devtools/device-mode/)
- [Firefox Responsive Design Mode](https://firefox-source-docs.mozilla.org/devtools-user/responsive_design_mode/)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Material Design Touch Targets](https://material.io/design/usability/accessibility.html#layout-and-typography)

### Performance Tools
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [WebPageTest Mobile Testing](https://www.webpagetest.org/)
- [PageSpeed Insights](https://pagespeed.web.dev/)

### Accessibility Tools
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [Color Contrast Analyzer](https://www.tpgi.com/color-contrast-checker/)

---

**Version History:**
- v1.0 (Oct 3, 2025) - Initial comprehensive checklist
