# Venue Portal Development

## Purpose
Venue managers view DJ schedules and submit feedback. They do NOT assign DJs (admin only).

## Routes
- `/venue-portal` - Dashboard
- `/venue-portal/schedule` - Calendar view + PDF export
- `/venue-portal/feedback` - Night reports + DJ ratings

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

## API Endpoints
- `GET /api/venue-portal/venues` - User's venues
- `GET /api/venue-portal/schedule` - Assignments
- `GET /api/venue-portal/schedule/pdf` - PDF export
- `POST /api/venue-portal/night-feedback` - Submit night report
- `POST /api/venue-portal/feedback` - Submit DJ rating
