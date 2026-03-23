'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { href: '/what-we-buy', label: 'What We Buy' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/valuation-guide', label: 'Valuation Guide' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-[0_2px_20px_rgba(28,28,26,0.08)]'
          : 'bg-[var(--zari-pale)]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo — emblem + wordmark */}
          <Link href="/" className="flex items-center gap-2.5 group" id="header-logo">
            <Image
              src="/zariwala-logo.png"
              alt="Zariwala logo"
              width={40}
              height={40}
              className="rounded-sm object-contain flex-shrink-0"
              priority
            />
            <span className="flex flex-col leading-none">
              <span
                className="font-display text-2xl md:text-3xl font-bold tracking-tight transition-colors duration-200"
                style={{ color: 'var(--ink)', letterSpacing: '-0.02em' }}
              >
                Zariwala
              </span>
              <span
                className="font-ui text-[10px] tracking-[0.22em] uppercase transition-colors duration-200"
                style={{ color: 'var(--zari-gold)', marginTop: '-1px' }}
              >
                Vintage Clothing Buyers
              </span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-ui text-sm font-medium transition-colors duration-200 hover:text-[var(--zari-gold)]"
                style={{ color: 'var(--body-color)' }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Primary WhatsApp CTA */}
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '1XXXXXXXXXX'}?text=${encodeURIComponent("Hi Zariwala! I have some vintage clothing I'd like to sell.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex btn-whatsapp text-sm px-5 py-2.5"
              id="header-whatsapp-cta"
            >
              {/* WhatsApp icon */}
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white flex-shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M11.974 0C5.364 0 0 5.363 0 11.973c0 2.105.553 4.076 1.514 5.782L.057 23.143l5.557-1.457a11.94 11.94 0 005.36 1.277h.005C17.584 22.963 24 17.6 24 10.989 24 5.38 18.584 0 11.974 0z" />
              </svg>
              Get a Quote
            </a>

            {/* Sell CTA */}
            <Link
              href="/sell"
              className="hidden md:inline-flex btn-primary text-sm px-5 py-2.5"
              id="header-sell-cta"
            >
              Sell Now
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-full hover:bg-[var(--zari-warm)] transition-colors"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen
                ? <X size={20} style={{ color: 'var(--ink)' }} />
                : <Menu size={20} style={{ color: 'var(--ink)' }} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t shadow-lg" style={{ borderColor: 'var(--border)' }}>
          <nav className="px-4 py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="py-2.5 px-3 rounded-lg font-ui text-sm font-medium transition-colors hover:bg-[var(--zari-warm)]"
                style={{ color: 'var(--body-color)' }}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2">
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '1XXXXXXXXXX'}?text=${encodeURIComponent("Hi Zariwala! I have vintage clothing to sell.")}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="btn-whatsapp text-center text-sm py-3"
              >
                💬 Send Photos on WhatsApp
              </a>
              <Link
                href="/sell"
                onClick={() => setMenuOpen(false)}
                className="btn-ghost text-center text-sm py-3"
              >
                Submit an Inquiry
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
