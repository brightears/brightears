# Monetization Pages - Quick Reference Guide
**For Developers: Day 6-7 Implementation**

---

## What You're Building

### Day 6: Artist Pricing Page (`/pricing/artist`)
3 pricing tiers with clear feature comparison, CTAs, FAQ, and testimonials.

### Day 7: Corporate Page Enhancement (`/corporate`)
Remove aspirational claims, add pricing model section, case studies, and inquiry form.

---

## File Structure

```
/app/[locale]/pricing/artist/
├── page.tsx                           # Server component (metadata)
├── ArtistPricingContent.tsx          # Client component (main)
└── components/
    ├── ArtistPricingHero.tsx         # Hero with animated background
    ├── PricingTierCard.tsx           # Reusable tier card
    ├── FeatureComparisonTable.tsx    # Collapsible table
    ├── AddOnServiceCard.tsx          # Verification/Photography
    ├── PricingFAQ.tsx                # FAQ accordion
    └── ArtistTestimonialCard.tsx     # Social proof

/app/[locale]/corporate/
├── page.tsx                           # Existing (update metadata)
└── CorporateContent.tsx              # Existing (enhance)
    └── components/                    # Add these
        ├── CorporatePricingModelCard.tsx
        ├── CaseStudyCard.tsx
        └── CorporateInquiryForm.tsx
```

---

## Pricing Tiers (Artist Page)

### Free Forever - ฿0/month
**Badge:** "Always Free" (deep-teal)
**CTA:** "Start Free" (earthy-brown button)
**Features:** 9 included, 7 excluded
**Link:** `/register/artist`

### Professional - ฿799/month
**Badge:** "Most Popular" (brand-cyan)
**CTA:** "Upgrade to Professional" (brand-cyan button)
**Value Prop:** "Get 3x more bookings"
**Features:** All Free + 11 premium features
**Link:** `/upgrade/professional`

### Featured - ฿1,499/month
**Badge:** "Premium" (soft-lavender)
**CTA:** "Go Featured" (gradient cyan→lavender button)
**Value Prop:** "Get 5x more bookings"
**Features:** All Professional + 14 premium features
**Special:** Ring border `ring-4 ring-brand-cyan/50`
**Link:** `/upgrade/featured`

---

## Color Usage

### Buttons
- **Primary CTA:** `bg-brand-cyan text-white hover:bg-brand-cyan/90`
- **Secondary CTA:** `bg-earthy-brown text-white hover:bg-earthy-brown/90`
- **Gradient CTA:** `bg-gradient-to-r from-brand-cyan to-soft-lavender`

### Cards
- **Standard:** `bg-white/70 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl`
- **Featured:** Add `ring-4 ring-brand-cyan/50 shadow-2xl shadow-brand-cyan/30`

### Backgrounds
- **Hero:** Animated gradient mesh with mouse tracking
- **Sections:** `bg-off-white`, `bg-white`, `bg-gradient-to-b from-white to-off-white`

---

## Reusable Components

### StatCard (Already Exists)
```typescript
import StatCard from '@/components/StatCard'

<StatCard
  value="฿799/mo"
  label="Professional Tier"
  primary={true}  // Makes it larger with cyan accent
/>
```

### FAQAccordion (Exists at FAQ page)
Reuse pattern from `/app/[locale]/faq/FAQContent.tsx`

### Animated Background (Exists in CorporateContent)
Copy from `/components/content/CorporateContent.tsx` lines 152-173

---

## Translation Keys

### Artist Pricing Page
**Namespace:** `pricing.artist`

```typescript
import { useTranslations } from 'next-intl'

const t = useTranslations('pricing.artist')

// Usage
t('hero.title')  // "Choose Your Success Level"
t('tiers.professional.price')  // "฿799"
t('tiers.professional.cta')  // "Upgrade to Professional"
```

**Key Sections:**
- `pricing.artist.meta` (SEO)
- `pricing.artist.hero` (hero section)
- `pricing.artist.tiers.free/professional/featured`
- `pricing.artist.addOns.verification/photography`
- `pricing.artist.faq`
- `pricing.artist.cta`

### Corporate Page
**Namespace:** `corporate`

**Existing keys to keep, add new sections:**
- `corporate.pricingModel` (NEW)
- `corporate.caseStudies` (NEW)
- `corporate.inquiryForm` (NEW)

---

## Content Changes (Corporate Page)

### REMOVE These Claims
```diff
- "Fortune 500 companies"
- "Global enterprise standards"
- "API integration for Salesforce, HubSpot"
- "SLA guarantees with 99.9% uptime"
- "White-label solutions available"
```

### REPLACE With
```diff
+ "500+ Bangkok venues and hotels"
+ "Professional booking system"
+ "Calendar integration tools"
+ "Reliable platform with dedicated support"
+ "Custom branding options for large venues"
```

### UPDATE Statistics
```diff
- "Fortune 500 clients: 12+"
+ "Bangkok Hotels: 500+"

- "Global events: 50,000+"
+ "Events Delivered: 10,000+"

- "Countries served: 25+"
+ "Venue Types: 15+"
```

---

## Key Design Patterns

