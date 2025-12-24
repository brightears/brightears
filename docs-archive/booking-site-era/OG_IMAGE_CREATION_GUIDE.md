# OG Image Creation Guide
**Quick Manual Creation for Social Media Preview Images**

## Overview
We need 8 OG (Open Graph) images for social media sharing. These images appear when someone shares our pages on Facebook, Twitter, LinkedIn, etc.

## Specifications
- **Dimensions:** 1200 x 630 pixels (required)
- **File Format:** JPG (best compatibility)
- **File Size:** < 100KB per image (for fast loading)
- **Quality:** 85% JPG compression

---

## Method 1: Canva (Recommended - Easiest)

### Setup:
1. Go to https://www.canva.com/
2. Create account (free tier is fine)
3. Click "Custom size" → Enter 1200 x 630 px

### Design Template:

#### Background:
- Use gradient: Deep Teal (#2f6364) → Brand Cyan (#00bbe4) → Deep Teal (#2f6364)
- Angle: 135 degrees (diagonal)
- Add subtle shapes/circles with blur for depth

#### Logo:
- Add Bright Ears logo (from `/public/logo.png`)
- Position: Top-center or center
- Size: ~200px wide

#### Text Layout:
1. **Title** (Main headline)
   - Font: Playfair Display Bold
   - Size: 60-72pt
   - Color: White (#ffffff)
   - Position: Center
   - Add subtle shadow for depth

2. **Subtitle** (Supporting text)
   - Font: Inter Regular
   - Size: 24-32pt
   - Color: White 95% opacity
   - Position: Below title
   - Add subtle shadow

3. **Badge/URL** (Optional)
   - Text: "brightears.onrender.com"
   - Background: Brand Cyan (#00bbe4) with rounded corners
   - Font: Inter Bold, 20pt, White
   - Position: Bottom or below subtitle

#### Decorative Elements:
- Add 1-2 music note symbols (♪ ♫) at ~120pt, 10% white opacity
- Add floating circles/orbs with blur effect (optional)

### Export:
1. Download → JPG
2. Quality: 85-90%
3. If > 100KB, compress at https://tinypng.com/

---

## Method 2: Figma (For Designers)

### Setup:
1. Create new file
2. Add frame: 1200 x 630 px
3. Name: "OG Image - [Page Name]"

### Design System:
```
Colors:
- Background Gradient: #2f6364 → #00bbe4 → #2f6364
- Text: #ffffff
- Accent: #d59ec9 (soft-lavender)

Typography:
- Headings: Playfair Display (700-900 weight)
- Body: Inter (400-700 weight)

Effects:
- Glass morphism: rgba(255,255,255,0.1) with 20px blur
- Shadows: 0px 20px 60px rgba(0,0,0,0.3)
- Border: 2px rgba(255,255,255,0.2)
```

### Export:
1. Select frame → Export
2. Format: JPG, 2x quality
3. Compress if needed

---

## Method 3: Automated (For Developers)

We've created automation scripts:

### Option A: HTML Templates (Manual Screenshots)
```bash
node scripts/generate-og-image-html.js
```
This creates HTML files in `public/og-images-templates/`

**Then:**
1. Open each HTML in Chrome
2. Set window to exactly 1200x630
3. Screenshot (Cmd+Shift+4 on Mac)
4. Compress to <100KB

### Option B: Playwright Automation (Fully Automated)
```bash
npm install playwright sharp
node scripts/generate-og-images-playwright.js
```
This generates all 8 images automatically! ✨

---

## Required Images & Content

### 1. **og-image-home.jpg**
**Title:** "Book Perfect Entertainment for Your Event"
**Subtitle:** "Connect with verified DJs, bands, and musicians across Thailand"
**Gradient:** Teal → Cyan → Teal

### 2. **og-image-artists.jpg**
**Title:** "Join Bright Ears as an Entertainer"
**Subtitle:** "Get discovered by event organizers • Zero commission • Direct bookings"
**Gradient:** Cyan → Lavender → Cyan

### 3. **og-image-artists-listing.jpg**
**Title:** "Browse 500+ Verified Artists"
**Subtitle:** "DJs • Bands • Musicians • MCs • Professional entertainers"
**Gradient:** Brown → Teal → Cyan

### 4. **og-image-corporate.jpg**
**Title:** "Corporate Event Entertainment"
**Subtitle:** "Trusted by 500+ Bangkok venues & hotels • Professional booking platform"
**Gradient:** Teal → Cyan → Brown

### 5. **og-image-how-it-works.jpg**
**Title:** "How Bright Ears Works"
**Subtitle:** "Simple 3-step process: Browse → Request Quote → Book"
**Gradient:** Cyan → Teal → Lavender

### 6. **og-image-faq.jpg**
**Title:** "Frequently Asked Questions"
**Subtitle:** "Everything you need to know about booking entertainment"
**Gradient:** Lavender → Cyan → Teal

### 7. **og-image-about.jpg**
**Title:** "About Bright Ears"
**Subtitle:** "Thailand's premier commission-free entertainment booking platform"
**Gradient:** Teal → Cyan

### 8. **og-image-contact.jpg**
**Title:** "Get in Touch"
**Subtitle:** "We're here to help find the perfect entertainment for your event"
**Gradient:** Cyan → Brown

---

## Quick Checklist

Before uploading each image:
- [ ] Exactly 1200 x 630 pixels
- [ ] File size < 100KB
- [ ] JPG format
- [ ] Logo visible and clear
- [ ] Text readable (high contrast)
- [ ] No spelling errors
- [ ] Matches brand colors
- [ ] Filename: `og-image-[page-id].jpg`

---

## Testing

After creating and uploading:

1. **Local Testing:**
   - Place images in `/public/og-images/`
   - Restart dev server
   - Visit pages and view page source
   - Check `<meta property="og:image"` tag

2. **Social Media Preview Testing:**
   - Visit https://metatags.io/
   - Enter page URL: `https://brightears.onrender.com/`
   - Check preview for Facebook, Twitter, LinkedIn
   - Verify image loads and looks good

3. **Validator:**
   - Facebook: https://developers.facebook.com/tools/debug/
   - Twitter: https://cards-dev.twitter.com/validator
   - LinkedIn: https://www.linkedin.com/post-inspector/

---

## Common Issues & Fixes

**Issue:** Image looks blurry on Facebook
**Fix:** Ensure image is exactly 1200x630, not scaled

**Issue:** File too large (>100KB)
**Fix:** Use https://tinypng.com/ or reduce JPG quality to 80%

**Issue:** Text hard to read
**Fix:** Increase contrast, add text shadows, use white on dark

**Issue:** Image not updating on social media
**Fix:** Clear Facebook/Twitter cache with debugger tools

---

## Brand Color Reference

```css
/* Primary Colors */
--brand-cyan: #00bbe4;
--deep-teal: #2f6364;

/* Accent Colors */
--soft-lavender: #d59ec9;
--earthy-brown: #a47764;

/* Neutrals */
--pure-white: #ffffff;
--off-white: #f7f7f7;
--dark-gray: #333333;
```

---

## Time Estimate

- **Canva Method:** ~5 minutes per image (40 min total)
- **Figma Method:** ~3 minutes per image (24 min total)
- **Playwright Automation:** ~2 minutes setup, auto-generates all

**Recommended:** Use Playwright automation if you have Node.js, otherwise Canva is fastest.

---

## Need Help?

If images aren't showing on social media:
1. Check file exists at `/public/og-images/og-image-[name].jpg`
2. Verify metadata in page source
3. Clear social media cache
4. Wait 5-10 minutes for CDN propagation
5. Test with private/incognito browser

**Generated:** October 8, 2025
**Next Review:** After deployment
