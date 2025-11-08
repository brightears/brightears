# LINE Contact Button - Visual Location Guide

Quick reference guide showing exactly where LINE contact buttons appear on the Bright Ears platform.

---

## 1. Homepage Hero Section

**URL:** `/` or `/en` or `/th`
**Component:** `components/home/Hero.tsx`
**Position:** Center of hero section, third button in CTA group

```
┌─────────────────────────────────────────┐
│     BRIGHT EARS HOMEPAGE HERO           │
├─────────────────────────────────────────┤
│                                         │
│    Deliver Unforgettable Guest          │
│    Experiences, Every Time               │
│                                         │
│    [See Who's Available]                │
│    [Contact on LINE] ← HERE             │
│    [How It Works]                       │
│                                         │
└─────────────────────────────────────────┘
```

**Button Style:** Primary (Green #00B900)
**Message:** "Hi Bright Ears! I'm interested in booking entertainment for my event."

---

## 2. Browse Artists Page

**URL:** `/artists` or `/en/artists` or `/th/artists`
**Component:** `components/content/ArtistsPageContent.tsx`
**Position:** Hero section, below subtitle

```
┌─────────────────────────────────────────┐
│    BROWSE ARTISTS PAGE HERO             │
├─────────────────────────────────────────┤
│                                         │
│    Browse 500+ Verified Artists         │
│    Find Your Perfect Match              │
│                                         │
│    Access Thailand's largest network... │
│                                         │
│    [Inquire on LINE] ← HERE             │
│                                         │
└─────────────────────────────────────────┘
```

**Button Style:** Secondary (Outlined, glass morphism)
**Message:** "Hi! I'd like to inquire about booking an artist."

---

## 3. Artist Profile Pages

**URL:** `/artists/[id]` (e.g., `/artists/temple-bass`)
**Component:** `components/artists/EnhancedArtistProfile.tsx`
**Position:** Action buttons section, next to "Get Quote"

```
┌─────────────────────────────────────────┐
│    ARTIST PROFILE - TEMPLE BASS         │
├─────────────────────────────────────────┤
│                                         │
│    [Artist Photo]                       │
│    Temple Bass                          │
│    DJ • Bangkok • ฿12,000/hr            │
│                                         │
│    [Get Quote] [Contact on LINE] ← HERE │
│    [♥ Favorite] [Share]                 │
│                                         │
└─────────────────────────────────────────┘
```

**Button Style:** Primary (Green #00B900)
**Message:** "Hi! I'm interested in booking {artistName} for my event."
**Note:** `{artistName}` is automatically replaced with actual artist name

---

## 4. Contact Page

**URL:** `/contact` or `/en/contact` or `/th/contact`
**Component:** `app/[locale]/contact/ContactContent.tsx`
**Position:** Hero section, prominent position below subtitle

```
┌─────────────────────────────────────────┐
│    CONTACT US PAGE                      │
├─────────────────────────────────────────┤
│                                         │
│    Contact Bright Ears                  │
│    Get Help & Support                   │
│                                         │
│    [Contact on LINE] ← HERE (prominent) │
│                                         │
│    [Email] [LINE] [Hours] [Location]    │
│                                         │
└─────────────────────────────────────────┘
```

**Button Style:** Primary (Green #00B900)
**Message:** "Hi! I have a question about booking."

---

## 5. Footer (Two Positions)

**URL:** Every page (global footer)
**Component:** `components/layout/Footer.tsx`
**Positions:** Contact info section + Social media section

### Position A: Contact Information
```
┌─────────────────────────────────────────┐
│    FOOTER - CONTACT INFO                │
├─────────────────────────────────────────┤
│    Contact                              │
│    📧 hello@brightears.co               │
│    📞 +66 2 123 4567                    │
│    📍 Bangkok, Thailand                 │
│    💬 LINE Official Account ← HERE      │
│       @brightears (in green)            │
└─────────────────────────────────────────┘
```

**Style:** Static display with LINE green text
**Interactive:** No (just displays LINE ID)

### Position B: Social Media Icons
```
┌─────────────────────────────────────────┐
│    FOOTER - SOCIAL MEDIA                │
├─────────────────────────────────────────┤
│    Follow Us                            │
│    [f] [📷] [LINE] ← HERE (icon-only)  │
│     ↑    ↑     ↑                        │
│    FB   IG   LINE button                │
└─────────────────────────────────────────┘
```

**Button Style:** Icon-only (circular green button)
**Interactive:** Yes (opens LINE app)

---

## Button Variants Summary

### Primary Variant
- **Color:** LINE Green (#00B900)
- **Style:** Solid background, white text
- **Shadow:** Elevated with glow effect
- **Locations:** Homepage, Artist Profile, Contact Page

### Secondary Variant
- **Color:** LINE Green (#00B900) border
- **Style:** Transparent/glass background, green text
- **Shadow:** Subtle elevation
- **Locations:** Browse Artists Page

### Icon-Only Variant
- **Color:** LINE Green (#00B900)
- **Style:** Circular button with LINE logo
- **Size:** 48px diameter
- **Locations:** Footer social media section

---

## Mobile Responsive Behavior

### Desktop (1024px+)
```
All buttons display with full text
Icon + "Contact on LINE" text visible
Buttons side-by-side in button groups
```

### Tablet (768px - 1023px)
```
Buttons stack vertically in some sections
Full width on Contact page
Icon + text still visible
```

### Mobile (< 768px)
```
All buttons full width
Stacked vertically
Icon + text visible
Larger touch targets (min 44px height)
```

---

## Color Reference

### LINE Brand Green
```css
Primary:     #00B900
Hover:       #009900
Shadow:      rgba(0, 185, 0, 0.25)
Text on bg:  #FFFFFF (white)
```

### Glass Morphism (Browse Artists)
```css
Background:  rgba(255, 255, 255, 0.1)
Backdrop:    blur(12px)
Border:      2px solid rgba(255, 255, 255, 0.2)
Hover:       rgba(255, 255, 255, 0.2)
```

---

## User Journey Examples

### Journey 1: General Inquiry from Homepage
```
1. Land on homepage
2. See hero section with 3 CTAs
3. Click [Contact on LINE]
4. LINE opens with message:
   "Hi Bright Ears! I'm interested in booking entertainment for my event."
5. User sends message → Bright Ears responds
```

### Journey 2: Artist-Specific Inquiry
```
1. Browse artists page
2. Click on artist (e.g., Temple Bass)
3. View artist profile
4. Click [Contact on LINE] near "Get Quote"
5. LINE opens with message:
   "Hi! I'm interested in booking Temple Bass for my event."
6. User sends → Bright Ears can track artist interest
```

### Journey 3: Quick Question from Contact Page
```
1. Navigate to /contact page
2. See prominent [Contact on LINE] button
3. Click button
4. LINE opens with message:
   "Hi! I have a question about booking."
5. User asks question → Fast 2-hour response
```

### Journey 4: Social Media Discovery
```
1. Scroll to footer on any page
2. See social media icons
3. Click LINE icon (green circular button)
4. LINE opens to @brightears chat
5. User starts conversation
```

---

## Testing Quick Reference

### Visual QA Checklist
```
Homepage:
□ Hero section has green LINE button (3rd button)
□ Button shows icon + "Contact on LINE" text
□ Hover shows darker green

Browse Artists:
□ Hero section has outlined LINE button
□ Glass morphism effect visible
□ Button below subtitle, centered

Artist Profile:
□ LINE button next to "Get Quote"
□ Artist name in message when clicked

Contact Page:
□ Prominent LINE button in hero
□ Positioned above contact grid

Footer:
□ LINE ID displayed in contact section
□ Green LINE icon in social media section
□ Icon-only button is clickable
```

### Functional Testing
```
All Locations:
□ Clicking opens LINE app on mobile
□ Clicking opens LINE web on desktop
□ Pre-filled messages appear correctly
□ Artist names substituted on profile pages
□ Both EN and TH translations work
```

---

## Quick Access URLs (Development)

```bash
# Homepage
http://localhost:3000/

# Browse Artists
http://localhost:3000/artists

# Artist Profile (example)
http://localhost:3000/artists/temple-bass

# Contact Page
http://localhost:3000/contact

# Thai versions (add /th prefix)
http://localhost:3000/th/artists
```

---

## Quick Access URLs (Production)

```bash
# Homepage
https://brightears.onrender.com/

# Browse Artists
https://brightears.onrender.com/artists

# Contact Page
https://brightears.onrender.com/contact

# Thai versions
https://brightears.onrender.com/th/artists
```

---

This visual guide helps quickly locate and verify all LINE contact button integrations across the platform.
