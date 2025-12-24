# Structured Data Quick Reference

## Quick Add to Any Page

### 1. Import Components
```tsx
import JsonLd from '@/components/JsonLd'
import { generateBreadcrumbSchema } from '@/lib/schemas/structured-data'
```

### 2. Generate Schema
```tsx
const breadcrumbSchema = generateBreadcrumbSchema({
  items: [
    { name: 'Home', url: `https://brightears.onrender.com/${locale}` },
    { name: 'Page', url: `https://brightears.onrender.com/${locale}/page` }
  ]
})
```

### 3. Add to JSX
```tsx
return (
  <>
    <JsonLd data={breadcrumbSchema} />
    {/* Page content */}
  </>
)
```

## Available Schema Generators

### Organization Schema
```tsx
import { generateOrganizationSchema } from '@/lib/schemas/structured-data'

const schema = generateOrganizationSchema({ locale })
```

### LocalBusiness Schema
```tsx
import { generateLocalBusinessSchema } from '@/lib/schemas/structured-data'

const schema = generateLocalBusinessSchema({
  locale,
  aggregateRating: {
    ratingValue: '4.9',
    reviewCount: '500'
  }
})
```

### Artist/Person Schema
```tsx
import { generateArtistSchema } from '@/lib/schemas/structured-data'

const schema = generateArtistSchema({
  artistId: 'artist-id',
  stageName: 'Artist Name',
  bio: 'Artist bio',
  profileImageUrl: 'https://...',
  category: 'DJ',
  baseCity: 'Bangkok',
  hourlyRate: 5000,
  averageRating: 4.8,
  totalReviews: 120,
  locale
})
```

### Service Schema
```tsx
import { generateServiceSchema } from '@/lib/schemas/structured-data'

const schema = generateServiceSchema({ locale })
```

### FAQ Schema
```tsx
import { generateFAQSchema } from '@/lib/schemas/structured-data'

const schema = generateFAQSchema({
  faqs: [
    {
      question: 'Question text?',
      answer: 'Answer text.'
    }
  ]
})
```

### Breadcrumb Schema
```tsx
import { generateBreadcrumbSchema } from '@/lib/schemas/structured-data'

const schema = generateBreadcrumbSchema({
  items: [
    { name: 'Home', url: 'https://...' },
    { name: 'Category', url: 'https://...' }
  ]
})
```

## Common Patterns

### Server Component (Preferred)
```tsx
export default async function Page({ params }: PageProps) {
  const { locale } = await params

  const schema = generateSomeSchema({ locale })

  return (
    <>
      <JsonLd data={schema} />
      <Content />
    </>
  )
}
```

### Client Component (When Data Loads Dynamically)
```tsx
'use client'

import { useEffect } from 'react'

export default function Component({ data }) {
  useEffect(() => {
    const schema = generateSchema(data)
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(schema)
    document.head.appendChild(script)

    return () => script.remove()
  }, [data])
}
```

### Multiple Schemas on One Page
```tsx
return (
  <>
    <JsonLd data={organizationSchema} />
    <JsonLd data={breadcrumbSchema} />
    <JsonLd data={serviceSchema} />
    <Content />
  </>
)
```

## Testing

### 1. Local Testing
```bash
# View page source and search for:
<script type="application/ld+json">
```

### 2. Google Rich Results Test
```
https://search.google.com/test/rich-results
```

### 3. Schema Validator
```
https://validator.schema.org/
```

## Checklist for New Pages

- [ ] Import JsonLd component
- [ ] Import appropriate schema generator(s)
- [ ] Generate schema with page data
- [ ] Add JsonLd component to JSX
- [ ] Test with Rich Results Test
- [ ] Verify in page source
- [ ] Check Google Search Console after deployment

## Common Issues & Solutions

### Issue: Schema not appearing in search
**Solution**:
- Verify page is indexed (search `site:yoururl.com/page`)
- Check robots.txt allows crawling
- Wait 1-2 weeks for Google to process

### Issue: TypeScript errors on schema generator
**Solution**:
- Check all required props are provided
- Verify types match interface definition
- Use TypeScript autocompletion

### Issue: Schema validation errors
**Solution**:
- Test with schema.org validator
- Verify all required properties present
- Check data types (string vs number)

### Issue: Duplicate schemas
**Solution**:
- Use `data-` attributes to track scripts
- Remove existing before adding new (client-side)
- Ensure only one JsonLd per schema type per page

## Pro Tips

1. **Always include breadcrumbs** - They appear in search results
2. **Keep FAQs under 10** - Focus on most important questions
3. **Update aggregate ratings** - Keep review counts current
4. **Use real data** - Don't use placeholders in production
5. **Test mobile** - Rich results appear differently on mobile
6. **Monitor Search Console** - Check for enhancement errors weekly

## File Locations

- **JsonLd Component**: `/components/JsonLd.tsx`
- **Schema Generators**: `/lib/schemas/structured-data.ts`
- **Artist Schema Hook**: `/components/seo/ArtistStructuredData.tsx`
- **Documentation**: `/docs/SEO_STRUCTURED_DATA.md`

---

**Quick Access**: Keep this file bookmarked for fast reference when adding structured data to new pages.
