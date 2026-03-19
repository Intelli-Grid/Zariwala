import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Zariwala',
  description: 'Answers to your questions about selling vintage clothing. Learn about valuations, payment methods, shipping, and more.',
}

const faqs = [
  {
    question: "Do you buy silk sarees and Indian heritage textiles?",
    answer: "Yes, we actively purchase vintage Banarasi, Kanjivaram, Patola, Paithani, and other heritage textiles. We also evaluate zari and zardozi embroidery pieces, antique shawls, and vintage designer saris."
  },
  {
    question: "What vintage clothing do you buy?",
    answer: "We focus on six core categories: Denim & Workwear, Retro Sports & Streetwear, Archive Designer & Luxury, Silk Sarees & Heritage Weaves, Jackets & Outerwear, and Bags, Scarves & Accessories."
  },
  {
    question: "How long does it take to get an offer?",
    answer: "Once you submit your photos, our team reviews them within 24 hours. You'll receive a detailed response with an initial offer or a request for additional angles if needed."
  },
  {
    question: "How do I get paid?",
    answer: "We process payments immediately upon receiving and inspecting your items. We support direct Bank Transfers (NEFT/RTGS for India), PayPal, Wise, Zelle, and Venmo depending on your location."
  },
  {
    question: "Do you buy items from India and Asia?",
    answer: "Yes! We operate globally and have specialized evaluation teams for items sourced from India, Japan, Southeast Asia, the UK, and the US."
  },
  {
    question: "What condition does my item need to be in?",
    answer: "We buy items ranging from 'Fair' to 'Deadstock/Excellent'. Fades, distress, and repairs are often acceptable (especially in Denim & Workwear), but please ensure the items are accurately described in your submission."
  },
  {
    question: "Is there any obligation to sell after getting an offer?",
    answer: "Absolutely not. Our initial valuation and offer are entirely free with zero obligation. If you choose not to proceed, we simply close the inquiry."
  },
  {
    question: "How do I ship my item?",
    answer: "For certain regions like the US and UK, we provide prepaid shipping labels. For India and other regions, we will guide you on the most secure and cost-effective courier service, and the shipping costs are factored safely into your payout."
  },
  {
    question: "Are my photos kept private?",
    answer: "Yes, completely. Your photos are used solely for evaluation purposes and are never shared publicly, sold, or used without your explicit permission."
  },
  {
    question: "What items don't you buy?",
    answer: "We do not buy fast fashion brands (e.g., modern Zara, H&M, Shein), heavily soiled or contaminated garments, heavily altered modern suits, or unbranded modern basics. We also cannot buy items without clear provenance regarding authenticity if it's a luxury brand."
  },
  {
    question: "How do you calculate the price of my items?",
    answer: "Offers are based on era, brand, rarity, condition, and current vintage market demand. We utilize historical sales databases to offer fair wholesale-to-retail margins."
  },
  {
    question: "Do I have to clean the clothes before sending them?",
    answer: "While appreciated, it is not strictly necessary. Please avoid attempting to remove tough stains yourself, as incorrect washing can decrease a vintage item's value. We handle specialized cleaning."
  },
  {
    question: "What if you receive my items and change your offer?",
    answer: "We base our offers on your photos. In rare cases where an item has significant undisclosed damage upon physical inspection, we may adjust the offer. If you decline the revision, we ship the items back to you at our expense."
  },
  {
    question: "Do you buy single items or entire collections?",
    answer: "Both! We regularly buy single 'grail' pieces as well as massive estate collections or deadstock hauls of hundreds of garments."
  },
  {
    question: "I'm not sure if my items are vintage. Should I still contact you?",
    answer: "Absolutely. Even if you're unsure of an item's history, send a few clear photos of the garment and its interior tags. Our experts will gladly evaluate it at no cost."
  }
]

// JSON-LD structured data for FAQ rich results in Google
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
}

export default function FAQPage() {
  return (
    <div className="bg-[var(--color-ivory)] min-h-screen">
      {/* JSON-LD for Google rich results */}
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
            Everything you need to know about selling your vintage clothing to us.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group bg-white rounded-2xl border border-[var(--color-ivory-dark)] shadow-sm hover:shadow-md hover:border-[var(--color-gold)]/20 transition-all duration-200 overflow-hidden"
              >
                <summary className="font-display text-lg text-[var(--color-espresso)] p-6 cursor-pointer list-none flex justify-between items-center select-none">
                  {faq.question}
                  <span className="text-[var(--color-gold)] transition-transform duration-300 group-open:-rotate-180">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </span>
                </summary>
                <div className="px-6 pb-6 font-body text-[var(--color-espresso-mid)] leading-relaxed text-[0.95rem] border-t border-[var(--color-ivory-dark)]/50 pt-4 animate-in fade-in duration-300">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>

          <div className="mt-16 text-center border-t border-[var(--color-gold)]/20 pt-12">
            <h2 className="font-display text-2xl text-[var(--color-espresso)] mb-4">Still have questions?</h2>
            <p className="font-body text-[var(--color-espresso-mid)] mb-8">
              Reach out directly — our team is happy to help with anything not covered here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-primary px-8">Contact Us</Link>
              <Link href="/sell" className="px-8 py-3 border border-[var(--color-gold)]/30 rounded-xl font-body font-medium text-[var(--color-espresso)] hover:bg-[var(--color-ivory-dark)] transition-colors">
                Start an Inquiry
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
