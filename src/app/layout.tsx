import { Playfair_Display, Lato, Inter, JetBrains_Mono } from 'next/font/google'
import type { Metadata, Viewport } from 'next'

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-display', display: 'swap' })
const lato = Lato({ weight: ['300', '400', '700'], subsets: ['latin'], variable: '--font-body', display: 'swap' })
const inter = Inter({ subsets: ['latin'], variable: '--font-ui', display: 'swap' })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' })
import { GoogleAnalytics } from '@next/third-parties/google'
import AnalyticsTracker from '@/components/shared/AnalyticsTracker'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

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
  const GA_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || ''
  const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || ''

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        {CLARITY_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${CLARITY_ID}");
              `,
            }}
          />
        )}
      </head>
      <body
        className={`min-h-screen font-body text-[var(--body-color)] bg-[var(--zari-pale)] ${playfair.variable} ${lato.variable} ${inter.variable} ${jetbrains.variable}`}
        suppressHydrationWarning
      >
        <AnalyticsTracker />
        {children}
        {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
      </body>
    </html>
  )
}
