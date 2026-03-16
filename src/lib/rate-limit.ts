// lib/rate-limit.ts — simple wrapper using getRedis() properly
import { getRedis } from './redis'

/**
 * Sliding window rate limiter using Upstash Redis.
 * @param key - unique key (e.g. `sell:1.2.3.4`)
 * @param limit - max requests in the window
 * @param windowSeconds - window duration in seconds
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<{ success: boolean; remaining: number }> {
  try {
    const redis = getRedis()
    const now = Date.now()
    const windowStart = now - windowSeconds * 1000

    const pipe = redis.pipeline()
    pipe.zremrangebyscore(key, 0, windowStart)
    pipe.zadd(key, { score: now, member: now.toString() })
    pipe.zcard(key)
    pipe.expire(key, windowSeconds)

    const results = await pipe.exec()
    const count = (results[2] as number) ?? 0

    return {
      success: count <= limit,
      remaining: Math.max(0, limit - count),
    }
  } catch {
    // Redis unavailable — allow request through
    return { success: true, remaining: limit }
  }
}
