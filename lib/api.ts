/**
 * Utility function to get the correct API endpoint URL
 * Handles both client and server side, and works with locale routing
 * Ensures API routes are never prefixed with locale
 */
export function getApiUrl(endpoint: string): string {
  // Ensure endpoint starts with /api
  if (!endpoint.startsWith('/api')) {
    endpoint = endpoint.startsWith('/') ? `/api${endpoint}` : `/api/${endpoint}`;
  }
  
  // In client-side, use the origin to ensure absolute URL
  if (typeof window !== 'undefined') {
    return `${window.location.origin}${endpoint}`;
  }
  
  // Server-side - return the path as is (Next.js handles it)
  return endpoint;
}

/**
 * Wrapper for fetch that handles API routes correctly
 */
export async function apiFetch(
  endpoint: string,
  options?: RequestInit
): Promise<Response> {
  const url = getApiUrl(endpoint);
  return fetch(url, options);
}