### Hero Section
```tsx
<section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
  {/* Animated gradient background */}
  <div className="absolute inset-0">
    <div
      className="absolute inset-0 opacity-90"
      style={{
        background: `
          radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(0, 187, 228, 0.3) 0%, transparent 50%),
          linear-gradient(135deg, #2f6364 0%, #00bbe4 50%, #a47764 100%)
        `
      }}
    />
    <div className="absolute top-20 right-20 w-96 h-96 bg-brand-cyan/20 rounded-full blur-3xl animate-blob" />
  </div>

  {/* Content */}
  <div className="relative z-10 max-w-6xl mx-auto px-4">
    {/* Your content here */}
  </div>
</section>
```

### Pricing Tier Card
```tsx
<div className={`
  group p-8 bg-white/70 backdrop-blur-md border rounded-2xl
  ${featured ? 'ring-4 ring-brand-cyan/50 shadow-2xl shadow-brand-cyan/30' : 'border-white/20 shadow-xl'}
  hover:-translate-y-2 hover:shadow-2xl transition-all duration-500
`}>
  {/* Badge */}
  <div className="inline-block px-3 py-1 rounded-full bg-brand-cyan/10 text-brand-cyan text-sm font-semibold mb-4">
    Most Popular
  </div>

  {/* Price */}
  <div className="mb-6">
    <span className="text-5xl font-playfair font-bold text-dark-gray">฿799</span>
    <span className="text-dark-gray/60">/month</span>
  </div>

  {/* Features */}
  <ul className="space-y-3 mb-8">
    {features.map(feature => (
      <li className="flex items-start gap-2">
        <CheckIcon className="w-5 h-5 text-brand-cyan flex-shrink-0 mt-0.5" />
        <span className="text-dark-gray">{feature}</span>
      </li>
    ))}
  </ul>

  {/* CTA */}
  <Link
    href="/upgrade/professional"
    className="block w-full text-center px-6 py-3 bg-brand-cyan text-white rounded-xl hover:bg-brand-cyan/90 transition-colors font-semibold"
  >
    Upgrade to Professional
  </Link>
</div>
```

### Glass Morphism Form
```tsx
<form className="p-8 bg-white/80 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-xl">
  {/* Form fields */}
  <div className="space-y-6">
    <div>
      <label className="block text-sm font-medium text-dark-gray mb-2">
        Company Name
      </label>
      <input
        type="text"
        className="w-full px-4 py-3 border border-brand-cyan/30 rounded-xl focus:ring-4 focus:ring-brand-cyan/20 focus:border-brand-cyan transition-all"
      />
    </div>
    {/* More fields */}
  </div>

  <button className="mt-6 w-full px-8 py-4 bg-brand-cyan text-white rounded-xl hover:bg-brand-cyan/90 transition-colors font-semibold">
    Submit
  </button>
</form>
```

---

## Accessibility Checklist

- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible: `focus:ring-4 focus:ring-brand-cyan`
- [ ] ARIA labels on icon buttons: `aria-label="..."`
- [ ] Color contrast 4.5:1 minimum (test with tool)
- [ ] Heading hierarchy: H1 → H2 → H3 (no skipping)
- [ ] Form labels associated with inputs
- [ ] Alt text on images
- [ ] Mobile touch targets 44x44px minimum

---

## Testing Checklist

### Functional
- [ ] All CTAs link to correct pages
- [ ] Language switcher works (EN ↔ TH)
- [ ] Forms validate inputs
- [ ] Animations don't break layout
- [ ] Mobile navigation works

### Responsive
- [ ] 375px (iPhone SE)
- [ ] 768px (iPad)
- [ ] 1920px (Desktop)
- [ ] Horizontal scroll test (shouldn't happen)

### Cross-Browser
- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] iOS Safari
- [ ] Android Chrome

### Performance
- [ ] Images optimized (<100KB each)
- [ ] Page loads <3 seconds
- [ ] Animations smooth (60fps)
- [ ] No console errors

---

## Payment Integration (If Implementing)

### Omise (Recommended for Thailand)
```bash
npm install omise
```

### Test Cards
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
```

### Subscription Flow
1. User clicks "Upgrade to Professional"
2. Redirect to payment page with tier info
3. Collect card details (Omise form)
4. Create subscription via API
5. Redirect back with success/error
6. Update user tier in database
7. Send confirmation email

---

## Common Issues & Solutions

### Issue: Thai characters not displaying
**Solution:** Ensure `font-noto-thai` is applied to Thai text elements

### Issue: Gradient background not smooth
**Solution:** Add more gradient stops, reduce opacity on overlays

### Issue: Mobile layout breaks
**Solution:** Use `flex-col` on mobile, `md:flex-row` on desktop

### Issue: CTAs not visible enough
**Solution:** Increase contrast, add hover states, make buttons larger

### Issue: Form validation not working
**Solution:** Use existing validation schemas from `lib/validation/schemas.ts`

---

## Need Help?

### Reference Files
- **Full Spec:** `/docs/MONETIZATION_PAGES_DESIGN_SPEC.md` (23,000 words)
- **Summary:** `/MONETIZATION_DESIGN_SUMMARY.md` (executive overview)
- **Brand Guidelines:** `/BRAND_GUIDELINES.md`
- **Design System:** `/DESIGN_SYSTEM.md`

### Existing Components to Copy
- **StatCard:** `/components/StatCard.tsx`
- **Corporate Hero:** `/components/content/CorporateContent.tsx` (lines 150-222)
- **FAQ Pattern:** `/app/[locale]/faq/FAQContent.tsx`

### Questions?
Check MONETIZATION_PAGES_DESIGN_SPEC.md first - it has detailed explanations for every design decision.

---

**Quick Start:** Copy existing CorporateContent.tsx as template, swap content, update colors/CTAs. That's 80% of the work done.

**Time Estimate:**
- Artist Pricing Page: 6-8 hours
- Corporate Enhancement: 4-6 hours
- Total: 10-14 hours

**Priority:** HIGH - These pages enable revenue generation from 500+ existing artists.

---

**Last Updated:** October 10, 2025
**Phase:** Phase 1, Day 6-7
**Status:** Ready for Development
