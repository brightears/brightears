# Pricing Display Standards for Bright Ears

## Overview

This document defines the standardized pricing display format for the Bright Ears platform, ensuring consistency across all components and adherence to Thai market best practices.

**Last Updated:** October 3, 2025
**Version:** 1.0

---

## Thai Market Best Practices

### Currency Display

**Primary Format:**
- Use **฿** symbol (Thai Baht symbol)
- Format: **฿2,500** (symbol first, no space, comma separators)
- **Never** use "THB" or "Baht" in English context

**Alternative (Thai Language):**
- Use: **2,500 บาท** (number with "บาท" after)
- Example: **2,500 - 5,000 บาท**

### Number Formatting

- **Thousands separators:** Use commas (2,500 not 2500)
- **Decimals:** No decimals for whole numbers (฿2,500 not ฿2,500.00)
- **Range format:** ฿2,500 - ฿5,000 (with spaces around dash)

### Pricing Context

Always provide context with prices:
- Show time unit: "/hour", "/event", "/package"
- Show minimum hours if applicable
- Show deposit requirements clearly
- Show package inclusions

---

## Utility Functions

All pricing utilities are located in `/lib/pricing.ts`

### Core Functions

#### `formatPrice(amount, options?)`
Format any price in Thai Baht.

```typescript
import { formatPrice } from '@/lib/pricing';

// Basic usage
formatPrice(2500) // "฿2,500"

// Without currency
formatPrice(2500, { showCurrency: false }) // "2,500"

// Thai language
formatPrice(2500, { locale: 'th' }) // "2,500 บาท"

// With decimals
formatPrice(2500.50, { showDecimals: true }) // "฿2,500.50"
```

#### `formatHourlyRate(rate, minimumHours?, locale?)`
Format hourly rates with context.

```typescript
import { formatHourlyRate } from '@/lib/pricing';

// Basic hourly rate
formatHourlyRate(2500) // "฿2,500/hour"

// With minimum hours
formatHourlyRate(2500, 3) // "฿2,500/hour (Min. 3 hours)"

// Thai language
formatHourlyRate(2500, 3, 'th') // "2,500 บาท/ชั่วโมง (ขั้นต่ำ 3 ชั่วโมง)"
```

#### `formatPriceRange(min, max, options?)`
Format price ranges.

```typescript
import { formatPriceRange } from '@/lib/pricing';

// Basic range
formatPriceRange(2500, 5000) // "฿2,500 - ฿5,000"

// With unit
formatPriceRange(2500, 5000, { unit: '/hour' }) // "฿2,500 - ฿5,000/hour"

// Thai language
formatPriceRange(2500, 5000, { locale: 'th' }) // "2,500 - 5,000 บาท"
```

#### `formatFromPrice(amount, unit?, locale?)`
Format "starting from" prices.

```typescript
import { formatFromPrice } from '@/lib/pricing';

formatFromPrice(2500, 'hour') // "From ฿2,500/hour"
formatFromPrice(2500, 'hour', 'th') // "เริ่มต้นที่ 2,500 บาท/ชั่วโมง"
```

#### `formatDeposit(amount?, percentage?, locale?)`
Format deposit information.

```typescript
import { formatDeposit } from '@/lib/pricing';

formatDeposit(5000) // "Deposit: ฿5,000"
formatDeposit(null, 30) // "30% deposit required"
formatDeposit(5000, 30, 'th') // "มัดจำ: 5,000 บาท (30%)"
```

---

## UI Components

All pricing components are located in `/components/ui/`

### PriceDisplay Component

Basic price display with consistent formatting.

**Location:** `/components/ui/PriceDisplay.tsx`

**Usage:**
```tsx
import PriceDisplay from '@/components/ui/PriceDisplay';

// Default display
<PriceDisplay amount={2500} />

// Large hero display
<PriceDisplay amount={2500} variant="large" />

// Compact card display
<PriceDisplay amount={2500} variant="compact" />

// Thai language
<PriceDisplay amount={2500} locale="th" />

// Handle missing price
<PriceDisplay amount={null} showFallback={true} />
```

**Props:**
- `amount`: number | null | undefined - Price in Thai Baht
- `variant`: 'default' | 'large' | 'small' | 'compact' - Display size
- `showCurrency`: boolean - Show/hide currency symbol (default: true)
- `locale`: 'en' | 'th' - Force specific locale
- `className`: string - Additional CSS classes
- `showFallback`: boolean - Show "Contact for pricing" when price is missing (default: true)

