import { Suspense } from 'react'
import { WhatsAppOfferForm } from '@/components/sell/WhatsAppOfferForm'

export const metadata = {
  title: 'Sell Vintage Clothing | Free WhatsApp Valuation | Zariwala',
  description: 'Submit your vintage clothing, designer archive, or heritage silk pieces for a free, no-obligation valuation via WhatsApp within 24 hours.',
}

export default function SellPage() {
  return (
    <div className="py-16 md:py-24 min-h-[80vh]" style={{ background: 'var(--zari-pale)' }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <p className="font-ui text-xs font-semibold uppercase tracking-[0.22em] mb-4" style={{ color: 'var(--zari-gold)' }}>
            Free WhatsApp Valuation
          </p>
          <h1 className="font-display text-4xl md:text-5xl mb-4" style={{ color: 'var(--ink)' }}>
            Sell Your Collection
          </h1>
          <p className="font-body leading-relaxed" style={{ color: 'var(--muted)' }}>
            Tell us about your vintage pieces. We'll pre-fill a WhatsApp message so you can easily send us photos and descriptions for a fast, free evaluation.
          </p>
        </div>

        <Suspense fallback={<div className="h-64 flex items-center justify-center font-body text-gray-500 animate-pulse">Loading form window...</div>}>
          <WhatsAppOfferForm />
        </Suspense>

        {/* Trust Signals */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center animate-fade-in-up" style={{ color: 'var(--muted)' }}>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-white shadow-sm border" style={{ borderColor: 'var(--zari-gold-light)' }}>
              <span className="text-xl" style={{ color: 'var(--zari-gold)' }}>🛡️</span>
            </div>
            <h3 className="font-ui text-sm font-semibold mb-1" style={{ color: 'var(--ink)' }}>No Obligation</h3>
            <p className="font-body text-xs">You are completely free to decline our offer. Valuations are 100% free.</p>
          </div>
          <div className="flex flex-col items-center">
             <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-white shadow-sm border" style={{ borderColor: 'var(--zari-gold-light)' }}>
              <span className="text-xl" style={{ color: 'var(--zari-gold)' }}>⚡</span>
            </div>
            <h3 className="font-ui text-sm font-semibold mb-1" style={{ color: 'var(--ink)' }}>Fast Responses</h3>
            <p className="font-body text-xs">Quick evaluations and same-day deposits upon securing agreed items.</p>
          </div>
          <div className="flex flex-col items-center">
             <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-white shadow-sm border" style={{ borderColor: 'var(--zari-gold-light)' }}>
              <span className="text-xl" style={{ color: 'var(--zari-gold)' }}>🌍</span>
            </div>
            <h3 className="font-ui text-sm font-semibold mb-1" style={{ color: 'var(--ink)' }}>Global Purchasing</h3>
            <p className="font-body text-xs">We provide pre-paid FedEx labels to sellers worldwide seamlessly.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
