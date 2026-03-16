// lib/redis.ts
// Upstash Redis client — credentials are now active

import { Redis } from '@upstash/redis'

let _redis: Redis | null = null

export function getRedis(): Redis {
  if (_redis) return _redis

  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
    throw new Error('Upstash Redis credentials not configured')
  }

  _redis = new Redis({ url, token })
  return _redis
}

// Convenience export for direct use
export { Redis }
