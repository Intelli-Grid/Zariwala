// GET: WhatsApp webhook verification (required by Meta)
// POST: Inbound WhatsApp messages handler
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const mode      = searchParams.get('hub.mode')
  const token     = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
    console.log('[WhatsApp] Webhook verified ✓')
    return new NextResponse(challenge, { status: 200 })
  }

  return new NextResponse('Forbidden', { status: 403 })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Extract message from WhatsApp Cloud API payload
    const entry   = body?.entry?.[0]
    const changes = entry?.changes?.[0]
    const value   = changes?.value
    const message = value?.messages?.[0]

    if (!message) {
      // Could be a status update (delivered, read) — ignore
      return NextResponse.json({ ok: true })
    }

    const from = message.from               // Sender phone number
    const type = message.type               // text | image | audio | etc.
    const text = message.text?.body ?? ''

    console.log(`[WhatsApp] Inbound from ${from}: ${type} — "${text}"`)

    // Auto-reply logic
    if (text.toLowerCase().includes('/start') || text.toLowerCase().includes('hello') || text.toLowerCase().includes('hi')) {
      await sendWhatsAppReply(from, getWelcomeMessage())
    } else if (text.toLowerCase().includes('status') || text.toLowerCase().includes('inquiry') || text.toLowerCase().includes('reference')) {
      await sendWhatsAppReply(
        from,
        '📋 To check your inquiry status, please share your reference number (e.g. ZRW-XXXXX) and we\'ll look it up for you!'
      )
    } else if (type === 'image') {
      await sendWhatsAppReply(
        from,
        '📸 Thanks for the photo! Our team is reviewing it and will get back to you within 24 hours with a valuation.'
      )
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[WhatsApp] Webhook error:', err)
    return NextResponse.json({ ok: true }) // Always 200 to avoid retries
  }
}

function getWelcomeMessage(): string {
  return `👗 *Welcome to Zariwala!*

We buy quality vintage clothing from sellers worldwide. Here's how it works:

1️⃣ *Send us photos* of your item (front, back, labels, any flaws)
2️⃣ *Receive an offer* within 24 hours from our specialists
3️⃣ *Get paid* once you ship the item

📌 Or submit a detailed inquiry online: ${process.env.NEXT_PUBLIC_APP_URL}/sell

Have photos ready to share? Just send them right here! 📸`
}

async function sendWhatsAppReply(to: string, message: string): Promise<void> {
  const token   = process.env.WHATSAPP_ACCESS_TOKEN
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID

  if (!token || !phoneId) {
    console.warn('[WhatsApp] ACCESS_TOKEN or PHONE_NUMBER_ID not set — cannot reply')
    return
  }

  await fetch(`https://graph.facebook.com/v18.0/${phoneId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: message },
    }),
  })
}
