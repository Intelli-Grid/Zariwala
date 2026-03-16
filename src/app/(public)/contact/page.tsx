export const metadata = {
  title: 'Contact | Zariwala',
  description:
    'Get in touch with Zariwala. WhatsApp is the fastest way to reach us for buying and selling vintage clothing.',
}

export default function ContactPage() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '1XXXXXXXXXX'
  const telegramCommunity = process.env.NEXT_PUBLIC_TELEGRAM_COMMUNITY || 'zariwala'

  const waHref = `https://wa.me/${whatsapp}?text=${encodeURIComponent(
    "Hi Zariwala! I have a question about selling my vintage items."
  )}`

  return (
    <div style={{ background: 'var(--zari-pale)' }} className="py-20 lg:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="font-ui text-xs font-semibold uppercase tracking-[0.22em] mb-4" style={{ color: 'var(--zari-gold)' }}>
            Get In Touch
          </p>
          <h1 className="font-display text-4xl md:text-5xl mb-5" style={{ color: 'var(--ink)' }}>
            How Can We Help?
          </h1>
          <p className="font-body text-lg leading-relaxed max-w-xl mx-auto" style={{ color: 'var(--muted)' }}>
            WhatsApp is the fastest way to reach us — for selling inquiries, valuations, or any question about the process.
          </p>
        </div>

        {/* WhatsApp — PRIMARY, only direct contact method */}
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          id="contact-whatsapp-cta"
          className="group flex flex-col sm:flex-row items-center gap-6 rounded-2xl p-8 mb-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          style={{
            background: '#fff',
            border: '1.5px solid var(--border)',
            boxShadow: '0 2px 12px rgba(28,28,26,0.06)',
          }}
        >
          <div
            className="flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center transition-colors group-hover:scale-105 duration-300"
            style={{ background: 'rgba(37,211,102,0.12)' }}
          >
            <svg className="w-8 h-8" fill="#25D366" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.15-.174.2-.298.3-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
              <h2 className="font-display text-2xl" style={{ color: 'var(--ink)' }}>WhatsApp</h2>
              <span
                className="font-ui text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{ background: 'rgba(37,211,102,0.12)', color: '#128C7E' }}
              >
                Fastest Response
              </span>
            </div>
            <p className="font-body mb-2" style={{ color: 'var(--body-color)' }}>
              Send us photos and a description of your items. We reply within 4 hours during business hours.
            </p>
            <p className="font-ui text-sm" style={{ color: 'var(--muted)' }}>
              Available: Mon–Sat, 9am–7pm (your local time)
            </p>
          </div>
          <span
            className="flex-shrink-0 font-ui text-sm font-semibold group-hover:underline"
            style={{ color: '#128C7E' }}
          >
            Open WhatsApp Chat →
          </span>
        </a>

        {/* Email */}
        <a
          href="mailto:hello@zariwala.com"
          id="contact-email-cta"
          className="group flex flex-col sm:flex-row items-center gap-6 rounded-2xl p-8 mb-12 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          style={{
            background: '#fff',
            border: '1.5px solid var(--border)',
            boxShadow: '0 2px 12px rgba(28,28,26,0.06)',
          }}
        >
          <div
            className="flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300"
            style={{ background: 'rgba(184,134,11,0.10)' }}
          >
            <svg className="w-8 h-8" fill="none" stroke="var(--zari-gold)" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="font-display text-2xl mb-1" style={{ color: 'var(--ink)' }}>Email</h2>
            <p className="font-body mb-2" style={{ color: 'var(--body-color)' }}>
              For formal inquiries, wholesale requests, or media. We aim to respond within 1 business day.
            </p>
            <p className="font-ui text-sm" style={{ color: 'var(--muted)' }}>hello@zariwala.com</p>
          </div>
          <span
            className="flex-shrink-0 font-ui text-sm font-semibold group-hover:underline"
            style={{ color: 'var(--zari-gold)' }}
          >
            Send an Email →
          </span>
        </a>

        {/* CTA to sell form */}
        <div
          className="rounded-2xl p-10 text-center mb-12"
          style={{ background: 'var(--ink)' }}
        >
          <h2 className="font-display text-2xl mb-3" style={{ color: 'var(--zari-warm)' }}>
            Submit a Detailed Inquiry
          </h2>
          <p className="font-body text-sm leading-relaxed mb-7 max-w-md mx-auto" style={{ color: 'var(--muted)' }}>
            Prefer to provide all details upfront? Use our structured seller form — upload photos, describe your items, and get a faster evaluation.
          </p>
          <a href="/sell" className="btn-secondary px-8 py-3.5">
            Start Inquiry Form
          </a>
        </div>

        {/* Telegram — community note only, clearly framed */}
        <div
          className="rounded-xl p-5 text-center"
          style={{ background: 'var(--zari-warm)', border: '1px solid var(--border)' }}
        >
          <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--body-color)' }}>
            🪡 <strong>Love vintage?</strong> Join the Zariwala Telegram channel for valuation tips, style guides, and behind-the-scenes updates from our team.
          </p>
          <a
            href={`https://t.me/${telegramCommunity}`}
            target="_blank"
            rel="noopener noreferrer"
            id="contact-telegram-community"
            className="inline-block mt-3 font-ui text-sm underline underline-offset-2 transition-colors"
            style={{ color: 'var(--muted)' }}
          >
            Join our Telegram community →
          </a>
        </div>

      </div>
    </div>
  )
}
