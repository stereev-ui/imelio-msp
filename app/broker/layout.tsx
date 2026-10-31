import type { Metadata } from 'next'
import { BrokerSidebar } from '@/components/broker/broker-sidebar'
import { WipProvider } from '@/components/broker/wip-provider'

export const metadata: Metadata = {
  title: {
    default: 'Broker Dashboard | Imelio Commercial',
    template: '%s | Imelio Commercial Brokers',
  },
  description: 'Manage your pipeline, listings, contacts, WIP milestones and documents on the Imelio broker platform.',
  robots: { index: false, follow: false },
}

export default function BrokerLayout({ children }: { children: React.ReactNode }) {
  return (
    <WipProvider>
      <div className="flex min-h-dvh flex-col bg-secondary lg:flex-row">
        <BrokerSidebar />
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-6">{children}</div>
        </main>
      </div>
    </WipProvider>
  )
}
