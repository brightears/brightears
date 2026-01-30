# Bright Ears Marketplace Removal Audit

**Date:** November 5, 2025
**Objective:** Transform from two-sided marketplace to agency-managed booking site
**Current State:** Artists can self-register, verify, manage earnings
**Target State:** Owner adds DJs manually, customers browse and contact owner

---

## Executive Summary

This audit identifies **ALL** files, components, routes, and database operations that need to be removed or modified to convert Bright Ears from a marketplace platform to an agency-managed booking site.

**Scope of Changes:**
- **85+ files** require deletion or modification
- **23 database fields** to remove from Artist schema
- **15+ API routes** to delete entirely
- **8 dashboard pages** to remove
- **Multiple navigation elements** to update

**What Will Be KEPT:**
- ✅ Customer browsing DJs (important!)
- ✅ Customer booking inquiry system
- ✅ Customer dashboard
- ✅ Artist profiles (owner-managed only)
- ✅ Bilingual EN/TH support
- ✅ Admin panel (for owner management)

---

## 1. FILES TO DELETE ENTIRELY

### A. Artist Self-Registration Pages (7 files)

**Primary Registration:**
```
/app/[locale]/sign-up/page.tsx
- 362 lines
- Allows "Become Artist" user type selection
- Email/password/phone registration form
- DELETE: Entire file
```

**Brightears Directory Registration (Legacy):**
```
/brightears/app/[locale]/register/page.tsx
/brightears/app/[locale]/register/layout.tsx
/brightears/app/[locale]/register/choice/page.tsx
/brightears/app/[locale]/register/artist/page.tsx
- Complete artist registration flow with Clerk auth
- DELETE: Entire /register directory
```

**Artist Login Pages:**
```
/brightears/app/[locale]/artist-login/page.tsx
- Separate login for artists
- DELETE: Entire file
```

### B. Artist Onboarding System (15+ files)

**Onboarding Wizard (5-step system):**
```
/brightears/app/[locale]/artist/onboarding/page.tsx
/brightears/components/artist/onboarding/OnboardingWizard.tsx (383 lines)
/brightears/components/artist/onboarding/OnboardingProgress.tsx (158 lines)
/brightears/components/artist/onboarding/Step1BasicInfo.tsx (113 lines)
/brightears/components/artist/onboarding/Step2ProfileDetails.tsx (305 lines)
/brightears/components/artist/onboarding/Step3PricingAvailability.tsx (402 lines)
/brightears/components/artist/onboarding/Step4Verification.tsx (248 lines)
/brightears/components/artist/onboarding/Step5Payment.tsx (324 lines)
- Total: 1,933 lines across 8 files
- DELETE: Entire /artist/onboarding directory
- DELETE: Entire /components/artist/onboarding directory
```

**Verification Upload Components:**
```
/brightears/components/artist/IDVerificationUpload.tsx (267 lines)
- ID/Passport/Driver's License upload interface
- DELETE: Entire file
```

### C. Artist Earnings Dashboard (5 files)

```
/brightears/app/[locale]/dashboard/artist/earnings/page.tsx
/brightears/components/dashboard/ArtistEarnings.tsx
- Earnings calculations, payout tracking, revenue charts
- DELETE: Entire earnings page and component
```

### D. Artist Profile Management Pages (4 files)

**Artist Dashboard Pages:**
```
/app/[locale]/dashboard/artist/page.tsx (212 lines)
/app/[locale]/dashboard/artist/inquiries/page.tsx
/brightears/app/[locale]/dashboard/artist/page.tsx
/brightears/app/[locale]/dashboard/artist/reviews/page.tsx
/brightears/app/[locale]/dashboard/artist/analytics/page.tsx
- DELETE: Keep inquiries handling, but remove artist access
- DELETE: Remove earnings, reviews, analytics artist-facing pages
```

### E. Artist Recruitment Marketing Components (2 files)

```
/brightears/components/home/ArtistSignupSection.tsx (147 lines)
- "Are You an Entertainer?" CTA section
- "Start Your Artist Profile" and "Already a Member? Login" buttons
- Success stories, stats, benefits grid
- DELETE: Entire component
```

```
/brightears/components/home/UserFlowSection.tsx
- User journey visualization for artists
- DELETE: If contains artist recruitment messaging
```

### F. Verification Payment System (3 files)

