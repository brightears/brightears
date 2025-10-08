# Empty State Component - Usage Guide

## Overview

The `EmptyState` component provides a consistent, beautiful way to handle empty states throughout the Bright Ears platform. It features glass morphism design, animated icons, and multiple pre-configured variants.

## Basic Usage

```tsx
import EmptyState from '@/components/ui/EmptyState';

// Simple usage
<EmptyState
  variant="noBookings"
  title="You haven't booked any entertainment yet"
  description="Browse our talented artists and book your first performance to get started."
  actionLabel="Browse Artists"
  actionHref="/artists"
/>
```

## Pre-configured Variants

### 1. No Search Results
```tsx
import { EmptyStateVariants } from '@/components/ui/EmptyState';

<EmptyStateVariants.NoSearchResults
  onAction={() => clearFilters()}
/>
```

### 2. No Bookings
```tsx
<EmptyStateVariants.NoBookings />
```

### 3. No Reviews
```tsx
<EmptyStateVariants.NoReviews
  onAction={() => openReviewModal()}
/>
```

### 4. No Favorites
```tsx
<EmptyStateVariants.NoFavorites />
```

### 5. No Messages
```tsx
<EmptyStateVariants.NoMessages />
```

### 6. No Events
```tsx
<EmptyStateVariants.NoEvents />
```

### 7. No Artists Found
```tsx
<EmptyStateVariants.NoArtistsFound />
```

### 8. Generic Error
```tsx
<EmptyStateVariants.GenericError
  onAction={() => refetch()}
/>
```

## Custom EmptyState

```tsx
<EmptyState
  variant="custom"
  icon={<CustomIcon className="w-20 h-20 text-brand-cyan" />}
  title="Custom Empty State"
  description="Create your own empty state with custom content"
  actionLabel="Primary Action"
  actionHref="/path"
  secondaryActionLabel="Secondary Action"
  onSecondaryAction={() => console.log('Secondary clicked')}
  size="lg"
  showGlassEffect={true}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | string | `'generic'` | Pre-configured variant type |
| `icon` | ReactNode | Auto-generated | Custom icon element |
| `title` | string | Required | Main headline text |
| `description` | string | Optional | Supporting description |
| `actionLabel` | string | Optional | Primary button text |
| `actionHref` | string | Optional | Primary button link (use with Link) |
| `onAction` | function | Optional | Primary button click handler |
| `secondaryActionLabel` | string | Optional | Secondary button text |
| `secondaryActionHref` | string | Optional | Secondary button link |
| `onSecondaryAction` | function | Optional | Secondary button click handler |
| `className` | string | `''` | Additional CSS classes |
| `size` | `'sm'` \| `'md'` \| `'lg'` | `'md'` | Component size |
| `showGlassEffect` | boolean | `true` | Enable glass morphism effect |

## Available Variants

- `search` - Magnifying glass icon (No search results)
- `bookings` - Calendar icon (No bookings)
- `reviews` - Star icon (No reviews)
- `favorites` - Heart icon (No favorites)
- `messages` - Chat bubble icon (No messages)
- `events` - Ticket icon (No events)
- `warning` - Warning triangle icon (Errors)
- `generic` - Folder icon (Default)
- `artists` - User group icon (No artists)
- `custom` - Use your own icon

## Size Options

### Small (`size="sm"`)
- Ideal for: Sidebar panels, modal dialogs
- Container padding: `py-8 px-6`
- Title size: `text-xl`
- Button size: `px-4 py-2 text-sm`

### Medium (`size="md"`) - Default
- Ideal for: Main content areas, list views
- Container padding: `py-12 px-8`
- Title size: `text-2xl sm:text-3xl`
- Button size: `px-6 py-3 text-base`

### Large (`size="lg"`)
- Ideal for: Full-page empty states, hero sections
- Container padding: `py-16 px-12`
- Title size: `text-3xl sm:text-4xl`
- Button size: `px-8 py-4 text-lg`

## Design Features

### Glass Morphism
- Background: `bg-white/70`
- Backdrop blur: `backdrop-blur-md`
- Border: `border border-white/20`
- Shadow: `shadow-lg` (hover: `shadow-xl`)

### Animations
- Icon: `animate-float-slow` - Gentle floating motion
- Pulse background on icon
- Hover scale on buttons: `hover:scale-105`
- Smooth transitions: `transition-all duration-300`

### Accessibility
- ARIA labels on all interactive elements
- Keyboard navigation support
- Focus states on buttons
- Semantic HTML structure

## Real-World Examples

### Artist Listing Page (No Results)
```tsx
{artists.length === 0 && (
  <EmptyState
    variant="artists"
    title="No artists found in this category"
    description="Try adjusting your filters or explore other categories."
    actionLabel="Clear Filters"
    onAction={() => resetFilters()}
    secondaryActionLabel="Browse All Artists"
    secondaryActionHref="/artists"
  />
)}
```

### Customer Bookings Page
```tsx
{bookings.length === 0 && (
  <EmptyStateVariants.NoBookings />
)}
```

### Search Results
```tsx
{searchResults.length === 0 && searchQuery && (
  <EmptyStateVariants.NoSearchResults
    onAction={() => setSearchQuery('')}
  />
)}
```

### Error State with Retry
```tsx
{error && (
  <EmptyState
    variant="warning"
    title="Failed to load content"
    description="We're having trouble loading this data. Please try again."
    actionLabel="Retry"
    onAction={() => refetch()}
    size="md"
  />
)}
```

## Best Practices

1. **Always provide context** - Help users understand why the state is empty
2. **Offer actionable next steps** - Include at least one call-to-action
3. **Use appropriate variant** - Match icon/message to context
4. **Keep copy friendly** - Maintain Bright Ears' entertainment-themed voice
5. **Consider mobile** - Use responsive sizes and appropriate spacing
6. **Test accessibility** - Ensure screen readers work properly
7. **Maintain brand consistency** - Use platform colors and glass morphism

## Internationalization

The EmptyState component supports next-intl translations. Use translation keys in your implementation:

```tsx
import { useTranslations } from 'next-intl';

const t = useTranslations('emptyState');

<EmptyState
  variant="noBookings"
  title={t('noBookings.title')}
  description={t('noBookings.description')}
  actionLabel={t('noBookings.action')}
  actionHref="/artists"
/>
```

## Files Created

1. `/components/ui/EmptyState.tsx` - Main component
2. `/app/not-found.tsx` - Root 404 page (no locale)
3. `/app/[locale]/not-found.tsx` - Locale-aware 404 page
4. Updated `/messages/en.json` with translations

## Design Tokens Used

- Brand Colors: `brand-cyan`, `deep-teal`, `soft-lavender`, `earthy-brown`
- Typography: `font-playfair` (headings), `font-inter` (body)
- Animations: `animate-float-slow`, `animate-pulse`
- Spacing: Tailwind's 4px/8px grid system
- Shadows: `shadow-lg`, `shadow-xl`, `shadow-brand-cyan/30`
