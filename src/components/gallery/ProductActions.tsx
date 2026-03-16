'use client'

import { Heart, MessageCircle, Send, Share2, CheckCircle2 } from 'lucide-react'
import { useWishlist } from '@/store/wishlistStore'
import {
  generateProductWhatsAppUrl,
} from '@/lib/contact-links'
import { useState } from 'react'

interface Props {
  product: {
    id: string
    sku: string
    title: string
    price: number
    isAvailable: boolean
    slug: string
  }
}

export function ProductActions({ product }: Props) {
  const { toggle, has } = useWishlist()
  const wishlisted = has(product.id)
  const [copied, setCopied] = useState(false)

  const waUrl = generateProductWhatsAppUrl(product)

  const handleShare = async () => {
    const url = `${window.location.origin}/gallery/${product.slug}`
    if (navigator.share) {
      await navigator.share({ title: product.title, url })
    } else {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!product.isAvailable) {
    return (
      <div className="space-y-3">
        <div className="w-full flex items-center justify-center gap-2 py-4 rounded-full font-inter text-sm font-semibold bg-gray-100 text-gray-400 cursor-not-allowed">
          This piece has been sold
        </div>
        <p className="text-center font-hind text-sm" style={{ color: 'var(--color-gray-mid)' }}>
          Interested in similar pieces?{' '}
          <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`} className="underline hover:text-[var(--color-gold-deep)]">
            Contact us on WhatsApp
          </a>
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3" id="product-actions">
      {/* Primary — WhatsApp */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        id="product-buy-whatsapp"
        className="btn-whatsapp w-full justify-center py-4 text-base"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white flex-shrink-0">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
          <path d="M11.974 0C5.364 0 0 5.363 0 11.973c0 2.105.553 4.076 1.514 5.782L.057 23.143l5.557-1.457a11.94 11.94 0 005.36 1.277h.005C17.584 22.963 24 17.6 24 10.989 24 5.38 18.584 0 11.974 0z" />
        </svg>
        Buy via WhatsApp
      </a>

      {/* Secondary row */}
      <div className="flex gap-2">        <button
          onClick={() => toggle(product.id)}
          id="product-wishlist-btn"
          className="flex-1 py-3 text-sm font-inter font-semibold rounded-full flex items-center justify-center gap-2 transition-all border"
          style={wishlisted
            ? { background: 'var(--color-crimson)', color: 'white', borderColor: 'var(--color-crimson)' }
            : { background: 'transparent', color: 'var(--color-crimson)', borderColor: 'var(--color-crimson)' }}
        >
          <Heart size={15} fill={wishlisted ? 'currentColor' : 'none'} />
          {wishlisted ? 'Wishlisted' : 'Wishlist'}
        </button>

        <button
          onClick={handleShare}
          id="product-share-btn"
          className="w-12 flex items-center justify-center rounded-full border transition-colors hover:bg-[var(--color-gold-pale)]"
          style={{ borderColor: 'var(--color-gray-light)', color: 'var(--color-gray-dark)' }}
          aria-label="Share product"
        >
          {copied ? <CheckCircle2 size={16} className="text-emerald-600" /> : <Share2 size={16} />}
        </button>
      </div>
    </div>
  )
}
