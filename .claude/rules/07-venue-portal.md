# Venue Portal Development

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
- No amber/orange colors (use `brand-cyan` instead)
- Header/footer hidden (ConditionalLayout.tsx)

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
