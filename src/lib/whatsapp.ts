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
  catStreetwear: buildWhatsAppLink(
    "Hi! I have vintage sportswear or a band tee I'd like to sell."
  ),
  catDesigner: buildWhatsAppLink(
    "Hi! I have a vintage designer item I'd like to sell. Can I send photos?"
  ),
  catHeritage: buildWhatsAppLink(
    "Hi! I have a silk saree or heritage textile I'd like to sell. Can I send photos?"
  ),
  catOuterwear: buildWhatsAppLink(
    "Hi! I have vintage outerwear I'd like to sell."
  ),
  catAccessories: buildWhatsAppLink(
    "Hi! I have vintage accessories I'd like to sell."
  ),
  // ── v5 Zari & Silk categories ──────────────────────────────────────────────
  catZariSarees: buildWhatsAppLink(
    "Hi! I have Zari Sarees I'd like to sell. Can I send photos?"
  ),
  catPureSilk: buildWhatsAppLink(
    "Hi! I have pure silk sarees I'd like to sell. Can I send photos?"
  ),
  catBanarasi: buildWhatsAppLink(
    "Hi! I have Banarasi silks I'd like to sell — sarees or dupattas. Can I send photos?"
  ),
  catHeritageBrocades: buildWhatsAppLink(
    "Hi! I have heritage brocade pieces — Kinkhab or Meenakari. Can I get a specialist valuation?"
  ),
  catZariLehengas: buildWhatsAppLink(
    "Hi! I have Zari Lehengas or suits I'd like to sell. Can I send photos?"
  ),
  catSilkDupattas: buildWhatsAppLink(
    "Hi! I have silk dupattas or stoles I'd like to sell. Can I send photos?"
  ),
  catZariBlouses: buildWhatsAppLink(
    "Hi! I have Zari blouses or cholis I'd like to sell. Can I send photos?"
  ),
  catVintageFabric: buildWhatsAppLink(
    "Hi! I have vintage Zari fabric or brocade yardage — can I get a valuation?"
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

export interface OfferFormData {
  category: string;
  itemType: string;
  era: string;
  itemCount: number;
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  originalTags: 'Yes' | 'No' | 'Partial';
  flaws?: string;
  name: string;
  location?: string;
}

export function buildOfferLink(data: OfferFormData): string {
  const flawsLine = data.flaws?.trim()
    ? data.flaws.trim()
    : 'None mentioned';

  const locationLine = data.location?.trim()
    ? `\n📍 Location: ${data.location.trim()}`
    : '';

  const message =
    `Hi Zariwala! I'd like to sell the following:\n\n` +
    `📦 Category: ${data.category}\n` +
    `🏷️ Item Type: ${data.itemType}\n` +
    `📅 Era / Decade: ${data.era}\n` +
    `🔢 Number of Items: ${data.itemCount}\n` +
    `⭐ Condition: ${data.condition}\n` +
    `🏷️ Original Tags: ${data.originalTags}\n` +
    `📝 Flaws / Notes: ${flawsLine}\n\n` +
    `👤 My Name: ${data.name}${locationLine}\n\n` +
    `I'll send photos now. Please let me know your offer!`;

  return buildWhatsAppLink(message);
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
