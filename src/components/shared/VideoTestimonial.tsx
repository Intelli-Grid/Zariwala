'use client'

import { useState } from 'react'

interface TestimonialWithVideo {
  id: string
  name: string
  country: string
  flag: string
  quote: string
  itemSold?: string | null
  amountRange?: string | null
  rating: number
  videoUrl?: string | null
  thumbnailUrl?: string | null
}

export function VideoTestimonial({ testimonial }: { testimonial: TestimonialWithVideo }) {
  const [playing, setPlaying] = useState(false)

  // Build autoplay embed URL (YouTube or Cloudinary)
  const embedSrc = testimonial.videoUrl
    ? testimonial.videoUrl.includes('youtube')
      ? testimonial.videoUrl.replace('watch?v=', 'embed/') + '?autoplay=1&rel=0'
      : testimonial.videoUrl + '?autoplay=1'
    : ''

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: '1px solid var(--border-on-light)', background: 'var(--surface-white)' }}
    >
      {/* Video area */}
      <div className="relative aspect-video bg-black">
        {!playing ? (
          <button
            onClick={() => setPlaying(true)}
            className="relative w-full h-full group cursor-pointer"
            aria-label={`Play video testimonial from ${testimonial.name}`}
          >
            {/* Thumbnail or gradient fallback */}
            {testimonial.thumbnailUrl ? (
              <img
                src={testimonial.thumbnailUrl}
                alt={`${testimonial.name} testimonial`}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity duration-300"
              />
            ) : (
              <div
                className="w-full h-full"
                style={{ background: 'linear-gradient(135deg, var(--surface-deep) 0%, var(--surface-dark) 100%)' }}
              />
            )}

            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-transform duration-200 group-hover:scale-110"
                style={{ background: 'rgba(255,255,255,0.95)' }}
              >
                <span className="text-2xl ml-1" style={{ color: 'var(--gold-core)' }}>▶</span>
              </div>
            </div>

            {/* Name overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4" style={{ background: 'linear-gradient(to top, rgba(14,14,12,0.85) 0%, transparent 100%)' }}>
              <p className="font-ui font-semibold text-white text-sm">{testimonial.name}</p>
              {testimonial.itemSold && (
                <p className="font-ui text-xs" style={{ color: 'rgba(245,224,160,0.8)' }}>{testimonial.itemSold}</p>
              )}
            </div>
          </button>
        ) : (
          <iframe
            src={embedSrc}
            className="w-full h-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={`Video testimonial from ${testimonial.name}`}
          />
        )}
      </div>

      {/* Text content */}
      <div className="p-5">
        {/* Stars */}
        <div className="flex gap-0.5 mb-3">
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <span key={i} style={{ color: 'var(--gold-core)' }}>★</span>
          ))}
        </div>

        <blockquote className="font-body text-sm leading-relaxed italic mb-4" style={{ color: 'var(--text-on-light-sub)' }}>
          "{testimonial.quote}"
        </blockquote>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-ui text-sm font-semibold" style={{ color: 'var(--text-on-light)' }}>
              {testimonial.flag} {testimonial.name}
            </p>
            <p className="font-ui text-xs mt-0.5" style={{ color: 'var(--text-on-light-mute)' }}>
              {testimonial.country}
            </p>
          </div>
          {testimonial.amountRange && (
            <span
              className="font-ui text-xs font-bold px-3 py-1 rounded-full"
              style={{ background: 'var(--surface-pale)', color: 'var(--gold-shadow)', border: '1px solid var(--border-on-light)' }}
            >
              {testimonial.amountRange}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
