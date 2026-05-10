import { NextRequest, NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'
import { sendTelegramMessage } from '@/lib/telegram'

const VERIFY_TOKEN = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN
const APP_SECRET   = process.env.WHATSAPP_APP_SECRET // Meta App Secret for signature verification

/**
 * Verifies the X-Hub-Signature-256 header sent by Meta on every webhook POST.
 * Uses timingSafeEqual to prevent timing attacks.
 * Returns true if signature is valid OR if APP_SECRET is not configured (fail-open for local dev).
 */
async function verifySignature(req: NextRequest, rawBody: string): Promise<boolean> {
  if (!APP_SECRET) return true // Not configured — skip in dev, warn in prod

  const signature = req.headers.get('x-hub-signature-256') ?? ''
  if (!signature.startsWith('sha256=')) return false

  const expected = 'sha256=' + createHmac('sha256', APP_SECRET)
    .update(rawBody, 'utf8')
    .digest('hex')

  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  } catch {
    return false
  }
}

// GET — Meta uses this to verify the webhook URL during setup
export async function GET(req: NextRequest) {
  const mode      = req.nextUrl.searchParams.get('hub.mode')
  const token     = req.nextUrl.searchParams.get('hub.verify_token')
  const challenge = req.nextUrl.searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('[WhatsApp Webhook] Verified ✓')
    return new NextResponse(challenge, { status: 200 })
  }
  return new NextResponse('Forbidden', { status: 403 })
}

// POST — receives incoming messages from Meta
export async function POST(req: NextRequest) {
  // Read raw body first (needed for signature verification)
  const rawBody = await req.text()

  // ── Security: verify HMAC-SHA256 signature ──────────────────────
  const valid = await verifySignature(req, rawBody)
  if (!valid) {
    console.warn('[WhatsApp Webhook] Invalid signature — request rejected')
    return new NextResponse('Forbidden', { status: 403 })
  }

  try {
    const body = JSON.parse(rawBody)

    if (body.object !== 'whatsapp_business_account') {
      return new NextResponse('Not Found', { status: 404 })
    }

    for (const entry of body.entry ?? []) {
      for (const change of entry.changes ?? []) {
        const message = change.value?.messages?.[0]
        if (!message) continue

        const from = message.from // customer's WhatsApp number (no +)
        const adminChatId = process.env.ADMIN_TELEGRAM_CHAT_ID
        if (!adminChatId) continue

        if (message.type === 'text') {
          const text = message.text?.body ?? '(empty)'
          await sendTelegramMessage(
            adminChatId,
            `💬 *Incoming WhatsApp Message*\n\n📞 From: \`+${from}\`\n💬 ${text}`
          )
        } else if (message.type === 'image') {
          await sendTelegramMessage(
            adminChatId,
            `📸 *Incoming WhatsApp Photo*\n\n📞 From: \`+${from}\`\nCheck WhatsApp Business app for the image.`
          )
        } else if (message.type === 'document') {
          await sendTelegramMessage(
            adminChatId,
            `📄 *Incoming WhatsApp Document*\n\n📞 From: \`+${from}\``
          )
        }
      }
    }

    return new NextResponse('OK', { status: 200 })
  } catch (err) {
    console.error('[WhatsApp Webhook] Error:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
