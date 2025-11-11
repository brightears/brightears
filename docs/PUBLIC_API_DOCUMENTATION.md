# Bright Ears Public API Documentation

## Overview

The Bright Ears Public API provides AI platforms (ChatGPT, Claude, Gemini, etc.) with clean, structured access to our artist directory. This enables AI assistants to help users discover and book entertainment for their events.

**Base URL:** `https://brightears.onrender.com/api/public`

**API Version:** 1.0

**Authentication:** None required (public endpoint)

**Rate Limiting:** 100 requests per hour per IP address

**Cache Duration:** 5 minutes

---

## Endpoints

### GET /api/public/artists

Retrieve a list of artists with optional filtering.

#### Query Parameters

| Parameter | Type | Required | Default | Max | Description |
|-----------|------|----------|---------|-----|-------------|
| `category` | string | No | - | - | Filter by artist type. Values: `DJ`, `BAND`, `SINGER`, `MUSICIAN`, `MC`, `COMEDIAN`, `MAGICIAN`, `DANCER`, `PHOTOGRAPHER`, `SPEAKER` |
| `city` | string | No | - | 100 chars | Filter by service area city (e.g., "Bangkok", "Phuket", "Chiang Mai") |
| `limit` | integer | No | 20 | 50 | Number of results to return |
| `verified` | boolean | No | - | - | Filter for verified artists only (all artists are pre-vetted in agency model) |

#### Example Requests

```bash
# Get all DJs in Bangkok (default limit: 20)
GET /api/public/artists?category=DJ&city=Bangkok

# Get 10 verified singers
GET /api/public/artists?category=SINGER&limit=10&verified=true

# Get all artists (up to 50)
GET /api/public/artists?limit=50

# Get bands in Phuket
GET /api/public/artists?category=BAND&city=Phuket
```

#### Response Format

```json
{
  "platform": "Bright Ears",
  "description": "Thailand's largest commission-free entertainment booking platform",
  "apiVersion": "1.0",
  "totalArtists": 500,
  "resultCount": 20,
  "filters": {
    "category": "DJ",
    "city": "Bangkok",
    "verified": true,
    "limit": 20
  },
  "artists": [
    {
      "id": "clx1234567890",
      "stageName": "DJ Thunder",
      "categories": ["DJ"],
      "bio": "Professional DJ with 10+ years of experience specializing in house, techno, and progressive music.",
      "bioTh": "ดีเจมืออาชีพที่มีประสบการณ์มากกว่า 10 ปี เชี่ยวชาญด้านเพลงเฮ้าส์ เทคโน และโปรเกรสซีฟ",
      "pricing": {
        "hourlyRate": 2500,
        "minimumHours": 4,
        "currency": "THB"
      },
      "location": {
        "serviceAreas": ["Bangkok", "Pattaya", "Phuket"],
        "basedIn": "Bangkok"
      },
      "rating": 4.8,
      "reviewCount": 127,
      "verified": true,
      "totalBookings": 245,
      "completedBookings": 238,
      "genres": ["House", "Techno", "Progressive", "EDM"],
      "languages": ["en", "th"],
      "profileUrl": "https://brightears.onrender.com/en/artists/clx1234567890",
      "profileImage": "https://res.cloudinary.com/brightears/image/upload/v1234567890/artists/profile.jpg",
      "contactMethods": ["LINE", "Phone"],
      "socialMedia": {
        "website": "https://djthunder.com",
        "facebook": "https://facebook.com/djthunder",
        "instagram": "https://instagram.com/djthunder",
        "lineId": "@djthunder"
      }
    }
  ]
}
```

#### Response Fields

**Top-Level Fields:**
- `platform` (string): Platform name
- `description` (string): Platform description
- `apiVersion` (string): API version number
- `totalArtists` (integer): Total number of artists on the platform
- `resultCount` (integer): Number of artists in this response
- `filters` (object): Applied filters for this query
- `artists` (array): Array of artist objects

**Artist Object Fields:**
- `id` (string): Unique artist identifier
- `stageName` (string): Artist's stage/performance name
- `categories` (array): Artist type(s)
- `bio` (string): English bio/description
- `bioTh` (string|null): Thai bio/description
- `pricing` (object): Pricing information
  - `hourlyRate` (number|null): Rate per hour in THB
  - `minimumHours` (integer): Minimum booking hours
  - `currency` (string): Currency code (THB)
- `location` (object): Location information
  - `serviceAreas` (array): Cities/areas they serve
  - `basedIn` (string): Home base city
