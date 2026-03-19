import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { buildCategoryLink } from '@/lib/whatsapp'

const CATEGORY_CONTENT: Record<string, { title: string; description: string; items: string[]; priceRange: string }> = {
  'denim': {
    title: 'Denim & Workwear',
    description: 'From selvedge Levi\'s to rare Lee Ranch coats, we actively seek out the finest vintage denim from the 1940s through the 1990s. Heavy workwear, trucker jackets, and deadstock are especially welcome from Indian sellers.',
    items: ['Levi\'s 501, 505, 517, 646', 'Lee 101, 101B, Rider jackets', 'Wrangler 11MW, 13MWZ', 'Big E selvedge', 'Japanese reproduction denim', 'Workwear chore coats'],
    priceRange: '₹1,500 – ₹65,000+',
  },
  'outerwear': {
    title: 'Jackets & Outerwear',
    description: 'Military surplus, workwear, sport, and heritage outerwear from iconic American and Japanese makers. We look for condition, provenance, and rare colourways, offering free doorstep verification across India.',
    items: ['MA-1 / MA-2 flight jackets', 'M-65 field jackets', 'Varsity / letterman jackets', 'Carhartt Detroit & Chore', 'Baracuta G9 Harrington', 'N-1 deck jackets'],
    priceRange: '₹3,000 – ₹50,000+',
  },
  'sportswear': {
    title: 'Retro Sports & Streetwear',
    description: 'Rare collegiate, Olympic, and athletic wear from the 1960s through the 1990s. Champion Reverse Weave, Russell Athletic, and early Nike and Adidas pieces are in high demand. Fast appraisals within 24 hours.',
    items: ['Champion Reverse Weave sweatshirts', 'Russell Athletic basics', 'Early Nike and Adidas', 'Olympic and team USA gear', 'Vintage band and graphic tees (single-stitch)', 'Concert tour shirts (pre-2000)'],
    priceRange: '₹2,000 – ₹40,000+',
  },
  'designer': {
    title: 'Archive Designer & Luxury',
    description: 'Early pieces from established luxury houses, pre-2000 items from iconic designers, and archival fashion pieces. We have a specialist team for evaluating designer vintage sourced from India.',
    items: ['Issey Miyake, Comme des Garçons', 'Yohji Yamamoto, Helmut Lang', 'Early Calvin Klein, Ralph Lauren', 'Versace, Moschino', 'Vivienne Westwood', 'Jean Paul Gaultier'],
    priceRange: '₹4,000 – ₹4,00,000+',
  },
  'heritage-textiles': {
    title: 'Silk Sarees & Heritage Weaves',
    description: 'Rare banarasi and kanjivaram silks, zari and zardozi embroidery, vintage handloom saris, patola and paithani weaves, and antique textiles from across India and Asia. We have specialist assessors for Indian heritage textile collections.',
    items: [
      'Banarasi and Kanjivaram silks',
      'Zari and zardozi embroidery pieces',
      'Patola, Paithani, and ikat weaves',
      'Vintage saris and dupattas',
      'Antique shawls and stoles',
      'Japanese kimono and obi belts',
    ],
    priceRange: '₹500 – ₹1,50,000+',
  },
  'accessories': {
    title: 'Bags, Scarves & Accessories',
    description: 'Quality vintage leather goods, silk scarves, and classic accessories from established luxury houses and heritage brands. Secure payment upon authentication.',
    items: ['Luxury leather bags and briefcases', 'Silk scarves (Hermès, Dior, etc.)', 'Classic sunglasses (Ray-Ban, Persol)', 'Vintage belts and leather goods', 'Silver and artisan jewelry'],
    priceRange: '₹1,500 – ₹35,000+',
  },
}

