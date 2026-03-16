// lib/ratelimit.ts
// Upstash Rate Limiting for key routes

import { Ratelimit } from '@upstash/ratelimit'
import { getRedis } from './redis'

// Inquiry form: max 5 submissions per IP per 60 minutes
let _inquiryLimiter: Ratelimit | null = null

export function getInquiryRatelimit(): Ratelimit {
  if (_inquiryLimiter) return _inquiryLimiter

  _inquiryLimiter = new Ratelimit({
    redis: getRedis(),
    limiter: Ratelimit.slidingWindow(5, '60 m'),
    analytics: true,
    prefix: 'vcc:inquiry',
  })

  return _inquiryLimiter
}

// Blog post creation: max 20 per hour (admin action)
let _blogLimiter: Ratelimit | null = null

export function getBlogRatelimit(): Ratelimit {
  if (_blogLimiter) return _blogLimiter

  _blogLimiter = new Ratelimit({
    redis: getRedis(),
    limiter: Ratelimit.slidingWindow(20, '60 m'),
    analytics: true,
    prefix: 'vcc:blog',
  })

  return _blogLimiter
}