---

### HourlyRateDisplay Component

Displays hourly rates with context and minimum hours.

**Location:** `/components/ui/HourlyRateDisplay.tsx`

**Usage:**
```tsx
import HourlyRateDisplay from '@/components/ui/HourlyRateDisplay';

// Basic hourly rate
<HourlyRateDisplay rate={2500} />

// With minimum hours context
<HourlyRateDisplay rate={2500} minimumHours={3} />

// Compact card display
<HourlyRateDisplay rate={2500} variant="compact" />

// With "From" label
<HourlyRateDisplay rate={2500} showFromLabel={true} />
```

**Props:**
- `rate`: number | null | undefined - Hourly rate in Thai Baht
- `minimumHours`: number - Minimum booking hours
- `locale`: 'en' | 'th' - Force specific locale
- `variant`: 'default' | 'compact' | 'card' - Display variant
- `showFromLabel`: boolean - Show "From" label for starting prices
- `className`: string - Additional CSS classes

---

### PriceRangeDisplay Component

Displays price ranges consistently.

**Location:** `/components/ui/PriceRangeDisplay.tsx`

**Usage:**
```tsx
import PriceRangeDisplay from '@/components/ui/PriceRangeDisplay';

// Basic price range
<PriceRangeDisplay min={2500} max={5000} />

// With unit label
<PriceRangeDisplay min={2500} max={5000} unit="/hour" />

// Compact display for filters
<PriceRangeDisplay min={2500} max={5000} variant="compact" />

// Thai language
<PriceRangeDisplay min={2500} max={5000} locale="th" />
```

**Props:**
- `min`: number | null | undefined - Minimum price in Thai Baht
- `max`: number | null | undefined - Maximum price in Thai Baht
- `locale`: 'en' | 'th' - Force specific locale
- `variant`: 'default' | 'compact' - Display variant
- `className`: string - Additional CSS classes
- `unit`: string - Unit label (e.g., "/hour", "/event")

---

### PackagePriceCard Component

Displays package pricing with inclusions in card format.

**Location:** `/components/ui/PackagePriceCard.tsx`

**Usage:**
```tsx
import PackagePriceCard from '@/components/ui/PackagePriceCard';

// Basic package
<PackagePriceCard
  price={15000}
  duration="4 hours"
  name="Wedding Package"
  includes={["DJ equipment", "MC services", "Music mixing"]}
/>

// Featured package with action
<PackagePriceCard
  price={25000}
  duration="Full event"
  name="Premium Package"
  includes={["Full equipment", "Backup DJ", "Custom playlist"]}
  featured={true}
  onSelect={() => handleSelect()}
/>
```

**Props:**
- `price`: number | null | undefined - Package price in Thai Baht
- `duration`: string - Package duration description
- `name`: string - Package name/title
- `includes`: string[] - What's included in the package
- `locale`: 'en' | 'th' - Force specific locale
- `onSelect`: () => void - Select/Book handler
- `className`: string - Additional CSS classes
- `featured`: boolean - Highlight as featured/recommended

---

## Typography for Pricing

Follow these typography standards consistently:

### Font Families
- **Currency & Numbers:** `font-inter` (sans-serif)
- **Never** use `font-playfair` for pricing

### Size Variants

**Large Display (Hero, Sticky Bars):**
```tsx
<div className="flex items-baseline gap-2">
  <span className="text-3xl font-bold text-brand-cyan">฿2,500</span>
  <span className="text-base text-dark-gray/60">/hour</span>
</div>
```

**Card Display:**
```tsx
<div className="flex items-baseline gap-1">
  <span className="text-xl font-semibold text-brand-cyan">฿2,500</span>
  <span className="text-sm text-dark-gray/60">/hr</span>
</div>
```

**Compact Display:**
```tsx
<span className="text-base font-medium text-dark-gray">
  From <span className="text-brand-cyan">฿2,500</span>/hr
</span>
```

---

## Color Scheme

Use these colors consistently for pricing elements:

