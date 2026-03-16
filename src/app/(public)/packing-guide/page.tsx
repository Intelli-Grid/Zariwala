export const metadata = {
  title: 'Packing Guide | Zariwala',
}

export default function PackingGuidePage() {
  return (
    <div className="bg-[var(--color-ivory)] py-20 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl md:text-5xl text-[var(--color-espresso)] mb-8 text-center">
          How to Pack Your Vintage Clothing
        </h1>
        <p className="font-body text-lg text-[var(--color-espresso-mid)] text-center mb-16 max-w-2xl mx-auto">
          Properly packing vintage garments ensures they reach us exactly as they left you, securing your full valuation and preventing unwanted damage in transit.
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Do's and Don'ts */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-[var(--color-gold)]/10 h-full flex flex-col justify-between">
             <div className="space-y-4">
               <h2 className="font-display text-2xl text-[var(--color-espresso)] mb-6 text-green-700">The "Do's"</h2>
              <ul className="list-disc pl-5 font-body text-[var(--color-espresso-mid)] space-y-3 leading-relaxed">
                <li><span className="font-semibold text-[var(--color-espresso)]">Use sturdy, double-walled boxes.</span> The heavier the clothing, the stronger the box needs to be.</li>
                <li><span className="font-semibold text-[var(--color-espresso)]">Fold garments neatly.</span> Crumpled items take up more space and run the risk of getting damaged if zippers catch fabric.</li>
                <li><span className="font-semibold text-[var(--color-espresso)]">Wrap in plastic.</span> Place folded garments in a sealed plastic bag or garbage bag before placing them in the cardboard box to prevent water damage during transport.</li>
                <li><span className="font-semibold text-[var(--color-espresso)]">Secure zippers and buttons.</span> Fasten all hardware so it does not dig into adjacent fabric and cause tears.</li>
                <li><span className="font-semibold text-[var(--color-espresso)]">Fill empty space.</span> Use bubble wrap, craft paper, or air pillows so the clothing does not shift around in transit.</li>
              </ul>
            </div>
            
            <div className="space-y-4 mt-8 pt-8 border-t border-[var(--color-ivory-dark)]">
               <h2 className="font-display text-2xl text-[var(--color-espresso)] mb-6 text-red-700">The "Don'ts"</h2>
               <ul className="list-disc pl-5 font-body text-[var(--color-espresso-mid)] space-y-3 leading-relaxed">
                <li><span className="font-semibold text-[var(--color-espresso)]">Do not over-pack.</span> If a box is bulging, the tape will likely fail during shipment.</li>
                <li><span className="font-semibold text-[var(--color-espresso)]">Do not use scented bags or dryer sheets.</span> Keep the scent of the clothing neutral.</li>
                <li><span className="font-semibold text-[var(--color-espresso)]">Do not leave loose garments against the box seams.</span> When someone uses a box cutter to open the package, the fabric shouldn't be the first thing the blade hits. Always leave a buffer or use plastic wrap.</li>
              </ul>
            </div>
          </div>

          {/* Special Items */}
          <div className="bg-[#1A1A1A] p-8 rounded-2xl shadow-xl text-white">
             <h2 className="font-display text-3xl text-[var(--color-gold)] mb-8">Special Categories</h2>
             
             <div className="space-y-8">
               <div>
                 <h3 className="font-display text-xl text-[var(--color-ivory)] mb-3">Vintage Denim (Jeans/Jackets)</h3>
                 <p className="font-body text-gray-300 text-sm leading-relaxed">
                   Denim is incredibly durable, but high-value denim (like stiff selvedge or dry-rot suspected jeans) should not be severely compressed. Fold along the seams (not across the middle of the leg if possible) and stack them flat.
                 </p>
               </div>

               <div>
                 <h3 className="font-display text-xl text-[var(--color-ivory)] mb-3">Single-Stitch Tees & Thin Cottons</h3>
                 <p className="font-body text-gray-300 text-sm leading-relaxed">
                   Decades-old cotton gets extremely brittle. Make sure tees are smooth before folding, and do not stack heavy items on top of them. T-shirts are highly susceptible to box-cutter damage, so place them in the center of the box.
                 </p>
               </div>

               <div>
                 <h3 className="font-display text-xl text-[var(--color-ivory)] mb-3">Fragile Silks, Zari, & Heritage Textiles</h3>
                 <p className="font-body text-gray-300 text-sm leading-relaxed">
                   These should be wrapped individually in acid-free tissue paper if available, or clean white cotton. Metallic threads (zari) can heavily tarnish if exposed to extreme humidity or harsh plastics, so avoid locking them in airtight plastic in hot climates unless using a silica gel packet.
                 </p>
               </div>
             </div>
          </div>

        </div>
        
         <div className="mt-16 text-center">
            <h2 className="font-display text-2xl text-[var(--color-espresso)] mb-4">Ready to ship?</h2>
            <p className="font-body text-[var(--color-espresso-mid)] mb-8">Make sure to confirm your shipping label with our team before sending.</p>
            <a href="/sell" className="btn-primary px-8">Return to Inquiry</a>
          </div>

      </div>
    </div>
  )
}
