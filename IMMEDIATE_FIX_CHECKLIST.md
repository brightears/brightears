# Immediate Fix Checklist - Week 1 Critical Fixes
**Estimated Time:** 6 hours
**Goal:** Fix all broken navigation links and complete agency transformation to 90%

---

## PRIORITY 1: FIX NAVIGATION LINKS (2 hours)

### Task 1.1: Fix Role Selection Modal
**File:** `/components/modals/RoleSelectionModal.tsx`
**Line:** 78

**Current Code:**
```tsx
const targetPath = role === 'customer'
  ? `/${locale}/artists`
  : `/${locale}/register/artist`  // ❌ BROKEN
```

**Fixed Code:**
```tsx
const targetPath = role === 'customer'
  ? `/${locale}/artists`
  : `/${locale}/apply`  // ✅ FIXED
```

**Testing:**
- [ ] Open homepage
- [ ] Wait for role selection modal (1.5s delay)
- [ ] Click "I'm an entertainer"
- [ ] Should redirect to `/apply` (application form)
- [ ] Should NOT redirect to `/register/artist`

---

### Task 1.2: Fix Auth Button
**File:** `/components/auth/AuthButton.tsx`
**Line:** 52

**Current Code:**
```tsx
href="/register/artist"  // ❌ BROKEN
```

**Fixed Code:**
```tsx
href="/apply"  // ✅ FIXED
```

**Testing:**
- [ ] Find "Join as Entertainer" button (if visible)
- [ ] Click button
- [ ] Should redirect to `/apply`

---

### Task 1.3: Fix How It Works Content
**Files:**
- `/components/content/HowItWorksContent.tsx` (2 instances)
- `/components/content/HowItWorksContent 2.tsx` (2 instances - DELETE THIS FILE)

**Lines:** 171, 421 in both files

**Current Code:**
```tsx
href={`/${locale}/register/artist`}  // ❌ BROKEN
```

**Fixed Code:**
```tsx
href={`/${locale}/apply`}  // ✅ FIXED
```

**Additional Action:**
- [ ] Delete duplicate file: `HowItWorksContent 2.tsx`

**Testing:**
- [ ] Visit `/en/how-it-works`
- [ ] Scroll to "Get Started as Artist" CTA
- [ ] Click CTA button
- [ ] Should redirect to `/apply`

---

### Task 1.4: Fix Login Page
**File:** `/app/[locale]/login/page.tsx`
**Line:** 173

**Current Code:**
```tsx
href="/register/artist"  // ❌ BROKEN
```

**Fixed Code:**
```tsx
href="/apply"  // ✅ FIXED
```

**Testing:**
- [ ] Visit `/en/login`
- [ ] Find "Sign up as artist" link
- [ ] Click link
- [ ] Should redirect to `/apply`

---

### Task 1.5: Fix How It Works Artists Page
**File:** `/app/[locale]/how-it-works-artists/HowItWorksArtistsContent.tsx`
**Lines:** 176, 449

**Current Code:**
```tsx
href={`/${locale}/register/artist`}  // ❌ BROKEN
```

**Fixed Code:**
```tsx
href={`/${locale}/apply`}  // ✅ FIXED
```

**Testing:**
- [ ] Visit `/en/how-it-works-artists` (if page exists)
- [ ] Find artist CTAs
- [ ] Click CTAs
- [ ] Should redirect to `/apply`

---

### Automated Fix Command (Use with Caution):
```bash
# Navigate to project root
cd /Users/benorbe/Documents/Coding\ Projects/brightears/brightears

# Find all instances (verify before replacing)
grep -r "/register/artist" app/ components/ --include="*.tsx" --include="*.ts"

# Replace in each file manually (safer than sed -i for critical changes):
# 1. components/modals/RoleSelectionModal.tsx
# 2. components/auth/AuthButton.tsx
# 3. components/content/HowItWorksContent.tsx
# 4. app/[locale]/login/page.tsx
# 5. app/[locale]/how-it-works-artists/HowItWorksArtistsContent.tsx

# Delete duplicate file
rm components/content/HowItWorksContent\ 2.tsx
```

---

## PRIORITY 2: ADD URL REDIRECTS (1 hour)

### Task 2.1: Create Redirects Configuration
**File:** `next.config.js` (or `next.config.ts`)

