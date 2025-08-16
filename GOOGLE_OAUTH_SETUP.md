# Google OAuth Setup Guide

## Prerequisites
You need these environment variables set in Render:
- `NEXTAUTH_URL` - Your app URL (https://brightears.onrender.com)
- `NEXTAUTH_SECRET` - A random secret key
- `GOOGLE_CLIENT_ID` - From Google Cloud Console
- `GOOGLE_CLIENT_SECRET` - From Google Cloud Console

## Step 1: Generate NEXTAUTH_SECRET

Run this command locally to generate a secure secret:
```bash
openssl rand -base64 32
```

## Step 2: Set up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Go to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Choose "Web application"
6. Add these settings:
   - **Authorized JavaScript origins:**
     - `https://brightears.onrender.com`
     - `http://localhost:3000` (for local development)
   
   - **Authorized redirect URIs:**
     - `https://brightears.onrender.com/api/auth/callback/google`
     - `http://localhost:3000/api/auth/callback/google` (for local development)

7. Click "Create" and copy your Client ID and Client Secret

## Step 3: Add Environment Variables to Render

1. Go to your Render dashboard
2. Select your Bright Ears service
3. Go to "Environment" tab
4. Add these environment variables:

```
NEXTAUTH_URL=https://brightears.onrender.com
NEXTAUTH_SECRET=[your-generated-secret]
GOOGLE_CLIENT_ID=[your-google-client-id]
GOOGLE_CLIENT_SECRET=[your-google-client-secret]
NEXT_PUBLIC_APP_URL=https://brightears.onrender.com
```

5. Click "Save Changes"
6. Render will automatically redeploy

## Step 4: Test the Setup

1. Visit https://brightears.onrender.com/login
2. Click "Continue with Google"
3. You should be redirected to Google's OAuth consent screen
4. After authorization, you should be logged in

## Troubleshooting

### "Server Components render" error
- Check that all environment variables are set correctly
- Ensure NEXTAUTH_URL matches your actual deployment URL
- Verify Google OAuth credentials are correct

### Redirect URI mismatch
- Make sure the redirect URI in Google Console exactly matches:
  `https://brightears.onrender.com/api/auth/callback/google`

### Session not persisting
- Verify NEXTAUTH_SECRET is set and consistent across deployments

## Local Development

Create a `.env.local` file:
```
DATABASE_URL=your-database-url
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Note: Use the same Google OAuth app for both local and production, just add both redirect URIs.