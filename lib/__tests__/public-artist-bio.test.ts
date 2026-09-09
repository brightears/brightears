import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { sanitizePublicArtistBio } from '../public-artist-bio'
import { serializePublicArtist } from '../public-artists'

test('a corrected biography passes through instead of being permanently blocked by artist identity', () => {
  const corrected = 'House, Afro House and Tech House DJ based in Bangkok.'
  assert.equal(sanitizePublicArtistBio(corrected), corrected)
})

test('keeps public paragraphs and removes explicitly labelled internal blocks', () => {
  for (const marker of ['Internal notes:', '[INTERNAL]', 'Staffing notes:', 'Scheduling note:', 'For internal use only:', 'หมายเหตุภายใน:']) {
    const input = `Professional DJ performing house and disco.\n\n${marker}\nPRIVATE_STAFFING_INFORMATION`
    assert.equal(sanitizePublicArtistBio(input), 'Professional DJ performing house and disco.')
    assert.equal(sanitizePublicArtistBio(`${marker}\nPRIVATE_STAFFING_INFORMATION`), '')
  }
})

test('preserves legitimate venue, residency and availability descriptions', () => {
  const biography = 'A resident DJ at Bangkok venues, available for events. His rotation of house and soul replaces silence with energy.'
  assert.equal(sanitizePublicArtistBio(biography), biography)
  assert.equal(sanitizePublicArtistBio(null), null)
  assert.equal(sanitizePublicArtistBio(''), '')
})

test('the public API serializer applies the biography boundary to both languages', () => {
  const row = {
    bio: 'Public English biography.\nInternal notes:\nPRIVATE_STAFFING_INFORMATION',
    bioTh: 'หมายเหตุภายใน:\nPRIVATE_STAFFING_INFORMATION',
    startingRate: null,
  }
  const output = serializePublicArtist(row as Parameters<typeof serializePublicArtist>[0])
  assert.equal(output.bio, 'Public English biography.')
  assert.equal(output.bioTh, '')
  assert.equal(JSON.stringify(output).includes('PRIVATE_STAFFING_INFORMATION'), false)
})
