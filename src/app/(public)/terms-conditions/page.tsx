export const metadata = {
  title: 'Terms & Conditions | Zariwala',
  description: 'The terms and conditions governing use of the Zariwala platform.',
}

export default function TermsPage() {
  return (
    <div className="bg-[var(--color-ivory)] py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl text-[var(--color-espresso)] mb-4">Terms & Conditions</h1>
        <p className="font-body text-sm text-[var(--color-gray-500)] mb-12">Last updated: March 2026</p>

        {[
          {
            title: '1. Acceptance of Terms',
            content: `By accessing or using the Zariwala website and submitting an inquiry, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.`,
          },
          {
            title: '2. Our Service',
            content: `Zariwala provides an online platform through which owners of vintage clothing and heritage textiles may receive valuations and sell their items to us directly. All purchase offers are made at our sole discretion and are non-binding until a final written agreement is reached.`,
          },
          {
            title: '3. Seller Representations',
            content: `By submitting an inquiry, you represent that you are the legal owner of the items described, that the items are free from any lien or encumbrance, and that all photographs and descriptions provided are accurate and not misleading.`,
          },
          {
            title: '4. Valuations & Offers',
            content: `Any valuation or offer communicated through our platform or via messaging channels is an expression of interest only and is not legally binding. A binding purchase agreement only exists once both parties have confirmed the terms in writing and we have confirmed receipt of the goods in the described condition.`,
          },
          {
            title: '5. Condition Disputes',
            content: `If items received do not match the condition described or photographed in the original inquiry, we reserve the right to revise or withdraw our offer. We will communicate any such revision promptly and you may choose to have your items returned (at your expense).`,
          },
          {
            title: '6. Payment',
            content: `Upon agreeing to an offer and receiving items in the confirmed condition, we commit to processing payment within 5 business days via the method agreed upon. We are not responsible for delays caused by banking systems outside our control.`,
          },
          {
            title: '7. Intellectual Property',
            content: `All content on this website — including text, images, logos, and design — is the property of Zariwala. You may not reproduce or distribute any content without our prior written permission.`,
          },
          {
            title: '8. Limitation of Liability',
            content: `To the maximum extent permitted by applicable law, Zariwala will not be liable for any indirect, incidental, or consequential damages arising from your use of this platform or any transaction conducted through it.`,
          },
          {
            title: '9. Governing Law',
            content: `These terms shall be governed by and construed in accordance with applicable law. Any disputes shall be subject to resolution through good-faith negotiation in the first instance.`,
          },
          {
            title: '10. Changes to Terms',
            content: `We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes your acceptance of the revised terms.`,
          },
        ].map(section => (
          <div key={section.title} className="mb-10">
            <h2 className="font-display text-xl text-[var(--color-espresso)] mb-3">{section.title}</h2>
            <p className="font-body text-[var(--color-espresso-mid)] leading-relaxed">{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
