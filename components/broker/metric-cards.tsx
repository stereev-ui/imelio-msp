import { Building2, Handshake, Wallet } from 'lucide-react'
import { formatZar } from '@/lib/properties'
import {
  BROKER_SPLIT,
  brokerCommission,
  brokerListings,
  deals,
  formatZarCompact,
} from '@/lib/broker-data'

export function MetricCards() {
  const activeListings = brokerListings.filter((l) => l.status === 'Active' || l.status === 'Under Offer')
  const underOffer = brokerListings.filter((l) => l.status === 'Under Offer').length
  const pending = deals.filter((d) => ['Offer to Purchase', 'Suspensive Conditions', 'Transfer'].includes(d.stage))
  const pendingValue = pending.reduce((sum, d) => sum + d.value, 0)
  const registered = deals.filter((d) => d.stage === 'Registered')
  const earned = registered.reduce((sum, d) => sum + brokerCommission(d), 0)
  const projected = pending.reduce((sum, d) => sum + brokerCommission(d), 0)

  const metrics = [
    {
      label: 'Active Listings',
      value: activeListings.length.toString(),
      detail: `${underOffer} under offer`,
      icon: Building2,
    },
    {
      label: 'Pending Deals',
      value: pending.length.toString(),
      detail: `${formatZarCompact(pendingValue)} in pipeline`,
      icon: Handshake,
    },
    {
      label: 'Commission Earned',
      value: formatZar(earned),
      detail: `+ ${formatZarCompact(projected)} projected · ${BROKER_SPLIT * 100}% your share`,
      icon: Wallet,
      highlight: true,
    },
  ]

  return (
    <section aria-label="Key metrics" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {metrics.map((metric) => {
        const Icon = metric.icon
        return (
          <article
            key={metric.label}
            className={
              metric.highlight
                ? 'flex flex-col gap-4 rounded-2xl bg-primary p-5 text-primary-foreground shadow-sm sm:col-span-2 xl:col-span-1'
                : 'flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm'
            }
          >
            <div className="flex items-center justify-between">
              <h2 className={metric.highlight ? 'text-sm font-medium text-primary-foreground/75' : 'text-sm font-medium text-muted-foreground'}>
                {metric.label}
              </h2>
              <span
                className={
                  metric.highlight
                    ? 'flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground'
                    : 'flex size-9 items-center justify-center rounded-lg bg-secondary text-primary'
                }
              >
                <Icon className="size-4" aria-hidden="true" />
              </span>
            </div>
            <div>
              <p className={metric.highlight ? 'text-3xl font-semibold tracking-tight' : 'text-3xl font-semibold tracking-tight text-primary'}>
                {metric.value}
              </p>
              <p className={metric.highlight ? 'mt-1 text-sm text-accent' : 'mt-1 text-sm text-muted-foreground'}>
                {metric.detail}
              </p>
            </div>
          </article>
        )
      })}
    </section>
  )
}
