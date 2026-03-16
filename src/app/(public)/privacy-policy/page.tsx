export const metadata = {
  title: 'Privacy Policy | Zariwala',
  description: 'How Zariwala collects, uses, and protects your personal data.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[var(--color-ivory)] py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl text-[var(--color-espresso)] mb-4">Privacy Policy</h1>
        <p className="font-body text-sm text-[var(--color-gray-500)] mb-12">Last updated: March 2026</p>

        {[
          {
            title: '1. Who We Are',
            content: `Zariwala ("we", "our", "us") is an online platform that purchases vintage clothing and heritage textiles directly from sellers worldwide. Our contact for privacy matters is available through our Contact page.`,
          },
          {
            title: '2. Information We Collect',
            content: `When you submit an inquiry to sell your items, we collect your name, country, contact details (WhatsApp number or email address), information about the items you wish to sell, and photos you choose to upload. We may also collect standard technical data such as IP address and browser type when you visit our website.`,
          },
          {
            title: '3. How We Use Your Information',
            content: `We use the information you provide to: evaluate your items and prepare an offer; communicate with you about your inquiry; improve our platform and services; and comply with any applicable legal obligations.`,
          },
          {
            title: '4. Data Sharing',
            content: `We do not sell your personal data to third parties. We may share data with trusted service providers who help us operate our platform (such as cloud storage, email delivery, and database services), all of whom are contractually bound to protect your data.`,
          },
          {
            title: '5. Photo Uploads',
            content: `Photos you upload are stored securely using Cloudinary, a professional cloud media service. Photos are used solely for the purpose of evaluating your items. If your inquiry is closed, you may request deletion of your photos at any time by contacting us.`,
          },
          {
            title: '6. Your Rights',
            content: `Depending on your jurisdiction, you may have the right to access, correct, or delete your personal data. To exercise these rights or to ask questions about your data, please contact us via our Contact page.`,
          },
          {
            title: '7. Data Retention',
            content: `We retain your inquiry data for up to 3 years to fulfil our business obligations. You may request earlier deletion by contacting us directly.`,
          },
          {
            title: '8. Cookies',
            content: `Our website uses only essential cookies required for the site to function correctly (authentication session cookies). We do not use advertising or tracking cookies without your explicit consent.`,
          },
          {
            title: '9. Changes to This Policy',
            content: `We may update this policy from time to time. The date at the top of this page will reflect the latest revision.`,
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
