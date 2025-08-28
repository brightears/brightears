/**
 * Utility function to get the correct API endpoint URL
 * Handles both client and server side, and works with locale routing
 */
export function getApiUrl(endpoint: string): string {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  // In client-side, use the origin to ensure absolute URL
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/${cleanEndpoint}`;
  }
  
  // Server-side - return the path as is (Next.js handles it)
  return `/${cleanEndpoint}`;
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