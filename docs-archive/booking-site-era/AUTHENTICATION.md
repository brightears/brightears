# NextAuth.js Authentication Implementation

This document explains the complete NextAuth.js authentication system implemented for the Bright Ears platform.

## Overview

The authentication system supports:
- **Multiple user roles**: ARTIST, CUSTOMER, CORPORATE, ADMIN
- **Email/password authentication** with bcryptjs for password hashing
- **JWT-based sessions** for better performance
- **Role-based access control** throughout the application
- **Multi-language support** (English/Thai)
- **Design system compliance** with Bright Ears brand colors

## Files Created/Modified

### Core Authentication Files

1. **`/app/api/auth/[...nextauth]/route.ts`**
   - NextAuth.js configuration and route handler
   - Credentials provider setup with email/password authentication
   - JWT session strategy with role-based tokens
   - Database integration with Prisma for user validation

2. **`/lib/auth.ts`**
   - Server-side authentication helper functions
   - Session management utilities
   - Role checking functions
   - User profile retrieval methods

3. **`/types/next-auth.d.ts`**
   - TypeScript type extensions for NextAuth
   - Custom user and session interfaces
   - JWT token type definitions

4. **`/components/auth/SessionProvider.tsx`**
   - Client-side session provider wrapper
   - Enables useSession hook throughout the app

### UI Components

5. **`/components/auth/AuthButton.tsx`**
   - Login/logout button component
   - Shows different states based on authentication status

6. **`/components/auth/UserMenu.tsx`**
   - Dropdown menu for authenticated users
   - Role-based navigation links
   - User profile information display

7. **`/app/[locale]/login/page.tsx`**
   - Login page with form validation
   - Error handling and loading states
   - Design system styling

8. **`/app/[locale]/register/page.tsx`**
   - Registration page for customers and corporate users
   - Dynamic form fields based on user type
   - Integration with existing artist registration

9. **`/app/[locale]/dashboard/page.tsx`**
   - Protected dashboard page
   - Role-specific content and statistics
   - Quick action links based on user type

### API Routes

10. **`/app/api/auth/register/route.ts`**
    - Customer and corporate user registration endpoint
    - Password hashing and database transactions
    - Validation with Zod schemas

### Middleware and Utilities

11. **`/lib/auth-middleware.ts`**
    - API route protection middleware
    - Role-based access control functions
    - User context extraction from tokens

12. **`/middleware.ts`** (updated)
    - Combined internationalization and authentication middleware
    - Protected route configuration
    - Automatic redirects for unauthenticated users

## Environment Variables

Add these variables to your `.env` file:

