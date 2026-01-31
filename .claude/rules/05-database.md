# Database Patterns

## Stack
- PostgreSQL on Render (Singapore region)
- Prisma ORM
- Schema at `prisma/schema.prisma`

## Key Commands

```bash
# Push schema changes to database (no migration files)
npx prisma db push

# Generate Prisma client after schema changes
npx prisma generate

# Open database GUI
npx prisma studio

# Seed data
npx prisma db seed
```

## Important Models

| Model | Purpose |
|-------|---------|
| User | Clerk-synced users (Artist, Customer, Corporate, Admin) |
| Artist | DJ profiles with verification, pricing, availability |
| Venue | Corporate venues with operating hours, slots |
| VenueAssignment | DJ scheduled at venue on specific date/slot |
| VenueNightFeedback | Venue manager's night report |
| VenueFeedback | DJ rating from venue manager |
| Corporate | Corporate client profile linked to venues |

## Schema Change Workflow

1. Edit `prisma/schema.prisma`
2. Run `npx prisma db push` locally to test
3. Commit and push
4. Build script auto-runs `prisma db push` on Render

## Common Gotchas

### Timezone Issues
Thailand is UTC+7. Use local date formatting:
```typescript
// Good: Local timezone
const dateStr = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;

// Bad: Shifts dates
const dateStr = date.toISOString().split('T')[0];
```

### Missing Columns Error
If you see `The column 'X' does not exist`:
- Schema was updated but `prisma db push` wasn't run
- Build script should auto-fix on next deploy

### Assignment Lookup
Use composite key: `{date}-{venueId}-{slot}`
