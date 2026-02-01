# Admin Portal Development

## ⚠️ DO NOT TOUCH VENUE PORTAL ⚠️

When working on Admin features, **NEVER modify**:
- `app/[locale]/venue-portal/*`
- `components/venue-portal/*`
- `app/api/venue-portal/*`

The customer-facing venue portal is LOCKED and production-ready. Create new components in `components/admin/` if needed.

---

## Purpose
Internal admin assigns DJs to venues. Only admin can modify schedule.

## Routes
- `/admin` - Dashboard
- `/admin/schedule` - DJ assignment grid
- `/admin/applications` - DJ applications management

## Key Components

| Component | Location | Purpose |
|-----------|----------|---------|
| AssignmentModal | `components/admin/` | Assign/edit DJ for date |
| ScheduleGrid | `components/admin/` | Weekly schedule view |

## Assignment Modal
- Opens on click of any schedule cell
- DJ dropdown shows ALL DJs (not just previously assigned)
- Uses React Portal for proper centering
- Null-safe genres handling: `(dj.genres || []).slice()`

## Date Handling
Thailand UTC+7 causes date shifting. Use local formatting:
```typescript
// Good
const dateStr = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;

// Bad - shifts by 1 day
const dateStr = date.toISOString().split('T')[0];
```

## Layout
- Header/footer hidden (same as venue portal)
- Extended `ConditionalLayout.tsx` to detect `/admin` routes

## Admin↔Customer Sync

**All admin changes automatically reflect on customer (venue portal) side.**

Both portals share the same database tables:
- `VenueAssignment` - Schedule entries
- `VenueNightFeedback` - Night reports
- `VenueFeedback` - DJ ratings

**Note:** No real-time WebSocket - customer must refresh page to see updates.

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/schedule` | GET | All assignments + all DJs for month |
| `/api/admin/schedule` | POST | Create assignment |
| `/api/admin/schedule` | PUT | Update assignment |
| `/api/admin/schedule?id=xxx` | DELETE | Delete single assignment |
| `/api/admin/schedule?month=1&year=2026` | DELETE | Bulk delete month |
| `/api/admin/schedule?month=1&year=2026&includeFeedback=true` | DELETE | Bulk delete month + feedback |

### Bulk Delete (for cleanup)
```bash
# Delete all January 2026 assignments
DELETE /api/admin/schedule?month=1&year=2026

# Delete assignments AND night feedback
DELETE /api/admin/schedule?month=1&year=2026&includeFeedback=true
```
