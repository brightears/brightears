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
- 15 DJs across 2 venues (NOBU, Le Du Kaan)
- PDF schedule export working with calendar grid layout
- Feedback system simplified: 1-5 stars + optional notes (no sub-ratings)
- Admin can view venue manager feedback notes

### Recent Updates (Feb 1, 2026)
- **Statistics page polish**: Unified brand-cyan color scheme, percentages in rating distribution
- **Removed Special Events**: From Statistics and Night Report form (no actionable value)
- **Recent Notes section**: Night report notes now visible in Statistics
- **Dashboard cleanup**: Removed redundant stats grid (info available in lists below)
- **"Needs feedback" badge**: Now clickable, links to feedback page

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

### 1. Timezone (Thailand UTC+7)
Use local date formatting to avoid day-shifting:
```typescript
// Good
`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`

// Bad - shifts dates
date.toISOString().split('T')[0]
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
- **LINE Integration**: Primary messaging for Thailand (not WhatsApp)
- **Thai Market**: PromptPay payments, Buddhist holidays awareness
- **Corporate Focus**: English-first for hotel/venue clients

## Session History

Detailed development history is archived at `docs/sessions/CLAUDE_HISTORY_2024-2026.md`

---

*Last updated: February 1, 2026*
