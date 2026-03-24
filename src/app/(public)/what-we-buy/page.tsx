import Image from 'next/image'
import Link from 'next/link'
import { CATEGORIES } from '@/lib/categories'
import { WA_LINKS } from '@/lib/whatsapp'

const WA_ICON = (
  <svg className="w-5 h-5 fill-white flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M11.974 0C5.364 0 0 5.363 0 11.973c0 2.105.553 4.076 1.514 5.782L.057 23.143l5.557-1.457a11.94 11.94 0 005.36 1.277h.005C17.584 22.963 24 17.6 24 10.989 24 5.38 18.584 0 11.974 0z" />
  </svg>
)

export const metadata = {
  title: 'What We Buy | Zariwala — Zari & Silk Specialists',
  description:
    'Zariwala buys Zari Sarees, Pure Silk, Banarasi Silks, Heritage Brocades, Lehengas, Dupattas, Blouses & Vintage Fabric. Fair prices, 24-hr valuations. Send photos via WhatsApp.',
}

export default function WhatWeBuyPage() {
  return (
    <div style={{ background: 'var(--surface-void)' }}>

      {/* ─── HERO — DARK ─── */}
      <section
        className="py-20 text-center dark-section textured-section"
        style={{ background: 'var(--surface-deep)' }}
      >
        <div className="max-w-4xl mx-auto px-4">
          <span className="eyebrow" style={{ color: 'var(--gold-bright)' }}>✦ WHAT WE BUY</span>
          <div className="section-divider-gold mx-auto mb-6 w-20" />
          <h1
            className="font-display text-5xl md:text-6xl mb-6"
            style={{ color: 'var(--text-on-dark)', letterSpacing: '-0.02em' }}
          >
            Zari &amp; Silk,{' '}
            <em style={{ color: 'var(--gold-bright)', fontStyle: 'italic' }}>Every Tradition</em>
          </h1>
          <p className="font-body text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--text-on-dark-sub)' }}>
            From Banarasi brocades to Kanjivaram silks — if it carries the weight
            of a loom and the gold of a craftsman, we buy it.
          </p>
        </div>
      </section>

      {/* ─── CATEGORY GRID — DARK ─── */}
      <section className="py-20 dark-section textured-section" style={{ background: 'var(--surface-dark)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* 4-column desktop grid per strategy spec */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CATEGORIES.map((cat) => {
              const ctaHref = cat.ctaType === 'valuation'
                ? `/valuation-guide?category=${cat.slug}`
                : `/sell?category=${cat.slug}`

              return (
                <div
                  key={cat.id}
                  className="group flex flex-col overflow-hidden hover:-translate-y-1 hover:shadow-[var(--shadow-gold-lift)]"
                  style={{
                    background: 'var(--surface-deep)',
                    border: '1px solid var(--border-on-dark)',
                    borderTop: '3px solid var(--gold-core)',
                    borderRadius: 6,
                    boxShadow: 'var(--shadow-card)',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  }}
                >
                  {/* 4:3 image with Ken Burns hover */}
                  <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
                    <Image
                      src={`https://images.unsplash.com/photo-${cat.img}?auto=format&fit=crop&q=75&w=600`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      alt={cat.name}
                      className="object-cover transition-all duration-700 group-hover:scale-[1.07]"
                      style={{ filter: 'brightness(0.72) sepia(0.18)' }}
                    />
                    {/* Bottom gradient for text legibility */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(to top, rgba(14,14,12,0.85) 0%, transparent 55%)',
                      }}
                    />
                    {/* Eyebrow floats over image */}
                    <div className="absolute bottom-3 left-4 right-4">
                      <span
                        className="font-ui text-[0.65rem] font-semibold tracking-[0.18em] uppercase"
                        style={{ color: 'var(--gold-bright)' }}
                      >
                        ✦ {cat.eyebrow}
                      </span>
                    </div>
                    {/* Gold shimmer on hover */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        background: 'linear-gradient(135deg, transparent 0%, rgba(212,175,55,0.07) 50%, transparent 100%)',
                      }}
                    />
                  </div>

                  {/* Card body */}
                  <div className="p-5 flex flex-col flex-1">
                    <h2
                      className="font-display text-lg mb-1"
                      style={{ color: 'var(--text-on-dark)' }}
                    >
                      {cat.name}
                    </h2>
                    <p
                      className="font-body text-sm leading-snug mb-4 flex-1"
                      style={{ color: 'var(--text-on-dark-mute)' }}
                    >
                      {cat.descriptor}
                    </p>

                    {/* Price + CTA row */}
                    <div className="flex items-center justify-between mt-auto pt-3" style={{ borderTop: '1px solid var(--border-on-dark)' }}>
                      <span
                        className="font-ui text-[0.8rem] font-bold"
                        style={{ color: 'var(--gold-bright)' }}
                      >
                        {cat.priceRange.display}
                      </span>
                      <Link
                        href={ctaHref}
                        className="font-ui text-[0.8rem] font-semibold tracking-wide transition-colors hover:opacity-80"
                        style={{ color: 'var(--gold-bright)' }}
                      >
                        {cat.cta} →
                      </Link>
                    </div>

                    {/* WhatsApp quick-link */}
                    <a
                      href={(WA_LINKS as Record<string, string>)[cat.waKey]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 flex items-center justify-center gap-2 py-2 rounded font-ui text-xs font-semibold transition-opacity hover:opacity-80"
                      style={{
                        background: '#25D366',
                        color: '#fff',
                      }}
                    >
                      {WA_ICON}
                      Send Photos on WhatsApp
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── CONDITION NOTE — LIGHT ─── */}
      <section className="py-20 light-section" style={{ background: 'var(--surface-pale)' }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <span className="eyebrow">✦ OUR PROMISE</span>
          <h2 className="font-display text-3xl md:text-4xl mb-6" style={{ color: 'var(--text-on-light)' }}>
            We Buy Every Condition
          </h2>
          <p className="font-body text-lg leading-relaxed mb-10" style={{ color: 'var(--text-on-light-sub)' }}>
            We buy Zari and silk pieces in all conditions — from pristine unworn heirlooms
            to well-loved everyday sarees. Fading, minor repairs, or storage marks rarely
            affect our offer. The weave tells its own story.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
            {[
              { label: 'Excellent', note: 'Full value' },
              { label: 'Good', note: 'Strong offer' },
              { label: 'Fair', note: 'Still wanted' },
              { label: 'Poor', note: 'Ask us first' },
            ].map(c => (
              <div
                key={c.label}
                className="p-4 rounded-xl text-center"
                style={{ background: 'var(--surface-white)', border: '1px solid var(--border-on-light)' }}
              >
                <p className="font-display text-lg mb-0.5" style={{ color: 'var(--text-on-light)' }}>{c.label}</p>
                <p className="font-ui text-xs" style={{ color: 'var(--gold-shadow)' }}>{c.note}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href={WA_LINKS.whatWeBuy}
              target="_blank"
              rel="noopener noreferrer"
              id="what-we-buy-wa-cta"
              className="btn-whatsapp py-4 px-8 text-base inline-flex items-center gap-3 hover:-translate-y-1 transition-transform"
            >
              {WA_ICON}
              Send Photos on WhatsApp
            </a>
            <Link
              href="/valuation-guide"
              className="btn-secondary-dark py-4 px-8 text-base hover:-translate-y-1 transition-transform"
              style={{ borderColor: 'var(--border-on-light)', color: 'var(--text-on-light-sub)' }}
            >
              Use the Free Valuation Guide
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
