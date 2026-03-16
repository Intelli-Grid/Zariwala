// lib/whatsapp.ts
// WhatsApp is Zariwala's ONLY seller contact channel.
// This file has two sections:
//   1. Deep link builder — wa.me links used on every public page
//   2. Cloud API sender — used for automated confirmations after form submission

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1: Deep link builder
// ─────────────────────────────────────────────────────────────────────────────

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '1XXXXXXXXXX'

export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`
}

// Pre-built contextual links for every page / touch-point on zariwala.com
export const WA_LINKS = {
  homepage: buildWhatsAppLink(
    "Hi Zariwala! I have some vintage clothing I'd like to sell."
  ),
  homepageBottom: buildWhatsAppLink(
    "Hi! I have vintage pieces I'd like to sell. Can you help?"
  ),
  catDenim: buildWhatsAppLink(
    "Hi! I have vintage denim I'd like to sell. Can I send photos?"
  ),
  catSportswear: buildWhatsAppLink(
    "Hi! I have vintage sportswear I'd like to sell."
  ),
  catDesigner: buildWhatsAppLink(
    "Hi! I have a vintage designer item I'd like to sell. Can I send photos?"
  ),
  catHeritage: buildWhatsAppLink(
    "Hi! I have heritage textiles I'd like to sell. Can I send photos?"
  ),
  catOuterwear: buildWhatsAppLink(
    "Hi! I have vintage outerwear I'd like to sell."
  ),
  catAccessories: buildWhatsAppLink(
    "Hi! I have vintage accessories I'd like to sell."
  ),
  valuationGuide: buildWhatsAppLink(
    "Hi! I used your valuation quiz and would like an exact offer."
  ),
  howItWorks: buildWhatsAppLink(
    "Hi Zariwala! I'd like to start the selling process."
  ),
  whatWeBuy: buildWhatsAppLink(
    "Hi! I'd like to know if you buy my type of vintage clothing."
  ),
  contact: buildWhatsAppLink(
    "Hi Zariwala! I have a question about selling my vintage items."
  ),
  blog: buildWhatsAppLink(
    "Hi! I was reading your blog and I have vintage pieces to sell."
  ),
  floating: buildWhatsAppLink(
    "Hi Zariwala! I have vintage clothing I'd like to sell."
  ),
}

// Dynamic link for post-form-submission success page
export function buildPostFormLink(name: string, reference: string): string {
  return buildWhatsAppLink(
    `Hi Zariwala! I just submitted inquiry ${reference}. ` +
    `My name is ${name}. Looking forward to your evaluation!`
  )
}

// Dynamic link for a specific category
export function buildCategoryLink(categoryName: string): string {
  return buildWhatsAppLink(
    `Hi! I have vintage ${categoryName} I'd like to sell. Can I send photos?`
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2: WhatsApp Cloud API — automated confirmation message
// Called after form submission if seller provides their WhatsApp number.
// ─────────────────────────────────────────────────────────────────────────────

const WHATSAPP_API = 'https://graph.facebook.com/v19.0'

export async function sendWhatsAppMessage(to: string, message: string): Promise<boolean> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID

  if (!token || !phoneNumberId) {
    console.warn('[WhatsApp] WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_NUMBER_ID not set — skipping')
    return false
  }

  const normalized = to.replace(/\D/g, '')

  try {
    const res = await fetch(`${WHATSAPP_API}/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: normalized,
        type: 'text',
        text: { body: message },
      }),
    })

    const data = await res.json()
    if (!res.ok) {
      console.error('[WhatsApp] API Error:', data)
      return false
    }
    return true
  } catch (err) {
    console.error('[WhatsApp] Request failed:', err)
    return false
  }
}

export async function sendSellerConfirmation(
  sellerPhone: string,
  sellerName: string,
  reference: string
): Promise<boolean> {
  const message =
    `Hi ${sellerName}! 👋\n\n` +
    `Your Zariwala inquiry *${reference}* has been received.\n\n` +
    `Our vintage specialists will review your photos and respond ` +
    `via WhatsApp within 24 hours.\n\n` +
    `Thank you for choosing Zariwala! 🪡`

  return sendWhatsAppMessage(sellerPhone, message)
}
