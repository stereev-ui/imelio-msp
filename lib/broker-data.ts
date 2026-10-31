import { properties, type Property } from '@/lib/properties'

export const BROKER_SPLIT = 0.9

export const broker = {
  name: 'Thandi Mokoena',
  initials: 'TM',
  firm: 'Imelio Commercial',
  ffc: 'FFC 2026-118204',
}

export type DealStage = 'Lead' | 'Viewing' | 'Offer to Purchase' | 'Suspensive Conditions' | 'Transfer' | 'Registered'

export const dealStages: DealStage[] = [
  'Lead',
  'Viewing',
  'Offer to Purchase',
  'Suspensive Conditions',
  'Transfer',
  'Registered',
]

export type Deal = {
  id: string
  propertyId: string
  propertyTitle: string
  suburb: string
  counterparty: string
  stage: DealStage
  value: number
  commissionRate: number
  dealType: 'sale' | 'lease'
}

export const deals: Deal[] = [
  {
    id: 'D-4102',
    propertyId: 'IM-30209',
    propertyTitle: 'Logistics Warehouse with Yard',
    suburb: 'Midrand',
    counterparty: 'Rand Freight Holdings',
    stage: 'Suspensive Conditions',
    value: 38_500_000,
    commissionRate: 0.05,
    dealType: 'sale',
  },
  {
    id: 'D-4097',
    propertyId: 'IM-10482',
    propertyTitle: 'Contemporary Family Residence',
    suburb: 'Constantia',
    counterparty: 'J. & L. van Wyk',
    stage: 'Transfer',
    value: 14_950_000,
    commissionRate: 0.05,
    dealType: 'sale',
  },
  {
    id: 'D-4115',
    propertyId: 'IM-20317',
    propertyTitle: 'A-Grade Office Building',
    suburb: 'Sandton',
    counterparty: 'Kopano Legal Inc.',
    stage: 'Offer to Purchase',
    value: 285_000 * 60,
    commissionRate: 0.04,
    dealType: 'lease',
  },
  {
    id: 'D-4121',
    propertyId: 'IM-10566',
    propertyTitle: 'Ocean-View Penthouse Apartment',
    suburb: 'Umhlanga Rocks',
    counterparty: 'S. Naidoo',
    stage: 'Suspensive Conditions',
    value: 8_750_000,
    commissionRate: 0.05,
    dealType: 'sale',
  },
  {
    id: 'D-4128',
    propertyId: 'IM-30209',
    propertyTitle: 'Retail Unit, Menlyn Corner',
    suburb: 'Menlyn',
    counterparty: 'Bakery Collective (Pty) Ltd',
    stage: 'Viewing',
    value: 62_000 * 36,
    commissionRate: 0.05,
    dealType: 'lease',
  },
  {
    id: 'D-4131',
    propertyId: 'IM-20317',
    propertyTitle: 'Mixed-Use Office Park',
    suburb: 'Century City',
    counterparty: 'Atlantic Asset Partners',
    stage: 'Lead',
    value: 52_000_000,
    commissionRate: 0.04,
    dealType: 'sale',
  },
  {
    id: 'D-4066',
    propertyId: 'IM-10482',
    propertyTitle: 'Industrial Mini-Units x6',
    suburb: 'Montague Gardens',
    counterparty: 'Westcoast Storage Trust',
    stage: 'Registered',
    value: 21_400_000,
    commissionRate: 0.05,
    dealType: 'sale',
  },
  {
    id: 'D-4071',
    propertyId: 'IM-10566',
    propertyTitle: 'Showroom on William Nicol',
    suburb: 'Bryanston',
    counterparty: 'Prestige Motors SA',
    stage: 'Registered',
    value: 118_000 * 60,
    commissionRate: 0.04,
    dealType: 'lease',
  },
]

export const grossCommission = (deal: Deal) => deal.value * deal.commissionRate
export const brokerCommission = (deal: Deal) => grossCommission(deal) * BROKER_SPLIT

export type ListingStatus = 'Active' | 'Under Offer' | 'Draft' | 'Sold'

export type BrokerListing = Property & {
  status: ListingStatus
  views: number
  enquiries: number
  daysOnMarket: number
}