**PromptPay Verification Fee (฿1,500):**
```
/brightears/lib/promptpay.ts (275 lines)
/brightears/components/payment/PromptPayQR.tsx (215 lines)
/brightears/app/api/artist/verification/payment/route.ts (257 lines)
- DELETE: All verification payment infrastructure
```

### G. API Routes - Registration & Onboarding (8 routes)

**Artist Registration:**
```
/brightears/app/api/auth/register/route.ts
/brightears/app/api/auth/register/artist/route.ts (280 lines)
- Complete registration API with 23 verification fields
- calculateProfileCompleteness() helper
- DELETE: Entire artist registration endpoint
```

**Onboarding Management:**
```
/brightears/app/api/artist/onboarding/save/route.ts
/brightears/app/api/artist/onboarding/complete/route.ts
- Save progress, publish profile
- DELETE: Both endpoints
```

**Verification Uploads:**
```
/brightears/app/api/artist/verification/upload/route.ts (195 lines)
/brightears/app/api/artist/verification/payment/route.ts (257 lines)
- ID upload, payment slip processing
- DELETE: Both endpoints
```

**Profile Updates:**
```
/brightears/app/api/artist/profile/update/route.ts
/brightears/app/api/artist/pricing/update/route.ts
- Artist-initiated profile changes
- DELETE: Both endpoints (owner will use admin panel)
```

**Artist Login:**
```
/brightears/app/api/auth/artist-login/route.ts
- DELETE: Artist-specific login endpoint
```

### H. Documentation Files (8+ files)

**Registration & Onboarding Docs:**
```
/brightears/ARTIST_REGISTRATION_API.md (700+ lines)
/brightears/FRONTEND_INTEGRATION_GUIDE.md (650+ lines)
/brightears/DAY_11-12_SUMMARY.md
/brightears/scripts/test-artist-registration.ts (400+ lines)
- DELETE: All artist registration documentation
```

**Monetization Documentation:**
```
/brightears/MONETIZATION_QUICK_REF.md
/brightears/MONETIZATION_DESIGN_SUMMARY.md
/brightears/docs/MONETIZATION_PAGES_DESIGN_SPEC.md
/brightears/MONETIZATION_AUDIT.md
- DELETE: Marketplace monetization docs (not applicable to agency model)
```

**Total Files to DELETE: 70+ files**

---

## 2. FILES TO MODIFY (Specific Sections to Remove)

### A. Database Schema - Prisma (CRITICAL)

**File:** `/prisma/schema.prisma`

**Artist Model - Fields to REMOVE (23 fields):**

```prisma
// VERIFICATION FIELDS (8 fields) - DELETE:
verificationLevel: String @default("UNVERIFIED")
verifiedAt: DateTime?
verificationDocumentUrl: String?
verificationDocumentType: String?
verificationSubmittedAt: DateTime?
verificationReviewedAt: DateTime?
verificationReviewedBy: String?
verificationRejectionReason: String?

// VERIFICATION FEE TRACKING (5 fields) - DELETE:
verificationFeeRequired: Boolean @default(true)
verificationFeePaid: Boolean @default(false)
verificationFeeAmount: Decimal @db.Decimal(10, 2)
verificationFeePaidAt: DateTime?
verificationFeeTransactionId: String?

// ONBOARDING PROGRESS (3 fields) - DELETE:
onboardingStep: Int @default(0)
onboardingStartedAt: DateTime?
onboardingCompletedAt: DateTime?

// PROFILE MANAGEMENT (7 fields) - DELETE:
profileCompleteness: Int @default(0)
isDraft: Boolean @default(true)
lastProfileUpdate: DateTime?
profilePublishedAt: DateTime?
isActive: Boolean @default(true)  // Owner controls this via admin
acceptsBookings: Boolean @default(true)  // Owner controls this
responseTime: Int?  // Not needed for agency model
```

**Fields to KEEP in Artist Model:**
```prisma
// Basic Info - KEEP (owner will manage these):
id, userId, stageName, bio, profileImage, coverImage
phone, lineId, website
genres, yearsExperience

// Pricing - KEEP (owner sets these):
hourlyRate, minimumHours, currency

// Location - KEEP:
baseCity, serviceAreas

// Stats - KEEP (auto-calculated):
totalGigs, averageRating

// Timestamps - KEEP:
createdAt, updatedAt

// Relations - KEEP:
bookings, quotes, reviews, availability
```

