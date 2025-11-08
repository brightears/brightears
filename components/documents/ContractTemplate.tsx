/**
 * Contract PDF Template
 * Legal service agreement for Bright Ears bookings
 * Bilingual (EN/TH) with comprehensive terms & conditions
 */

import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer'

const COLORS = {
  brandCyan: '#00bbe4',
  deepTeal: '#2f6364',
  darkGray: '#333333',
  lightGray: '#f7f7f7',
  white: '#ffffff',
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    backgroundColor: COLORS.white,
  },
  header: {
    textAlign: 'center',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.brandCyan,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.deepTeal,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.darkGray,
    marginBottom: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.deepTeal,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 10,
    color: COLORS.darkGray,
    lineHeight: 1.5,
    marginBottom: 8,
    textAlign: 'justify',
  },
  clause: {
    fontSize: 10,
    color: COLORS.darkGray,
    lineHeight: 1.5,
    marginBottom: 6,
    marginLeft: 15,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    width: 150,
  },
  detailValue: {
    fontSize: 10,
    flex: 1,
  },
  signatureSection: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureBox: {
    width: '45%',
  },
  signatureLabel: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 40,
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: COLORS.darkGray,
    paddingTop: 5,
    fontSize: 9,
    textAlign: 'center',
  },
})

export interface ContractData {
  contractNumber: string
  contractDate: string
  locale: 'en' | 'th'
  // Provider (Bright Ears)
  providerName: string
  providerNameTh?: string
  providerAddress: string
  providerTaxId: string
  // Customer
  customerName: string
  customerCompany?: string
  customerAddress?: string
  customerPhone: string
  // Event details
  eventType: string
  eventDate: string
  eventTime: string
  venue: string
  venueAddress: string
  duration: number
  // Artist
  artistName: string
  artistCategory: string
  // Financial
  totalAmount: number
  depositAmount: number
  depositPercentage: number
  balanceDueDate: string
  // Services
  servicesProvided: string[]
  servicesProvidedTh?: string[]
}

