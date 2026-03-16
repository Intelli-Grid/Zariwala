import type { Metadata } from 'next'
import Link from 'next/link'
import { Package, Clock, ChevronRight, AlertCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Shipping Information | Zariwala',
  description: 'Learn how to ship your vintage clothing to us from the US, UK, or Asia. We provide full guidance and can arrange prepaid labels for US and UK sellers.',
}

const regions = [
  {
    flag: '🇺🇸',
    name: 'United States',
    carriers: ['USPS Priority Mail (recommended)', 'UPS Ground / UPS SurePost', 'FedEx Ground'],
    prepaidLabel: true,
    prepaidNote: 'We can arrange a prepaid USPS Priority Mail label — cost is deducted from your offer amount.',
    timeframe: '2–5 business days',
    typicalCost: '$8–$18 for one item',
    tips: [
      'Use a sturdy box — avoid plastic bags for garments',
      'Wrap items in tissue or clean plastic to prevent moisture',
      'Include a note with your inquiry reference number',
      'Take a photo of the packed box before sealing',
    ],
  },
  {
    flag: '🇬🇧',
    name: 'United Kingdom',
    carriers: ['Royal Mail Tracked 48 (recommended)', 'Royal Mail Tracked 24', 'Parcelforce 48', 'DPD Local'],
    prepaidLabel: true,
    prepaidNote: 'We can arrange a tracked Royal Mail label — cost deducted from your offer.',
    timeframe: '2–4 business days',
    typicalCost: '£4–£12 for one item',
    tips: [
      'Royal Mail Tracked 48 is the best value for most garments',
      'Declare contents honestly on any customs label',
      'Keep your proof of postage receipt until payment is received',
      'Contact us before shipping if your item is particularly fragile',
    ],
  },
  {
    flag: '🌏',
    name: 'Asia (Japan, Korea, India & Southeast Asia)',
    carriers: ['DHL Express (recommended for speed)', 'FedEx International Priority', 'EMS / Japan Post (for Japan)', 'India Post EMS / Speed Post (for India)'],
    prepaidLabel: false,
    prepaidNote: 'Sellers in Asia typically arrange and pay for their own shipping. Contact us before shipping — for high-value items we may offer to cover or contribute to shipping costs.',
    timeframe: '5–15 business days depending on origin',
    typicalCost: 'Varies widely by country and carrier',
    tips: [
      'DHL Express is fastest and most reliable for international shipments',
      'Declare accurate customs value — under-declaring can cause delays',
      'Use the "Gift" customs category only if genuinely applicable',
      'Message us your tracking number after posting — we\'ll monitor arrival',
    ],
  },
]

