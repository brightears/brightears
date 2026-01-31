# Admin Portal Development

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

## API Endpoints
- `GET /api/admin/schedule` - All assignments + all DJs
- `POST /api/admin/schedule` - Create assignment
- `PUT /api/admin/schedule` - Update assignment
- `DELETE /api/admin/schedule` - Delete assignment