**Add to existing config:**
```javascript
module.exports = {
  // ... existing config

  async redirects() {
    return [
      // Marketplace artist registration → Agency application
      {
        source: '/register/artist',
        destination: '/apply',
        permanent: true, // 301 redirect (SEO-friendly)
      },
      {
        source: '/:locale/register/artist',
        destination: '/:locale/apply',
        permanent: true,
      },

      // Artist onboarding → Agency application
      {
        source: '/artist/onboarding',
        destination: '/apply',
        permanent: true,
      },
      {
        source: '/:locale/artist/onboarding',
        destination: '/:locale/apply',
        permanent: true,
      },

      // Artist pricing page → Application (or About page)
      {
        source: '/pricing/artist',
        destination: '/apply',
        permanent: true,
      },
      {
        source: '/:locale/pricing/artist',
        destination: '/:locale/apply',
        permanent: true,
      },
    ]
  },
}
```

**Testing:**
- [ ] Visit `http://localhost:3000/register/artist`
- [ ] Should redirect to `/apply`
- [ ] Visit `http://localhost:3000/en/register/artist`
- [ ] Should redirect to `/en/apply`
- [ ] Visit `http://localhost:3000/artist/onboarding`
- [ ] Should redirect to `/apply`

---

## PRIORITY 3: UPDATE SITEMAP (15 minutes)

### Task 3.1: Add /apply to Sitemap
**File:** `/app/sitemap.ts`

**Current Static Pages Array:**
```typescript
const staticPages = [
  { path: '', priority: 1.0, changefreq: 'daily' as const, lastModified: currentDate },
  { path: 'artists', priority: 0.9, changefreq: 'daily' as const, lastModified: currentDate },
  { path: 'how-it-works', priority: 0.7, changefreq: 'monthly' as const, lastModified: currentDate },
  { path: 'faq', priority: 0.6, changefreq: 'monthly' as const, lastModified: currentDate },
  { path: 'about', priority: 0.6, changefreq: 'monthly' as const, lastModified: currentDate },
  { path: 'contact', priority: 0.6, changefreq: 'monthly' as const, lastModified: currentDate },
  { path: 'corporate', priority: 0.6, changefreq: 'monthly' as const, lastModified: currentDate },
];
```

**Add After Line 52:**
```typescript
{
  path: 'apply',
  priority: 0.8,  // High priority for artist acquisition
  changefreq: 'monthly' as const,
  lastModified: currentDate
},
```

**Testing:**
- [ ] Build site: `npm run build`
- [ ] Visit `http://localhost:3000/sitemap.xml`
- [ ] Verify `/en/apply` and `/th/apply` are present
- [ ] Check priority is 0.8

---

## PRIORITY 4: TEST ALL USER JOURNEYS (2 hours)

### Test 4.1: Customer Journey
**Path:** Homepage → Browse Artists → Artist Profile → Contact

**Steps:**
- [ ] Visit homepage (`/`)
- [ ] Click "Browse Artists" in navigation
- [ ] Should land on `/artists`
- [ ] Click any artist card
- [ ] Should land on `/artists/[artistId]`
- [ ] Click "Contact on LINE" button
- [ ] Should open LINE app or LINE web with pre-filled message
- [ ] Verify message format: "Hi! I'm interested in booking [Artist Name]"

**Expected:** Full customer path working, no broken links

---

### Test 4.2: DJ Applicant Journey
**Path:** Homepage → Role Modal → Application Form → Submit

**Steps:**
- [ ] Clear localStorage: `localStorage.removeItem('brightears_role_selected')`
- [ ] Visit homepage (`/`)
- [ ] Wait 1.5 seconds for role selection modal
- [ ] Click "I'm an entertainer" option
- [ ] Should redirect to `/apply` ✅ (NOT `/register/artist` ❌)
- [ ] Fill out application form (all required fields)
- [ ] Submit form
- [ ] Should see success message: "Application received!"

**Alternative Entry Points:**
- [ ] Header navigation: "Apply as DJ" → `/apply`
- [ ] Footer: "Apply to Join" → `/apply`
- [ ] How It Works page: "Get Started" CTA → `/apply`
- [ ] Login page: "Sign up as artist" → `/apply`

**Expected:** All paths lead to `/apply`, form submits successfully

---

### Test 4.3: Admin Journey
**Path:** Login → Dashboard → Applications → Approve/Reject

