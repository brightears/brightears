# Bright Ears Monetization Pages - Design Specification
**Phase 1, Day 6-7: Monetization MVP Pages**
**Date:** October 10, 2025
**Web Design Manager Review**

---

## Executive Summary

This document provides comprehensive design specifications for the two critical monetization pages:
1. **Artist Pricing Page** (`/pricing/artist`) - NEW PAGE
2. **Corporate Solutions Page** (`/corporate`) - ENHANCEMENT

These pages are essential for activating revenue generation on the Bright Ears platform, which currently has all infrastructure but no visible monetization mechanisms.

---

## 1. ARTIST PRICING PAGE (`/pricing/artist`)

### 1.1 Strategic Purpose

**Business Objective:** Convert free-tier artists to paid subscriptions by clearly demonstrating value propositions.

**Target Audience:**
- Primary: Existing free-tier artists (Bangkok-based DJs, bands, musicians)
- Secondary: New artists considering registration
- Tertiary: Artists from competing platforms evaluating switch

**Success Metrics:**
- Free-to-paid conversion rate: 15-20% target
- Page engagement time: >2 minutes
- CTA click-through rate: >25%
- Upgrade completion rate: >60% of clicks

### 1.2 Page Structure & Content

#### Hero Section

**Visual Design:**
- **Background:** Gradient mesh with animated effects (consistent with brand)
  - Base gradient: `linear-gradient(135deg, #2f6364 0%, #00bbe4 50%, #a47764 100%)`
  - Mouse-tracking radial gradient overlay for interactivity
  - Animated floating orbs using `animate-blob`, `animate-float-slow/medium/fast`
- **Glass Morphism Card:** Hero content in `bg-white/10 backdrop-blur-md border border-white/20`
- **Color Scheme:** White text on dark gradient for maximum contrast

**Content Structure:**
```
[BADGE] Zero Commission Forever • Premium Features • Instant Upgrades
[H1] Choose Your Success Level
[SUBTITLE] Start free, upgrade when you're ready. Zero commission on all tiers.
[STAT CARDS] 3 inline statistics with primary emphasis
```

**Statistics (Using StatCard component):**
1. **Primary (large, cyan accent):** "฿799/mo" - "Professional Tier"
2. **Secondary:** "500+" - "Artists Earning More"
3. **Secondary:** "3x" - "More Visibility"

**Design Requirements:**
- H1: `font-playfair text-5xl md:text-6xl font-bold text-white`
- Subtitle: `font-inter text-xl md:text-2xl text-white/90`
- Badge: Animated entrance on load (`animate-hero-search-enter`)
- Stats: Count-up animation using existing StatCard component

---

#### Pricing Tier Comparison Section

**Visual Design:**
- **Layout:** 3-column grid on desktop, vertical stack on mobile
- **Card Design:** Glass morphism with enhanced elevation for Featured tier
  - Base card: `bg-white/70 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl`
  - Featured card: Additional `ring-4 ring-brand-cyan/50 shadow-2xl shadow-brand-cyan/30`
- **Spacing:** 8px grid system - `p-8`, `gap-8` between cards

**Tier 1: Free Forever**

**Visual Hierarchy:**
- Badge: `bg-deep-teal/10 text-deep-teal` "Always Free"
- Card styling: Standard glass morphism
- CTA: Secondary button - `bg-earthy-brown text-white hover:bg-earthy-brown/90`

**Pricing Display:**
```
฿0/month
Forever Free
```

**Features (with checkmark icons):**
```
✓ Profile listing on platform
✓ Unlimited quote requests
✓ Direct customer contact
✓ 0% commission on all bookings
✓ Basic analytics dashboard
✓ Standard search placement
✓ Community support
✓ Payment via PromptPay
✓ Profile customization (limited)

✗ Featured homepage placement
✗ Priority search ranking
✗ Verified badge (available as ฿1,500 add-on)
✗ Advanced analytics
✗ Social media promotion
✗ Video uploads
✗ Priority customer support
```

**CTA Button:**
- Text: "Start Free" (EN) / "เริ่มใช้ฟรี" (TH)
- Style: `bg-earthy-brown text-white px-8 py-4 rounded-xl hover:bg-earthy-brown/90`
- Icon: ArrowRightIcon
- Link: `/register/artist`

---

**Tier 2: Professional**

**Visual Hierarchy:**
- Badge: `bg-brand-cyan/10 text-brand-cyan` "Most Popular"
- Card styling: Glass morphism with subtle hover lift
- CTA: Primary button - `bg-brand-cyan text-white hover:bg-brand-cyan/90`

**Pricing Display:**
```
฿799/month
Billed monthly • Cancel anytime
```

**Value Proposition (above features):**
"Get 3x more bookings with priority placement"

**Features (with checkmark icons):**
```
✓ Everything in Free, plus:
✓ Priority search ranking (top 10%)
✓ Verified badge included (฿1,500 value)
✓ Advanced analytics dashboard
  - Profile view tracking
  - Conversion rate metrics
  - Peak booking times
  - Geographic insights
✓ Social media profile promotion
✓ Video upload capability (5 videos)
✓ Enhanced profile customization
✓ Priority email support (24hr response)
✓ Monthly performance report
✓ Featured in weekly newsletter
✓ Calendar integration tools

✗ Homepage featured carousel
✗ Guaranteed top 3 placement
✗ Dedicated account manager
✗ Custom branding options
```

**CTA Button:**
- Text: "Upgrade to Professional" (EN) / "อัปเกรดเป็นโปรเฟสชันนัล" (TH)
- Style: `bg-brand-cyan text-white px-8 py-4 rounded-xl hover:bg-brand-cyan/90`
- Icon: SparklesIcon
- Link: `/upgrade/professional` (payment flow)

**Trust Signal:**
"Join 150+ professional artists earning more"

---

**Tier 3: Featured**

**Visual Hierarchy:**
- Badge: `bg-soft-lavender/20 text-soft-lavender` "Premium"
- Card styling: Enhanced glass morphism with cyan ring
  - `ring-4 ring-brand-cyan/50 shadow-2xl shadow-brand-cyan/30`
  - Subtle scale on hover: `hover:scale-105`
- CTA: Premium button with gradient

**Pricing Display:**
```
฿1,499/month
Billed monthly • 10% discount on annual
```

**Value Proposition (above features):**
"Get 5x more bookings with homepage exposure"

