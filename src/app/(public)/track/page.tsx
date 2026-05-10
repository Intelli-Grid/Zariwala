'use client'

import { useState } from 'react'
import Link from 'next/link'

const STATUS_STEPS = [
  { key: 'NEW',        label: 'Inquiry Received',      icon: '📥', desc: 'We have received your submission.' },
  { key: 'REVIEWING',  label: 'Photos Being Reviewed',  icon: '🔍', desc: 'Our specialists are examining your photos.' },
  { key: 'OFFER_SENT', label: 'Offer Sent to You',      icon: '💰', desc: 'A valuation offer has been sent via WhatsApp.' },
  { key: 'ACCEPTED',   label: 'Offer Accepted',         icon: '✅', desc: 'You have accepted our offer. Please ship the item.' },
  { key: 'COMPLETED',  label: 'Payment Sent',           icon: '💳', desc: 'Payment has been processed. Thank you!' },
]

interface TrackResult {
  reference: string
  sellerName: string
  status: string
  category: string | null
  createdAt: string
  itemReceivedAt: string | null
  offerSentAt: string | null
  acceptedAt: string | null
  paidAt: string | null
  completedAt: string | null
}

export default function TrackPage() {
  const [ref, setRef] = useState('')
  const [result, setResult] = useState<TrackResult | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleTrack = async () => {
    const trimmed = ref.trim().toUpperCase()
    if (!trimmed) return
    setLoading(true)
    setError('')
    setResult(null)

    const res = await fetch('/api/track?ref=' + encodeURIComponent(trimmed)).catch(() => null)
    if (!res) {
      setError('Network error. Please try again.')
      setLoading(false)
      return
    }
    const data = await res.json()
    setLoading(false)
    if (!res.ok) setError(data.error || 'Reference not found.')
    else setResult(data)
  }

  const currentStepIndex = result
    ? STATUS_STEPS.findIndex((s) => s.key === result.status)
    : -1

  return (
    <div className="py-20 min-h-[80vh]" style={{ background: 'var(--surface-pale)' }}>
      <div className="max-w-lg mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-10">
          <span className="eyebrow light-section">✦ Order Tracking</span>
          <h1 className="font-display text-4xl md:text-5xl" style={{ color: 'var(--text-on-light)' }}>
            Track Your Inquiry
          </h1>
          <p className="font-body mt-3 text-base leading-relaxed" style={{ color: 'var(--text-on-light-sub)' }}>
            Enter your reference number (format: <code className="font-mono text-sm bg-white px-1.5 py-0.5 rounded border">ZRW-2024-XXXXX</code>) to see the current status of your item.
          </p>
        </div>

        {/* Input row */}
        <div className="flex gap-3 mb-6">
          <input
            className="field-input flex-1 uppercase tracking-wider"
            placeholder="ZRW-2024-XXXXX"
            value={ref}
            onChange={(e) => setRef(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
            maxLength={20}
            aria-label="Reference number"
            id="track-reference-input"
          />
          <button
            onClick={handleTrack}
            disabled={loading || !ref.trim()}
            className="btn-sell-now px-6 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            id="track-submit-btn"
          >
            {loading ? '...' : 'Track →'}
          </button>
        </div>

        {/* Error state */}
        {error && (
          <div className="p-4 rounded-xl mb-6 text-sm font-body text-center" style={{ background: '#FEF2F2', color: '#C0392B', border: '1px solid #FECACA' }}>
            {error}
          </div>
        )}

        {/* Result card */}
        {result && (
          <div className="rounded-2xl overflow-hidden shadow-sm" style={{ background: 'var(--surface-white)', border: '1px solid var(--border-on-light)' }}>
            {/* Header band */}
            <div className="px-6 py-4" style={{ background: 'var(--surface-deep)', borderBottom: '3px solid var(--gold-core)' }}>
              <p className="font-ui text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--gold-bright)' }}>Reference</p>
              <p className="font-display text-xl font-bold" style={{ color: 'var(--text-on-dark)' }}>{result.reference}</p>
              {result.category && (
                <p className="font-body text-sm mt-1" style={{ color: 'var(--text-on-dark-sub)' }}>{result.category}</p>
              )}
            </div>

            {/* Progress stepper */}
            <div className="p-6 space-y-5">
              {STATUS_STEPS.map((step, i) => {
                const done = i <= currentStepIndex
                const active = i === currentStepIndex
                return (
                  <div key={step.key} className="flex items-start gap-4">
                    {/* Icon circle */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-base flex-shrink-0 transition-all duration-300"
                      style={{
                        background: done ? 'var(--gold-core)' : 'var(--surface-pale)',
                        border: `2px solid ${done ? 'var(--gold-core)' : 'var(--border-on-light)'}`,
                        boxShadow: active ? '0 0 0 4px rgba(184,134,11,0.15)' : 'none',
                      }}
                    >
                      <span style={{ filter: done ? 'none' : 'grayscale(1)', opacity: done ? 1 : 0.4 }}>
                        {step.icon}
                      </span>
                    </div>

                    {/* Label + connector line */}
                    <div className="flex-1 min-w-0 pt-1">
                      <div className="flex items-center gap-2">
                        <p
                          className="font-ui text-sm font-semibold"
                          style={{ color: active ? 'var(--gold-shadow)' : done ? 'var(--text-on-light)' : 'var(--text-on-light-mute)' }}
                        >
                          {step.label}
                        </p>
                        {active && (
                          <span className="font-ui text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--surface-mid)', color: 'var(--gold-shadow)' }}>
                            Current
                          </span>
                        )}
                      </div>
                      {active && (
                        <p className="font-body text-xs mt-0.5" style={{ color: 'var(--text-on-light-mute)' }}>
                          {step.desc}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* WhatsApp help footer */}
            <div className="px-6 pb-6">
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''}?text=${encodeURIComponent('Hi Zariwala! I have a question about my inquiry ' + result.reference)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp w-full justify-center py-3 text-sm"
                id="track-whatsapp-help"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white flex-shrink-0" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M11.974 0C5.364 0 0 5.363 0 11.973c0 2.105.553 4.076 1.514 5.782L.057 23.143l5.557-1.457a11.94 11.94 0 005.36 1.277h.005C17.584 22.963 24 17.6 24 10.989 24 5.38 18.584 0 11.974 0z" />
                </svg>
                Ask a Question on WhatsApp
              </a>
            </div>
          </div>
        )}

        {/* Back link */}
        <div className="text-center mt-8">
          <Link href="/sell" className="font-ui text-sm" style={{ color: 'var(--text-on-light-mute)' }}>
            ← Start a new inquiry
          </Link>
        </div>
      </div>
    </div>
  )
}
