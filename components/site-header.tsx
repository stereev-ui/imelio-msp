'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { ImelioLogo } from '@/components/imelio-logo'

const navLinks = [
  { href: '/?listing=sale#listings', label: 'Properties for Sale' },
  { href: '/?listing=lease#listings', label: 'Properties to Rent' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/75">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="Imelio home" className="shrink-0">
          <ImelioLogo />
        </Link>

        <nav aria-label="Primary" className="hidden flex-1 items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/broker/login"
            className="rounded-md px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-secondary"
          >
            Broker Login
          </Link>
          <Link
            href="#join"
            className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90"
          >
            Join Imelio
            <span className="rounded bg-accent-foreground/15 px-1.5 py-0.5 text-xs font-bold">
              90/10 Split
            </span>
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-md text-primary hover:bg-secondary md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="border-t border-border bg-background px-4 pb-4 pt-2 md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/broker/login"
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2.5 text-sm font-medium text-primary hover:bg-secondary"
              >
                Broker Login
              </Link>
            </li>
            <li className="pt-2">
              <Link
                href="#join"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground"
              >
                Join Imelio (90/10 Split)
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}
