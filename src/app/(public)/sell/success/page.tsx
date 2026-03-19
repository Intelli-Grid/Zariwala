'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef } from 'react'
import { buildPostFormLink } from '@/lib/whatsapp'
import { sendGAEvent } from '@next/third-parties/google'

const WA_ICON = (
  <svg className="w-5 h-5 fill-white flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M11.974 0C5.364 0 0 5.363 0 11.973c0 2.105.553 4.076 1.514 5.782L.057 23.143l5.557-1.457a11.94 11.94 0 005.36 1.277h.005C17.584 22.963 24 17.6 24 10.989 24 5.38 18.584 0 11.974 0z" />
  </svg>
)

function SuccessContent() {
  const searchParams = useSearchParams()
  const ref = searchParams.get('ref') ?? ''
  const name = searchParams.get('name') ?? 'there'
  const fired = useRef(false)

  useEffect(() => {
    if (!fired.current) {
      sendGAEvent({ event: 'sell_form_completed', value: { ref } })
      fired.current = true
    }
  }, [ref])

  const waHref = ref && name
    ? buildPostFormLink(name, ref)
    : `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '1XXXXXXXXXX'}`

  return (
    <div style={{ background: 'var(--zari-pale)' }} className="min-h-[78vh] flex items-center justify-center py-20 px-4">
      <div className="max-w-xl mx-auto text-center">

        {/* Checkmark circle */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg"
          style={{ background: 'var(--forest)', boxShadow: '0 8px 24px rgba(45,74,62,0.3)' }}
        >
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="font-display text-4xl md:text-5xl mb-4" style={{ color: 'var(--ink)' }}>
          Inquiry Received 🪡
        </h1>

        {ref && (
          <div
            className="rounded-xl px-6 py-4 inline-block mb-8"
            style={{ background: 'var(--ink)' }}
          >
            <p className="font-ui text-xs uppercase tracking-[0.2em] mb-1" style={{ color: 'var(--muted)' }}>
              Your Reference Number
            </p>
            <p className="font-display text-2xl tracking-widest" style={{ color: 'var(--zari-gold)' }}>
              {ref}
            </p>
            <p className="font-ui text-xs mt-1" style={{ color: 'var(--muted)' }}>
              Keep this for your records
            </p>
          </div>
        )}

        <p className="font-body text-lg leading-relaxed mb-4" style={{ color: 'var(--body-color)' }}>
          Thank you, <strong>{name}</strong>. Our vintage specialists will review your photos and respond to you on WhatsApp within <strong>24 hours</strong>.
        </p>

        <p className="font-body text-base leading-relaxed mb-10" style={{ color: 'var(--muted)' }}>
          You can also message us now to add more photos, ask a question, or check in on your inquiry.
        </p>

        {/* WhatsApp primary action — no Telegram on success page */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            id="success-whatsapp-followup"
            className="btn-whatsapp py-4 px-8 text-base inline-flex items-center justify-center gap-3 hover:-translate-y-1 transition-transform shadow-lg"
          >
            {WA_ICON}
            Confirm on WhatsApp
          </a>
          <Link
            href="/"
            className="btn-ghost py-4 px-8 text-base hover:-translate-y-1 transition-transform"
          >
            Return Home
          </Link>
        </div>

        {/* What happens next */}
        <div
          className="rounded-2xl p-6 text-left"
          style={{ background: '#fff', border: '1px solid var(--border)', boxShadow: '0 2px 12px rgba(28,28,26,0.04)' }}
        >
          <h2 className="font-display text-xl mb-5" style={{ color: 'var(--ink)' }}>
            What Happens Next?
          </h2>
          <ol className="space-y-4">
            {[
              { step: '1', text: 'Our team reviews your photos and item description within 24 hours.' },
              { step: '2', text: 'You receive a personal WhatsApp message with your offer — or follow-up questions.' },
              { step: '3', text: 'Accept the offer → we arrange shipping or collection. Decline → no obligation, no follow-up.' },
            ].map(s => (
              <li key={s.step} className="flex gap-4 items-start">
                <span
                  className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-ui font-semibold text-sm text-white"
                  style={{ background: 'var(--zari-gold)' }}
                >
                  {s.step}
                </span>
                <p className="font-body text-sm leading-relaxed pt-0.5" style={{ color: 'var(--body-color)' }}>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>

      </div>
    </div>
  )
}

export default function SellSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[78vh] flex items-center justify-center font-ui text-[var(--muted)]">
        Loading…
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