**Steps:**
- [ ] Login as admin user
- [ ] Should redirect to `/dashboard/admin`
- [ ] View stats: Pending applications, Active artists, Bookings, Revenue
- [ ] Click "Review Applications" → `/dashboard/admin/applications`
- [ ] See list of pending applications (from Test 4.2)
- [ ] Click an application row
- [ ] Should open ApplicationDetailModal
- [ ] Click "Approve" button
- [ ] Should create Artist profile
- [ ] Should update application status to APPROVED
- [ ] Verify new artist appears in `/dashboard/admin/artists`

**Expected:** Admin workflow functional, approve creates Artist profile

---

## PRIORITY 5: VERIFY BROKEN PAGES ARE GONE (30 minutes)

### Test 5.1: Old Marketplace URLs
**Expected:** All should redirect to `/apply` (301)

- [ ] `/register/artist` → redirects to `/apply`
- [ ] `/en/register/artist` → redirects to `/en/apply`
- [ ] `/th/register/artist` → redirects to `/th/apply`
- [ ] `/artist/onboarding` → redirects to `/apply`
- [ ] `/en/artist/onboarding` → redirects to `/en/apply`
- [ ] `/pricing/artist` → redirects to `/apply`

**How to Test:**
```bash
# Check redirect headers
curl -I http://localhost:3000/register/artist
# Should show: HTTP/1.1 301 Moved Permanently
# Location: /apply
```

---

## PRIORITY 6: CODE CLEANUP (30 minutes)

### Task 6.1: Delete Duplicate Files
- [ ] Delete: `/components/content/HowItWorksContent 2.tsx`
- [ ] Verify original file still exists and works

### Task 6.2: Update Translation Files (Optional - Can Do in Week 2)
**File:** `/messages/en.json`

**Marketplace Terminology to Replace:**
```json
// Line 28 - BEFORE:
"entertainerSignUp": "Join as Entertainer",

// AFTER:
"applyAsDJ": "Apply to Join Our Roster",
```

**Other Keys to Update:**
```json
// Verification fee references (search for "verificationFee")
// Onboarding wizard references (search for "onboarding.step")
// Profile publishing references (search for "publish")
```

**Note:** This is lower priority - translation cleanup can be done in Week 2.

---

## FINAL CHECKLIST - WEEK 1 COMPLETION

### Before Deployment:
- [ ] All 8 files with `/register/artist` references updated
- [ ] URL redirects added to `next.config.js`
- [ ] `/apply` added to sitemap
- [ ] Duplicate files deleted
- [ ] All 3 user journeys tested end-to-end
- [ ] No TypeScript errors: `npm run build`
- [ ] No broken links found

### Deployment Steps:
- [ ] Commit changes to git
- [ ] Push to GitHub
- [ ] Render auto-deploys (verify at https://brightears.onrender.com)
- [ ] Test all paths in production
- [ ] Monitor for 404 errors in logs

### Success Criteria:
- [ ] Role selection modal → `/apply` works
- [ ] Header "Apply as DJ" → `/apply` works
- [ ] How It Works CTAs → `/apply` works
- [ ] Login "Sign up as artist" → `/apply` works
- [ ] Old URLs redirect properly (301)
- [ ] Application form submits successfully
- [ ] Admin can approve applications

### Expected Result:
**Transformation Status:** 90% Complete
**User Journey Breaks:** 0 critical issues
**Ready for:** Artist acquisition and booking operations

---

## TROUBLESHOOTING

### If Application Form Not Submitting:
- Check API route: `/app/api/applications/route.ts`
- Verify database connection
- Check rate limiting (3 per email/phone per 24h)

### If Redirects Not Working:
- Restart Next.js dev server: `npm run dev`
- Clear browser cache: Hard reload (Cmd+Shift+R)
- Check Next.js version supports redirects

### If Role Modal Not Appearing:
- Clear localStorage: `localStorage.clear()`
- Check 30-day expiry hasn't triggered
- Verify modal component is imported in layout

---

**Estimated Completion Time:** 6 hours
**Suggested Schedule:**
- Day 1 (3 hours): Tasks 1-2 (Fix links, add redirects)
- Day 2 (3 hours): Tasks 3-6 (Sitemap, testing, cleanup, deployment)

**Questions?** See full audit report: `MARKETPLACE_TO_AGENCY_AUDIT_REPORT.md`