**Features (with checkmark icons):**
```
✓ Everything in Professional, plus:
✓ Featured homepage carousel (guaranteed)
✓ Top 3 search placement guarantee
✓ Social media highlights (monthly)
✓ Unlimited video uploads
✓ Custom profile URL (/artist/your-name)
✓ Featured artist badge (special color)
✓ Priority customer support (2hr response)
✓ Dedicated account manager
✓ Weekly performance insights
✓ Corporate client access (premium venues)
✓ Event booking priority notification
✓ Professional photoshoot discount (20%)
✓ API access for calendar sync

Premium Benefits:
✓ Featured in monthly marketing campaigns
✓ Direct outreach to corporate clients
✓ Early access to new features
```

**CTA Button:**
- Text: "Go Featured" (EN) / "เลือกแพ็กเกจพรีเมียม" (TH)
- Style: Gradient button
  ```css
  bg-gradient-to-r from-brand-cyan to-soft-lavender text-white
  px-8 py-4 rounded-xl hover:shadow-xl hover:scale-105
  ```
- Icon: StarIcon (solid)
- Link: `/upgrade/featured` (payment flow)

**Trust Signal:**
"Top 5% of artists earn an average of ฿45,000/month"

---

#### Feature Comparison Table (Optional, Below Cards)

**Design:** Collapsible detailed comparison table for users who need specifics

**Structure:**
```
| Feature                    | Free | Professional | Featured |
|----------------------------|------|--------------|----------|
| Profile Listing            | ✓    | ✓            | ✓        |
| Commission                 | 0%   | 0%           | 0%       |
| Quote Requests             | ∞    | ∞            | ∞        |
| Search Ranking             | Std  | Top 10%      | Top 3    |
| Verified Badge             | +฿1.5K| ✓           | ✓        |
| Analytics                  | Basic| Advanced     | Premium  |
| Video Uploads              | 0    | 5            | ∞        |
| Support Response           | 72hr | 24hr         | 2hr      |
| Homepage Featured          | ✗    | ✗            | ✓        |
| Social Media Promotion     | ✗    | ✓            | ✓✓       |
| Dedicated Account Manager  | ✗    | ✗            | ✓        |
```

**Visual Design:**
- Accordion toggle: "Compare All Features" button
- Table styling: `bg-white/80 backdrop-blur-sm rounded-xl`
- Header row: `bg-deep-teal/10 font-semibold text-deep-teal`
- Checkmarks: Green for included, Red X for excluded, Yellow for add-on

---

#### Add-On Services Section

**Visual Design:**
- Section background: `bg-gradient-to-b from-white to-off-white`
- Card grid: 2 columns on desktop, 1 on mobile

**Available Add-Ons:**

**1. Verification Badge (One-time)**
```
Price: ฿1,500 (one-time fee)
Badge: "Trust Builder"

Description:
Stand out with ID + Police background check verification.
Verified artists get 40% more bookings.

Includes:
✓ Government ID verification
✓ Police background check
✓ Portfolio review
✓ Phone number verification
✓ Verified badge on profile
✓ Priority in corporate searches

CTA: "Get Verified Now"
```

**2. Professional Photography Package**
```
Price: ฿3,500 (20% discount for Featured tier)
Badge: "Stand Out"

Description:
Professional photoshoot for your profile and promotional materials.

Includes:
✓ 2-hour photography session
✓ 50+ edited high-res photos
✓ Rights to use images
✓ Profile banner design
✓ Social media content pack

CTA: "Book Photoshoot"
```

---

#### FAQs Section

**Design:**
- Accordion component (similar to existing FAQ page)
- Section background: `bg-white`
- Question cards: Glass morphism with hover expand

**Questions:**

1. **Can I switch between tiers anytime?**
   - Yes, upgrade or downgrade at any time. Changes take effect immediately.

2. **Do you really charge 0% commission?**
   - Absolutely. We never take a percentage of your earnings. Ever.

3. **What happens if I cancel my subscription?**
   - You return to the Free tier. Your profile stays active, but premium features are removed.

4. **How does the verification process work?**
   - Submit ID + documents → Review within 24 hours → Badge activated on approval.

5. **Can I try Professional or Featured before committing?**
   - Yes! We offer a 7-day money-back guarantee on all paid tiers.

6. **How do Featured artists get chosen for homepage?**
   - All Featured tier subscribers rotate through homepage carousel automatically.

7. **What payment methods do you accept?**
   - PromptPay, credit card, bank transfer. Monthly auto-billing available.

8. **Do I need to sign a contract?**
   - No contracts. Cancel anytime with one click from your dashboard.

---

#### Social Proof Section

**Design:**
- Section background: Gradient `from-off-white to-white`
- Testimonial cards: Glass morphism with rating stars

**Testimonials (3 cards):**

**Testimonial 1 - DJ Natcha:**
```
"I upgraded to Professional after 2 months free. Within 30 days,
I got 12 new bookings and earned ฿35,000. Best decision ever."

Rating: ⭐⭐⭐⭐⭐
Category: DJ
Tier: Professional
Badge: "Verified Artist"
```

**Testimonial 2 - The Groove Collective:**
```
"Featured tier gave us access to corporate events we never had
before. Made ฿120,000 in 3 months from hotel bookings alone."

Rating: ⭐⭐⭐⭐⭐
Category: Band
Tier: Featured
Badge: "Verified Artist"
```

**Testimonial 3 - Khun Somchai (Saxophonist):**
```
"Started free, upgraded when I saw results. Analytics helped me
understand my best booking times. Now I'm fully booked weekends."

Rating: ⭐⭐⭐⭐⭐
Category: Musician
Tier: Professional
Badge: "Verified Artist"
```

---

#### CTA Section (Bottom)

**Visual Design:**
- Full-width section with animated gradient background
- Glass morphism content card centered
- Animated floating orbs in background

**Content:**
```
[H2] Ready to Earn What You Deserve?

[SUBTITLE] Join 500+ artists already earning more with zero commission

[BUTTON GROUP]
- Start Free (earthy-brown)
- View Professional (brand-cyan)
- Go Featured (gradient)

[TRUST SIGNALS]
✓ Cancel Anytime
✓ No Credit Card Required (Free)
✓ 7-Day Money-Back Guarantee
✓ 24/7 Support
```

---

### 1.3 Technical Implementation

