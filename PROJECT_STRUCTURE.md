# Bright Ears - Project Structure & User Journey Documentation

## 🎯 Project Overview
Bright Ears is a 0% commission entertainment booking platform for Thailand, connecting customers with artists (DJs, bands, singers) through a progressive trust system.

## 📍 Complete Site Map

### Public Pages (No Login Required)
```
/
├── /artists (Browse & Search)
│   └── /artists/[id] (Individual Profile - Public View)
├── /how-it-works
├── /corporate
├── /pricing (Premium Features)
├── /about
├── /contact
├── /help
│   ├── /help/customers
│   ├── /help/artists
│   └── /help/corporate
└── /legal
    ├── /terms
    ├── /privacy
    └── /refund-policy
```

### Authentication Pages
```
/login
/register
├── /register/choice (Customer vs Artist vs Corporate)
├── /register/customer
├── /register/artist (Multi-step)
│   ├── Step 1: Basic Info
│   ├── Step 2: Profile Details
│   ├── Step 3: Media Upload
│   └── Step 4: Verification
└── /register/corporate
/forgot-password
/reset-password
```

### Customer Dashboard (Login Required)
```
/dashboard/customer
├── /bookings
│   ├── /bookings/active
│   ├── /bookings/pending
│   ├── /bookings/completed
│   └── /bookings/[id] (Booking Details)
├── /messages
│   └── /messages/[conversationId]
├── /favorites
├── /reviews
│   └── /reviews/write/[bookingId]
├── /profile
└── /settings
    ├── /settings/notifications
    └── /settings/language
```

### Artist Dashboard (Login Required)
```
/dashboard/artist
├── /profile
│   ├── /profile/edit
│   ├── /profile/media
│   ├── /profile/pricing
│   └── /profile/verification
├── /bookings
│   ├── /bookings/requests (New Inquiries)
│   ├── /bookings/active
│   ├── /bookings/upcoming
│   └── /bookings/history
├── /calendar (Availability Management)
├── /earnings
│   ├── /earnings/overview
│   └── /earnings/withdraw
├── /reviews
├── /analytics
│   ├── /analytics/views
│   └── /analytics/conversions
├── /messages
└── /settings
    ├── /settings/notifications
    ├── /settings/payment (PromptPay)
    └── /settings/subscription (Premium)
```

### Corporate Dashboard
```
/dashboard/corporate
├── /artists (Curated List)
├── /contracts
│   ├── /contracts/active
│   └── /contracts/create
├── /bookings
│   ├── /bookings/bulk (Multiple Events)
│   └── /bookings/recurring
├── /venues
│   └── /venues/[id]/events
├── /invoices
├── /team (Multi-user Access)
└── /reports
```

### Booking Flow Pages
```
/book/[artistId]
├── Step 1: /book/[artistId]/details (Event Details)
├── Step 2: /book/[artistId]/requirements (Special Requests)
├── Step 3: /book/[artistId]/contact (Contact Info)
├── Step 4: /book/[artistId]/review (Review & Send)
└── Success: /book/[artistId]/confirmation
```

## 🛤️ User Journeys

### 1. Customer Journey (Individual)
```
DISCOVERY
1. Land on homepage → See value proposition
2. Browse artists → Filter by category/location/price
3. View artist profile → See photos, videos, reviews
4. Check availability → Calendar view

BOOKING
5. Click "Book Now" → Multi-step booking form
6. Fill event details → Date, time, venue, guests
7. Add requirements → Equipment, songs, special requests
8. Provide contact → Name, phone, email
9. Review & submit → Generate LINE message

COMMUNICATION
10. Chat via LINE → Discuss details with artist
11. Receive quote → Via LINE or in-app
12. Confirm booking → Accept terms

PAYMENT
13. Receive PromptPay QR → From artist directly
14. Make payment → Screenshot proof
15. Booking confirmed → Get confirmation code

POST-EVENT
16. Leave review → Rate and comment
17. Favorite artist → For future bookings
```

