import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { CATEGORIES, CATEGORY_BY_SLUG } from '@/lib/categories'
import { WA_LINKS } from '@/lib/whatsapp'

const WA_ICON = (
  <svg className="w-5 h-5 fill-white flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M11.974 0C5.364 0 0 5.363 0 11.973c0 2.105.553 4.076 1.514 5.782L.057 23.143l5.557-1.457a11.94 11.94 0 005.36 1.277h.005C17.584 22.963 24 17.6 24 10.989 24 5.38 18.584 0 11.974 0z" />
  </svg>
)

/** generateStaticParams — driven by shared CATEGORIES, never hardcoded */
export function generateStaticParams() {
  return CATEGORIES.map((cat) => ({ slug: cat.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cat = CATEGORY_BY_SLUG[slug]
  if (!cat) return { title: 'Category Not Found | Zariwala' }
  return {
    title: `Sell Your ${cat.name} | Get Instant Valuation | Zariwala`,
    description: `${cat.description} Send photos via WhatsApp for a free valuation — we respond within 24 hours.`,
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cat = CATEGORY_BY_SLUG[slug]

  if (!cat) notFound()

  const ctaHref = cat.ctaType === 'valuation'
    ? `/valuation-guide?category=${cat.slug}`
    : `/sell?category=${cat.slug}`

  const ctaLabel = cat.ctaType === 'valuation'
    ? 'Request a Specialist Valuation →'
    : 'Make an Offer →'

  // Related blog posts (safe — catch handles build-time Prisma prerender)
  let relatedPosts: any[] = []
  try {
    relatedPosts = await prisma.blogPost.findMany({
      where: {
        published: true,
        OR: [
          { category: { contains: cat.name.split(' ')[0], mode: 'insensitive' } },
          { title: { contains: cat.name.split(' ')[0], mode: 'insensitive' } },
        ],
      },
      take: 3,
      orderBy: { createdAt: 'desc' },
    })
  } catch {
    // Safe during build prerendering
  }

  return (
    <div style={{ background: 'var(--surface-void)' }}>

      {/* JSON-LD BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://zariwala.online' },
              { '@type': 'ListItem', position: 2, name: 'What We Buy', item: 'https://zariwala.online/what-we-buy' },
              { '@type': 'ListItem', position: 3, name: cat.name, item: `https://zariwala.online/categories/${slug}` },
            ],
          }),
        }}
      />

      {/* ─── HERO — DARK ─── */}
      <section className="relative overflow-hidden dark-section textured-section" style={{ background: 'var(--surface-deep)' }}>
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src={`https://images.unsplash.com/photo-${cat.img}?auto=format&fit=crop&q=75&w=1400`}
            alt={cat.name}
            fill
            sizes="100vw"
            className="object-cover"
            style={{ filter: 'brightness(0.25) sepia(0.2)' }}
            priority
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(26,26,23,0.97) 0%, rgba(26,26,23,0.85) 60%, rgba(26,26,23,0.6) 100%)' }} />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32" style={{ zIndex: 1 }}>
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 font-ui text-xs mb-8" style={{ color: 'var(--text-on-dark-mute)' }}>
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <Link href="/what-we-buy" className="hover:underline">What We Buy</Link>
            <span>/</span>
            <span style={{ color: 'var(--gold-bright)' }}>{cat.name}</span>
          </nav>

          {/* Eyebrow */}
          <span className="eyebrow" style={{ color: 'var(--gold-bright)' }}>✦ {cat.eyebrow}</span>

          {/* H1 */}
          <h1
            className="font-display text-4xl md:text-5xl lg:text-6xl mb-6"
            style={{ color: 'var(--text-on-dark)', letterSpacing: '-0.02em', lineHeight: 1.1 }}
          >
            {cat.name}
          </h1>
          <p className="font-body text-xl max-w-2xl mb-4 leading-relaxed" style={{ color: 'var(--text-on-dark-sub)' }}>
            {cat.description}
          </p>

          {/* Price range */}
          <p className="font-ui text-sm font-semibold mb-10 tracking-wide" style={{ color: 'var(--gold-bright)' }}>
            Typical range: {cat.priceRange.display}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={(WA_LINKS as Record<string, string>)[cat.waKey]}
              target="_blank"
              rel="noopener noreferrer"
              id={`category-${slug}-wa-cta`}
              className="btn-whatsapp py-4 px-8 text-base inline-flex items-center gap-3 hover:-translate-y-1 transition-transform shadow-2xl"
            >
              {WA_ICON}
              Send Photos on WhatsApp
            </a>
            <Link
              href={ctaHref}
              className="btn-secondary-dark py-4 px-8 text-base hover:-translate-y-1 transition-transform"
            >
              {ctaLabel}
            </Link>
          </div>
        </div>
      </section>

      {/* ─── WHAT WE LOOK FOR — LIGHT ─── */}
      <section className="py-20 light-section" style={{ background: 'var(--surface-pale)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-start">

            {/* Items list */}
            <div>
              <span className="eyebrow">✦ WHAT WE LOOK FOR</span>
              <h2 className="font-display text-3xl mb-8" style={{ color: 'var(--text-on-light)' }}>
                Exactly What We Buy
              </h2>
              <ul className="space-y-3">
                {cat.whatWeLookFor.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 font-body" style={{ color: 'var(--text-on-light-sub)' }}>
                    <span className="mt-1 flex-shrink-0 font-bold" style={{ color: 'var(--gold-core)' }}>✦</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price + CTA panel */}
            <div className="space-y-5">
              {/* Price card */}
              <div
                className="p-8 rounded-xl"
                style={{
                  background: 'var(--surface-white)',
                  border: '1px solid var(--border-on-light)',
                  borderTop: '3px solid var(--gold-core)',
                }}
              >
                <span className="eyebrow">✦ TYPICAL PRICE RANGE</span>
                <p
                  className="font-display text-3xl md:text-4xl font-bold mt-2 mb-3"
                  style={{ color: 'var(--gold-shadow)' }}
                >
                  {cat.priceRange.display}
                </p>
                <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--text-on-light-mute)' }}>
                  Prices depend on era, condition, rarity, and current demand.
                  Submit your item for a free evaluation — no obligation.
                </p>
              </div>

              {/* CTA panel */}
              <div
                className="p-8 rounded-xl dark-section textured-section"
                style={{ background: 'var(--surface-deep)' }}
              >
                <h3 className="font-display text-xl mb-2" style={{ color: 'var(--text-on-dark)' }}>
                  Ready to Sell?
                </h3>
                <p className="font-body text-sm leading-relaxed mb-5" style={{ color: 'var(--text-on-dark-sub)' }}>
                  Send a few clear photos on WhatsApp for a free valuation — or fill in our structured form.
                  We respond within 24 hours.
                </p>
                <div className="flex flex-col gap-3">
                  <a
                    href={(WA_LINKS as Record<string, string>)[cat.waKey]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp text-center text-sm py-3 inline-flex items-center justify-center gap-2"
                  >
                    {WA_ICON}
                    Send Photos on WhatsApp
                  </a>
                  <Link
                    href={ctaHref}
                    className="text-center text-sm py-3 rounded font-ui font-semibold transition-colors hover:opacity-80"
                    style={{
                      background: 'var(--gold-core)',
                      color: 'var(--surface-void)',
                    }}
                  >
                    {cat.cta} →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Related blog posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-20 pt-12" style={{ borderTop: '1px solid var(--border-on-light)' }}>
              <span className="eyebrow">✦ RELATED GUIDES</span>
              <h2 className="font-display text-2xl mb-8" style={{ color: 'var(--text-on-light)' }}>
                Learn More
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((post: any) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group block p-6 rounded-xl transition-shadow hover:shadow-md"
                    style={{
                      background: 'var(--surface-white)',
                      border: '1px solid var(--border-on-light)',
                    }}
                  >
                    <h3
                      className="font-display text-lg mb-2 line-clamp-2 transition-colors group-hover:opacity-80"
                      style={{ color: 'var(--text-on-light)' }}
                    >
                      {post.title}
                    </h3>
                    <p className="font-body text-sm line-clamp-2" style={{ color: 'var(--text-on-light-mute)' }}>
                      {post.excerpt}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── BROWSE OTHER CATEGORIES — DARK ─── */}
      <section className="py-16 dark-section" style={{ background: 'var(--surface-deep)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="eyebrow">✦ EXPLORE MORE</span>
            <h2 className="font-display text-3xl" style={{ color: 'var(--text-on-dark)' }}>
              Other Categories We Buy
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {CATEGORIES.filter((c) => c.slug !== slug).map((c) => (
              <Link
                key={c.id}
                href={`/categories/${c.slug}`}
                className="font-ui text-sm font-medium px-4 py-2 rounded-full transition-all hover:-translate-y-0.5 hover:border-[var(--gold-core)] hover:text-[var(--gold-bright)]"
                style={{
                  background: 'var(--surface-dark)',
                  color: 'var(--text-on-dark-sub)',
                  border: '1px solid var(--border-on-dark)',
                }}
              >
                ✦ {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
