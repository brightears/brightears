# Admin Dashboard Architecture - Bright Ears Platform

## 1. Executive Summary

The Bright Ears Admin Dashboard is a comprehensive management system designed for the platform owner to review DJ/artist applications and manage all bookings efficiently. The system transforms the platform from marketplace to agency-managed by providing centralized control over artist onboarding through manual approval, while maintaining existing booking and artist management capabilities.

**Key Technology Choices:**
- **Next.js 15 App Router** with Server Components for optimal performance
- **Clerk Authentication** for secure admin access control
- **Prisma ORM** with PostgreSQL for type-safe database operations
- **React Server Actions** for efficient data mutations
- **Tailwind CSS** with glass morphism design for consistent UI

**Current Platform State:**
- Application form live at `/en/apply` and `/th/apply`
- Applications stored in database with 23 fields (Application model)
- Existing Artist and Booking models ready for integration
- Authentication system operational with Clerk
- Admin role-based access control already implemented

---

## 2. Architecture Overview

The admin dashboard follows a **layered architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER (Browser)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Dashboard   │  │ Applications │  │   Bookings   │      │
│  │   Overview   │  │  Management  │  │  Management  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│                     API LAYER (Next.js)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Stats     │  │ Applications │  │   Bookings   │      │
│  │   Endpoint   │  │   Endpoints  │  │   Endpoints  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         ↕                  ↕                  ↕              │
│  ┌──────────────────────────────────────────────────┐      │
│  │        Authentication & Authorization             │      │
│  │        (Clerk + Role Validation)                  │      │
│  └──────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕ Prisma ORM
┌─────────────────────────────────────────────────────────────┐
│                   DATABASE LAYER (PostgreSQL)                │
│  ┌─────────────┐  ┌──────────┐  ┌─────────┐  ┌──────────┐ │
│  │ Application │  │  Artist  │  │ Booking │  │   User   │ │
│  │   (23 flds) │  │          │  │         │  │ (w/role) │ │
│  └─────────────┘  └──────────┘  └─────────┘  └──────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Key Interactions:**
1. **Admin authenticates** → Clerk verifies identity → Role checked (ADMIN only)
2. **Admin views dashboard** → Stats API aggregates data → Real-time metrics displayed
3. **Admin reviews application** → Detail modal fetches full data → Approve/Reject actions
4. **Admin approves** → Application status updated → Artist record created automatically
5. **Admin manages bookings** → Booking API provides CRUD operations → Status updates tracked

---

## 3. Service Definitions

### 3.1 Application Management Service
**Responsibilities:**
- List all applications with filtering (status, category, date range, search)
- Retrieve individual application details (all 23 fields)
- Approve applications and trigger artist profile creation
- Reject applications with reason tracking
- Send email notifications (approval/rejection)

**Key Business Logic:**
- **Approval Process**: Sets status to APPROVED, creates Artist record, sends confirmation email
- **Rejection Process**: Sets status to REJECTED, stores rejection reason, sends notification
- **Duplicate Detection**: Prevents multiple applications from same email/phone within 7 days
- **Rate Limiting**: 3 applications per email/phone per 24 hours

### 3.2 Booking Management Service
**Responsibilities:**
- List all bookings with filters (status, artist, customer, date range)
- View booking details with customer and artist information
- Update booking status (INQUIRY → QUOTED → CONFIRMED → PAID → COMPLETED)
- Export booking data to CSV for reporting
- Track booking lifecycle and revenue metrics

### 3.3 Artist Management Service
**Responsibilities:**
- List all approved artists (created from approved applications)
- View artist performance metrics (bookings, revenue, ratings)
- Toggle artist visibility (active/inactive status)
- Quick edit artist profiles (pricing, availability, categories)
- Monitor artist verification status

### 3.4 Dashboard Statistics Service
**Responsibilities:**
- Aggregate pending applications count (real-time)
- Calculate total approved artists
- Count active bookings by status
- Compute monthly revenue (current month)
- Track conversion metrics (application → artist → bookings)

---

## 4. API Contracts

### 4.1 GET `/api/admin/applications`
**Purpose:** List applications with filtering and pagination

**Query Parameters:**
```typescript
{
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL' (default: 'ALL')
  category?: ArtistCategory (DJ, BAND, SINGER, etc.)
  search?: string (searches name, email, phone)
  dateFrom?: ISO8601 date
  dateTo?: ISO8601 date
  page?: number (default: 1)
  limit?: number (default: 20, max: 100)
}
```

