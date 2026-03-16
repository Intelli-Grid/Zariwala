// lib/contact-links.ts
// Zariwala contact link utilities.
// WhatsApp is the primary direct contact channel.
// Telegram is community-only (footer/contact page) — not used here.

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '91XXXXXXXXXX'
const TG_COMMUNITY = process.env.NEXT_PUBLIC_TELEGRAM_COMMUNITY || 'zariwala'

// ---------------- WhatsApp links ----------------

interface ProductLike {
  title: string
  sku?: string
  price?: number
}

/** Deep-link to WhatsApp with a pre-filled enquiry about a specific product. */
export function generateProductWhatsAppUrl(product: ProductLike): string {
  let msg = `Hi Zariwala, I'm interested in: ${product.title}`
  if (product.sku) msg += ` (SKU: ${product.sku})`
  if (product.price) msg += ` (Price: ${product.price})`
  return `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`
}

/** Deep-link to WhatsApp with a pre-filled sell enquiry. */
export function generateSellWhatsAppUrl(data?: Record<string, unknown>): string {
  const msg =
    data?.name
      ? `Hi Zariwala, I'd like to sell my vintage items. My name is ${data.name}.`
      : "Hi Zariwala, I'd like to sell my vintage items."
  return `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`
}

// ---------------- Legacy / community Telegram ----------------
// These are kept only for the community footer link.
// Do NOT use on product/sell pages — Zariwala channel strategy requires WhatsApp.

/** Community Telegram channel link (footer only). */
export function getTelegramCommunityUrl(): string {
  return `https://t.me/${TG_COMMUNITY}`
}

// Kept for backwards-compat but deprecated — map to community URL now
/** @deprecated Use getTelegramCommunityUrl() or remove entirely */
export function generateSellTelegramUrl(): string {
  return getTelegramCommunityUrl()
}

/** @deprecated Use getTelegramCommunityUrl() or remove entirely */
export function generateProductTelegramUrl(): string {
  return getTelegramCommunityUrl()
}
