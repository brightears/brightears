/**
 * Test Script: Simplified Artists Filter API
 *
 * Tests the updated /api/artists endpoint with new simplified parameters.
 * Run this script to verify the filter simplification works correctly.
 *
 * Usage:
 *   npx ts-node scripts/test-simplified-filters.ts
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

interface TestCase {
  name: string
  url: string
  expectedFilters: any
  description: string
}

const testCases: TestCase[] = [
  {
    name: 'Test 1: All Artists (No Filters)',
    url: '/api/artists',
    expectedFilters: {
      verifiedOnly: false,
      sort: 'featured'
    },
    description: 'Should return all artists with default sorting'
  },
  {
    name: 'Test 2: Verified Only',
    url: '/api/artists?verifiedOnly=true',
    expectedFilters: {
      verifiedOnly: true,
      sort: 'featured'
    },
    description: 'Should return only VERIFIED and TRUSTED artists'
  },
  {
    name: 'Test 3: Category + Location',
    url: '/api/artists?categories=DJ,BAND&city=bangkok',
    expectedFilters: {
      categories: ['DJ', 'BAND'],
      city: 'bangkok',
      verifiedOnly: false,
      sort: 'featured'
    },
    description: 'Should return DJs and Bands in Bangkok (all verification levels)'
  },
  {
    name: 'Test 4: Category + Verified Only',
    url: '/api/artists?categories=MAGICIAN&verifiedOnly=true',
    expectedFilters: {
      categories: ['MAGICIAN'],
      verifiedOnly: true,
      sort: 'featured'
    },
    description: 'Should return only verified magicians'
  },
  {
    name: 'Test 5: Location + Verified Only',
    url: '/api/artists?city=phuket&verifiedOnly=true',
    expectedFilters: {
      city: 'phuket',
      verifiedOnly: true,
      sort: 'featured'
    },
    description: 'Should return only verified artists in Phuket'
  },
  {
    name: 'Test 6: Search + Filters',
    url: '/api/artists?search=jazz&categories=DJ&verifiedOnly=true',
    expectedFilters: {
      search: 'jazz',
      categories: ['DJ'],
      verifiedOnly: true,
      sort: 'featured'
    },
    description: 'Should return verified DJs matching "jazz" search'
  },
  {
    name: 'Test 7: Old Parameters (Should Be Ignored)',
    url: '/api/artists?minPrice=5000&maxPrice=15000&genres=Jazz,Rock&languages=en,th&availability=true',
    expectedFilters: {
      verifiedOnly: false,
      sort: 'featured'
    },
    description: 'Should ignore old parameters and return all artists'
  },
  {
    name: 'Test 8: Sort by Rating',
    url: '/api/artists?sort=rating&verifiedOnly=true',
    expectedFilters: {
      verifiedOnly: true,
      sort: 'rating'
    },
    description: 'Should return verified artists sorted by rating'
  },
  {
    name: 'Test 9: Pagination',
    url: '/api/artists?page=2&limit=10',
    expectedFilters: {
      verifiedOnly: false,
      sort: 'featured'
    },
    description: 'Should return page 2 with 10 results per page'
  }
]

interface ApiResponse {
  artists: any[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
  filters: any
  cached?: boolean
}

async function runTest(testCase: TestCase): Promise<boolean> {
  try {
    console.log(`\n${'='.repeat(80)}`)
    console.log(`Running: ${testCase.name}`)
    console.log(`Description: ${testCase.description}`)
    console.log(`URL: ${testCase.url}`)
    console.log(`${'='.repeat(80)}`)

    const response = await fetch(`${API_BASE_URL}${testCase.url}`)

    if (!response.ok) {
      console.error(`❌ FAILED: HTTP ${response.status} ${response.statusText}`)
      const errorText = await response.text()
      console.error(`Error: ${errorText}`)
      return false
    }

    const data: ApiResponse = await response.json()

    // Validate response structure
    if (!data.artists || !Array.isArray(data.artists)) {
      console.error('❌ FAILED: Missing or invalid "artists" array')
      return false
    }

    if (!data.pagination) {
      console.error('❌ FAILED: Missing "pagination" object')
      return false
    }

    if (!data.filters) {
      console.error('❌ FAILED: Missing "filters" object')
      return false
    }

    // Validate filters match expected
    const filtersMatch = Object.keys(testCase.expectedFilters).every(key => {
      const expected = testCase.expectedFilters[key]
      const actual = data.filters[key]

      if (Array.isArray(expected)) {
        return JSON.stringify(expected.sort()) === JSON.stringify((actual || []).sort())
      }

      return expected === actual
    })

    if (!filtersMatch) {
      console.error('❌ FAILED: Filters do not match expected values')
      console.error('Expected:', JSON.stringify(testCase.expectedFilters, null, 2))
      console.error('Actual:', JSON.stringify(data.filters, null, 2))
      return false
    }

    // Additional validation for verifiedOnly
    if (testCase.expectedFilters.verifiedOnly === true) {
      const allVerified = data.artists.every(artist =>
        artist.verificationLevel === 'VERIFIED' ||
        artist.verificationLevel === 'TRUSTED'
      )

      if (!allVerified) {
        console.error('❌ FAILED: Some artists are not VERIFIED or TRUSTED')
        return false
      }
    }

    // Print results
    console.log(`\n✅ PASSED`)
    console.log(`\nResults:`)
    console.log(`  - Total Artists: ${data.pagination.total}`)
    console.log(`  - Returned: ${data.artists.length}`)
    console.log(`  - Page: ${data.pagination.page}/${data.pagination.totalPages}`)
    console.log(`  - Cached: ${data.cached || false}`)
    console.log(`\nFilters Applied:`)
    console.log(JSON.stringify(data.filters, null, 2))

    if (data.artists.length > 0) {
      console.log(`\nSample Artist:`)
      const sample = data.artists[0]
      console.log(`  - Stage Name: ${sample.stageName}`)
      console.log(`  - Category: ${sample.category}`)
      console.log(`  - City: ${sample.baseCity}`)
      console.log(`  - Verification: ${sample.verificationLevel}`)
      console.log(`  - Rating: ${sample.averageRating}/5 (${sample.reviewCount} reviews)`)
      console.log(`  - Completed Bookings: ${sample.completedBookings}`)
    }

    return true

  } catch (error) {
    console.error(`❌ FAILED: ${error}`)
    return false
  }
}

async function runAllTests() {
  console.log('\n')
  console.log('╔═══════════════════════════════════════════════════════════════════════════════╗')
  console.log('║                    SIMPLIFIED FILTERS API TEST SUITE                          ║')
  console.log('║                                                                               ║')
  console.log('║  Testing the updated /api/artists endpoint with simplified parameters        ║')
  console.log('╚═══════════════════════════════════════════════════════════════════════════════╝')
  console.log('\n')

  const results: { name: string; passed: boolean }[] = []

  for (const testCase of testCases) {
    const passed = await runTest(testCase)
    results.push({ name: testCase.name, passed })

    // Wait 500ms between tests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  // Print summary
  console.log('\n\n')
  console.log('╔═══════════════════════════════════════════════════════════════════════════════╗')
  console.log('║                              TEST RESULTS SUMMARY                             ║')
  console.log('╚═══════════════════════════════════════════════════════════════════════════════╝')
  console.log('\n')

  results.forEach((result, index) => {
    const status = result.passed ? '✅ PASSED' : '❌ FAILED'
    console.log(`  ${index + 1}. ${status} - ${result.name}`)
  })

  const passedCount = results.filter(r => r.passed).length
  const totalCount = results.length
  const passRate = ((passedCount / totalCount) * 100).toFixed(1)

  console.log('\n')
  console.log(`  Total Tests: ${totalCount}`)
  console.log(`  Passed: ${passedCount}`)
  console.log(`  Failed: ${totalCount - passedCount}`)
  console.log(`  Pass Rate: ${passRate}%`)
  console.log('\n')

  if (passedCount === totalCount) {
    console.log('╔═══════════════════════════════════════════════════════════════════════════════╗')
    console.log('║                         🎉 ALL TESTS PASSED! 🎉                              ║')
    console.log('║                                                                               ║')
    console.log('║  The simplified filters API is working correctly and ready for deployment.   ║')
    console.log('╚═══════════════════════════════════════════════════════════════════════════════╝')
    console.log('\n')
    process.exit(0)
  } else {
    console.log('╔═══════════════════════════════════════════════════════════════════════════════╗')
    console.log('║                         ⚠️  SOME TESTS FAILED  ⚠️                            ║')
    console.log('║                                                                               ║')
    console.log('║  Please review the failed tests and fix the issues before deploying.         ║')
    console.log('╚═══════════════════════════════════════════════════════════════════════════════╝')
    console.log('\n')
    process.exit(1)
  }
}

// Run tests
runAllTests().catch(error => {
  console.error('Fatal error running tests:', error)
  process.exit(1)
})
