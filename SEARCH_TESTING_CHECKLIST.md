# Search Functionality Testing Checklist
**Platform**: Bright Ears Entertainment Booking
**Feature**: Artist Search & Filtering
**Date**: 2025-10-03
**Tester**: _______________

---

## Pre-Testing Setup

### Database Preparation
- [ ] Run database migrations: `npx prisma migrate deploy`
- [ ] Verify search indexes created: Check PostgreSQL with `\d+ "Artist"`
- [ ] Ensure test data exists: At least 50-100 artists in database
- [ ] Include artists with diverse:
  - [ ] Different categories (DJ, Band, Singer, etc.)
  - [ ] Different cities/locations
  - [ ] Price ranges
  - [ ] English and Thai bios
  - [ ] Various genres

### Environment Check
- [ ] Server running: `npm run dev` or production URL
- [ ] Database connected: Check console for Prisma connection
- [ ] No errors in console on page load
- [ ] Rate limiting configured: Check `/lib/rate-limit.ts`
- [ ] Cache functioning: Check `/lib/search-cache.ts`

---

## 1. Basic Search Functionality

### Text Search
- [ ] **Empty search**: Shows all artists
- [ ] **Single word**: Search "jazz" returns jazz artists
- [ ] **Multiple words**: Search "jazz DJ" returns relevant results
- [ ] **Partial match**: Search "elec" matches "electronic", "electro"
- [ ] **Case insensitive**: "JAZZ", "jazz", "Jazz" all work the same
- [ ] **Special characters**: Search with "&", "#", "@" doesn't break
- [ ] **Numbers**: Search "80s" or "2024" works if relevant
- [ ] **Thai language**: Search with Thai characters (e.g., "แจ๊ส") works

### Artist Name Search
- [ ] **Full name**: Exact artist name returns that artist
- [ ] **Partial name**: "DJ Max" finds "DJ Maxwell"
- [ ] **Nickname**: Stage name variations are found

### Genre/Bio Search
- [ ] **Genre keyword**: "rock" finds rock artists
- [ ] **Bio content**: Keywords in bio are searchable
- [ ] **Thai bio**: Search Thai keywords in bioTh field

---

## 2. Search Debouncing

### Timing Tests
- [ ] **300ms delay**: Typing quickly doesn't trigger multiple searches
- [ ] **Visual feedback**: Search term shows in suggestion box
- [ ] **No flickering**: Results don't flash during typing
- [ ] **Smooth UX**: No lag or stutter during rapid typing

### Behavior Tests
- [ ] Type "j" → wait → results update
- [ ] Type "ja" → wait → results update
- [ ] Type "jaz" → wait → results update
- [ ] Type "jazz" rapidly → only searches after 300ms pause
- [ ] Clear search → results immediately show all artists

---

## 3. Filtering Functionality

### Category Filter
- [ ] Select "DJ" → only DJs shown
- [ ] Select "Band" → only bands shown
- [ ] Multiple categories → shows all selected categories
- [ ] Combine with search → filters + search both apply

### Location Filter
- [ ] Select city (e.g., "Bangkok") → only Bangkok artists
- [ ] Search + location → both filters apply
- [ ] Service areas included → artists serving selected city appear

### Price Range Filter
- [ ] Set min price → artists below min excluded
- [ ] Set max price → artists above max excluded
- [ ] Set both → only artists in range shown
- [ ] Edge cases → artists with NULL hourly rate handled

### Genre Filter
- [ ] Select genre → artists with that genre shown
- [ ] Multiple genres → artists with any selected genre shown
- [ ] Combine filters → all filters work together

### Language Filter
- [ ] Select language → artists speaking that language shown
- [ ] Multiple languages → OR logic (artists speaking any)

### Verification Filter
- [ ] Filter by verification level
- [ ] Multiple levels selectable
- [ ] Works with other filters

### Availability Filter
- [ ] Toggle "Show available only"
- [ ] Only artists with availability in next 30 days shown
- [ ] Respects blackout dates and existing bookings

---

## 4. Sorting Functionality

### Sort Options Test Each:
- [ ] **Featured**: Verification → Rating → Bookings order
- [ ] **Highest Rating**: Sorted by averageRating DESC
- [ ] **Price Low to High**: Hourly rate ascending
- [ ] **Price High to Low**: Hourly rate descending
- [ ] **Most Booked**: completedBookings descending
- [ ] **Newest First**: createdAt descending