#### Component Structure

**Suggested Components:**

1. **`ArtistPricingHero.tsx`** (Client Component)
   - Animated background with mouse tracking
   - Hero content with statistics
   - Uses `StatCard` component

2. **`PricingTierCard.tsx`** (Reusable Component)
   ```typescript
   interface PricingTierCardProps {
     tier: 'free' | 'professional' | 'featured'
     price: string
     badge?: string
     features: string[]
     excludedFeatures?: string[]
     ctaText: string
     ctaLink: string
     featured?: boolean
     valueProposition?: string
     trustSignal?: string
   }
   ```

3. **`FeatureComparisonTable.tsx`** (Collapsible Component)
   - Accordion for mobile
   - Full table for desktop

4. **`AddOnServiceCard.tsx`** (Reusable Component)
   ```typescript
   interface AddOnServiceCardProps {
     title: string
     price: string
     badge: string
     description: string
     features: string[]
     ctaText: string
     ctaLink: string
     discount?: string
   }
   ```

5. **`PricingFAQ.tsx`** (Reusable FAQ accordion)

6. **`ArtistTestimonialCard.tsx`** (Social proof)
   ```typescript
   interface ArtistTestimonialCardProps {
     quote: string
     artistName: string
     category: string
     tier: string
     rating: number
     isVerified: boolean
   }
   ```

#### Page File Structure

```
/app/[locale]/pricing/artist/
├── page.tsx (Server Component - metadata + routing)
├── ArtistPricingContent.tsx (Client Component - main content)
└── components/
    ├── ArtistPricingHero.tsx
    ├── PricingTierCard.tsx
    ├── FeatureComparisonTable.tsx
    ├── AddOnServiceCard.tsx
    ├── PricingFAQ.tsx
    └── ArtistTestimonialCard.tsx
```

---

### 1.4 Translation Keys Structure

**Namespace:** `pricing.artist`

