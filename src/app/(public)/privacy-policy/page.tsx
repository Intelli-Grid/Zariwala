import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Zariwala',
  description: 'How Zariwala handles and protects your data, GDPR and CCPA compliance, and WhatsApp communication policies.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[var(--color-ivory)] min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-[var(--color-ivory-dark)]">
        <h1 className="font-display text-4xl text-[var(--color-espresso)] mb-8 pb-4 border-b border-[var(--color-gold)]/20">
          Privacy Policy
        </h1>
        
        <div className="space-y-8 font-body text-[var(--color-espresso-mid)] leading-relaxed">
          <section>
            <p className="text-sm text-[var(--color-gray-500)] mb-4">Last updated: March 2026</p>
            <p>
              At Zariwala, we respect your privacy and are committed to protecting your personal data. 
              This privacy policy explains how we collect, use, and safeguard your information when you visit our website or interact with us via WhatsApp and other channels.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-[var(--color-espresso)] mb-3">1. Data Collection and Usage</h2>
            <p>We collect information strictly necessary to provide valuation services and process purchases. This includes:</p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li><strong>Contact Information:</strong> Phone numbers (via WhatsApp), email addresses, and names provided during inquiries.</li>
              <li><strong>Item Information:</strong> Photos and descriptions of garments submitted for evaluation.</li>
              <li><strong>Payment & Shipping:</strong> Bank details or PayPal addresses, strictly securely processed for payouts, and physical addresses for arranging pickups or labels.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-[var(--color-espresso)] mb-3">2. WhatsApp & Meta Data</h2>
            <p>
              We use WhatsApp Business API to facilitate rapid evaluations. When you contact us via WhatsApp:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>Your phone number and messages are securely processed through Meta's infrastructure.</li>
              <li>We only use this channel to converse regarding your specific inquiry and valuation.</li>
              <li>We will never sell or share your phone number with third-party marketers.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-[var(--color-espresso)] mb-3">3. GDPR & CCPA Compliance (Your Rights)</h2>
            <p>Depending on your region, you possess fundamental rights concerning your personal data:</p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li><strong>Right to Access:</strong> You can request a copy of the data we hold on you.</li>
              <li><strong>Right to Rectification:</strong> You may request we correct inaccurate data.</li>
              <li><strong>Right to Erasure ("Right to be Forgotten"):</strong> You have the absolute right to request we delete your contact info, chat history, and submitted photos from our active systems.</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, please email us at <strong>hello@zariwala.online</strong>. We process all erasure requests within 14 days.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-[var(--color-espresso)] mb-3">4. Cookies and Analytics</h2>
            <p>
              We use minimal cookies combined with Google Analytics 4 (GA4) and Microsoft Clarity to understand website traffic, measure errors, and optimize the seller experience. 
              These tools aggregate data and do not identify you individually.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
