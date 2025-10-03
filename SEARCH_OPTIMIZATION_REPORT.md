# Search Functionality Testing & Optimization Report
**Date**: 2025-10-03
**Agent**: Performance Engineer
**Platform**: Bright Ears Entertainment Booking

---

## Executive Summary

The search functionality is **functional but requires performance optimization**. Current implementation includes debouncing, multi-field search, and proper filtering. However, critical database indexes are missing, and there's no caching or rate limiting.

**Status**: ✅ Working | ⚠️ Performance Issues | 🔧 Optimization Required

---

## 1. Current Implementation Analysis

### 1.1 Search Features (Working)

✅ **Debounced Search Input** (300ms)
- Implemented via custom `useDebounce` hook
- Prevents excessive API calls
- Smooth user experience

✅ **Multi-Field Search**
- Artist stage name (case-insensitive)
- English bio (case-insensitive)
- Thai bio (case-insensitive)
- Genres (array matching with word splitting)

✅ **Advanced Filtering**
- Categories (DJ, Band, Singer, etc.)
- Location (base city + service areas)
- Price range (hourly rate)
- Genres, languages, verification levels
- Availability status

✅ **Sorting Options**
- Featured (verification + rating + bookings)
- Highest rating
- Price (low to high / high to low)
- Most booked
- Newest first

✅ **Pagination**
- 20 results per page
- Configurable limit (1-100)
- Proper pagination metadata

### 1.2 Search Query Flow

```
User Input → Debounce (300ms) → URL Update → API Call → Database Query → Response
```

### 1.3 Database Query Analysis

**Current Query Structure** (from `/app/api/artists/route.ts`):

```typescript
// Text search implementation
if (search) {
  conditions.push({
    OR: [
      { stageName: { contains: search, mode: 'insensitive' } },
      { bio: { contains: search, mode: 'insensitive' } },
      { bioTh: { contains: search, mode: 'insensitive' } },
      { genres: { hasSome: search.split(' ').filter(s => s.length > 0) } }
    ]
  })
}
```

**Issues Identified**:
1. Uses `contains` (ILIKE) which is slow on large datasets
2. No full-text search indexes
3. Splits search on spaces but doesn't use proper tokenization
4. Genre search with `hasSome` is inefficient for partial matches

---

## 2. Performance Issues Identified

### 2.1 Critical Issues

#### 🔴 **ISSUE 1: Missing Database Indexes for Search Fields**

**Impact**: High - Every search performs full table scans
**Severity**: Critical for production at scale

**Current Indexes** (from schema.prisma):
```prisma
@@index([category])
@@index([baseCity])
@@index([verificationLevel])
```

**Missing Indexes**:
- `stageName` (most searched field)
- `bio` (full-text search)
- `bioTh` (full-text search)
- `genres` (array search)

**Solution**: Add composite indexes + PostgreSQL full-text search

---

#### 🔴 **ISSUE 2: No Rate Limiting on Search Endpoint**

**Impact**: High - Vulnerable to abuse/DoS
**Severity**: Security & Performance

**Current State**: Unlimited search requests per user
**Risk**: API abuse, database overload, increased costs

**Solution**: Implement rate limiting with Redis/in-memory cache

---

#### 🟡 **ISSUE 3: No Search Result Caching**

**Impact**: Medium - Repeated searches hit database
**Severity**: Performance optimization opportunity

**Current State**: Every search query hits PostgreSQL
**Opportunity**: Cache popular searches (e.g., "DJ Bangkok")

**Solution**: Implement Redis caching with TTL

---

### 2.2 Minor Issues

#### 🟡 **No Search Result Highlighting**

**Impact**: Low - UX improvement
**Current State**: Search results don't highlight matched terms

**Example**: Search "jazz" → Artist bio contains "jazz" but not highlighted

---

#### 🟡 **Missing "No Results" Helpful Suggestions**

**Impact**: Low - UX improvement
**Current State**: Generic message "No artists found"

**Better UX**:
- "Try searching for 'DJ' instead of 'disc jockey'"
- "Expand your search to nearby cities"
- "Adjust your budget range"

