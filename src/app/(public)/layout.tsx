import { Header } from '@/components/shared/Header'
import { Footer } from '@/components/shared/Footer'
import { FloatingContactButtons } from '@/components/shared/FloatingContactButtons'
import { MobileStickyBar } from '@/components/shared/MobileStickyBar'
import { AnnouncementBar } from '@/components/shared/AnnouncementBar'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnnouncementBar />
      <Header />
      {/* pb-16 on mobile to make room for MobileStickyBar */}
      <main className="pb-16 lg:pb-0">{children}</main>
      <Footer />
      <FloatingContactButtons />
      <MobileStickyBar />
    </>
  )
}
