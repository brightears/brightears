# Google OAuth Setup Guide for Bright Ears

## Quick Setup (5 minutes)

### Step 1: Go to Google Cloud Console
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Create a new project or select an existing one

### Step 2: Enable Google+ API
1. In the left sidebar, click "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it and press "Enable"

### Step 3: Create OAuth 2.0 Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure the OAuth consent screen first:
   - Choose "External" user type
   - Fill in app name: "Bright Ears"
   - User support email: your email
   - Add your domain: brightears.onrender.com
   - Add authorized domain: brightears.onrender.com
   - Save and continue through the scopes (just use default)

### Step 4: Create OAuth Client ID
1. Application type: **Web application**
2. Name: "Bright Ears Web Client"
3. Authorized JavaScript origins:
   ```
   http://localhost:3000
   https://brightears.onrender.com
   ```
4. Authorized redirect URIs:
   ```
   http://localhost:3000/api/auth/callback/google
   https://brightears.onrender.com/api/auth/callback/google
   ```
5. Click "Create"

### Step 5: Copy Your Credentials
You'll receive:
- **Client ID**: Something like `123456789-abcdefg.apps.googleusercontent.com`
- **Client Secret**: A long string of characters

### Step 6: Add to Local Development (.env)
Add to your `.env` file:
```bash
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
```

### Step 7: Add to Render Production
1. Go to your Render dashboard
2. Navigate to your service → Environment
3. Add:
   - `GOOGLE_CLIENT_ID` = your_client_id
   - `GOOGLE_CLIENT_SECRET` = your_client_secret
4. Click "Save Changes" - will auto-deploy

## Testing

### Local Testing:
1. Run `npm run dev`
2. Visit http://localhost:3000
3. Click "Sign in" → "Continue with Google"
4. Should redirect to Google, then back to your app

### Production Testing:
1. Wait for Render deployment to complete
2. Visit https://brightears.onrender.com
3. Click "Sign in" → "Continue with Google"
4. Should work the same as local

## Troubleshooting

### "Error: Redirect URI mismatch"
- Double-check the redirect URIs in Google Console
- Must match EXACTLY (including http vs https)
- Common mistake: forgetting the `/api/auth/callback/google` part

### "Error: Invalid client"
- Check that GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set
- No extra spaces or quotes in the environment variables
- Restart your local dev server after adding .env variables

### "Error: Access blocked"
- Make sure Google+ API is enabled
- OAuth consent screen must be configured
- For production, may need to verify domain ownership

## What Users Will See

1. **On Sign Up/Login page**: "Continue with Google" button
2. **When clicked**: Redirects to Google's login page
3. **After Google login**: 
   - New users: Account created automatically as CUSTOMER
   - Existing users: Logged in immediately
4. **Profile created with**:
   - Name from Google account
   - Email from Google account
   - Profile photo from Google account

## Security Notes

- Never commit `.env` file to git
- Keep CLIENT_SECRET truly secret
- Google OAuth is secure and trusted by users
- No passwords stored for Google OAuth users

## Next Steps

After Google OAuth is working:
1. Consider adding LINE Login (critical for Thai market)
2. Add Facebook Login (optional)
3. Keep email/password as backup option

---

## Quick Copy-Paste for Render

```
GOOGLE_CLIENT_ID=paste_your_client_id_here
GOOGLE_CLIENT_SECRET=paste_your_client_secret_here
```

Just replace with your actual values and add to Render environment variables!