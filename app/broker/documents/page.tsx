import type { Metadata } from 'next'
import { PageHeader } from '@/components/broker/page-header'
import { DocumentGenerator } from '@/components/broker/document-generator'

export const metadata: Metadata = { title: 'Document Generator' }

export default function BrokerDocumentsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Paperwork"
        title="Document Generator"
        description="Generate offers, letters of intent, mandates and commission invoices pre-filled from your deals."
      />
      <DocumentGenerator />
    </>
  )
}
