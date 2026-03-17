import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://zariwala.online'),
  title: {
    default: 'Zariwala — We Buy Your Vintage Clothing Worldwide',
    template: '%s | Zariwala',
  },
  description:
    'Zariwala buys quality vintage clothing from sellers in the US, UK, and Asia. ' +
    'Fair prices, simple process. Send photos via WhatsApp for a free valuation.',
  keywords: [
    'sell vintage clothing',
    'vintage clothing buyer',
    'sell vintage levis',
    'zariwala',
    'vintage clothing buyer uk',
    'vintage clothing buyer usa',
    'sell vintage denim online',
    'heritage textiles buyer',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://zariwala.online',
    siteName: 'Zariwala',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: 'https://zariwala.online' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Zariwala',
  description:
    'Zariwala buys quality vintage clothing globally — US, UK, and Asia. Fair prices, WhatsApp-first process.',
  url: 'https://zariwala.online',
  logo: 'https://zariwala.online/og-image.jpg',
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: 'English',
    },
  ],
  sameAs: ['https://www.instagram.com/zariwala'],
  areaServed: ['US', 'GB', 'JP', 'IN', 'AU', 'CA'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body
        className="min-h-screen font-body text-[var(--body-color)] bg-[var(--zari-pale)]"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  )
}
