'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  CalendarClock,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Building2,
  Users,
  X,
} from 'lucide-react'
import { ImelioLogo } from '@/components/imelio-logo'
import { broker } from '@/lib/broker-data'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/broker', label: 'Overview / Pipeline', icon: LayoutDashboard },
  { href: '/broker/listings', label: 'My Listings', icon: Building2 },
  { href: '/broker/crm', label: 'CRM & Contacts', icon: Users },
  { href: '/broker/wip', label: 'WIP Diary & Milestones', icon: CalendarClock },
  { href: '/broker/documents', label: 'Document Generator', icon: FileText },
]

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <ul className="flex flex-col gap-1">
      {navItems.map((item) => {
        const active = item.href === '/broker' ? pathname === '/broker' : pathname.startsWith(item.href)
        const Icon = item.icon
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-accent text-accent-foreground shadow-sm'
                  : 'text-primary-foreground/75 hover:bg-primary-foreground/10 hover:text-primary-foreground',
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              {item.label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

function BrokerCard() {
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-primary-foreground/5 p-3 ring-1 ring-primary-foreground/10">
      <div className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
          {broker.initials}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-primary-foreground">{broker.name}</p>
          <p className="truncate text-xs text-primary-foreground/60">{broker.ffc}</p>
        </div>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="rounded bg-accent/20 px-1.5 py-0.5 font-semibold text-accent">90/10 Split</span>
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-primary-foreground/70 transition-colors hover:text-primary-foreground"
        >
          <LogOut className="size-3.5" aria-hidden="true" />
          Sign out
        </Link>
      </div>
    </div>
  )
}

export function BrokerSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col gap-6 bg-primary px-4 py-5 lg:flex">
        <Link href="/" aria-label="Imelio home" className="px-2">
          <ImelioLogo inverted />
        </Link>
        <p className="px-3 text-xs font-semibold uppercase tracking-wider text-primary-foreground/50">
          Commercial Broker
        </p>
        <nav aria-label="Broker dashboard" className="-mt-3 flex-1">
          <NavList />
        </nav>
        <BrokerCard />
      </aside>

      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-primary-foreground/10 bg-primary px-4 lg:hidden">
        <Link href="/" aria-label="Imelio home">
          <ImelioLogo inverted />
        </Link>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="broker-mobile-nav"
          className="inline-flex size-10 items-center justify-center rounded-md text-primary-foreground hover:bg-primary-foreground/10"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
        </button>
      </div>

      {open && (
        <div id="broker-mobile-nav" className="fixed inset-x-0 top-14 bottom-0 z-40 flex flex-col gap-4 overflow-y-auto bg-primary p-4 lg:hidden">
          <nav aria-label="Broker dashboard mobile">
            <NavList onNavigate={() => setOpen(false)} />
          </nav>
          <BrokerCard />
        </div>
      )}
    </>
  )
}