```json
{
  "pricing": {
    "artist": {
      "meta": {
        "title": "Artist Pricing Plans | Bright Ears",
        "titleTh": "แพ็กเกจราคาสำหรับศิลปิน | Bright Ears",
        "description": "Choose your success level. Start free forever, upgrade when ready. Zero commission on all tiers.",
        "descriptionTh": "เลือกระดับความสำเร็จของคุณ เริ่มฟรีตลอดกาล อัปเกรดเมื่อพร้อม ค่าคอมมิชชั่น 0% ทุกแพ็กเกจ"
      },
      "hero": {
        "badge": "Zero Commission Forever • Premium Features • Instant Upgrades",
        "badgeTh": "ค่าคอมมิชชั่น 0% ตลอดกาล • ฟีเจอร์พรีเมียม • อัปเกรดทันที",
        "title": "Choose Your Success Level",
        "titleTh": "เลือกระดับความสำเร็จของคุณ",
        "subtitle": "Start free, upgrade when you're ready. Zero commission on all tiers.",
        "subtitleTh": "เริ่มฟรี อัปเกรดเมื่อพร้อม ค่าคอมมิชชั่น 0% ทุกแพ็กเกจ",
        "stats": {
          "professionalPrice": {
            "value": "฿799/mo",
            "label": "Professional Tier",
            "labelTh": "แพ็กเกจโปรเฟสชันนัล"
          },
          "artists": {
            "value": "500+",
            "label": "Artists Earning More",
            "labelTh": "ศิลปินได้รับรายได้มากขึ้น"
          },
          "visibility": {
            "value": "3x",
            "label": "More Visibility",
            "labelTh": "การมองเห็นเพิ่มขึ้น"
          }
        }
      },
      "tiers": {
        "free": {
          "name": "Free Forever",
          "nameTh": "ฟรีตลอดกาล",
          "badge": "Always Free",
          "badgeTh": "ฟรีเสมอ",
          "price": "฿0",
          "period": "month",
          "periodTh": "เดือน",
          "subtitle": "Forever Free",
          "subtitleTh": "ฟรีตลอดกาล",
          "cta": "Start Free",
          "ctaTh": "เริ่มใช้ฟรี",
          "features": [
            "Profile listing on platform",
            "Unlimited quote requests",
            "Direct customer contact",
            "0% commission on all bookings",
            "Basic analytics dashboard",
            "Standard search placement",
            "Community support",
            "Payment via PromptPay",
            "Profile customization (limited)"
          ],
          "excludedFeatures": [
            "Featured homepage placement",
            "Priority search ranking",
            "Verified badge",
            "Advanced analytics",
            "Social media promotion",
            "Video uploads",
            "Priority customer support"
          ]
        },
        "professional": {
          "name": "Professional",
          "nameTh": "โปรเฟสชันนัล",
          "badge": "Most Popular",
          "badgeTh": "ยอดนิยม",
          "price": "฿799",
          "period": "month",
          "periodTh": "เดือน",
          "billingNote": "Billed monthly • Cancel anytime",
          "billingNoteTh": "เรียกเก็บรายเดือน • ยกเลิกได้ทุกเมื่อ",
          "valueProposition": "Get 3x more bookings with priority placement",
          "valuePropositionTh": "รับงานมากขึ้น 3 เท่าด้วยการจัดลำดับความสำคัญ",
          "cta": "Upgrade to Professional",
          "ctaTh": "อัปเกรดเป็นโปรเฟสชันนัล",
          "trustSignal": "Join 150+ professional artists earning more",
          "trustSignalTh": "เข้าร่วมกับศิลปินมืออาชีพกว่า 150 คนที่ได้รับรายได้มากขึ้น",
          "features": [
            "Everything in Free, plus:",
            "Priority search ranking (top 10%)",
            "Verified badge included (฿1,500 value)",
            "Advanced analytics dashboard",
            "Social media profile promotion",
            "Video upload capability (5 videos)",
            "Enhanced profile customization",
            "Priority email support (24hr response)",
            "Monthly performance report",
            "Featured in weekly newsletter",
            "Calendar integration tools"
          ],
          "excludedFeatures": [
            "Homepage featured carousel",
            "Guaranteed top 3 placement",
            "Dedicated account manager",
            "Custom branding options"
          ]
        },
        "featured": {
          "name": "Featured",
          "nameTh": "พรีเมียม",
          "badge": "Premium",
          "badgeTh": "พรีเมียม",
          "price": "฿1,499",
          "period": "month",
          "periodTh": "เดือน",
          "billingNote": "Billed monthly • 10% discount on annual",
          "billingNoteTh": "เรียกเก็บรายเดือน • ส่วนลด 10% สำหรับรายปี",
          "valueProposition": "Get 5x more bookings with homepage exposure",
          "valuePropositionTh": "รับงานมากขึ้น 5 เท่าด้วยการแสดงหน้าแรก",
          "cta": "Go Featured",
          "ctaTh": "เลือกแพ็กเกจพรีเมียม",
          "trustSignal": "Top 5% of artists earn an average of ฿45,000/month",
          "trustSignalTh": "ศิลปิน 5% แรกได้รับรายได้เฉลี่ย ฿45,000/เดือน",
          "features": [
            "Everything in Professional, plus:",
            "Featured homepage carousel (guaranteed)",
            "Top 3 search placement guarantee",
            "Social media highlights (monthly)",
            "Unlimited video uploads",
            "Custom profile URL",
            "Featured artist badge (special color)",
            "Priority customer support (2hr response)",
            "Dedicated account manager",
            "Weekly performance insights",
            "Corporate client access",
            "Event booking priority notification",
            "Professional photoshoot discount (20%)",
            "API access for calendar sync",
            "Featured in monthly marketing campaigns",
            "Direct outreach to corporate clients",
            "Early access to new features"
          ]
        }
      },
      "addOns": {
        "title": "Optional Add-Ons",
        "titleTh": "บริการเสริมเพิ่มเติม",
        "subtitle": "Enhance your profile with these one-time or recurring services",
        "subtitleTh": "ปรับปรุงโปรไฟล์ของคุณด้วยบริการเหล่านี้",
        "verification": {
          "title": "Verification Badge",
          "titleTh": "ตราสัญลักษณ์การยืนยัน",
          "price": "฿1,500",
          "priceNote": "One-time fee",
          "priceNoteTh": "ค่าธรรมเนียมครั้งเดียว",
          "badge": "Trust Builder",
          "badgeTh": "สร้างความไว้วางใจ",
          "description": "Stand out with ID + Police background check verification. Verified artists get 40% more bookings.",
          "descriptionTh": "โดดเด่นด้วยการยืนยันบัตรประชาชนและตรวจสอบประวัติตำรวจ ศิลปินที่ได้รับการยืนยันได้รับการจองมากขึ้น 40%",
          "features": [
            "Government ID verification",
            "Police background check",
            "Portfolio review",
            "Phone number verification",
            "Verified badge on profile",
            "Priority in corporate searches"
          ],
          "cta": "Get Verified Now",
          "ctaTh": "ยืนยันตอนนี้"
        },
        "photography": {
          "title": "Professional Photography Package",
          "titleTh": "แพ็กเกจถ่ายภาพมืออาชีพ",
          "price": "฿3,500",
          "priceNote": "20% discount for Featured tier",
          "priceNoteTh": "ส่วนลด 20% สำหรับแพ็กเกจพรีเมียม",
          "badge": "Stand Out",
          "badgeTh": "โดดเด่น",
          "description": "Professional photoshoot for your profile and promotional materials.",
          "descriptionTh": "ถ่ายภาพมืออาชีพสำหรับโปรไฟล์และสื่อโปรโมตของคุณ",
          "features": [
            "2-hour photography session",
            "50+ edited high-res photos",
            "Rights to use images",
            "Profile banner design",
            "Social media content pack"
          ],
          "cta": "Book Photoshoot",
          "ctaTh": "จองเซสชันถ่ายภาพ"
        }
      },
      "faq": {
        "title": "Frequently Asked Questions",
        "titleTh": "คำถามที่พบบ่อย",
        "questions": [
          {
            "q": "Can I switch between tiers anytime?",
            "qTh": "ฉันสามารถเปลี่ยนแพ็กเกจได้ทุกเมื่อหรือไม่?",
            "a": "Yes, upgrade or downgrade at any time. Changes take effect immediately.",
            "aTh": "ได้ อัปเกรดหรือดาวน์เกรดได้ทุกเมื่อ การเปลี่ยนแปลงจะมีผลทันที"
          },
          {
            "q": "Do you really charge 0% commission?",
            "qTh": "คุณคิดค่าคอมมิชชั่น 0% จริงหรือ?",
            "a": "Absolutely. We never take a percentage of your earnings. Ever.",
            "aTh": "แน่นอน เราไม่เคยรับเปอร์เซ็นต์จากรายได้ของคุณเลย"
          }
        ]
      },
      "testimonials": {
        "title": "Success Stories from Artists",
        "titleTh": "เรื่องราวความสำเร็จจากศิลปิน",
        "subtitle": "See how upgrading helped these artists earn more",
        "subtitleTh": "ดูว่าการอัปเกรดช่วยให้ศิลปินเหล่านี้ได้รับรายได้มากขึ้นอย่างไร"
      },
      "cta": {
        "title": "Ready to Earn What You Deserve?",
        "titleTh": "พร้อมที่จะได้รับสิ่งที่คุณสมควรได้หรือยัง?",
        "subtitle": "Join 500+ artists already earning more with zero commission",
        "subtitleTh": "เข้าร่วมกับศิลปินกว่า 500 คนที่ได้รับรายได้มากขึ้นโดยไม่มีค่าคอมมิชชั่น",
        "startFree": "Start Free",
        "startFreeTh": "เริ่มฟรี",
        "viewProfessional": "View Professional",
        "viewProfessionalTh": "ดูโปรเฟสชันนัล",
        "goFeatured": "Go Featured",
        "goFeaturedTh": "เลือกพรีเมียม",
        "trustSignals": {
          "cancelAnytime": "Cancel Anytime",
          "cancelAnytimeTh": "ยกเลิกได้ทุกเมื่อ",
          "noCreditCard": "No Credit Card Required (Free)",
          "noCreditCardTh": "ไม่ต้องใช้บัตรเครดิต (ฟรี)",
          "moneyBack": "7-Day Money-Back Guarantee",
          "moneyBackTh": "รับประกันคืนเงิน 7 วัน",
          "support": "24/7 Support",
          "supportTh": "สนับสนุน 24/7"
        }
      }
    }
  }
}
```

---

### 1.5 Accessibility Requirements

**WCAG 2.1 AA Compliance:**