export default function ShippingInfoPage() {
  return (
    <div className="bg-[var(--color-ivory)] min-h-screen">
      {/* Hero */}
      <section className="bg-[var(--color-espresso)] py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--color-gold)]/20 text-[var(--color-gold)] text-sm font-bold uppercase tracking-widest rounded-full mb-8 font-body">
            <Package className="w-4 h-4" /> Shipping Guide
          </span>
          <h1 className="font-display text-4xl md:text-5xl text-[var(--color-ivory)] mb-6">
            How to Ship to Us
          </h1>
          <p className="font-body text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
            Once you accept our offer, we make the shipping process as simple as possible. Here's everything you need to know by region.
          </p>
        </div>
      </section>

      {/* Important notice */}
      <section className="py-10 bg-amber-50 border-b border-amber-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4">
            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="font-body text-amber-800 text-sm leading-relaxed">
              <strong>Please don't ship until we've confirmed your offer in writing.</strong>{' '}
              Wait for our explicit confirmation before packing — we'll send you an offer summary with your inquiry reference number and shipping instructions.
            </div>
          </div>
        </div>
      </section>

      {/* Region sections */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {regions.map((region) => (
            <div
              key={region.name}
              className="bg-white rounded-3xl border border-[var(--color-gold)]/10 shadow-sm overflow-hidden"
            >
              {/* Header */}
              <div className="bg-[var(--color-espresso)] px-8 py-6 flex items-center gap-4">
                <span className="text-4xl">{region.flag}</span>
                <div>
                  <h2 className="font-display text-2xl text-[var(--color-ivory)]">{region.name}</h2>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="font-body text-sm text-[var(--color-gold)]">
                      <Clock className="w-3.5 h-3.5 inline mr-1" />
                      {region.timeframe}
                    </span>
                    <span className="font-body text-sm text-gray-400">
                      Typical cost: {region.typicalCost}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-8 grid md:grid-cols-2 gap-10">
                {/* Carriers */}
                <div>
                  <h3 className="font-display text-lg text-[var(--color-espresso)] mb-4">Recommended Carriers</h3>
                  <ul className="space-y-2">
                    {region.carriers.map((carrier, i) => (
                      <li key={i} className="flex items-start gap-3 font-body text-sm text-[var(--color-espresso-mid)]">
                        <span className="text-[var(--color-gold)] mt-0.5 flex-shrink-0">✦</span>
                        <span>{carrier}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Prepaid label info */}
                  <div
                    className={`mt-6 p-4 rounded-xl text-sm font-body leading-relaxed ${
                      region.prepaidLabel
                        ? 'bg-[var(--color-sage)]/10 text-[var(--color-sage)] border border-[var(--color-sage)]/20'
                        : 'bg-[var(--color-ivory-dark)] text-[var(--color-gray-700)]'
                    }`}
                  >
                    {region.prepaidLabel && (
                      <span className="font-semibold block mb-1">✓ Prepaid Label Available</span>
                    )}
                    {region.prepaidNote}
                  </div>
                </div>

                {/* Packing tips */}
                <div>
                  <h3 className="font-display text-lg text-[var(--color-espresso)] mb-4">Packing Tips</h3>
                  <ul className="space-y-3">
                    {region.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-3 font-body text-sm text-[var(--color-espresso-mid)]">
                        <span className="w-5 h-5 rounded-full bg-[var(--color-gold)]/15 text-[var(--color-gold-dark)] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Process reminder */}
      <section className="py-16 bg-[var(--color-ivory-dark)]/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl text-[var(--color-espresso)] mb-8">The Shipping Process</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-left">
            {[
              { step: '1', title: 'Accept Offer', desc: 'Confirm acceptance via WhatsApp or email' },
              { step: '2', title: 'We Confirm', desc: 'We send a written summary with shipping instructions' },
              { step: '3', title: 'Pack & Ship', desc: 'Pack carefully, ship via your agreed carrier' },
              { step: '4', title: 'Get Paid', desc: 'Payment within 24 hrs of item verification' },
            ].map((s) => (
              <div key={s.step} className="relative">
                <div className="bg-white p-5 rounded-2xl border border-[var(--color-gold)]/10 h-full">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-espresso)] text-[var(--color-gold)] font-display font-bold text-lg flex items-center justify-center mb-3">
                    {s.step}
                  </div>
                  <h3 className="font-display text-base text-[var(--color-espresso)] mb-1">{s.title}</h3>
                  <p className="font-body text-xs text-[var(--color-gray-500)] leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-display text-2xl text-[var(--color-espresso)] mb-4">Ready to start?</h2>
          <p className="font-body text-[var(--color-gray-500)] mb-8">Submit your inquiry first — we'll handle the shipping details once we've agreed on a price.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sell" className="btn-primary px-8 py-3">
              Submit an Inquiry
            </Link>
            <Link href="/packing-guide" className="px-8 py-3 border border-[var(--color-gold)]/30 rounded-xl font-body font-medium text-[var(--color-espresso)] hover:bg-[var(--color-ivory-dark)] transition-colors flex items-center gap-2 justify-center">
              Packing Guide <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