### Combined Sort + Filter
- [ ] Sort works with search active
- [ ] Sort works with filters active
- [ ] Sort persists across pagination

---

## 5. Pagination

### Basic Pagination
- [ ] Page 1 shows first 20 results
- [ ] Page 2 shows next 20 results
- [ ] "Previous" disabled on page 1
- [ ] "Next" disabled on last page
- [ ] Page indicator shows current page correctly

### Pagination + Search
- [ ] Search updates → resets to page 1
- [ ] Filter changes → resets to page 1
- [ ] Sort changes → resets to page 1
- [ ] Pagination preserves search/filter/sort in URL

### URL State Management
- [ ] URL contains all parameters: `?search=jazz&page=2&sort=rating`
- [ ] Refresh page → same results shown (URL state persisted)
- [ ] Back button → previous search/filter state restored
- [ ] Share URL → recipient sees same results

---

## 6. Performance Testing

### Response Time
- [ ] **First search**: < 500ms (without cache)
- [ ] **Repeat search**: < 50ms (with cache)
- [ ] **Complex filters**: < 1s even with multiple filters
- [ ] **Large dataset**: Test with 1000+ artists (if available)

### Rate Limiting
- [ ] Make 60 searches in 1 minute → all succeed
- [ ] Make 61st search → receives 429 error
- [ ] Error message shows retry time
- [ ] After 1 minute → can search again
- [ ] Rate limit headers present: `X-RateLimit-Limit`, `X-RateLimit-Remaining`

### Caching
- [ ] First search: API called (check Network tab)
- [ ] Same search again: No API call (cached)
- [ ] Different search: API called (new query)
- [ ] Cache expires after 3 minutes → API called again
- [ ] Response includes `cached: true` when from cache

### Database Indexes
**Run in PostgreSQL to verify indexes:**
```sql
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'Artist'
AND indexname LIKE 'idx_artist%';
```

- [ ] `idx_artist_stagename_trigram` exists
- [ ] `idx_artist_bio_fulltext` exists
- [ ] `idx_artist_bio_th_fulltext` exists
- [ ] `idx_artist_genres_gin` exists
- [ ] `idx_artist_search_composite` exists

**Check query plan (should use indexes):**
```sql
EXPLAIN ANALYZE
SELECT * FROM "Artist"
WHERE "stageName" ILIKE '%jazz%'
LIMIT 20;
```

- [ ] Query uses index scan (not sequential scan)
- [ ] Execution time < 50ms for indexed fields

---

## 7. User Interface

### Search Bar
- [ ] Placeholder text shows: "Search artists by name, genre, or style..."
- [ ] Clear button (X) appears when typing
- [ ] Clear button empties search and shows all results
- [ ] Search icon visible
- [ ] Focus state: Border highlights cyan
- [ ] Glass morphism design visible
- [ ] Gradient border animation on focus

### Search Suggestions Dropdown
- [ ] Appears when typing
- [ ] Shows "Searching for: {query}"
- [ ] Closes when clicking outside
- [ ] Does not block other UI elements

### Active Filter Chips
- [ ] Shows active search term as chip
- [ ] Shows active filters as chips
- [ ] Click X on chip → removes that filter
- [ ] "Clear All" button visible when filters active
- [ ] Chips have proper styling (cyan theme)

### No Results State
- [ ] Shows search icon (🔍)
- [ ] Heading: "No artists found"
- [ ] Subtitle: "Try adjusting your filters"
- [ ] **Search Tips box visible**:
  - [ ] Blue background with border
  - [ ] 4 tips listed with checkmarks
  - [ ] Readable and helpful
- [ ] "Clear All Filters" button shown
- [ ] Button works (clears filters and shows all)

### Loading State
- [ ] Loading skeleton cards shown (6 cards)
- [ ] Glass morphism on skeleton
- [ ] Gradient animation visible
- [ ] No flash of content

### Artist Cards (Search Results)
- [ ] All cards render correctly
- [ ] Images load properly
- [ ] Rating stars display
- [ ] Price shown correctly
- [ ] "Verified" badges visible
- [ ] Cards clickable → go to artist profile

---

## 8. Mobile Responsiveness

### Mobile View (< 768px)
- [ ] Search bar full width
- [ ] Filters button visible (funnel icon)
- [ ] Filters open in drawer/modal
- [ ] Results stack vertically (1 column)
- [ ] Pagination buttons sized properly
- [ ] No horizontal scroll