```env
# NextAuth Configuration
NEXTAUTH_SECRET="your-32-character-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

**Production Notes:**
- Generate a secure random secret: `openssl rand -base64 32`
- Update NEXTAUTH_URL to your production domain
- Ensure DATABASE_URL is configured for Prisma

## User Roles and Permissions

### ARTIST
- Access to artist dashboard and profile management
- Booking management and availability settings
- Performance analytics and earnings tracking

### CUSTOMER
- Personal dashboard with booking history
- Favorite artists and event management
- Profile and preferences settings

### CORPORATE
- Company dashboard with multi-venue management
- Contract and billing management
- Corporate booking analytics

### ADMIN
- Full system administration
- User and artist management
- Platform analytics and reporting

## Authentication Flow

### Registration Flow
1. User visits `/register` or `/register/artist`
2. Selects user type (CUSTOMER, CORPORATE, or ARTIST)
3. Fills out role-specific form fields
4. System validates data and creates user + profile records
5. User redirected to login page with success message

### Login Flow
1. User visits `/login`
2. Enters email and password
3. NextAuth validates credentials against database
4. System updates lastLogin timestamp
5. JWT token created with user data and role
6. User redirected to appropriate dashboard

### Session Management
- Sessions are JWT-based for better performance
- Tokens include user ID, role, and profile data
- Automatic session refresh and token rotation
- Server-side session validation for protected routes

## Protected Routes

Routes requiring authentication:
- `/dashboard/*` - All dashboard pages
- `/profile/*` - User profile pages
- `/bookings/*` - Booking management
- `/settings/*` - User settings

## API Protection

Use the auth middleware for API routes:

```typescript
import { withAuth, withRoleAuth } from '@/lib/auth-middleware'

// Require any authenticated user
export const GET = withAuth()(async (req) => {
  // Your API logic here
})

// Require specific roles
export const POST = withRoleAuth(['ARTIST', 'ADMIN'])(async (req) => {
  // Your API logic here
})
```

## Helper Functions

### Server-side (Server Components)
```typescript
import { getCurrentUser, hasRole, requireAuth } from '@/lib/auth'

// Get current user (returns null if not authenticated)
const user = await getCurrentUser()

// Check if user has specific role
const isArtist = await hasRole('ARTIST')

// Require authentication (throws if not authenticated)
const user = await requireAuth()
```

### Client-side (Client Components)
```typescript
import { useSession } from 'next-auth/react'

const { data: session, status } = useSession()

if (status === 'loading') return <div>Loading...</div>
if (status === 'unauthenticated') return <div>Please login</div>

return <div>Hello {session.user.email}</div>
```

## Database Integration

The system integrates with the existing Prisma schema:
- Uses existing User, Artist, Customer, Corporate models
- Maintains referential integrity with foreign keys
- Supports existing password hashing (bcryptjs)
- Updates lastLogin timestamp on authentication

## Security Features

1. **Password Security**
   - bcryptjs with salt rounds (10)
   - Passwords never returned in API responses
   - Secure password validation

2. **Session Security**
   - JWT tokens with secure secrets
   - Automatic token rotation
   - HttpOnly cookies in production

3. **Route Protection**
   - Middleware-based protection
   - Role-based access control
   - Automatic redirects for unauthorized access

4. **API Security**
   - Token validation for API routes
   - Role-based endpoint protection
   - CSRF protection

## Testing the Implementation

### Manual Testing Steps

1. **Registration Test**
   - Visit `/register`
   - Create a customer account
   - Verify database records created
   - Confirm redirect to login

2. **Login Test**
   - Use credentials from registration
   - Verify successful login
   - Check dashboard access
   - Verify role-specific content

3. **Authorization Test**
   - Try accessing `/dashboard` without login
   - Verify redirect to login page
   - Login and confirm access granted

4. **Role-based Access Test**
   - Create users with different roles
   - Verify role-specific dashboard content
   - Test role-specific navigation links

### Automated Testing
Consider adding tests for:
- Authentication API routes
- Protected page access
- Role-based authorization
- Session management

## Troubleshooting

### Common Issues

1. **NEXTAUTH_SECRET not set**
   - Error: "Please define NEXTAUTH_SECRET"
   - Solution: Add NEXTAUTH_SECRET to .env file

2. **Database connection errors**
   - Ensure DATABASE_URL is correct
   - Run `prisma db push` to sync schema

3. **Type errors**
   - Restart TypeScript server
   - Check types/next-auth.d.ts file

4. **Session not persisting**
   - Check NEXTAUTH_URL matches current domain
   - Verify cookie settings in production

### Debug Mode
Enable NextAuth debug mode:
```env
NEXTAUTH_DEBUG=true
```

## Future Enhancements

Potential improvements:
- Social login providers (Google, Facebook, Line)
- Two-factor authentication
- Email verification
- Password reset functionality
- Session activity logging
- OAuth for third-party integrations

## Migration Notes

If upgrading from a different auth system:
1. Backup existing user data
2. Update password hashing to bcryptjs if needed
3. Migrate session storage to JWT
4. Update protected route middleware
5. Test all authentication flows

---

This authentication system provides a solid foundation for the Bright Ears platform with room for future enhancements as the platform grows.