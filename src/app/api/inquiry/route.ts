import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { notifyOnNewInquiry } from '@/lib/notify'
import { getInquiryRatelimit } from '@/lib/ratelimit'

// Zariwala contact methods: WhatsApp or Email only. Telegram is community-only.
const inquirySchema = z.object({
  sellerName: z.string().min(2).max(120),
  email: z.string().email().optional().or(z.literal('')),
  whatsapp: z.string().optional(),
  contactMethod: z.enum(['WHATSAPP', 'EMAIL']),
  country: z.string().min(2).max(80),
  category: z.string().min(1),
  condition: z.string().optional(),
  itemCount: z.number().int().min(1).max(9999),
  description: z.string().max(3000).optional(),
  photos: z.array(z.string().url()).max(10).optional(),
  // Legacy array support (old form still sends categories[])
  categories: z.array(z.string()).optional(),
})

function generateReference(): string {
  const year = new Date().getFullYear()
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase()
  return `ZRW-${year}-${rand}`
}

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 5 submissions per IP per 60 minutes
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      'anonymous'

    try {
      const ratelimit = getInquiryRatelimit()
      const { success, limit, remaining, reset } = await ratelimit.limit(ip)
      if (!success) {
        return NextResponse.json(
          { success: false, error: 'Too many submissions. Please wait before trying again.' },
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': limit.toString(),
              'X-RateLimit-Remaining': remaining.toString(),
              'X-RateLimit-Reset': reset.toString(),
            },
          }
        )
      }
    } catch (redisErr) {
      console.warn('[RateLimit] Redis error, skipping rate limit:', redisErr)
    }

    const body = await req.json()

    // Honeypot anti-spam: silently reject bots
    if (body.website) {
      return NextResponse.json({ success: true }, { status: 201 })
    }

    const validData = inquirySchema.parse(body)
    const reference = generateReference()

    // Resolve single category (blueprint) or legacy categories[] array
    const resolvedCategory =
      validData.category || validData.categories?.[0] || 'unspecified'
    const legacyCategories =
      validData.categories ?? [resolvedCategory]

    const inquiry = await prisma.inquiry.create({
      data: {
        reference,
        sellerName: validData.sellerName,
        contactMethod: validData.contactMethod,
        whatsapp: validData.whatsapp || null,
        email: validData.email || null,
        country: validData.country,
        categories: legacyCategories,
        itemCount: validData.itemCount,
        description: validData.description || null,
        condition: validData.condition || null,
        photos: validData.photos || [],
        status: 'NEW',
      },
    })

    // Fire-and-forget notifications (Telegram admin, WhatsApp, Email)
    notifyOnNewInquiry({
      id: inquiry.id,
      reference: inquiry.reference,
      sellerName: inquiry.sellerName,
      contactMethod: inquiry.contactMethod,
      whatsapp: inquiry.whatsapp,
      email: inquiry.email,
      category: resolvedCategory,
      condition: validData.condition ?? 'Not specified',
      photoCount: (validData.photos ?? []).length,
      itemCount: inquiry.itemCount,
      country: inquiry.country,
    }).catch(err => console.error('[API/inquiry] Notification error:', err))

    return NextResponse.json(
      { success: true, reference, inquiryId: inquiry.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Inquiry submission error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
