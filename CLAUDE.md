# Bright Ears - Claude Code Instructions

## Quick Reference

| Item | Value |
|------|-------|
| **Live URL** | https://brightears.io |
| **GitHub** | https://github.com/brightears/brightears |
| **Platform** | Render (auto-deploys from main) |
| **Stack** | Next.js 15, TypeScript, Prisma, PostgreSQL |
| **Locales** | EN, TH (next-intl) |

## Current Status (February 2026)

- Landing page + Venue Portal + Admin Portal operational
- **3 Corporate Customers**: TGC Hotel Collection (NOBU/Le Du Kaan), CRU, Cocoa XO, Horizon
- **23 DJs** across 5 venues (16 shared + 5 CRU-specific + 2 Horizon-specific)
- PDF schedule export working with calendar grid layout
- Feedback system simplified: 1-5 stars + optional notes (no sub-ratings)
- Admin can view venue manager feedback notes

### Recent Updates (Feb 13, 2026)
- **Horizon Account Created**: New venue with 4 DJs, full Feb 2026 schedule
  - Login: `horizon@brightears.io` / `Horizon2026!`
  - 2 new DJs: Ize (R&B/Hip-Hop), Nun (Disco House/Thai)
  - 2 shared DJs: Eskay Da Real, DJ Pound
  - Schedule: 28 nights, 18:30-22:30
  - Seed script: `scripts/seed-horizon.ts`
- **Feedback Submission Fixed**: Venue managers can now rate DJs (commit 8e6b7d2)
  - Root cause: API required status=COMPLETED but all assignments stayed SCHEDULED
  - Fix: Replaced status check with hasShiftEnded() (same logic as GET endpoint)
  - Also marks assignment COMPLETED when feedback is submitted

### Previous Updates (Feb 2, 2026)
- **Admin Can Edit Past Dates**: Empty slots on past dates now clickable (commit 77bd173)
  - Use case: Mark no-show DJs, correct historical records
  - Past slots show gray "Assign DJ" button (API already supported this)
- **CRU/Cocoa XO Separated**: Split into individual accounts for better access control
  - CRU: `cru@brightears.io` → sees only CRU Champagne Bar
  - Cocoa XO: `cocoaxo@brightears.io` → sees only Cocoa XO
  - Seed script: `scripts/seed-separate-cru-cocoaxo.ts`
- **DJ Directory Bug Fixed**: Null artistIds (from special events) were breaking the query
  - Fix: Filter nulls before querying artists (commit e464af3)
- **Feedback Timing Fixed**: Overnight shifts (ending after midnight) now handled correctly
  - Fix: If endTime < 6 AM, treat as next day (commit d84581b)
- **Special Events Support**: Admin can mark slots as "NO DJ", "Private Event", "Closed", "Holiday"
  - Overnight shifts work (21:00 → 01:00)
  - Venue portal handles null artists gracefully (shows calendar icon)
- **UI Polish**:
  - Removed Clerk avatar from header (no profile images for backend-created accounts)
  - Feedback page: removed redundant "Rate DJ →" links, buttons now equal weight
  - Feedback buttons: "Night Report" + "Rate DJs" (no DJ count, both filled cyan)
  - Special events show calendar icon instead of user silhouette

### Previous Updates (Feb 1, 2026)
- **DJ Eskay Added**: French DJ (15+ years), replaces Scotty B on Feb 7 & 28 LDK Late
- **Feedback Timing Fix**: DJs now available for feedback immediately after shift ends (not midnight)
  - Uses Bangkok timezone (UTC+7) calculation
  - `hasShiftEnded()` helper converts endTime to UTC for comparison
  - Example: Bangkok 21:00 = UTC 14:00
- **Admin↔Customer Sync**: Changes made in admin portal automatically reflect on customer (venue portal) side via shared database. Customer needs to refresh page to see updates (no real-time WebSocket).
- **Bulk Delete API**: Admin can delete all assignments for a month: `DELETE /api/admin/schedule?month=1&year=2026&includeFeedback=true`
- **Test Data Cleanup**: Removed January 2026 test data (10 assignments + 3 night feedback records)

## Essential Commands

```bash
# Development
npm run dev

# Build (same as production)
npm run build

# Database
npx prisma studio      # Open GUI
npx prisma db push     # Push schema changes
npx prisma generate    # Regenerate client
```

## Rule Files

Detailed instructions are in `.claude/rules/`:

| File | Contents |
|------|----------|
| `01-project-overview.md` | Project summary, tech stack, business rules |
| `02-subagents.md` | When to use which of our 26 subagents |
| `03-design-system.md` | Brand colors, typography, patterns |
| `04-deployment.md` | Render config, env vars, troubleshooting |
| `05-database.md` | Prisma patterns, timezone handling |
| `06-internationalization.md` | next-intl usage, translation patterns |
| `07-venue-portal.md` | Venue manager features, PDF export |
| `08-admin-portal.md` | Admin DJ assignment features |

## Critical Gotchas

### 0. Venue Portal is LOCKED
**DO NOT MODIFY** customer-facing venue portal code when working on Admin:
- `app/[locale]/venue-portal/*` - LOCKED
- `components/venue-portal/*` - LOCKED
- `app/api/venue-portal/*` - LOCKED

If Admin needs shared functionality, create NEW components in `components/admin/`.