const ContractTemplate: React.FC<{ data: ContractData }> = ({ data }) => {
  const isThai = data.locale === 'th'

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {isThai ? 'สัญญาจ้างบริการ' : 'SERVICE AGREEMENT'}
          </Text>
          <Text style={styles.subtitle}>
            {isThai ? 'เลขที่สัญญา: ' : 'Contract No.: '}
            {data.contractNumber}
          </Text>
          <Text style={styles.subtitle}>
            {isThai ? 'วันที่: ' : 'Date: '}
            {data.contractDate}
          </Text>
        </View>

        {/* Parties */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isThai ? '1. คู่สัญญา' : '1. PARTIES'}
          </Text>
          <Text style={styles.paragraph}>
            {isThai
              ? 'สัญญาฉบับนี้ทำขึ้นระหว่าง:'
              : 'This Agreement is made between:'}
          </Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              {isThai ? 'ผู้ให้บริการ:' : 'Service Provider:'}
            </Text>
            <Text style={styles.detailValue}>
              {isThai && data.providerNameTh ? data.providerNameTh : data.providerName}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              {isThai ? 'ที่อยู่:' : 'Address:'}
            </Text>
            <Text style={styles.detailValue}>{data.providerAddress}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              {isThai ? 'เลขประจำตัวผู้เสียภาษี:' : 'Tax ID:'}
            </Text>
            <Text style={styles.detailValue}>{data.providerTaxId}</Text>
          </View>

          <Text style={[styles.paragraph, { marginTop: 15 }]}>
            {isThai ? 'และ' : 'AND'}
          </Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              {isThai ? 'ผู้รับบริการ:' : 'Client:'}
            </Text>
            <Text style={styles.detailValue}>
              {data.customerCompany || data.customerName}
            </Text>
          </View>
          {data.customerAddress && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>
                {isThai ? 'ที่อยู่:' : 'Address:'}
              </Text>
              <Text style={styles.detailValue}>{data.customerAddress}</Text>
            </View>
          )}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              {isThai ? 'โทรศัพท์:' : 'Phone:'}
            </Text>
            <Text style={styles.detailValue}>{data.customerPhone}</Text>
          </View>
        </View>

        {/* Event Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isThai ? '2. รายละเอียดงาน' : '2. EVENT DETAILS'}
          </Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              {isThai ? 'ประเภทงาน:' : 'Event Type:'}
            </Text>
            <Text style={styles.detailValue}>{data.eventType}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              {isThai ? 'วันที่:' : 'Date:'}
            </Text>
            <Text style={styles.detailValue}>{data.eventDate}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              {isThai ? 'เวลา:' : 'Time:'}
            </Text>
            <Text style={styles.detailValue}>{data.eventTime}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              {isThai ? 'ระยะเวลา:' : 'Duration:'}
            </Text>
            <Text style={styles.detailValue}>
              {data.duration} {isThai ? 'ชั่วโมง' : 'hours'}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              {isThai ? 'สถานที่:' : 'Venue:'}
            </Text>
            <Text style={styles.detailValue}>{data.venue}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              {isThai ? 'ที่อยู่:' : 'Address:'}
            </Text>
            <Text style={styles.detailValue}>{data.venueAddress}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              {isThai ? 'ศิลปิน:' : 'Artist:'}
            </Text>
            <Text style={styles.detailValue}>
              {data.artistName} ({data.artistCategory})
            </Text>
          </View>
        </View>

        {/* Services Provided */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isThai ? '3. บริการที่ให้' : '3. SERVICES PROVIDED'}
          </Text>
          {(isThai && data.servicesProvidedTh
            ? data.servicesProvidedTh
            : data.servicesProvided
          ).map((service, index) => (
            <Text key={index} style={styles.clause}>
              {index + 1}. {service}
            </Text>
          ))}
        </View>

        {/* Payment Terms */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isThai ? '4. เงื่อนไขการชำระเงิน' : '4. PAYMENT TERMS'}
          </Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              {isThai ? 'จำนวนเงินรวม:' : 'Total Amount:'}
            </Text>
            <Text style={styles.detailValue}>
              ฿{data.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              {isThai ? 'เงินมัดจำ:' : 'Deposit:'}
            </Text>
            <Text style={styles.detailValue}>
              ฿{data.depositAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} (
              {data.depositPercentage}%)
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              {isThai ? 'ยอดคงเหลือครบกำหนด:' : 'Balance Due:'}
            </Text>
            <Text style={styles.detailValue}>{data.balanceDueDate}</Text>
          </View>
        </View>

        {/* Cancellation Policy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isThai ? '5. นโยบายการยกเลิก' : '5. CANCELLATION POLICY'}
          </Text>
          <Text style={styles.clause}>
            {isThai
              ? '• การยกเลิกมากกว่า 30 วัน: คืนเงิน 90% (หัก 10% ค่าธรรมเนียม)'
              : '• Cancellation more than 30 days: 90% refund (10% admin fee)'}
          </Text>
          <Text style={styles.clause}>
            {isThai
              ? '• การยกเลิก 15-30 วัน: คืนเงิน 50%'
              : '• Cancellation 15-30 days: 50% refund'}
          </Text>
          <Text style={styles.clause}>
            {isThai
              ? '• การยกเลิกน้อยกว่า 15 วัน: ไม่คืนเงิน'
              : '• Cancellation less than 15 days: No refund'}
          </Text>
        </View>

        {/* Artist Responsibilities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isThai ? '6. ความรับผิดชอบของศิลปิน' : '6. ARTIST RESPONSIBILITIES'}
          </Text>
          <Text style={styles.clause}>
            {isThai
              ? '• มาถึงสถานที่ตรงเวลาตามที่กำหนด'
              : '• Arrive at venue on time as scheduled'}
          </Text>
          <Text style={styles.clause}>
            {isThai
              ? '• แสดงตลอดระยะเวลาที่ตกลง'
              : '• Perform for the agreed duration'}
          </Text>
          <Text style={styles.clause}>
            {isThai
              ? '• จัดเตรียมอุปกรณ์ตามที่ตกลง'
              : '• Provide agreed equipment'}
          </Text>
          <Text style={styles.clause}>
            {isThai
              ? '• ปฏิบัติตามความต้องการพิเศษที่ตกลง'
              : '• Comply with agreed special requirements'}
          </Text>
        </View>

        {/* Client Responsibilities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isThai ? '7. ความรับผิดชอบของลูกค้า' : '7. CLIENT RESPONSIBILITIES'}
          </Text>
          <Text style={styles.clause}>
            {isThai
              ? '• ให้การเข้าถึงสถานที่ตามเวลาที่กำหนด'
              : '• Provide venue access at scheduled time'}
          </Text>
          <Text style={styles.clause}>
            {isThai
              ? '• จัดเตรียมไฟฟ้าและสิ่งอำนวยความสะดวกพื้นฐาน'
              : '• Ensure power supply and basic facilities'}
          </Text>
          <Text style={styles.clause}>
            {isThai
              ? '• ชำระเงินตามกำหนด'
              : '• Make payments on schedule'}
          </Text>
          <Text style={styles.clause}>
            {isThai
              ? '• แจ้งการเปลี่ยนแปลงล่วงหน้า'
              : '• Notify changes in advance'}
          </Text>
        </View>

        {/* Force Majeure */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isThai ? '8. เหตุสุดวิสัย' : '8. FORCE MAJEURE'}
          </Text>
          <Text style={styles.paragraph}>
            {isThai
              ? 'ในกรณีเหตุสุดวิสัย เช่น สภาพอากาศเลวร้าย ข้อจำกัดของรัฐบาล หรือเหตุการณ์ที่ไม่อาจควบคุมได้ อาจมีการเลื่อนงานโดยไม่มีค่าปรับ'
              : 'In case of force majeure events (weather, government restrictions, uncontrollable circumstances), rescheduling may occur without penalty.'}
          </Text>
        </View>

        {/* Signatures */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>
              {isThai ? 'ผู้ให้บริการ' : 'Service Provider'}
            </Text>
            <View style={styles.signatureLine}>
              <Text>_______________________</Text>
              <Text style={{ marginTop: 5 }}>
                {isThai && data.providerNameTh ? data.providerNameTh : data.providerName}
              </Text>
              <Text style={{ marginTop: 5 }}>
                {isThai ? 'วันที่: __________' : 'Date: __________'}
              </Text>
            </View>
          </View>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>
              {isThai ? 'ผู้รับบริการ' : 'Client'}
            </Text>
            <View style={styles.signatureLine}>
              <Text>_______________________</Text>
              <Text style={{ marginTop: 5 }}>
                {data.customerCompany || data.customerName}
              </Text>
              <Text style={{ marginTop: 5 }}>
                {isThai ? 'วันที่: __________' : 'Date: __________'}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default ContractTemplate
