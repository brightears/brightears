# Bright Ears Deployment Guide for Render

## 🚨 Required Environment Variables

You need to set these environment variables in your Render dashboard for the app to work:

### 1. Go to your Render Dashboard
- Navigate to your service (brightears)
- Click on "Environment" in the left sidebar

### 2. Add these environment variables:

```bash
# Already set (verify it's there):
DATABASE_URL=postgresql://brightears_db_user:5suMKqzZIpREdOYOWGgkrCC9jHBdNP7m@dpg-d2cc14h5pdvs73dh7dvg-a.singapore-postgres.render.com/brightears_db

# MUST ADD THESE:
NEXTAUTH_SECRET=generate_a_secure_32_char_string_here
NEXTAUTH_URL=https://brightears.onrender.com
```

### 3. Generate NEXTAUTH_SECRET
Run this command locally to generate a secure secret:
```bash
openssl rand -base64 32
```

Or use any random string generator to create a 32+ character string.

### 4. Set the environment variables in Render:
- `NEXTAUTH_SECRET` = [your generated secret]
- `NEXTAUTH_URL` = https://brightears.onrender.com

## 📝 Environment Variables Explanation

- **DATABASE_URL**: Connection string to your PostgreSQL database (already set)
- **NEXTAUTH_SECRET**: Used to encrypt JWT tokens for authentication (REQUIRED)
- **NEXTAUTH_URL**: The public URL of your application (REQUIRED)

## 🔍 Troubleshooting

### "Application error" on page load
This usually means environment variables are missing. Check:
1. All required environment variables are set in Render
2. The NEXTAUTH_URL matches your actual Render URL
3. The DATABASE_URL is correct

### Database connection issues
1. Verify the DATABASE_URL is correct
2. Check that the database is running in Render
3. Try redeploying after setting environment variables

### Authentication not working
1. Ensure NEXTAUTH_SECRET is set (any 32+ character string)
2. Verify NEXTAUTH_URL is exactly your Render URL (https://brightears.onrender.com)
3. Clear browser cookies and try again

## 🚀 After Setting Environment Variables

1. Go to Render dashboard
2. Click "Manual Deploy" → "Deploy latest commit"
3. Wait for deployment to complete
4. Your app should now work!

## 📊 Verify Everything is Working

Once deployed with proper environment variables:
1. Visit https://brightears.onrender.com - should load without errors
2. Navigate to /artists - should show the seeded artists
3. Try logging in with: `dj.tempo@example.com` / `password123`
4. Access the dashboard at /dashboard/artist

## 🔐 Security Notes

- Never commit the `.env` file to git (it's already in .gitignore)
- Keep your NEXTAUTH_SECRET secure and unique
- Use different secrets for development and production
- Regularly rotate your secrets for security

---

Last Updated: August 12, 2024