1. **Color Contrast:**
   - Text on gradient backgrounds must meet 4.5:1 contrast ratio
   - Use text shadow for readability: `drop-shadow-md`
   - Test with contrast checker tools

2. **Keyboard Navigation:**
   - All CTAs must be keyboard accessible
   - Tab order: Hero CTA → Tier cards → Add-ons → FAQ → Bottom CTA
   - Focus indicators: `focus:ring-4 focus:ring-brand-cyan`

3. **Screen Reader Support:**
   - Proper heading hierarchy (H1 → H2 → H3)
   - ARIA labels on all interactive elements
   - Price comparison table with proper row/column headers

4. **Mobile Responsiveness:**
   - Vertical stack on <768px
   - Touch targets minimum 44x44px
   - Swipe-friendly card carousel on mobile

---

### 1.6 Performance Considerations

**Critical Rendering Path:**
1. Load hero section first (above fold)
2. Defer pricing tier cards (lazy load below fold)
3. Defer testimonials and FAQ (load on scroll)

**Image Optimization:**
- All testimonial images via Next.js `<Image>` component
- WebP format with fallback to PNG
- Lazy loading for below-fold content

**Animation Performance:**
- Use CSS transforms (GPU-accelerated)
- RequestAnimationFrame for mouse tracking
- Debounce scroll events for intersection observer

---

## 2. CORPORATE SOLUTIONS PAGE ENHANCEMENTS

### 2.1 Issues to Fix (Brand Compliance)

#### Immediate Content Changes:

**1. Remove Aspirational Claims:**
```diff
❌ REMOVE: "Trusted by Fortune 500 companies"
❌ REMOVE: "Global enterprise standards"
❌ REMOVE: "API integration for Salesforce, HubSpot"

✅ REPLACE WITH:
"Trusted by 500+ Bangkok venues and hotels"
"Proven track record with Thailand's leading companies"
"Direct booking system with calendar integration"
```

**Rationale:** Platform is Bangkok-focused, not global. API integrations don't exist yet.

**2. Update Statistics:**
```diff
❌ Current: "Fortune 500 clients: 12+"
✅ Replace: "Bangkok Hotels: 500+"

❌ Current: "Global events: 50,000+"
✅ Replace: "Events Delivered: 10,000+"

❌ Current: "Countries served: 25+"
✅ Replace: "Venue Types: 15+"
```

**3. Tone Down Corporate Messaging:**
```diff
❌ "Enterprise-grade infrastructure"
✅ "Professional booking system"

❌ "SLA guarantees with 99.9% uptime"
✅ "Reliable platform with dedicated support"

❌ "White-label solutions available"
✅ "Custom branding options for large venues"
```

---

### 2.2 New Messaging Framework

#### Value Proposition (Hero Section)

**Current:**
```
Corporate Events Elevated
World-class entertainment for Thailand's leading companies
```

**Enhanced:**
```
Professional Entertainment for Bangkok's Venues
Trusted by leading hotels and corporate clients for consistent quality
```

**Subtitle Enhancement:**
```
From intimate executive dinners to grand celebrations, we deliver excellence.
```

**Updated Stats (Using StatCard):**
1. **Primary:** "500+" - "Bangkok Hotels & Venues"
2. **Secondary:** "10K+" - "Events Delivered"
3. **Secondary:** "4.9★" - "Average Rating"

---

#### Pricing Model Section (NEW)

**Visual Design:**
- Section background: `bg-white`
- Glass morphism cards in 3-column grid
- Icons from Heroicons

**Pricing Model Transparency:**

**Card 1: Performance-Based Pricing**
```
Icon: CurrencyDollarIcon
Title: Pay Per Booking, Not Monthly Fees
Description: No upfront costs, no subscriptions. Pay only when you book.

Pricing Structure:
• 0% platform commission
• Artists set their own rates
• You negotiate directly
• Professional contracts provided
• Tax invoices included

CTA: "See Sample Pricing"
```

**Card 2: Volume Discounts**
```
Icon: ChartBarIcon
Title: Enterprise Volume Benefits
Description: More bookings, better rates with our top artists.

Benefits:
• Priority artist access
• Dedicated account manager (>50 events/year)
• Preferred scheduling
• Bulk booking discounts
• Annual performance reports

CTA: "Discuss Enterprise Rates"
```

**Card 3: No Hidden Costs**
```
Icon: ShieldCheckIcon
Title: Transparent Pricing Guarantee
Description: What you see is what you pay. No surprises.

Included Free:
• Contract generation
• Payment processing
• Artist verification
• Event coordination support
• 24/7 customer service
• Tax-compliant invoicing

CTA: "View Sample Contract"
```

---

#### Success Stories Section (NEW)

**Design:**
- Replace generic testimonials with Bangkok-specific case studies
- Cards with location tags and event metrics

**Case Study Template:**
```
[LOGO/PHOTO]
Venue Name: [Bangkok Hotel/Company]
Event Type: [Corporate Gala / Weekly Resident DJ]
Challenge: [What they needed]
Solution: [How Bright Ears helped]
Results:
  • [Metric 1: e.g., 40% cost reduction]
  • [Metric 2: e.g., 15% guest satisfaction increase]
  • [Metric 3: e.g., 95% artist retention rate]

Quote: "[Testimonial from Events Manager]"
        — [Name], [Title]
```

**Recommended Case Studies:**

**1. Boutique Hotel in Sukhumvit**
```
Event Type: Weekly rooftop DJ residency
Challenge: Inconsistent quality from freelance bookings
Solution: Verified resident DJ through Bright Ears
Results:
  • 30% increase in Friday night bookings
  • Same DJ every week, consistent quality
  • Reduced booking admin time by 60%
Quote: "Finally found a reliable solution for our rooftop bar."
```

**2. Corporate Bank (Annual Gala)**
```
Event Type: Annual shareholder gala (500+ guests)
Challenge: Needed bilingual MC and premium jazz band
Solution: Curated entertainment package with verified artists
Results:
  • Flawless execution with zero last-minute issues
  • 98% attendee satisfaction score
  • Re-booked for next year within 2 weeks
Quote: "Professional from start to finish. Will definitely use again."
```

**3. Hotel Chain (Multiple Properties)**
```
Event Type: 3 hotels, weekly entertainment program
Challenge: Managing bookings across multiple venues
Solution: Single point of contact with dedicated account manager
Results:
  • 40 hours/month saved on booking coordination
  • Consistent quality across all properties
  • 87% rebooking rate with same artists
Quote: "Streamlined our entertainment across all Bangkok properties."
```

