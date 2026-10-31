import type { Metadata } from 'next'
import { PageHeader } from '@/components/broker/page-header'
import { ContactsDirectory } from '@/components/broker/contacts-directory'

export const metadata: Metadata = { title: 'CRM & Contacts' }

export default function BrokerCrmPage() {
  return (
    <>
      <PageHeader
        eyebrow="Relationships"
        title="CRM & Contacts"
        description="Buyers, tenants, landlords, conveyancers and bond originators linked to your deals."
      />
      <ContactsDirectory />
    </>
  )
}
