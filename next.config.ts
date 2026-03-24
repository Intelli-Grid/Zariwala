import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async headers() {
    return [
      {
        source: '/admin/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
    ]
  },
  async redirects() {
    return [
      // Legacy redirect pre-dating slug system
      {
        source: '/categories/band-tees',
        destination: '/categories/zari-sarees',
        permanent: true,
      },
      // ── Old Western category slugs → nearest new zari/silk equivalent ──
      {
        source: '/categories/denim',
        destination: '/what-we-buy',
        permanent: true,
      },
      {
        source: '/categories/outerwear',
        destination: '/what-we-buy',
        permanent: true,
      },
      {
        source: '/categories/sportswear',
        destination: '/what-we-buy',
        permanent: true,
      },
      {
        source: '/categories/designer',
        destination: '/what-we-buy',
        permanent: true,
      },
      {
        source: '/categories/accessories',
        destination: '/what-we-buy',
        permanent: true,
      },
      {
        source: '/categories/heritage-textiles',
        destination: '/categories/zari-sarees',
        permanent: true,
      },
      // ── Temporarily deactivate blog ──
      {
        source: '/blog',
        destination: '/',
        permanent: true,
      },
      {
        source: '/blog/:path*',
        destination: '/',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
