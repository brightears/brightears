# Bright Ears: Booking Flow Quick Reference

## Booking Statuses

### Customer Perspective
| Status      | Meaning                           | Next Steps                         |
|-------------|-----------------------------------|-------------------------------------|
| INQUIRY     | Initial request sent              | Wait for artist quote               |
| QUOTED      | Artist responded with quote       | Review and accept/reject quote      |
| CONFIRMED   | Quote accepted                    | Proceed with deposit/full payment   |
| PAID        | Payment completed                 | Prepare for event                   |
| COMPLETED   | Event successfully performed      | Leave a review                      |
| CANCELLED   | Booking terminated                | Restart booking process             |

### Artist Perspective
| Status      | Action Required                   | Customer Expectation               |
|-------------|-----------------------------------|-------------------------------------|
| INQUIRY     | Review and prepare quote          | Quick response                     |
| QUOTED      | Wait for customer decision        | Detailed quote explanation          |
| CONFIRMED   | Finalize event details            | Clear communication                |
| PAID        | Prepare for performance           | Confirmation of logistics           |
| COMPLETED   | Request review                    | Post-event satisfaction            |

## Key API Endpoints

### Booking Management
- `POST /api/inquiries/quick`: Create initial inquiry
- `GET /api/inquiries/quick`: Check inquiry status
- `POST /api/quotes/[id]/accept`: Accept quote
- `POST /api/bookings/[id]/payment`: Process payment

## Quick Inquiry Form Fields

### Required
- First Name
- Phone Number / LINE ID
- Contact Method
- Event Date
- Event Type

### Optional
- Special Requests/Message

## Contact Methods
1. **Phone**
   - Thai phone number format
   - SMS verification
2. **LINE**
   - LINE ID required
   - Messaging integration

## Payment Process
1. Receive quote
2. Review price and inclusions
3. Select payment method
   - PromptPay
   - Bank Transfer
4. Upload payment proof
5. Wait for verification

## Performance Tracking
- Booking ID: Unique identifier
- Status URL: Track inquiry progress
- Messaging: Real-time updates

## Error Handling
- Invalid phone number
- Booking not found
- Payment verification issues

## Support Channels
- Email: support@brightears.com
- Phone: +66 (0) 99-999-9999
- LINE: @brightears

## Best Practices
- Book 2-4 weeks in advance
- Provide detailed event information
- Be responsive to artist messages
- Keep booking ID handy

---

*Last Updated: October 3, 2025*
*Version: 1.0*