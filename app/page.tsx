import { SiteHeader } from '@/components/site-header'
import { HeroSearch } from '@/components/hero-search'
import { FeaturedProperties } from '@/components/featured-properties'
import { JoinSection } from '@/components/join-section'
import { SiteFooter } from '@/components/site-footer'
import { filterProperties, type PropertyFilters } from '@/lib/properties'

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const pick = (key: string) => {
    const value = params[key]
    return typeof value === 'string' && value !== '' ? value : undefined
  }

  const filters: PropertyFilters = {
    type: pick('type'),
    listing: pick('listing'),
    location: pick('location'),
    min: pick('min'),
    max: pick('max'),
  }
  const isFiltered = Object.values(filters).some(Boolean)

  return (
    <>
      <SiteHeader />
      <main>
        <HeroSearch filters={filters} />
        <FeaturedProperties items={filterProperties(filters)} isFiltered={isFiltered} />
        <JoinSection />
      </main>
      <SiteFooter />
    </>
  )
}
