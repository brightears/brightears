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
- `crowdNationality` and `crowdType` are dropdowns, not sliders
- DJ Ratings: Just 1-5 stars + optional notes (no sub-ratings)
- Two tabs only: **Pending** (needs feedback) and **Submitted** (completed)
- Notes visible to admin in venue detail page

## Statistics Page
- Overview stats: Total/Completed/Upcoming shows, Unique DJs, Completion Rate
- Rating Overview: Average rating, distribution chart
- Top Performers: Top 5 DJs by rating
- **Crowd Insights** (from Night Reports):
  - Crowd Nationality distribution (Thai, Western, Asian, etc.)
  - Crowd Type distribution (Tourists, Locals, Hotel Guests, etc.)
  - Average Business Rating

## API Endpoints
- `GET /api/venue-portal/venues` - User's venues
- `GET /api/venue-portal/schedule` - Assignments
- `GET /api/venue-portal/schedule/pdf` - PDF export
- `GET /api/venue-portal/stats` - Aggregated statistics with night report data
- `POST /api/venue-portal/night-feedback` - Submit night report
- `POST /api/venue-portal/feedback` - Submit DJ rating
