# Deployment Fixes Checklist

**Status:** Build currently FAILS - 2 hours to production-ready
**Priority:** CRITICAL
**Target:** Fix build and deploy simplified 5-page landing site

---

## CRITICAL - Fix Build Errors (1 hour)

### Issue
Build fails with 5 "Module not found" errors for unused agency backend features.

### Root Cause
Package.json lists dependencies that aren't installed:
- `@react-pdf/renderer` (PDF generation)
- `svix` (Clerk webhooks)

These are legacy features NOT needed for the landing page.

### Solution: Clean Removal (RECOMMENDED)

```bash
# Step 1: Remove legacy backend features (7 files total)
cd /Users/benorbe/Documents/Coding\ Projects/brightears/brightears

# Remove document generation API routes
rm -rf app/api/documents/

# Remove webhook handler
rm -rf app/api/webhooks/

# Remove document template components
rm -rf components/documents/

# Step 2: Clean package.json
# Manually delete these 3 lines from package.json:
# Line 34: "@react-pdf/renderer": "^4.3.1",
# Line 40: "@types/react-pdf": "^6.2.0",
# Line 59: "svix": "^1.74.1",

# Step 3: Clean reinstall
rm -rf node_modules package-lock.json
npm install

# Step 4: Verify build
npm run build

# Expected result: ✅ Build successful in ~60 seconds
```

### Files to Remove
1. `/app/api/documents/contract/generate/route.ts`
2. `/app/api/documents/invoice/generate/route.ts`
3. `/app/api/documents/quotation/generate/route.ts`
4. `/app/api/webhooks/clerk/route.ts`
5. `/components/documents/ContractTemplate.tsx`
6. `/components/documents/InvoiceTemplate.tsx`
7. `/components/documents/QuotationTemplate.tsx`

### Verification
```bash
# Should show no errors
npm run build

# Build output should show:
# ✓ Creating an optimized production build
# ✓ Compiled successfully
# ✓ Build completed in [X]s
```

---

## HIGH - Update Sitemap (30 minutes)

### Issue
Sitemap references 6 pages that were removed during simplification.

### Files to Edit
`/app/sitemap.ts`

### Changes

**Replace lines 10-71 with:**

```typescript
const staticPages = [
  {
    path: '',
    priority: 1.0,
    changefreq: 'daily' as const,
    lastModified: currentDate
  },
  {
    path: 'about',
    priority: 0.8,
    changefreq: 'monthly' as const,
    lastModified: currentDate
  },
  {
    path: 'faq',
    priority: 0.7,
    changefreq: 'monthly' as const,
    lastModified: currentDate
  },
  {
    path: 'contact',
    priority: 0.7,
    changefreq: 'monthly' as const,
    lastModified: currentDate
  },
];
```

**Comment out lines 89-127 (dynamic artist pages):**

```typescript
// Dynamic artist pages not needed for landing page
// let artistEntries: MetadataRoute.Sitemap = [];
// ... (comment out entire block)
```

**Update line 130:**

```typescript
// Before:
return [...staticEntries, ...artistEntries];

// After:
return staticEntries;
```

### Verification
```bash
# After deployment, test sitemap
curl https://brightears.onrender.com/sitemap.xml

# Should only show 8 URLs (4 pages × 2 locales):
# /en
# /th
# /en/about
# /th/about
# /en/faq
# /th/faq
# /en/contact
# /th/contact
```

---

## MEDIUM - Update 404 Page Links (15 minutes)

### Issue
Not-found page links to 2 removed pages (/artists, /how-it-works).

### Files to Edit
`/app/[locale]/not-found.tsx`

### Changes

**Remove lines 88-98 (Browse Artists button):**

```tsx
{/* Remove this entire Link block */}
<Link href="/artists" className="...">
  <UserGroupIcon className="w-5 h-5" />
  {t('actions.browseArtists')}
  ...
</Link>
```

**Remove lines 108-113 (How It Works link):**

```tsx
{/* Remove this entire Link block */}
<Link href="/how-it-works" className="...">
  <MagnifyingGlassIcon className="w-4 h-4" />
  {t('quickLinks.howItWorks')}
</Link>
```

**Optional: Add About Us link:**

```tsx
<Link
  href="/about"
  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-inter text-brand-cyan hover:text-deep-teal transition-colors duration-200"
>
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
  {t('quickLinks.about')}
</Link>
```

### Verification
```bash
# Visit 404 page (e.g., /en/test-404)
# Verify:
# ✅ Home button works (/)
# ✅ FAQ link works (/faq)
# ✅ Contact link works (/contact)
# ✅ About link works (/about) - if added
# ❌ No broken links to /artists or /how-it-works
```

---

## Deployment Checklist

### Pre-Deployment
- [ ] Build passes locally (`npm run build`)
- [ ] No TypeScript errors
- [ ] No missing dependencies
- [ ] Sitemap updated (4 pages only)
- [ ] 404 page links verified
- [ ] Environment variables set in Render

### Post-Deployment
- [ ] Test all 5 pages load (Home, About, FAQ, Contact, 404)
- [ ] Test language switcher (EN ↔ TH)
- [ ] Test contact form submission
- [ ] Test LINE contact button
- [ ] Verify sitemap.xml accessible
- [ ] Verify robots.txt accessible
- [ ] Submit sitemap to Google Search Console

### Performance Testing
- [ ] Run Lighthouse audit (target: 90+ score)
- [ ] Check Core Web Vitals
  - LCP < 2.5s
  - FID < 100ms
  - CLS < 0.1
- [ ] Test mobile performance
- [ ] Verify image optimization

### SEO Testing
- [ ] Test structured data (Google Rich Results Test)
- [ ] Verify OpenGraph tags (Facebook Debugger)
- [ ] Verify Twitter Card (Twitter Card Validator)
- [ ] Check canonical URLs
- [ ] Test hreflang alternates

---

## Timeline

### Immediate (Today)
- **09:00-10:00** Fix build errors (remove legacy features)
- **10:00-10:30** Update sitemap (remove non-existent pages)
- **10:30-10:45** Update 404 page links
- **10:45-11:00** Final build and verification

### Total Time: **2 hours**

### Deploy
- **11:00** Push to GitHub
- **11:05** Render auto-deploys
- **11:10** Verify production site

---

## Success Criteria

✅ **Build Status:** No errors, completes in < 60 seconds
✅ **SEO Score:** 17/17 checks pass (already achieved)
✅ **Translation Coverage:** 100% (already achieved)
✅ **Page Count:** 5 pages (Home, About, FAQ, Contact, 404)
✅ **Performance:** Lighthouse score > 90
✅ **Deployment:** Live at https://brightears.onrender.com

---

## Rollback Plan

If issues occur during deployment:

```bash
# Revert to last known good commit
git log --oneline  # Find last working commit
git reset --hard [commit-hash]
git push --force origin main

# Render will auto-deploy previous version
```

---

**Last Updated:** December 26, 2025
**Status:** Ready to fix and deploy
**Confidence:** HIGH (straightforward fixes)
