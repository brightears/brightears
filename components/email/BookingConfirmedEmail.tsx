import { Text, Button, Section, Hr } from '@react-email/components'
import * as React from 'react'
import BaseEmailTemplate from './BaseEmailTemplate'

interface BookingConfirmedEmailProps {
  customerName: string
  artistName: string
  bookingNumber: string
  eventType: string
  eventDate: string
  startTime: string
  endTime: string
  venue: string
  venueAddress: string
  finalPrice: number
  currency: string
  depositAmount?: number
  depositPaid: boolean
  guestCount?: number
  specialRequests?: string
  artistContact?: string
  dashboardUrl: string
  locale?: 'en' | 'th'
}

export const BookingConfirmedEmail: React.FC<BookingConfirmedEmailProps> = ({
  customerName,
  artistName,
  bookingNumber,
  eventType,
  eventDate,
  startTime,
  endTime,
  venue,
  venueAddress,
  finalPrice,
  currency,
  depositAmount,
  depositPaid,
  guestCount,
  specialRequests,
  artistContact,
  dashboardUrl,
  locale = 'en',
}) => {
  const isThaiLanguage = locale === 'th'

  const content = {
    en: {
      subject: `Booking Confirmed - ${eventType}`,
      greeting: `Dear ${customerName},`,
      mainText: `Great news! Your booking has been confirmed.`,
      confirmationText: `${artistName} has confirmed your booking for ${eventType}. All the details are below:`,
      bookingDetailsHeading: 'Booking Details:',
      bookingNumberLabel: 'Booking Number:',
      artistLabel: 'Artist:',
      eventTypeLabel: 'Event Type:',
      dateTimeLabel: 'Date & Time:',
      venueLabel: 'Venue:',
      guestCountLabel: 'Expected Guests:',
      pricingHeading: 'Pricing:',
      totalPriceLabel: 'Total Price:',
      depositLabel: 'Deposit:',
      depositPaidText: 'Paid',
      depositPendingText: 'Required',
      remainingLabel: 'Remaining Balance:',
      specialRequestsHeading: 'Special Requests:',
      contactHeading: 'Artist Contact:',
      nextStepsHeading: 'What\'s Next?',
      nextStepsText: `Your event is confirmed! ${artistName} will be in touch 24-48 hours before your event to coordinate final details.`,
      paymentReminderText: depositAmount && !depositPaid 
        ? `Please ensure your deposit payment is completed to secure your booking.`
        : `Thank you for your payment. Your booking is fully secured.`,
      supportText: 'If you have any questions or need to make changes, please contact us or reach out to the artist directly.',
      buttonText: 'View Booking Details',
      footerText: 'We\'re excited to help make your event unforgettable!',
    },
    th: {
      subject: `ยืนยันการจอง - ${eventType}`,
      greeting: `เรียน คุณ${customerName}`,
      mainText: `ข่าวดี! การจองของคุณได้รับการยืนยันแล้ว`,
      confirmationText: `${artistName} ได้ยืนยันการจอง ${eventType} ของคุณแล้ว รายละเอียดทั้งหมดมีดังนี้:`,
      bookingDetailsHeading: 'รายละเอียดการจอง:',
      bookingNumberLabel: 'หมายเลขการจอง:',
      artistLabel: 'ศิลปิน:',
      eventTypeLabel: 'ประเภทงาน:',
      dateTimeLabel: 'วันที่และเวลา:',
      venueLabel: 'สถานที่:',
      guestCountLabel: 'จำนวนแขกที่คาดว่าจะมา:',
      pricingHeading: 'ราคา:',
      totalPriceLabel: 'ราคารวม:',
      depositLabel: 'เงินมัดจำ:',
      depositPaidText: 'ชำระแล้ว',
      depositPendingText: 'ต้องชำระ',
      remainingLabel: 'ยอดคงเหลือ:',
      specialRequestsHeading: 'ความต้องการพิเศษ:',
      contactHeading: 'ติดต่อศิลปิน:',
      nextStepsHeading: 'ขั้นตอนต่อไป?',
      nextStepsText: `งานของคุณได้รับการยืนยันแล้ว! ${artistName} จะติดต่อคุณใน 24-48 ชั่วโมงก่อนงานเพื่อประสานรายละเอียดสุดท้าย`,
      paymentReminderText: depositAmount && !depositPaid 
        ? `กรุณาชำระเงินมัดจำให้เสร็จสิ้นเพื่อรับประกันการจองของคุณ`
        : `ขอบคุณสำหรับการชำระเงิน การจองของคุณได้รับการรับประกันแล้ว`,
      supportText: 'หากคุณมีคำถามหรือต้องการเปลี่ยนแปลงข้อมูล กรุณาติดต่อเราหรือติดต่อศิลปินโดยตรง',
      buttonText: 'ดูรายละเอียดการจอง',
      footerText: 'เรายินดีที่จะช่วยให้งานของคุณน่าจดจำ!',
    }
  }

  const t = content[locale]
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat(locale === 'th' ? 'th-TH' : 'en-US', {
      style: 'currency',
      currency: currency || 'THB'
    }).format(amount)
  }

  const remainingBalance = depositAmount ? finalPrice - depositAmount : 0

  return (
    <BaseEmailTemplate
      preview={t.subject}
      locale={locale}
    >
      <Text style={heading}>{t.greeting}</Text>
      
      <Text style={paragraph}>
        {t.mainText}
      </Text>

      <Text style={paragraph}>
        {t.confirmationText}
      </Text>

      {/* Booking Details Section */}
      <Section style={detailsSection}>
        <Text style={detailsHeading}>{t.bookingDetailsHeading}</Text>
        
        <Text style={detailItem}>
          <strong>{t.bookingNumberLabel}</strong> {bookingNumber}
        </Text>
        
        <Text style={detailItem}>
          <strong>{t.artistLabel}</strong> {artistName}
        </Text>
        
        <Text style={detailItem}>
          <strong>{t.eventTypeLabel}</strong> {eventType}
        </Text>
        
        <Text style={detailItem}>
          <strong>{t.dateTimeLabel}</strong> {eventDate} ({startTime} - {endTime})
        </Text>
        
        <Text style={detailItem}>
          <strong>{t.venueLabel}</strong> {venue}
          {venueAddress && <br />}{venueAddress}
        </Text>
        
        {guestCount && (
          <Text style={detailItem}>
            <strong>{t.guestCountLabel}</strong> {guestCount}
          </Text>
        )}
      </Section>

      {/* Pricing Section */}
      <Section style={pricingSection}>
        <Text style={detailsHeading}>{t.pricingHeading}</Text>
        
        <Text style={priceItem}>
          <strong>{t.totalPriceLabel}</strong> {formatPrice(finalPrice)}
        </Text>
        
        {depositAmount && (
          <>
            <Text style={priceItem}>
              <strong>{t.depositLabel}</strong> {formatPrice(depositAmount)} 
              <span style={depositStatus}>
                ({depositPaid ? t.depositPaidText : t.depositPendingText})
              </span>
            </Text>
            
            {remainingBalance > 0 && (
              <Text style={priceItem}>
                <strong>{t.remainingLabel}</strong> {formatPrice(remainingBalance)}
              </Text>
            )}
          </>
        )}
      </Section>

      {/* Special Requests */}
      {specialRequests && (
        <Section style={requestsSection}>
          <Text style={detailsHeading}>{t.specialRequestsHeading}</Text>
          <Text style={requestsText}>{specialRequests}</Text>
        </Section>
      )}

      {/* Artist Contact */}
      {artistContact && (
        <Section style={contactSection}>
          <Text style={detailsHeading}>{t.contactHeading}</Text>
          <Text style={contactText}>{artistContact}</Text>
        </Section>
      )}

      <Hr style={hr} />

      {/* Next Steps */}
      <Section style={nextStepsSection}>
        <Text style={detailsHeading}>{t.nextStepsHeading}</Text>
        <Text style={paragraph}>{t.nextStepsText}</Text>
        <Text style={paragraph}>{t.paymentReminderText}</Text>
        <Text style={paragraph}>{t.supportText}</Text>
      </Section>

      <Section style={buttonSection}>
        <Button
          style={button}
          href={dashboardUrl}
        >
          {t.buttonText}
        </Button>
      </Section>

      <Text style={footerNote}>
        {t.footerText}
      </Text>
    </BaseEmailTemplate>
  )
}

