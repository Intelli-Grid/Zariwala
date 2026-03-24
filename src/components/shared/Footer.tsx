import Link from 'next/link'
import Image from 'next/image'

const COMPANY_LINKS = [
  { href: '/about', label: 'About Us' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/contact', label: 'Contact' },
]

const SELL_LINKS = [
  { href: '/sell', label: 'Sell Your Clothing' },
  { href: '/what-we-buy', label: 'What We Buy' },
  { href: '/valuation-guide', label: 'Valuation Guide' },
  { href: '/packing-guide', label: 'Packing Guide' },
  { href: '/shipping-info', label: 'Shipping Info' },
]

const LEARN_LINKS = [
  { href: '/blog', label: 'Blog' },
  { href: '/faq', label: 'FAQ' },
  { href: '/valuation-guide', label: 'Price Guide' },
]

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '1XXXXXXXXXX'
const TG_COMMUNITY = process.env.NEXT_PUBLIC_TELEGRAM_COMMUNITY ?? 'zariwala'

const WA_ICON = (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white flex-shrink-0" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M11.974 0C5.364 0 0 5.363 0 11.973c0 2.105.553 4.076 1.514 5.782L.057 23.143l5.557-1.457a11.94 11.94 0 005.36 1.277h.005C17.584 22.963 24 17.6 24 10.989 24 5.38 18.584 0 11.974 0z" />
  </svg>
)

export function Footer() {
  return (
    <footer style={{ background: 'var(--ink)', color: 'var(--zari-warm)' }}>
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-5">
              <Image
                src="/zariwala-logo.png"
                alt="Zariwala"
                width={48}
                height={48}
                className="mb-3 opacity-90 rounded-sm"
              />
              <h2 className="font-display text-3xl font-bold" style={{ color: 'var(--text-on-dark)' }}>
                Zariwala
              </h2>
              <p className="font-ui text-[11px] tracking-[0.22em] uppercase mt-0.5" style={{ color: 'var(--gold-core)' }}>
                Vintage Clothing Buyers
              </p>
            </div>
            <p className="font-body text-sm leading-relaxed mb-6" style={{ color: 'var(--border)' }}>
              We purchase vintage clothing from sellers worldwide. Honest valuations, fair prices, and a simple process — all via WhatsApp.
            </p>

            {/* WhatsApp — the ONLY direct contact CTA */}
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hi Zariwala! I have vintage clothing I'd like to sell.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp text-sm px-4 py-2.5 mb-4 inline-flex"
              id="footer-whatsapp-cta"
              aria-label="Contact Zariwala on WhatsApp"
            >
              {WA_ICON}
              WhatsApp Us
            </a>

            {/* Telegram — community link only, clearly framed as such */}
            <div className="mt-3" style={{ color: 'var(--muted)' }}>
              <p className="font-body text-xs leading-relaxed mb-1">
                🪡 Love vintage? Join the Zariwala community for valuation tips, style guides, and updates.
              </p>
              <a
                href={`https://t.me/${TG_COMMUNITY}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-ui text-xs underline underline-offset-2 transition-colors hover:text-[var(--zari-warm)]"
                style={{ color: 'var(--muted)' }}
                id="footer-telegram-community"
                aria-label="Join Zariwala Telegram community channel"
              >
                Join our Telegram community →
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-ui text-xs font-semibold uppercase tracking-[0.12em] mb-4" style={{ color: 'var(--zari-gold)' }}>
              Company
            </h3>
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="font-body text-sm transition-colors hover:text-[var(--zari-warm)]"
                    style={{ color: 'var(--border)' }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sell */}
          <div>
            <h3 className="font-ui text-xs font-semibold uppercase tracking-[0.12em] mb-4" style={{ color: 'var(--zari-gold)' }}>
              Sell
            </h3>
            <ul className="space-y-2.5">
              {SELL_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="font-body text-sm transition-colors hover:text-[var(--zari-warm)]"
                    style={{ color: 'var(--border)' }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Learn */}
          <div>
            <h3 className="font-ui text-xs font-semibold uppercase tracking-[0.12em] mb-4" style={{ color: 'var(--zari-gold)' }}>
              Learn
            </h3>
            <ul className="space-y-2.5">
              {LEARN_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="font-body text-sm transition-colors hover:text-[var(--zari-warm)]"
                    style={{ color: 'var(--border)' }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Gold gradient base line */}
      <div style={{
        height: '1px',
        background: 'linear-gradient(to right, transparent, var(--gold-core), transparent)',
        opacity: 0.35,
      }} />

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid var(--border-on-dark)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs" style={{ color: 'var(--muted)' }}>
            © {new Date().getFullYear()} Zariwala. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="font-ui text-xs transition-colors hover:text-[var(--border)]" style={{ color: 'var(--muted)' }}>
              Privacy Policy
            </Link>
            <Link href="/terms-conditions" className="font-ui text-xs transition-colors hover:text-[var(--border)]" style={{ color: 'var(--muted)' }}>
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