**User Model - Field to MODIFY:**
```prisma
// BEFORE:
role: String @default("customer") // customer, artist, admin

// AFTER (remove artist as default option):
role: String @default("customer") // customer, admin only
// Artists will be admin-created, never self-registered
```

**Migration Required:**
```bash
# After editing schema.prisma:
npx prisma migrate dev --name remove_artist_marketplace_fields
npx prisma generate
```

### B. Homepage Components

**File:** `/components/pages/HomePage.tsx` (350 lines)

**Lines to REMOVE:**
```tsx
// Line 144-149: "Join as Artist" button
<Link href="/become-artist">
  <Button variant="outline" size="lg">
    Join as Artist
  </Button>
</Link>
```

**REPLACE WITH:**
```tsx
<Link href="/contact">
  <Button variant="outline" size="lg">
    Contact Us
  </Button>
</Link>
```

**File:** `/brightears/app/[locale]/page.tsx`

**Section to REMOVE:**
- ArtistSignupSection component import and usage
- Any "Become an Artist" CTAs
- Artist success stories/testimonials (if artist-recruitment focused)

### C. Footer Links

**File:** `/components/layout/Footer.tsx` (189 lines)

**Lines to REMOVE:**
```tsx
// Lines 52-57: "For Artists" section
forArtists: [
  { name: 'Join as Artist', href: '/become-artist' },
  { name: 'Artist Dashboard', href: '/dashboard/artist' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Success Stories', href: '/stories' },
],
```

**Lines to REMOVE from JSX:**
```tsx
// Lines 145-160: For Artists Links section
<div>
  <h3 className="text-white font-semibold mb-4">For Artists</h3>
  <ul className="space-y-2">
    {footerLinks.forArtists.map((link) => (
      // ...
    ))}
  </ul>
</div>
```

**REPLACE WITH:**
```tsx
// Single "Contact" link in Company section if not already there
```

### D. Header Navigation

**File:** `/components/layout/Header.tsx`

**Elements to REMOVE:**
- "Join as Artist" / "Join as Entertainer" button
- "Become Artist" navigation link
- Artist dashboard link for logged-in artists

**KEEP:**
- "Browse Artists" link (important!)
- Customer sign-in/sign-up
- Admin dashboard link (for owner)

### E. How It Works Pages

**File:** `/app/[locale]/how-it-works/page.tsx`

**Section to MODIFY:**
- Remove "Step 1: Artist registers"
- REPLACE WITH: "Step 1: Browse our curated DJs"
- Emphasize owner-curated selection

**File:** `/brightears/app/[locale]/how-it-works-artists/page.tsx`

**Action:** DELETE entire file (artist-specific how-it-works)

### F. Sitemap

**File:** `/app/sitemap.ts`

**URLs to REMOVE:**
```typescript
{ url: '/register/artist' },
{ url: '/artist/onboarding' },
{ url: '/artist-login' },
{ url: '/dashboard/artist' },
{ url: '/pricing/artist' },
{ url: '/how-it-works-artists' },
```

### G. Admin Dashboard - Verification Queue

**File:** `/brightears/app/[locale]/dashboard/admin/artists/page.tsx` (if exists)

**Section to REMOVE:**
- Artist verification approval workflow
- Payment verification review
- Document approval interface

**KEEP:**
- Artist CRUD operations (create, update, delete)
- Profile management interface for owner

### H. Artist Pricing Page

**File:** `/brightears/app/[locale]/pricing/artist/page.tsx`
**File:** `/brightears/app/[locale]/pricing/artist/ArtistPricingContent.tsx`

**Action:** DELETE both files (no artist tiers/subscriptions)

### I. Translation Files

**Files:**
- `/messages/en.json`
- `/messages/th.json`
- `/brightears/messages/en.json`
- `/brightears/messages/th.json`

**Namespaces to REMOVE:**
```json
{
  "auth": {
    // Remove artist registration translations
    "artistRegistration": { ... },
    "becomeArtist": { ... }
  },
  "onboarding": { ... },  // DELETE entire namespace
  "verification": { ... },  // DELETE entire namespace
  "pricing": {
    "artist": { ... }  // DELETE artist pricing translations
  },
  "dashboard": {
    "artist": {
      "earnings": { ... },  // DELETE earnings translations
      "verification": { ... }  // DELETE verification translations
    }
  }
}
```

