import ValuationEstimator from './ValuationEstimator'

export const metadata = {
  title: 'Valuation Guide',
  description: 'How we determine the value of your vintage clothing collection.',
}

export default function ValuationGuidePage() {
  return (
    <div className="bg-[var(--color-ivory)] py-20 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl md:text-5xl text-[var(--color-espresso)] mb-6 text-center">
          Our Valuation Process
        </h1>
        <p className="font-body text-lg text-[var(--color-espresso-mid)] text-center mb-16 max-w-2xl mx-auto">
          We believe in transparent, honest pricing. Here is an inside look at the four primary factors we consider when making an offer on your vintage clothing.
        </p>

        <div className="space-y-12">
          {/* Factor 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-[var(--color-gold)]/10">
            <h2 className="font-display text-2xl text-[var(--color-espresso)] mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[var(--color-gold-light)] text-[var(--color-espresso)] flex items-center justify-center text-sm font-bold">1</span>
              Era & Age
            </h2>
            <p className="font-body text-[var(--color-espresso-mid)] leading-relaxed">
              The age of a garment usually plays a significant role in its value. Pieces from the 1940s-1970s generally command higher prices than those from the late 90s, assuming similar condition and brand. Specific details like stitch type (e.g., single stitch t-shirts) or zipper branding (e.g., Talon, Scovill) help us verify the precise era.
            </p>
          </div>

          {/* Factor 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-[var(--color-gold)]/10">
            <h2 className="font-display text-2xl text-[var(--color-espresso)] mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[var(--color-gold-light)] text-[var(--color-espresso)] flex items-center justify-center text-sm font-bold">2</span>
              Brand & Label History
            </h2>
            <p className="font-body text-[var(--color-espresso-mid)] leading-relaxed">
              Certain labels have legendary status in the vintage community. Levi's "Big E" or redline selvedge, vintage Carhartt double-knees, and early Nike or Adidas tags significantly affect valuation. We have an extensive internal database of tag variations to accurately price items.
            </p>
          </div>

          {/* Factor 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-[var(--color-gold)]/10">
            <h2 className="font-display text-2xl text-[var(--color-espresso)] mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[var(--color-gold-light)] text-[var(--color-espresso)] flex items-center justify-center text-sm font-bold">3</span>
              Condition & Wear
            </h2>
            <p className="font-body text-[var(--color-espresso-mid)] leading-relaxed">
              Condition is nuanced in vintage clothing. While "deadstock" (unworn with original tags) often garners the highest prices, perfectly faded and naturally distressed items — especially in workwear and denim — can also be highly valuable. We look for authentic wear versus artificial distressing, and assess any irreparable damage.
            </p>
          </div>

          {/* Factor 4 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-[var(--color-gold)]/10">
            <h2 className="font-display text-2xl text-[var(--color-espresso)] mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[var(--color-gold-light)] text-[var(--color-espresso)] flex items-center justify-center text-sm font-bold">4</span>
              Rarity & Demand
            </h2>
            <p className="font-body text-[var(--color-espresso-mid)] leading-relaxed">
              Ultimately, the market dictates value. Factors like the size (some sizes are much harder to find in vintage), the specific wash, unique fading, screenprint subjects (for tees), and current trends all affect how much we can offer. We base our prices on real-time market data to ensure you get a fair deal.
            </p>
          </div>
        </div>

        <ValuationEstimator />
      </div>
    </div>
  )
}
