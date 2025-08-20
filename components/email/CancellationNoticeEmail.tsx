import { Text, Button, Section, Hr } from '@react-email/components'
import * as React from 'react'
import BaseEmailTemplate from './BaseEmailTemplate'

interface CancellationNoticeEmailProps {
  recipientName: string
  senderName: string
  senderRole: 'customer' | 'artist' | 'admin'
  bookingNumber: string
  eventType: string
  eventDate: string
  venue: string
  cancellationReason?: string
  refundAmount?: number
  currency?: string
  refundTimeline?: string
  cancellationPolicy?: string
  dashboardUrl: string
  supportUrl: string
  locale?: 'en' | 'th'
}

export const CancellationNoticeEmail: React.FC<CancellationNoticeEmailProps> = ({
  recipientName,
  senderName,
  senderRole,
  bookingNumber,
  eventType,
  eventDate,
  venue,
  cancellationReason,
  refundAmount,
  currency = 'THB',
  refundTimeline,
  cancellationPolicy,
  dashboardUrl,
  supportUrl,
  locale = 'en',
}) => {
  const isThaiLanguage = locale === 'th'

  const content = {
    en: {
      subject: `Booking Cancelled - ${eventType}`,
      greeting: `Dear ${recipientName},`,
      mainText: {
        customer: `We regret to inform you that your booking has been cancelled by ${senderName}.`,
        artist: `${senderName} has cancelled their booking with you.`,
        admin: `This booking has been cancelled by our admin team.`
      },
      bookingDetailsHeading: 'Cancelled Booking Details:',
      bookingNumberLabel: 'Booking Number:',
      eventTypeLabel: 'Event Type:',
      eventDateLabel: 'Original Event Date:',
      venueLabel: 'Venue:',
      cancelledByLabel: 'Cancelled By:',
      reasonHeading: 'Cancellation Reason:',
      refundHeading: 'Refund Information:',
      refundAmountLabel: 'Refund Amount:',
      refundTimelineLabel: 'Expected Processing Time:',
      noCancellationReasonText: 'No specific reason provided.',
      noRefundText: 'No refund applicable for this cancellation.',
      policyHeading: 'Cancellation Policy:',
      nextStepsHeading: 'What\'s Next?',
      nextStepsText: {
        customer: 'If you have any questions about this cancellation or need assistance finding a replacement artist, please don\'t hesitate to contact our support team.',
        artist: 'Please respond to any questions the customer may have. If this was due to an emergency, consider offering to reschedule when possible.',
        admin: 'This cancellation was processed by our admin team. If you have any questions, please contact support.'
      },
      supportText: 'Our support team is here to help with any questions or concerns.',
      buttonText: 'View Booking Details',
      supportButtonText: 'Contact Support',
      footerText: 'We apologize for any inconvenience caused and appreciate your understanding.',
    },
    th: {
      subject: `ยกเลิกการจอง - ${eventType}`,
      greeting: `เรียน คุณ${recipientName}`,
      mainText: {
        customer: `เราขออภัยที่ต้องแจ้งให้ทราบว่าการจองของคุณถูกยกเลิกโดย ${senderName}`,
        artist: `${senderName} ได้ยกเลิกการจองกับคุณ`,
        admin: `การจองนี้ถูกยกเลิกโดยทีมผู้ดูแลระบบของเรา`
      },
      bookingDetailsHeading: 'รายละเอียดการจองที่ถูกยกเลิก:',
      bookingNumberLabel: 'หมายเลขการจอง:',
      eventTypeLabel: 'ประเภทงาน:',
      eventDateLabel: 'วันที่งานเดิม:',
      venueLabel: 'สถานที่:',
      cancelledByLabel: 'ยกเลิกโดย:',
      reasonHeading: 'เหตุผลการยกเลิก:',
      refundHeading: 'ข้อมูลการคืนเงิน:',
      refundAmountLabel: 'จำนวนเงินที่คืน:',
      refundTimelineLabel: 'ระยะเวลาการดำเนินการ:',
      noCancellationReasonText: 'ไม่ได้ระบุเหตุผลเฉพาะ',
      noRefundText: 'ไม่มีการคืนเงินสำหรับการยกเลิกนี้',
      policyHeading: 'นโยบายการยกเลิก:',
      nextStepsHeading: 'ขั้นตอนต่อไป?',
      nextStepsText: {
        customer: 'หากคุณมีคำถามเกี่ยวกับการยกเลิกนี้หรือต้องการความช่วยเหลือในการหาศิลปินทดแทน กรุณาติดต่อทีมสนับสนุนของเรา',
        artist: 'กรุณาตอบคำถามใดๆ ที่ลูกค้าอาจมี หากเป็นเหตุฉุกเฉิน ควรพิจารณาเสนอการเลื่อนนัดใหม่เมื่อเป็นไปได้',
        admin: 'การยกเลิกนี้ดำเนินการโดยทีมผู้ดูแลระบบ หากมีคำถามกรุณาติดต่อฝ่ายสนับสนุน'
      },
      supportText: 'ทีมสนับสนุนของเราพร้อมช่วยเหลือคำถามหรือข้อกังวลใดๆ',
      buttonText: 'ดูรายละเอียดการจอง',
      supportButtonText: 'ติดต่อฝ่ายสนับสนุน',
      footerText: 'เราขออภัยในความไม่สะดวกที่เกิดขึ้นและขอบคุณสำหรับความเข้าใจ',
    }
  }

  const t = content[locale]
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat(locale === 'th' ? 'th-TH' : 'en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  const getSenderRoleText = () => {
    const roles = {
      en: {
        customer: 'Customer',
        artist: 'Artist',
        admin: 'Admin Team'
      },
      th: {
        customer: 'ลูกค้า',
        artist: 'ศิลปิน',
        admin: 'ทีมผู้ดูแลระบบ'
      }
    }
    return roles[locale][senderRole]
  }

  return (
    <BaseEmailTemplate
      preview={t.subject}
      locale={locale}
    >
      <Text style={heading}>{t.greeting}</Text>
      
      <Text style={paragraph}>
        {t.mainText[senderRole]}
      </Text>

      {/* Booking Details Section */}
      <Section style={detailsSection}>
        <Text style={detailsHeading}>{t.bookingDetailsHeading}</Text>
        
        <Text style={detailItem}>
          <strong>{t.bookingNumberLabel}</strong> {bookingNumber}
        </Text>
        
        <Text style={detailItem}>
          <strong>{t.eventTypeLabel}</strong> {eventType}
        </Text>
        
        <Text style={detailItem}>
          <strong>{t.eventDateLabel}</strong> {eventDate}
        </Text>
        
        <Text style={detailItem}>
          <strong>{t.venueLabel}</strong> {venue}
        </Text>
        
        <Text style={detailItem}>
          <strong>{t.cancelledByLabel}</strong> {getSenderRoleText()} ({senderName})
        </Text>
      </Section>

      {/* Cancellation Reason */}
      <Section style={reasonSection}>
        <Text style={detailsHeading}>{t.reasonHeading}</Text>
        <Text style={reasonText}>
          {cancellationReason || t.noCancellationReasonText}
        </Text>
      </Section>

      {/* Refund Information */}
      {refundAmount ? (
        <Section style={refundSection}>
          <Text style={detailsHeading}>{t.refundHeading}</Text>
          
          <Text style={refundItem}>
            <strong>{t.refundAmountLabel}</strong> {formatPrice(refundAmount)}
          </Text>
          
          {refundTimeline && (
            <Text style={refundItem}>
              <strong>{t.refundTimelineLabel}</strong> {refundTimeline}
            </Text>
          )}
        </Section>
      ) : (
        <Section style={noRefundSection}>
          <Text style={detailsHeading}>{t.refundHeading}</Text>
          <Text style={noRefundText}>{t.noRefundText}</Text>
        </Section>
      )}

      {/* Cancellation Policy */}
      {cancellationPolicy && (
        <Section style={policySection}>
          <Text style={detailsHeading}>{t.policyHeading}</Text>
          <Text style={policyText}>{cancellationPolicy}</Text>
        </Section>
      )}

      <Hr style={hr} />

      {/* Next Steps */}
      <Section style={nextStepsSection}>
        <Text style={detailsHeading}>{t.nextStepsHeading}</Text>
        <Text style={paragraph}>{t.nextStepsText[senderRole]}</Text>
        <Text style={paragraph}>{t.supportText}</Text>
      </Section>

      <Section style={buttonSection}>
        <Button
          style={button}
          href={dashboardUrl}
        >
          {t.buttonText}
        </Button>
        
        <Button
          style={supportButton}
          href={supportUrl}
        >
          {t.supportButtonText}
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

const reasonSection = {
  backgroundColor: '#fff3cd',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
  border: '1px solid #ffeaa7',
}

const refundSection = {
  backgroundColor: '#e8f5e8',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
  border: '1px solid #28a745',
}

const noRefundSection = {
  backgroundColor: '#f8d7da',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
  border: '1px solid #dc3545',
}

const policySection = {
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

const reasonText = {
  fontSize: '14px',
  lineHeight: '1.4',
  color: '#484848',
  margin: '8px 0',
  fontStyle: 'italic',
}

const refundItem = {
  fontSize: '16px',
  lineHeight: '1.4',
  color: '#484848',
  margin: '10px 0',
}

const noRefundText = {
  fontSize: '14px',
  lineHeight: '1.4',
  color: '#721c24',
  margin: '8px 0',
  fontWeight: '500',
}

const policyText = {
  fontSize: '12px',
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
  backgroundColor: '#dc3545',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
  margin: '0 10px 10px 0',
}

const supportButton = {
  backgroundColor: '#6c757d',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
  margin: '0 0 10px 10px',
}

const footerNote = {
  fontSize: '13px',
  lineHeight: '1.4',
  color: '#6c757d',
  fontStyle: 'italic',
  textAlign: 'center' as const,
  margin: '30px 0',
}

export default CancellationNoticeEmail