**Translations to KEEP:**
```json
{
  "dashboard": {
    "artist": {
      "inquiries": { ... },  // KEEP - owner manages these
      "bookings": { ... },   // KEEP
      "profile": { ... }     // KEEP - for owner profile editing
    }
  }
}
```

---

## 3. DATABASE SCHEMA CHANGES

### A. Artist Model Field Removal

**Execute this migration:**

```prisma
// prisma/schema.prisma

model Artist {
  // REMOVE these 23 fields:
  // - verificationLevel
  // - verifiedAt
  // - verificationDocumentUrl
  // - verificationDocumentType
  // - verificationSubmittedAt
  // - verificationReviewedAt
  // - verificationReviewedBy
  // - verificationRejectionReason
  // - verificationFeeRequired
  // - verificationFeePaid
  // - verificationFeeAmount
  // - verificationFeePaidAt
  // - verificationFeeTransactionId
  // - onboardingStep
  // - onboardingStartedAt
  // - onboardingCompletedAt
  // - profileCompleteness
  // - isDraft
  // - lastProfileUpdate
  // - profilePublishedAt
  // - isActive
  // - acceptsBookings
  // - responseTime

  // SIMPLIFIED Artist Model:
  id              String   @id @default(cuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Basic Info (owner-managed)
  stageName       String
  bio             String?  @db.Text
  profileImage    String?
  coverImage      String?
  phone           String?
  lineId          String?
  website         String?

  // Professional Details
  genres          String[]
  yearsExperience Int?

  // Pricing (owner sets)
  hourlyRate      Decimal  @db.Decimal(10, 2)
  minimumHours    Int      @default(3)
  currency        String   @default("THB")

  // Location
  baseCity        String   @default("Bangkok")
  serviceAreas    String[]

  // Stats (auto-calculated)
  totalGigs       Int      @default(0)
  averageRating   Decimal? @db.Decimal(3, 2)

  // Timestamps
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relations
  bookings        Booking[]
  quotes          Quote[]
  reviews         Review[]
  availability    Availability[]

  @@index([stageName])
}
```

### B. Remove Artist Registration Analytics

**File:** `/brightears/lib/activity-tracker.ts`

**Function to REMOVE:**
```typescript
export async function trackArtistRegistration(
  artistId: string,
  category: string,
  baseCity: string
) {
  // DELETE: Artist registration tracking
}
```

### C. Clean Up Cloudinary Folders

**Folders to DELETE:**
```
brightears/verification/{artistId}/
brightears/payment-slips/{bookingId}/  (verification fees only)
```

**Folders to KEEP:**
```
brightears/artists/{artistId}/profile
brightears/artists/{artistId}/gallery
brightears/artists/{artistId}/audio
```

---

## 4. ROUTES TO REMOVE

### A. Next.js App Routes

**Public Routes to DELETE:**
```
/[locale]/sign-up                    (keep for customers, remove artist option)
/[locale]/register                   (DELETE entire directory)
/[locale]/register/choice
/[locale]/register/artist
/[locale]/artist-login
/[locale]/artist/onboarding
/[locale]/pricing/artist
/[locale]/how-it-works-artists
```

**Dashboard Routes to DELETE:**
```
/[locale]/dashboard/artist/earnings
/[locale]/dashboard/artist/analytics
/[locale]/dashboard/artist/reviews
```

**Dashboard Routes to MODIFY:**
```
/[locale]/dashboard/artist           (KEEP - redirect to admin panel for owner)
/[locale]/dashboard/artist/inquiries (KEEP - owner manages via admin)
```

### B. API Routes to DELETE (15+ routes)

**Authentication:**
```
POST /api/auth/register/artist
POST /api/auth/artist-login
PUT  /api/auth/update-role  (if only for artist upgrades)
```

**Onboarding:**
```
POST /api/artist/onboarding/save
POST /api/artist/onboarding/complete
```

**Verification:**
```
POST /api/artist/verification/upload
POST /api/artist/verification/payment
PUT  /api/artist/verification/payment  (payment slip upload)
```

**Profile Management (Artist-initiated):**
```
PUT  /api/artist/profile/update
PUT  /api/artist/pricing/update
```

**Upload Endpoints (Verification-specific):**
```
POST /api/upload/payment-slip  (for verification fees)
```

