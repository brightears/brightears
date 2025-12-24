# Bright Ears SEO Implementation Guide
**For Developers & Marketing Team**
**Last Updated:** November 11, 2025

---

## Quick Reference: SEO Best Practices

### Title Tags
- **Length:** 50-60 characters (Google truncates at ~60)
- **Format:** `[Primary Keyword] | Bright Ears`
- **Example:** `Book DJ Bangkok - Zero Commission | Bright Ears`

### Meta Descriptions
- **Length:** 150-160 characters (Google truncates at ~160)
- **Include:** Keywords, call-to-action, value proposition
- **Example:** `Find verified DJs for your Bangkok event. 500+ artists, zero commission. Book directly with PromptPay. Get quotes in 24 hours.`

### URLs
- **Structure:** `/[locale]/[category]/[slug]`
- **Best Practice:** Short, descriptive, keyword-rich
- **Example:** `/en/artists/dj-bangkok-wedding`

---

## Complete Page Metadata Template

```typescript
import { Metadata } from 'next';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;

  const title = locale === 'th'
    ? 'Thai Title (50-60 chars)'
    : 'English Title (50-60 chars)';

  const description = locale === 'th'
    ? 'Thai description 150-160 characters with keywords and call-to-action'
    : 'English description 150-160 characters with keywords and call-to-action';

  return {
    title,
    description,
    keywords: locale === 'th'
      ? 'Thai keywords, separated, by commas'
      : 'English keywords, separated, by commas',

    // Open Graph for social sharing
    openGraph: {
      title,
      description,
      url: `/${locale}/page-path`,
      siteName: 'Bright Ears',
      locale: locale === 'th' ? 'th_TH' : 'en_US',
      type: 'website', // or 'article', 'profile', 'product'
      images: [{
        url: '/og-images/og-image-page.jpg',
        width: 1200,
        height: 630,
        alt: 'Descriptive alt text for image'
      }]
    },

    // Twitter Cards
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-images/og-image-page.jpg'],
      site: '@brightears',
      creator: '@brightears',
    },

    // Canonical URLs & Language Alternates
    alternates: {
      canonical: `/${locale}/page-path`,
      languages: {
        'en': '/en/page-path',
        'th': '/th/page-path',
        'x-default': '/en/page-path',
      }
    },

    // Robots directives
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    }
  };
}
```

---

## Adding Structured Data (JSON-LD)

### 1. Organization Schema

**When to use:** Homepage, About page

```typescript
import JsonLd from '@/components/JsonLd';
import { generateOrganizationSchema } from '@/lib/schemas/structured-data';

export default function Page() {
  const organizationSchema = generateOrganizationSchema({
    locale: 'en',
    url: 'https://brightears.onrender.com/en/about'
  });

  return (
    <>
      <JsonLd data={organizationSchema} />
      {/* Page content */}
    </>
  );
}
```

### 2. LocalBusiness Schema

**When to use:** Homepage, location-specific pages

```typescript
const localBusinessSchema = generateLocalBusinessSchema({
  locale: 'en',
  aggregateRating: {
    ratingValue: '4.9',
    reviewCount: '500'
  }
});

return <JsonLd data={localBusinessSchema} />;
```

### 3. BreadcrumbList Schema

**When to use:** All pages (improves navigation in search results)

```typescript
const breadcrumbSchema = generateBreadcrumbSchema({
  items: [
    {
      name: 'Home',
      url: 'https://brightears.onrender.com/en'
    },
    {
      name: 'Artists',
      url: 'https://brightears.onrender.com/en/artists'
    },
    {
      name: 'Artist Name',
      url: 'https://brightears.onrender.com/en/artists/123'
    }
  ]
});

return <JsonLd data={breadcrumbSchema} />;
```

### 4. FAQ Schema

**When to use:** FAQ pages (enables FAQ rich snippets)

```typescript
const faqSchema = generateFAQSchema({
  faqs: [
    {
      question: 'How does booking work?',
      answer: 'Browse artists, request quotes, book directly...'
    },
    // Add 5-10 most important FAQs
  ]
});

return <JsonLd data={faqSchema} />;
```

### 5. Service Schema

**When to use:** Service pages (Corporate, BMAsia, DJ Music Design)

```typescript
const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  'name': 'Corporate Event Entertainment',
  'description': 'Professional DJs and bands for corporate events',
  'provider': {
    '@type': 'Organization',
    'name': 'Bright Ears'
  },
  'areaServed': 'Bangkok, Thailand',
  'offers': {
    '@type': 'Offer',
    'availability': 'https://schema.org/InStock',
    'price': '5000',
    'priceCurrency': 'THB'
  }
};

return <JsonLd data={serviceSchema} />;
```

