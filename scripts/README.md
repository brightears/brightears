# Scripts Directory

This directory contains utility scripts for the Bright Ears platform.

## Image Generation Scripts

### 1. `generate-og-image-html.js`
Generates HTML templates for OG (Open Graph) social media preview images.

**Usage:**
```bash
node scripts/generate-og-image-html.js
```

**Output:** HTML files in `public/og-images-templates/`

**Next Steps:** Open HTML files in browser (1200x630 window) and screenshot.

---

### 2. `generate-og-images-playwright.js` (Recommended)
Fully automated OG image generation using Playwright.

**Setup:**
```bash
npm install playwright sharp
```

**Usage:**
```bash
node scripts/generate-og-images-playwright.js
```

**Output:** 8 optimized JPG files (1200x630, <100KB each) in `public/og-images/`

**What it does:**
- Launches headless browser
- Renders each page design
- Takes screenshot at exact dimensions
- Optimizes with Sharp (JPG quality 85)
- Validates file sizes

---

## Generated Images

After running the Playwright script, you'll have:

1. `og-image-home.jpg` - Homepage
2. `og-image-artists.jpg` - How It Works for Artists
3. `og-image-artists-listing.jpg` - Browse Artists
4. `og-image-corporate.jpg` - Corporate Events
5. `og-image-how-it-works.jpg` - How It Works
6. `og-image-faq.jpg` - FAQ
7. `og-image-about.jpg` - About Us
8. `og-image-contact.jpg` - Contact

---

## Testing Generated Images

### Local Testing:
```bash
# Start dev server
npm run dev

# Visit pages and check meta tags
curl http://localhost:3000 | grep "og:image"
```

### Social Media Testing:
- **Meta Tags Tester:** https://metatags.io/
- **Facebook Debugger:** https://developers.facebook.com/tools/debug/
- **Twitter Validator:** https://cards-dev.twitter.com/validator

---

## Customization

Edit the `ogPages` array in either script to modify:
- Page titles
- Subtitles
- Gradient colors
- Layout

Example:
```javascript
{
  id: 'home',
  title: 'Book Perfect Entertainment for Your Event',
  subtitle: 'Connect with verified DJs, bands, and musicians across Thailand',
  gradient: 'from-[#2f6364] via-[#00bbe4] to-[#2f6364]'
}
```

---

## Troubleshooting

**Error: "playwright not found"**
```bash
npm install playwright
npx playwright install chromium
```

**Error: "sharp not found"**
```bash
npm install sharp
```

**Images too large (>100KB)**
- Reduce JPG quality in script (line with `.jpeg({ quality: 85 })`)
- Try quality: 75 or 80

**Images look blurry**
- Increase `deviceScaleFactor: 2` to 3 for higher DPI
- Check viewport is exactly 1200x630

---

## Brand Guidelines

All OG images follow:
- **Colors:** Bright Ears brand palette (#00bbe4, #2f6364, #d59ec9, #a47764)
- **Typography:** Playfair Display (headings) + Inter (body)
- **Effects:** Glass morphism, gradients, subtle animations
- **Size:** Exactly 1200x630px (Facebook/LinkedIn optimal)
- **Format:** JPG at 85% quality, <100KB
