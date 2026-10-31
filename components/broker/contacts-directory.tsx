'use client'

import { useMemo, useState } from 'react'
import { Briefcase, Flame, Mail, MapPin, Phone, Search } from 'lucide-react'
import { contacts, dealById, parseIsoDate, type Contact, type ContactRole } from '@/lib/broker-data'
import { cn } from '@/lib/utils'

const roles: (ContactRole | 'All')[] = ['All', 'Buyer', 'Seller', 'Tenant', 'Landlord', 'Attorney', 'Bond Originator']

function initials(name: string) {
  return name
    .replace(/^Adv\.\s*/, '')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
}

function ContactDetail({ contact }: { contact: Contact }) {
  const deal = contact.linkedDeal ? dealById(contact.linkedDeal) : undefined
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <span className="flex size-12 items-center justify-center rounded-full bg-primary text-base font-semibold text-primary-foreground">
          {initials(contact.name)}
        </span>
        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold text-primary">{contact.name}</h2>
          <p className="truncate text-sm text-muted-foreground">
            {contact.role}
            {contact.company && ` · ${contact.company}`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <a
          href={`mailto:${contact.email}`}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Mail className="size-4" aria-hidden="true" /> Email
        </a>
        <a
          href={`tel:${contact.phone.replace(/\s/g, '')}`}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-border text-sm font-semibold text-primary transition-colors hover:bg-secondary"
        >
          <Phone className="size-4" aria-hidden="true" /> Call
        </a>
      </div>

      <dl className="flex flex-col gap-3 text-sm">
        <div className="flex items-center gap-2">
          <dt className="sr-only">Email</dt>
          <Mail className="size-4 text-accent" aria-hidden="true" />
          <dd className="truncate text-foreground">{contact.email}</dd>
        </div>
        <div className="flex items-center gap-2">
          <dt className="sr-only">Phone</dt>
          <Phone className="size-4 text-accent" aria-hidden="true" />
          <dd className="text-foreground">{contact.phone}</dd>
        </div>
        <div className="flex items-center gap-2">
          <dt className="sr-only">City</dt>
          <MapPin className="size-4 text-accent" aria-hidden="true" />
          <dd className="text-foreground">{contact.city}</dd>
        </div>
      </dl>

      {deal && (
        <div className="rounded-xl bg-secondary p-3">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Briefcase className="size-3.5" aria-hidden="true" /> Linked deal
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">{deal.propertyTitle}</p>
          <p className="text-xs text-muted-foreground">
            {deal.id} · {deal.stage}
          </p>
        </div>
      )}

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Notes</h3>
        <p className="mt-1 text-pretty text-sm text-foreground/80">{contact.notes}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          Last contact{' '}
          {parseIsoDate(contact.lastContact).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>
    </div>
  )
}

export function ContactsDirectory() {
  const [role, setRole] = useState<ContactRole | 'All'>('All')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(contacts[0].id)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return contacts.filter(
      (c) =>
        (role === 'All' || c.role === role) &&
        (!q || [c.name, c.company ?? '', c.email, c.city].some((f) => f.toLowerCase().includes(q))),
    )
  }, [role, query])

  const selected = contacts.find((c) => c.id === selectedId) ?? filtered[0]

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <section aria-label="Contact list" className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm lg:col-span-2">
        <label className="relative">
          <span className="sr-only">Search contacts</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, company, email or city"
            className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </label>
        <div className="flex flex-wrap gap-1.5" aria-label="Filter by role">
          {roles.map((r) => (
            <button
              key={r}
              type="button"
              aria-pressed={role === r}
              onClick={() => setRole(r)}
              className={cn(
                'rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
                role === r ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-foreground/80 hover:border-primary/40',
              )}
            >
              {r}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="rounded-xl bg-secondary px-4 py-10 text-center text-sm text-muted-foreground">No contacts found.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {filtered.map((contact) => (
              <li key={contact.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(contact.id)}
                  aria-current={selected?.id === contact.id ? 'true' : undefined}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-2 py-3 text-left transition-colors',
                    selected?.id === contact.id ? 'bg-secondary' : 'hover:bg-secondary/60',
                  )}
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent/15 text-sm font-semibold text-primary">
                    {initials(contact.name)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                      <span className="truncate">{contact.name}</span>
                      {contact.hot && (
                        <Flame className="size-3.5 shrink-0 text-destructive" aria-label="Hot lead" />
                      )}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {contact.company ?? contact.city}
                    </span>
                  </span>
                  <span className="hidden rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary sm:inline">
                    {contact.role}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <aside aria-label="Contact details" className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:sticky lg:top-8 lg:self-start">
        {selected ? <ContactDetail contact={selected} /> : <p className="text-sm text-muted-foreground">Select a contact.</p>}
      </aside>
    </div>
  )
}