// Styles
const heading = {
  fontSize: '24px',
  lineHeight: '1.3',
  fontWeight: '700',
  color: '#484848',
  margin: '30px 0 15px',
}

const paragraph = {
  fontSize: '16px',
  lineHeight: '1.4',
  color: '#484848',
  margin: '15px 0',
}

const detailsSection = {
  backgroundColor: '#f8f9fa',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
}

const pricingSection = {
  backgroundColor: '#e8f5e8',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
  border: '1px solid #28a745',
}

const requestsSection = {
  backgroundColor: '#fff3cd',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
  border: '1px solid #ffeaa7',
}

const contactSection = {
  backgroundColor: '#e3f2fd',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
  border: '1px solid #2196f3',
}

const nextStepsSection = {
  padding: '20px 0',
}

const detailsHeading = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#484848',
  margin: '0 0 15px 0',
}

const detailItem = {
  fontSize: '14px',
  lineHeight: '1.4',
  color: '#484848',
  margin: '8px 0',
}

const priceItem = {
  fontSize: '16px',
  lineHeight: '1.4',
  color: '#484848',
  margin: '10px 0',
}

const depositStatus = {
  fontSize: '14px',
  fontWeight: 'normal',
  color: '#6c757d',
}

const requestsText = {
  fontSize: '14px',
  lineHeight: '1.4',
  color: '#484848',
  margin: '8px 0',
  fontStyle: 'italic',
}

const contactText = {
  fontSize: '14px',
  lineHeight: '1.4',
  color: '#484848',
  margin: '8px 0',
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '30px 0',
}

const buttonSection = {
  textAlign: 'center' as const,
  margin: '30px 0',
}

const button = {
  backgroundColor: '#28a745',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
  margin: '0 auto',
}

const footerNote = {
  fontSize: '13px',
  lineHeight: '1.4',
  color: '#6c757d',
  fontStyle: 'italic',
  textAlign: 'center' as const,
  margin: '30px 0',
}

export default BookingConfirmedEmail