import Image from 'next/image'

interface Appraiser {
  name: string
  title: string
  expertise: string
  experience: string
  credential: string
  avatar: string
  initials: string // Fallback when photo not yet available
}

const APPRAISERS: Appraiser[] = [
  {
    name: 'Anika Mehta',
    title: 'Senior Textile Specialist',
    expertise: 'Zari Authentication · Banarasi Silks · Heritage Brocades',
    experience: '12 years',
    credential: 'Trained at NIFT, Delhi',
    avatar: '',
    initials: 'AM',
  },
  {
    name: 'Rajan Iyer',
    title: 'Heritage Weave Authenticator',
    expertise: 'Kanchipuram Silk · Paithani · Kinkhab',
    experience: '9 years',
    credential: 'Former Curator, Crafts Museum',
    avatar: '',
    initials: 'RI',
  },
  {
    name: 'Sumaira Khan',
    title: 'Zardozi & Embroidery Expert',
    expertise: 'Zardozi · Chikankari · Bridal Textiles',
    experience: '7 years',
    credential: 'Lucknow School of Craft',
    avatar: '',
    initials: 'SK',
  },
]

interface ExpertProfilesProps {
  compact?: boolean // true = 3-column strip for homepage; false = full cards for About
}

export function ExpertProfiles({ compact = false }: ExpertProfilesProps) {
  if (compact) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
        {APPRAISERS.map((a) => (
          <div
            key={a.name}
            className="flex flex-col items-center text-center gap-3 p-6 rounded-xl"
            style={{ background: 'var(--surface-dark)', border: '1px solid var(--border-on-dark)' }}
          >
            {/* Avatar or initials fallback */}
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-display font-bold flex-shrink-0"
              style={{ background: 'var(--gold-core)', color: 'var(--surface-void)' }}
            >
              {a.initials}
            </div>
            <div>
              <p className="font-display text-base font-semibold" style={{ color: 'var(--text-on-dark)' }}>
                {a.name}
              </p>
              <p className="font-ui text-xs mt-0.5" style={{ color: 'var(--gold-bright)' }}>
                {a.title}
              </p>
              <p className="font-body text-xs mt-2" style={{ color: 'var(--text-on-dark-mute)' }}>
                {a.experience} experience
              </p>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
      {APPRAISERS.map((a) => (
        <div
          key={a.name}
          className="rounded-2xl overflow-hidden"
          style={{ background: 'var(--surface-white)', border: '1px solid var(--border-on-light)' }}
        >
          {/* Avatar area */}
          <div
            className="h-32 flex items-center justify-center"
            style={{ background: 'var(--surface-deep)', borderBottom: '3px solid var(--gold-core)' }}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-display font-bold"
              style={{ background: 'var(--gold-core)', color: 'var(--surface-void)' }}
            >
              {a.initials}
            </div>
          </div>

          {/* Info */}
          <div className="p-6">
            <h3 className="font-display text-xl font-semibold" style={{ color: 'var(--text-on-light)' }}>
              {a.name}
            </h3>
            <p className="font-ui text-sm font-medium mt-1" style={{ color: 'var(--gold-shadow)' }}>
              {a.title}
            </p>

            {/* Expertise tags */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {a.expertise.split(' · ').map((tag) => (
                <span
                  key={tag}
                  className="font-ui text-xs px-2.5 py-1 rounded-full"
                  style={{ background: 'var(--surface-pale)', color: 'var(--text-on-light-sub)', border: '1px solid var(--border-on-light)' }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Credential */}
            <p className="font-body text-sm mt-4" style={{ color: 'var(--text-on-light-mute)' }}>
              🎓 {a.credential}
            </p>
            <p className="font-body text-sm mt-1" style={{ color: 'var(--text-on-light-mute)' }}>
              ⏱ {a.experience} of experience
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