### 2. Artist Journey
```
ONBOARDING
1. Register as artist → Choose category
2. Complete profile → Stage name, bio, experience
3. Upload media → Photos, videos, audio samples
4. Set pricing → Hourly rate, packages
5. Verify identity → ID upload (optional for trust)

PROFILE OPTIMIZATION
6. Add availability → Calendar management
7. Create packages → Wedding, corporate, club
8. Upload testimonials → Previous client reviews
9. Link social media → Instagram, Facebook, YouTube

GETTING BOOKINGS
10. Receive inquiry → Push notification + LINE
11. Review request → Event details, requirements
12. Send quote → Via platform or LINE
13. Negotiate → Chat with customer
14. Confirm booking → Accept and send payment details

SERVICE DELIVERY
15. Pre-event contact → Confirm details
16. Perform service → At venue
17. Request payment → PromptPay QR
18. Mark complete → Update booking status

GROWTH
19. Collect reviews → Build reputation
20. View analytics → Profile views, conversion rate
21. Upgrade to premium → Featured listings, badges
```

### 3. Corporate Journey
```
SETUP
1. Register corporate → Company details
2. Add venues → Multiple locations
3. Set preferences → Preferred artists, budgets
4. Add team members → Multi-user access

BOOKING
5. Browse curated artists → Pre-vetted for corporate
6. Create event → Single or recurring
7. Bulk booking → Multiple artists/dates
8. Get proposals → From multiple artists
9. Review contracts → Standard terms

MANAGEMENT
10. Track bookings → Dashboard overview
11. Manage invoices → Monthly billing
12. Generate reports → For accounting
13. Rate artists → Internal ratings
```

## ⚡ Page Priority List

### Priority 1: MVP Core (Week 1-2)
✅ Homepage
✅ Artist Browse/Search
✅ Artist Profile (Basic)
🔲 **Enhanced Artist Profile** (with media gallery)
🔲 **Booking Flow** (multi-step form)
🔲 **Customer Dashboard** (basic)
🔲 **Artist Dashboard** (basic)
🔲 **LINE Integration** (booking inquiries)

### Priority 2: Essential Features (Week 3-4)
🔲 **Availability Calendar** (artist side)
🔲 **Booking Management** (both sides)
🔲 **PromptPay Integration** (payment info)
🔲 **Review System** (post-booking)
🔲 **Search Filters** (advanced)
🔲 **Responsive Mobile** (full optimization)

### Priority 3: Growth Features (Week 5-6)
🔲 In-app Messaging
🔲 Email Notifications
🔲 Artist Analytics
🔲 Premium Features (artist)
🔲 Favorites System
🔲 Social Sharing

### Priority 4: Corporate & Scale (Week 7-8)
🔲 Corporate Dashboard
🔲 Bulk Booking
🔲 Contract Management
🔲 Multi-venue Support
🔲 Team Access
🔲 Invoice Generation

### Priority 5: Advanced (Week 9+)
🔲 Admin Panel
🔲 AI Recommendations
🔲 Advanced Analytics
🔲 API for Partners
🔲 Mobile App
🔲 Multi-language (beyond EN/TH)

## 📱 Key Page Wireframes

### 1. Artist Profile Page (Enhanced)
```
[Header with Navigation]

[Hero Section]
- Cover image (1920x400)
- Profile photo (200x200)
- Stage name, category, location
- Rating (★★★★★ 4.8 - 127 reviews)
- Verification badges
- Quick stats (500+ events, Member since 2021)

[Action Bar - Sticky]
- "Book Now" (primary CTA)
- "Message on LINE" 
- "Add to Favorites"
- Share button

[Tab Navigation]
- Overview | Media | Packages | Reviews | About

[Overview Tab]
- Pricing from ฿X,XXX/hour
- Available dates calendar widget
- Equipment provided
- Languages spoken
- Travel radius

[Media Tab]
- Photo gallery (grid)
- Video performances
- Audio samples (Spotify/SoundCloud embeds)

[Packages Tab]
- Wedding Package
- Corporate Event Package
- Club Night Package
- Custom quotes available

[Reviews Tab]
- Review summary
- Individual reviews with photos
- Verified booking badge

[About Tab]
- Full bio
- Experience timeline
- Past venues/clients (logos)
- Social media links
```