---

#### 🟡 **Search Suggestions Dropdown Incomplete**

**Impact**: Low - Feature incomplete
**Current State**: Shows "Searching for: {query}" but no actual suggestions

**Enhancement**: Autocomplete based on:
- Popular searches
- Artist names
- Genre tags

---

## 3. Database Query Performance Analysis

### 3.1 Estimated Query Performance

**Without Indexes** (Current State):
```sql
-- Example search for "jazz DJ Bangkok"
SELECT * FROM "Artist"
WHERE
  (stageName ILIKE '%jazz%' OR
   bio ILIKE '%jazz%' OR
   bioTh ILIKE '%jazz%' OR
   'jazz' = ANY(genres))
  AND baseCity ILIKE '%Bangkok%'
  AND "category" = 'DJ';
```

**Estimated Performance**:
- 1-100 artists: ~50-100ms ✅
- 100-1,000 artists: ~200-500ms ⚠️
- 1,000-10,000 artists: ~1-3 seconds 🔴
- 10,000+ artists: ~5+ seconds 🔴🔴

**With Proper Indexes**:
- 10,000+ artists: ~50-200ms ✅

### 3.2 Recommended Database Optimizations

#### Add Full-Text Search Indexes

```sql
-- Create full-text search indexes for PostgreSQL
CREATE INDEX idx_artist_stagename_gin ON "Artist" USING gin(to_tsvector('english', "stageName"));
CREATE INDEX idx_artist_bio_gin ON "Artist" USING gin(to_tsvector('english', COALESCE("bio", '')));
CREATE INDEX idx_artist_bio_th_gin ON "Artist" USING gin(to_tsvector('simple', COALESCE("bioTh", '')));
CREATE INDEX idx_artist_genres_gin ON "Artist" USING gin("genres");

-- Add composite index for common filters
CREATE INDEX idx_artist_search_composite ON "Artist" (category, "baseCity", "verificationLevel");
```

#### Update Search Query to Use Full-Text Search

```typescript
// Enhanced search with ts_vector
const searchQuery = search.split(' ')
  .map(word => `${word}:*`)
  .join(' & ');

// Use Prisma raw query for full-text search
const artists = await prisma.$queryRaw`
  SELECT * FROM "Artist"
  WHERE (
    to_tsvector('english', "stageName") @@ to_tsquery('english', ${searchQuery})
    OR to_tsvector('english', COALESCE("bio", '')) @@ to_tsquery('english', ${searchQuery})
    OR to_tsvector('simple', COALESCE("bioTh", '')) @@ to_tsquery('simple', ${searchQuery})
    OR ${search} = ANY("genres")
  )
  ORDER BY ts_rank(to_tsvector('english', "stageName"), to_tsquery('english', ${searchQuery})) DESC
  LIMIT 20;
`;
```

---

## 4. Recommended Implementations

### 4.1 Priority 1: Database Indexes (CRITICAL)

**File**: Create `/prisma/migrations/YYYYMMDDHHMMSS_add_search_indexes/migration.sql`

```sql
-- Add full-text search indexes
CREATE INDEX IF NOT EXISTS idx_artist_stagename_gin
  ON "Artist" USING gin(to_tsvector('english', "stageName"));

CREATE INDEX IF NOT EXISTS idx_artist_bio_gin
  ON "Artist" USING gin(to_tsvector('english', COALESCE("bio", '')));

CREATE INDEX IF NOT EXISTS idx_artist_bio_th_gin
  ON "Artist" USING gin(to_tsvector('simple', COALESCE("bioTh", '')));

CREATE INDEX IF NOT EXISTS idx_artist_genres_gin
  ON "Artist" USING gin("genres");

-- Add composite index for filtering
CREATE INDEX IF NOT EXISTS idx_artist_search_composite
  ON "Artist" (category, "baseCity", "verificationLevel");

-- Add index for stageName text searches (backup to full-text)
CREATE INDEX IF NOT EXISTS idx_artist_stagename_trigram
  ON "Artist" USING gin("stageName" gin_trgm_ops);
```

