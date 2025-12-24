# Bright Ears Customer Journey Strategy

## Overview
Progressive signup approach optimized for the Thai market, balancing friction reduction with trust building.

## Customer Journey Stages

### Stage 1: Browse & Discover (No Signup Required)
**User can:**
- Search and filter all artists
- View complete profiles, portfolios, pricing
- Read reviews and ratings
- Check availability calendars
- Save favorites (cookie-based)

**Rationale:** Build trust through transparency, match Thai shopping culture

### Stage 2: Send Inquiry (Lightweight Signup)
**When:** User clicks "Contact Artist" or "Get Quote"

**Required Information:**
```
- First Name (not full name)
- Phone Number (for PromptPay & verification)
- Event Date
- Event Type (Wedding/Corporate/Party/etc.)
```

**System Actions:**
- Auto-create lightweight account in background
- Send SMS verification code
- Forward inquiry to artist immediately
- Start conversation thread

**Rationale:** Capture lead with minimal friction, phone-first approach for Thai market

### Stage 3: Quote & Communication (Phone Verified)
**User can:**
- Receive and compare quotes
- Message artists directly
- Negotiate terms
- View detailed availability
- Access saved conversations

**Required:** Phone verification completion

**Rationale:** Build trust between parties, reduce spam, enable PromptPay

### Stage 4: Booking & Payment (Complete Profile)
**When:** User confirms booking

**Additional Required:**
```
- Full Name (for legal contract)
- Email Address (for receipts/documents)
- Event Venue Address
- Guest Count (if applicable)
- Terms & Conditions acceptance
```

**Payment Flow:**
- Generate PromptPay QR code
- Process deposit (typically 30-50%)
- Create digital contract
- Send confirmations to both parties
- Enable calendar integration

**Rationale:** Legal requirements, payment processing, contract generation

## Thai Market Optimizations

### Phone-First Approach
- Phone number as primary identifier (not email)
- SMS verification instead of email verification
- Click-to-call functionality
- Phone number enables PromptPay

### Payment Integration
- PromptPay as primary payment method
- QR code generation for easy scanning
- Support for installment payments (deposit + final)
- Bank transfer as backup option

### Future LINE Integration
- LINE Login for one-click signup (95% penetration)
- LINE notifications for booking updates
- LINE customer support channel
- Share artist profiles via LINE

## Trust & Security Features

### Progressive Verification
1. **Inquiry:** Phone number only
2. **Messaging:** SMS verification required
3. **Booking:** Full identity verification
4. **Payment:** PromptPay verification

### Platform Protections
- Secure messaging (no phone numbers exposed initially)
- Payment escrow for deposits
- Digital contracts with timestamps
- Review system (both directions)
- Dispute resolution process

## Conversion Optimization

### Reduce Abandonment
- 2-field initial form (name + phone)
- No password required initially
- Auto-save progress
- One-click inquiry to multiple artists
- Pre-filled forms where possible

### Increase Trust
- Verified artist badges
- Response time displayed
- Booking guarantee program
- Clear cancellation policies
- Platform insurance options

## Implementation Priorities

### Phase 1 (MVP) - Current
✅ Browse without signup
✅ Basic inquiry system
⏳ Phone verification
⏳ PromptPay integration
⏳ Simple contract generation

### Phase 2 (Q1 2025)
- LINE Login integration
- Advanced messaging with read receipts
- Quote comparison tool
- Automated follow-ups
- Mobile app launch

### Phase 3 (Q2 2025)
- AI-powered artist recommendations
- Virtual event consultation
- Multi-language support (EN/TH/CN)
- Corporate account features
- Loyalty program

## Success Metrics

### Conversion Funnel Targets
- **Browse → Inquiry:** >15%
- **Inquiry → Quote Received:** >80%
- **Quote → Booking:** >25%
- **Booking → Completion:** >90%
- **Completion → Review:** >60%

### User Experience KPIs
- Time to first inquiry: <3 minutes
- Phone verification success: >95%
- Message response time: <2 hours average
- Payment success rate: >95%
- Customer satisfaction: >4.5/5

## Technical Implementation Notes

### Database Considerations
- Lightweight user records for inquiries
- Progressive profile completion
- Phone number as unique identifier
- Session management for partial signups

### API Structure
```typescript
// Minimal inquiry endpoint
POST /api/inquiries/quick
{
  firstName: string
  phoneNumber: string
  eventDate: Date
  eventType: EventType
  artistId: string
}

// Returns: Inquiry ID + SMS verification trigger
```

### Security Considerations
- Rate limiting on phone verification
- Fraud detection for multiple inquiries
- Phone number validation (Thai format)
- GDPR/PDPA compliance for data collection

## Comparison with Competitors

### Our Advantage
- **Faster inquiry:** 2 fields vs 5-10 fields
- **No password friction:** SMS-based auth
- **Thai-optimized:** Phone-first, PromptPay native
- **Progressive trust:** Information given matches value received

### Market Differentiation
- Unlike Fiverr: No mandatory upfront registration
- Unlike Airbnb: Lighter initial commitment
- Unlike GigSalad: Thai payment methods native
- Unlike Thumbtack: Full transaction control

---
**Last Updated:** August 23, 2024  
**Status:** Approved for Implementation  
**Next Review:** After Phase 1 Launch