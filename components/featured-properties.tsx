import Link from 'next/link'
import { PropertyCard } from '@/components/property-card'
import type { Property } from '@/lib/properties'

export function FeaturedProperties({
  items,
  isFiltered,
}: {
  items: Property[]
  isFiltered: boolean
}) {
  return (
    <section id="listings" aria-labelledby="listings-heading" className="scroll-mt-16 bg-secondary/60">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">
              {isFiltered ? 'Search results' : 'Featured listings'}
            </p>
            <h2 id="listings-heading" className="mt-2 text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
              {isFiltered ? `${items.length} matching ${items.length === 1 ? 'property' : 'properties'}` : 'Hand-picked properties'}
            </h2>
          </div>
          {isFiltered && (
            <Link href="/#listings" className="text-sm font-semibold text-primary underline-offset-4 hover:underline">
              Clear filters
            </Link>
          )}
        </div>

        {items.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <p className="font-semibold text-foreground">No properties match your search.</p>
            <p className="mt-1 text-sm text-muted-foreground">Try widening your price range or location.</p>
          </div>
        )}
      </div>
    </section>
  )
}
