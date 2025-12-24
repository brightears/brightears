# Social Proof Integration Examples

Quick reference guide for adding social proof to new pages or components.

## Quick Start Examples

### Homepage Hero Section

```tsx
import TrustBadge from '@/components/ui/TrustBadge';

<section className="hero">
  <h1>Book Perfect Entertainment</h1>

  {/* Trust badge below headline */}
  <div className="flex gap-2 justify-center mt-4">
    <TrustBadge variant="trusted-by" count={500} size="md" />
    <TrustBadge variant="no-commission" size="md" />
  </div>
</section>
```

### Artist Card (Browse Page)

```tsx
import PopularityIndicator from '@/components/ui/PopularityIndicator';

<div className="artist-card">
  {/* Top-left badges */}
  {isTrending && (
    <PopularityIndicator type="trending" animated={true} size="sm" />
  )}

  {/* Stats section */}
  {totalEvents >= 100 && (
    <div className="stats">
      <span>Completed Events: {totalEvents}+</span>
    </div>
  )}
</div>
```

### Booking Confirmation Page

```tsx
import TrustSignals from '@/components/sections/TrustSignals';

<div className="booking-confirmation">
  <h2>Booking Confirmed!</h2>

  {/* Trust signals at bottom */}
  <TrustSignals variant="compact" sticky={true} />
</div>
```

### Checkout Flow

```tsx
import TrustSignals from '@/components/sections/TrustSignals';
import TrustBadge from '@/components/ui/TrustBadge';

<div className="checkout">
  <h2>Payment Details</h2>

  {/* Security badges near payment form */}
  <div className="flex gap-2 mb-4">
    <TrustBadge variant="secure-payment" size="sm" />
    <TrustBadge variant="money-back" size="sm" />
  </div>

  {/* Payment form */}
  <form>...</form>

  {/* Full trust signals at footer */}
  <TrustSignals variant="detailed" showStats={false} />
</div>
```

### Corporate Landing Page

```tsx
import TrustBadge from '@/components/ui/TrustBadge';
import TrustSignals from '@/components/sections/TrustSignals';

<section className="corporate-hero">
  <h1>Enterprise Entertainment Solutions</h1>

  {/* Trust badges for corporate clients */}
  <div className="flex gap-3 mt-6">
    <TrustBadge variant="verified" size="lg" />
    <TrustBadge variant="24-7-support" size="lg" />
    <TrustBadge variant="trusted-by" count={500} size="lg" />
  </div>
</section>

{/* Detailed trust section */}
<TrustSignals variant="detailed" showStats={true} />
```

## Real-Time Activity Feed

### Homepage (Desktop Only)

```tsx
import RecentActivity from '@/components/ui/RecentActivity';

export default function HomePage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  return (
    <>
      <Hero />

      {/* Desktop only - bottom-left */}
      {!isMobile && (
        <RecentActivity
          position="bottom-left"
          enabled={true}
          maxItems={3}
          autoHide={true}
          autoHideDuration={10000}
          showDelay={5000}
        />
      )}
    </>
  );
}
```

### Artist Profile (Desktop Only)

```tsx
<RecentActivity
  position="bottom-right"
  enabled={!isMobile}
  maxItems={2}
  autoHide={true}
  autoHideDuration={8000}
/>
```

## Conditional Social Proof

### High-Performing Artists Only

```tsx
{artist.stats.rating >= 4.8 && (
  <PopularityIndicator
    type="highly-rated"
    metric={artist.stats.rating.toFixed(1)}
    size="md"
  />
)}

{artist.stats.totalEvents >= 500 && (
  <PopularityIndicator
    type="trending"
    animated={true}
  />
)}
```

### New Artists

```tsx
{artist.isNew && (
  <TrustBadge variant="new" size="sm" />
)}

{artist.reviewCount === 0 && (
  <span className="badge">New Artist - First booking discount!</span>
)}
```

### Scarcity Indicators

```tsx
{artist.availableDates <= 2 && (
  <PopularityIndicator
    type="almost-booked"
    metric={`${artist.availableDates} dates`}
    animated={true}
  />
)}
```

## Mobile-Specific Variations

### Hide on Mobile

```tsx
{!isMobile && (
  <RecentActivity position="bottom-left" />
)}
```

### Smaller Sizes on Mobile

```tsx
<TrustBadge
  variant="verified"
  size={isMobile ? 'sm' : 'md'}
/>
```

### Compact Variant on Mobile

```tsx
<TrustSignals
  variant={isMobile ? 'compact' : 'default'}
  showStats={!isMobile}
/>
```

## Page-Specific Recommendations

### Homepage
- ✅ TrustSignals (compact) below hero
- ✅ RecentActivity (desktop only)
- ✅ TrustBadge ("trusted-by") in hero

