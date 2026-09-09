import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { selectVenuesForExport } from '../venue-export-scope'

const ownedVenues = [{ id: 'venue-a', name: 'First venue' }, { id: 'venue-b', name: 'Second venue' }]

test('an omitted filter exports only the already authorized corporate venues', () => {
  const result = selectVenuesForExport(ownedVenues, null)
  assert.deepEqual(result, ownedVenues)
  assert.notEqual(result, ownedVenues)
})

test('an owned filter selects exactly one venue without changing the ownership list', () => {
  assert.deepEqual(selectVenuesForExport(ownedVenues, 'venue-b'), [ownedVenues[1]])
  assert.equal(ownedVenues.length, 2)
})

test('unknown, foreign and empty IDs fail closed instead of exporting every venue', () => {
  for (const id of ['foreign-venue', 'deleted-venue', '', 'all', 'venue-a,venue-b']) {
    assert.equal(selectVenuesForExport(ownedVenues, id), null)
  }
})

test('an empty authorized set cannot select any requested venue', () => {
  assert.deepEqual(selectVenuesForExport([], null), [])
  assert.equal(selectVenuesForExport([], 'venue-a'), null)
})

test('admin export uses its wider authorized set without a special filter bypass', () => {
  const adminVenues = [...ownedVenues, { id: 'another-corporate-venue', name: 'Other venue' }]
  assert.deepEqual(selectVenuesForExport(adminVenues, 'another-corporate-venue'), [adminVenues[2]])
  assert.equal(selectVenuesForExport(ownedVenues, 'another-corporate-venue'), null)
})