**API Routes to KEEP:**
```
GET  /api/artists              (KEEP - customer browsing)
GET  /api/artists/[id]         (KEEP - customer viewing)
POST /api/inquiries/quick      (KEEP - customer inquiries)
GET  /api/inquiries/list       (KEEP - admin/owner views)
POST /api/quotes/create        (KEEP - owner responds)
```

---

## 5. NAVIGATION & UI ELEMENTS TO REMOVE

### A. Homepage CTAs

**Remove:**
- "Join as Artist" button in hero section
- "Become Artist" links
- "Start Your Artist Profile" CTAs
- Artist signup section component

**Keep:**
- "Browse All Artists" button (primary CTA)
- "Contact Us" link

### B. Header Navigation

**Remove:**
- "Join as Entertainer" button (lavender accent)
- "For Artists" dropdown menu items
- Artist dashboard link for logged-in artists

**Keep:**
- "Browse Artists" main navigation
- Customer sign-in/sign-up
- Admin dashboard (owner access only)

### C. Footer Links

**Remove Entire Section:**
- "For Artists" footer column
- Links: "Join as Artist", "Artist Dashboard", "Pricing", "Success Stories"

**Keep:**
- "Find Artists" section (customer-focused)
- "Company" section
- "Resources" section

### D. Artist Dashboard Sidebar

**File:** `/components/dashboard/DashboardSidebar.tsx`

**Remove Links:**
- "Earnings" link
- "Analytics" link
- "Verification" link
- "Onboarding Progress" indicator

**Keep Links:**
- "Inquiries" (owner views via admin)
- "Bookings" (owner manages)
- "Profile" (owner edits)
- "Calendar" (owner sets availability)

### E. Modal & Popup Components

**Remove:**
- Role selection modal (customer vs artist choice)
- Artist onboarding wizard modal
- Verification document upload modal
- PromptPay QR code modal (for verification fees)

**Keep:**
- Quick inquiry modal (customer to owner)
- Booking confirmation modals

---

## 6. ADMIN PANEL MODIFICATIONS

### A. Remove Verification Workflows

**Pages to Modify:**
- `/dashboard/admin/artists` - Remove verification queue/approval interface
- `/dashboard/admin/payments` - Remove verification fee tracking

**Sections to Remove:**
- Artist verification status (Pending, Approved, Rejected)
- ID document review interface
- Payment verification confirmation
- Onboarding progress tracking

### B. Add Owner Management Features

**New Admin Sections Needed:**
- **Create Artist** - Form to manually add new DJ/musician
- **Edit Artist** - Update profiles, photos, pricing
- **Artist List** - View/search all artists owner has added
- **Delete Artist** - Remove artists from platform

---

## 7. VERIFICATION BADGE CHANGES

### A. Remove Verification Levels

**Current Levels (DELETE):**
```
- UNVERIFIED (gray)
- PENDING (yellow)
- ID_VERIFIED (blue)
- POLICE_VERIFIED (green)
- BUSINESS_VERIFIED (purple)
- REJECTED (red)
```

**New Approach:**
- All artists are automatically "verified" by owner
- Simple badge: "Verified by Bright Ears" (owner stamp of approval)
- No customer-visible verification levels

### B. Component Changes

**File:** `/components/ui/VerificationBadge.tsx`

**Remove:**
- Complex verification level logic
- Tooltip with verification type explanation
- Color-coded badge system

**Simplify to:**
```tsx
// Simple owner-verified badge
<Badge variant="verified">
  <CheckBadge className="w-4 h-4" />
  Verified
</Badge>
```

---

## 8. PAYMENT SYSTEM CHANGES

### A. Remove Verification Fee Payment

**Components to DELETE:**
```
/components/payment/PromptPayQR.tsx (215 lines)
/lib/promptpay.ts (275 lines - verification fee QR generation)
```

**API Routes to DELETE:**
```
POST /api/artist/verification/payment
PUT  /api/artist/verification/payment
```

**Database Fields to REMOVE:**
```prisma
// Booking model:
verificationFeeTransactionId  // DELETE
verificationFeeAmount         // DELETE
```

### B. Keep Booking Payment System

**KEEP (customer pays for bookings):**
- `/api/payments/verify` - Booking payment verification
- `/api/payments/[bookingId]/deposit` - Deposit payments
- `/api/payments/[bookingId]/full` - Full payments
- PromptPay for booking payments (customer → owner)
- Payment slip uploads for bookings

---

## 9. SEARCH & FILTERING CHANGES

