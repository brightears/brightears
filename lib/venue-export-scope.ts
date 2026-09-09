/**
 * Narrow a requested PDF export within the venues already authorized by the
 * authenticated user's corporate/admin database query. Never look up an
 * arbitrary requested venue separately or fall back to all venues on failure.
 */
export function selectVenuesForExport<T extends { id: string }>(
  authorizedVenues: readonly T[],
  requestedVenueId: string | null,
): T[] | null {
  if (requestedVenueId === null) return [...authorizedVenues]
  const venue = authorizedVenues.find(item => item.id === requestedVenueId)
  return venue ? [venue] : null
}
