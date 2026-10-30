import Image from 'next/image'
import { Bath, BedDouble, Car, MapPin, Ruler } from 'lucide-react'
import { EnquiryDialog } from '@/components/enquiry-dialog'
import { formatZar, type Property } from '@/lib/properties'

export function PropertyCard({ property }: { property: Property }) {
  const fullAddress = `${property.address}, ${property.suburb}, ${property.city}`
  const isLease = property.listingType === 'lease'

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-xl hover:shadow-primary/5">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={property.image}
          alt={`${property.title} in ${property.suburb}`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span className="rounded-md bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
            {isLease ? 'To Lease' : 'For Sale'}
          </span>
          <span className="rounded-md bg-background/90 px-2 py-1 text-xs font-semibold capitalize text-primary backdrop-blur">
            {property.propertyType} · {property.category}
          </span>
        </div>
        {property.isNew && (
          <span className="absolute right-3 top-3 rounded-md bg-accent px-2 py-1 text-xs font-semibold text-accent-foreground">
            New
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <p className="text-2xl font-semibold tracking-tight text-primary">
            {formatZar(property.price)}
            {isLease && <span className="text-sm font-medium text-muted-foreground"> / month</span>}
          </p>
          <h3 className="mt-1 text-base font-semibold text-foreground">{property.title}</h3>
          <p className="mt-1.5 flex items-start gap-1.5 text-sm text-muted-foreground">
            <MapPin className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
            <span>{fullAddress}</span>
          </p>
        </div>

        <ul className="flex flex-wrap gap-x-4 gap-y-2 border-t border-border pt-4 text-sm text-foreground/80">
          <li className="flex items-center gap-1.5">
            <Ruler className="size-4 text-muted-foreground" aria-hidden="true" />
            <span>
              <span className="font-semibold text-foreground">{property.gla.toLocaleString('en-ZA')} m²</span>{' '}
              <abbr title="Gross Lettable Area" className="no-underline">
                GLA
              </abbr>
            </span>
          </li>
          {property.bedrooms !== undefined && (
            <li className="flex items-center gap-1.5">
              <BedDouble className="size-4 text-muted-foreground" aria-hidden="true" />
              {property.bedrooms} <span className="sr-only">bedrooms</span>
            </li>
          )}
          {property.bathrooms !== undefined && (
            <li className="flex items-center gap-1.5">
              <Bath className="size-4 text-muted-foreground" aria-hidden="true" />
              {property.bathrooms} <span className="sr-only">bathrooms</span>
            </li>
          )}
          {property.parking !== undefined && (
            <li className="flex items-center gap-1.5">
              <Car className="size-4 text-muted-foreground" aria-hidden="true" />
              {property.parking} <span className="sr-only">parking bays</span>
            </li>
          )}
        </ul>

        <div className="mt-auto flex items-center justify-between gap-3 pt-1">
          <span className="text-xs text-muted-foreground">Ref {property.id}</span>
          <EnquiryDialog propertyId={property.id} propertyTitle={property.title} address={fullAddress} />
        </div>
      </div>
    </article>
  )
}
