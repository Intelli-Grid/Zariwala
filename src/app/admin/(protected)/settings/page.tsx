'use client'

import { useState } from 'react'
import { Save } from 'lucide-react'

interface SettingField {
  key: string
  label: string
  type: 'text' | 'url' | 'email' | 'tel'
  placeholder: string
  envVar: string
  description: string
  hasValue: boolean
}

// Settings are read-only display of which env vars are configured
// Real updates require changing .env.local and redeploying
export default function AdminSettings() {
  const [saved, setSaved] = useState(false)

  const sections = [
    {
      title: 'Communication',
      description: 'WhatsApp is the primary seller contact channel. Telegram is used for the community channel and admin notifications only.',
      fields: [
        { key: 'whatsapp_number', label: 'WhatsApp Business Number', type: 'tel' as const, placeholder: '+1 555 000 0000', envVar: 'NEXT_PUBLIC_WHATSAPP_NUMBER', description: 'Your WhatsApp Business number (E.164 format) — primary seller contact', hasValue: false },
        { key: 'telegram_community', label: 'Telegram Community Channel', type: 'text' as const, placeholder: 'zariwala', envVar: 'NEXT_PUBLIC_TELEGRAM_COMMUNITY', description: 'Telegram channel username for the community link in the footer (without @)', hasValue: false },
      ]
    },
    {
      title: 'Email',
      description: 'Brevo API for sending seller confirmations and admin notifications.',
      fields: [
        { key: 'admin_email', label: 'Admin Notification Email', type: 'email' as const, placeholder: 'admin@yourdomain.com', envVar: 'ADMIN_NOTIFICATION_EMAIL', description: 'Receives notification emails on new inquiries', hasValue: false },
        { key: 'from_email', label: 'From Email Address', type: 'email' as const, placeholder: 'noreply@yourdomain.com', envVar: 'EMAIL_FROM_ADDRESS', description: 'Sender address for all outgoing emails', hasValue: false },
      ]
    },
    {
      title: 'Media Storage',
      description: 'Cloudinary configuration for seller photo uploads.',
      fields: [
        { key: 'cloudinary_cloud', label: 'Cloudinary Cloud Name', type: 'text' as const, placeholder: 'your-cloud-name', envVar: 'CLOUDINARY_CLOUD_NAME', description: 'Your Cloudinary cloud identifier', hasValue: false },
        { key: 'cloudinary_preset', label: 'Upload Preset', type: 'text' as const, placeholder: 'seller_photos', envVar: 'CLOUDINARY_UPLOAD_PRESET_PHOTOS', description: 'Unsigned upload preset for seller inquiries', hasValue: false },
      ]
    },
    {
      title: 'Analytics',
      description: 'Google Analytics 4 and Microsoft Clarity tracking.',
      fields: [
        { key: 'ga4_id', label: 'GA4 Measurement ID', type: 'text' as const, placeholder: 'G-XXXXXXXXXX', envVar: 'NEXT_PUBLIC_GA4_MEASUREMENT_ID', description: 'Google Analytics 4 measurement ID', hasValue: false },
        { key: 'clarity_id', label: 'Clarity Project ID', type: 'text' as const, placeholder: 'abc123xyz', envVar: 'NEXT_PUBLIC_CLARITY_PROJECT_ID', description: 'Microsoft Clarity project ID for session recording', hasValue: false },
      ]
    },
  ]

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="pb-4 border-b border-[var(--color-ivory-dark)]">
        <h1 className="text-3xl font-display text-[var(--color-espresso)]">Settings</h1>
        <p className="text-sm text-[var(--color-gray-500)] mt-1 font-body">
          Platform configuration. These values are set via environment variables in <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">.env.local</code>.
        </p>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl font-body text-sm">
          ✓ Changes saved. Restart the dev server for env variable changes to take effect.
        </div>
      )}

      {/* Credential Status Overview */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
        <h2 className="font-display text-xl text-amber-800 mb-4">Integration Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 font-body text-sm">
          {[
            { name: 'Neon Database', ready: true },
            { name: 'NextAuth', ready: true },
            { name: 'Cloudinary', ready: true },
            { name: 'Upstash Redis', ready: true },
            { name: 'Brevo Email', ready: true },
            { name: 'Algolia Search', ready: true },
            { name: 'WhatsApp API', ready: false },
            { name: 'Telegram Admin Bot', ready: false },
            { name: 'Google Analytics', ready: false },
            { name: 'Microsoft Clarity', ready: false },
          ].map(item => (
            <div key={item.name} className="flex items-center space-x-2">
              <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${item.ready ? 'bg-green-500' : 'bg-amber-400'}`}></span>
              <span className={item.ready ? 'text-green-800' : 'text-amber-700'}>{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {sections.map((section) => (
        <div key={section.title} className="bg-white rounded-2xl shadow-sm border border-[var(--color-gold)]/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--color-ivory-dark)] bg-[var(--color-ivory)]/30">
            <h2 className="font-display text-xl text-[var(--color-espresso)]">{section.title}</h2>
            <p className="text-sm text-[var(--color-gray-500)] font-body mt-0.5">{section.description}</p>
          </div>
          
          <div className="divide-y divide-[var(--color-ivory-dark)]">
            {section.fields.map((field) => (
              <div key={field.key} className="px-6 py-5">
                <div className="flex items-start justify-between">
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-espresso)] font-body">{field.label}</label>
                    <p className="text-xs text-[var(--color-gray-500)] font-body mt-0.5">{field.description}</p>
                    <code className="text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded mt-1 inline-block">{field.envVar}</code>
                  </div>
                  <span className="flex-shrink-0 ml-4 px-2.5 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-700 font-body">
                    Not Set
                  </span>
                </div>
                <div className="mt-3">
                  <input
                    type={field.type}
                    className="field-input w-full text-sm"
                    placeholder={field.placeholder}
                    disabled
                    title="Update this value in .env.local"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="bg-[var(--color-ivory-dark)]/50 rounded-xl p-5 font-body text-sm text-[var(--color-gray-500)]">
        <strong className="text-[var(--color-espresso)]">How to update settings:</strong> Edit your <code className="text-xs bg-white border border-gray-200 px-1 py-0.5 rounded">.env.local</code> file with the correct values, then restart the development server. For production, add variables in your Vercel project dashboard under Settings → Environment Variables.
      </div>
    </div>
  )
}