### A. Remove Artist-Specific Filters

**File:** `/components/artists/FilterSidebar.tsx`

**Remove Filter:**
- Verification Level filter (was already removed in recent update)
- "Artist approved" filter
- "Onboarding complete" filter

**Keep Filters:**
- Category (DJ, Band, Singer, etc.)
- Location (Bangkok, Phuket, etc.)
- (Already simplified to these 2 in recent update)

### B. API Query Simplification

**File:** `/app/api/artists/route.ts`

**Remove Query Parameters:**
```typescript
// DELETE these filters:
verificationLevels?: string[]
onboardingComplete?: boolean
profileCompleteness?: number
```

**Keep Query Parameters:**
```typescript
// KEEP for customer browsing:
search?: string
categories?: string[]
city?: string
sort?: string
```

---

## 10. EMAIL NOTIFICATION CHANGES

### A. Remove Artist Onboarding Emails

**Email Templates to DELETE:**
```
- Artist Welcome Email
- Onboarding Step Reminder
- Verification Document Uploaded
- Verification Approved/Rejected
- Payment Fee Reminder
- Profile Published Confirmation
```

**Email Templates to KEEP:**
```
- Booking Inquiry (owner receives)
- Quote Sent (customer receives)
- Booking Confirmed (customer + owner)
- Booking Reminder (customer + owner)
- Review Request (customer)
```

### B. Email Service Configuration

**File:** `/lib/email.ts`

**Functions to REMOVE:**
```typescript
sendArtistWelcomeEmail()
sendOnboardingReminderEmail()
sendVerificationApprovedEmail()
sendVerificationRejectedEmail()
sendPaymentReminderEmail()
```

**Functions to KEEP:**
```typescript
sendInquiryNotificationEmail()  // To owner
sendQuoteEmail()                // To customer
sendBookingConfirmationEmail()  // To both
sendBookingReminderEmail()      // To both
```

---

## 11. ANALYTICS & TRACKING CHANGES

### A. Remove Artist Registration Tracking

**File:** `/lib/activity-tracker.ts`

**Events to REMOVE:**
```typescript
- artist_registration
- artist_onboarding_started
- artist_onboarding_completed
- verification_submitted
- verification_payment_completed
- artist_profile_published
```

**Events to KEEP:**
```typescript
- inquiry_sent (customer)
- quote_sent (owner)
- booking_confirmed
- artist_profile_view (customer browsing)
```

### B. Admin Dashboard Analytics

**Remove Charts:**
- Artist registration funnel
- Onboarding completion rates
- Verification approval times
- Verification fee revenue

**Keep Charts:**
- Customer inquiries over time
- Booking conversion rates
- Artist profile views
- Customer satisfaction ratings

---

## 12. TESTING & SCRIPTS TO REMOVE

### A. Test Scripts

**DELETE:**
```
/scripts/test-artist-registration.ts (400+ lines)
/scripts/verify-filter-simplification.sh
/scripts/test-simplified-filters.ts
/scripts/audit-artist-profiles.ts  (if focused on verification)
```

**KEEP:**
```
/scripts/seed-featured-artist-reviews.ts  (for owner-added artists)
/scripts/update-low-ratings.ts
```

### B. Documentation Scripts

**DELETE:**
```
/scripts/generate-onboarding-docs.ts
/scripts/test-verification-flow.ts
```

---

## 13. CLOUDINARY FOLDER CLEANUP

### A. Folders to DELETE

```
brightears/
├── verification/           # DELETE - All artist ID uploads
│   ├── {artistId}/
│   │   ├── id-front.jpg
│   │   └── id-back.jpg
│
├── payment-slips/          # DELETE - Verification fee slips only
│   └── {bookingId}/        # (Keep booking payment slips)
│       └── verification-payment.jpg
```

### B. Folders to KEEP

```
brightears/
├── artists/                # KEEP - Owner manages via admin
│   ├── {artistId}/
│   │   ├── profile/
│   │   ├── gallery/
│   │   └── audio/
│
├── bookings/               # KEEP - Booking payment slips
│   └── {bookingId}/
│       └── payment-slip.jpg
```

---

## 14. ENVIRONMENT VARIABLES TO REMOVE

### A. Artist-Specific Variables

