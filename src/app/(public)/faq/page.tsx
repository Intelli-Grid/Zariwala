import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'FAQ — Selling Your Vintage & Heritage Textiles to Zariwala',
  description:
    'Answers about selling your Banarasi silks, zari sarees, and vintage textiles — valuations, shipping protection, payment methods, and more.',
}

interface FAQItem {
  question: string
  answer: string
}
interface FAQSection {
  title: string
  icon: string
  items: FAQItem[]
}

const FAQ_SECTIONS: FAQSection[] = [
  {
    title: 'What We Buy',
    icon: '🪡',
    items: [
      {
        question: 'Do you buy Banarasi silks, zari sarees, and Indian heritage textiles?',
        answer:
          'Yes — this is our core specialty. We actively purchase vintage Banarasi brocades, Kanjivaram, Patola, Paithani, Chanderi, and other heritage weaves. We also evaluate pieces with heavy zari or zardozi embroidery work, antique kinkhab fabric, and pre-owned bridal lehenga sets in silk and zari.',
      },
      {
        question: 'What categories do you buy?',
        answer:
          'Our eight active categories are: Zari Sarees, Banarasi Silks, Heritage Brocades, Pure Silk Sarees, Zari Lehengas & Suits, Zari Blouses & Cholis, Silk Dupattas & Stoles, and Vintage Zari Fabric. Use our Sell page to choose your closest category when submitting.',
      },
      {
        question: 'Do you buy single items or whole collections?',
        answer:
          'Both. We regularly acquire single statement pieces — a pre-1970 kinkhab sari or a Benarasi wedding lehenga — as well as large estate collections, unsold stock from boutiques, and inherited wardrobes of 50–200+ pieces.',
      },
      {
        question: "I'm not sure if my item is genuinely vintage. Should I still contact you?",
        answer:
          'Absolutely. Send a few clear photos of the garment and its interior labels or weave marks. Our specialists will assess era and authenticity at no cost. Many pieces that sellers assume are "just old" turn out to have significant collector value.',
      },
      {
        question: 'What condition does my item need to be in?',
        answer:
          "We buy items from 'Fair' condition up to 'Deadstock/Unworn'. Wear, softening of zari thread, or small moth nips are often acceptable for older pieces. Please describe any visible damage honestly — it helps us give you the most accurate offer.",
      },
    ],
  },
  {
    title: 'Valuations & Offers',
    icon: '💰',
    items: [
      {
        question: 'How do you calculate the price of my items?',
        answer:
          'Offers are based on five factors: era of weave, thread quality (pure vs. mixed zari), completeness of the set, current collector demand, and our historical sales database. Pure zari and kinkhab pieces from pre-1980 typically command the highest offers.',
      },
      {
        question: 'How long does it take to get an offer?',
        answer:
          'Once you submit your photos, our specialists review them within 24 hours on business days. You will receive a detailed response with an initial offer — or a request for additional angles if needed for authentication.',
      },
      {
        question: 'Is there any obligation to sell after getting an offer?',
        answer:
          'None whatsoever. Valuations are entirely free and carry zero obligation. If you decide not to proceed, simply let us know and we close the inquiry — no pressure, no follow-up.',
      },
      {
        question: 'What if you receive my item and change the offer?',
        answer:
          'We base our offers on your submitted photos. In rare cases where an item has significant undisclosed damage upon physical inspection, we may revise the offer. If you decline the revision, we ship the item back to you at our expense.',
      },
    ],
  },
  {
    title: 'Shipping & Safety',
    icon: '🛡️',
    items: [
      {
        question: 'How do I ship my item safely?',
        answer:
          'Before you ship anything, our team will advise you on the safest and most cost-effective courier for your specific item and location. For high-value pieces we always recommend a service with declared value and insurance. We do not ask you to ship until you are fully comfortable.',
      },
      {
        question: 'Is my item protected in transit?',
        answer:
          'We strongly recommend insured shipping with a declared value that matches your offer. For India-based sellers, India Post Speed Post with declared value or services like DTDC and Delhivery with declared value work well. We will provide step-by-step guidance before your shipment.',
      },
      {
        question: 'Do you provide pre-paid shipping labels?',
        answer:
          'For sellers in the US and UK, we can arrange a pre-paid insured label at our cost. For India-based sellers, we guide you to the best local option and the shipping cost is factored into your final payout.',
      },
      {
        question: 'Do I need to clean the item before sending?',
        answer:
          'No. Please do not attempt to clean or restore the piece yourself — incorrect washing can irreversibly damage delicate zari threads and reduce value significantly. We handle all specialist cleaning and conservation in-house.',
      },
    ],
  },
  {
    title: 'Payment & Process',
    icon: '⚡',
    items: [
      {
        question: 'How do I get paid?',
        answer:
          'Payment is processed within 24 hours of receiving and verifying your item. For India-based sellers we use NEFT/RTGS bank transfer. International sellers can receive payment via PayPal, Wise, or Zelle depending on their country.',
      },
      {
        question: 'Do you buy items from India and other countries?',
        answer:
          'Yes — we operate globally. Our specialist teams cover items from India (particularly Varanasi, Surat, Kanjivaram, and Mumbai), Japan, Southeast Asia, the UK, and the US.',
      },
      {
        question: 'Are my photos and personal details kept private?',
        answer:
          'Completely. Your photos are used only for internal evaluation purposes and are never shared publicly, sold to third parties, or used without your explicit written consent.',
      },
      {
        question: 'Can I track the status of my inquiry?',
        answer:
          'Yes. Every submission receives a reference number in the format ZRW-YYYY-XXXXX. Visit zariwala.online/track and enter your reference to see the real-time status of your inquiry across our five-step process.',
      },
    ],
  },
  {
    title: 'What We Do Not Buy',
    icon: '🚫',
    items: [
      {
        question: 'What items do you not buy?',
        answer:
          'We do not purchase: fast-fashion reproductions of traditional weaves (machine-made "Banarasi look" synthetics), heavily soiled or water-damaged fabric beyond restoration, unbranded modern polyester garments, or items without a plausible provenance story when authenticity is claimed.',
      },
      {
        question: 'How can I tell if my saree is genuine zari vs. synthetic?',
        answer:
          'A simple test: real zari thread is made from thin metal foil wrapped around a silk core and feels cool and slightly heavy. Synthetic "zari" is lighter and tends to tarnish quickly. Send us photos of the weave edge and the interior label — our team can assess authenticity from detailed images in most cases.',
      },
    ],
  },
]

