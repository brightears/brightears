# Convex Setup Guide for Bright Ears

## Step 1: Initialize Convex Project

Open your terminal in the project directory and run:

```bash
npx convex dev
```

When prompted:
1. Choose "create a new project"
2. Project name: "bright-ears" (or similar)
3. It will open a browser for authentication - log in with your Convex account

## Step 2: The command will generate:
- `convex.json` file with your deployment URL
- Update your `.env.local` with the Convex URL

## Step 3: Configure Clerk JWT Template in Convex Dashboard

After running `npx convex dev`, go to your Convex dashboard:

1. Navigate to Settings → Authentication
2. Add Clerk as a provider
3. Configure the JWT template with your Clerk domain

## Step 4: Configure Clerk Webhook (we'll do this after Convex is running)

The webhook URL will be: `https://YOUR_CONVEX_URL/users/upsertFromClerk`

## Next Actions:

Please run the following command in your terminal now:

```bash
cd "/Users/benorbe/Documents/Coding Projects/brightears/brightears"
npx convex dev
```

Once that's running, tell me what Convex URL it gives you, and we'll continue with the setup.