- **Primary price:** `text-brand-cyan` (#00bbe4) - Main emphasis
- **Secondary/context:** `text-dark-gray` (#333333) - Units, labels
- **Range min:** `text-dark-gray/70` - Starting price in ranges
- **Range max:** `text-brand-cyan` - Ending price in ranges (emphasis)
- **Discounts/special:** `text-earthy-brown` or `text-soft-lavender`
- **Missing price:** `text-dark-gray/60 italic` - "Contact for pricing"

---

## Edge Cases

### Handle Missing Prices

Always provide fallback for missing or invalid prices:

```typescript
import { shouldShowContactForPricing, getContactForPricingText } from '@/lib/pricing';

if (shouldShowContactForPricing(price)) {
  return <span className="text-dark-gray/60 italic">
    {getContactForPricingText(locale)}
  </span>;
}
```

### Price Range with Same Min/Max

When min and max are identical, show as single price:

```tsx
// If min === max, components automatically show:
<PriceRangeDisplay min={2500} max={2500} />
// Renders as: ฿2,500 (single price, not range)
```

### Negotiable Pricing

For negotiable prices, use:

```typescript
import { getNegotiableText } from '@/lib/pricing';

<span className="text-brand-cyan">
  {getNegotiableText(locale)} {/* "Negotiable" or "ราคาต่อรองได้" */}
</span>
```

### Package vs Hourly Rates

Clearly distinguish between package and hourly pricing:

```tsx
// Hourly rate
<HourlyRateDisplay rate={2500} />
// Shows: "฿2,500/hour"

// Package price
<PackagePriceCard price={15000} duration="4 hours" />
// Shows: "฿15,000 for 4 hours"
```

---

## Deposit Requirements

Thailand's event booking industry standard is **30% deposit**.

Display deposits clearly:

```tsx
import { formatDeposit } from '@/lib/pricing';

// Amount only
<div className="text-sm text-dark-gray/70">
  {formatDeposit(5000)} {/* "Deposit: ฿5,000" */}
</div>

// Percentage only
<div className="text-sm text-brand-cyan">
  {formatDeposit(null, 30)} {/* "30% deposit required" */}
</div>

// Both amount and percentage
<div className="text-sm text-dark-gray/70">
  {formatDeposit(5000, 30)} {/* "Deposit: ฿5,000 (30%)" */}
</div>
```

---

## Translations

All pricing translations are in `/messages/en.json` and `/messages/th.json` under the `pricing` key.

**English (`en.json`):**
```json
{
  "pricing": {
    "from": "From",
    "perHour": "per hour",
    "perEvent": "per event",
    "minimum": "Min. {hours} hours",
    "contactForPrice": "Contact for pricing",
    "negotiable": "Negotiable",
    "includes": "Includes",
    "deposit": "Deposit: {amount}",
    "depositPercent": "{percent}% deposit required"
  }
}
```

**Thai (`th.json`):**
```json
{
  "pricing": {
    "from": "เริ่มต้นที่",
    "perHour": "ต่อชั่วโมง",
    "perEvent": "ต่องาน",
    "minimum": "ขั้นต่ำ {hours} ชั่วโมง",
    "contactForPrice": "ติดต่อสอบถามราคา",
    "negotiable": "ราคาต่อรองได้",
    "includes": "รวม",
    "deposit": "มัดจำ: {amount} บาท",
    "depositPercent": "ต้องชำระมัดจำ {percent}%"
  }
}
```

**Usage in components:**
```tsx
import { useTranslations } from 'next-intl';

const t = useTranslations('pricing');

<span>{t('from')}</span> // "From" or "เริ่มต้นที่"
<span>{t('minimum', { hours: 3 })}</span> // "Min. 3 hours" or "ขั้นต่ำ 3 ชั่วโมง"
```

---

## Testing Checklist

Before deploying pricing changes, verify:

### Visual Consistency
- [ ] All prices use ฿ symbol consistently
- [ ] All numbers have comma separators (2,500 not 2500)
- [ ] Currency symbol placement is consistent (฿ first)
- [ ] Font sizes match design system variants
- [ ] Colors follow brand guidelines (brand-cyan for prices)
- [ ] Spacing is consistent (no extra spaces after ฿)

### Functional Testing
- [ ] Prices display correctly in both EN and TH locales
- [ ] Missing prices show "Contact for pricing" fallback
- [ ] Price ranges format correctly (min - max)
- [ ] Minimum hours context is shown when applicable
- [ ] Mobile display is readable and responsive
- [ ] "From" labels appear correctly when enabled
- [ ] Deposit information displays properly

### Thai Market Compliance
- [ ] Thai language uses "บาท" correctly
- [ ] Number formatting matches Thai conventions
- [ ] Deposit requirements are clear (30% standard)
- [ ] Package pricing is culturally appropriate
- [ ] No decimal pricing (whole numbers only)

### Component Integration
- [ ] ArtistCard displays hourly rates correctly
- [ ] FilterSidebar shows price ranges properly
- [ ] EnhancedArtistProfile shows pricing in sticky bar
- [ ] QuickInquiryModal displays estimates accurately
- [ ] Search results show consistent pricing format

---

## Migration Guide

### Updating Existing Components

**Before (Old Format):**
```tsx
<span className="text-xl font-bold text-brand-cyan">
  ฿{hourlyRate.toLocaleString()}/hr
</span>
```

**After (New Standardized Format):**
```tsx
import HourlyRateDisplay from '@/components/ui/HourlyRateDisplay';

<HourlyRateDisplay rate={hourlyRate} variant="compact" />
```

### Benefits of Standardization

1. **Consistency:** All prices display the same way across the platform
2. **Internationalization:** Automatic Thai language support
3. **Maintainability:** Update pricing format in one place
4. **Accessibility:** Proper ARIA labels and semantic HTML
5. **Thai Market Compliance:** Follows local conventions automatically

---

## Common Patterns

### Artist Cards

```tsx
import HourlyRateDisplay from '@/components/ui/HourlyRateDisplay';

<div className="artist-card">
  {/* ... artist info ... */}
  {hourlyRate && (
    <HourlyRateDisplay
      rate={hourlyRate}
      variant="compact"
      showFromLabel={true}
    />
  )}
</div>
```

### Profile Pages

```tsx
import HourlyRateDisplay from '@/components/ui/HourlyRateDisplay';

<div className="profile-pricing">
  <HourlyRateDisplay
    rate={artist.hourlyRate}
    minimumHours={artist.minimumHours}
    variant="default"
    showFromLabel={true}
  />
</div>
```

### Filter Sidebars

```tsx
import { formatPrice } from '@/lib/pricing';

<div className="price-range-display">
  {formatPrice(minPrice)} - {formatPrice(maxPrice)}
</div>
```

### Package Selection

```tsx
import PackagePriceCard from '@/components/ui/PackagePriceCard';

<PackagePriceCard
  price={15000}
  duration="4 hours"
  name="Wedding Package"
  includes={[
    "Professional DJ equipment",
    "MC services",
    "Custom music mixing",
    "Backup equipment"
  ]}
  featured={true}
  onSelect={() => handlePackageSelect('wedding')}
/>
```

---

## FAQ

### Q: When should I use formatPrice vs PriceDisplay component?

**A:** Use `formatPrice` utility when you need just the formatted string (e.g., in attributes, calculations, or simple text). Use `PriceDisplay` component when rendering in JSX for consistent styling and responsive design.

### Q: How do I show "Contact for pricing"?

**A:** All pricing components automatically show "Contact for pricing" when the price is null, undefined, or 0. You can also use:

```typescript
import { getContactForPricingText } from '@/lib/pricing';

const fallbackText = getContactForPricingText('en'); // "Contact for pricing"
```

### Q: Should I always show minimum hours?

**A:** Show minimum hours when it's greater than 1. Single hour minimums are implied and don't need to be displayed.

### Q: How do I handle special rates (weekend/holiday)?

**A:** Currently handled outside pricing components. Add a badge or label near the pricing:

```tsx
<div className="flex items-center gap-2">
  <HourlyRateDisplay rate={weekendRate} />
  <span className="text-xs bg-soft-lavender/20 text-soft-lavender px-2 py-1 rounded">
    Weekend Rate
  </span>
</div>
```

### Q: What about VAT (7% in Thailand)?

**A:** Display prices before VAT. Add a small note if needed:

```tsx
<div className="space-y-1">
  <PriceDisplay amount={price} />
  <p className="text-xs text-dark-gray/60">
    {locale === 'th' ? '+ ภาษีมูลค่าเพิ่ม 7%' : '+ 7% VAT'}
  </p>
</div>
```

---

## Support

For questions about pricing standards:
- Review this document first
- Check `/lib/pricing.ts` for available utilities
- Check `/components/ui/` for component examples
- Refer to Thai market best practices section

---

**Document End**

*Standardized pricing ensures a professional, trustworthy platform for Thailand's entertainment booking market.*
