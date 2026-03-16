// lib/notify.ts
// Central notification orchestrator for Zariwala — fires on every new inquiry.
// Sends:
//   1. Admin Telegram private notification (backend only)
//   2. Seller WhatsApp confirmation (Cloud API — if credentials set)
//   3. Seller email confirmation (Brevo)
//   4. Admin email notification (Brevo)

import { notifyAdminNewInquiry } from './telegram'
import { sendSellerConfirmation } from './whatsapp'
import { sendSellerConfirmationEmail, sendAdminNotificationEmail } from './email'

interface InquiryNotificationPayload {
  id: string
  reference: string
  sellerName: string
  contactMethod: string
  whatsapp?: string | null
  email?: string | null
  category: string
  condition: string
  photoCount: number
  itemCount: number
  country: string
}

export async function notifyOnNewInquiry(inquiry: InquiryNotificationPayload): Promise<void> {
  const results = await Promise.allSettled([
    // 1. Admin Telegram notification (private admin chat — backend only)
    notifyAdminNewInquiry({
      reference: inquiry.reference,
      sellerName: inquiry.sellerName,
      country: inquiry.country,
      category: inquiry.category,
      condition: inquiry.condition,
      photoCount: inquiry.photoCount,
      whatsapp: inquiry.whatsapp,
      id: inquiry.id,
    }),

    // 2. Seller WhatsApp confirmation (Cloud API) — only if they chose WhatsApp
    inquiry.contactMethod === 'WHATSAPP' && inquiry.whatsapp
      ? sendSellerConfirmation(inquiry.whatsapp, inquiry.sellerName, inquiry.reference)
      : Promise.resolve(false),

    // 3. Seller email confirmation (Brevo) — only if email provided
    inquiry.email
      ? sendSellerConfirmationEmail(inquiry.email, inquiry.sellerName, inquiry.reference)
      : Promise.resolve(false),

    // 4. Admin email (Brevo)
    sendAdminNotificationEmail({
      reference: inquiry.reference,
      sellerName: inquiry.sellerName,
      contactMethod: inquiry.contactMethod,
      categories: [inquiry.category],
      itemCount: inquiry.itemCount,
    }),
  ])

  const labels = ['Admin Telegram', 'Seller WhatsApp (Cloud)', 'Seller Email', 'Admin Email']
  results.forEach((r, i) => {
    if (r.status === 'rejected') {
      console.error(`[Notify] ${labels[i]} failed:`, r.reason)
    } else {
      console.log(`[Notify] ${labels[i]}:`, r.value ? '✓ sent' : '⚠ skipped (credentials not set)')
    }
  })
}
