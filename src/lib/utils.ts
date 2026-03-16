/**
 * Utility helpers for Zariwala platform.
 */

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format any number as USD (or another currency) */
export function formatCurrency(amount: number | string, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(amount))
}

export function formatNumber(n: number | string) {
  return new Intl.NumberFormat('en-US').format(Number(n))
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function generateReference(): string {
  const year = new Date().getFullYear()
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase()
  return `ZRW-${year}-${rand}`
}

/** Vintage clothing categories available for inquiry submissions */
export const SELL_CATEGORIES = [
  { value: 'vintage-denim', label: 'Vintage Denim (Levi\'s, Lee, Wrangler)' },
  { value: 'band-tees', label: 'Band / Graphic Tees' },
  { value: 'retro-sportswear', label: 'Retro Sportswear (Nike, Adidas, Champion)' },
  { value: 'designer-labels', label: 'Designer Labels (Ralph Lauren, Burberry, etc.)' },
  { value: 'vintage-outerwear', label: 'Vintage Outerwear / Leather Jackets' },
  { value: 'heritage-textiles', label: 'Heritage Textiles (Silk, Zari, Handloom)' },
  { value: 'vintage-workwear', label: 'Vintage Workwear (Carhartt, Dickies)' },
  { value: 'accessories', label: 'Vintage Accessories (Bags, Scarves, Belts)' },
  { value: 'mixed-collection', label: 'Mixed / Full Wardrobe Clearance' },
  { value: 'other', label: 'Other (describe below)' },
]

export const ERA_OPTIONS = [
  '1920s–1940s',
  '1950s',
  '1960s',
  '1970s',
  '1980s',
  '1990s',
  'Y2K (2000–2009)',
  'Mixed / Unknown',
]

export const CONDITION_OPTIONS = [
  { value: 'EXCELLENT', label: 'Excellent — Minimal wear, no visible damage' },
  { value: 'GOOD',      label: 'Good — Light wear, minor issues' },
  { value: 'FAIR',      label: 'Fair — Visible wear, some damage' },
]

export const STATUS_LABELS: Record<string, string> = {
  NEW:          'New',
  IN_REVIEW:    'Reviewing',
  OFFER_SENT:   'Offer Sent',
  ACCEPTED:     'Accepted',
  REJECTED:     'Rejected',
  ITEM_RECEIVED:'Item Received',
  PAYMENT_SENT: 'Payment Sent',
  COMPLETED:    'Completed',
  ARCHIVED:     'Archived',
}

export const CONTACT_METHOD_OPTIONS = [
  { value: 'WHATSAPP', label: 'WhatsApp' },
  { value: 'EMAIL',    label: 'Email' },
]

// ── Backward-compat aliases (for legacy components) ────────────────────────
/** @deprecated Use formatCurrency() instead */
export const formatINR = (amount: number | string) => formatCurrency(amount, 'INR')

/** @deprecated */
export const SELL_CATEGORY_OPTIONS = SELL_CATEGORIES

/** @deprecated No-op style map kept for compile compatibility */
export const CATEGORY_LABELS: Record<string, string> = {
  'vintage-denim':    'Vintage Denim',
  'band-tees':        'Band Tees',
  'retro-sportswear': 'Retro Sportswear',
  'designer-labels':  'Designer Labels',
  'vintage-outerwear':'Vintage Outerwear',
  'heritage-textiles':'Heritage Textiles',
  'vintage-workwear': 'Vintage Workwear',
  'accessories':      'Accessories',
  'mixed-collection': 'Mixed Collection',
  'other':            'Other',
}

/** @deprecated */
export const CONDITION_STYLES: Record<string, { label: string; bg: string; text: string; border: string; dot: string }> = {
  EXCELLENT: { label: 'Excellent', bg: 'bg-teal-100',   text: 'text-teal-800',   border: 'border-teal-200',   dot: 'bg-teal-500'   },
  GOOD:      { label: 'Good',      bg: 'bg-amber-100',  text: 'text-amber-800',  border: 'border-amber-200',  dot: 'bg-amber-500'  },
  FAIR:      { label: 'Fair',      bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200', dot: 'bg-orange-500' },
}