**Migration Steps**:
```bash
# Create migration manually
cd /Users/benorbe/Documents/Coding\ Projects/brightears/brightears
mkdir -p prisma/migrations/$(date +%Y%m%d%H%M%S)_add_search_indexes
# Copy SQL above into migration.sql
# Apply migration
npx prisma migrate deploy
```

---

### 4.2 Priority 2: Rate Limiting (HIGH)

**File**: `/lib/rate-limit.ts` (Create)

```typescript
import { NextRequest } from 'next/server'

interface RateLimitConfig {
  interval: number // Time window in ms
  uniqueTokenPerInterval: number // Max requests in window
}

export function rateLimit(config: RateLimitConfig) {
  const tokenCache = new Map<string, number[]>()

  return {
    check: async (request: NextRequest, limit: number): Promise<{ success: boolean; reset: number }> => {
      const token = request.ip || 'anonymous'
      const now = Date.now()
      const windowStart = now - config.interval

      // Get existing timestamps for this token
      const timestamps = tokenCache.get(token) || []

      // Filter out old timestamps
      const validTimestamps = timestamps.filter(ts => ts > windowStart)

      // Check if limit exceeded
      if (validTimestamps.length >= limit) {
        const oldestTimestamp = validTimestamps[0]
        const reset = oldestTimestamp + config.interval

        return {
          success: false,
          reset: Math.ceil((reset - now) / 1000)
        }
      }

      // Add new timestamp
      validTimestamps.push(now)
      tokenCache.set(token, validTimestamps)

      // Cleanup old entries periodically
      if (tokenCache.size > config.uniqueTokenPerInterval) {
        const keysToDelete = Array.from(tokenCache.keys())
          .slice(0, tokenCache.size - config.uniqueTokenPerInterval)
        keysToDelete.forEach(key => tokenCache.delete(key))
      }

      return {
        success: true,
        reset: Math.ceil(config.interval / 1000)
      }
    }
  }
}

// Search endpoint rate limiter: 60 requests per minute
export const searchLimiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500 // Max 500 unique IPs tracked
})
```

**Update API Endpoint**: `/app/api/artists/route.ts`

```typescript
import { searchLimiter } from '@/lib/rate-limit'

export async function GET(req: NextRequest) {
  // Rate limiting check
  const rateLimitResult = await searchLimiter.check(req, 60) // 60 requests/min

  if (!rateLimitResult.success) {
    return NextResponse.json(
      {
        error: 'Too many requests',
        retryAfter: rateLimitResult.reset
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateLimitResult.reset),
          'X-RateLimit-Limit': '60',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(rateLimitResult.reset)
        }
      }
    )
  }

  // ... rest of existing code
}
```

---

### 4.3 Priority 3: Search Result Caching (MEDIUM)

**File**: `/lib/search-cache.ts` (Create)

```typescript
interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

class SearchCache {
  private cache = new Map<string, CacheEntry<any>>()
  private readonly defaultTTL = 5 * 60 * 1000 // 5 minutes

  set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)

    if (!entry) return null

    const now = Date.now()
    const isExpired = (now - entry.timestamp) > entry.ttl

    if (isExpired) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  clear(): void {
    this.cache.clear()
  }

  // Periodic cleanup
  cleanup(): void {
    const now = Date.now()
    const keysToDelete: string[] = []

    this.cache.forEach((entry, key) => {
      if ((now - entry.timestamp) > entry.ttl) {
        keysToDelete.push(key)
      }
    })

    keysToDelete.forEach(key => this.cache.delete(key))
  }

  generateKey(params: Record<string, any>): string {
    return JSON.stringify(params)
  }
}

export const searchCache = new SearchCache()

// Run cleanup every 10 minutes
setInterval(() => searchCache.cleanup(), 10 * 60 * 1000)
```

**Update API Endpoint**:

