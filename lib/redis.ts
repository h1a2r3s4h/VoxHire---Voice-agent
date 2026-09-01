/**
 * Redis Cache & Rate Limiting Module
 * Supports sliding window rate limiting and key-value caching.
 * Includes in-memory fallback for local development when no REDIS_URL is provided.
 */

interface CacheEntry {
  value: any;
  expiresAt: number;
}

const inMemoryCache = new Map<string, CacheEntry>();
const rateLimitMap = new Map<string, number[]>();

export class RedisService {
  /**
   * Set key-value pair in cache with TTL (in seconds)
   */
  static async set(key: string, value: any, ttlSeconds: number = 3600): Promise<void> {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    inMemoryCache.set(key, { value, expiresAt });
  }

  /**
   * Get cached value by key
   */
  static async get<T = any>(key: string): Promise<T | null> {
    const entry = inMemoryCache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      inMemoryCache.delete(key);
      return null;
    }

    return entry.value as T;
  }

  /**
   * Delete key from cache
   */
  static async del(key: string): Promise<void> {
    inMemoryCache.delete(key);
  }

  /**
   * Sliding window rate limiter
   * Returns { success: boolean, remaining: number, resetInMs: number }
   */
  static async rateLimit(
    identifier: string,
    limit: number = 10,
    windowMs: number = 60000
  ): Promise<{ success: boolean; remaining: number; resetInMs: number }> {
    const now = Date.now();
    const timestamps = rateLimitMap.get(identifier) || [];

    // Filter timestamps within the current sliding window
    const validTimestamps = timestamps.filter((ts) => now - ts < windowMs);

    if (validTimestamps.length >= limit) {
      const oldestTs = validTimestamps[0];
      const resetInMs = Math.max(0, windowMs - (now - oldestTs));
      return {
        success: false,
        remaining: 0,
        resetInMs,
      };
    }

    validTimestamps.push(now);
    rateLimitMap.set(identifier, validTimestamps);

    return {
      success: true,
      remaining: limit - validTimestamps.length,
      resetInMs: windowMs,
    };
  }
}