---

## Dynamic SEO for Artist Profiles

### Fetching Artist Data for Metadata

```typescript
import { prisma } from '@/lib/prisma';

export async function generateMetadata({ params }: ArtistPageProps) {
  const { id, locale } = await params;

  // Fetch artist data
  const artist = await prisma.artist.findUnique({
    where: { id },
    select: {
      stageName: true,
      bioEn: true,
      bioTh: true,
      category: true,
      hourlyRate: true,
      profileImageUrl: true,
      city: true,
      genres: true,
    }
  });

  if (!artist) {
    return {
      title: 'Artist Not Found | Bright Ears',
      description: 'This artist profile was not found.'
    };
  }

  // Create dynamic title
  const categoryName = artist.category.replace('_', ' ');
  const title = `${artist.stageName} - Professional ${categoryName} in ${artist.city} | Bright Ears`;

  // Create dynamic description
  const bio = locale === 'th' ? artist.bioTh : artist.bioEn;
  const bioPreview = bio ? bio.slice(0, 140) : `Book ${artist.stageName} directly for your event`;
  const priceInfo = artist.hourlyRate
    ? `Starting from ฿${artist.hourlyRate.toLocaleString()}/hr`
    : '';
  const genresText = artist.genres?.slice(0, 3).join(', ') || '';

  const description = `${bioPreview}. ${priceInfo} ${genresText}`.trim().slice(0, 160);

  // Use artist photo for OG image
  const ogImage = artist.profileImageUrl || '/og-images/og-image-artist-default.jpg';

  return {
    title,
    description,
    keywords: `${artist.stageName}, book ${categoryName}, ${artist.city}, ${artist.genres?.join(', ')}, Bright Ears`,
    openGraph: {
      title,
      description,
      url: `/${locale}/artists/${id}`,
      images: [{ url: ogImage, width: 1200, height: 630 }]
    },
    // ... rest of metadata
  };
}
```

---

## Creating Open Graph Images

### Option 1: Static Images (Recommended for Launch)

**Design in Figma/Canva:**
- Size: 1200x630px
- Safe zone: 1200x600px (avoid text in top/bottom 15px)
- Format: JPG (smaller) or PNG (higher quality)
- File size: <300KB

**Image Template:**
```
+------------------------------------------+
|  [Bright Ears Logo]                      |
|                                          |
|     [LARGE PAGE TITLE]                   |
|     Subtitle or tagline                  |
|                                          |
|     [CTA Button] "Book Now"              |
|                                          |
|  #00bbe4 cyan background with gradient   |
+------------------------------------------+
```

**Required Images:**
1. `og-image-home.jpg` - "Book Live Entertainment for Hotels"
2. `og-image-artists-listing.jpg` - "Browse 500+ Verified Artists"
3. `og-image-artist-default.jpg` - "Professional Entertainment"
4. `og-image-corporate.jpg` - "Corporate Event Solutions"
5. `og-image-how-it-works.jpg` - "Simple 4-Step Booking Process"
6. `og-image-faq.jpg` - "Get Answers to Common Questions"
7. `og-image-about.jpg` - "Thailand's Entertainment Platform"
8. `og-image-contact.jpg` - "Get in Touch"
9. `og-image-apply.jpg` - "Join Our Artist Roster"
10. `og-image-bmasia.jpg` - "Background Music for Business"
11. `og-image-dj-music-design.jpg` - "DJ Music Production"

**Save to:** `/public/og-images/`

---

### Option 2: Dynamic OG Image Generation (Advanced)

**Create API route:** `app/api/og/route.tsx`

```typescript
import { ImageResponse } from 'next/og';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'Bright Ears';
  const subtitle = searchParams.get('subtitle') || 'Entertainment Booking';

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #00bbe4 0%, #2f6364 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
          color: 'white',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <h1 style={{ fontSize: 72, fontWeight: 'bold', marginBottom: 20 }}>
          {title}
        </h1>
        <p style={{ fontSize: 36, opacity: 0.9 }}>
          {subtitle}
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
```

**Usage in metadata:**
```typescript
openGraph: {
  images: [{
    url: `/api/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(subtitle)}`,
    width: 1200,
    height: 630,
  }]
}
```

**Benefits:**
- Automatic updates when content changes
- No manual image creation
- Consistent branding