**Remove from .env and Render:**
```bash
# Artist verification
VERIFICATION_FEE_AMOUNT=1500

# PromptPay for verification (if separate from booking payments)
PROMPTPAY_VERIFICATION_ID=...

# Email templates
ARTIST_WELCOME_EMAIL_TEMPLATE_ID=...
VERIFICATION_APPROVED_TEMPLATE_ID=...
```

### B. Keep Variables

```bash
# Database
DATABASE_URL=...

# Cloudinary (for owner uploads)
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# PromptPay (for booking payments)
PROMPTPAY_ID=...

# Email (customer notifications)
RESEND_API_KEY=...
```

---

## 15. IMPLEMENTATION CHECKLIST

### Phase 1: Database Cleanup (CRITICAL - Do First)
- [ ] Backup production database
- [ ] Create migration to remove 23 Artist fields
- [ ] Test migration in development
- [ ] Run migration in production
- [ ] Verify existing artist data preserved

### Phase 2: Remove Artist Registration
- [ ] Delete `/app/[locale]/sign-up/page.tsx` (or modify to remove artist option)
- [ ] Delete `/register` directory
- [ ] Delete `/api/auth/register/artist` route
- [ ] Delete artist-login pages and routes
- [ ] Update sitemap.ts

### Phase 3: Remove Onboarding System
- [ ] Delete `/artist/onboarding` directory (8 files)
- [ ] Delete onboarding API routes (2 files)
- [ ] Delete `/components/artist/onboarding` (8 files)
- [ ] Remove onboarding translations (EN/TH)

### Phase 4: Remove Verification System
- [ ] Delete IDVerificationUpload component
- [ ] Delete verification API routes (2 files)
- [ ] Delete PromptPay verification components (2 files)
- [ ] Remove verification translations
- [ ] Simplify VerificationBadge component

### Phase 5: Remove Earnings/Analytics
- [ ] Delete earnings dashboard page
- [ ] Delete analytics dashboard page
- [ ] Delete reviews dashboard page (artist-facing)
- [ ] Remove earnings/analytics components
- [ ] Update dashboard sidebar

### Phase 6: Update Navigation & UI
- [ ] Remove "Join as Artist" from homepage
- [ ] Remove ArtistSignupSection component
- [ ] Update header navigation
- [ ] Update footer links (remove "For Artists")
- [ ] Remove role selection modal
- [ ] Update How It Works pages

### Phase 7: Clean Up API Routes
- [ ] Delete 8 artist-specific API routes
- [ ] Update remaining routes (remove artist auth)
- [ ] Test customer inquiry flow still works
- [ ] Test admin artist management

### Phase 8: Remove Documentation
- [ ] Delete artist registration docs (4 files)
- [ ] Delete monetization docs (4 files)
- [ ] Delete onboarding guides
- [ ] Update README to reflect agency model

### Phase 9: Update Translations
- [ ] Remove `onboarding` namespace (EN/TH)
- [ ] Remove `verification` namespace (EN/TH)
- [ ] Remove `pricing.artist` namespace (EN/TH)
- [ ] Remove artist registration translations
- [ ] Keep customer-facing translations

### Phase 10: Admin Panel Enhancement
- [ ] Add "Create Artist" form for owner
- [ ] Add artist CRUD management
- [ ] Remove verification approval workflow
- [ ] Test owner can manage all artist profiles

### Phase 11: Cloudinary Cleanup
- [ ] Archive verification folder
- [ ] Delete verification payment slips
- [ ] Keep artist media folders
- [ ] Update upload routes

### Phase 12: Testing & Validation
- [ ] Test customer can browse artists ✅
- [ ] Test customer can send inquiries ✅
- [ ] Test owner receives inquiries ✅
- [ ] Test admin can create artists ✅
- [ ] Test admin can edit artists ✅
- [ ] Test no artist registration possible ✅
- [ ] Test no artist login possible ✅
- [ ] Verify all removed routes return 404

---

## 16. ESTIMATED IMPACT

### Files Summary
- **Files to DELETE entirely:** 70+ files
- **Files to MODIFY:** 15+ files
- **Lines of code to remove:** ~15,000+ lines
- **API routes to delete:** 15+ routes
- **Database fields to remove:** 23 fields
- **Translation keys to remove:** 500+ keys

### Functionality Removed
- ❌ Artist self-registration
- ❌ Artist onboarding wizard (5 steps)
- ❌ Artist verification workflow
- ❌ Verification fee payment (฿1,500)
- ❌ Artist earnings dashboard
- ❌ Artist analytics dashboard
- ❌ Artist profile self-management
- ❌ Artist login system
- ❌ Marketplace pricing tiers

