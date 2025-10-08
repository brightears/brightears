import ProfileSkeleton from '@/components/ui/ProfileSkeleton'

/**
 * Artist Profile Loading State
 *
 * Displays comprehensive skeleton loader for artist profile page.
 * Uses the ProfileSkeleton component which matches the full profile layout
 * including hero, tabs, gallery, packages, and reviews sections.
 *
 * This prevents Cumulative Layout Shift (CLS) by matching exact dimensions
 * of the actual profile page components.
 */
export default function ArtistProfileLoading() {
  return (
    <ProfileSkeleton
      showHero
      showTabs
      contentSections={4}
      animationDelay={0}
    />
  )
}
