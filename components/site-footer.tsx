import Link from 'next/link'
import { ImelioLogo } from '@/components/imelio-logo'

const columns = [
  {
    title: 'Search',
    links: [
      { label: 'Properties for Sale', href: '/?listing=sale#listings' },
      { label: 'Properties to Rent', href: '/?listing=lease#listings' },
      { label: 'Commercial', href: '/?type=commercial#listings' },
      { label: 'Residential', href: '/?type=residential#listings' },
    ],
  },
  {
    title: 'Brokers',
    links: [
      { label: 'Broker Login', href: '/broker/login' },
      { label: 'Join Imelio (90/10 Split)', href: '#join' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <ImelioLogo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {"Imelio is South Africa's proptech marketplace connecting buyers, tenants and investors with verified commercial and residential brokers."}
          </p>
        </div>
        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="text-sm font-semibold text-primary">{column.title}</h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-7xl px-4 py-6 text-xs text-muted-foreground sm:px-6 lg:px-8">
          © {new Date().getFullYear()} Imelio (Pty) Ltd. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
