import { createHash } from 'node:crypto'

// Reviewed source text that contains an unlabelled staffing instruction. Match the
// text, not the artist: a subsequently corrected public biography passes through.
const internalBioHashes = new Set([
  '6079dc33a68f7984843d7e49f51f52896712266c801dff54fac8850790151525',
])

// Only explicit internal-note labels start a private block. Ordinary descriptions
// of residencies, venues, availability or genres are legitimate public content.
const internalNoteMarker = /(?:^|\n)[ \t]*(?:\[(?:internal(?:[ _-]notes?)?|staffing[ _-]notes?|scheduling[ _-]notes?)\]|(?:internal|staffing|scheduling|operations?)\s+notes?\s*:|for internal use only\s*:|หมายเหตุภายใน\s*:)/i

export function sanitizePublicArtistBio(bio: string | null | undefined): string | null {
  if (bio == null) return null
  const normalized = bio.normalize('NFC').replace(/\s+/g, ' ').trim()
  const hash = createHash('sha256').update(normalized).digest('hex')
  if (internalBioHashes.has(hash)) return ''

  const marker = internalNoteMarker.exec(bio)
  return marker ? bio.slice(0, marker.index).trimEnd() : bio
}
