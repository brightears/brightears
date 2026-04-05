'use client';

import { useEffect } from 'react';

/**
 * Handles hash-based scrolling after Next.js hydration.
 * Next.js App Router sometimes doesn't scroll to #hash anchors on full page loads.
 * This component fixes that by scrolling after the page has hydrated.
 */
export default function HashScroller() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // Small delay to ensure DOM is fully rendered after hydration
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  return null;
}
