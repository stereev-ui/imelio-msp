export type PropertyType = 'commercial' | 'residential'
export type ListingType = 'sale' | 'lease'

export type Property = {
  id: string
  title: string
  propertyType: PropertyType
  listingType: ListingType
  category: string
  price: number
  gla: number
  address: string
  suburb: string
  city: string
  province: string
  image: string
  bedrooms?: number
  bathrooms?: number
  parking?: number
  isNew?: boolean
}

export const properties: Property[] = [
  {
    id: 'IM-10482',
    title: 'Contemporary Family Residence',
    propertyType: 'residential',
    listingType: 'sale',
    category: 'House',
    price: 14_950_000,
    gla: 520,
    address: '18 Klaassens Road',
    suburb: 'Constantia',
    city: 'Cape Town',
    province: 'Western Cape',
    image: '/images/property-1.png',
    bedrooms: 5,
    bathrooms: 4,
    parking: 3,
    isNew: true,
  },
  {
    id: 'IM-20317',
    title: 'A-Grade Office Building',
    propertyType: 'commercial',
    listingType: 'lease',
    category: 'Office',
    price: 285_000,
    gla: 1_850,
    address: '144 Katherine Street',
    suburb: 'Sandton',
    city: 'Johannesburg',
    province: 'Gauteng',
    image: '/images/property-2.png',
    parking: 60,
  },
  {
    id: 'IM-10566',
    title: 'Ocean-View Penthouse Apartment',
    propertyType: 'residential',
    listingType: 'sale',
    category: 'Apartment',
    price: 8_750_000,
    gla: 245,
    address: '7 Lighthouse Road',
    suburb: 'Umhlanga Rocks',
    city: 'Durban',
    province: 'KwaZulu-Natal',
    image: '/images/property-3.png',
    bedrooms: 3,
    bathrooms: 3,
    parking: 2,
    isNew: true,
  },
  {
    id: 'IM-30209',
    title: 'Logistics Warehouse with Yard',
    propertyType: 'commercial',
    listingType: 'sale',
    category: 'Industrial',
    price: 42_500_000,
    gla: 6_400,
    address: '21 Old Pretoria Main Road',
    suburb: 'Midrand',
    city: 'Johannesburg',
    province: 'Gauteng',
    image: '/images/property-4.png',
    parking: 24,
  },
  {
    id: 'IM-10731',
    title: 'Secure Estate Townhouse',
    propertyType: 'residential',
    listingType: 'lease',
    category: 'Townhouse',
    price: 28_500,
    gla: 210,
    address: '42 Garsfontein Road',
    suburb: 'Faerie Glen',
    city: 'Pretoria',
    province: 'Gauteng',
    image: '/images/property-5.png',
    bedrooms: 3,
    bathrooms: 2,
    parking: 2,
  },
  {
    id: 'IM-40118',
    title: 'High-Street Retail Unit',
    propertyType: 'commercial',
    listingType: 'lease',
    category: 'Retail',
    price: 64_000,
    gla: 320,
    address: '98 Bree Street',
    suburb: 'Cape Town CBD',
    city: 'Cape Town',
    province: 'Western Cape',
    image: '/images/property-6.png',
    isNew: true,
  },
]

export type PropertyFilters = {
  type?: string
  listing?: string
  location?: string
  min?: string
  max?: string
}

export function filterProperties(filters: PropertyFilters): Property[] {
  const location = filters.location?.trim().toLowerCase()
  const min = Number(filters.min) || 0
  const max = Number(filters.max) || Number.POSITIVE_INFINITY

  return properties.filter((property) => {
    if (filters.type && property.propertyType !== filters.type) return false
    if (filters.listing && property.listingType !== filters.listing) return false
    if (property.price < min || property.price > max) return false
    if (location) {
      const haystack =
        `${property.address} ${property.suburb} ${property.city} ${property.province}`.toLowerCase()
      if (!haystack.includes(location)) return false
    }
    return true
  })
}

const zarFormatter = new Intl.NumberFormat('en-ZA', {
  style: 'currency',
  currency: 'ZAR',
  maximumFractionDigits: 0,
})

export function formatZar(value: number) {
  return zarFormatter.format(value)
}

export const priceOptions = [
  10_000, 25_000, 50_000, 100_000, 250_000, 500_000, 1_000_000, 2_500_000,
  5_000_000, 10_000_000, 25_000_000, 50_000_000,
]
