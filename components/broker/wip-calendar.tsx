'use client'

import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useWip } from '@/components/broker/wip-provider'
import { milestoneTypeMeta, parseIsoDate, toIsoDate, type MilestoneType } from '@/lib/broker-data'
import { cn } from '@/lib/utils'

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function WipCalendar({ className }: { className?: string }) {
  const { milestones, selectedDate, setSelectedDate } = useWip()
  const [cursor, setCursor] = useState(() => {
    const d = parseIsoDate(selectedDate)
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })
  const todayIso = toIsoDate(new Date())

  const byDate = useMemo(() => {
    const map = new Map<string, { types: MilestoneType[]; open: number; overdue: boolean }>()
    for (const m of milestones) {
      const entry = map.get(m.dueDate) ?? { types: [], open: 0, overdue: false }
      if (!entry.types.includes(m.type)) entry.types.push(m.type)
      if (!m.done) {
        entry.open += 1
        if (m.dueDate < todayIso) entry.overdue = true
      }
      map.set(m.dueDate, entry)
    }
    return map
  }, [milestones, todayIso])

  const days = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1)
    const leading = (first.getDay() + 6) % 7
    const start = new Date(first.getFullYear(), first.getMonth(), 1 - leading)
    return Array.from({ length: 42 }, (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i))
  }, [cursor])

  const monthLabel = cursor.toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' })

  const shiftMonth = (delta: number) => setCursor((c) => new Date(c.getFullYear(), c.getMonth() + delta, 1))

  const goToday = () => {
    const now = new Date()
    setCursor(new Date(now.getFullYear(), now.getMonth(), 1))
    setSelectedDate(toIsoDate(now))
  }

  return (
    <section
      aria-labelledby="wip-calendar-heading"
      className={cn('flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm', className)}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 id="wip-calendar-heading" className="text-base font-semibold text-primary">
            WIP Calendar
          </h2>
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {monthLabel}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={goToday}
            className="h-8 rounded-lg border border-border px-2.5 text-xs font-semibold text-primary transition-colors hover:bg-secondary"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            className="inline-flex size-8 items-center justify-center rounded-lg text-primary transition-colors hover:bg-secondary"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
            <span className="sr-only">Previous month</span>
          </button>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            className="inline-flex size-8 items-center justify-center rounded-lg text-primary transition-colors hover:bg-secondary"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
            <span className="sr-only">Next month</span>
          </button>
        </div>
      </div>

      <div role="grid" aria-label={monthLabel} className="grid grid-cols-7 gap-1">
        {weekdays.map((day) => (
          <div key={day} role="columnheader" className="pb-1 text-center text-xs font-medium text-muted-foreground">
            {day}
          </div>
        ))}
        {days.map((day) => {
          const iso = toIsoDate(day)
          const info = byDate.get(iso)
          const inMonth = day.getMonth() === cursor.getMonth()
          const isToday = iso === todayIso
          const isSelected = iso === selectedDate
          const label = day.toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long' })
          return (
            <button
              key={iso}
              type="button"
              role="gridcell"
              aria-selected={isSelected}
              aria-label={info ? `${label}, ${info.open} open milestone${info.open === 1 ? '' : 's'}` : label}
              onClick={() => setSelectedDate(iso)}
              className={cn(
                'relative flex aspect-square flex-col items-center justify-center gap-1 rounded-lg text-sm transition-colors',
                inMonth ? 'text-foreground' : 'text-muted-foreground/50',
                isSelected
                  ? 'bg-primary font-semibold text-primary-foreground'
                  : isToday
                    ? 'bg-accent/15 font-semibold text-primary ring-1 ring-accent'
                    : 'hover:bg-secondary',
              )}
            >
              <span>{day.getDate()}</span>
              {info && (
                <span className="flex h-1.5 items-center gap-0.5" aria-hidden="true">
                  {info.types.slice(0, 3).map((type) => (
                    <span
                      key={type}
                      className={cn(
                        'size-1.5 rounded-full',
                        isSelected && type === 'deposit' ? 'bg-primary-foreground' : milestoneTypeMeta[type].dot,
                      )}
                    />
                  ))}
                </span>
              )}
              {info?.overdue && (
                <span className="absolute right-1 top-1 size-1.5 rounded-full bg-destructive" aria-hidden="true" />
              )}
            </button>
          )
        })}
      </div>

      <ul className="flex flex-wrap gap-x-4 gap-y-1.5 border-t border-border pt-3 text-xs text-muted-foreground">
        {(Object.keys(milestoneTypeMeta) as MilestoneType[]).map((type) => (
          <li key={type} className="flex items-center gap-1.5">
            <span className={cn('size-2 rounded-full', milestoneTypeMeta[type].dot)} aria-hidden="true" />
            {milestoneTypeMeta[type].label}
          </li>
        ))}
        <li className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-destructive" aria-hidden="true" />
          Overdue
        </li>
      </ul>
    </section>
  )
}
