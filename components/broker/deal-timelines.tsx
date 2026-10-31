'use client'

import { useWip } from '@/components/broker/wip-provider'
import { daysUntil, deals, milestoneTypeMeta, parseIsoDate } from '@/lib/broker-data'
import { cn } from '@/lib/utils'

export function DealTimelines() {
  const { milestones } = useWip()
  const liveDeals = deals.filter((deal) => milestones.some((m) => m.dealId === deal.id))

  return (
    <section aria-labelledby="timelines-heading" className="flex flex-col gap-4">
      <h2 id="timelines-heading" className="text-base font-semibold text-primary">
        Deal timelines
      </h2>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {liveDeals.map((deal) => {
          const items = milestones.filter((m) => m.dealId === deal.id).sort((a, b) => a.dueDate.localeCompare(b.dueDate))
          const done = items.filter((m) => m.done).length
          const progress = Math.round((done / items.length) * 100)
          return (
            <li key={deal.id} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{deal.propertyTitle}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {deal.id} · {deal.counterparty}
                  </p>
                </div>
                <span className="shrink-0 rounded-md bg-secondary px-2 py-1 text-xs font-medium text-primary">{deal.stage}</span>
              </div>
              <div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {done} of {items.length} milestones
                  </span>
                  <span className="font-semibold text-primary">{progress}%</span>
                </div>
                <div
                  className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary"
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${deal.propertyTitle} milestone progress`}
                >
                  <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${progress}%` }} />
                </div>
              </div>
              <ol className="flex flex-col gap-3 border-l-2 border-border pl-4">
                {items.map((m) => {
                  const overdue = !m.done && daysUntil(m.dueDate) < 0
                  return (
                    <li key={m.id} className="relative">
                      <span
                        aria-hidden="true"
                        className={cn(
                          'absolute -left-[23px] top-1 size-3 rounded-full ring-2 ring-card',
                          m.done ? 'bg-accent' : overdue ? 'bg-destructive' : milestoneTypeMeta[m.type].dot,
                        )}
                      />
                      <p className={cn('text-sm', m.done ? 'text-muted-foreground line-through' : 'font-medium text-foreground')}>
                        {m.title}
                      </p>
                      <p className={cn('text-xs', overdue ? 'font-medium text-destructive' : 'text-muted-foreground')}>
                        {parseIsoDate(m.dueDate).toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short' })}
                        {' · '}
                        {milestoneTypeMeta[m.type].label}
                        {overdue && ' · Overdue'}
                      </p>
                    </li>
                  )
                })}
              </ol>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
