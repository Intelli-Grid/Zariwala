/**
 * categories.ts — Single source of truth for all Zariwala category data.
 *
 * Imported by:
 *   - app/(public)/what-we-buy/page.tsx
 *   - app/(public)/categories/[slug]/page.tsx
 *   - app/(public)/page.tsx  (homepage grid)
 *   - app/sitemap.ts
 *
 * NEVER duplicate this data. Add/edit categories here only.
 */

export type CategoryCta = 'offer' | 'valuation'

export interface ZariCategory {
  id: string
  slug: string
  order: number
  eyebrow: string           // e.g. "THE GOLDEN WEAVE"
  name: string              // e.g. "Zari Sarees"
  descriptor: string        // 1-line — card sub-heading
  description: string       // 2-3 sentences — category detail page hero
  priceRange: { min: number; max: number; display: string }
  cta: string               // "Make an Offer" | "Request Valuation"
  ctaType: CategoryCta      // routes CTA to /sell or /valuation-guide
  img: string               // Unsplash photo ID (no URL prefix)
  waKey: string             // Key in WA_LINKS object
  whatWeLookFor: string[]   // Bullet list on category detail page
}

export const CATEGORIES: ZariCategory[] = [
  {
    id: 'zari-sarees',
    slug: 'zari-sarees',
    order: 1,
    eyebrow: 'THE GOLDEN WEAVE',
    name: 'Zari Sarees',
    descriptor: 'All sarees with zari work — border, pallu, or full body',
    description:
      'If it carries the glint of real gold thread — whether a thin zari border, a richly worked pallu, or a full brocade body — we want to see it. Zariwala specialises in zari-worked sarees from across India\'s weaving traditions, from Varanasi to Kanchipuram.',
    priceRange: { min: 3000, max: 250000, display: '₹3,000 – ₹2,50,000' },
    cta: 'Make an Offer',
    ctaType: 'offer',
    img: '/images/categories/zari-sarees.png',
    waKey: 'catZariSarees',
    whatWeLookFor: [
      'Banarasi zari sarees (any era, any condition)',
      'Kanjivaram sarees with gold zari border or pallu',
      'Paithani sarees with zari peacock or lotus motifs',
      'Full-body zari brocade (kinkhab) sarees',
      'Tissue sarees and zari net sarees',
      'Antique / heirloom zari pieces (pre-1980)',
    ],
  },
  {
    id: 'pure-silk-sarees',
    slug: 'pure-silk-sarees',
    order: 2,
    eyebrow: 'WOVEN IN SILK',
    name: 'Pure Silk Sarees',
    descriptor: 'Kanjivaram, Mysore, Dharmavaram & unbranded pure silk',
    description:
      'Pure silk carries the weight of centuries — and the resale market knows it. We buy authenticated pure silk sarees from all major Indian weaving centres, in any condition from never-worn heirlooms to well-loved everyday drapes.',
    priceRange: { min: 2500, max: 150000, display: '₹2,500 – ₹1,50,000' },
    cta: 'Make an Offer',
    ctaType: 'offer',
    img: '/images/categories/pure-silk-sarees.jpg',
    waKey: 'catPureSilk',
    whatWeLookFor: [
      'Kanjivaram silk sarees (any era, any colourway)',
      'Mysore silk and Dharmavaram silk',
      'Baluchari silk (West Bengal)',
      'Murshidabad and Bishnupur silk',
      'Tussar / raw silk sarees',
      'Unbranded pure silk with original weaver mark',
    ],
  },
  {
    id: 'banarasi-silks',
    slug: 'banarasi-silks',
    order: 3,
    eyebrow: 'FROM THE LOOM CITY',
    name: 'Banarasi Silks',
    descriptor: "Sarees, dupattas & fabric from Varanasi's looms",
    description:
      "Banarasi silk is India's most internationally recognised weaving tradition — and one of our highest-value categories. We buy Banarasi sarees, dupattas, and fabric yardage from all eras, with particular interest in older pieces featuring dense zari motifs.",
    priceRange: { min: 4000, max: 300000, display: '₹4,000 – ₹3,00,000' },
    cta: 'Make an Offer',
    ctaType: 'offer',
    img: '/images/categories/banarasi-silks.jpg',
    waKey: 'catBanarasi',
    whatWeLookFor: [
      'Banarasi brocade sarees (kadwa, cutwork, jamdani)',
      'Banarasi katan silk sarees (plain weave, zari border)',
      'Banarasi dupattas with zari border or pallu',
      'Tissue Banarasi sarees',
      'Banarasi fabric yardage (unstitched)',
      'Vintage Banarasi — pre-1990 pieces especially valued',
    ],
  },
  {
    id: 'heritage-brocades',
    slug: 'heritage-brocades',
    order: 4,
    eyebrow: 'WOVEN GOLD',
    name: 'Heritage Brocades',
    descriptor: 'Kinkhab, tissue silk & rare meenakari brocade pieces',
    description:
      "Heritage brocades are India's most collector-grade textiles — pieces woven with gold or silver thread so dense that the fabric itself feels weighted with precious metal. If you have kinkhab, meenakari, or antique brocade, a specialist valuation is warranted.",
    priceRange: { min: 8000, max: 500000, display: '₹8,000 – ₹5,00,000' },
    cta: 'Request Valuation',
    ctaType: 'valuation',
    img: '/images/categories/heritage-brocades.png',
    waKey: 'catHeritageBrocades',
    whatWeLookFor: [
      'Kinkhab — silk woven entirely with gold or silver zari',
      'Meenakari brocade — enamelled multi-colour zari work',
      'Tissue gold fabric (gold or silver weft throughout)',
      'Antique brocade panels and fragments (collector pieces)',
      'Zardozi-embellished silk ceremonial pieces',
      'Museum-quality or pre-Independence brocade',
    ],
  },
  {
    id: 'zari-lehengas-suits',
    slug: 'zari-lehengas-suits',
    order: 5,
    eyebrow: 'CELEBRATION WEAR',
    name: 'Zari Lehengas & Suits',
    descriptor: 'Bridal and festive sets with zari embroidery or weave',
    description:
      'Bridal and festive zari garments represent exceptional craft and significant original cost. Whether it is a silk lehenga with gold thread embroidery or a zari-worked salwar suit, we offer fair, transparent prices for well-crafted Indian celebration wear.',
    priceRange: { min: 5000, max: 200000, display: '₹5,000 – ₹2,00,000' },
    cta: 'Make an Offer',
    ctaType: 'offer',
    img: '/images/categories/zari-lehengas-suits.jpg',
    waKey: 'catZariLehengas',
    whatWeLookFor: [
      'Silk lehenga sets with zari or zardozi embroidery',
      'Bridal red, ivory, or gold lehengas (any region)',
      'Zari-worked salwar kameez (stitched or unstitched)',
      'Anarkali sets with gold thread work',
      'Sharara and Gharara sets with zari',
      'Designer festive wear (Sabyasachi, Manish Malhotra, etc.)',
    ],
  },
  {
    id: 'silk-dupattas-stoles',
    slug: 'silk-dupattas-stoles',
    order: 6,
    eyebrow: 'THE DRAPED ACCENT',
    name: 'Silk Dupattas & Stoles',
    descriptor: 'Standalone silk or zari dupattas, shawls, and stoles',
    description:
      'Silk dupattas are one of the most overlooked categories by sellers — and one of the most consistently in-demand with buyers. Banarasi dupattas, Kashmiri embroidered stoles, and Chanderi silk drapes all carry strong resale value.',
    priceRange: { min: 800, max: 40000, display: '₹800 – ₹40,000' },
    cta: 'Make an Offer',
    ctaType: 'offer',
    img: '/images/categories/silk-dupattas-stoles.png',
    waKey: 'catSilkDupattas',
    whatWeLookFor: [
      'Banarasi silk dupattas with zari border or pallu',
      'Chanderi silk-cotton dupattas',
      'Kashmiri embroidered woollen shawls',
      'Silk georgette and organza stoles',
      'Kani and Pashmina shawls',
      'Zari-bordered dupatta sets (paired with suits)',
    ],
  },
  {
    id: 'zari-blouses-cholis',
    slug: 'zari-blouses-cholis',
    order: 7,
    eyebrow: 'THE PAIRED PIECE',
    name: 'Zari Blouses & Cholis',
    descriptor: 'Stitched or unstitched zari blouses and bridal choli sets',
    description:
      'A fine zari blouse is often more valuable than the saree it was paired with. Brocade blouses, hand-embroidered cholis, and unstitched blouse pieces — especially in heritage fabrics — have a strong and dedicated secondary market.',
    priceRange: { min: 600, max: 25000, display: '₹600 – ₹25,000' },
    cta: 'Make an Offer',
    ctaType: 'offer',
    img: '/images/categories/zari-blouses-cholis.jpg',
    waKey: 'catZariBlouses',
    whatWeLookFor: [
      'Kinkhab or Banarasi brocade blouses (ready or unstitched)',
      'Bridal choli sets with heavy zari or sequin work',
      'Zardozi-embroidered blouses',
      'Silk blouses with woven zari patterns',
      'Unstitched blouse pieces (original weaver fabric)',
      'Vintage blouses from couture or designer sets',
    ],
  },
  {
    id: 'vintage-zari-fabric',
    slug: 'vintage-zari-fabric',
    order: 8,
    eyebrow: 'UNMADE TREASURES',
    name: 'Vintage Zari Fabric',
    descriptor: 'Unstitched brocade, rolled silk, and pre-cut zari yardage',
    description:
      'Unstitched zari fabric is one of the most unexpectedly valuable categories in heritage textiles. Rolled kinkhab, brocade yardage, and pre-cut zari panels are sought worldwide by collectors, costume designers, and heritage craft researchers.',
    priceRange: { min: 1500, max: 80000, display: '₹1,500 – ₹80,000' },
    cta: 'Request Valuation',
    ctaType: 'valuation',
    img: '/images/categories/vintage-zari-fabric.jpg',
    waKey: 'catVintageFabric',
    whatWeLookFor: [
      'Rolled kinkhab or brocade fabric (by the yard)',
      'Pre-cut zari panels and borders',
      'Antique brocade fragments (collector grade)',
      'Sari cloth — pre-stitched silk yardage',
      'Zari net fabric and tissue yardage',
      'Vintage fabric from closed or rare weaving mills',
    ],
  },
]

/** O(1) lookup by slug — used by dynamic route [slug]/page.tsx */
export const CATEGORY_BY_SLUG: Record<string, ZariCategory> =
  Object.fromEntries(CATEGORIES.map((c) => [c.slug, c]))

/** All slugs — used by generateStaticParams and sitemap.ts */
export const ALL_CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug)
