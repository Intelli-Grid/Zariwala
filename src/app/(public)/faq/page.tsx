import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Zariwala',
  description: 'Answers to your questions about selling vintage clothing. Learn about valuations, payment methods, shipping, and more.',
}

const faqs = [
  {
    question: "How long does it take to get a valuation?",
    answer: "We aim to respond to all inquiries with an initial valuation within 24 hours. Complex collections with many rare items may take slightly longer, but we will always communicate our timeline."
  },
  {
    question: "How do you calculate the price of my items?",
    answer: "Our offers are based on four primary factors: the era/age of the garment, the specific brand and label variations, the condition and natural wear, and current market demand and rarity. We use an extensive internal database of historical sales to ensure fair pricing."
  },
  {
    question: "Do I have to clean the clothes before sending them?",
    answer: "While it is always appreciated, it is not strictly necessary. Please do not attempt to remove tough stains or mend items yourself if you aren't experienced — incorrect washing can significantly decrease a vintage item's value. We handle specialized cleaning."
  },
  {
    question: "How and when do I get paid?",
    answer: "We process payments immediately upon receiving and inspecting your items. For US sellers: PayPal, Zelle, Venmo, or bank transfer. UK sellers: bank transfer (BACS) or PayPal. International sellers: PayPal or Wise."
  },
  {
    question: "Who pays for the shipping?",
    answer: "For US and UK sellers, we can provide a prepaid shipping label — the cost is transparently deducted from your final offer. For international sellers or large collections, we will work with you to find the most cost-effective method."
  },
  {
    question: "What if you receive my items and change your offer?",
    answer: "We base our offers on the photos and descriptions you provide. In rare cases where an item has significant undisclosed damage, we may need to adjust the offer. If you decline the revised offer, we ship the items back to you at our expense."
  },
  {
    question: "Do you buy single items or entire collections?",
    answer: "Both! We regularly buy single 'grail' pieces as well as massive estate collections of hundreds of garments. No collection is too large or too small."
  },
  {
    question: "I'm not sure if my items are vintage or valuable. Should I still contact you?",
    answer: "Absolutely. Our team loves reviewing items. Even if you're unsure of an item's history, send a few clear photos of the garment and its tags — our experts will gladly take a look at no obligation."
  },
  {
    question: "Which countries do you buy from?",
    answer: "We buy from sellers anywhere in the world. We have experience working with sellers in the US, UK, Japan, Korea, India, Australia, Canada, and across Southeast Asia and Europe."
  },
  {
    question: "Are my photos private?",
    answer: "Yes, completely. Your photos are used solely for evaluation purposes and are never shared publicly, sold, or used in marketing without your explicit permission."
  },
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
