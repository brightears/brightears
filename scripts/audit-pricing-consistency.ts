/**
 * Pricing Consistency Audit Script
 *
 * This script audits all artist pricing data to identify and optionally fix inconsistencies
 * Run with: npx tsx scripts/audit-pricing-consistency.ts
 */

import { prisma } from '../lib/prisma'
import { validatePricingConsistency, suggestPricingCorrection } from '../lib/validation/pricing'

interface PricingIssue {
  artistId: string
  stageName: string
  issue: string
  currentValue: any
  suggestedValue?: any
}

async function auditPricingConsistency() {
  console.log('🔍 Starting Pricing Consistency Audit...\n')

  const artists = await prisma.artist.findMany({
    select: {
      id: true,
      stageName: true,
      hourlyRate: true,
      minimumHours: true,
      weekendPricing: true,
      holidayPricing: true,
      category: true,
      baseCity: true,
      completedBookings: true
    },
    orderBy: { stageName: 'asc' }
  })

  const issues: PricingIssue[] = []
  const stats = {
    total: artists.length,
    withPricing: 0,
    withoutPricing: 0,
    withIssues: 0,
    suspicious: 0
  }

  console.log(`Found ${artists.length} artists to audit\n`)
  console.log('='.repeat(80))

  for (const artist of artists) {
    const hourlyRate = artist.hourlyRate ? Number(artist.hourlyRate) : null

    // Check if pricing exists
    if (!hourlyRate || hourlyRate <= 0) {
      stats.withoutPricing++
      issues.push({
        artistId: artist.id,
        stageName: artist.stageName,
        issue: 'No hourly rate set',
        currentValue: hourlyRate
      })
      console.log(`❌ ${artist.stageName}: No pricing set`)
      continue
    }

    stats.withPricing++

    // Check for suspicious values
    const suspiciousPatterns = [
      { test: hourlyRate < 500, issue: 'Hourly rate below minimum (฿500)' },
      { test: hourlyRate > 50000, issue: 'Unusually high rate (>฿50,000/hour)' },
      { test: hourlyRate === 2500, issue: 'Using default placeholder rate' },
      { test: hourlyRate % 1000 !== 0 && hourlyRate > 10000, issue: 'Unusual pricing digits for high rate' }
    ]

    for (const pattern of suspiciousPatterns) {
      if (pattern.test) {
        stats.suspicious++
        const suggestion = suggestPricingCorrection(hourlyRate)
        issues.push({
          artistId: artist.id,
          stageName: artist.stageName,
          issue: pattern.issue,
          currentValue: hourlyRate,
          suggestedValue: suggestion
        })
        console.log(`⚠️  ${artist.stageName}: ${pattern.issue} (฿${hourlyRate})`)
        if (suggestion) {
          console.log(`    💡 Suggestion: ฿${suggestion}`)
        }
      }
    }

    // Check minimum hours validity
    if (artist.minimumHours) {
      const minHours = Number(artist.minimumHours)
      if (minHours < 1 || minHours > 24) {
        issues.push({
          artistId: artist.id,
          stageName: artist.stageName,
          issue: 'Invalid minimum hours',
          currentValue: minHours,
          suggestedValue: minHours < 1 ? 1 : 3
        })
        console.log(`⚠️  ${artist.stageName}: Invalid minimum hours (${minHours})`)
      }
    }

    // Validate weekend/holiday pricing if they exist
    const weekendRate = artist.weekendPricing ? Number(artist.weekendPricing) : undefined
    const holidayRate = artist.holidayPricing ? Number(artist.holidayPricing) : undefined

    const consistency = validatePricingConsistency({
      hourlyRate,
      weekendRate,
      holidayRate
    })

    if (consistency.warnings.length > 0) {
      stats.withIssues++
      consistency.warnings.forEach(warning => {
        issues.push({
          artistId: artist.id,
          stageName: artist.stageName,
          issue: warning,
          currentValue: { hourlyRate, weekendRate, holidayRate }
        })
        console.log(`⚠️  ${artist.stageName}: ${warning}`)
      })
    }
  }

  console.log('\n' + '='.repeat(80))
  console.log('\n📊 AUDIT SUMMARY\n')
  console.log(`Total Artists: ${stats.total}`)
  console.log(`With Pricing: ${stats.withPricing} (${((stats.withPricing / stats.total) * 100).toFixed(1)}%)`)
  console.log(`Without Pricing: ${stats.withoutPricing} (${((stats.withoutPricing / stats.total) * 100).toFixed(1)}%)`)
  console.log(`With Issues: ${stats.withIssues}`)
  console.log(`Suspicious Values: ${stats.suspicious}`)

  if (issues.length > 0) {
    console.log('\n📋 DETAILED ISSUES\n')
    console.log('='.repeat(80))

    // Group issues by type
    const issuesByType = issues.reduce((acc, issue) => {
      if (!acc[issue.issue]) acc[issue.issue] = []
      acc[issue.issue].push(issue)
      return acc
    }, {} as Record<string, PricingIssue[]>)

    for (const [issueType, artistIssues] of Object.entries(issuesByType)) {
      console.log(`\n${issueType} (${artistIssues.length} artists):`)
      artistIssues.forEach(issue => {
        console.log(`  - ${issue.stageName}: ฿${issue.currentValue}${issue.suggestedValue ? ` → ฿${issue.suggestedValue}` : ''}`)
      })
    }

    // Check specific case: Temple Bass
    const templeBass = artists.find(a => a.stageName === 'Temple Bass')
    if (templeBass) {
      console.log('\n🔍 SPECIAL CASE: Temple Bass')
      console.log('='.repeat(40))
      console.log(`Stage Name: ${templeBass.stageName}`)
      console.log(`Hourly Rate: ฿${templeBass.hourlyRate}`)
      console.log(`Minimum Hours: ${templeBass.minimumHours || 'Not set'}`)
      console.log(`Category: ${templeBass.category}`)
      console.log(`Location: ${templeBass.baseCity}`)
      console.log(`Completed Bookings: ${templeBass.completedBookings}`)

      // Check if it's reasonable for a magician
      const rate = Number(templeBass.hourlyRate)
      if (rate > 10000) {
        console.log('\n⚠️  Note: ฿12,000/hour is high for a magician.')
        console.log('    Typical magician rates: ฿3,000-8,000/hour')
        console.log('    This could be a premium/corporate rate or data entry error.')
      }
    }

    console.log('\n' + '='.repeat(80))
    console.log('\n🔧 RECOMMENDATIONS\n')
    console.log('1. Review all artists with "No hourly rate set"')
    console.log('2. Verify unusually high rates are intentional (not data entry errors)')
    console.log('3. Update artists using default placeholder rate (฿2,500)')
    console.log('4. Consider implementing rate ranges for different event types')
    console.log('5. Add validation rules to prevent future inconsistencies')
  } else {
    console.log('\n✅ No pricing issues found!')
  }

  await prisma.$disconnect()
}

// Run the audit
auditPricingConsistency().catch(console.error)