'use client'

// FloatingWhatsApp — the only floating contact button per Zariwala blueprint.
// Telegram is NOT shown here. It is only linked as a community channel in the Footer.

const WA_MESSAGE = "Hi Zariwala! I have vintage clothing I'd like to sell."

export function FloatingContactButtons() {
  const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '1XXXXXXXXXX'
  const href = `https://wa.me/${WA}?text=${encodeURIComponent(WA_MESSAGE)}`

  return (
    <div
      className="fixed bottom-6 right-4 sm:right-6 z-50"
      aria-label="Contact Zariwala on WhatsApp"
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Send photos on WhatsApp — get a free quote"
        id="floating-whatsapp-btn"
        className="flex items-center justify-center w-14 h-14 rounded-full text-white shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95 btn-whatsapp-pulse"
        style={{ background: 'var(--whatsapp)' }}
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M11.974 0C5.364 0 0 5.363 0 11.973c0 2.105.553 4.076 1.514 5.782L.057 23.143l5.557-1.457a11.94 11.94 0 005.36 1.277h.005C17.584 22.963 24 17.6 24 10.989 24 5.38 18.584 0 11.974 0z" />
        </svg>
      </a>
    </div>
  )
}
