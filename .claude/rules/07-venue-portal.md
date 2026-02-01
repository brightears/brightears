# Venue Portal Development

## ⚠️ LOCKED - DO NOT MODIFY ⚠️

**Status: PRODUCTION READY (February 1, 2026)**

The customer-facing venue portal is complete and working. DO NOT modify these files when working on Admin features:

```
app/[locale]/venue-portal/          # All pages - LOCKED
components/venue-portal/            # All components - LOCKED
app/api/venue-portal/               # All API routes - LOCKED
```

If Admin work requires shared components, CREATE NEW components in `components/admin/` instead of modifying venue-portal components.

---

## Purpose
Venue managers view DJ schedules and submit feedback. They do NOT assign DJs (admin only).

## Routes
- `/venue-portal` - Dashboard
- `/venue-portal/schedule` - Calendar view + PDF export
- `/venue-portal/feedback` - Night reports + DJ ratings
- `/venue-portal/stats` - Performance analytics & crowd insights

## Key Components

| Component | Location | Purpose |
|-----------|----------|---------|
| ScheduleCalendar | `components/venue-portal/` | Interactive calendar |
| NightReportModal | `components/venue-portal/` | Submit night feedback |
| DJRatingsModal | `components/venue-portal/` | Rate multiple DJs |

## Design Rules
- Dark theme with `brand-cyan` accents
- No amber/orange/emerald/lavender colors (use `brand-cyan` instead)
- Exception: Trend indicators can use emerald/red for +/- semantics
- Exception: Error states use red (CANCELLED, NO_SHOW badges)
- Success states: `brand-cyan` (not emerald)
- Header/footer hidden (ConditionalLayout.tsx)

## Color Patterns

| Element | Color | Classes |
|---------|-------|---------|
| Status: Scheduled | brand-cyan | `bg-brand-cyan/20 text-brand-cyan border-brand-cyan/30` |
| Status: Completed | brand-cyan | `bg-brand-cyan/20 text-brand-cyan border-brand-cyan/30` |
| Status: Cancelled | red | `bg-red-500/20 text-red-400 border-red-500/30` |
| Status: No Show | red | `bg-red-500/20 text-red-400 border-red-500/30` |
| Success state (modals) | brand-cyan | `bg-brand-cyan/20`, `text-brand-cyan` |
| Calendar dots | brand-cyan/red | `bg-brand-cyan` or `bg-red-500` |
| Section icons | brand-cyan | `text-brand-cyan` |
| Completed checkmarks | brand-cyan | `text-brand-cyan` |
| Stars (ratings) | brand-cyan | `text-brand-cyan` |
| Trend up | emerald | `text-emerald-400` (semantic) |
| Trend down | red | `text-red-400` (semantic) |

## PDF Export
- API: `/api/venue-portal/schedule/pdf?month=X&year=Y`
- Format: Calendar grid, one page per venue
- Color: `#00bbe4` (brand cyan)
- Font: Helvetica (built-in, not custom fonts)

## Feedback System
- Night Report and DJ Ratings are independent workflows
- Simplified forms (~30 seconds to complete)
- Night Report fields: Overall rating, peak time, crowd level, crowd nationality, crowd type, weather, notes
- No special events field (removed - no actionable value)
- DJ Ratings: Just 1-5 stars + optional notes (no sub-ratings)
- Two tabs only: **Pending** (needs feedback) and **Submitted** (completed)
- Notes visible in Statistics page (Recent Notes section)

## Dashboard
- Tonight's Lineup (venue cards with DJ slots)
- Upcoming Shows list (with "View all" link)
- Recent Shows list (with clickable "Needs feedback" badges)
- No stats grid (data is in the lists and Statistics page)

## Statistics Page
- Overview stats: Total/Completed/Upcoming shows, Unique DJs, Completion Rate
- **DJ Rating Overview**: Average rating, distribution chart (shows percentages)
- Top Performers: Top 5 DJs by rating (brand-cyan medals)
- **Crowd Insights** (unified brand-cyan color scheme with opacity variations):
  - Crowd Nationality distribution - `bg-brand-cyan` (100%)
  - Crowd Type distribution - `bg-brand-cyan/80` (80%)
  - Crowd Level distribution - `bg-brand-cyan/70` (70%)
  - Weather distribution - `bg-brand-cyan/60` (60%)
  - Peak Hours distribution - `bg-brand-cyan/50` (50%)
  - Recent Notes (from night reports, with venue name and date)
  - Average Business Rating with star display

## API Endpoints
- `GET /api/venue-portal/venues` - User's venues
- `GET /api/venue-portal/schedule` - Assignments
- `GET /api/venue-portal/schedule/pdf` - PDF export
- `GET /api/venue-portal/stats` - Aggregated statistics with night report data
- `POST /api/venue-portal/night-feedback` - Submit night report
- `POST /api/venue-portal/feedback` - Submit DJ rating
