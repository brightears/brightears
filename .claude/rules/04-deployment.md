# Deployment Guide

## Render Configuration

- **Service**: Web Service on Render
- **Region**: Singapore (closest to Thailand)
- **Build Command**: `prisma db push --skip-generate && prisma generate && node --max-old-space-size=1024 ./node_modules/.bin/next build`
- **Start Command**: `npm start`
- **Node Version**: 22.16.0

## Auto-Deploy
Push to `main` branch → GitHub → Render auto-deploys

## Environment Variables (Render)

| Variable | Status |
|----------|--------|
| DATABASE_URL | ✅ Configured |
| CLOUDINARY_CLOUD_NAME | ✅ dbfpfm6mw |
| CLOUDINARY_API_KEY | ✅ Configured |
| CLOUDINARY_API_SECRET | ✅ Configured |
| RESEND_API_KEY | ✅ Configured |
| CLERK_* | ✅ Configured |

## Common Issues

### Auth Redirect Loop
**Cause**: Prisma schema fields added but not migrated
**Fix**: Build script includes `prisma db push --skip-generate`

### Cold Starts (Slow First Load)
**Cause**: Render free tier spins down after inactivity
**Fix**: Upgrade to Starter plan ($7/month) or accept 3-5s first load

### Build Failures
1. Check Render logs for actual error
2. Look for Prisma column mismatches
3. Verify TypeScript compilation locally: `npm run build`

## Database Access
```bash
DATABASE_URL="..." npx prisma studio
```

## DNS (Namecheap)
- A record: `@` → `216.24.57.1`
- CNAME: `www` → `brightears.onrender.com`
