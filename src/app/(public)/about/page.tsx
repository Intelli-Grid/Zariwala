import Link from 'next/link'
import { WA_LINKS } from '@/lib/whatsapp'

export const metadata = {
  title: 'About Us | Zariwala',
  description: 'Learn about Zariwala and our mission to curate the best vintage garments from around the world.',
}

export default function AboutPage() {
  return (
    <div style={{ background: 'var(--zari-pale)' }} className="py-20 lg:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <p className="font-ui text-xs font-semibold uppercase tracking-[0.22em] mb-4" style={{ color: 'var(--zari-gold)' }}>
            Our Mission
          </p>
          <h1 className="font-display text-4xl md:text-5xl mb-5" style={{ color: 'var(--ink)' }}>
            About Zariwala
          </h1>
        </div>
        
        <div className="prose prose-lg mx-auto" style={{ color: 'var(--body-color)' }}>
          <p className="font-body text-lg leading-relaxed mb-6">
            Welcome to <strong>Zariwala</strong>. For over a decade, we've been on a mission to source, authenticate, and curate the finest vintage garments from collections across the globe. We buy directly from individuals, collectors, and estates, ensuring that every piece continues its journey sustainably.
          </p>
          
          <p className="font-body text-lg leading-relaxed mb-12">
            We specialize in vintage denim (Levi's, Lee, Wrangler), retro sportswear (Nike, Adidas, Champion), rare heritage textiles (Silk Sarees), and authentic 20th-century outerwear. Our passion for the history of fashion drives us to offer honest, market-reflective valuations for every item we evaluate.
          </p>

          <h2 className="font-display text-3xl mt-12 mb-6" style={{ color: 'var(--ink)' }}>Our Core Values</h2>
          
          <div className="grid sm:grid-cols-2 gap-8 mb-16">
            <div className="bg-white p-6 rounded-2xl shadow-sm border" style={{ borderColor: 'rgba(184, 134, 11, 0.1)' }}>
              <h3 className="font-display text-xl mb-3" style={{ color: 'var(--ink)' }}>Transparency</h3>
              <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                We provide clear, fair offers based on comprehensive market knowledge and global demand.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border" style={{ borderColor: 'rgba(184, 134, 11, 0.1)' }}>
              <h3 className="font-display text-xl mb-3" style={{ color: 'var(--ink)' }}>Simplicity</h3>
              <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                Selling your vintage clothes should be easy. That's why we rely on fast, direct communication via WhatsApp.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border" style={{ borderColor: 'rgba(184, 134, 11, 0.1)' }}>
              <h3 className="font-display text-xl mb-3" style={{ color: 'var(--ink)' }}>Sustainability</h3>
              <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                Extending the lifecycle of vintage garments is at the core of what we do. Vintage is the original sustainable fashion.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border" style={{ borderColor: 'rgba(184, 134, 11, 0.1)' }}>
              <h3 className="font-display text-xl mb-3" style={{ color: 'var(--ink)' }}>Speed</h3>
              <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                We pride ourselves on 24-hour turnaround times for valuations and immediate payments upon receipt of goods.
              </p>
            </div>
          </div>

          <div className="mt-16 p-10 rounded-2xl text-center" style={{ background: 'var(--ink)' }}>
            <h3 className="font-display text-3xl mb-4" style={{ color: 'var(--zari-warm)' }}>Have pieces to sell?</h3>
            <p className="font-body mb-8" style={{ color: 'var(--muted)' }}>
              We're always buying. From single Grail items to complete wardrobe clearances.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href={WA_LINKS.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp py-3 px-6 shadow inline-flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M11.974 0C5.364 0 0 5.363 0 11.973c0 2.105.553 4.076 1.514 5.782L.057 23.143l5.557-1.457a11.94 11.94 0 005.36 1.277h.005C17.584 22.963 24 17.6 24 10.989 24 5.38 18.584 0 11.974 0z" />
                </svg>
                Message on WhatsApp
              </a>
              <Link href="/sell" className="btn-ghost py-3 px-6" style={{ borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }}>
                Use Inquiry Form
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
