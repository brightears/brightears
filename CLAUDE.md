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
- **2 Corporate Customers**: TGC Hotel Collection (NOBU/Le Du Kaan) + CRU & Cocoa XO (test)
- **21 DJs** across 4 venues (16 shared + 5 CRU-specific)
- PDF schedule export working with calendar grid layout
- Feedback system simplified: 1-5 stars + optional notes (no sub-ratings)
- Admin can view venue manager feedback notes

### Recent Updates (Feb 2, 2026)
- **Special Events Support**: Admin can now mark slots as "NO DJ", "Private Event", "Closed", "Holiday"
  - Overnight shifts work (21:00 → 01:00)
  - Venue portal handles null artists gracefully (shows calendar icon)
- **UI Polish**:
  - Removed Clerk avatar from header (no profile images for backend-created accounts)
  - Simplified Feedback page (removed redundant "Rate DJ →" links)
  - Special events show calendar icon instead of user silhouette
- **CRU & Cocoa XO Added**: Second corporate customer (multi-customer test passed)
  - Login: `norbert@brightears.com` / `BrightEars2026!`
  - Venues: CRU Champagne Bar (59F), Cocoa XO (57F) at Centara Grand
  - 5 new DJs: Tohmo, Krit, April, JJ, Camilo
- **CLAUDE.md Cleanup**: Renamed archived 63k file to `.bak` to fix size warning

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

| Customer | Email | Password |
|----------|-------|----------|
| TGC (NOBU/LDK) | dan.jamme@marriott.com | (in Clerk) |
| CRU & Cocoa XO | norbert@brightears.com | BrightEars2026! |

## Session History

Detailed development history is archived at `docs/sessions/CLAUDE_HISTORY_2024-2026.md`

---

*Last updated: February 2, 2026 (CRU & Cocoa XO live, CLAUDE.md cleanup, no self-registration rule)*