// JSON-LD for FAQ rich results in Google
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_SECTIONS.flatMap((s) =>
    s.items.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    }))
  ),
}

export default function FAQPage() {
  return (
    <div className="bg-[var(--color-ivory)] min-h-screen">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero */}
      <section className="bg-[var(--color-espresso)] py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl md:text-5xl text-[var(--color-ivory)] mb-6">
            Frequently Asked Questions
          </h1>
          <p className="font-body text-lg text-gray-300 leading-relaxed">
            Everything you need to know about selling your heritage textiles and vintage clothing to Zariwala.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          {FAQ_SECTIONS.map((section) => (
            <div key={section.title}>
              {/* Section heading */}
              <div className="flex items-center gap-3 mb-6 pb-3 border-b border-[var(--color-gold)]/20">
                <span className="text-2xl" aria-hidden="true">{section.icon}</span>
                <h2 className="font-display text-xl text-[var(--color-espresso)]">
                  {section.title}
                </h2>
              </div>

              {/* Questions */}
              <div className="space-y-3">
                {section.items.map((faq, i) => (
                  <details
                    key={i}
                    className="group bg-white rounded-2xl border border-[var(--color-ivory-dark)] shadow-sm hover:shadow-md hover:border-[var(--color-gold)]/20 transition-all duration-200 overflow-hidden"
                  >
                    <summary className="font-display text-lg text-[var(--color-espresso)] p-6 cursor-pointer list-none flex justify-between items-center select-none">
                      {faq.question}
                      <span className="text-[var(--color-gold)] transition-transform duration-300 group-open:-rotate-180 flex-shrink-0 ml-4">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                      </span>
                    </summary>
                    <div className="px-6 pb-6 font-body text-[var(--color-espresso-mid)] leading-relaxed text-[0.95rem] border-t border-[var(--color-ivory-dark)]/50 pt-4">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}

          {/* Bottom CTA */}
          <div className="text-center border-t border-[var(--color-gold)]/20 pt-12">
            <h2 className="font-display text-2xl text-[var(--color-espresso)] mb-4">Still have questions?</h2>
            <p className="font-body text-[var(--color-espresso-mid)] mb-8">
              Reach out directly — our team responds on WhatsApp within a few hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sell" className="btn-primary px-8">Get a Free Valuation</Link>
              <Link
                href="/contact"
                className="px-8 py-3 border border-[var(--color-gold)]/30 rounded-xl font-body font-medium text-[var(--color-espresso)] hover:bg-[var(--color-ivory-dark)] transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
