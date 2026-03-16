// lib/email.ts
// Brevo (formerly SendinBlue) email helper — activated when BREVO_API_KEY is provided
// Sends: seller confirmation and admin new-inquiry notification — both branded as Zariwala

const BREVO_API = 'https://api.brevo.com/v3/smtp/email'

interface EmailPayload {
  to: { email: string; name?: string }[]
  subject: string
  htmlContent: string
}

async function sendBrevoEmail(payload: EmailPayload): Promise<boolean> {
  const apiKey = process.env.BREVO_API_KEY
  if (!apiKey) {
    console.warn('[Email] BREVO_API_KEY not set — skipping email')
    return false
  }

  try {
    const res = await fetch(BREVO_API, {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: process.env.EMAIL_FROM_NAME || 'Zariwala',
          email: process.env.EMAIL_FROM_ADDRESS || 'hello@zariwala.com',
        },
        ...payload,
      }),
    })

    if (!res.ok) {
      const error = await res.json()
      console.error('[Email] Brevo API error:', error)
      return false
    }
    return true
  } catch (err) {
    console.error('[Email] Request failed:', err)
    return false
  }
}

// ─── Seller Confirmation Email ──────────────────────────────────

export async function sendSellerConfirmationEmail(
  sellerEmail: string,
  sellerName: string,
  reference: string
): Promise<boolean> {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '1XXXXXXXXXX'
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `Hi Zariwala! I just submitted inquiry ${reference}. My name is ${sellerName}.`
  )}`

  const subject = `Your Zariwala Inquiry — ${reference}`
  const htmlContent = `
    <div style="font-family: 'Lato', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #3D3530; background: #FDF6E3;">
      <!-- Header -->
      <div style="background: #1C1C1A; padding: 36px 40px; text-align: center;">
        <h1 style="color: #B8860B; font-family: Georgia, serif; margin: 0; font-size: 28px; letter-spacing: 0.05em;">
          Zariwala
        </h1>
        <p style="color: #7A6E65; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; margin: 6px 0 0;">
          Vintage Clothing Buyers
        </p>
      </div>

      <!-- Body -->
      <div style="padding: 40px; background: #fff; border: 1px solid #DDD3C3; border-top: none;">
        <h2 style="color: #1C1C1A; font-family: Georgia, serif; margin-top: 0; font-size: 24px;">
          Hi ${sellerName}, your inquiry is received 🪡
        </h2>
        <p style="color: #3D3530; line-height: 1.8; font-size: 15px;">
          Our vintage specialists will review your photos and get back to you via WhatsApp
          within <strong>24 hours</strong> with a fair, honest offer.
        </p>

        <!-- Reference block -->
        <div style="background: #FDF6E3; border-left: 4px solid #B8860B; padding: 20px; margin: 28px 0; border-radius: 6px;">
          <p style="margin: 0; color: #7A6E65; font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase;">
            Your Reference Number
          </p>
          <p style="margin: 8px 0 0; font-size: 26px; font-family: monospace; color: #B8860B; letter-spacing: 3px; font-weight: bold;">
            ${reference}
          </p>
          <p style="margin: 4px 0 0; color: #7A6E65; font-size: 12px;">Keep this for your records</p>
        </div>

        <p style="color: #3D3530; line-height: 1.8; font-size: 15px;">
          Want to add more photos or ask a question? You can reach us directly on WhatsApp anytime.
        </p>

        <!-- WhatsApp CTA -->
        <div style="text-align: center; margin: 32px 0;">
          <a href="${waLink}"
             style="display: inline-block; background: #25D366; color: #fff; font-family: Arial, sans-serif; font-weight: bold; font-size: 15px; padding: 14px 32px; border-radius: 9999px; text-decoration: none;">
            💬 Confirm on WhatsApp
          </a>
        </div>

        <p style="color: #7A6E65; line-height: 1.8; font-size: 14px;">
          — The Zariwala Team
        </p>
      </div>

      <!-- Footer -->
      <div style="background: #1C1C1A; padding: 20px 40px; text-align: center;">
        <p style="color: #5C4E3E; font-size: 11px; margin: 0;">
          © ${new Date().getFullYear()} Zariwala. All rights reserved. · hello@zariwala.com
        </p>
      </div>
    </div>
  `

  return sendBrevoEmail({
    to: [{ email: sellerEmail, name: sellerName }],
    subject,
    htmlContent,
  })
}

// ─── Admin Notification Email ───────────────────────────────────

export async function sendAdminNotificationEmail(inquiry: {
  reference: string
  sellerName: string
  contactMethod: string
  categories: string[]
  itemCount: number
}): Promise<boolean> {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL
  if (!adminEmail) {
    console.warn('[Email] ADMIN_NOTIFICATION_EMAIL not set — skipping admin notification')
    return false
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://zariwala.com'
  const subject = `🆕 Zariwala Inquiry: ${inquiry.reference} — ${inquiry.sellerName}`

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 24px;">
      <h2 style="color: #1C1C1A; font-family: Georgia, serif;">New Zariwala Inquiry</h2>
      <table style="width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden; border: 1px solid #DDD3C3;">
        <tr><td style="padding: 12px 16px; border-bottom: 1px solid #f0ebe4; font-weight: bold; width: 140px; color: #7A6E65;">Reference</td><td style="padding: 12px 16px; border-bottom: 1px solid #f0ebe4; font-family: monospace; font-size: 16px; color: #B8860B;">${inquiry.reference}</td></tr>
        <tr><td style="padding: 12px 16px; border-bottom: 1px solid #f0ebe4; font-weight: bold; color: #7A6E65;">Seller</td><td style="padding: 12px 16px; border-bottom: 1px solid #f0ebe4;">${inquiry.sellerName}</td></tr>
        <tr><td style="padding: 12px 16px; border-bottom: 1px solid #f0ebe4; font-weight: bold; color: #7A6E65;">Contact</td><td style="padding: 12px 16px; border-bottom: 1px solid #f0ebe4;">${inquiry.contactMethod}</td></tr>
        <tr><td style="padding: 12px 16px; border-bottom: 1px solid #f0ebe4; font-weight: bold; color: #7A6E65;">Category</td><td style="padding: 12px 16px; border-bottom: 1px solid #f0ebe4;">${inquiry.categories.join(', ')}</td></tr>
        <tr><td style="padding: 12px 16px; font-weight: bold; color: #7A6E65;">Items</td><td style="padding: 12px 16px;">~${inquiry.itemCount}</td></tr>
      </table>
      <div style="text-align: center; margin-top: 24px;">
        <a href="${appUrl}/admin/inquiries"
           style="display: inline-block; background: #1C1C1A; color: #fff; font-weight: bold; font-size: 14px; padding: 12px 28px; border-radius: 9999px; text-decoration: none;">
          View in Admin Panel →
        </a>
      </div>
    </div>
  `

  return sendBrevoEmail({
    to: [{ email: adminEmail }],
    subject,
    htmlContent,
  })
}
