'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, MessageCircle } from 'lucide-react'

const STATUSES = [
  'INQUIRY', 'CONFIRMED', 'PAYMENT_PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED',
]

interface Props {
  order: {
    id: string
    status: string
    buyerPhone: string
    buyerName: string
    orderRef: string
    trackingNumber: string
    trackingUrl: string
  }
}

export function OrderDetailActions({ order }: Props) {
  const router = useRouter()
  const [status, setStatus] = useState(order.status)
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber)
  const [trackingUrl, setTrackingUrl] = useState(order.trackingUrl)
  const [adminNotes, setAdminNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, trackingNumber, trackingUrl, adminNotes: adminNotes || undefined }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  const waMsg = (msg: string) =>
    `https://wa.me/91${order.buyerPhone}?text=${encodeURIComponent(msg)}`

  const quickMessages = [
    {
      label: 'Order confirmed',
      text: `Hi ${order.buyerName}! Your order ${order.orderRef} has been confirmed. We're preparing your piece for dispatch. We'll share tracking details as soon as it ships. 🙏`,
    },
    {
      label: 'Payment reminder',
      text: `Hi ${order.buyerName}, a gentle reminder regarding your order ${order.orderRef}. Please confirm your payment at your earliest convenience so we can ship your piece. Thank you 🙏`,
    },
    ...(trackingNumber ? [{
      label: 'Share tracking info',
      text: `Hi ${order.buyerName}! Great news — your order ${order.orderRef} has been shipped! 🚚\n\nTracking: ${trackingNumber}${trackingUrl ? `\nTrack here: ${trackingUrl}` : ''}\n\nExpected delivery in 3–5 working days. Do let us know when it arrives! 🙏`,
    }] : []),
    {
      label: 'Delivery follow-up',
      text: `Hi ${order.buyerName}, hope you received your order ${order.orderRef} safely! We'd love to know what you think. Your feedback helps us a lot 🙏`,
    },
  ]

  return (
    <div className="card-heritage p-5 space-y-5" id="order-detail-actions">
      <h2 className="font-playfair text-lg font-bold" style={{ color: 'var(--color-charcoal)' }}>Update Order</h2>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-inter text-xs font-semibold uppercase tracking-wide mb-1.5"
            style={{ color: 'var(--color-gray-dark)' }}>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border text-sm font-hind bg-white focus:outline-none"
            style={{ borderColor: 'var(--color-gray-light)' }}>
            {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
          </select>
        </div>
        <div>
          <label className="block font-inter text-xs font-semibold uppercase tracking-wide mb-1.5"
            style={{ color: 'var(--color-gray-dark)' }}>Tracking Number</label>
          <input type="text" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="e.g. DTDC1234567890"
            className="w-full px-3 py-2.5 rounded-lg border text-sm font-hind focus:outline-none"
            style={{ borderColor: 'var(--color-gray-light)' }} />
        </div>
        <div className="sm:col-span-2">
          <label className="block font-inter text-xs font-semibold uppercase tracking-wide mb-1.5"
            style={{ color: 'var(--color-gray-dark)' }}>Tracking URL</label>
          <input type="url" value={trackingUrl} onChange={(e) => setTrackingUrl(e.target.value)}
            placeholder="https://www.dtdc.com/track/..."
            className="w-full px-3 py-2.5 rounded-lg border text-sm font-hind focus:outline-none"
            style={{ borderColor: 'var(--color-gray-light)' }} />
        </div>
        <div className="sm:col-span-2">
          <label className="block font-inter text-xs font-semibold uppercase tracking-wide mb-1.5"
            style={{ color: 'var(--color-gray-dark)' }}>Admin Note</label>
          <textarea rows={2} value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Internal note visible only to admins…"
            className="w-full px-3 py-2.5 rounded-lg border text-sm font-hind focus:outline-none"
            style={{ borderColor: 'var(--color-gray-light)' }} />
        </div>
      </div>

      <button onClick={handleSave} disabled={saving} id="order-save-btn"
        className="btn-gold text-sm px-6 py-2.5 flex items-center gap-2 disabled:opacity-60">
        {saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : saved ? '✓ Saved!' : 'Save Changes'}
      </button>

      {/* WhatsApp messages */}
      <div className="border-t pt-4" style={{ borderColor: 'var(--color-gray-light)' }}>
        <p className="font-inter text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--color-gray-mid)' }}>
          Quick WhatsApp Messages
        </p>
        <div className="space-y-2">
          {quickMessages.map(({ label, text }) => (
            <a key={label} href={waMsg(text)} target="_blank" rel="noopener noreferrer"
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
