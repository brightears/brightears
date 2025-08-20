import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Img,
  Text,
  Button,
  Hr,
  Link,
  Preview,
} from '@react-email/components'
import * as React from 'react'

interface BaseEmailTemplateProps {
  preview: string
  children: React.ReactNode
  locale?: 'en' | 'th'
  footerText?: {
    en: string
    th: string
  }
}

export const BaseEmailTemplate: React.FC<BaseEmailTemplateProps> = ({
  preview,
  children,
  locale = 'en',
  footerText,
}) => {
  const isThaiLanguage = locale === 'th'

  const defaultFooterText = {
    en: 'This email was sent by Bright Ears, Thailand\'s premier entertainment booking platform.',
    th: 'อีเมลนี้ส่งโดย Bright Ears แพลตฟอร์มการจองความบันเทิงชั้นนำของประเทศไทย'
  }

  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src="https://brightears.com/logo.png" // Update with actual logo URL
              width="120"
              height="40"
              alt="Bright Ears"
              style={logo}
            />
          </Section>

          {/* Main content */}
          <Section style={content}>
            {children}
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              {footerText ? footerText[locale] : defaultFooterText[locale]}
            </Text>
            
            <Text style={footerLinks}>
              <Link href="https://brightears.com" style={link}>
                {isThaiLanguage ? 'เว็บไซต์' : 'Website'}
              </Link>
              {' | '}
              <Link href="https://brightears.com/support" style={link}>
                {isThaiLanguage ? 'ฝ่ายสนับสนุน' : 'Support'}
              </Link>
              {' | '}
              <Link href="https://brightears.com/privacy" style={link}>
                {isThaiLanguage ? 'นโยบายความเป็นส่วนตัว' : 'Privacy Policy'}
              </Link>
            </Text>

            <Text style={addressText}>
              Bright Ears Co., Ltd.<br />
              Bangkok, Thailand<br />
              {isThaiLanguage ? 'อีเมล: ' : 'Email: '}
              <Link href="mailto:support@brightears.com" style={link}>
                support@brightears.com
              </Link>
            </Text>

            <Text style={unsubscribeText}>
              {isThaiLanguage 
                ? 'หากไม่ต้องการรับอีเมลนี้ กรุณา '
                : 'If you no longer wish to receive these emails, please '
              }
              <Link href="https://brightears.com/unsubscribe" style={link}>
                {isThaiLanguage ? 'ยกเลิกการสมัครสมาชิก' : 'unsubscribe'}
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
}

const header = {
  padding: '20px 30px',
  textAlign: 'center' as const,
  backgroundColor: '#ffffff',
}

const logo = {
  margin: '0 auto',
}

const content = {
  padding: '0 30px',
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
}

const footer = {
  padding: '0 30px',
  textAlign: 'center' as const,
}

const footerText = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '16px 0',
}

const footerLinks = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '16px 0',
}

const addressText = {
  color: '#8898aa',
  fontSize: '11px',
  lineHeight: '15px',
  margin: '16px 0',
}

const unsubscribeText = {
  color: '#8898aa',
  fontSize: '10px',
  lineHeight: '14px',
  margin: '16px 0',
}

const link = {
  color: '#556cd6',
  textDecoration: 'underline',
}

export default BaseEmailTemplate