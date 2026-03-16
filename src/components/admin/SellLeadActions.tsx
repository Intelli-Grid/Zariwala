'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MessageCircle, Loader2 } from 'lucide-react'

const STATUSES = [
  'NEW', 'CONTACTED', 'OFFER_MADE', 'ACCEPTED', 'REJECTED', 'PURCHASED',
]

interface Props {
  lead: {
    id: string
    phone: string
    name: string
    status: string
    offerAmount: number | null
    refCode: string
  }
}

export function SellLeadActions({ lead }: Props) {
  const router = useRouter()
  const [status, setStatus] = useState(lead.status)
  const [offerAmount, setOfferAmount] = useState(String(lead.offerAmount ?? ''))
  const [adminNote, setAdminNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const waUrl = (msg: string) =>
    `https://wa.me/91${lead.phone}?text=${encodeURIComponent(msg)}`

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch(`/api/admin/sell-leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          offerAmount: offerAmount ? parseFloat(offerAmount) : null,
          adminNote: adminNote || undefined,
        }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  const quickMessages = [
    {
      label: 'Acknowledge receipt',
      text: `Hi ${lead.name}, thank you for reaching out to Heritage Textile Platform. We've received your sell inquiry (Ref: ${lead.refCode}) and will review your items shortly. We'll respond within 2 hours. 🙏`,
    },
    {
      label: 'Request more photos',
      text: `Hi ${lead.name}, thank you for your inquiry! Could you please share a few more photos? Specifically: (1) close-up of the zari border, (2) the full saree spread out, and (3) any label/tag if present. This helps us give you the most accurate valuation. 🙏`,
    },
    ...(offerAmount ? [{
      label: `Send offer of ₹${parseInt(offerAmount).toLocaleString('en-IN')}`,
      text: `Hi ${lead.name}, we've reviewed your piece (Ref: ${lead.refCode}) and are happy to make an offer of ₹${parseInt(offerAmount).toLocaleString('en-IN')}. This includes collection from your location. If you'd like to proceed, please confirm and we'll arrange the details. 🙏`,
    }] : []),
  ]

  return (
    <div className="card-heritage p-5 space-y-5" id="sell-lead-actions">
      <h2 className="font-playfair text-lg font-bold" style={{ color: 'var(--color-charcoal)' }}>
        Actions
      </h2>

      {/* Status + Offer */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-inter text-xs font-semibold uppercase tracking-wide mb-1.5"
            style={{ color: 'var(--color-gray-dark)' }}>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border text-sm font-hind bg-white focus:outline-none"
            style={{ borderColor: 'var(--color-gray-light)' }}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-inter text-xs font-semibold uppercase tracking-wide mb-1.5"
            style={{ color: 'var(--color-gray-dark)' }}>Offer Amount (₹)</label>
          <input type="number" value={offerAmount} onChange={(e) => setOfferAmount(e.target.value)}
            placeholder="e.g. 8500"
            className="w-full px-3 py-2.5 rounded-lg border text-sm font-hind focus:outline-none"
            style={{ borderColor: 'var(--color-gray-light)' }} />
        </div>
      </div>

      {/* Admin note */}
      <div>
        <label className="block font-inter text-xs font-semibold uppercase tracking-wide mb-1.5"
          style={{ color: 'var(--color-gray-dark)' }}>Internal Note (optional)</label>
        <textarea rows={2} value={adminNote} onChange={(e) => setAdminNote(e.target.value)}
          placeholder="Notes visible only to admins…"
          className="w-full px-3 py-2.5 rounded-lg border text-sm font-hind focus:outline-none"
          style={{ borderColor: 'var(--color-gray-light)' }} />
      </div>

      <button onClick={handleSave} disabled={saving} id="sell-lead-save-btn"
        className="btn-gold text-sm px-6 py-2.5 flex items-center gap-2 disabled:opacity-60">
        {saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : saved ? '✓ Saved!' : 'Save Changes'}
      </button>

      {/* Quick WhatsApp messages */}
      <div className="border-t pt-4" style={{ borderColor: 'var(--color-gray-light)' }}>
        <p className="font-inter text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--color-gray-mid)' }}>
          Quick WhatsApp Messages
        </p>
        <div className="space-y-2">
          {quickMessages.map(({ label, text }) => (
            <a key={label} href={waUrl(text)} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border hover:bg-[var(--color-gold-pale)] transition-colors font-inter text-sm"
              style={{ borderColor: 'var(--color-gray-light)', color: 'var(--color-charcoal)' }}>
              <MessageCircle size={14} style={{ color: 'var(--color-wa-green)' }} />
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