const listingMeta: Record<string, Pick<BrokerListing, 'status' | 'views' | 'enquiries' | 'daysOnMarket'>> = {
  'IM-10482': { status: 'Under Offer', views: 1842, enquiries: 37, daysOnMarket: 41 },
  'IM-20317': { status: 'Active', views: 965, enquiries: 18, daysOnMarket: 23 },
  'IM-10566': { status: 'Under Offer', views: 2310, enquiries: 52, daysOnMarket: 56 },
}

export const brokerListings: BrokerListing[] = properties.map((property, index) => ({
  ...property,
  ...(listingMeta[property.id] ?? {
    status: (['Active', 'Active', 'Draft', 'Active', 'Sold', 'Active'] as const)[index % 6],
    views: 420 + index * 137,
    enquiries: 6 + index * 3,
    daysOnMarket: 9 + index * 7,
  }),
}))

export type ContactRole = 'Buyer' | 'Seller' | 'Tenant' | 'Landlord' | 'Attorney' | 'Bond Originator'

export type Contact = {
  id: string
  name: string
  company?: string
  role: ContactRole
  email: string
  phone: string
  city: string
  lastContact: string
  linkedDeal?: string
  notes: string
  hot?: boolean
}

export const contacts: Contact[] = [
  {
    id: 'C-101',
    name: 'Pieter Botha',
    company: 'Rand Freight Holdings',
    role: 'Buyer',
    email: 'pieter@randfreight.co.za',
    phone: '+27 82 555 0141',
    city: 'Johannesburg',
    lastContact: '2026-10-29',
    linkedDeal: 'D-4102',
    notes: 'Awaiting structural engineer report before lifting due diligence condition.',
    hot: true,
  },
  {
    id: 'C-102',
    name: 'Lerato van Wyk',
    role: 'Buyer',
    email: 'lerato.vw@gmail.com',
    phone: '+27 83 555 0198',
    city: 'Cape Town',
    lastContact: '2026-10-27',
    linkedDeal: 'D-4097',
    notes: 'Bond granted by Standard Bank. Transfer lodged with Deeds Office.',
  },
  {
    id: 'C-103',
    name: 'Adv. Naledi Kopano',
    company: 'Kopano Legal Inc.',
    role: 'Tenant',
    email: 'naledi@kopanolegal.co.za',
    phone: '+27 11 555 0122',
    city: 'Sandton',
    lastContact: '2026-10-30',
    linkedDeal: 'D-4115',
    notes: 'Requires 3 months beneficial occupation for fit-out. Negotiating escalation at 7%.',
    hot: true,
  },
  {
    id: 'C-104',
    name: 'Sanjay Naidoo',
    role: 'Buyer',
    email: 'sanjay.naidoo@outlook.com',
    phone: '+27 84 555 0177',
    city: 'Durban',
    lastContact: '2026-10-24',
    linkedDeal: 'D-4121',
    notes: 'Bond application submitted via BetterBond to 4 banks.',
  },
  {
    id: 'C-105',
    name: 'Michelle Dlamini',
    company: 'BetterBond',
    role: 'Bond Originator',
    email: 'm.dlamini@betterbond.co.za',
    phone: '+27 31 555 0150',
    city: 'Durban',
    lastContact: '2026-10-28',
    notes: 'Primary originator for KZN deals. Turnaround ~10 working days.',
  },
  {
    id: 'C-106',
    name: 'Johan Steyn',
    company: 'Steyn & Partners Conveyancers',
    role: 'Attorney',
    email: 'johan@steynpartners.co.za',
    phone: '+27 21 555 0109',
    city: 'Cape Town',
    lastContact: '2026-10-26',
    linkedDeal: 'D-4097',
    notes: 'Transferring attorney on Constantia residence.',
  },
  {
    id: 'C-107',
    name: 'Grant Mitchell',
    company: 'Atlantic Asset Partners',
    role: 'Seller',
    email: 'grant@atlanticap.co.za',
    phone: '+27 72 555 0133',
    city: 'Cape Town',
    lastContact: '2026-10-21',
    linkedDeal: 'D-4131',
    notes: 'Considering sole mandate for 90 days. Send comparable sales pack.',
    hot: true,
  },
  {
    id: 'C-108',
    name: 'Zanele Khumalo',
    company: 'Bakery Collective (Pty) Ltd',
    role: 'Tenant',
    email: 'zanele@bakerycollective.co.za',
    phone: '+27 79 555 0164',
    city: 'Pretoria',
    lastContact: '2026-10-19',
    linkedDeal: 'D-4128',
    notes: 'Second viewing scheduled. Needs 3-phase power and extraction.',
  },
  {
    id: 'C-109',
    name: 'Ravi Pillay',
    company: 'Pillay Property Fund',
    role: 'Landlord',
    email: 'ravi@pillayfund.co.za',
    phone: '+27 82 555 0187',
    city: 'Johannesburg',
    lastContact: '2026-10-12',
    notes: 'Owns 4 industrial assets in Midrand. Open to new leasing mandates in 2027.',
  },
]

