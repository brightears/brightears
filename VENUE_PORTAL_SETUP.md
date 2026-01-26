# Venue Portal Setup Guide

This guide walks you through setting up the Venue Portal for NOBU & Le Du Kaan.

---

## Quick Start

1. **Create Clerk Users** (Step 1)
2. **Update Seed Script** with Clerk IDs (Step 2)
3. **Run Seed Script** (Step 3)
4. **Test Login** (Step 4)

---

## Step 1: Create Clerk Users

Go to [Clerk Dashboard](https://dashboard.clerk.com) and create two users:

### 1.1 Admin Account (Your Access)

**Purpose:** Access to all accounts and admin features

| Field | Value |
|-------|-------|
| Email | `admin@brightears.io` (or your email) |
| Password | Choose a strong password |
| First Name | Your name |
| Last Name | Your name |

**Set Role via Clerk Metadata:**
1. Click on the created user
2. Go to "Metadata" tab
3. Under "Public metadata", add:
```json
{
  "role": "ADMIN"
}
```

### 1.2 Corporate Account (NOBU/Le Du Kaan)

**Purpose:** Venue manager login for NOBU & Le Du Kaan

| Field | Value |
|-------|-------|
| Email | `venues@tgchotels.com` (or the actual venue manager email) |
| Password | Create and save securely |
| First Name | Dan |
| Last Name | Jamme |

**Set Role via Clerk Metadata:**
1. Click on the created user
2. Go to "Metadata" tab
3. Under "Public metadata", add:
```json
{
  "role": "CORPORATE"
}
```

### 1.3 Copy User IDs

After creating both users, copy their Clerk User IDs:
- Format: `user_xxxxxxxxxxxxxxxxxxxxx`
- Found at the top of each user's detail page

---

## Step 2: Update Seed Script

Open `prisma/seed-nobu.ts` and update the `CLERK_USER_IDS`:

```typescript
const CLERK_USER_IDS = {
  admin: 'user_YOUR_ACTUAL_ADMIN_CLERK_ID',
  corporate: 'user_YOUR_ACTUAL_CORPORATE_CLERK_ID',
};
```

Also update the corporate email if needed:
```typescript
email: 'venues@tgchotels.com', // Update with real email
```

---

## Step 3: Run Seed Script

Run the seed script to populate the database:

```bash
# From the brightears directory
cd /Users/benorbe/Library/Mobile\ Documents/com~apple~CloudDocs/Documents/Coding\ Projects/brightears/brightears

# Run the seed script
npx tsx prisma/seed-nobu.ts
```

**Expected Output:**
```
🌱 Starting NOBU & Le Du Kaan seed...

📝 Creating/updating corporate user...
   ✓ Corporate user: venues@tgchotels.com
🏢 Creating/updating corporate record...
   ✓ Corporate: TGC Hotel Collection Co., Ltd.
🏪 Creating/updating venues...
   ✓ Venue: NOBU
   ✓ Venue: Le Du Kaan
🎧 Creating/updating DJ artists...
   ✓ DJ: Benji
   ✓ DJ: Izaar
   ... (16 DJs total)
📅 Creating February 2026 schedule assignments...
   ✓ Created 84 assignments

✅ Seed completed successfully!
```

---

## Step 4: Test Login

### Test Corporate Login (NOBU/Le Du Kaan)

1. Go to https://brightears.io/en/venue-portal (or localhost)
2. You'll be redirected to sign in
3. Use the corporate credentials:
   - Email: `venues@tgchotels.com`
   - Password: (the password you set)
4. After login, you should see the Venue Portal dashboard

### Test Admin Login

1. Go to https://brightears.io/en/venue-portal
2. Sign in with admin credentials
3. You should have access to all features

---

## Credentials to Send to NOBU/Le Du Kaan

After setup, send these credentials securely to Dan Jamme:

```
📧 Bright Ears Venue Portal Access

Website: https://brightears.io/venue-portal

Email: venues@tgchotels.com
Password: [secure password]

Features:
- View DJ schedules and assignments
- Browse DJ profiles and photos
- Submit feedback after performances
- Track performance statistics

For support: support@brightears.io
```

---

## Troubleshooting

### "Not authorized" error

**Cause:** User doesn't have CORPORATE role in Clerk metadata

**Fix:**
1. Go to Clerk Dashboard → Users
2. Click on the user
3. Add `{"role": "CORPORATE"}` to Public metadata

### "User not found" error

**Cause:** Clerk user exists but not synced to database

**Fix:**
1. Check that the Clerk User ID in the seed script matches the actual ID
2. Re-run the seed script: `npx tsx prisma/seed-nobu.ts`

### Database connection error

**Cause:** DATABASE_URL not set or incorrect

**Fix:**
1. Check `.env` file has correct DATABASE_URL
2. For production, ensure Render environment variable is set

---

## Data Overview

### Venues Created

| Venue | Hours | DJs/Night | Manager |
|-------|-------|-----------|---------|
| NOBU | 20:00-24:00 | 1 | Leila |
| Le Du Kaan | 18:00-24:00 | 2 (Early + Late) | Terry |

### DJ Roster (16 DJs)

**NOBU DJs:**
- Benji, Izaar, Manymaur, UFO, DJ Mint, Linze, Vita

**Le Du Kaan Early:**
- Tom FKG, Justin Mills, RabbitDisco, DJ Enjoy, Mizuyo, DJ Furry

**Le Du Kaan Late:**
- DJ Pound, Scotty B, Yui Truluv, Manymaur, UFO

### February 2026 Schedule

| Day | NOBU | LDK Early | LDK Late |
|-----|------|-----------|----------|
| Mon | Benji | RabbitDisco | DJ Pound |
| Tue | Benji | Tom FKG | Yui Truluv |
| Wed | Izaar | DJ Enjoy | Manymaur |
| Thu | Linze | DJ Furry | Yui Truluv |
| Fri | DJ Mint | DJ Pound | UFO |
| Sat | Vita | Justin Mills | Scotty B |
| Sun | UFO | Tom FKG | Yui Truluv |

**Special Dates:**
- Feb 11, 15, 25 (Wed/Sun): Mizuyo at LDK Early
- Feb 14, 21 (Sat): DJ Pound at LDK Late (Scotty B away)

---

## Webhook Setup (Optional)

For automatic user sync between Clerk and the database, set up webhooks:

1. Go to Clerk Dashboard → Webhooks
2. Create new endpoint: `https://brightears.io/api/webhooks/clerk`
3. Select events: `user.created`, `user.updated`
4. Copy signing secret to Render environment variables as `CLERK_WEBHOOK_SECRET`

---

## Future Updates

### Adding New DJs

1. Add DJ profile to `DJ_PROFILES` array in seed script
2. Run: `npx tsx prisma/seed-nobu.ts`

### Updating Schedule

1. Modify `WEEKLY_SCHEDULE` or `SCHEDULE_EXCEPTIONS` in seed script
2. Run: `npx tsx prisma/seed-nobu.ts`

### March 2026 Schedule

Update the seed script date range or create a new seed script for the new month.

---

## Support

For technical issues: norbert@bmasiamusic.com