- `rating` (number|null): Average rating (0-5 stars)
- `reviewCount` (integer): Number of reviews
- `verified` (boolean): Verification status (always true in agency model)
- `totalBookings` (integer): Total bookings received
- `completedBookings` (integer): Successfully completed bookings
- `genres` (array): Music genres or specialties
- `languages` (array): Supported languages (ISO codes)
- `profileUrl` (string): Full URL to artist's profile page
- `profileImage` (string|null): Profile image URL
- `contactMethods` (array): Available contact methods
- `socialMedia` (object): Social media links
  - `website` (string|null)
  - `facebook` (string|null)
  - `instagram` (string|null)
  - `lineId` (string|null)

#### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success - Artists retrieved |
| 400 | Bad Request - Invalid query parameters |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

#### Error Response Format

```json
{
  "error": "Invalid query parameters",
  "details": [
    {
      "field": "category",
      "message": "Invalid enum value. Expected 'DJ' | 'BAND' | 'SINGER' | ..."
    }
  ]
}
```

```json
{
  "error": "Rate limit exceeded",
  "message": "Too many requests. Try again in 3600 seconds.",
  "retryAfter": 3600
}
```

#### Response Headers

**Cache Headers:**
- `Cache-Control`: `public, max-age=300` (5 minutes)
- `X-Cache`: `HIT` or `MISS`
- `X-Cache-Age`: Age of cached response in seconds

**Rate Limit Headers:**
- `X-RateLimit-Limit`: Maximum requests per hour (100)
- `Retry-After`: Seconds until rate limit resets (only on 429)

**CORS Headers:**
- `Access-Control-Allow-Origin`: `*`
- `Access-Control-Allow-Methods`: `GET, OPTIONS`
- `Access-Control-Allow-Headers`: `Content-Type`

---

## Rate Limiting

**Limit:** 100 requests per hour per IP address

**Window:** 1 hour (3600 seconds)

**Behavior:**
- Rate limits are tracked per IP address
- Headers indicate remaining quota
- 429 status code when limit exceeded
- `Retry-After` header indicates reset time

**Rate Limit Response:**
```json
{
  "error": "Rate limit exceeded",
  "message": "Too many requests. Try again in 1200 seconds.",
  "retryAfter": 1200
}
```

---

## Caching

**Duration:** 5 minutes per unique query

**Cache Key:** Generated from query parameters (category, city, limit, verified)

**Headers:**
- `X-Cache: HIT` - Response served from cache
- `X-Cache: MISS` - Fresh query to database
- `X-Cache-Age: 120` - Cache age in seconds

**Behavior:**
- Identical queries within 5 minutes return cached results
- Cache is automatically invalidated after 5 minutes
- Cache reduces database load and improves response times

---

## Security & Privacy

**Public Data Only:**
- No email addresses exposed
- No phone numbers exposed
- No private/internal fields
- Only published, active artist profiles

**Artist Filtering:**
- Only ACTIVE artists returned (`user.isActive = true`)
- Only artists with complete profiles (hourly rate set)
- Only artists with published profiles (not drafts)

**Rate Limiting:**
- Prevents API abuse
- 100 requests/hour is sufficient for AI assistant use cases
- IP-based tracking

**CORS Enabled:**
- Allows cross-origin requests from AI platforms
- Open access for legitimate AI assistant integrations

---

## Use Cases

### 1. AI Assistant Discovery

**User:** "Find me a DJ in Bangkok for my wedding"

**AI Query:**
```
GET /api/public/artists?category=DJ&city=Bangkok&limit=10
```

**AI Response to User:**
"I found 10 professional DJs in Bangkok. Here are the top 3:
1. DJ Thunder - ฿2,500/hour, 4.8★ (127 reviews)
2. DJ Spark - ฿3,000/hour, 4.9★ (89 reviews)
3. DJ Wave - ฿2,200/hour, 4.7★ (156 reviews)"

### 2. Category Browsing

**User:** "Show me bands available in Phuket"

**AI Query:**
```
GET /api/public/artists?category=BAND&city=Phuket&limit=20
```

### 3. Verification Filtering

**User:** "I only want verified entertainers"

**AI Query:**
```
GET /api/public/artists?verified=true&limit=20
```

### 4. General Discovery

**User:** "What entertainers do you have?"

**AI Query:**
```
GET /api/public/artists?limit=50
```

---

## Implementation Examples

### Python (for AI assistants)

