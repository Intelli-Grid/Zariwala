import Link from 'next/link'
import { WA_LINKS } from '@/lib/whatsapp'

export const metadata = {
  title: 'How It Works | Zariwala',
  description:
    'Selling your vintage clothing to Zariwala is simple — send photos on WhatsApp, get a fair offer in 24 hours, ship & get paid.',
}

const WA_ICON = (
  <svg className="w-5 h-5 fill-white flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M11.974 0C5.364 0 0 5.363 0 11.973c0 2.105.553 4.076 1.514 5.782L.057 23.143l5.557-1.457a11.94 11.94 0 005.36 1.277h.005C17.584 22.963 24 17.6 24 10.989 24 5.38 18.584 0 11.974 0z" />
  </svg>
)

const STEPS = [
  {
    n: '1',
    title: 'Take Photos',
    body: 'Gather the vintage pieces you want to sell. For each item, take clear photos — full front, tags/labels, any notable details, and honest shots of any wear or damage.',
    note: 'Tip: Natural daylight gives the most accurate colours. No studio needed.',
  },
  {
    n: '2',
    title: 'Send Photos on WhatsApp',
    body: 'Message Zariwala directly on WhatsApp and share your photos. Our expert team will review your submission within 24 hours and send a fair, no-obligation offer based on current market values.',
    note: 'WhatsApp is the fastest way — we reply faster there than anywhere else.',
    cta: true,
  },
  {
    n: '3',
    title: 'Get Your Offer',
    body: 'We confirm era, brand, and condition and send you a personalised cash offer on WhatsApp. No pressure — take as much time as you need to decide.',
    note: null,
  },
  {
    n: '4',
    title: 'Ship & Get Paid',
    body: 'Accept the offer and ship your items. For US and UK sellers we can provide a pre-paid label. Payment is processed within 24 hours of receiving and verifying the items.',
    note: 'We accept bank transfer, PayPal, Wise, and other methods.',
  },
]

export default function HowItWorksPage() {
  return (
    <div style={{ background: 'var(--zari-pale)' }} className="py-20 lg:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-20">
          <p className="font-ui text-xs font-semibold uppercase tracking-[0.22em] mb-4" style={{ color: 'var(--zari-gold)' }}>
            The Zariwala Process
          </p>
          <h1 className="font-display text-4xl md:text-5xl mb-5" style={{ color: 'var(--ink)' }}>
            How It Works
          </h1>
          <p className="font-body text-lg leading-relaxed max-w-xl mx-auto" style={{ color: 'var(--muted)' }}>
            We've streamlined selling to be as effortless as possible. No complicated forms, no hidden fees — just fair valuations and quick payments via WhatsApp.
          </p>
        </div>

        {/* Steps timeline */}
        <div
          className="relative border-l-2 ml-5 sm:ml-8 space-y-16 py-4"
          style={{ borderColor: 'var(--zari-gold)' }}
        >
          {STEPS.map((step) => (
            <div key={step.n} className="relative pl-10 sm:pl-16">
              {/* Step number circle */}
              <div
                className="absolute -left-6 sm:-left-8 top-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center font-display text-2xl shadow-lg"
                style={{ background: 'var(--zari-gold)', color: '#fff' }}
              >
                {step.n}
              </div>

              <h2 className="font-display text-2xl md:text-3xl mb-4" style={{ color: 'var(--ink)' }}>
                {step.title}
              </h2>
              <p className="font-body text-lg leading-relaxed mb-4" style={{ color: 'var(--body-color)' }}>
                {step.body}
              </p>

              {step.note && (
                <p className="font-ui text-sm py-3 px-4 rounded-lg mb-4" style={{ background: 'var(--zari-warm)', color: 'var(--muted)' }}>
                  💡 {step.note}
                </p>
              )}

              {/* WhatsApp CTA on step 2 */}
              {step.cta && (
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <a
                    href={WA_LINKS.howItWorks}
                    target="_blank"
                    rel="noopener noreferrer"
                    id="how-it-works-whatsapp-cta"
                    className="btn-whatsapp py-3 px-6 inline-flex items-center gap-3 shadow hover:-translate-y-1 transition-transform"
                  >
                    {WA_ICON}
                    Send Photos on WhatsApp
                  </a>
                  <Link
                    href="/sell"
                    className="btn-ghost py-3 px-6 hover:-translate-y-1 transition-transform"
                  >
                    Use the Online Form
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div
          className="mt-24 rounded-2xl p-10 text-center"
          style={{ background: 'var(--ink)' }}
        >
          <h2 className="font-display text-3xl mb-4" style={{ color: 'var(--zari-warm)' }}>
            Ready to see what your collection is worth?
          </h2>
          <p className="font-body text-base mb-8" style={{ color: 'var(--muted)' }}>
            Free, no-obligation valuations. Average response: under 4 hours.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href={WA_LINKS.howItWorks}
              target="_blank"
              rel="noopener noreferrer"
              id="how-it-works-bottom-cta"
              className="btn-whatsapp py-4 px-8 text-base inline-flex items-center justify-center gap-3 hover:-translate-y-1 transition-transform shadow-xl"
            >
              {WA_ICON}
              Start on WhatsApp
            </a>
            <Link
              href="/sell"
              className="btn-ghost py-4 px-8 text-base hover:-translate-y-1 transition-transform"
              style={{ borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}
            >
              Use Inquiry Form
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
