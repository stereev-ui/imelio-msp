import Image from 'next/image'
import { Search, MapPin } from 'lucide-react'
import { formatZar, priceOptions, type PropertyFilters } from '@/lib/properties'

const selectClass =
  'h-11 w-full appearance-none rounded-lg border border-input bg-background bg-[url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22/%3E%3C/svg%3E")] bg-[length:16px] bg-[right_0.75rem_center] bg-no-repeat pl-3 pr-9 text-sm text-foreground outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40'

const labelClass = 'mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground'

export function HeroSearch({ filters }: { filters: PropertyFilters }) {
  return (
    <section className="relative isolate overflow-hidden bg-primary">
      <Image
        src="/images/hero.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover opacity-40"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/70 via-primary/60 to-primary"
      />

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24 lg:px-8 lg:pb-24">
        <div className="max-w-3xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 text-xs font-medium text-primary-foreground">
            <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
            {"The world's fairest commercial and residential marketplace"}
          </p>
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
            Find space that moves your life forward.
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-primary-foreground/80 sm:text-lg">
            Search offices, warehouses, retail units and homes across South Africa —
            listed by verified Imelio brokers.
          </p>
        </div>

        <form
          action="/#listings"
          method="get"
          role="search"
          aria-label="Search properties"
          className="mt-10 rounded-2xl bg-card p-4 shadow-2xl shadow-primary/30 sm:p-5"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
            <div className="lg:col-span-2">
              <label htmlFor="type" className={labelClass}>
                Property Type
              </label>
              <select id="type" name="type" defaultValue={filters.type ?? ''} className={selectClass}>
                <option value="">All types</option>
                <option value="commercial">Commercial</option>
                <option value="residential">Residential</option>
              </select>
            </div>

            <div className="lg:col-span-2">
              <label htmlFor="listing" className={labelClass}>
                Listing Type
              </label>
              <select id="listing" name="listing" defaultValue={filters.listing ?? ''} className={selectClass}>
                <option value="">Sale or lease</option>
                <option value="sale">For Sale</option>
                <option value="lease">To Lease</option>
              </select>
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label htmlFor="location" className={labelClass}>
                Location
              </label>
              <div className="relative">
                <MapPin
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  id="location"
                  name="location"
                  type="text"
                  defaultValue={filters.location ?? ''}
                  placeholder="Suburb, city or province"
                  className="h-11 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
                />
              </div>
            </div>

            <fieldset className="sm:col-span-2 lg:col-span-3">
              <legend className={labelClass}>Price Range (ZAR)</legend>
              <div className="grid grid-cols-2 gap-2">
                <label htmlFor="min" className="sr-only">
                  Minimum price
                </label>
                <select id="min" name="min" defaultValue={filters.min ?? ''} className={selectClass}>
                  <option value="">No min</option>
                  {priceOptions.map((value) => (
                    <option key={value} value={value}>
                      {formatZar(value)}
                    </option>
                  ))}
                </select>
                <label htmlFor="max" className="sr-only">
                  Maximum price
                </label>
                <select id="max" name="max" defaultValue={filters.max ?? ''} className={selectClass}>
                  <option value="">No max</option>
                  {priceOptions.map((value) => (
                    <option key={value} value={value}>
                      {formatZar(value)}
                    </option>
                  ))}
                </select>
              </div>
            </fieldset>

            <div className="flex items-end sm:col-span-2 lg:col-span-2">
              <button
                type="submit"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-accent px-5 text-sm font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <Search className="size-4" aria-hidden="true" />
                Search
              </button>
            </div>
          </div>
        </form>

        <dl className="mt-10 grid max-w-2xl grid-cols-3 gap-6 text-primary-foreground">
          {[
            { label: 'Active listings', value: '12,400+' },
            { label: 'Verified brokers', value: '850+' },
            { label: 'Commission to brokers', value: '90%' },
          ].map((stat) => (
            <div key={stat.label}>
              <dt className="text-xs text-primary-foreground/70 sm:text-sm">{stat.label}</dt>
              <dd className="mt-1 text-2xl font-semibold sm:text-3xl">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