```typescript
import { searchCache } from '@/lib/search-cache'

export async function GET(req: NextRequest) {
  // ... rate limiting ...

  // Generate cache key
  const cacheKey = searchCache.generateKey({
    search, categories, city, minPrice, maxPrice,
    genres, languages, verificationLevels, availability,
    sort, page, limit
  })

  // Check cache
  const cachedResult = searchCache.get(cacheKey)
  if (cachedResult) {
    return NextResponse.json(cachedResult)
  }

  // ... execute database query ...

  const response = {
    artists: artistsWithStats,
    pagination: { /* ... */ },
    filters: { /* ... */ }
  }

  // Cache result (3 minutes TTL for search)
  searchCache.set(cacheKey, response, 3 * 60 * 1000)

  return NextResponse.json(response)
}
```

---

### 4.4 Priority 4: Enhanced UI Features (LOW)

#### Search Result Highlighting

**File**: `/components/artists/SearchResultHighlight.tsx` (Create)

```typescript
interface HighlightProps {
  text: string
  searchTerm: string
  className?: string
}

export function HighlightText({ text, searchTerm, className = '' }: HighlightProps) {
  if (!searchTerm || !text) return <span className={className}>{text}</span>

  const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'))

  return (
    <span className={className}>
      {parts.map((part, index) =>
        part.toLowerCase() === searchTerm.toLowerCase() ? (
          <mark key={index} className="bg-brand-cyan/30 text-dark-gray font-semibold">
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  )
}
```

**Update ArtistCard Component**:

```typescript
import { HighlightText } from './SearchResultHighlight'

// In render:
<h3 className="font-playfair text-xl font-bold text-dark-gray">
  <HighlightText text={name} searchTerm={searchQuery} />
</h3>
```

---

#### Enhanced "No Results" State

**File**: Update `/components/artists/EnhancedArtistListing.tsx`

```typescript
// Replace empty state (line 354-362) with:
<div className="text-center py-16 bg-white/70 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl">
  <div className="text-6xl mb-6">🔍</div>
  <h3 className="text-dark-gray font-playfair text-2xl mb-4 font-bold">
    {t('noArtistsFound')}
  </h3>
  <p className="text-dark-gray/60 font-inter text-base mb-6 max-w-md mx-auto">
    {t('tryAdjustingFilters')}
  </p>

  {/* Helpful suggestions */}
  <div className="bg-brand-cyan/10 border border-brand-cyan/20 rounded-xl p-6 max-w-lg mx-auto text-left">
    <h4 className="font-inter font-semibold text-dark-gray mb-3">
      💡 {t('searchTips.title')}
    </h4>
    <ul className="space-y-2 text-sm text-dark-gray/80">
      <li>✓ {t('searchTips.tryDifferentKeywords')}</li>
      <li>✓ {t('searchTips.expandLocation')}</li>
      <li>✓ {t('searchTips.adjustBudget')}</li>
      <li>✓ {t('searchTips.removeFilters')}</li>
    </ul>
  </div>

  <button
    onClick={handleClearAllFilters}
    className="mt-6 px-8 py-3 bg-gradient-to-r from-brand-cyan to-deep-teal text-pure-white font-semibold rounded-xl hover:shadow-lg hover:shadow-brand-cyan/30 transition-all duration-300"
  >
    {t('clearAllFilters')}
  </button>
</div>
```

**Add to translation files** (`/messages/en.json` and `/messages/th.json`):

```json
{
  "artists": {
    "searchTips": {
      "title": "Search Tips",
      "tryDifferentKeywords": "Try different keywords or genres",
      "expandLocation": "Expand your location search area",
      "adjustBudget": "Adjust your budget range",
      "removeFilters": "Remove some filters to see more results"
    }
  }
}
```

---

## 5. Performance Benchmarks

### Expected Performance Improvements

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Search query time (1K artists) | 200-500ms | 20-50ms | **90% faster** |
| Search query time (10K artists) | 1-3s | 50-100ms | **95% faster** |
| API rate limit protection | None | 60 req/min | **DoS protected** |
| Cache hit rate | 0% | 70-80% | **Reduced DB load** |
| Repeated search latency | 200ms+ | <10ms | **98% faster** |

---

## 6. Testing Checklist

### Functional Testing

