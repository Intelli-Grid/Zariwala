import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { WA_LINKS } from '@/lib/whatsapp'

const WA_ICON = (
  <svg className="w-5 h-5 fill-white flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M11.974 0C5.364 0 0 5.363 0 11.973c0 2.105.553 4.076 1.514 5.782L.057 23.143l5.557-1.457a11.94 11.94 0 005.36 1.277h.005C17.584 22.963 24 17.6 24 10.989 24 5.38 18.584 0 11.974 0z" />
  </svg>
)

const CATEGORIES = [
  { title: 'Denim & Workwear', img: '1584273143981-41c073dfe8f8', href: '/categories/denim', waKey: 'catDenim' },
  { title: 'Retro Sports & Streetwear', img: '1515886657613-9f3515b0c78f', href: '/categories/sportswear', waKey: 'catStreetwear' },
  { title: 'Archive Designer & Luxury', img: '1445205170230-053b83016050', href: '/categories/designer', waKey: 'catDesigner' },
  { title: 'Jackets & Outerwear', img: '1551488831-00ddcb6c6bd3', href: '/categories/outerwear', waKey: 'catOuterwear' },
  { title: 'Silk Sarees & Heritage Weaves', img: '1607083206968-13611e3d76db', href: '/categories/heritage-textiles', waKey: 'catHeritage' },
  { title: 'Bags, Scarves & Accessories', img: '1584916201218-f4242ceb4809', href: '/categories/accessories', waKey: 'catAccessories' },
] as const

