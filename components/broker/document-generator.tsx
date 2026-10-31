'use client'

import { useMemo, useState } from 'react'
import { Download, FileSignature, FileText, Handshake, Printer, Receipt } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ImelioLogo } from '@/components/imelio-logo'
import { BROKER_SPLIT, broker, deals, grossCommission, type Deal } from '@/lib/broker-data'
import { formatZar } from '@/lib/properties'
import { cn } from '@/lib/utils'

type TemplateId = 'otp' | 'loi' | 'mandate' | 'invoice'

type Fields = {
  party: string
  property: string
  amount: string
  depositPercent: string
  ddDays: string
  bondDays: string
  commissionRate: string
  notes: string
}

const templates: { id: TemplateId; label: string; description: string; icon: typeof FileText }[] = [
  { id: 'otp', label: 'Offer to Purchase', description: 'Commercial sale with suspensive conditions', icon: FileSignature },
  { id: 'loi', label: 'Letter of Intent', description: 'Non-binding lease heads of terms', icon: Handshake },
  { id: 'mandate', label: 'Sole Mandate', description: 'Exclusive seller or landlord mandate', icon: FileText },
  { id: 'invoice', label: 'Commission Invoice', description: 'Invoice on registration / lease signature', icon: Receipt },
]

function fieldsFromDeal(deal: Deal): Fields {
  return {
    party: deal.counterparty,
    property: `${deal.propertyTitle}, ${deal.suburb}`,
    amount: String(deal.value),
    depositPercent: '10',
    ddDays: '21',
    bondDays: '30',
    commissionRate: String(deal.commissionRate * 100),
    notes: '',
  }
}

function buildDocument(template: TemplateId, f: Fields) {
  const amount = Number(f.amount) || 0
  const rate = (Number(f.commissionRate) || 0) / 100
  const deposit = amount * ((Number(f.depositPercent) || 0) / 100)
  const today = new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })

  switch (template) {
    case 'otp':
      return {
        title: 'Offer to Purchase – Commercial Property',
        sections: [
          ['Parties', `${f.party} ("the Purchaser") offers to purchase the property described below from the registered owner ("the Seller").`],
          ['Property', f.property],
          ['Purchase price', `${formatZar(amount)} (excluding VAT, unless the transaction qualifies as a going concern at 0%).`],
          ['Deposit', `A deposit of ${formatZar(deposit)} (${f.depositPercent}%) shall be paid into the trust account of the conveyancer within 5 business days of acceptance, to be invested in terms of Section 86(4) of the Legal Practice Act.`],
          ['Due diligence', `This offer is subject to the Purchaser completing a satisfactory legal, technical and financial due diligence within ${f.ddDays} days of acceptance.`],
          ['Finance', `This offer is subject to the Purchaser obtaining a bond or finance approval for the balance of the price within ${f.bondDays} days of acceptance.`],
          ['Commission', `The Seller shall pay agent's commission of ${f.commissionRate}% plus VAT to Imelio Commercial, earned on registration of transfer.`],
        ],
        date: today,
      }
    case 'loi':
      return {
        title: 'Letter of Intent – Commercial Lease',
        sections: [
          ['Proposed tenant', f.party],
          ['Premises', f.property],
          ['Rental', `${formatZar(amount)} per month excluding VAT, escalating at 7% per annum.`],
          ['Deposit', `Equivalent of ${f.depositPercent === '10' ? '3' : f.depositPercent} months gross rental, payable on signature of the lease agreement.`],
          ['Vetting period', `Subject to landlord credit vetting of the tenant within ${f.ddDays} days.`],
          ['Status', 'This letter is non-binding and records the principal terms on which the parties intend to conclude a formal lease agreement.'],
        ],
        date: today,
      }
    case 'mandate':
      return {
        title: 'Sole and Exclusive Mandate',
        sections: [
          ['Principal', f.party],
          ['Property', f.property],
          ['Asking price', formatZar(amount)],
          ['Mandate period', `${f.bondDays} days from date of signature, during which Imelio Commercial is the sole agent.`],
          ['Commission', `${f.commissionRate}% plus VAT of the final price, payable on registration or lease commencement.`],
          ['Compliance', 'Imelio Commercial and its brokers hold valid Fidelity Fund Certificates issued by the PPRA in terms of the Property Practitioners Act 22 of 2019.'],
        ],
        date: today,
      }
    case 'invoice': {
      const gross = amount * rate
      const vat = gross * 0.15
      return {
        title: 'Tax Invoice – Agent Commission',
        sections: [
          ['Bill to', f.party],
          ['Transaction', f.property],
          ['Transaction value', formatZar(amount)],
          ['Commission', `${f.commissionRate}% · ${formatZar(gross)}`],
          ['VAT (15%)', formatZar(vat)],
          ['Total due', formatZar(gross + vat)],
          ['Broker share', `${BROKER_SPLIT * 100}% of commission excl. VAT: ${formatZar(gross * BROKER_SPLIT)}`],
        ],
        date: today,
      }
    }
  }
}