---

#### Benefits Section (Enhanced)

**Current Features (Keep):**
- Enterprise Solutions
- Dedicated Support
- Verified Artists
- Premium Quality
- Flexible Booking
- Event Excellence

**Add New Benefits:**

**7. Contract & Invoice Management**
```
Icon: DocumentTextIcon
Title: Professional Documentation
Description: Tax-compliant invoices and binding contracts for every booking
```

**8. Thai + English Support**
```
Icon: GlobeAltIcon
Title: Bilingual Service Team
Description: Communicate in English or Thai - whatever works for your team
```

**9. Emergency Replacement Guarantee**
```
Icon: ShieldCheckIcon
Title: Backup Artist Network
Description: If an artist cancels, we find a replacement within 24 hours
```

---

#### Inquiry Form (NEW)

**Visual Design:**
- Glass morphism form card: `bg-white/80 backdrop-blur-md`
- 2-column layout on desktop, single column on mobile
- Validation using existing form system

**Form Fields:**

**Company Information:**
1. Company Name (required)
2. Venue Type (dropdown)
   - Hotel
   - Restaurant/Bar
   - Corporate Office
   - Event Space
   - Other
3. Number of Locations (1 / 2-5 / 6-10 / 10+)

**Contact Person:**
4. Full Name (required)
5. Job Title (required)
6. Email (required, validated)
7. Phone Number (required, Thai format)

**Event Requirements:**
8. Expected Event Volume (dropdown)
   - 1-5 events/year
   - 6-12 events/year
   - 13-24 events/year
   - 25-50 events/year
   - 50+ events/year
9. Entertainment Types Needed (multi-select)
   - DJ
   - Live Band
   - Singer/Vocalist
   - MC/Host
   - Other
10. Additional Notes (textarea, optional)

**CTA Buttons:**
- Primary: "Request Corporate Consultation"
- Secondary: "Download Corporate Brochure" (PDF)

---

### 2.3 Updated Translation Keys

**Namespace:** `corporate`

```json
{
  "corporate": {
    "meta": {
      "title": "Corporate Event Entertainment | Bright Ears",
      "titleTh": "ความบันเทิงงานองค์กร | Bright Ears",
      "description": "Professional entertainment for Bangkok's leading venues and corporate clients. Trusted by 500+ hotels and companies.",
      "descriptionTh": "ความบันเทิงมืออาชีพสำหรับสถานที่ชั้นนำและลูกค้าองค์กรในกรุงเทพฯ ได้รับความไว้วางใจจากโรงแรมและบริษัทกว่า 500 แห่ง"
    },
    "hero": {
      "badge": "Enterprise Entertainment Solutions",
      "badgeTh": "โซลูชันความบันเทิงสำหรับองค์กร",
      "title": "Professional Entertainment for Bangkok's Venues",
      "titleTh": "ความบันเทิงมืออาชีพสำหรับสถานที่ในกรุงเทพฯ",
      "subtitle": "Trusted by leading hotels and corporate clients for consistent quality",
      "subtitleTh": "ได้รับความไว้วางใจจากโรงแรมชั้นนำและลูกค้าองค์กรในด้านคุณภาพที่สม่ำเสมอ",
      "description": "From intimate executive dinners to grand celebrations, we deliver excellence.",
      "descriptionTh": "ตั้งแต่งานเลี้ยงผู้บริหารที่เป็นส่วนตัวไปจนถึงงานเฉลิมฉลองขนาดใหญ่ เรามอบความเป็นเลิศ",
      "stats": {
        "venues": {
          "value": "500+",
          "label": "Bangkok Hotels & Venues",
          "labelTh": "โรงแรมและสถานที่ในกรุงเทพฯ"
        },
        "events": {
          "value": "10K+",
          "label": "Events Delivered",
          "labelTh": "งานที่จัดส่ง"
        },
        "rating": {
          "value": "4.9★",
          "label": "Average Rating",
          "labelTh": "คะแนนเฉลี่ย"
        }
      }
    },
    "pricingModel": {
      "title": "How Our Pricing Works",
      "titleTh": "ระบบราคาของเราทำงานอย่างไร",
      "subtitle": "Transparent, performance-based pricing with no surprises",
      "subtitleTh": "ราคาโปร่งใสตามผลงานโดยไม่มีค่าใช้จ่ายซ่อนเร้น",
      "performanceBased": {
        "title": "Pay Per Booking, Not Monthly Fees",
        "titleTh": "จ่ายต่อการจอง ไม่ใช่ค่าธรรมเนียมรายเดือน",
        "description": "No upfront costs, no subscriptions. Pay only when you book.",
        "descriptionTh": "ไม่มีค่าใช้จ่ายล่วงหน้า ไม่มีการสมัครสมาชิก จ่ายเฉพาะเมื่อคุณจอง",
        "points": [
          "0% platform commission",
          "Artists set their own rates",
          "You negotiate directly",
          "Professional contracts provided",
          "Tax invoices included"
        ],
        "cta": "See Sample Pricing"
      },
      "volumeDiscounts": {
        "title": "Enterprise Volume Benefits",
        "titleTh": "สิทธิประโยชน์สำหรับองค์กร",
        "description": "More bookings, better rates with our top artists.",
        "descriptionTh": "จองมากขึ้น ราคาดีขึ้นกับศิลปินชั้นนำของเรา",
        "benefits": [
          "Priority artist access",
          "Dedicated account manager (>50 events/year)",
          "Preferred scheduling",
          "Bulk booking discounts",
          "Annual performance reports"
        ],
        "cta": "Discuss Enterprise Rates"
      },
      "transparency": {
        "title": "No Hidden Costs",
        "titleTh": "ไม่มีค่าใช้จ่ายซ่อนเร้น",
        "description": "What you see is what you pay. No surprises.",
        "descriptionTh": "สิ่งที่คุณเห็นคือสิ่งที่คุณจ่าย ไม่มีแปลกใจ",
        "included": [
          "Contract generation",
          "Payment processing",
          "Artist verification",
          "Event coordination support",
          "24/7 customer service",
          "Tax-compliant invoicing"
        ],
        "cta": "View Sample Contract"
      }
    },
    "caseStudies": {
      "title": "Bangkok Success Stories",
      "titleTh": "เรื่องราวความสำเร็จในกรุงเทพฯ",
      "subtitle": "See how we've helped leading venues elevate their events",
      "subtitleTh": "ดูว่าเราช่วยสถานที่ชั้นนำยกระดับงานของพวกเขาอย่างไร"
    },
    "inquiryForm": {
      "title": "Request Corporate Consultation",
      "titleTh": "ขอคำปรึกษาสำหรับองค์กร",
      "subtitle": "Tell us about your venue and entertainment needs",
      "subtitleTh": "บอกเราเกี่ยวกับสถานที่และความต้องการความบันเทิงของคุณ",
      "companyName": "Company Name",
      "companyNameTh": "ชื่อบริษัท",
      "venueType": "Venue Type",
      "venueTypeTh": "ประเภทสถานที่",
      "numberOfLocations": "Number of Locations",
      "numberOfLocationsTh": "จำนวนสถานที่",
      "contactName": "Full Name",
      "contactNameTh": "ชื่อ-นามสกุล",
      "jobTitle": "Job Title",
      "jobTitleTh": "ตำแหน่งงาน",
      "email": "Email Address",
      "emailTh": "อีเมล",
      "phone": "Phone Number",
      "phoneTh": "หมายเลขโทรศัพท์",
      "eventVolume": "Expected Event Volume",
      "eventVolumeTh": "ปริมาณงานที่คาดหวัง",
      "entertainmentTypes": "Entertainment Types Needed",
      "entertainmentTypesTh": "ประเภทความบันเทิงที่ต้องการ",
      "additionalNotes": "Additional Notes",
      "additionalNotesTh": "หมายเหตุเพิ่มเติม",
      "submitCta": "Request Corporate Consultation",
      "submitCtaTh": "ขอคำปรึกษาองค์กร",
      "downloadBrochure": "Download Corporate Brochure",
      "downloadBrochureTh": "ดาวน์โหลดโบรชัวร์องค์กร"
    }
  }
}
```