### 1. Timezone (Thailand UTC+7)
Use local date formatting to avoid day-shifting:
```typescript
// Good
`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`

// Bad - shifts dates
date.toISOString().split('T')[0]
```

**Feedback timing**: endTime is stored as Bangkok time (e.g., "21:00"), server runs in UTC.
```typescript
// Convert Bangkok to UTC: Bangkok 21:00 = UTC 14:00
const BANGKOK_OFFSET_HOURS = 7;
endDateTime.setUTCHours(hours - BANGKOK_OFFSET_HOURS, mins, 0, 0);
```

### 2. Auth Redirect Loop
If users get stuck at "Redirecting...":
- Cause: Prisma schema fields not migrated to production DB
- Fix: Build script includes `prisma db push --skip-generate`

### 3. PDF Fonts
@react-pdf/renderer only supports .ttf/.otf (NOT .woff2)
- Use Helvetica (built-in) for reliability
- Brand color: `#00bbe4` (cyan), not teal

### 4. Portal Layouts
Venue Portal and Admin hide header/footer via `ConditionalLayout.tsx`
- Checks pathname for `/venue-portal` or `/admin`

## Subagents

We have 26 specialized agents in `.claude/agents/`. Key ones:
- **database-architect** - Schema design, queries
- **form-ux-enhancer** - Form validation, UX
- **web-design-manager** - Brand consistency
- **i18n-debugger** - Translation issues
- **performance-optimizer** - Page load, caching

Use them proactively when task matches their domain. See `.claude/rules/02-subagents.md` for full list.

## Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| brand-cyan | #00bbe4 | Primary, CTAs, links |
| deep-teal | #2f6364 | Dark backgrounds |
| earthy-brown | #a47764 | Secondary accents |
| soft-lavender | #d59ec9 | Highlights (sparingly) |

## Code Style

- Headlines (H1-H3): `font-playfair`
- Body text: `font-inter`
- Thai: `font-noto-thai`
- Glass morphism: `bg-white/70 backdrop-blur-md border border-white/20`
- Dark glass: `bg-white/5 backdrop-blur-sm border border-white/10`

## Key Business Rules

- **No Commission**: Revenue from premium features, not booking fees
- **No Self-Registration**: Customer logins created via Clerk dashboard (backend)
- **LINE Integration**: Primary messaging for Thailand (not WhatsApp)
- **Thai Market**: PromptPay payments, Buddhist holidays awareness
- **Corporate Focus**: English-first for hotel/venue clients

## Customer Logins (Venue Portal)

| Customer | Email | Password | Venues |
|----------|-------|----------|--------|
| NOBU | nobu@brightears.io | Nobu2026! | NOBU Bangkok |
| Le Du Kaan | ldk@brightears.io | LDK2026! | Le Du Kaan |
| CRU | cru@brightears.io | CRU2026! | CRU Champagne Bar |
| Cocoa XO | cocoaxo@brightears.io | CocoaXO2026! | Cocoa XO |
| Horizon | horizon@brightears.io | Horizon2026! | Horizon |

---

## Adding New Venue Accounts

### Process Overview

1. **Create database records** (User, Corporate, Venue)
2. **Run seed script** against production database
3. **Create Clerk user** with matching email
4. **Test login** at /venue-portal

### Step-by-Step

#### 1. Create Seed Script

Copy existing template: `scripts/seed-horizon.ts` (simplest single-venue example)

Key structure:
```typescript
const CONFIG = {
  userId: 'venue-name-corporate-user',  // Unique ID
  email: 'venue@brightears.io',          // Must match Clerk email exactly
  companyName: 'Venue Name',
  venueId: 'venue-name-venue',           // Used for VenueAssignments
};
```

#### 2. Run Against Production

```bash
DATABASE_URL="postgresql://..." npx tsx scripts/seed-your-venue.ts
```

Get DATABASE_URL from Render dashboard → Environment.

#### 3. Create Clerk User

1. Go to [Clerk Dashboard](https://dashboard.clerk.com) → Users → Create user
2. **Email must match exactly** (e.g., `venue@brightears.io`)
3. Set password
4. The user lookup works by email, so case matters

#### 4. Verify

Log in at https://brightears.io/venue-portal with the new credentials.

### Common Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| **"Corporate profile not found"** | Seed script not run | Run script with production DATABASE_URL |
| **DJ Directory empty** | Null artistIds in assignments | Filter nulls: `.filter((id): id is string => id !== null)` |
| **DJ images missing** | No profileImage in database | Copy to `public/images/djs/`, update DB with path |
| **Feedback won't submit** | Assignment status stuck at SCHEDULED | Fixed: now uses hasShiftEnded() instead of status check |
| **Wrong venues showing** | corporateId mismatch | Check venue.corporateId matches corporate.id |
| **Login redirect loop** | Email mismatch | Clerk email must exactly match database User.email |

### Separating Combined Accounts

When a corporate has multiple venues but needs separate logins:

1. Create seed script like `seed-separate-cru-cocoaxo.ts`
2. Creates new User + Corporate for each venue
3. Updates venue.corporateId to point to new corporate
4. Old corporate loses those venues (can be deleted if empty)

Example: CRU & Cocoa XO were combined, now separated into individual logins.

## Session History

Detailed development history is archived at `docs/sessions/CLAUDE_HISTORY_2024-2026.md`

---

*Last updated: February 13, 2026 (Horizon account, feedback fix, DJ images)*