**Tradeoffs:**
- Adds server overhead
- Requires additional implementation
- Less design flexibility

---

## Updating the Sitemap

### Add New Static Page

**Edit:** `app/sitemap.ts`

```typescript
const staticPages = [
  // ... existing pages
  {
    path: 'new-page',
    priority: 0.7, // 0.0 to 1.0 (homepage is 1.0)
    changefreq: 'weekly' as const, // 'always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'
    lastModified: currentDate
  },
];
```

### Priority Guidelines

- **1.0:** Homepage only
- **0.9:** Main category pages (Browse Artists)
- **0.8:** High-value pages (Corporate, Apply, Artist profiles)
- **0.7:** Service pages (BMAsia, DJ Music Design, How It Works)
- **0.6:** Support pages (FAQ, About, Contact)
- **0.5 or lower:** Archive, terms, privacy policy

### Change Frequency Guidelines

- **daily:** Homepage, Browse Artists (content changes daily)
- **weekly:** Corporate, BMAsia, Artist profiles
- **monthly:** FAQ, About, How It Works
- **yearly:** Terms, Privacy Policy

---

## Setting Up Google Search Console

### 1. Get Verification Code

1. Go to https://search.google.com/search-console
2. Add property: `https://brightears.onrender.com`
3. Choose "HTML tag" verification method
4. Copy the verification code

### 2. Add to Root Layout

**Edit:** `app/[locale]/layout.tsx`

```typescript
export async function generateMetadata() {
  return {
    // ... existing metadata
    verification: {
      google: 'YOUR_GOOGLE_VERIFICATION_CODE_HERE', // Replace with actual code
    },
  };
}
```

### 3. Submit Sitemap

After verification:
1. Go to Sitemaps section
2. Add sitemap URL: `https://brightears.onrender.com/sitemap.xml`
3. Click "Submit"

---

## Setting Up Google Analytics 4

### 1. Create GA4 Property

1. Go to https://analytics.google.com
2. Create new property: "Bright Ears"
3. Copy Measurement ID (e.g., `G-XXXXXXXXXX`)

### 2. Add Tracking Script

**Create:** `app/GoogleAnalytics.tsx`

```typescript
'use client';

import Script from 'next/script';

export default function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `}
      </Script>
    </>
  );
}
```

### 3. Add to Layout

**Edit:** `app/[locale]/layout.tsx`

```typescript
import GoogleAnalytics from '@/app/GoogleAnalytics';

export default function LocaleLayout({ children }) {
  return (
    <html>
      <body>
        <GoogleAnalytics measurementId="G-XXXXXXXXXX" />
        {children}
      </body>
    </html>
  );
}
```

### 4. Track Custom Events

```typescript
'use client';

export function trackEvent(eventName: string, parameters?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
}

// Usage:
trackEvent('artist_profile_viewed', {
  artist_id: 'abc123',
  artist_name: 'DJ Thunder',
  locale: 'en'
});