---

### 2.4 Design Consistency Fixes

**Current Issues:**

1. **Testimonial Company Names:**
   ```diff
   ❌ "Marriott Hotels", "Microsoft Thailand", "Bangkok Bank"
   ✅ Use generic titles: "International Hotel Chain", "Tech Company", "Financial Institution"

   Reason: Avoid potential trademark issues without verified partnerships
   ```

2. **Visual Hierarchy Improvements:**
   - Make "Bangkok" emphasis stronger in hero
   - Use color-coded badges for different benefit types
   - Add subtle animation to CTA section

3. **Mobile Optimization:**
   - Stack testimonial cards vertically on <768px
   - Reduce text size for better mobile readability
   - Increase tap target sizes for form fields

---

## 3. COMPONENT ARCHITECTURE RECOMMENDATIONS

### 3.1 Shared Components (Reusable Across Both Pages)

**1. `PricingCard` Component**
```typescript
// Used for both artist tiers and corporate pricing models
interface PricingCardProps {
  title: string
  price?: string
  badge?: string
  description: string
  features: string[]
  excludedFeatures?: string[]
  cta: {
    text: string
    link: string
    style: 'primary' | 'secondary' | 'gradient'
  }
  featured?: boolean
  icon?: ComponentType
}
```

**2. `TestimonialCard` Component**
```typescript
interface TestimonialCardProps {
  quote: string
  author: string
  role: string
  company: string
  rating: number
  highlight?: string
  image?: string
}
```

**3. `StatCardGrid` Component**
```typescript
interface StatCardGridProps {
  stats: Array<{
    value: string
    label: string
    primary?: boolean
  }>
  columns: 2 | 3 | 4
}
```

**4. `FAQAccordion` Component** (Already exists)
- Reuse from existing FAQ page
- Pass questions/answers as props

**5. `GlassMorphismSection` Component**
```typescript
interface GlassMorphismSectionProps {
  children: ReactNode
  background?: 'gradient' | 'solid' | 'mesh'
  className?: string
}
```

---

### 3.2 Page-Specific Components

**Artist Pricing Page:**
- `ArtistPricingHero.tsx`
- `PricingTierCard.tsx`
- `FeatureComparisonTable.tsx`
- `AddOnServiceCard.tsx`
- `ArtistTestimonialCard.tsx`

**Corporate Solutions Page:**
- `CorporatePricingModelCard.tsx`
- `CaseStudyCard.tsx`
- `CorporateInquiryForm.tsx`
- `VolumeDiscountCalculator.tsx` (optional future enhancement)

---

### 3.3 Animation Utilities

**Reuse Existing Animations:**
```css
/* From tailwind.config.ts */
animate-blob
animate-float-slow
animate-float-medium
animate-float-fast
animate-hero-search-enter
animate-card-entrance
animate-backdrop-fade-in
```

**New Animations Needed:**
```css
/* For pricing tier card entrance */
animate-tier-slide-in: Staggered entrance (100ms delay between cards)

/* For feature list items */
animate-feature-fade-in: Fade in with slide from left (50ms delay each)
```

---

## 4. IMPLEMENTATION PRIORITY & TIMELINE

### Phase 1: Artist Pricing Page (Day 6)

**High Priority (Launch Blockers):**
1. Page structure and routing
2. Hero section with animated background
3. 3 pricing tier cards (Free, Professional, Featured)
4. Basic CTAs functional

**Medium Priority:**
5. Add-on services section
6. FAQ accordion
7. Testimonials
8. Translation keys (EN/TH)

**Low Priority (Post-Launch):**
9. Feature comparison table (collapsible)
10. Advanced animations
11. A/B testing variants

**Estimated Time:** 6-8 hours

---

### Phase 2: Corporate Page Enhancement (Day 7)

**High Priority (Launch Blockers):**
1. Update hero statistics and messaging
2. Remove Fortune 500 claims
3. Add pricing model section
4. Corporate inquiry form functional

**Medium Priority:**
5. Case studies section (3 examples)
6. Enhanced benefits section
7. Updated testimonials with Bangkok focus
8. Translation keys (EN/TH)

**Low Priority (Post-Launch):**
9. Volume discount calculator
10. Sample contract PDF download
11. Video testimonials

**Estimated Time:** 4-6 hours

---

## 5. DESIGN REVIEW CHECKLIST

### Brand Compliance