export type MilestoneType = 'due-diligence' | 'bond-approval' | 'deposit' | 'transfer'

export const milestoneTypeMeta: Record<
  MilestoneType,
  { label: string; short: string; dot: string; badge: string }
> = {
  'due-diligence': {
    label: 'Due Diligence',
    short: 'DD',
    dot: 'bg-accent',
    badge: 'bg-accent/15 text-accent-foreground ring-accent/30',
  },
  'bond-approval': {
    label: 'Bond Approval',
    short: 'Bond',
    dot: 'bg-chart-3',
    badge: 'bg-chart-3/10 text-chart-3 ring-chart-3/25',
  },
  deposit: {
    label: 'Deposit Due',
    short: 'Deposit',
    dot: 'bg-primary',
    badge: 'bg-primary/10 text-primary ring-primary/20',
  },
  transfer: {
    label: 'Transfer / Lodgement',
    short: 'Transfer',
    dot: 'bg-chart-5',
    badge: 'bg-chart-5/15 text-foreground ring-chart-5/30',
  },
}

export type Milestone = {
  id: string
  dealId: string
  title: string
  type: MilestoneType
  dueDate: string
  done: boolean
  notes?: string
}

export function toIsoDate(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function parseIsoDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function daysUntil(iso: string, from = new Date()) {
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate())
  return Math.round((parseIsoDate(iso).getTime() - start.getTime()) / 86_400_000)
}

function offset(days: number) {
  const now = new Date()
  return toIsoDate(new Date(now.getFullYear(), now.getMonth(), now.getDate() + days))
}

export function createSeedMilestones(): Milestone[] {
  return [
    { id: 'M-1', dealId: 'D-4102', title: 'Structural & environmental due diligence ends', type: 'due-diligence', dueDate: offset(3), done: false, notes: 'Engineer report outstanding.' },
    { id: 'M-2', dealId: 'D-4102', title: '10% deposit into attorney trust account', type: 'deposit', dueDate: offset(-2), done: true },
    { id: 'M-3', dealId: 'D-4102', title: 'Finance approval (R30.8m facility)', type: 'bond-approval', dueDate: offset(14), done: false },
    { id: 'M-4', dealId: 'D-4121', title: 'Bond approval deadline – BetterBond', type: 'bond-approval', dueDate: offset(1), done: false, notes: 'Absa & Nedbank still outstanding.' },
    { id: 'M-5', dealId: 'D-4121', title: 'Deposit of R875,000 due', type: 'deposit', dueDate: offset(-1), done: false },
    { id: 'M-6', dealId: 'D-4097', title: 'Lodgement at Cape Town Deeds Office', type: 'transfer', dueDate: offset(6), done: false },
    { id: 'M-7', dealId: 'D-4097', title: 'Rates clearance certificate', type: 'due-diligence', dueDate: offset(0), done: false },
    { id: 'M-8', dealId: 'D-4115', title: 'Lease deposit (3 months rental)', type: 'deposit', dueDate: offset(9), done: false },
    { id: 'M-9', dealId: 'D-4115', title: 'Tenant financial vetting period ends', type: 'due-diligence', dueDate: offset(5), done: false },
    { id: 'M-10', dealId: 'D-4121', title: 'Electrical & beetle compliance certs', type: 'due-diligence', dueDate: offset(11), done: false },
    { id: 'M-11', dealId: 'D-4102', title: 'Transfer duty receipt from SARS', type: 'transfer', dueDate: offset(21), done: false },
    { id: 'M-12', dealId: 'D-4097', title: 'Guarantees issued by Standard Bank', type: 'bond-approval', dueDate: offset(-5), done: true },
  ]
}

export function dealById(id: string) {
  return deals.find((deal) => deal.id === id)
}

export const formatZarCompact = (value: number) =>
  new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