### 2. Booking Flow (Mobile-First)
```
Step 1: Event Details
- Event type (dropdown)
- Date picker
- Start/end time
- Venue name
- Venue address (with map)
- Expected guests
- Indoor/outdoor

Step 2: Requirements
- Equipment needed (checkboxes)
- Special song requests
- Dress code
- Language preference
- Additional services
- Notes field

Step 3: Your Information
- Full name
- Phone (for LINE)
- Email
- Company (optional)
- How did you hear about us?

Step 4: Review & Send
- Summary of all details
- Terms acceptance
- "Send Inquiry" button
- Generates LINE message
```

### 3. Customer Dashboard
```
[Welcome Banner]
"Hi [Name], welcome back!"

[Quick Actions]
- Browse Artists
- View Bookings
- Messages (3 new)
- Write Review

[Active Bookings]
- Card layout
- Artist photo, name
- Event date, time
- Status badge
- Quick actions (Message, View)

[Upcoming Events]
- Timeline view
- Countdown timers

[Recent Artists]
- Horizontal scroll
- Quick rebook option

[Favorites]
- Grid of favorited artists
```

## 🧭 Navigation Structure

### Main Navigation (Desktop)
```
Logo | Browse Artists | How It Works | Corporate | For Artists | [Language] | [Login/User Menu]
```

### Mobile Navigation
```
[≡] Menu | Logo | [User Icon]

Drawer:
- Browse Artists
- How It Works
- Corporate
- For Artists
- Help Center
- Language
- Login/Profile
```

### Footer (All Pages)
```
Column 1: For Customers
- How It Works
- Browse Artists
- Corporate Events
- Help Center

Column 2: For Artists
- Join as Artist
- Artist Resources
- Pricing & Fees
- Success Stories

Column 3: Company
- About Us
- Contact
- Careers
- Press

Column 4: Connect
- LINE: @brightears
- Facebook
- Instagram
- YouTube

Bottom Bar:
© 2024 Bright Ears | Terms | Privacy | Refund Policy | ไทย/EN
```

### User Menu (Logged In)
```
Customer:
- Dashboard
- My Bookings
- Messages
- Favorites
- Reviews
- Profile
- Settings
- Sign Out

Artist:
- Dashboard
- My Profile
- Bookings
- Calendar
- Earnings
- Analytics
- Settings
- Sign Out

Corporate:
- Dashboard
- Bookings
- Contracts
- Venues
- Team
- Reports
- Settings
- Sign Out
```

## 🔄 Critical User Flows

### Registration Flow - Artist
```
1. Choose "Join as Artist" → /register/artist
2. Basic Info Form:
   - Email, password
   - Stage name
   - Category (DJ, Band, etc.)
   - Primary location

3. Profile Details:
   - Bio (required)
   - Years of experience
   - Equipment owned
   - Languages spoken
   - Travel willingness

4. Media Upload:
   - Profile photo (required)
   - Cover photo
   - Performance photos (min 3)
   - Videos (optional)
   - Audio samples (optional)

5. Verification (Optional):
   - Upload ID
   - Phone verification
   - Social media links

6. Welcome Dashboard:
   - Profile completion tips
   - How to get bookings
   - Set availability
```

### Booking Flow with LINE Integration
```
1. Customer clicks "Book Now"
2. Fills multi-step form
3. System generates inquiry:
   - Creates booking record (PENDING)
   - Notifies artist (push + email)
   - Generates LINE message template

4. LINE Message Template:
   "Hi [Artist Name]! I'd like to book you for:
   📅 Date: [Date]
   ⏰ Time: [Time]
   📍 Venue: [Venue]
   👥 Guests: [Number]
   💰 Budget: [Range]
   
   Special requests: [Details]
   
   My contact: [Phone]
   Booking ref: #[ID]"

5. Artist responds via LINE
6. Negotiation happens on LINE
7. Artist updates booking status in dashboard
8. Customer receives confirmation
```