### Browse Artists
- ✅ PopularityIndicator on cards (trending/popular)
- ✅ TotalEvents counter (if >= 100)
- ✅ TrustSignals (compact) in footer

### Artist Profile
- ✅ PopularityIndicator next to name
- ✅ TrustBadge (verified) below name
- ✅ Events completed badge
- ✅ TrustSignals (compact) in footer

### Booking Flow
- ✅ TrustSignals (detailed) on confirmation
- ✅ TrustBadge (secure-payment, money-back) near payment
- ✅ TrustSignals (sticky) at bottom

### Corporate Page
- ✅ TrustBadge (verified, 24-7-support, trusted-by) in hero
- ✅ TrustSignals (detailed with stats)
- ✅ Case study testimonials

## Custom Styling

### Brand-Aligned Colors

```tsx
{/* Cyan theme */}
<div className="bg-brand-cyan/10 border-brand-cyan/30">
  <TrustBadge variant="verified" />
</div>

{/* Lavender theme */}
<div className="bg-soft-lavender/10 border-soft-lavender/30">
  <TrustBadge variant="popular" />
</div>
```

### Dark Backgrounds

```tsx
<div className="bg-deep-teal p-8">
  {/* Use white/light variants */}
  <TrustBadge
    variant="verified"
    className="bg-white/20 text-white border-white/30"
  />
</div>
```

## Animation Control

### Disable Animations (Reduced Motion)

```tsx
@media (prefers-reduced-motion: reduce) {
  .animate-live-pulse,
  .animate-activity-slide-in {
    animation: none !important;
  }
}
```

Already implemented in `globals.css` - components respect user preferences.

## Analytics Tracking

### Track Social Proof Interactions

```tsx
<TrustBadge
  variant="verified"
  onClick={() => {
    gtag('event', 'social_proof_click', {
      component: 'TrustBadge',
      variant: 'verified'
    });
  }}
/>

<PopularityIndicator
  type="trending"
  onClick={() => {
    gtag('event', 'popularity_view', {
      artist_id: artistId,
      type: 'trending'
    });
  }}
/>
```

## Common Patterns

### Hero Section Pattern

```tsx
<section className="hero">
  <h1>Headline</h1>
  <p>Subheading</p>

  {/* Trust badges */}
  <div className="flex gap-2 justify-center mt-4">
    <TrustBadge variant="trusted-by" count={500} />
    <TrustBadge variant="no-commission" />
  </div>

  {/* CTA */}
  <button>Get Started</button>
</section>
```

### Card Pattern

```tsx
<div className="card">
  {/* Top badges */}
  <div className="absolute top-4 left-4">
    {isTrending && <PopularityIndicator type="trending" />}
  </div>

  {/* Content */}
  <div className="content">
    <h3>Name</h3>
    <p>Description</p>

    {/* Stats */}
    {totalEvents >= 100 && (
      <div className="stats">
        {totalEvents}+ Events
      </div>
    )}
  </div>
</div>
```

### Footer Pattern

```tsx
<footer>
  <TrustSignals variant="compact" />

  {/* Links */}
  <div className="links">...</div>
</footer>
```

## Testing Checklist

When adding social proof to a new page:

- [ ] Verify tooltips work on hover
- [ ] Check keyboard navigation (Tab, Enter)
- [ ] Test on mobile (responsive sizing)
- [ ] Validate ARIA labels (screen reader)
- [ ] Check color contrast (WCAG AA)
- [ ] Test with reduced motion preference
- [ ] Verify animations don't cause layout shift
- [ ] Check z-index doesn't overlap modals
- [ ] Test with long text (truncation)
- [ ] Verify real data integration (if applicable)

## Performance Tips

### Lazy Load for Below-Fold

```tsx
import dynamic from 'next/dynamic';

const TrustSignals = dynamic(() => import('@/components/sections/TrustSignals'), {
  loading: () => <div className="h-20 animate-pulse bg-gray-200" />
});
```

### Memoize for Frequent Re-renders

```tsx
import { memo } from 'react';

const MemoizedTrustBadge = memo(TrustBadge);

<MemoizedTrustBadge variant="verified" />
```

### Conditional Rendering

```tsx
{/* Only show if needed */}
{artist.totalEvents >= 100 && (
  <PopularityIndicator type="popular" />
)}
```

---

**Quick Reference Summary**:

| Component | Best For | Placement |
|-----------|----------|-----------|
| TrustBadge | Individual trust indicators | Hero, cards, forms |
| RecentActivity | Live booking feed | Homepage, profiles (desktop) |
| PopularityIndicator | Artist demand/ratings | Cards, profiles |
| TrustSignals | Combined trust section | Footers, checkout |

---

**Need Help?**
- Full docs: `/SOCIAL_PROOF_IMPLEMENTATION.md`
- Component props: See TypeScript interfaces
- Design system: `/DESIGN_SYSTEM.md`