export function DocumentGenerator() {
  const activeDeals = deals
  const [template, setTemplate] = useState<TemplateId>('otp')
  const [dealId, setDealId] = useState(activeDeals[0].id)
  const [fields, setFields] = useState<Fields>(() => fieldsFromDeal(activeDeals[0]))

  const doc = useMemo(() => buildDocument(template, fields), [template, fields])
  const selectedDeal = activeDeals.find((d) => d.id === dealId)

  const update = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFields((f) => ({ ...f, [key]: e.target.value }))

  const handleDeal = (id: string) => {
    setDealId(id)
    const deal = activeDeals.find((d) => d.id === id)
    if (deal) setFields(fieldsFromDeal(deal))
  }

  const download = () => {
    const text = [
      'IMELIO COMMERCIAL',
      doc.title.toUpperCase(),
      `Date: ${doc.date}`,
      '',
      ...doc.sections.map(([heading, body]) => `${heading.toUpperCase()}\n${body}\n`),
      fields.notes ? `ADDITIONAL TERMS\n${fields.notes}\n` : '',
      `Prepared by ${broker.name} (${broker.ffc})`,
    ].join('\n')
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `${doc.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-${dealId}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col gap-6">
      <fieldset>
        <legend className="sr-only">Choose a template</legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {templates.map((t) => {
            const Icon = t.icon
            const active = template === t.id
            return (
              <label
                key={t.id}
                className={cn(
                  'flex cursor-pointer items-start gap-3 rounded-2xl border bg-card p-4 shadow-sm transition-colors has-focus-visible:ring-3 has-focus-visible:ring-ring/50',
                  active ? 'border-accent ring-1 ring-accent' : 'border-border hover:border-primary/30',
                )}
              >
                <input
                  type="radio"
                  name="template"
                  value={t.id}
                  checked={active}
                  onChange={() => setTemplate(t.id)}
                  className="sr-only"
                />
                <span
                  className={cn(
                    'flex size-9 shrink-0 items-center justify-center rounded-lg',
                    active ? 'bg-accent text-accent-foreground' : 'bg-secondary text-primary',
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-foreground">{t.label}</span>
                  <span className="block text-xs text-muted-foreground">{t.description}</span>
                </span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm xl:col-span-2 xl:self-start"
        >
          <h2 className="text-base font-semibold text-primary">Details</h2>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="doc-deal">Pre-fill from deal</Label>
            <select
              id="doc-deal"
              value={dealId}
              onChange={(e) => handleDeal(e.target.value)}
              className="h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {activeDeals.map((deal) => (
                <option key={deal.id} value={deal.id}>
                  {deal.id} · {deal.propertyTitle}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="doc-party">{template === 'loi' ? 'Tenant' : template === 'mandate' ? 'Principal' : 'Counterparty'}</Label>
            <Input id="doc-party" value={fields.party} onChange={update('party')} maxLength={120} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="doc-property">Property</Label>
            <Input id="doc-property" value={fields.property} onChange={update('property')} maxLength={160} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="doc-amount">{template === 'loi' ? 'Monthly rental (R)' : 'Amount (R)'}</Label>
              <Input id="doc-amount" type="number" min={0} inputMode="numeric" value={fields.amount} onChange={update('amount')} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="doc-rate">Commission %</Label>
              <Input id="doc-rate" type="number" min={0} max={20} step={0.5} value={fields.commissionRate} onChange={update('commissionRate')} />
            </div>
          </div>
          {template !== 'invoice' && (
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="doc-deposit">Deposit %</Label>
                <Input id="doc-deposit" type="number" min={0} max={100} value={fields.depositPercent} onChange={update('depositPercent')} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="doc-dd">DD days</Label>
                <Input id="doc-dd" type="number" min={0} value={fields.ddDays} onChange={update('ddDays')} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="doc-bond">{template === 'mandate' ? 'Term days' : 'Bond days'}</Label>
                <Input id="doc-bond" type="number" min={0} value={fields.bondDays} onChange={update('bondDays')} />
              </div>
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="doc-notes">Additional terms</Label>
            <textarea
              id="doc-notes"
              rows={3}
              value={fields.notes}
              onChange={update('notes')}
              maxLength={600}
              className="w-full rounded-lg border border-input bg-background px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={download}
              className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Download className="size-4" aria-hidden="true" /> Download
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-border px-4 text-sm font-semibold text-primary transition-colors hover:bg-secondary"
            >
              <Printer className="size-4" aria-hidden="true" /> Print
            </button>
          </div>
        </form>

        <article
          aria-label="Document preview"
          className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-10 xl:col-span-3"
        >
          <header className="flex items-start justify-between gap-4 border-b-2 border-primary pb-5">
            <div>
              <ImelioLogo />
              <p className="mt-2 text-xs text-muted-foreground">Imelio Commercial · Registered with the PPRA</p>
            </div>
            <div className="text-right text-xs text-muted-foreground">
              <p>{doc.date}</p>
              <p>Ref {selectedDeal?.id}</p>
            </div>
          </header>
          <h2 className="mt-6 text-balance text-xl font-semibold tracking-tight text-primary">{doc.title}</h2>
          <dl className="mt-6 flex flex-col gap-4">
            {doc.sections.map(([heading, body]) => (
              <div key={heading} className="grid grid-cols-1 gap-1 sm:grid-cols-[10rem_1fr] sm:gap-4">
                <dt className="text-xs font-semibold uppercase tracking-wide text-accent">{heading}</dt>
                <dd className="text-pretty text-sm leading-relaxed text-foreground">{body}</dd>
              </div>
            ))}
            {fields.notes && (
              <div className="grid grid-cols-1 gap-1 sm:grid-cols-[10rem_1fr] sm:gap-4">
                <dt className="text-xs font-semibold uppercase tracking-wide text-accent">Additional terms</dt>
                <dd className="whitespace-pre-line text-sm leading-relaxed text-foreground">{fields.notes}</dd>
              </div>
            )}
          </dl>
          <footer className="mt-10 grid grid-cols-2 gap-6 border-t border-border pt-6 text-xs text-muted-foreground">
            <div>
              <div className="h-10 border-b border-foreground/30" />
              <p className="mt-1.5">{fields.party || 'Counterparty'}</p>
            </div>
            <div>
              <div className="h-10 border-b border-foreground/30" />
              <p className="mt-1.5">
                {broker.name} · {broker.ffc}
              </p>
            </div>
          </footer>
        </article>
      </div>
    </div>
  )
}