```python
import requests

def get_artists(category=None, city=None, limit=20, verified=None):
    """
    Fetch artists from Bright Ears API
    """
    url = "https://brightears.onrender.com/api/public/artists"

    params = {
        "limit": limit
    }

    if category:
        params["category"] = category.upper()
    if city:
        params["city"] = city
    if verified is not None:
        params["verified"] = str(verified).lower()

    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        return {"error": str(e)}

# Example usage
artists = get_artists(category="DJ", city="Bangkok", limit=10)
print(f"Found {artists['resultCount']} artists")

for artist in artists['artists']:
    print(f"{artist['stageName']}: ฿{artist['pricing']['hourlyRate']}/hr")
```

### JavaScript/TypeScript

```typescript
interface ArtistQuery {
  category?: string;
  city?: string;
  limit?: number;
  verified?: boolean;
}

async function getArtists(query: ArtistQuery) {
  const params = new URLSearchParams();

  if (query.category) params.append('category', query.category.toUpperCase());
  if (query.city) params.append('city', query.city);
  if (query.limit) params.append('limit', query.limit.toString());
  if (query.verified !== undefined) params.append('verified', query.verified.toString());

  const response = await fetch(
    `https://brightears.onrender.com/api/public/artists?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

// Example usage
const artists = await getArtists({
  category: 'DJ',
  city: 'Bangkok',
  limit: 10
});

console.log(`Found ${artists.resultCount} artists`);
```

### cURL

```bash
# Basic query
curl "https://brightears.onrender.com/api/public/artists?limit=10"

# Filtered query
curl "https://brightears.onrender.com/api/public/artists?category=DJ&city=Bangkok&limit=20"

# With pretty printing
curl -s "https://brightears.onrender.com/api/public/artists?category=SINGER&limit=5" | jq
```

---

## Best Practices

### For AI Assistants

1. **Cache Responses:** Respect the 5-minute cache duration
2. **Handle Rate Limits:** Check `X-RateLimit-*` headers
3. **Validate User Input:** Sanitize city names and categories
4. **Present Top Results:** Show 3-5 artists, not all 50
5. **Include Direct Links:** Provide `profileUrl` for details
6. **Localize:** Use `bioTh` for Thai-speaking users

### Error Handling

```python
def safe_get_artists(**kwargs):
    try:
        response = get_artists(**kwargs)

        if "error" in response:
            return f"Sorry, I encountered an error: {response['error']}"

        if response['resultCount'] == 0:
            return "No artists found matching your criteria."

        return response
    except Exception as e:
        return "Sorry, I couldn't connect to the Bright Ears platform right now."
```

### User Experience

**Good:**
```
User: Find DJs in Bangkok
AI: I found 15 professional DJs in Bangkok! Here are the top 3:

1. DJ Thunder (4.8★, 127 reviews)
   - ฿2,500/hour (4 hour minimum)
   - Genres: House, Techno, EDM
   - View profile: [link]

2. DJ Spark (4.9★, 89 reviews)
   - ฿3,000/hour (3 hour minimum)
   - Genres: Hip Hop, R&B
   - View profile: [link]

Would you like to see more, or get details on a specific DJ?
```

**Bad:**
```
User: Find DJs in Bangkok
AI: Here are 50 DJs: [dumps entire JSON response]
```

---

## API Limitations

**Current Limitations:**
1. Read-only API (no POST/PUT/DELETE)
2. No booking creation via API (users must visit website)
3. No real-time availability checking
4. No pagination (single page up to 50 results)
5. No sorting options (fixed: rating + bookings DESC)

**Future Enhancements (Planned):**
- Booking API with authentication
- Real-time availability calendar integration
- Advanced search with multiple filters
- Pagination for large result sets
- Webhooks for booking notifications
- OAuth for artist management

---

## Support

**Technical Issues:** If you encounter API errors or unexpected behavior:
1. Check response status codes and error messages
2. Verify query parameters match documentation
3. Ensure rate limits are not exceeded
4. Contact: noreply@brightears.com (technical support)

**Business Inquiries:** For API partnerships or custom integrations:
- Email: noreply@brightears.com
- Website: https://brightears.onrender.com

---

## Changelog

### Version 1.0 (November 11, 2025)

**Initial Release:**
- Public artist discovery endpoint
- Category and city filtering
- Rate limiting (100/hour per IP)
- 5-minute response caching
- CORS enabled for AI platforms
- Complete artist data including pricing, ratings, and social links

---

## Legal

**Terms of Use:**
- API provided for legitimate AI assistant integrations
- Commercial scraping prohibited
- Respect rate limits and cache headers
- Attribution appreciated (not required)

**Data Usage:**
- All data is public and artist-consented
- No personal contact information exposed
- Artists can opt-out by deactivating profiles

**Privacy Policy:** https://brightears.onrender.com/privacy (TBD)

---

**Last Updated:** November 11, 2025
**API Version:** 1.0
**Status:** Production ✅