**Success Response (200):**
```json
{
  "applications": [
    {
      "id": "uuid",
      "applicantName": "John Doe",
      "email": "john@example.com",
      "phone": "0812345678",
      "lineId": "@johndj",
      "stageName": "DJ Thunder",
      "category": "DJ",
      "status": "PENDING",
      "submittedAt": "2025-01-15T10:30:00Z",
      "reviewedAt": null
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: User role is not ADMIN

---

### 4.2 GET `/api/admin/applications/[id]`
**Purpose:** Get complete application details (all 23 fields)

**Success Response (200):**
```json
{
  "id": "uuid",
  "applicantName": "John Doe",
  "email": "john@example.com",
  "phone": "0812345678",
  "lineId": "@johndj",
  "stageName": "DJ Thunder",
  "bio": "Professional DJ with 10 years experience...",
  "category": "DJ",
  "genres": ["House", "Techno", "EDM"],
  "profilePhotoUrl": "https://cloudinary.com/...",
  "website": "https://djthunder.com",
  "socialMediaLinks": "Instagram: @djthunder, Facebook: /djthunder",
  "yearsExperience": 10,
  "equipmentOwned": "Pioneer DDJ-1000, Technics SL-1200...",
  "portfolioLinks": "Mixcloud: /djthunder, SoundCloud: /djthunder",
  "baseLocation": "Bangkok",
  "hourlyRateExpectation": "5000",
  "interestedInMusicDesign": true,
  "designFee": "15000",
  "monthlyFee": "8000",
  "status": "PENDING",
  "submittedAt": "2025-01-15T10:30:00Z",
  "reviewedAt": null,
  "reviewNotes": null
}
```

**Error Responses:**
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not admin
- `404 Not Found`: Application ID doesn't exist

---

### 4.3 POST `/api/admin/applications/[id]/approve`
**Purpose:** Approve application and create Artist profile

**Request Body:**
```json
{
  "reviewNotes": "Great portfolio, approved for Featured tier"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Application approved successfully",
  "application": {
    "id": "uuid",
    "status": "APPROVED",
    "reviewedAt": "2025-01-15T14:25:00Z"
  },
  "artist": {
    "id": "artist-uuid",
    "userId": "user-uuid",
    "stageName": "DJ Thunder",
    "category": "DJ",
    "hourlyRate": 5000,
    "profileCompleteness": 65
  }
}
```

**Business Logic:**
1. Validate application is in PENDING status
2. Update Application: `status = APPROVED`, `reviewedAt = now()`, store `reviewNotes`
3. Create User record (if doesn't exist) with role ARTIST
4. Create Artist record with data mapped from application:
   - `stageName` ← `applicantName`
   - `realName` ← `applicantName`
   - `bio` ← `bio`
   - `category` ← `category`
   - `genres` ← `genres`
   - `profileImage` ← `profilePhotoUrl`
   - `baseCity` ← `baseLocation`
   - `hourlyRate` ← `hourlyRateExpectation`
   - `website`, `facebook`, `instagram`, `lineId` ← extracted from `socialMediaLinks`
   - `isDraft` = false (profile goes live immediately)
   - `profileCompleteness` = calculated (50-80% typically)
5. Send approval confirmation email to applicant
6. Return success with both application and artist data

**Error Responses:**
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not admin
- `404 Not Found`: Application not found
- `409 Conflict`: Application already reviewed (not PENDING)
- `500 Internal Server Error`: Artist creation failed

---

### 4.4 POST `/api/admin/applications/[id]/reject`
**Purpose:** Reject application with reason

**Request Body:**
```json
{
  "rejectionReason": "Portfolio does not meet quality standards",
  "reviewNotes": "Insufficient experience, recommend reapplying in 6 months"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Application rejected",
  "application": {
    "id": "uuid",
    "status": "REJECTED",
    "reviewedAt": "2025-01-15T14:30:00Z"
  }
}
```

**Business Logic:**
1. Validate application is in PENDING status
2. Update Application: `status = REJECTED`, `reviewedAt = now()`, `reviewNotes = reason`
3. Send rejection email to applicant (polite, constructive)
4. Return success confirmation

**Error Responses:**
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not admin
- `404 Not Found`: Application not found
- `409 Conflict`: Application already reviewed

---

### 4.5 GET `/api/admin/stats`
**Purpose:** Dashboard statistics and metrics

**Success Response (200):**
```json
{
  "applications": {
    "pending": 12,
    "approved": 48,
    "rejected": 5,
    "total": 65
  },
  "artists": {
    "total": 48,
    "active": 42,
    "verified": 18,
    "newThisMonth": 8
  },
  "bookings": {
    "active": 23,
    "inquiry": 8,
    "quoted": 6,
    "confirmed": 5,
    "paid": 4,
    "thisMonth": 15
  },
  "revenue": {
    "thisMonth": 125000,
    "lastMonth": 98000,
    "change": "+27.6%",
    "currency": "THB"
  }
}
```

**Performance:** Optimized with database aggregations, cached for 5 minutes

---

### 4.6 GET `/api/admin/bookings`
**Purpose:** List bookings with filters

**Query Parameters:**
```typescript
{
  status?: BookingStatus
  artistId?: string
  customerId?: string
  dateFrom?: ISO8601
  dateTo?: ISO8601
  page?: number
  limit?: number
}
```

**Success Response (200):**
```json
{
  "bookings": [
    {
      "id": "uuid",
      "bookingNumber": "BE-2025-001",
      "artist": {
        "id": "artist-uuid",
        "stageName": "DJ Thunder"
      },
      "customer": {
        "id": "customer-uuid",
        "name": "Jane Smith",
        "email": "jane@example.com"
      },
      "eventType": "Wedding",
      "eventDate": "2025-02-14T18:00:00Z",
      "quotedPrice": 12000,
      "status": "CONFIRMED",
      "createdAt": "2025-01-10T09:00:00Z"
    }
  ],
  "pagination": {
    "total": 156,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  }
}
```

---

### 4.7 GET `/api/admin/artists`
**Purpose:** List all artists with metrics

**Query Parameters:**
```typescript
{
  category?: ArtistCategory
  city?: string
  status?: 'active' | 'inactive'
  page?: number
  limit?: number
}
```

**Success Response (200):**
```json
{
  "artists": [
    {
      "id": "uuid",
      "stageName": "DJ Thunder",
      "category": "DJ",
      "baseCity": "Bangkok",
      "hourlyRate": 5000,
      "totalBookings": 24,
      "completedBookings": 22,
      "averageRating": 4.8,
      "profileCompleteness": 85,
      "isActive": true,
      "createdAt": "2024-12-01T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 48,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

---

## 5. Data Schema

### 5.1 Application Model (Existing - 23 fields)
```prisma
model Application {
  id                     String            @id @default(uuid())

  // Basic Information (Required)
  applicantName          String
  email                  String
  phone                  String
  lineId                 String
  stageName              String
  bio                    String            @db.Text
  category               ArtistCategory
  genres                 String[]
  profilePhotoUrl        String

  // Optional Information
  website                String?
  socialMediaLinks       String?           @db.Text
  yearsExperience        Int?
  equipmentOwned         String?           @db.Text
  portfolioLinks         String?           @db.Text
  baseLocation           String?
  hourlyRateExpectation  String?

  // Music Design Service
  interestedInMusicDesign Boolean          @default(false)
  designFee              String?
  monthlyFee             String?

  // Application Status
  status                 ApplicationStatus @default(PENDING)
  submittedAt            DateTime          @default(now())
  reviewedAt             DateTime?
  reviewNotes            String?           @db.Text

  createdAt              DateTime          @default(now())
  updatedAt              DateTime          @updatedAt

  @@index([email])
  @@index([phone])
  @@index([status])
  @@index([submittedAt])
  @@index([category])
}
```

### 5.2 Artist Model (Simplified - Fields Used for Approval)
```prisma
model Artist {
  id                String           @id @default(uuid())
  userId            String           @unique

  // Mapped from Application
  stageName         String           // ← applicantName or stageName
  realName          String?          // ← applicantName
  bio               String?          // ← bio
  bioTh             String?          // Optional translation
  category          ArtistCategory   // ← category

  // Location
  baseCity          String           // ← baseLocation
  serviceAreas      String[]         // Default: [baseLocation]

  // Pricing
  hourlyRate        Decimal?         // ← hourlyRateExpectation
  minimumHours      Int              @default(2)
  currency          String           @default("THB")

  // Music/Performance
  genres            String[]         // ← genres

  // Media
  profileImage      String?          // ← profilePhotoUrl

  // Social Links (parsed from socialMediaLinks)
  website           String?
  facebook          String?
  instagram         String?
  lineId            String?

  // Stats
  totalBookings     Int              @default(0)
  completedBookings Int              @default(0)
  averageRating     Float?

  // Settings
  isDraft           Boolean          @default(true)
  profileCompleteness Int            @default(0)

  createdAt         DateTime         @default(now())
  updatedAt         DateTime         @updatedAt
}
```

**Field Mapping Logic (Application → Artist):**
```typescript
{
  stageName: application.stageName || application.applicantName,
  realName: application.applicantName,
  bio: application.bio,
  category: application.category,
  genres: application.genres,
  baseCity: application.baseLocation || 'Bangkok',
  serviceAreas: [application.baseLocation || 'Bangkok'],
  hourlyRate: parseFloat(application.hourlyRateExpectation || '0'),
  profileImage: application.profilePhotoUrl,
  website: application.website,
  lineId: application.lineId,
  // Parse socialMediaLinks for facebook, instagram, etc.
  facebook: extractFromSocialLinks(application.socialMediaLinks, 'facebook'),
  instagram: extractFromSocialLinks(application.socialMediaLinks, 'instagram'),
  isDraft: false, // Immediately published
  profileCompleteness: calculateCompleteness(application)
}
```

---

## 6. Technology Stack Rationale

### 6.1 Next.js 15 App Router
**Justification:**
- **Server Components**: Reduce client-side JavaScript, improve performance for admin dashboard
- **Streaming**: Large application lists load progressively for better UX
- **SEO-friendly**: Admin pages are protected, but good architecture practice
- **API Routes**: Collocated with UI components for maintainability

**Trade-offs:**
- **Alternative: Separate React SPA + Express Backend**
  - Pros: Clear separation, independent scaling
  - Cons: More complex deployment, CORS configuration, doubled hosting costs
  - Verdict: Next.js App Router preferred for unified codebase and Vercel/Render deployment simplicity

### 6.2 Clerk Authentication
**Justification:**
- **Already Implemented**: Existing authentication system using Clerk
- **Role-Based Access**: Built-in support for user roles (ADMIN check)
- **Session Management**: Automatic session refresh, secure cookies
- **No Additional Setup**: Leverage existing infrastructure

**Trade-offs:**
- **Alternative: NextAuth.js**
  - Pros: Open source, more customizable
  - Cons: Requires migration from Clerk, more boilerplate code
  - Verdict: Stick with Clerk to avoid migration risk

### 6.3 Prisma ORM
**Justification:**
- **Type Safety**: Auto-generated TypeScript types prevent runtime errors
- **Query Optimization**: Built-in connection pooling, prepared statements
- **Migration Management**: Database schema versioning with `prisma migrate`
- **Already Integrated**: Existing models (Application, Artist, Booking)

**Trade-offs:**
- **Alternative: Raw SQL with pg**
  - Pros: Maximum performance control, no ORM overhead
  - Cons: Verbose code, manual type definitions, SQL injection risks
  - Verdict: Prisma preferred for developer productivity and safety

### 6.4 Server Actions vs. API Routes
**Justification:**
- **API Routes Chosen** for admin dashboard
- **Why Not Server Actions:**
  - Better separation of concerns (API can be reused by mobile apps)
  - Easier to test with tools like Postman/Insomnia
  - Clear REST conventions for CRUD operations
  - Better error handling and response formatting

**Trade-offs:**
- **Alternative: Server Actions**
  - Pros: Less boilerplate, automatic form handling, type-safe RPC
  - Cons: Harder to test, tightly coupled to UI, no REST discoverability
  - Verdict: API Routes for admin backend, Server Actions for simple forms

### 6.5 React Query (TanStack Query)
**Justification:**
- **Automatic Caching**: Reduce unnecessary API calls for application list
- **Optimistic Updates**: Approve/reject actions feel instant
- **Background Refetching**: Stats update automatically every 5 minutes
- **Error Handling**: Built-in retry logic and error states

**Trade-offs:**
- **Alternative: SWR**
  - Pros: Lighter bundle size, simpler API
  - Cons: Less features (no mutations, pagination helpers)
  - Verdict: React Query for complex admin dashboard needs

### 6.6 Tailwind CSS + Glass Morphism
**Justification:**
- **Consistency**: Match existing Bright Ears design system
- **Utility-First**: Rapid UI development without custom CSS files
- **Responsive**: Mobile-first approach for tablet admin access
- **Brand Colors**: Existing cyan/lavender/brown palette integration

**Trade-offs:**
- **Alternative: Chakra UI / Material-UI**
  - Pros: Pre-built components, accessibility out-of-box
  - Cons: Harder to customize, larger bundle size
  - Verdict: Tailwind for design flexibility and brand consistency

---

## 7. Key Considerations

### 7.1 Scalability
**Current Scale:** 65 applications, 48 artists, 156 bookings
**10x Growth:** 650 applications, 480 artists, 1,560 bookings

**Strategies:**
1. **Database Indexing:**
   - Applications: `status`, `submittedAt`, `email`, `phone`, `category`
   - Already implemented in schema

2. **Pagination:**
   - Hard limit of 100 items per page (prevent DoS)
   - Cursor-based pagination for large datasets (future enhancement)

3. **Caching:**
   - Dashboard stats cached for 5 minutes (Redis in future)
   - Application list cached per filter combination (1 minute)

4. **Query Optimization:**
   - Select only required fields (avoid `select *`)
   - Use aggregations instead of fetching all + counting
   - Batch operations for bulk approvals (future feature)

5. **Horizontal Scaling:**
   - Stateless API design (can run multiple instances)
   - Database connection pooling (Prisma default: 10 connections)
   - Render auto-scaling for traffic spikes

### 7.2 Security
**Primary Threat Vectors:**

1. **Unauthorized Access to Admin Dashboard**
   - **Mitigation:** Clerk authentication + role check on every route
   - **Code:** `requireRole('ADMIN')` middleware on all `/api/admin/*` endpoints
   - **Defense in Depth:** IP whitelist option for admin access (future)

2. **SQL Injection via Search/Filters**
   - **Mitigation:** Prisma parameterized queries (automatic)
   - **Validation:** Zod schemas on all API inputs
   - **Example:**
     ```typescript
     const searchSchema = z.object({
       search: z.string().max(100).optional(),
       status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional()
     })
     ```

3. **XSS via Application Data Display**
   - **Mitigation:** React automatic escaping
   - **Sanitization:** DOMPurify for rich text fields (bio, socialMediaLinks)
   - **CSP Headers:** Prevent inline scripts

4. **CSRF on Approve/Reject Actions**
   - **Mitigation:** Clerk session tokens (HTTP-only cookies)
   - **Same-Site Cookies:** Strict mode enabled

5. **Rate Limiting on API Endpoints**
   - **Current:** Application submission rate limit (3/24h per email/phone)
   - **Admin:** No rate limit needed (trusted users)
   - **Future:** Global rate limit (100 req/min per IP)

6. **Data Leakage via Error Messages**
   - **Mitigation:** Generic error messages in production
   - **Logging:** Detailed errors logged server-side only
   - **Example:**
     ```typescript
     catch (error) {
       console.error('Approval failed:', error) // Server log
       return { error: 'Failed to approve application' } // Client response
     }
     ```

### 7.3 Observability
**How we monitor system health and debug issues:**

1. **Logging Strategy:**
   - **Application Events:**
     - `INFO`: Application approved (with artist ID created)
     - `INFO`: Application rejected (with reason)
     - `ERROR`: Artist creation failed (with stack trace)
   - **Booking Events:**
     - `INFO`: Booking status changed (with old/new status)
   - **Admin Actions:**
     - `INFO`: Admin user logged in
     - `WARN`: Failed approval attempt (e.g., duplicate)

2. **Metrics to Track:**
   - **Application Metrics:**
     - Pending applications count (alert if > 20)
     - Average time to review (target: < 48 hours)
     - Approval rate (track quality of applicants)
   - **Performance Metrics:**
     - API response time (p95 < 500ms)
     - Database query time (p95 < 100ms)
     - Page load time (LCP < 2.5s)

3. **Error Tracking:**
   - **Tool:** Sentry (recommended for future)
   - **Captured:**
     - Unhandled exceptions in API routes
     - Failed Prisma queries with context
     - Frontend React errors with component stack

4. **Dashboard Health Checks:**
   - `/api/health` endpoint:
     ```json
     {
       "status": "healthy",
       "database": "connected",
       "timestamp": "2025-01-15T15:00:00Z"
     }
     ```
   - Monitored by Render (automatic alerts)

5. **Audit Trail:**
   - **Track:** Who approved/rejected which application
   - **Implementation:**
     ```typescript
     reviewedBy: string // Admin user ID
     reviewedAt: DateTime
     reviewNotes: string // Includes admin email
     ```
   - **Use Case:** Compliance, dispute resolution

### 7.4 Deployment & CI/CD

**Current Setup:**
- **Platform:** Render (Singapore region)
- **Database:** PostgreSQL on Render
- **Git:** GitHub repository (auto-deploy on push to main)

**Deployment Process:**

1. **Build Pipeline:**
   ```bash
   # Render build command
   prisma generate && next build
   ```
   - TypeScript compilation check
   - Prisma client generation
   - Next.js production build

2. **Database Migrations:**
   - **Development:** `prisma db push` (for rapid iteration)
   - **Production:** `prisma migrate deploy` (before deploy)
   - **Rollback:** Manual SQL restore from backup

3. **Environment Variables:**
   ```env
   # Required for Admin Dashboard
   DATABASE_URL=postgresql://...
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
   CLERK_SECRET_KEY=sk_...
   NEXT_PUBLIC_APP_URL=https://brightears.onrender.com
   ```

4. **Zero-Downtime Deployment:**
   - Render blue-green deployment (automatic)
   - Health check: `/api/health` must return 200
   - Rollback: Instant revert to previous deploy

5. **Testing Strategy:**
   - **Pre-Deploy:**
     - Unit tests: `npm test` (future implementation)
     - Type check: `npm run type-check`
     - Lint: `npm run lint`
   - **Post-Deploy:**
     - Manual smoke test of admin dashboard
     - Check stats API response
     - Test approve/reject flow with test application

6. **Monitoring Post-Deploy:**
   - Watch Render logs for errors (5 minutes)
   - Check `/api/admin/stats` response time
   - Verify dashboard loads in < 3 seconds

---

## 8. Implementation Phases

### Phase 1: Core Application Management (Priority 1)
**Timeline:** 1-2 days
**Deliverables:**
- ✅ GET `/api/admin/applications` (list with filters)
- ✅ GET `/api/admin/applications/[id]` (detail view)
- ✅ POST `/api/admin/applications/[id]/approve` (with Artist creation)
- ✅ POST `/api/admin/applications/[id]/reject`
- ✅ ApplicationTable component
- ✅ ApplicationDetailModal component
- ✅ ApprovalConfirmationModal component
- ✅ RejectionReasonModal component

### Phase 2: Dashboard & Stats (Priority 2)
**Timeline:** 1 day
**Deliverables:**
- ✅ GET `/api/admin/stats`
- ✅ AdminDashboardLayout (sidebar navigation)
- ✅ StatsCard component (4 metrics)
- ✅ Recent activity feed

### Phase 3: Booking & Artist Management (Priority 3)
**Timeline:** 1 day
**Deliverables:**
- ✅ GET `/api/admin/bookings` (simplified)
- ✅ GET `/api/admin/artists` (simplified)
- ✅ BookingTable component
- ✅ ArtistTable component

### Phase 4: Enhancements (Future)
**Timeline:** Ongoing
**Features:**
- Email notifications (approval/rejection)
- Bulk approval/rejection
- Advanced analytics (conversion funnel)
- Export to CSV
- Thai translations
- Mobile responsive design improvements

---

## 9. Success Metrics

**Technical Metrics:**
- API response time: p95 < 500ms
- Page load time: LCP < 2.5s
- Zero downtime during deploys
- Database query time: p95 < 100ms

**Business Metrics:**
- Time to review application: < 48 hours average
- Approval rate: 60-80% (quality applicants)
- Artist onboarding: 100% of approved applications → Artist profiles
- Admin productivity: 20+ applications reviewed per hour

**User Experience:**
- Admin dashboard load: < 3 seconds
- Search results: < 1 second
- Approve/reject action: < 2 seconds (with optimistic UI)

---

## 10. Glossary

**Application:** DJ/artist application submitted via `/apply` form (23 fields)
**Approval:** Admin action that creates an Artist profile from Application data
**Artist:** Live profile on platform after approval (can receive bookings)
**Rejection:** Admin action that declines Application with reason
**Pending:** Application status awaiting admin review
**Admin Dashboard:** Protected UI at `/dashboard/admin` for platform owner
**Role Check:** Authentication middleware requiring `user.role === 'ADMIN'`
**Profile Completeness:** Calculated percentage (0-100%) of filled Artist fields
**Music Design Service:** Optional service where artist curates custom playlists

---

**Document Version:** 1.0
**Last Updated:** January 15, 2025
**Author:** Backend Architect Agent
**Platform:** Bright Ears DJ Booking Platform