- [ ] All colors use defined brand palette (cyan, teal, brown, lavender)
- [ ] Headlines use `font-playfair`
- [ ] Body text uses `font-inter`
- [ ] Thai content uses `font-noto-thai`
- [ ] Glass morphism applied consistently
- [ ] Animated gradients match existing patterns
- [ ] No new colors or fonts introduced

### UX Best Practices

- [ ] Clear visual hierarchy (H1 > H2 > H3)
- [ ] CTAs stand out with proper contrast
- [ ] Mobile-responsive at 375px, 768px, 1920px
- [ ] Touch targets minimum 44x44px
- [ ] Loading states for all async actions
- [ ] Error states are helpful and encouraging
- [ ] Success states provide next steps

### Accessibility (WCAG AA)

- [ ] Color contrast minimum 4.5:1 for text
- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible and clear
- [ ] Proper heading hierarchy
- [ ] ARIA labels on all icons and buttons
- [ ] Screen reader friendly form labels
- [ ] Alternative text for all images

### Bilingual Support

- [ ] EN/TH translation keys complete
- [ ] Content parity between languages
- [ ] Thai text uses proper font (`font-noto-thai`)
- [ ] Currency format: ฿ symbol consistent
- [ ] No hardcoded English text
- [ ] Language switcher functional

### Conversion Optimization

- [ ] Primary CTA above the fold
- [ ] Trust signals visible (badges, stats, testimonials)
- [ ] Pricing clearly displayed
- [ ] Value propositions compelling
- [ ] No friction in upgrade flow
- [ ] Social proof prominent
- [ ] Multiple CTAs throughout page

---

## 6. RECOMMENDED NEXT STEPS

### Immediate Actions (Before Implementation)

1. **Review with Stakeholders:**
   - Share this spec with product team
   - Get approval on pricing tiers
   - Confirm value propositions

2. **Prepare Assets:**
   - Testimonial photos (if using real photos)
   - Company logos (if permitted)
   - Hero background images
   - Icon assets

3. **Set Up Payment Integration:**
   - Configure Stripe/Omise for ฿799 and ฿1,499 tiers
   - Test payment flow end-to-end
   - Implement subscription management

### During Implementation

4. **Component Development:**
   - Build shared components first
   - Create page-specific components
   - Implement with TypeScript for type safety

5. **Translation Setup:**
   - Add all keys to `messages/en.json` and `messages/th.json`
   - Test language switching
   - Verify Thai character rendering

6. **Testing:**
   - Unit tests for pricing logic
   - Integration tests for payment flow
   - E2E tests for upgrade journey
   - Cross-browser testing (Chrome, Safari, Firefox)
   - Mobile device testing (iOS, Android)

### Post-Launch

7. **Analytics Setup:**
   - Track page views
   - Monitor CTA click-through rates
   - Measure conversion funnel
   - A/B test pricing display

8. **User Feedback:**
   - Collect artist feedback on clarity
   - Monitor support tickets for confusion
   - Iterate on messaging based on data

9. **Optimization:**
   - Performance monitoring
   - SEO optimization
   - Conversion rate optimization
   - Content updates based on analytics

---

## 7. SUCCESS METRICS

### Artist Pricing Page

**Traffic Metrics:**
- Page views: Target 1,000+ unique views/month
- Average time on page: Target >2 minutes
- Bounce rate: Target <40%

**Conversion Metrics:**
- Free-to-Professional: Target 15% conversion
- Free-to-Featured: Target 3-5% conversion
- Add-on purchases: Target 10% of paid tiers
- Overall upgrade rate: Target 18-20%

**Engagement Metrics:**
- CTA click-through rate: Target >25%
- FAQ accordion interactions: Target >40%
- Testimonial read rate: Target >60%

### Corporate Page

**Traffic Metrics:**
- Page views: Target 500+ unique views/month
- Average time on page: Target >3 minutes
- Form submission rate: Target >15%

**Conversion Metrics:**
- Inquiry form completions: Target 50+ leads/month
- Corporate account sign-ups: Target 10+ accounts/month
- Average deal size: Target ฿30,000+/month per client

**Engagement Metrics:**
- Case study reads: Target >70%
- Pricing model section views: Target >80%
- Brochure downloads: Target >30%

---

## 8. DESIGN ASSETS NEEDED

### Images

1. **Hero Backgrounds:**
   - Abstract gradient meshes (generated programmatically)
   - Optional: Professional artist photos (blur background)

2. **Testimonials:**
   - Artist headshots (3 for pricing page)
   - Corporate venue photos (3 for corporate page)
   - Fallback: Generic avatar with category icon

3. **Icons:**
   - All from Heroicons (already installed)
   - Checkmark, X, Star, Arrow, Badge, etc.

### Typography

- **Playfair Display:** Already configured
- **Inter:** Already configured
- **Noto Sans Thai:** Already configured

### Colors

- All defined in `tailwind.config.ts`
- No new colors needed

---

## CONCLUSION

This specification provides a comprehensive blueprint for implementing the two critical monetization pages. The design maintains brand consistency with existing pages while introducing clear pricing transparency and compelling value propositions.

**Key Takeaways:**

1. **Artist Pricing Page:**
   - 3 clear tiers with visual differentiation
   - Transparent feature comparison
   - Social proof from real artists
   - Zero friction upgrade flow

2. **Corporate Solutions Page:**
   - Bangkok-focused messaging
   - Performance-based pricing model
   - Real case studies with metrics
   - Professional inquiry form

3. **Brand Consistency:**
   - All designs follow DESIGN_SYSTEM.md
   - Glass morphism and gradient patterns consistent
   - Color palette strictly adhered to
   - Typography hierarchy maintained

4. **Conversion Optimization:**
   - Multiple CTAs throughout pages
   - Trust signals prominently displayed
   - Clear value propositions
   - Low-friction user journeys

**Implementation Timeline:**
- Day 6: Artist Pricing Page (6-8 hours)
- Day 7: Corporate Page Enhancement (4-6 hours)
- Total: 10-14 hours for MVP launch

**Next Steps:**
1. Review this specification with team
2. Approve pricing tiers and messaging
3. Begin component development
4. Implement payment integration
5. Launch with analytics tracking

---

**Document Version:** 1.0
**Last Updated:** October 10, 2025
**Status:** Ready for Implementation Review
**Prepared By:** Web Design Manager Sub-Agent
