'use client'

interface HighlightProps {
  text: string
  searchTerm: string
  className?: string
}

/**
 * Component to highlight search terms within text
 * Used to improve search result visibility
 */
export function HighlightText({ text, searchTerm, className = '' }: HighlightProps) {
  if (!searchTerm || !text) {
    return <span className={className}>{text}</span>
  }

  // Escape special regex characters in search term
  const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  try {
    // Split text by search term (case-insensitive)
    const parts = text.split(new RegExp(`(${escapedTerm})`, 'gi'))

    return (
      <span className={className}>
        {parts.map((part, index) =>
          part.toLowerCase() === searchTerm.toLowerCase() ? (
            <mark
              key={index}
              className="bg-brand-cyan/30 text-dark-gray font-semibold rounded px-1"
            >
              {part}
            </mark>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </span>
    )
  } catch (error) {
    // Fallback if regex fails
    console.error('Error highlighting text:', error)
    return <span className={className}>{text}</span>
  }
}

/**
 * Component to highlight multiple search terms
 */
export function HighlightMultipleTerms({
  text,
  searchTerms,
  className = ''
}: {
  text: string
  searchTerms: string[]
  className?: string
}) {
  if (!searchTerms.length || !text) {
    return <span className={className}>{text}</span>
  }

  let highlightedText = text
  const highlights: Array<{ start: number; end: number; term: string }> = []

  // Find all occurrences of all search terms
  searchTerms.forEach(term => {
    const regex = new RegExp(term, 'gi')
    let match

    while ((match = regex.exec(text)) !== null) {
      highlights.push({
        start: match.index,
        end: match.index + match[0].length,
        term: match[0]
      })
    }
  })

  // Sort by position
  highlights.sort((a, b) => a.start - b.start)

  // Remove overlapping highlights
  const mergedHighlights = highlights.reduce((acc, current) => {
    if (acc.length === 0) return [current]

    const last = acc[acc.length - 1]
    if (current.start < last.end) {
      // Overlapping - extend the last one if needed
      if (current.end > last.end) {
        last.end = current.end
      }
    } else {
      acc.push(current)
    }

    return acc
  }, [] as typeof highlights)

  // Build the highlighted text
  let lastIndex = 0
  const parts: React.ReactNode[] = []

  mergedHighlights.forEach((highlight, index) => {
    // Add text before highlight
    if (lastIndex < highlight.start) {
      parts.push(
        <span key={`text-${index}`}>
          {text.substring(lastIndex, highlight.start)}
        </span>
      )
    }

    // Add highlighted text
    parts.push(
      <mark
        key={`highlight-${index}`}
        className="bg-brand-cyan/30 text-dark-gray font-semibold rounded px-1"
      >
        {text.substring(highlight.start, highlight.end)}
      </mark>
    )

    lastIndex = highlight.end
  })

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(<span key="text-end">{text.substring(lastIndex)}</span>)
  }

  return <span className={className}>{parts}</span>
}
