# Artist Inquiry Management - Quick Reference

## 📁 Files Created

### Core Components (7 files)
1. `/components/dashboard/InquiryInbox.tsx` - Main inquiry management interface
2. `/components/dashboard/QuoteResponseForm.tsx` - Modal form for sending quotes
3. `/components/dashboard/InquiryBadge.tsx` - Real-time unread count badge
4. `/components/dashboard/DashboardStats.tsx` - Stats card grid component
5. `/components/dashboard/BookingsManager.tsx` - Bookings list component
6. `/components/dashboard/DashboardSidebar.tsx` - Navigation sidebar with badge
7. `/components/dashboard/InquiryDetailModal.tsx` - (Optional) Full detail view

### API Routes (4 files)
1. `/app/api/inquiries/list/route.ts` - GET inquiries list
2. `/app/api/inquiries/mark-read/route.ts` - POST mark as read
3. `/app/api/inquiries/decline/route.ts` - POST decline inquiry
4. `/app/api/quotes/create/route.ts` - POST create and send quote

### Pages (2 files)
1. `/app/[locale]/dashboard/artist/page.tsx` - Main artist dashboard
2. `/app/[locale]/dashboard/artist/inquiries/page.tsx` - Dedicated inquiries page

### Configuration (4 files)
1. `/prisma/schema.prisma` - Database schema with Booking & Quote models
2. `/lib/auth.ts` - NextAuth configuration
3. `/types/next-auth.d.ts` - TypeScript type definitions
4. `/tailwind.config.js` - Tailwind CSS configuration

### Documentation (4 files)
1. `/INQUIRY_SYSTEM_README.md` - Complete system documentation
2. `/IMPLEMENTATION_GUIDE.md` - Step-by-step setup guide
3. `/DESIGN_REFERENCE.md` - Visual design system reference
4. `/QUICK_REFERENCE.md` - This file

### Package Management (1 file)
1. `/package.json` - Dependencies and scripts

**Total: 22 files created**

---

## 🚀 Quick Start Commands

```bash
# Navigate to project
cd /Users/benorbe/Documents/Coding\ Projects/brightears

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your database URL and secrets

# Initialize database
npm run db:generate
npm run db:push

# (Optional) Seed test data
npx prisma db seed

# Run development server
npm run dev

# Open browser
open http://localhost:3000/en/dashboard/artist
```

---

## 📊 Database Schema Quick Reference

### Booking Model
```typescript
{
  id: string
  customerId: string
  artistId: string
  eventType: string          // "wedding", "corporate", etc.
  eventDate: DateTime
  durationHours: number
  status: string             // "INQUIRY", "QUOTED", "CONFIRMED", etc.
  isRead: boolean            // For tracking new inquiries
  quotedPrice?: number
  message?: string
  specialRequests?: string
  // ... more fields
}
```

### Quote Model
```typescript
{
  id: string
  bookingId: string
  artistId: string
  totalPrice: number
  packageName?: string
  serviceOptions: string[]   // ["DJ Performance", "Equipment"]
  inclusions: string[]       // ["Sound system", "Mixing"]
  exclusions: string[]       // ["Travel costs"]
  validUntil: DateTime
  customMessage?: string
  status: string             // "pending", "accepted", "declined"
}
```

---

## 🔌 API Endpoints Quick Reference

### List Inquiries
```bash
GET /api/inquiries/list?status=INQUIRY&unreadOnly=false

Response:
{
  "success": true,
  "inquiries": [...],
  "unreadCount": 3,
  "statusCounts": { "INQUIRY": 5, "QUOTED": 8 }
}
```

### Mark as Read
```bash
POST /api/inquiries/mark-read
Body: { "bookingId": "cm1abc123" }

Response: { "success": true, "booking": {...} }
```

### Send Quote
```bash
POST /api/quotes/create
Body: {
  "bookingId": "cm1abc123",
  "totalPrice": 15000,
  "packageName": "Premium Package",
  "serviceOptions": ["DJ Performance", "Equipment"],
  "inclusions": ["Professional mixing", "Sound system"],
  "exclusions": ["Travel expenses"],
  "validityDays": 7,
  "customMessage": "Looking forward to your event!"
}

Response: { "success": true, "quote": {...}, "booking": {...} }
```

### Decline Inquiry
```bash
POST /api/inquiries/decline
Body: { "bookingId": "cm1abc123", "reason": "Not available" }

Response: { "success": true, "booking": {...} }
```

---

## 🎨 Component Usage Examples

### Basic Integration
```tsx
import InquiryInbox from '@/components/dashboard/InquiryInbox';

<InquiryInbox artistRate={3000} />
```

### With Sidebar Badge
```tsx
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

<DashboardSidebar userRole="artist" locale="en" />
```

### Custom Hook for Inquiries
```tsx
import { useInquiries } from '@/hooks/useInquiries';

const { inquiries, unreadCount, loading, refetch } = useInquiries();
```

---

## 🎯 Key Features Checklist

