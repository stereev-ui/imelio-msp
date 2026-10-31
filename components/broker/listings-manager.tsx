'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { Eye, MapPin, MessageSquare, Search, Timer } from 'lucide-react'
import { brokerListings, type ListingStatus } from '@/lib/broker-data'
import { formatZar } from '@/lib/properties'
import { cn } from '@/lib/utils'

const statuses: (ListingStatus | 'All')[] = ['All', 'Active', 'Under Offer', 'Draft', 'Sold']

const statusStyles: Record<ListingStatus, string> = {
  Active: 'bg-accent text-accent-foreground',
  'Under Offer': 'bg-primary text-primary-foreground',
  Draft: 'bg-secondary text-muted-foreground',
  Sold: 'bg-chart-5/20 text-foreground',
}

export function ListingsManager() {
  const [status, setStatus] = useState<ListingStatus | 'All'>('All')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return brokerListings.filter(
      (l) =>
        (status === 'All' || l.status === status) &&
        (!q || [l.title, l.suburb, l.city, l.id].some((field) => field.toLowerCase().includes(q))),
    )
  }, [status, query])

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div role="tablist" aria-label="Listing status" className="flex flex-wrap gap-1">
          {statuses.map((s) => {
            const count = s === 'All' ? brokerListings.length : brokerListings.filter((l) => l.status === s).length
            return (
              <button
                key={s}
                type="button"
                role="tab"
                aria-selected={status === s}
                onClick={() => setStatus(s)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                  status === s ? 'bg-primary text-primary-foreground' : 'text-foreground/80 hover:bg-secondary',
                )}
              >
                {s} <span className="opacity-60">{count}</span>
              </button>
            )
          })}
        </div>
        <label className="relative sm:w-64">
          <span className="sr-only">Search listings</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, suburb or ref"
            className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </label>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border bg-card px-4 py-12 text-center text-sm text-muted-foreground">
          No listings match your filters.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((listing) => (
            <li key={listing.id}>
              <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <div className="relative aspect-[16/9] bg-muted">
                  <Image
                    src={listing.image}
                    alt={`${listing.title} in ${listing.suburb}`}
                    fill
                    sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
                    className="object-cover"
                  />
                  <span className={cn('absolute left-3 top-3 rounded-md px-2 py-1 text-xs font-semibold', statusStyles[listing.status])}>
                    {listing.status}
                  </span>
                  <span className="absolute right-3 top-3 rounded-md bg-background/90 px-2 py-1 text-xs font-semibold text-primary backdrop-blur">
                    {listing.listingType === 'lease' ? 'To Lease' : 'For Sale'}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div>
                    <p className="text-lg font-semibold tracking-tight text-primary">
                      {formatZar(listing.price)}
                      {listing.listingType === 'lease' && <span className="text-sm font-medium text-muted-foreground"> / month</span>}
                    </p>
                    <h2 className="text-sm font-semibold text-foreground">{listing.title}</h2>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="size-3.5 text-accent" aria-hidden="true" />
                      {listing.suburb}, {listing.city} · {listing.gla.toLocaleString('en-ZA')} m² GLA
                    </p>
                  </div>
                  <dl className="mt-auto grid grid-cols-3 gap-2 border-t border-border pt-3 text-center">
                    <div>
                      <dt className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                        <Eye className="size-3.5" aria-hidden="true" /> Views
                      </dt>
                      <dd className="text-sm font-semibold text-foreground">{listing.views.toLocaleString('en-ZA')}</dd>
                    </div>
                    <div>
                      <dt className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                        <MessageSquare className="size-3.5" aria-hidden="true" /> Leads
                      </dt>
                      <dd className="text-sm font-semibold text-foreground">{listing.enquiries}</dd>
                    </div>
                    <div>
                      <dt className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                        <Timer className="size-3.5" aria-hidden="true" /> DOM
                      </dt>
                      <dd className="text-sm font-semibold text-foreground">{listing.daysOnMarket}d</dd>
                    </div>
                  </dl>
                  <p className="text-xs text-muted-foreground">Ref {listing.id}</p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
