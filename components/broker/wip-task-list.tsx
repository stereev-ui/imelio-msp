'use client'

import { useMemo, useState } from 'react'
import { Check, Trash2 } from 'lucide-react'
import { useWip } from '@/components/broker/wip-provider'
import {
  daysUntil,
  dealById,
  milestoneTypeMeta,
  parseIsoDate,
  type Milestone,
  type MilestoneType,
} from '@/lib/broker-data'
import { cn } from '@/lib/utils'

type View = 'upcoming' | 'day' | 'completed'

function DueBadge({ milestone }: { milestone: Milestone }) {
  if (milestone.done) {
    return <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">Done</span>
  }
  const days = daysUntil(milestone.dueDate)
  if (days < 0) {
    return (
      <span className="rounded-md bg-destructive/10 px-2 py-0.5 text-xs font-semibold text-destructive">
        {Math.abs(days)}d overdue
      </span>
    )
  }
  if (days === 0) {
    return <span className="rounded-md bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">Due today</span>
  }
  return (
    <span
      className={cn(
        'rounded-md px-2 py-0.5 text-xs font-semibold',
        days <= 3 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-primary',
      )}
    >
      in {days}d
    </span>
  )
}

export function WipTaskList({ className, limit }: { className?: string; limit?: number }) {
  const { milestones, selectedDate, toggleMilestone, removeMilestone } = useWip()
  const [view, setView] = useState<View>('upcoming')
  const [typeFilter, setTypeFilter] = useState<MilestoneType | 'all'>('all')
  const [trackedDate, setTrackedDate] = useState(selectedDate)
  if (trackedDate !== selectedDate) {
    setTrackedDate(selectedDate)
    setView('day')
  }

  const items = useMemo(() => {
    let list = milestones.filter((m) => typeFilter === 'all' || m.type === typeFilter)
    if (view === 'upcoming') list = list.filter((m) => !m.done)
    if (view === 'completed') list = list.filter((m) => m.done)
    if (view === 'day') list = list.filter((m) => m.dueDate === selectedDate)
    return list.sort((a, b) => a.dueDate.localeCompare(b.dueDate))
  }, [milestones, view, typeFilter, selectedDate])

  const visible = limit ? items.slice(0, limit) : items
  const overdueCount = milestones.filter((m) => !m.done && daysUntil(m.dueDate) < 0).length
  const selectedLabel = parseIsoDate(selectedDate).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })

  const tabs: { id: View; label: string }[] = [
    { id: 'upcoming', label: 'Open' },
    { id: 'day', label: selectedLabel },
    { id: 'completed', label: 'Completed' },
  ]

  return (
    <section
      aria-labelledby="wip-tasks-heading"
      className={cn('flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm', className)}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="wip-tasks-heading" className="text-base font-semibold text-primary">
            Milestones & Tasks
          </h2>
          <p className="text-sm text-muted-foreground">
            {overdueCount > 0 ? (
              <span className="font-medium text-destructive">{overdueCount} overdue</span>
            ) : (
              'Nothing overdue'
            )}{' '}
            · {milestones.filter((m) => !m.done).length} open
          </p>
        </div>
        <div role="tablist" aria-label="Milestone view" className="flex rounded-lg bg-secondary p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={view === tab.id}
              onClick={() => setView(tab.id)}
              className={cn(
                'rounded-md px-2.5 py-1 text-xs font-semibold transition-colors',
                view === tab.id ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-primary',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5" aria-label="Filter by milestone type">
        {(['all', ...Object.keys(milestoneTypeMeta)] as (MilestoneType | 'all')[]).map((type) => (
          <button
            key={type}
            type="button"
            aria-pressed={typeFilter === type}
            onClick={() => setTypeFilter(type)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
              typeFilter === type
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border text-foreground/80 hover:border-primary/40',
            )}
          >
            {type !== 'all' && <span className={cn('size-1.5 rounded-full', milestoneTypeMeta[type].dot)} aria-hidden="true" />}
            {type === 'all' ? 'All' : milestoneTypeMeta[type].label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="rounded-xl bg-secondary px-4 py-8 text-center text-sm text-muted-foreground">
          No milestones for this view.
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-border">
          {visible.map((m) => {
            const deal = dealById(m.dealId)
            const meta = milestoneTypeMeta[m.type]
            return (
              <li key={m.id} className="group flex items-start gap-3 py-3">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={m.done}
                  aria-label={`Mark "${m.title}" as ${m.done ? 'open' : 'done'}`}
                  onClick={() => toggleMilestone(m.id)}
                  className={cn(
                    'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors',
                    m.done ? 'border-accent bg-accent text-accent-foreground' : 'border-input hover:border-accent',
                  )}
                >
                  {m.done && <Check className="size-3.5" aria-hidden="true" />}
                </button>
                <div className="min-w-0 flex-1">
                  <p className={cn('text-sm font-medium', m.done ? 'text-muted-foreground line-through' : 'text-foreground')}>
                    {m.title}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {deal ? `${deal.id} · ${deal.propertyTitle}` : m.dealId} ·{' '}
                    {parseIsoDate(m.dueDate).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}
                  </p>
                  {m.notes && !m.done && <p className="mt-1 text-xs text-foreground/70">{m.notes}</p>}
                  <span className={cn('mt-1.5 inline-flex rounded-md px-1.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset', meta.badge)}>
                    {meta.label}
                  </span>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <DueBadge milestone={m} />
                  <button
                    type="button"
                    onClick={() => removeMilestone(m.id)}
                    className="rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:text-destructive focus-visible:opacity-100 group-hover:opacity-100"
                  >
                    <Trash2 className="size-3.5" aria-hidden="true" />
                    <span className="sr-only">Delete milestone</span>
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
      {limit && items.length > limit && (
        <p className="text-xs text-muted-foreground">+ {items.length - limit} more in WIP Diary</p>
      )}
    </section>
  )
}
