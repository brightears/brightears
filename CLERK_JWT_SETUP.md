# Clerk JWT Template Setup for Convex

## Steps to Configure JWT Template in Clerk Dashboard:

1. **Go to Clerk Dashboard**
   - Open: https://dashboard.clerk.com/apps/app_2rY4z8VSqRW3Ck1AWTABN6QVAY/jwt-templates

2. **Create New JWT Template**
   - Click "New template"
   - Name: `convex`
   - Click "Save"

3. **Configure the JWT Template**
   Copy and paste this exact configuration:

   ```json
   {
     "aud": "convex",
     "sub": "{{user.id}}"
   }
   ```

4. **Issuer URL**
   Your issuer URL is: `https://concrete-wasp-22.clerk.accounts.dev`
   
   This is already configured in your `convex/auth.config.ts` file.

5. **Save the Template**
   Click "Save" to apply the changes.

## Testing the Integration

Once you've configured the JWT template, the authentication flow will work as follows:

1. User signs in with Clerk
2. Clerk generates a JWT with the Convex audience
3. Convex validates the JWT and creates/updates the user
4. Your app can now use both Clerk (for auth) and Convex (for real-time data)

## Next Steps

After configuring the JWT template:
1. Test sign up/sign in functionality
2. Check that users are being created in Convex
3. Verify that authenticated requests work

The integration is now complete!