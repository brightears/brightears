# Bright Ears: Technical Booking Flow Documentation

## Architecture Overview

### System Components
- **Frontend**: Next.js 15 with TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL via Prisma ORM
- **Authentication**: Clerk (Progressive Signup)
- **Notifications**: Custom email/SMS system

## Database Schema: Booking Lifecycle

### Core Models
```prisma
enum BookingStatus {
  INQUIRY     // Initial customer request
  QUOTED      // Artist has responded with quote
  CONFIRMED   // Customer accepted quote
  PAID        // Deposit or full payment received
  COMPLETED   // Event successfully performed
  CANCELLED   // Booking terminated
}

model Booking {
  id            String
  customerId    String
  artistId      String
  status        BookingStatus
  eventDate     DateTime
  eventType     String
  startTime     DateTime
  endTime       DateTime
  quotedPrice   Decimal
  specialRequests String?
}

model Quote {
  id            String
  bookingId     String
  quotedPrice   Decimal
  status        QuoteStatus
  validUntil    DateTime
  inclusions    String[]
  notes         String?
}
```

## Booking Flow State Machine

### State Transitions
```
[INQUIRY] → [QUOTED]
  ├── Artist responds with quote
  └── Customer can accept/reject

[QUOTED] → [CONFIRMED]
  ├── Customer accepts quote
  └── Partial deposit may be required

[CONFIRMED] → [PAID]
  ├── Full/partial payment processed
  └── PromptPay integration

[PAID] → [COMPLETED]
  └── Event successfully performed

[*] → [CANCELLED]
  ├── Customer cancellation
  ├── Artist cancellation
  └── Platform intervention
```

## Quick Inquiry API Workflow

### Endpoint: `/api/inquiries/quick`

1. **Input Validation**
   - Zod schema validates:
     - Thai phone number format
     - Required event details
     - Artist existence

2. **User Management**
   - Progressive signup
   - Creates temporary user if not exists
   - Prepares for Clerk authentication

3. **Booking Creation**
   - Generates minimal booking record
   - Sets default event times
   - Creates inquiry status

4. **Notification Trigger**
   - Sends email to artist
   - Optional SMS notification
   - Asynchronous processing

### Phone Number Handling
```typescript
function formatPhoneNumber(phone: string): string {
  // Converts local to international format
  // +66 standardization
  // Removes non-digit characters
}
```

## Security Considerations

### Input Validation
- Zod schema validation
- Phone number regex enforcement
- Prevent injection attacks

### User Protection
- Temporary user creation
- No sensitive data exposure
- Progressive authentication

## Performance Optimizations

### Async Notifications
- Non-blocking artist notifications
- Background job processing
- Minimal API response time

## Error Handling Strategies

### Notification Failures
- Graceful degradation
- Logging without blocking request
- Retry mechanisms

### Inquiry Creation Errors
- Comprehensive error responses
- Client-friendly messages
- Detailed logging

## Internationalization Support
- Bilingual (EN/TH) content
- Thai-specific validations
- Localized date/time handling

## Payment Integration

### PromptPay Specifics
- Thai-specific payment flow
- QR code generation
- Transaction verification

## Monitoring & Analytics

### Tracking Points
- Inquiry creation
- Quote generation
- Booking confirmations
- Payment processing

## Future Improvements
- Enhanced spam prevention
- More granular event type selection
- Advanced availability checking
- Real-time quote negotiation

---

*Last Updated: October 3, 2025*
*Version: 1.0*