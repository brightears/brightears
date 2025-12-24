# Quick Start: Create OG Images in 5 Minutes

## The Fastest Way to Fix Social Sharing

Your pages are broken on social media because 8 images are missing. Here's the fastest fix:

---

## Method 1: Automated (2 minutes) ⚡ RECOMMENDED

```bash
# Install dependencies (one-time setup)
npm install playwright sharp

# Generate all 8 images automatically
node scripts/generate-og-images-playwright.js

# Done! Images are in public/og-images/
```

**That's it!** Skip to "Test & Deploy" section below.

---

## Method 2: Canva (40 minutes) 🎨

If automation fails, use Canva:

### Quick Setup:
1. Go to https://www.canva.com/
2. Click "Custom size" → 1200 x 630 px
3. Use this template:

**Background:** Gradient from #2f6364 → #00bbe4 → #2f6364

**Add Text:**
- Title: Playfair Display Bold, 64pt, White
- Subtitle: Inter Regular, 28pt, White 95%

**Add Logo:**
- Upload `/public/logo.png`
- Place at top-center

**Export:**
- Download → JPG
- If > 100KB, compress at https://tinypng.com/

### Repeat for 8 pages:
1. **og-image-home.jpg**
   - Title: "Book Perfect Entertainment for Your Event"
   - Subtitle: "Connect with verified DJs, bands, and musicians across Thailand"

2. **og-image-artists.jpg**
   - Title: "Join Bright Ears as an Entertainer"
   - Subtitle: "Get discovered by event organizers • Zero commission"

3. **og-image-artists-listing.jpg**
   - Title: "Browse 500+ Verified Artists"
   - Subtitle: "DJs • Bands • Musicians • MCs • Professional entertainers"

4. **og-image-corporate.jpg**
   - Title: "Corporate Event Entertainment"
   - Subtitle: "Trusted by 500+ Bangkok venues & hotels"

5. **og-image-how-it-works.jpg**
   - Title: "How Bright Ears Works"
   - Subtitle: "Simple 3-step process: Browse → Quote → Book"

6. **og-image-faq.jpg**
   - Title: "Frequently Asked Questions"
   - Subtitle: "Everything you need to know about booking"

7. **og-image-about.jpg**
   - Title: "About Bright Ears"
   - Subtitle: "Thailand's premier commission-free entertainment platform"

8. **og-image-contact.jpg**
   - Title: "Get in Touch"
   - Subtitle: "We're here to help find perfect entertainment"

**Save all to:** `/public/og-images/`

---

## Test & Deploy

### 1. Verify Files:
```bash
ls -lh public/og-images/
# Should show 8 .jpg files, each < 100KB
```

### 2. Test Locally:
```bash
npm run dev
# Visit http://localhost:3000
# Check page source for <meta property="og:image">
```

### 3. Test Social Preview:
- Visit https://metatags.io/
- Enter: https://brightears.onrender.com
- Check image preview loads correctly

### 4. Deploy:
```bash
git add public/og-images/
git commit -m "feat: Add OG images for social sharing"
git push origin main
```

### 5. Wait 2-3 minutes for deployment
- Render auto-deploys from GitHub
- Check https://brightears.onrender.com

### 6. Final Test:
- Share homepage on Facebook
- Share on Twitter
- Verify image appears in preview

---

## Checklist

Before deployment:
- [ ] 8 images in `/public/og-images/` directory
- [ ] Each image exactly 1200 x 630 pixels
- [ ] Each image < 100KB file size
- [ ] JPG format
- [ ] No spelling errors
- [ ] Logo visible

After deployment:
- [ ] Images load on https://brightears.onrender.com
- [ ] Meta tags present in page source
- [ ] Facebook preview works
- [ ] Twitter preview works
- [ ] LinkedIn preview works

---

## Troubleshooting

**Q: Playwright fails with "chromium not found"**
```bash
npx playwright install chromium
```

**Q: Images too large (>100KB)**
- Use https://tinypng.com/ to compress
- Or reduce JPG quality to 80% in Canva

**Q: Images not showing on Facebook**
- Clear cache: https://developers.facebook.com/tools/debug/
- Paste your URL and click "Scrape Again"

**Q: Where do I put the images?**
```
/Users/benorbe/Documents/Coding Projects/brightears/brightears/public/og-images/
```

---

## Need Help?

See detailed guides:
- **IMAGE_OPTIMIZATION_AUDIT.md** - Complete technical audit
- **OG_IMAGE_CREATION_GUIDE.md** - Detailed creation guide
- **scripts/README.md** - Script documentation

---

**Time Required:**
- Automated: 2 minutes
- Canva: 40 minutes (5 min per image)

**Impact:**
- Fixes 404 errors on social sharing
- Increases social CTR by 15-25%
- Improves SEO social signals
- Makes your platform look professional

**Do it now! Your social media presence depends on it.** 🚀