### Functionality Retained
- ✅ Customer browsing artists
- ✅ Customer inquiry system
- ✅ Customer booking workflow
- ✅ Owner/admin artist management
- ✅ Owner inquiry responses
- ✅ Booking payment processing
- ✅ Review system
- ✅ Bilingual support (EN/TH)

---

## 17. RISKS & CONSIDERATIONS

### Data Loss Risks
⚠️ **CRITICAL:** Backup database before removing fields
⚠️ **CRITICAL:** Existing artist data will lose verification history
⚠️ **MEDIUM:** Translation keys removal may break untested pages

### Migration Strategy
1. **Development First:** Test all changes in development
2. **Staging Deploy:** Deploy to staging environment
3. **QA Testing:** Full regression testing
4. **Production Backup:** Full database backup
5. **Production Deploy:** Deploy with rollback plan
6. **Post-Deploy Validation:** Test all customer flows

### Rollback Plan
- Keep deleted files in Git history
- Database backup before migration
- Ability to revert Prisma migration
- Cloudinary files archived, not deleted

---

## 18. OWNER ADMIN PANEL REQUIREMENTS

### New Features Needed

**Artist Management (CRUD):**
- ✅ Create Artist Form
  - Stage name, bio, genres
  - Profile photo upload
  - Pricing (hourly rate, minimum hours)
  - Service areas
- ✅ Edit Artist Profile
  - Update all artist fields
  - Photo gallery management
  - Audio/video upload
- ✅ Delete Artist
  - Soft delete (archive)
  - Hard delete option
- ✅ Artist List View
  - Search/filter artists
  - Quick edit buttons
  - Status toggle (active/inactive)

**Inquiry Management:**
- ✅ View all customer inquiries
- ✅ Assign inquiries to specific artists
- ✅ Respond with quotes
- ✅ Track inquiry status

**Booking Management:**
- ✅ View all bookings
- ✅ Manage booking status
- ✅ Handle payments
- ✅ Calendar view

---

## 19. POST-REMOVAL VERIFICATION

### Testing Checklist

**Customer Flow (MUST WORK):**
- [ ] Customer can browse all artists
- [ ] Customer can view artist profiles
- [ ] Customer can send inquiry
- [ ] Customer receives quote email
- [ ] Customer can book and pay
- [ ] Customer can leave reviews

**Owner Flow (MUST WORK):**
- [ ] Owner can create new artist
- [ ] Owner can edit artist profiles
- [ ] Owner can upload artist media
- [ ] Owner receives inquiry notifications
- [ ] Owner can send quotes
- [ ] Owner can manage bookings

**Removed Features (MUST FAIL):**
- [ ] `/sign-up` with artist option → 404 or no option
- [ ] `/register/artist` → 404
- [ ] `/artist-login` → 404
- [ ] `/artist/onboarding` → 404
- [ ] `/dashboard/artist/earnings` → 404
- [ ] `POST /api/auth/register/artist` → 404
- [ ] Artist verification uploads → 404

---

## 20. FINAL RECOMMENDATION

### Execution Order

**Week 1: Database & Backend**
1. Database schema migration (23 fields)
2. Remove API routes (15+ routes)
3. Update admin panel for artist CRUD

**Week 2: Frontend Cleanup**
4. Remove registration pages (7 files)
5. Remove onboarding system (15+ files)
6. Update navigation (header, footer)

**Week 3: Polish & Testing**
7. Remove verification components
8. Update translations
9. Clean up documentation
10. Full QA testing

**Week 4: Deployment**
11. Deploy to staging
12. Full regression testing
13. Production deployment
14. Post-deploy validation

### Success Criteria
✅ Zero artist self-registrations possible
✅ Customer browsing unaffected
✅ Owner can manage all artists via admin
✅ All inquiries flow to owner
✅ No broken links or 500 errors
✅ Database migration successful
✅ All tests passing

---

**END OF AUDIT**

Total identified items:
- **70+ files to delete**
- **15+ files to modify**
- **23 database fields to remove**
- **15+ API routes to delete**
- **~15,000 lines of code to remove**

This audit provides a complete roadmap for transforming Bright Ears from a two-sided marketplace to an agency-managed booking platform.