- [ ] Search by artist name (partial match)
- [ ] Search by genre (e.g., "jazz", "rock")
- [ ] Search in Thai language (bioTh field)
- [ ] Search with special characters
- [ ] Empty search returns all artists
- [ ] Search + filters combination
- [ ] Pagination with search
- [ ] Sort options with search
- [ ] Clear search button
- [ ] Debounce behavior (300ms delay)

### Performance Testing

- [ ] Measure query time with 100 artists
- [ ] Measure query time with 1,000 artists
- [ ] Measure query time with 10,000 artists
- [ ] Test rate limiting (61st request in 1 minute)
- [ ] Test cache hit rate (repeated searches)
- [ ] Test concurrent search requests
- [ ] Monitor database query plans

### Edge Cases

- [ ] Search with only spaces
- [ ] Search with emoji
- [ ] Search with SQL injection attempt
- [ ] Very long search query (200 chars)
- [ ] Search with no results
- [ ] Search with URL-encoded characters

---

## 7. Implementation Priority & Timeline

### Phase 1: Critical (Week 1)
1. **Database Indexes** - 2 hours
   - Create migration
   - Apply to production
   - Verify query plans

2. **Rate Limiting** - 4 hours
   - Implement rate limiter
   - Add to API endpoint
   - Test limits

### Phase 2: Performance (Week 2)
3. **Search Caching** - 6 hours
   - Implement cache layer
   - Add cache invalidation
   - Monitor hit rates

4. **Full-Text Search** - 8 hours
   - Migrate to PostgreSQL full-text search
   - Update API queries
   - Benchmark improvements

### Phase 3: UX Enhancement (Week 3)
5. **Result Highlighting** - 3 hours
6. **No Results Suggestions** - 2 hours
7. **Search Autocomplete** - 8 hours (future enhancement)

**Total Estimated Effort**: 33 hours (1.5 weeks full-time)

---

## 8. Monitoring & Observability

### Key Metrics to Track

1. **Search Performance**
   - Average query response time
   - P95/P99 latency
   - Query count per hour

2. **Cache Performance**
   - Cache hit rate
   - Cache miss rate
   - Cache eviction rate

3. **Rate Limiting**
   - Requests blocked per hour
   - Top IP addresses hitting limits
   - Average requests per user

4. **User Behavior**
   - Most searched terms
   - Search refinement patterns
   - Zero-result search queries

### Recommended Tools

- **Database**: PostgreSQL slow query log
- **Application**: Next.js middleware logging
- **Monitoring**: Datadog, New Relic, or Sentry
- **Analytics**: PostHog or Mixpanel

---

## 9. Conclusion

The search functionality is **operational but requires optimization** for production scale. The most critical issues are:

1. ✅ **Missing database indexes** (blocks production scalability)
2. ✅ **No rate limiting** (security vulnerability)
3. ⚠️ **No caching** (performance opportunity)

Implementing the recommended optimizations will:
- Reduce search latency by **90-95%**
- Protect against abuse and DoS attacks
- Improve user experience with faster results
- Support growth to 10,000+ artists without performance degradation

**Recommended Action**: Implement Phase 1 (database indexes + rate limiting) **before launching to production** with significant user traffic.

---

## Appendix: Files Modified/Created

### Files to Modify
1. `/app/api/artists/route.ts` - Add rate limiting & caching
2. `/components/artists/EnhancedArtistListing.tsx` - Enhanced no-results state
3. `/components/artists/ArtistCard.tsx` - Search highlighting
4. `/messages/en.json` - Add search tip translations
5. `/messages/th.json` - Add search tip translations

### Files to Create
1. `/lib/rate-limit.ts` - Rate limiting utility
2. `/lib/search-cache.ts` - Search caching layer
3. `/components/artists/SearchResultHighlight.tsx` - Highlighting component
4. `/prisma/migrations/YYYYMMDD_add_search_indexes/migration.sql` - Database indexes

### Database Migrations
1. Add full-text search indexes (GIN)
2. Add trigram indexes for fuzzy search
3. Add composite indexes for filtering

---

**Report Generated**: 2025-10-03
**Next Review**: After Phase 1 implementation
**Performance Target**: <100ms search response time for 10K+ artists
