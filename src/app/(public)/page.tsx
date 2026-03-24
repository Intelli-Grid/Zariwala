import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { WA_LINKS } from '@/lib/whatsapp'
import { CATEGORIES } from '@/lib/categories'

const WA_ICON = (
  <svg className="w-5 h-5 fill-white flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M11.974 0C5.364 0 0 5.363 0 11.973c0 2.105.553 4.076 1.514 5.782L.057 23.143l5.557-1.457a11.94 11.94 0 005.36 1.277h.005C17.584 22.963 24 17.6 24 10.989 24 5.38 18.584 0 11.974 0z" />
  </svg>
)



export const metadata = {
  title: 'Zariwala — We Buy Zari & Silk Sarees, Heritage Weaves',
  description:
    'Zariwala buys Zari Sarees, Pure Silk, Banarasi Silks, Heritage Brocades, Lehengas, Dupattas, Blouses & Vintage Fabric from sellers across India. Fair prices, simple process.',
}

export default async function HomePage() {
  const dbTestimonials = await prisma.testimonial
    .findMany({ where: { isVisible: true }, orderBy: { createdAt: 'desc' }, take: 3 })
    .catch(() => [])

  const defaultTestimonials = [
    {
      id: '1',
      rating: 5,
      quote: 'I had some vintage silk sarees that were just sitting in the closet. Zariwala gave me a great price and the pickup was completely hassle-free.',
      name: 'Anjali D.',
      country: 'Mumbai',
      flag: '🇮🇳'
    },
    {
      id: '2',
      rating: 5,
      quote: 'Fastest transaction ever. Sent photos on WhatsApp, got an offer the same day. Payment was in my account the moment they received the items.',
      name: 'Rohan M.',
      country: 'Delhi',
      flag: '🇮🇳'
    },
    {
      id: '3',
      rating: 5,
      quote: 'I was hesitant to sell my vintage collection online, but the team explained their valuation logic perfectly. Transparent and very trustworthy.',
      name: 'Priya S.',
      country: 'Bangalore',
      flag: '🇮🇳'
    }
  ]

  const testimonials = dbTestimonials.length > 0 ? dbTestimonials : defaultTestimonials

  return (
    <>
      {/* ─── HERO — DARK ─── */}
      <section
        className="relative overflow-hidden min-h-[90vh] flex items-center textured-section dark-section"
        style={{ background: 'var(--surface-void)' }}
      >
        {/* Background photo */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=1600"
            alt="Vintage clothing rack — Zariwala buys quality vintage worldwide"
            fill
            sizes="100vw"
            className="object-cover opacity-25"
            priority
          />
          {/* Directional gradient — text side is fully dark */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to right, rgba(14,14,12,0.92) 0%, rgba(14,14,12,0.72) 50%, rgba(14,14,12,0.30) 100%)'
          }} />
        </div>

        {/* Radial gold ambient glow */}
        <div className="absolute pointer-events-none" style={{
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(184,134,11,0.1) 0%, transparent 70%)',
          top: '50%', left: '30%', transform: 'translate(-50%, -50%)',
          zIndex: 0,
        }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full" style={{ zIndex: 1 }}>
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <span className="eyebrow" style={{ color: 'var(--gold-bright)' }}>
              ✦ Vintage Clothing Buyers · Asia
            </span>

            {/* Split headline */}
            <h1
              className="font-display text-5xl md:text-6xl lg:text-7xl leading-[1.05] mb-6 italic"
              style={{
                color: 'var(--text-on-dark)',
                textShadow: '0 2px 40px rgba(184,134,11,0.2)',
              }}
            >
              We Buy Your<br />
              <span style={{ color: 'var(--gold-bright)' }}>Vintage Clothing</span>
            </h1>

            <p className="font-body text-xl mb-4 leading-relaxed font-light max-w-lg" style={{ color: 'var(--text-on-dark-sub)' }}>
              Send us photos on WhatsApp. Get a fair offer in 24 hours.
              We buy vintage clothing, silk sarees, and heritage weaves from across India.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <a
                href={WA_LINKS.homepage}
                target="_blank"
                rel="noopener noreferrer"
                id="hero-whatsapp-cta"
                className="btn-whatsapp btn-whatsapp-pulse justify-center py-4 px-8 text-base shadow-2xl shadow-black/40 hover:-translate-y-1 transition-transform flex items-center gap-3"
              >
                {WA_ICON}
                💬 Send Photos on WhatsApp
              </a>
              <Link
                href="/what-we-buy"
                className="btn-secondary-dark justify-center py-4 px-8 text-base hover:-translate-y-1 transition-transform"
              >
                See What We Buy →
              </Link>
            </div>

            {/* Trust micro-signals */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 font-ui text-sm" style={{ color: 'var(--text-on-dark-mute)' }}>
              <span>✓ 24-hr valuations</span>
              <span>✓ 20+ cities served</span>
              <span>✓ No obligation</span>
              <span>✓ Secure payment</span>
            </div>
          </div>
        </div>

        {/* Gold thread line — draws across bottom of hero on load */}
        <svg className="absolute bottom-0 left-0 w-full" height="2" aria-hidden="true" style={{ zIndex: 1 }}>
          <line x1="0" y1="1" x2="100%" y2="1" style={{
            stroke: 'var(--gold-core)', strokeWidth: 1,
            strokeDasharray: 1400, strokeDashoffset: 1400,
            animation: 'threadDraw 1.8s cubic-bezier(0.22,1,0.36,1) 0.4s forwards',
            opacity: 0.5,
          }} />
        </svg>
      </section>

      {/* ─── TRUST STRIP — DARK ─── */}
      <div
        className="textured-section"
        style={{ background: 'var(--surface-dark)', borderTop: '1px solid var(--border-on-dark)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 md:justify-between font-ui text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-on-dark-mute)' }}>
            <span>✦ 24hr Response Guarantee</span>
            <span>✦ Fair, Transparent Pricing</span>
            <span>✦ India-wide Collection</span>
            <span>✦ Secure Payment</span>
          </div>
        </div>
      </div>

      {/* ─── HOW IT WORKS — LIGHT ─── */}
      <section className="py-24 light-section" style={{ background: 'var(--surface-pale)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="eyebrow">✦ How It Works</span>
            <div className="section-divider-gold mx-auto mb-6 w-16" />
            <h2 className="font-display text-4xl md:text-5xl" style={{ color: 'var(--text-on-light)' }}>
              Simple. Transparent. Fair.
            </h2>
            <p className="font-body text-lg mt-4 max-w-xl mx-auto" style={{ color: 'var(--text-on-light-sub)' }}>
              Five simple steps between your vintage wardrobe and your payment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
            {[
              { n: '1', title: 'Send Photos on WhatsApp', body: 'Message Zariwala on WhatsApp and send clear photos of your items — front, back, labels, and any flaws.' },
              { n: '2', title: 'You Ship for the Valuation', body: 'Ship your item to us for a hands-on valuation. We guide you through the process every step of the way.' },
              { n: '3', title: 'We Make You an Offer', body: 'Our vintage specialists assess your item and make you a fair, transparent cash offer within 24 hours.' },
              { n: '4', title: 'Offer Confirmed', body: 'Happy with the offer? Simply confirm and we take care of everything from here.' },
              { n: '5', title: 'We Pay You', body: 'Receive your payment promptly once the offer is confirmed. Fast, secure, and hassle-free.' },
            ].map((step, i, arr) => (
              <div key={step.n} className="flex flex-col items-center text-center relative">
                {/* Outlined numeral — luxury technique */}
                <div
                  className="font-display font-bold leading-none mb-4"
                  style={{
                    fontSize: 'clamp(3rem, 6vw, 4.5rem)',
                    color: 'transparent',
                    WebkitTextStroke: '1.5px var(--gold-core)',
                  }}
                >
                  {step.n}
                </div>
                {/* Connector line — between steps, on desktop */}
                {i < arr.length - 1 && (
                  <div className="hidden lg:block absolute top-9 left-[calc(50%+2rem)] right-0 section-divider-gold" style={{ width: 'calc(100% - 4rem)' }} />
                )}
                <h3 className="font-display text-xl mb-3" style={{ color: 'var(--text-on-light)' }}>{step.title}</h3>
                <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--text-on-light-sub)' }}>{step.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <a
              href={WA_LINKS.howItWorks}
              target="_blank"
              rel="noopener noreferrer"
              id="how-it-works-wa-cta"
              className="btn-whatsapp py-4 px-10 text-base inline-flex items-center gap-3 hover:-translate-y-1 transition-transform shadow-lg"
            >
              {WA_ICON}
              Start — Send Us Photos on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ─── WHAT WE BUY — DARK ─── */}
      <section
        className="py-24 dark-section textured-section"
        style={{ background: 'var(--surface-deep)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="eyebrow">✦ What We Buy</span>
            <div className="section-divider-gold mx-auto mb-6 w-16" />
            <h2 className="font-display text-4xl md:text-5xl">What We Buy</h2>
            <p className="font-body text-lg mt-4 max-w-2xl mx-auto leading-relaxed">
              Authentic vintage clothing from the 1940s through the late 1990s. From Levi's denim to archive designer labels.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="group relative block overflow-hidden transition-all duration-300 hover:-translate-y-1.5"
                style={{
                  border: '1px solid var(--border-on-dark)',
                  borderTop: '3px solid var(--gold-core)',
                  background: 'var(--surface-dark)',
                  borderRadius: 6,
                  boxShadow: '0 4px 24px rgba(14,14,12,0.55)',
                }}
              >
                {/* Gold shimmer overlay on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, transparent 0%, rgba(212,175,55,0.05) 50%, transparent 100%)',
                    zIndex: 1,
                  }}
                />
                {/* Image */}
                <div className="card-image-wrapper relative h-44 sm:h-52 overflow-hidden">
                  <Image
                    src={cat.img.startsWith('/') ? cat.img : `https://images.unsplash.com/photo-${cat.img}?auto=format&fit=crop&q=75&w=600`}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    alt={cat.name}
                    className="object-cover cat-img transition-transform duration-700 group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(14,14,12,0.9) 0%, transparent 55%)' }} />
                </div>
                {/* Card text */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4" style={{ zIndex: 2 }}>
                  <span className="font-ui text-[0.6rem] font-semibold tracking-[0.16em] uppercase block mb-0.5" style={{ color: 'var(--gold-bright)' }}>✦ {cat.eyebrow}</span>
                  <h3 className="font-display text-base sm:text-lg" style={{ color: 'var(--text-on-dark)' }}>{cat.name}</h3>
                  <span className="font-ui text-xs mt-0.5 block" style={{ color: 'var(--gold-bright)', letterSpacing: '0.04em', fontWeight: 600 }}>
                    {cat.cta} →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/what-we-buy" className="btn-secondary-dark px-8 py-3">
              View Full Category Guide
            </Link>
          </div>
        </div>
      </section>

      {/* ─── VALUATION SNAPSHOT — LIGHT ─── */}
      <section className="py-24 light-section" style={{ background: 'var(--surface-mid)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="eyebrow">✦ What It&apos;s Worth</span>
            <div className="section-divider-gold mx-auto mb-6 w-16" />
            <h2 className="font-display text-4xl md:text-5xl" style={{ color: 'var(--text-on-light)' }}>
              What Could Your Items Be Worth?
            </h2>
            <p className="font-body text-lg mt-4" style={{ color: 'var(--text-on-light-sub)' }}>
              Condition and era make a huge difference. Here are some examples.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {[
              { item: "Levi's 501 Jeans (1970s–80s)", fair: '₹1,500–3,500', good: '₹3,500–8,500', excellent: '₹8,500–35,000+' },
              { item: 'Vintage Band Tee (1970–90)', fair: '₹2,500–5,000', good: '₹5,000–12,500', excellent: '₹12,500–50,000+' },
              { item: 'Heritage Silk Saree / Zari', fair: '₹2,500–6,500', good: '₹6,500–25,000', excellent: '₹25,000–1,50,000+' },
            ].map(row => (
              <div
                key={row.item}
                className="rounded-xl p-6"
                style={{ background: 'var(--surface-white)', border: '1px solid var(--border-on-light)', boxShadow: '0 2px 12px rgba(28,28,26,0.06)' }}
              >
                <p className="font-display text-lg mb-4" style={{ color: 'var(--text-on-light)' }}>{row.item}</p>
                <div className="space-y-1.5 font-ui text-sm">
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-on-light-mute)' }}>Fair condition</span>
                    <span style={{ color: 'var(--text-on-light-sub)' }}>{row.fair}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-on-light-mute)' }}>Good condition</span>
                    <span style={{ color: 'var(--gold-shadow)', fontWeight: 600 }}>{row.good}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: 'var(--text-on-light-mute)' }}>Excellent</span>
                    <span style={{ color: 'var(--gold-shadow)', fontWeight: 700 }}>{row.excellent}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/valuation-guide" className="btn-secondary px-8 py-3.5 mr-4 inline-flex">
              Use Our Free Valuation Guide →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS — DARK ─── */}
      {testimonials.length > 0 && (
        <section
          className="py-24 dark-section textured-section"
          style={{ background: 'var(--surface-void)' }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="eyebrow">✦ Seller Stories</span>
              <div className="section-divider-gold mx-auto mb-6 w-16" />
              <h2 className="font-display text-4xl">What Sellers Say</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t: any) => (
                <div
                  key={t.id}
                  className="flex flex-col p-7 rounded-sm relative overflow-hidden"
                  style={{
                    background: 'var(--surface-dark)',
                    borderLeft: '3px solid var(--gold-core)',
                  }}
                >
                  {/* Oversized opening quote */}
                  <span
                    className="font-display absolute top-4 left-5 leading-none select-none pointer-events-none"
                    style={{ fontSize: '5rem', color: 'var(--gold-core)', opacity: 0.2 }}
                    aria-hidden="true"
                  >
                    &ldquo;
                  </span>
                  {/* Stars */}
                  <div className="flex mb-4 relative z-10">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <span key={i} style={{ color: 'var(--gold-bright)' }} className="text-lg">★</span>
                    ))}
                  </div>
                  {/* Quote */}
                  <p className="font-body leading-relaxed flex-1 italic relative z-10" style={{ color: 'var(--text-on-dark-sub)' }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  {t.amountRange && (
                    <p className="font-ui text-sm font-semibold mt-3 relative z-10" style={{ color: 'var(--gold-bright)' }}>
                      Paid: {t.amountRange}
                    </p>
                  )}
                  {/* Author */}
                  <div className="mt-4 pt-4 relative z-10" style={{ borderTop: '1px solid var(--border-on-dark)' }}>
                    <p className="font-ui font-semibold text-sm uppercase tracking-wider" style={{ color: 'var(--gold-bright)' }}>
                      {t.flag} {t.name}
                    </p>
                    <p className="font-ui text-xs mt-0.5" style={{ color: 'var(--text-on-dark-mute)' }}>
                      {t.country}{t.itemSold ? ` · Sold: ${t.itemSold}` : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── TRUST SIGNALS — LIGHT ─── */}
      <section className="py-20 light-section" style={{ background: 'var(--surface-pale)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="eyebrow">✦ Our Promise</span>
            <h2 className="font-display text-3xl md:text-4xl" style={{ color: 'var(--text-on-light)' }}>
              Why Sellers Trust Zariwala
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { icon: '✦', title: 'Fair offers — explained honestly', desc: 'We show our pricing logic. You always know how we arrived at the number.' },
              { icon: '🔒', title: 'Your photos are private', desc: 'We never share your photos publicly or with third parties. Ever.' },
              { icon: '🤝', title: 'No obligation — decline any offer', desc: 'Not happy with the offer? Simply decline. No hard feelings, no follow-up.' },
              { icon: '⚡', title: 'Response within 4 hours', desc: 'We commit to responding to every WhatsApp message within 4 hours during business hours.' },
            ].map(trust => (
              <div
                key={trust.title}
                className="flex gap-4 p-5 rounded-xl"
                style={{ background: 'var(--surface-white)', border: '1px solid var(--border-on-light)' }}
              >
                <span className="text-2xl flex-shrink-0 mt-0.5">{trust.icon}</span>
                <div>
                  <h3 className="font-ui font-semibold mb-1" style={{ color: 'var(--text-on-light)' }}>{trust.title}</h3>
                  <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--text-on-light-mute)' }}>{trust.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA BAND — GOLD ─── */}
      <section className="py-28" style={{ background: 'var(--gold-core)' }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2
            className="font-display text-4xl md:text-5xl leading-tight mb-4 italic"
            style={{ color: 'var(--surface-void)' }}
          >
            Ready to sell? It takes 2 minutes.
          </h2>
          <p className="font-body text-lg mb-3" style={{ color: 'rgba(14,14,12,0.72)' }}>
            Free, no-obligation valuations. We buy from across India.
          </p>
          <p className="font-ui text-sm mb-10" style={{ color: 'rgba(14,14,12,0.55)' }}>
            avg response time: under 4 hours
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href={WA_LINKS.homepageBottom}
              target="_blank"
              rel="noopener noreferrer"
              id="final-cta-whatsapp"
              className="btn-whatsapp px-8 py-4 text-base hover:-translate-y-1 transition-transform inline-flex items-center gap-3 shadow-2xl"
            >
              {WA_ICON}
              💬 Get Your Free Offer on WhatsApp
            </a>
            <Link
              href="/sell"
              className="btn-gold-cta px-8 py-4 text-base hover:-translate-y-1 transition-transform"
            >
              Fill in Online Form
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
