import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      className="min-h-[60vh] flex items-center justify-center px-4"
      style={{ background: 'var(--color-silk-ivory)' }}
    >
      <div className="text-center max-w-md">
        <p className="text-6xl mb-4">🥻</p>
        <h1 className="font-playfair text-4xl font-bold mb-3" style={{ color: 'var(--color-charcoal)' }}>
          Page Not Found
        </h1>
        <p className="font-hind text-base mb-8" style={{ color: 'var(--color-gray-mid)' }}>
          Like a rare find at a textile fair, this page seems to have found a new home.
          Let's get you back on track.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/" className="btn-gold">Back to Homepage</Link>
          <Link href="/gallery" className="btn-outline-gold">Browse Gallery</Link>
        </div>
      </div>
    </div>
  )
}