### Inquiry Inbox
- [x] Real-time inquiry list
- [x] "NEW" badge for unread items
- [x] Event type color coding
- [x] Customer info display
- [x] Message preview
- [x] Quick actions (View, Quote, Decline)
- [x] Time ago formatting
- [x] Responsive design

### Quote Form
- [x] Dynamic pricing calculator
- [x] Service options (8 predefined)
- [x] Custom inclusions/exclusions
- [x] Package naming
- [x] Custom message field
- [x] Quote validity selector
- [x] Real-time validation
- [x] Loading states

### Dashboard Integration
- [x] Sidebar badge with count
- [x] Auto-refresh (30s interval)
- [x] Stats card grid
- [x] Upcoming bookings widget
- [x] Quick action cards

### API Security
- [x] Session authentication
- [x] Artist ownership verification
- [x] Input validation
- [x] Status verification
- [x] Analytics logging

---

## 🎨 Design System Quick Reference

### Colors
- **Brand Cyan**: `#00D9FF` - Primary
- **Purple**: `#8B5CF6` - Secondary
- **Pink**: `#EC4899` - Tertiary
- **Gray-900**: `#111827` - Background
- **Gray-800**: `#1F2937` - Cards

### Component Classes
```tsx
// Card
className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6"

// Primary Button
className="px-6 py-3 bg-brand-cyan text-white rounded-lg hover:bg-brand-cyan/90"

// Badge
className="px-3 py-1 bg-brand-cyan/10 text-brand-cyan rounded-full text-sm"

// Input
className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white"
```

---

## 📈 Booking Status Flow

```
INQUIRY → User submits booking request
   ↓
QUOTED → Artist sends quote (this system!)
   ↓
NEGOTIATING → Back-and-forth discussion
   ↓
CONFIRMED → Customer accepts quote
   ↓
CONTRACTED → Contract signed
   ↓
PAID → Payment received
   ↓
UPCOMING → Event is scheduled
   ↓
COMPLETED → Event finished
   ↓
REVIEWED → Customer left review
```

---

## 🔍 Troubleshooting Quick Fixes

### Inquiries not showing?
```bash
# Check database
npx prisma studio
# Verify booking has status="INQUIRY" and correct artistId
```

### Badge not updating?
```javascript
// Check browser console for API errors
// Verify /api/inquiries/list is accessible
console.log(await fetch('/api/inquiries/list').then(r => r.json()));
```

### Styles not working?
```bash
# Rebuild Tailwind
npm run build

# Or restart dev server
npm run dev
```

### Authentication errors?
```bash
# Verify .env file has:
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# Clear cookies and sign in again
```

---

## 📱 Testing Checklist

- [ ] Create test booking with status "INQUIRY"
- [ ] Verify it appears in inbox with "NEW" badge
- [ ] Click to view details
- [ ] Verify badge count updates
- [ ] Open quote form
- [ ] Fill out and submit quote
- [ ] Verify status changes to "QUOTED"
- [ ] Test decline functionality
- [ ] Check mobile responsiveness
- [ ] Test with multiple inquiries

---

## 🚢 Deployment Checklist

- [ ] Update environment variables for production
- [ ] Run `npm run build` successfully
- [ ] Test all API endpoints
- [ ] Verify database migrations
- [ ] Enable HTTPS
- [ ] Set up error monitoring
- [ ] Configure rate limiting
- [ ] Test email notifications (if implemented)
- [ ] Monitor performance metrics

---

## 📞 Support Resources

- **Full Documentation**: `/INQUIRY_SYSTEM_README.md`
- **Setup Guide**: `/IMPLEMENTATION_GUIDE.md`
- **Design Reference**: `/DESIGN_REFERENCE.md`
- **Prisma Docs**: https://www.prisma.io/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind Docs**: https://tailwindcss.com/docs

---

## 🎯 Next Steps After Implementation

1. **Test with real users** - Get artist feedback
2. **Add email notifications** - Alert customers when quote is sent
3. **Implement Line API** - Integrate Line chat for real-time communication
4. **Build analytics dashboard** - Track conversion rates
5. **Add quote templates** - Speed up quote creation
6. **Customer response flow** - Accept/decline quote functionality
7. **Calendar integration** - Check availability before quoting
8. **Mobile app** - React Native version for on-the-go management

---

## 💡 Pro Tips

1. **Use Prisma Studio** for easy database viewing: `npm run db:studio`
2. **Enable hot reload** in development for faster iteration
3. **Use browser DevTools** to test responsive design
4. **Keep inquiries under 20** per page for optimal performance
5. **Implement pagination** if you have > 50 inquiries regularly
6. **Use environment-specific configs** for staging vs production
7. **Monitor API response times** and optimize slow queries
8. **Keep analytics events** for future business intelligence

---

## 📊 Key Metrics to Track

- **Response Time**: Time from inquiry to quote sent
- **Conversion Rate**: % of inquiries that become bookings
- **Quote Acceptance Rate**: % of quotes accepted by customers
- **Average Quote Value**: Track pricing trends
- **Peak Inquiry Times**: Optimize availability for high-demand periods

---

**Last Updated**: 2025-01-09
**Version**: 1.0.0
**License**: Proprietary - Bright Ears Platform
