# Pricing Display Logic Documentation

## Overview
This document defines the pricing display logic and standards for the Bright Ears platform to ensure consistency across all artist profiles and prevent pricing discrepancies.

## Issue Fixed (October 5, 2025)

### Problem Identified
- **Artist**: Temple Bass (Magician)
- **Issue**: Pricing inconsistency between sections
  - Sticky Action Bar: Showing "From ฿12,000/hour" ✅ (correct)
  - Overview Tab: Showing "฿2,500/hour" ❌ (incorrect default)
- **Root Cause**: `ArtistProfileTabs` component was using non-existent `artist.baseRate` field instead of `artist.hourlyRate`

### Solution Implemented
1. Fixed `ArtistProfileTabs.tsx` to use `artist.hourlyRate` instead of `artist.baseRate`
2. Removed fallback to non-existent `baseRate` field in `EnhancedArtistProfile.tsx`
3. Added proper minimum hours display in pricing section
4. Created validation utilities to prevent future inconsistencies

## Database Schema

### Artist Pricing Fields
```prisma
model Artist {
  hourlyRate      Decimal  @db.Decimal(10, 2)  // Base hourly rate in THB
  minimumHours    Int      @default(3)         // Minimum booking hours
  currency        String   @default("THB")      // Currency (always THB for Thailand)
  weekendPricing  Decimal? @db.Decimal(10, 2)  // Optional weekend rate
  holidayPricing  Decimal? @db.Decimal(10, 2)  // Optional holiday rate
}
```

### Important Notes
- **NO `baseRate` field exists** - Always use `hourlyRate`
- Prices are stored as Decimal type for precision
- All prices are in Thai Baht (THB)

## Pricing Display Locations

### 1. Sticky Action Bar
**Component**: `EnhancedArtistProfile.tsx`
**Display Component**: `HourlyRateDisplay`
```tsx
<HourlyRateDisplay
  rate={artist.hourlyRate}
  minimumHours={artist.minimumHours}
  variant="default"
  showFromLabel={true}
/>
```
**Shows**: "From ฿12,000/hour (Min. 3 hours)"

### 2. Overview Tab - Pricing Section
**Component**: `ArtistProfileTabs.tsx`
**Direct Display**:
```tsx
฿{artist.hourlyRate?.toLocaleString() || 'Contact for pricing'}/hour
```
**Shows**: "฿12,000/hour" with minimum hours note

### 3. Artist Cards (Browse/Search)
**Component**: `ArtistCard.tsx`
**Display Component**: `HourlyRateDisplay`
```tsx
<HourlyRateDisplay
  rate={artist.hourlyRate}
  variant="compact"
/>
```
**Shows**: Compact pricing display

## API Data Flow

### Individual Artist Endpoint
`GET /api/artists/[id]`
```typescript
return {
  ...artist,
  hourlyRate: artist.hourlyRate ? artist.hourlyRate.toNumber() : null,
  minimumHours: artist.minimumHours,
  // Other fields...
}
```

### Artist List Endpoint
`GET /api/artists`
```typescript
return {
  hourlyRate: hourlyRate ? parseFloat(hourlyRate.toString()) : null,
  // Other fields...
}
```

## Pricing Display Rules

### 1. Valid Pricing
- Display actual hourly rate with currency symbol
- Show minimum hours if > 1
- Format with thousand separators (e.g., ฿12,000)

### 2. Missing Pricing
- Display "Contact for pricing" text
- Never show ฿0 or default placeholder values
- Use italic styling to differentiate

### 3. Formatting Standards
```typescript
// Standard format
"฿12,000/hour"

// With "From" label
"From ฿12,000/hour"

// With minimum hours
"฿12,000/hour (Min. 3 hours)"

// No pricing set
"Contact for pricing"
```

## Validation Rules

### Pricing Constraints
- **Minimum**: ฿500/hour
- **Maximum**: ฿100,000/hour
- **Minimum Hours**: 1-24 hours
- **Premium Rates**: Must be ≥ base hourlyRate

### Data Entry Validation
```typescript
// Use the validation schema
import { artistPricingSchema } from '@/lib/validation/pricing'

const validated = artistPricingSchema.parse({
  hourlyRate: 12000,
  minimumHours: 3
})
```

### Consistency Checks
```typescript
// Check for suspicious values
import { validatePricingConsistency } from '@/lib/validation/pricing'

const { valid, warnings } = validatePricingConsistency({
  hourlyRate: 12000,
  weekendRate: 15000,
  holidayRate: 20000
})
```

## Common Pitfalls to Avoid

### ❌ DON'T
- Use `baseRate` field (doesn't exist)
- Show default values like ฿2,500 as fallback
- Mix field names (baseRate vs hourlyRate)
- Display ฿0 for missing prices
- Hardcode pricing values

### ✅ DO
- Always use `hourlyRate` field
- Show "Contact for pricing" when no rate set
- Validate pricing data on input
- Use consistent formatting functions
- Include minimum hours context

## Testing Checklist

### Before Deployment
- [ ] All artist profiles show consistent pricing
- [ ] Sticky action bar matches Overview tab pricing
- [ ] No references to `baseRate` field remain
- [ ] "Contact for pricing" shows for null values
- [ ] Minimum hours display correctly
- [ ] Thousand separators format properly
- [ ] Thai Baht symbol (฿) displays correctly

### Verification Scripts
```bash
# Run pricing consistency audit
npx tsx scripts/audit-pricing-consistency.ts

# Test specific artist display
npx tsx scripts/test-temple-bass-display.ts
```

## Migration Notes

### If Updating From Old Schema
If your database has a `baseRate` field that needs migration:

```sql
-- Copy baseRate to hourlyRate if needed
UPDATE "Artist"
SET "hourlyRate" = "baseRate"
WHERE "hourlyRate" IS NULL AND "baseRate" IS NOT NULL;

-- Then drop the old column
ALTER TABLE "Artist" DROP COLUMN "baseRate";
```

## Future Enhancements

### Planned Features
1. **Event Type Pricing**
   - Standard rate for private events
   - Premium rate for corporate events
   - Special rates for weddings

2. **Package Pricing**
   - Bundle deals with discounts
   - Multi-hour packages
   - Equipment included options

3. **Dynamic Pricing**
   - Peak season rates
   - Last-minute booking discounts
   - Early bird specials

### Database Extensions
```prisma
// Future schema additions
model ArtistPricing {
  id           String   @id @default(cuid())
  artistId     String
  eventType    String   // "wedding", "corporate", "private"
  hourlyRate   Decimal  @db.Decimal(10, 2)
  description  String?

  artist       Artist   @relation(fields: [artistId], references: [id])
}
```

## Support & Maintenance

### Monitoring
- Track pricing display errors in error logs
- Monitor for inconsistent pricing reports from users
- Regular audits using provided scripts

### Contact
For pricing display issues or questions:
- Check this documentation first
- Run audit scripts to identify issues
- Review component implementations

---

**Last Updated**: October 5, 2025
**Fixed By**: Database Architect
**Issue**: Temple Bass pricing inconsistency
**Status**: ✅ RESOLVED