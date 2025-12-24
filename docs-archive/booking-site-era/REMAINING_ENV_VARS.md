# Remaining Environment Variables to Add on Render

Click "Add" and add these additional Clerk URL variables:

## Additional Clerk URLs:

```
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

## Optional but Recommended:

```
CONVEX_DEPLOYMENT=dev:tacit-fennec-18
```

These URLs tell Clerk:
- Where your sign-in page is located
- Where your sign-up page is located  
- Where to redirect users after they sign in (dashboard)
- Where to redirect users after they sign up (onboarding)

After adding these, click "Save, rebuild, and deploy" and your authentication system will be fully configured on production!