### Payment Flow (PromptPay)
```
1. Booking confirmed by artist
2. Artist sends payment request:
   - PromptPay QR code
   - Amount due
   - Due date
   - Booking reference

3. Customer makes payment:
   - Scans QR code
   - Transfers via banking app
   - Screenshots confirmation

4. Payment confirmation:
   - Customer uploads screenshot
   - Artist verifies receipt
   - Booking marked as PAID
   - Both parties notified

5. Post-event:
   - Artist marks complete
   - Review request sent
   - Payment released (if escrow - future)
```

## 📊 Success Metrics

### User Metrics
- User registration rate
- Profile completion rate (artists)
- Booking conversion rate
- Review submission rate
- User retention (monthly active)

### Business Metrics
- Total bookings/month
- Average booking value
- Artist acquisition rate
- Premium subscription rate
- Platform GMV (gross merchandise value)

### Quality Metrics
- Average response time (artist)
- Booking completion rate
- Review scores average
- Dispute rate
- Customer satisfaction (NPS)

## 🚀 Implementation Roadmap

### Week 1-2: Core Booking System
- Enhanced artist profiles with media
- Multi-step booking flow
- Basic customer dashboard
- LINE message generation

### Week 3-4: Artist Tools
- Artist dashboard
- Availability calendar
- Booking management
- Basic analytics

### Week 5-6: Payments & Trust
- PromptPay integration
- Review system
- Verification badges
- Trust indicators

### Week 7-8: Communication
- In-app messaging
- Notification system
- Email templates
- LINE bot setup

### Week 9-10: Corporate Features
- Corporate dashboard
- Bulk booking
- Contract templates
- Invoice system

### Week 11-12: Growth & Optimization
- Analytics dashboard
- Premium features
- SEO optimization
- Performance tuning

## 🇹🇭 Thailand Market Considerations

### Cultural Adaptations
- Buddhist holiday calendar awareness
- Formal/informal language options (Thai)
- Auspicious date suggestions
- Respect for hierarchy in corporate

### Technical Adaptations
- LINE as primary communication
- PromptPay as primary payment
- Thai phone number format
- Thai address system
- Mobile-first (95% mobile usage)

### Business Adaptations
- No upfront fees (trust building)
- Progressive verification
- Social proof emphasis
- Corporate entertainment focus
- Wedding/temple fair categories

## 🎨 Design System Components

### Reusable Components
- ArtistCard (browse/search results)
- BookingCard (dashboard/history)
- ReviewCard (profile/reviews)
- MediaGallery (photos/videos)
- Calendar (availability/booking)
- PriceDisplay (with currency)
- StatusBadge (booking states)
- VerificationBadge (trust levels)
- RatingStars (reviews)
- LineButton (CTA component)

### Page Templates
- DashboardLayout (role-based)
- ProfileLayout (public/private)
- FormLayout (multi-step)
- ListLayout (search/browse)
- DetailLayout (artist/booking)

## 📝 Next Immediate Actions

1. **Create Enhanced Artist Profile Page**
   - Add media gallery component
   - Implement tab navigation
   - Add booking CTA
   - Include LINE contact

2. **Build Booking Flow**
   - Create multi-step form
   - Add form validation
   - Generate LINE messages
   - Store in database

3. **Develop Customer Dashboard**
   - List active bookings
   - Show upcoming events
   - Display favorites
   - Add quick actions

4. **Implement Basic Messaging**
   - LINE message templates
   - Booking inquiries
   - Status updates
   - Review requests

---

*This document serves as the single source of truth for Bright Ears' product structure and should be updated as features are implemented.*