export function generateStaticParams() {
  return Object.keys(CATEGORY_CONTENT).map((slug) => ({
    slug: slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const content = CATEGORY_CONTENT[slug]
  if (!content) return { title: 'Category Not Found' }
  return {
    title: `${content.title} | Zariwala`,
    description: `${content.description} WhatsApp Zariwala for a free valuation.`,
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const content = CATEGORY_CONTENT[slug]

  if (!content) {
    notFound()
  }

  // Get related blog posts for this category safely
  let relatedPosts: any[] = []
  try {
    relatedPosts = await prisma.blogPost.findMany({
      where: {
        published: true,
        OR: [
          { category: { contains: content.title.split(' ')[0], mode: 'insensitive' } },
          { title: { contains: content.title.split(' ')[0], mode: 'insensitive' } },
        ],
      },
      take: 3,
      orderBy: { createdAt: 'desc' },
    })
  } catch (e) {
    console.warn(`Prisma error fetching related posts for ${slug} (often occurs during build prerendering):`, e)
  }

  return (
    <div className="bg-[var(--color-ivory)] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://zariwala.online"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Categories",
                "item": "https://zariwala.online/what-we-buy"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": content.title,
                "item": `https://zariwala.online/categories/${slug}`
              }
            ]
          })
        }}
      />
      {/* Hero */}
      <section className="bg-[var(--color-espresso)] py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 bg-[var(--color-gold)]/20 text-[var(--color-gold)] text-sm font-bold uppercase tracking-widest rounded-full mb-8">
            Category
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-[var(--color-ivory)] mb-8">
            {content.title}
          </h1>
          <p className="font-body text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto mb-10">
            {content.description}
          </p>
          <div className="flex justify-center">
            <Link
              href={`/sell?category=${slug}`}
              className="inline-flex items-center gap-3 bg-[var(--color-gold)] text-[var(--color-espresso)] px-10 py-4 rounded-full font-ui font-bold shadow-xl hover:-translate-y-1 transition-transform"
            >
              <span className="animate-pulse">●</span> Make an Offer →
            </Link>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="font-display text-2xl text-[var(--color-espresso)] mb-6">What We Look For</h2>
              <ul className="space-y-3">
                {content.items.map((item, i) => (
                  <li key={i} className="flex items-start space-x-3 font-body text-[var(--color-espresso-mid)]">
                    <span className="text-[var(--color-gold)] mt-1 flex-shrink-0">✦</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-8 rounded-2xl border border-[var(--color-gold)]/10 shadow-sm">
                <h3 className="font-display text-xl text-[var(--color-espresso)] mb-3">Typical Price Range</h3>
                <p className="text-4xl font-display text-[var(--color-gold-dark)]">{content.priceRange}</p>
                <p className="font-body text-sm text-[var(--color-gray-500)] mt-2">
                  Prices depend on era, condition, rarity, and current demand. Submit your item for a free evaluation.
                </p>
              </div>

              <div className="rounded-2xl p-8" style={{ background: 'var(--ink)' }}>
                <h3 className="font-display text-xl mb-3" style={{ color: 'var(--zari-warm)' }}>Ready to Sell?</h3>
                <p className="font-body text-sm leading-relaxed mb-6" style={{ color: 'var(--muted)' }}>
                  Send a few clear photos on WhatsApp for a free valuation — or fill in our structured form.
                </p>
                <div className="flex flex-col gap-3">
                  <Link href={`/sell?category=${slug}`} className="btn-whatsapp text-center text-sm py-3 flex items-center justify-center gap-2">
                    <span className="animate-pulse">●</span> Make an Offer on WhatsApp
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Related blog posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-20 pt-12 border-t border-[var(--color-ivory-dark)]">
              <h2 className="font-display text-2xl text-[var(--color-espresso)] mb-8">Related Guides</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((post: any) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="group block bg-white p-6 rounded-xl border border-[var(--color-gold)]/10 hover:shadow-md transition-shadow">
                    <h3 className="font-display text-lg text-[var(--color-espresso)] group-hover:text-[var(--color-gold-dark)] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="font-body text-sm text-[var(--color-gray-500)] mt-2 line-clamp-2">{post.excerpt}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
