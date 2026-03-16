// MobileStickyBar — Mobile-only fixed bottom bar.
// Tapping leads to /sell page (the multi-step inquiry form).
// Per blueprint: Telegram is NOT in mobile sticky bar. WhatsApp is primary contact,
// but this bar specifically drives users to the structured form.

import Link from 'next/link'

export function MobileStickyBar() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden"
      style={{
        background: 'var(--zari-gold)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        boxShadow: '0 -2px 16px rgba(28,28,26,0.15)',
      }}
    >
      <Link
        href="/sell"
        id="mobile-sticky-sell-bar"
        className="flex items-center justify-center gap-2 w-full py-4 font-ui font-semibold text-base text-white"
        style={{ letterSpacing: '0.02em' }}
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white flex-shrink-0" aria-hidden="true">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
        </svg>
        Sell Your Vintage Clothing →
      </Link>
    </div>
  )
}
