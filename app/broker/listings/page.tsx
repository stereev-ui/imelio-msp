import type { Metadata } from 'next'
import { PageHeader } from '@/components/broker/page-header'
import { ListingsManager } from '@/components/broker/listings-manager'

export const metadata: Metadata = { title: 'My Listings' }

export default function BrokerListingsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Mandates"
        title="My Listings"
        description="Track performance and status of every property you have listed on Imelio."
      />
      <ListingsManager />
    </>
  )
}
