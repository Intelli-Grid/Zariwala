interface WhatsAppIconProps {
  /** Tailwind size class e.g. "w-5 h-5". Defaults to "w-5 h-5" */
  className?: string
  /** CSS color. Defaults to "white" (works on dark backgrounds) */
  color?: string
}

/**
 * Shared WhatsApp SVG icon.
 * Replaces six+ inline SVG duplicates across the codebase.
 *
 * Usage:
 *   <WhatsAppIcon />                        — white 20x20 (default)
 *   <WhatsAppIcon className="w-4 h-4" />   — smaller
 *   <WhatsAppIcon color="var(--whatsapp)" /> — green on light background
 */
export function WhatsAppIcon({ className = 'w-5 h-5', color = 'white' }: WhatsAppIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      style={{ fill: color }}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M11.974 0C5.364 0 0 5.363 0 11.973c0 2.105.553 4.076 1.514 5.782L.057 23.143l5.557-1.457a11.94 11.94 0 005.36 1.277h.005C17.584 22.963 24 17.6 24 10.989 24 5.38 18.584 0 11.974 0z" />
    </svg>
  )
}
