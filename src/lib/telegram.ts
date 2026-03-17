// lib/telegram.ts
// INTERNAL / BACKEND USE ONLY — Zariwala admin notification bot.
// This module is NEVER linked or referenced on public seller-facing pages.
// Role:
//   • Sends private alerts to the admin's personal Telegram account
//   • Processes simple admin commands (/pending, /today)
//   • Never used for public-facing seller conversations

const TG_API = 'https://api.telegram.org/bot'

export async function sendTelegramMessage(chatId: string, text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) {
    console.warn('[Telegram] TELEGRAM_BOT_TOKEN not set — skipping notification')
    return false
  }

  try {
    const res = await fetch(`${TG_API}${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'Markdown',
      }),
    })

    const data = await res.json()
    if (!data.ok) {
      console.error('[Telegram] Error sending message:', data.description)
      return false
    }
    return true
  } catch (err) {
    console.error('[Telegram] Request failed:', err)
    return false
  }
}

// Called after every new web form inquiry submission
export async function notifyAdminNewInquiry(inquiry: {
  reference: string
  sellerName: string
  country: string
  category: string
  condition: string
  photoCount: number
  whatsapp?: string | null
  id: string
}): Promise<boolean> {
  const adminChatId = process.env.ADMIN_TELEGRAM_CHAT_ID
  if (!adminChatId) {
    console.warn('[Telegram] ADMIN_TELEGRAM_CHAT_ID not set — skipping admin notification')
    return false
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://zariwala.online'

  const message =
    `🆕 *NEW ZARIWALA INQUIRY — #${inquiry.reference}*\n\n` +
    `👤 Seller: ${inquiry.sellerName}\n` +
    `📍 Location: ${inquiry.country}\n` +
    `📦 Category: ${inquiry.category}\n` +
    `⭐ Condition: ${inquiry.condition}\n` +
    `📸 Photos: ${inquiry.photoCount} uploaded\n` +
    `📱 WhatsApp: ${inquiry.whatsapp ?? 'Not provided'}\n\n` +
    `🔗 [View in Admin](${appUrl}/admin/inquiries/${inquiry.id})`

  return sendTelegramMessage(adminChatId, message)
}

// Called when admin marks an offer as accepted
export async function notifyAdminOfferAccepted(inquiry: {
  reference: string
  sellerName: string
  offerAmount: number
}): Promise<boolean> {
  const adminChatId = process.env.ADMIN_TELEGRAM_CHAT_ID
  if (!adminChatId) return false

  const message =
    `✅ *OFFER ACCEPTED — #${inquiry.reference}*\n\n` +
    `👤 Seller: ${inquiry.sellerName}\n` +
    `💰 Amount: $${inquiry.offerAmount}\n\n` +
    `Next step: Arrange shipping on WhatsApp.`

  return sendTelegramMessage(adminChatId, message)
}
