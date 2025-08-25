# Environment Variables for Render Deployment

## Required Environment Variables to Add in Render Dashboard

Go to your Render dashboard: https://dashboard.render.com/
Find your Bright Ears web service and add these environment variables:

### Clerk Authentication (REQUIRED)
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_Y29uY3JldGUtd2FzcC0yMi5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_JyRI4sQNNuAISKZBAMADGT49SWrxulgQQAdTq9238v
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

### Convex Database (REQUIRED)
```
NEXT_PUBLIC_CONVEX_URL=https://tacit-fennec-18.convex.cloud
CONVEX_DEPLOYMENT=dev:tacit-fennec-18
```

### Existing Database (Already configured)
```
DATABASE_URL=postgresql://brightears_db_user:5suMKqzZIpREdOYOWGgkrCC9jHBdNP7m@dpg-d2cc14h5pdvs73dh7dvg-a.singapore-postgres.render.com/brightears_db
```

## Steps to Add:

1. Go to https://dashboard.render.com/
2. Click on your "brightears" web service
3. Go to "Environment" tab
4. Click "Add Environment Variable"
5. Add each variable above (name and value)
6. Click "Save Changes"
7. Render will automatically redeploy with the new variables

## Important Notes:

- The deployment will fail without these Clerk and Convex variables
- After adding them, Render will automatically redeploy
- The deployment usually takes 3-5 minutes
- Your live site should then have working authentication!

## Live URL:
Once deployed, your site will be available at your Render URL (likely https://brightears.onrender.com or similar)