### Tablet View (768px - 1024px)
- [ ] 2 column grid for results
- [ ] Filters in sidebar or drawer
- [ ] All functionality works
- [ ] Touch-friendly hit areas

---

## 9. Edge Cases & Error Handling

### Invalid Input
- [ ] Empty spaces only → treated as empty search
- [ ] SQL injection attempt → safely escaped
- [ ] XSS attempt (`<script>`) → safely escaped
- [ ] Very long query (1000 chars) → handled gracefully
- [ ] Unicode/emoji → works or safely ignored

### Empty States
- [ ] No artists in database → friendly message
- [ ] Filter combination with 0 results → helpful suggestions
- [ ] All artists inactive → shows "no results"

### Network Errors
- [ ] API timeout → error message shown
- [ ] 500 server error → error message shown
- [ ] Offline → error message shown
- [ ] Error message includes retry option

### Browser Compatibility
- [ ] **Chrome**: All features work
- [ ] **Firefox**: All features work
- [ ] **Safari**: All features work
- [ ] **Edge**: All features work
- [ ] **Mobile Safari (iOS)**: All features work
- [ ] **Mobile Chrome (Android)**: All features work

---

## 10. Accessibility

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Search input focusable
- [ ] Filter buttons focusable
- [ ] Pagination buttons focusable
- [ ] Artist cards focusable/clickable
- [ ] Enter key submits search (if applicable)

### Screen Reader
- [ ] Search input has proper label
- [ ] Filter buttons have aria-labels
- [ ] Loading state announced
- [ ] Results count announced
- [ ] Error messages announced

### Visual Accessibility
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Focus indicators visible
- [ ] Text readable at 200% zoom
- [ ] No information conveyed by color alone

---

## 11. Advanced Search Tests

### Combined Filters Test
Test all filters together:
- [ ] Search: "jazz"
- [ ] Category: "DJ"
- [ ] Location: "Bangkok"
- [ ] Price: 1000-3000 THB
- [ ] Genre: "Electronic"
- [ ] Language: "English"
- [ ] Verification: "Verified"
- [ ] Availability: Yes
- [ ] Sort: "Rating"
- [ ] **All filters apply correctly**

### URL Parameters Test
Manually construct URL:
```
/en/artists?search=jazz&categories=DJ&city=Bangkok&minPrice=1000&maxPrice=3000&sort=rating
```
- [ ] All parameters parsed correctly
- [ ] Results match expectations
- [ ] UI reflects all filters

---

## 12. Performance Benchmarks

### Load Testing (if tools available)
- [ ] 10 concurrent users searching → all succeed
- [ ] 50 concurrent users → acceptable performance
- [ ] 100 concurrent users → rate limiting kicks in
- [ ] Rate limit doesn't block legitimate users

### Cache Hit Rate
After 100 searches:
- [ ] Cache hit rate > 50%
- [ ] Popular searches cached
- [ ] Rare searches still fast

---

## 13. Regression Tests

### Existing Functionality
- [ ] Artist profile pages still work
- [ ] Booking flow still works
- [ ] User authentication still works
- [ ] Admin panel still works
- [ ] Other pages unaffected

---

## Issues Found

| # | Issue Description | Severity | Steps to Reproduce | Screenshot |
|---|-------------------|----------|-------------------|------------|
| 1 |                   |          |                   |            |
| 2 |                   |          |                   |            |
| 3 |                   |          |                   |            |

**Severity Levels:**
- **Critical**: Breaks search completely
- **High**: Major functionality broken
- **Medium**: Minor functionality issue
- **Low**: Cosmetic or edge case

---

## Test Summary

**Date Tested**: _______________
**Tester**: _______________
**Environment**: ☐ Development ☐ Staging ☐ Production

### Results
- **Total Tests**: ___ / ___
- **Passed**: ___
- **Failed**: ___
- **Blocked**: ___

### Overall Status
☐ **PASS** - All critical and high priority tests passed
☐ **CONDITIONAL PASS** - Minor issues found, approved for release
☐ **FAIL** - Critical issues found, requires fixes

### Recommendations
- [ ] Ready for production deployment
- [ ] Requires minor fixes before deployment
- [ ] Requires major fixes before deployment
- [ ] Needs performance optimization
- [ ] Needs additional testing

---

## Notes

_Add any additional observations, suggestions, or concerns here:_

---

**Approved By**: _______________
**Date**: _______________
