import { getRedis } from './redis'

// Each anonymous user gets a UUID stored in a cookie
// Their wishlist is stored as a Redis Set with 30-day TTL

export async function addToWishlist(sessionId: string, productId: string) {
  const redis = getRedis()
  await redis.sadd(`wishlist:${sessionId}`, productId)
  await redis.expire(`wishlist:${sessionId}`, 60 * 60 * 24 * 30)
}

export async function removeFromWishlist(sessionId: string, productId: string) {
  const redis = getRedis()
  await redis.srem(`wishlist:${sessionId}`, productId)
}

export async function getWishlist(sessionId: string): Promise<string[]> {
  const redis = getRedis()
  return (redis.smembers(`wishlist:${sessionId}`) as Promise<string[]>)
}

export async function isWishlisted(sessionId: string, productId: string) {
  const redis = getRedis()
  return redis.sismember(`wishlist:${sessionId}`, productId)
}
