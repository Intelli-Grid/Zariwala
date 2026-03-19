import { NextRequest, NextResponse } from 'next/server'
import { sendTelegramMessage } from '@/lib/telegram'

// Your Meta App Webhook Verification Token
const VERIFY_TOKEN = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN

// GET is used by Meta to verify the webhook URL
export async function GET(req: NextRequest) {
  const mode = req.nextUrl.searchParams.get('hub.mode')
  const token = req.nextUrl.searchParams.get('hub.verify_token')
  const challenge = req.nextUrl.searchParams.get('hub.challenge')

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED')
      return new NextResponse(challenge, { status: 200 })
    }
  }
  return new NextResponse('Forbidden', { status: 403 })
}

// POST receives incoming messages
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (body.object === 'whatsapp_business_account') {
      for (const entry of body.entry) {
        for (const change of entry.changes) {
          if (change.value.messages && change.value.messages[0]) {
            const message = change.value.messages[0]
            const from = message.from // e.g., "1234567890" (customer's WhatsApp number)
            
            // Only handle text messages for now
            if (message.type === 'text') {
              const text = message.text.body
              
              // Forward this message to the Admin Telegram instantly so they are aware of a reply
              const adminChatId = process.env.ADMIN_TELEGRAM_CHAT_ID
              if (adminChatId) {
                const tgMessage = `💬 *Incoming WhatsApp Message*\n\n📞 From: \`+${from}\`\n💬 Message: ${text}`
                await sendTelegramMessage(adminChatId, tgMessage)
              }
            } else if (message.type === 'image') {
               const adminChatId = process.env.ADMIN_TELEGRAM_CHAT_ID
               if (adminChatId) {
                 const tgMessage = `📸 *Incoming WhatsApp Photo*\n\n📞 From: \`+${from}\`\n💬 Sent an image. Please check your WhatsApp Business app.`
                 await sendTelegramMessage(adminChatId, tgMessage)
               }
            }
          }
        }
      }
      return new NextResponse('OK', { status: 200 })
    }
    
    return new NextResponse('Not Found', { status: 404 })
  } catch (err) {
    console.error('Webhook error:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
