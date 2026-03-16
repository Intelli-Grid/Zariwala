import Image from 'next/image'
import Link from 'next/link'
import { WA_LINKS } from '@/lib/whatsapp'

const CATEGORIES = [
  {
    title: "Vintage Denim & Workwear",
    desc: "Levi's (Big E, Redline, 501s), Lee, Wrangler, Carhartt, Dickies. 1940s-1990s.",
    image: "https://images.unsplash.com/photo-1602293589930-45aad59bc3ab?auto=format&fit=crop&q=80"
  },
  {
    title: "Designer Labels",
    desc: "Archive pieces from Ralph Lauren, YSL, Burberry, Armani, and Japanese designers.",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80"
  },
  {
    title: "Retro Sportswear",
    desc: "Nike, Adidas, Champion, Fila, Reebok (1970s-1990s). Single stitch tees, track jackets.",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80"
  },
  {
    title: "Heritage Textiles",
    desc: "Vintage silk sarees, banarasis, kanjivarams, patolas, and handloom pieces.",
    image: "https://images.unsplash.com/photo-1528459801416-a1e53ed07252?auto=format&fit=crop&q=80"
  },
  {
    title: "Vintage Outerwear",
    desc: "Leather jackets, trench coats, military surplus, classic wool overcoats.",
    image: "https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&q=80"
  },
  {
    title: "Vintage Accessories",
    desc: "Quality leather bags, belts, silk scarves, and classic sunglasses.",
    image: "https://images.unsplash.com/photo-1550993444-2396e95222bf?auto=format&fit=crop&q=80"
  }
]

export const metadata = {
  title: 'What We Buy | Zariwala',
  description: 'Zariwala buys vintage denim, band tees, sportswear, designer labels, outerwear, and heritage textiles worldwide. See what we buy and current price ranges.',
}

export default function WhatWeBuyPage() {
  return (
    <div className="bg-[var(--color-ivory)]">
      {/* Hero */}
      <section className="bg-[var(--color-espresso)] py-20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl text-[var(--color-gold)] mb-6">What We Buy</h1>
          <p className="font-body text-lg text-[var(--color-ivory-dark)] opacity-90 max-w-2xl mx-auto">
            From classic Levi's to archive designer pieces, we are primarily interested in authentic vintage clothing from the 1940s through the late 1990s.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {CATEGORIES.map((cat, i) => (
              <div key={i} className="card-vintage group flex flex-col overflow-hidden">
                <div className="relative h-64 overflow-hidden">
                  <Image 
                    src={cat.image} 
                    alt={cat.title} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <h2 className="font-display text-2xl text-[var(--color-espresso)] mb-4">{cat.title}</h2>
                  <p className="font-body text-[var(--color-espresso-mid)] flex-1">{cat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Condition & CTA */}
      <section className="py-20 bg-[var(--color-ivory-dark)]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl text-[var(--color-espresso)] mb-6">A Note on Condition</h2>
          <p className="font-body text-[var(--color-espresso-mid)] mb-10 leading-relaxed">
            We buy items in various conditions, from pristine deadstock to perfectly distressed workwear. Don't worry if pieces have natural wear, minor repairs, or fading — often, this adds to a vintage garment's character and value!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href={WA_LINKS.whatWeBuy}
              target="_blank"
              rel="noopener noreferrer"
              id="what-we-buy-wa-cta"
              className="btn-whatsapp py-4 px-8 text-lg inline-flex items-center gap-3"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white flex-shrink-0" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M11.974 0C5.364 0 0 5.363 0 11.973c0 2.105.553 4.076 1.514 5.782L.057 23.143l5.557-1.457a11.94 11.94 0 005.36 1.277h.005C17.584 22.963 24 17.6 24 10.989 24 5.38 18.584 0 11.974 0z" />
              </svg>
              Send Photos on WhatsApp
            </a>
            <Link href="/valuation-guide" className="btn-ghost py-4 px-8 text-lg">
              Read the Price Guide
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