export const metadata = {
  title: 'Zariwala — We Buy Your Vintage Clothing Worldwide',
  description:
    'Zariwala buys quality vintage clothing, silk sarees, and heritage weaves from sellers across India. Fair prices, simple process. Send photos via WhatsApp for a free valuation.',
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
      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden min-h-[88vh] flex items-center" style={{ background: 'var(--ink)' }}>
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=1600"
            alt="Vintage clothing rack — Zariwala buys quality vintage worldwide"
            fill
            sizes="100vw"
            className="object-cover opacity-35"
            priority
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, var(--ink) 40%, transparent)' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="max-w-2xl">
            <span className="font-ui text-xs font-semibold uppercase tracking-[0.22em] mb-6 block" style={{ color: 'var(--zari-gold)' }}>
              🪡 Vintage Clothing Buyers · Asia
            </span>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[1.05] mb-6 italic" style={{ color: '#fff' }}>
              We Buy Your<br />
              <span style={{ color: 'var(--zari-warm)' }}>Vintage Clothing</span>
            </h1>
            <p className="font-body text-xl mb-4 leading-relaxed font-light max-w-lg" style={{ color: 'rgba(253,246,227,0.85)' }}>
              Send us photos on WhatsApp. Get a fair offer in 24 hours.
              We buy vintage clothing, silk sarees, and heritage weaves from across India.
            </p>

            {/* WhatsApp primary CTA */}
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
                className="btn-ghost justify-center py-4 px-8 text-base hover:-translate-y-1 transition-transform"
                style={{ borderColor: 'rgba(255,255,255,0.25)', color: '#fff' }}
              >
                See What We Buy →
              </Link>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 font-ui text-sm" style={{ color: 'rgba(253,246,227,0.65)' }}>
              <span>✓ 24-hr valuations</span>
              <span>✓ 20+ cities served</span>
              <span>✓ No obligation</span>
              <span>✓ Secure payment</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TRUST BAR ─── */}
      <div style={{ background: 'var(--ink)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 md:justify-between font-ui text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(253,246,227,0.45)' }}>
            <span>✦ 24hr Response Guarantee</span>
            <span>✦ Fair, Transparent Pricing</span>
            <span>✦ India-wide Collection</span>
            <span>✦ Secure Payment</span>
          </div>
        </div>
      </div>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-24" style={{ background: 'var(--zari-warm)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="section-divider" />
            <h2 className="font-display text-4xl md:text-5xl" style={{ color: 'var(--ink)' }}>How It Works</h2>
            <p className="font-body text-lg mt-4 max-w-xl mx-auto" style={{ color: 'var(--body-color)' }}>
              Five simple steps between your vintage wardrobe and your payment.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
            {[
              {
                n: '1',
                title: 'Send Photos on WhatsApp',
                body: 'Message Zariwala on WhatsApp and send clear photos of your items — front, back, labels, and any flaws.',
              },
              {
                n: '2',
                title: 'You Ship for the Valuation',
                body: 'Ship your item to us for a hands-on valuation. We guide you through the process every step of the way.',
              },
              {
                n: '3',
                title: 'We Make You an Offer',
                body: 'Our vintage specialists assess your item and make you a fair, transparent cash offer within 24 hours.',
              },
              {
                n: '4',
                title: 'Offer Confirmed',
                body: 'Happy with the offer? Simply confirm and we take care of everything from here.',
              },
              {
                n: '5',
                title: 'We Pay You',
                body: 'Receive your payment promptly once the offer is confirmed. Fast, secure, and hassle-free.',
              },
            ].map(step => (
              <div key={step.n} className="flex flex-col items-center text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center font-display text-2xl mb-6 shadow-lg"
                  style={{ background: 'var(--ink)', color: 'var(--zari-gold)' }}
                >
                  {step.n}
                </div>
                <h3 className="font-display text-xl mb-3" style={{ color: 'var(--ink)' }}>{step.title}</h3>
                <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--body-color)' }}>{step.body}</p>
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

      {/* ─── WHAT WE BUY ─── */}
      <section className="py-24" style={{ background: 'var(--zari-pale)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="section-divider" />
            <h2 className="font-display text-4xl md:text-5xl" style={{ color: 'var(--ink)' }}>What We Buy</h2>
            <p className="font-body text-lg mt-4 max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--body-color)' }}>
              Authentic vintage clothing from the 1940s through the late 1990s. From Levi's denim to archive designer labels.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.href}
                href={`/sell?category=${cat.href.split('/').pop()}`}
                className="group relative block overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block"
                style={{ border: '1px solid var(--border)' }}
              >
                <div className="relative h-44 sm:h-56" style={{ background: 'var(--zari-warm)' }}>
                  <Image
                    src={`https://images.unsplash.com/photo-${cat.img}?auto=format&fit=crop&q=75&w=600`}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    alt={cat.title}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(28,28,26,0.85) 0%, transparent 60%)' }} />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                  <h3 className="font-display text-lg sm:text-xl text-white">{cat.title}</h3>
                  <span className="font-ui text-xs mt-0.5 block group-hover:underline flex items-center gap-1" style={{ color: 'var(--zari-gold)' }}>
                    <span className="animate-pulse">●</span> Make an Offer →
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/what-we-buy" className="btn-ghost px-8 py-3">
              View Full Category Guide
            </Link>
          </div>
        </div>
      </section>

      {/* ─── VALUATION SNAPSHOT ─── */}
      <section className="py-24" style={{ background: 'var(--zari-warm)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="section-divider" />
            <h2 className="font-display text-4xl md:text-5xl" style={{ color: 'var(--ink)' }}>What Could Your Items Be Worth?</h2>
            <p className="font-body text-lg mt-4" style={{ color: 'var(--body-color)' }}>
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
                className="rounded-2xl p-6"
                style={{ background: '#fff', border: '1px solid var(--border)', boxShadow: '0 2px 12px rgba(28,28,26,0.04)' }}
              >
                <p className="font-display text-lg mb-4" style={{ color: 'var(--ink)' }}>{row.item}</p>
                <div className="space-y-1.5 font-ui text-sm">
                  <div className="flex justify-between"><span style={{ color: 'var(--muted)' }}>Fair condition</span><span style={{ color: 'var(--body-color)' }}>{row.fair}</span></div>
                  <div className="flex justify-between"><span style={{ color: 'var(--muted)' }}>Good condition</span><span style={{ color: 'var(--zari-gold)', fontWeight: 600 }}>{row.good}</span></div>
                  <div className="flex justify-between"><span style={{ color: 'var(--muted)' }}>Excellent</span><span style={{ color: 'var(--zari-deep)', fontWeight: 700 }}>{row.excellent}</span></div>
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

      {/* ─── TESTIMONIALS ─── */}
      {testimonials.length > 0 && (
        <section className="py-24" style={{ background: 'var(--zari-pale)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <div className="section-divider" />
              <h2 className="font-display text-4xl" style={{ color: 'var(--ink)' }}>What Sellers Say</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t: any) => (
                <div
                  key={t.id}
                  className="rounded-2xl p-7 flex flex-col card-featured"
                  style={{ background: '#fff', border: '1px solid var(--border)', boxShadow: '0 2px 12px rgba(28,28,26,0.04)' }}
                >
                  <div className="flex mb-4">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <span key={i} style={{ color: 'var(--zari-gold)' }} className="text-lg">★</span>
                    ))}
                  </div>
                  <p className="font-body leading-relaxed flex-1 italic" style={{ color: 'var(--body-color)' }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  {t.amountRange && (
                    <p className="font-ui text-sm font-semibold mt-3" style={{ color: 'var(--forest)' }}>
                      Paid: {t.amountRange}
                    </p>
                  )}
                  <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                    <p className="font-body font-bold text-sm" style={{ color: 'var(--ink)' }}>
                      {t.flag} {t.name}
                    </p>
                    <p className="font-ui text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                      {t.country}{t.itemSold ? ` · Sold: ${t.itemSold}` : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── TRUST SIGNALS ─── */}
      <section className="py-20" style={{ background: 'var(--zari-warm)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl" style={{ color: 'var(--ink)' }}>Why Sellers Trust Zariwala</h2>
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
                style={{ background: '#fff', border: '1px solid var(--border)' }}
              >
                <span className="text-2xl flex-shrink-0 mt-0.5">{trust.icon}</span>
                <div>
                  <h3 className="font-ui font-semibold mb-1" style={{ color: 'var(--ink)' }}>{trust.title}</h3>
                  <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{trust.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-28" style={{ background: 'var(--ink)' }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-4xl md:text-5xl leading-tight mb-4 italic" style={{ color: 'var(--zari-warm)' }}>
            Ready to sell? It takes 2 minutes.
          </h2>
          <p className="font-body text-lg mb-3 opacity-70" style={{ color: 'var(--zari-warm)' }}>
            Free, no-obligation valuations. We buy from across India.
          </p>
          <p className="font-ui text-sm mb-10" style={{ color: 'var(--muted)' }}>avg response time: under 4 hours</p>

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
              className="btn-ghost px-8 py-4 text-base hover:-translate-y-1 transition-transform"
              style={{ borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}
            >
              Fill in Online Form
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
