interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

class SearchCache {
  private cache = new Map<string, CacheEntry<any>>()
  private readonly defaultTTL = 5 * 60 * 1000 // 5 minutes default

  /**
   * Set a value in the cache with optional TTL
   */
  set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  /**
   * Get a value from the cache, returns null if expired or not found
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key)

    if (!entry) return null

    const now = Date.now()
    const isExpired = (now - entry.timestamp) > entry.ttl

    if (isExpired) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  /**
   * Check if a key exists and is not expired
   */
  has(key: string): boolean {
    return this.get(key) !== null
  }

  /**
   * Delete a specific cache entry
   */
  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    size: number
    entries: number
    hitRate?: number
  } {
    return {
      size: this.cache.size,
      entries: this.cache.size
    }
  }

  /**
   * Remove expired entries from cache
   */
  cleanup(): void {
    const now = Date.now()
    const keysToDelete: string[] = []

    this.cache.forEach((entry, key) => {
      if ((now - entry.timestamp) > entry.ttl) {
        keysToDelete.push(key)
      }
    })

    keysToDelete.forEach(key => this.cache.delete(key))
  }

  /**
   * Generate a deterministic cache key from parameters
   */
  generateKey(params: Record<string, any>): string {
    // Sort keys to ensure consistent cache keys
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((acc, key) => {
        acc[key] = params[key]
        return acc
      }, {} as Record<string, any>)

    return JSON.stringify(sortedParams)
  }

  /**
   * Invalidate cache entries matching a pattern
   */
  invalidatePattern(pattern: string | RegExp): number {
    let deletedCount = 0
    const regex = typeof pattern === 'string'
      ? new RegExp(pattern)
      : pattern

    const keysToDelete: string[] = []
    this.cache.forEach((_, key) => {
      if (regex.test(key)) {
        keysToDelete.push(key)
      }
    })

    keysToDelete.forEach(key => {
      this.cache.delete(key)
      deletedCount++
    })

    return deletedCount
  }
}

// Export singleton instance
export const searchCache = new SearchCache()

// Run cleanup every 10 minutes to prevent memory bloat
if (typeof window === 'undefined') {
  // Only run cleanup on server side
  setInterval(() => {
    searchCache.cleanup()
  }, 10 * 60 * 1000)
}

// Cache TTL constants
export const CACHE_TTL = {
  SEARCH_RESULTS: 3 * 60 * 1000,      // 3 minutes for search results
  ARTIST_PROFILE: 10 * 60 * 1000,     // 10 minutes for artist profiles
  STATIC_DATA: 60 * 60 * 1000,        // 1 hour for static data (categories, etc.)
  SHORT_TERM: 1 * 60 * 1000,          // 1 minute for frequently changing data
} as const