trackEvent('quote_requested', {
  artist_id: 'abc123',
  event_date: '2025-12-31',
  value: 5000
});
```

---

## Local SEO Implementation

### 1. Google My Business

**Setup:**
1. Go to https://business.google.com
2. Create business profile: "Bright Ears"
3. Category: "Entertainment Agency"
4. Location: Bangkok, Thailand
5. Add phone, website, hours
6. Upload photos
7. Verify via postcard or phone

**Optimization:**
- Complete all profile sections (100% completion)
- Add high-quality photos (logo, cover, team, events)
- Encourage customer reviews
- Post weekly updates
- Respond to all reviews within 24 hours

### 2. Local Citations

**Thailand Business Directories:**
- https://www.thaibizlisting.com
- https://www.yellowpages.co.th
- https://www.thailandbiz.org
- https://www.bkkdirectory.com

**Ensure NAP Consistency:**
- **Name:** Bright Ears
- **Address:** [Your Bangkok Address]
- **Phone:** [Your Phone Number]
- **Website:** https://brightears.onrender.com

### 3. Bangkok Landing Pages

**Create location-specific pages:**
- `/en/bangkok/wedding-djs`
- `/en/bangkok/corporate-entertainment`
- `/en/phuket/hotel-resident-djs`
- `/th/กรุงเทพ/ดีเจงานแต่ง`

**Template:**
```typescript
export async function generateMetadata() {
  return {
    title: 'Wedding DJs in Bangkok - 100+ Verified Artists | Bright Ears',
    description: 'Find the perfect wedding DJ in Bangkok. 100+ verified artists, 500+ successful weddings. Free quotes, zero commission. Book your Bangkok wedding DJ today.',
    // ... rest of metadata
  };
}
```

---

## Monitoring & Optimization

### Weekly Tasks

- [ ] Check Google Search Console for indexing issues
- [ ] Review top search queries and add to content
- [ ] Monitor page speed (Core Web Vitals)
- [ ] Check for broken links
- [ ] Review competitor rankings

### Monthly Tasks

- [ ] Analyze Google Analytics traffic sources
- [ ] Update content on low-performing pages
- [ ] Create new blog posts targeting keywords
- [ ] Build 2-3 high-quality backlinks
- [ ] Update sitemap with new content

### Quarterly Tasks

- [ ] Full SEO audit
- [ ] Update keyword strategy
- [ ] Refresh OG images
- [ ] Competitive analysis
- [ ] Review and update structured data

---

## Common SEO Mistakes to Avoid

### ❌ DON'T:

1. **Duplicate Titles/Descriptions** - Every page must be unique
2. **Keyword Stuffing** - Repeating keywords unnaturally
3. **Missing Alt Text** - All images need descriptive alt text
4. **Broken Internal Links** - Always test links before deploying
5. **Slow Page Speed** - Keep LCP under 2.5 seconds
6. **No Mobile Optimization** - 70%+ users are on mobile
7. **Ignoring Search Console Errors** - Fix indexing issues immediately
8. **Thin Content** - Pages need 300+ words minimum
9. **Cloaking** - Showing different content to search engines
10. **Buying Backlinks** - Can result in Google penalties

### ✅ DO:

1. **Write for Humans First** - Search engines second
2. **Focus on User Intent** - Answer what users are searching for
3. **Update Content Regularly** - Freshness signals matter
4. **Build Quality Backlinks** - From relevant, authoritative sites
5. **Optimize Images** - Compress, use WebP, add alt text
6. **Internal Linking** - Link related pages together
7. **Monitor Core Web Vitals** - Speed, interactivity, visual stability
8. **Use Descriptive URLs** - `/artists/dj-bangkok` not `/artists/123`
9. **Create Valuable Content** - Solve user problems
10. **Be Patient** - SEO takes 3-6 months to show results

---

## Troubleshooting

### Page Not Indexed

**Causes:**
- Not in sitemap.xml
- Blocked by robots.txt
- `noindex` meta tag present
- Canonical points to different page
- Page too new (Google takes 1-4 weeks)

**Solutions:**
1. Check Google Search Console → Coverage report
2. Request indexing manually
3. Submit sitemap
4. Check robots.txt
5. Verify no `noindex` tags

### Low Click-Through Rate

**Causes:**
- Boring title/description
- Missing structured data
- Low ranking position
- Irrelevant keywords

**Solutions:**
1. A/B test different titles
2. Add power words (Free, Best, Guide, 2025)
3. Include numbers (5 Tips, 10 Steps)
4. Add schema markup for rich snippets
5. Optimize for featured snippets

### High Bounce Rate

**Causes:**
- Slow page speed
- Poor mobile experience
- Content doesn't match search intent
- Confusing navigation

**Solutions:**
1. Improve page speed (< 2 seconds)
2. Make mobile-first design
3. Add clear CTAs
4. Improve content quality
5. Add internal links

---

## Resources

### SEO Tools

- **Google Search Console** (Free) - Indexing, search queries, errors
- **Google Analytics** (Free) - Traffic, behavior, conversions
- **PageSpeed Insights** (Free) - Core Web Vitals, performance
- **Screaming Frog** (Free/Paid) - Crawl site, find issues
- **Ahrefs** (Paid) - Backlinks, keywords, competitor analysis

### Learning Resources

- **Google SEO Starter Guide:** https://developers.google.com/search/docs
- **Moz Beginner's Guide:** https://moz.com/beginners-guide-to-seo
- **Search Engine Journal:** https://www.searchenginejournal.com
- **Schema.org Documentation:** https://schema.org

### Next.js SEO

- **Next.js Metadata API:** https://nextjs.org/docs/app/building-your-application/optimizing/metadata
- **Next.js Image Optimization:** https://nextjs.org/docs/app/building-your-application/optimizing/images
- **Next.js Performance:** https://nextjs.org/docs/app/building-your-application/optimizing

---

**Last Updated:** November 11, 2025
**Maintained by:** Development Team
**Questions:** Contact dev team or refer to SEO_AUDIT_REPORT.md

---

**End of Guide**
