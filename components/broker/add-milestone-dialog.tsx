'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useWip } from '@/components/broker/wip-provider'
import { deals, milestoneTypeMeta, type MilestoneType } from '@/lib/broker-data'

const selectClass =
  'h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50'

export function AddMilestoneDialog() {
  const { addMilestone, selectedDate } = useWip()
  const [open, setOpen] = useState(false)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const title = String(data.get('title') ?? '').trim()
    const dueDate = String(data.get('dueDate') ?? '')
    if (!title || !dueDate) return
    addMilestone({
      title,
      dueDate,
      dealId: String(data.get('dealId')),
      type: String(data.get('type')) as MilestoneType,
      notes: String(data.get('notes') ?? '').trim() || undefined,
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-accent px-3.5 text-sm font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
        <Plus className="size-4" aria-hidden="true" />
        Add milestone
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-primary">New WIP milestone</DialogTitle>
          <DialogDescription>Track a suspensive condition, deposit or transfer deadline.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="milestone-title">Milestone</Label>
            <Input id="milestone-title" name="title" required maxLength={120} placeholder="e.g. Bond approval deadline" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="milestone-deal">Deal</Label>
            <select id="milestone-deal" name="dealId" className={selectClass} defaultValue={deals[0].id}>
              {deals
                .filter((d) => d.stage !== 'Registered')
                .map((deal) => (
                  <option key={deal.id} value={deal.id}>
                    {deal.id} · {deal.propertyTitle}
                  </option>
                ))}
            </select>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="milestone-type">Type</Label>
              <select id="milestone-type" name="type" className={selectClass} defaultValue="due-diligence">
                {(Object.keys(milestoneTypeMeta) as MilestoneType[]).map((type) => (
                  <option key={type} value={type}>
                    {milestoneTypeMeta[type].label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="milestone-date">Due date</Label>
              <Input id="milestone-date" name="dueDate" type="date" required defaultValue={selectedDate} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="milestone-notes">Notes (optional)</Label>
            <Input id="milestone-notes" name="notes" maxLength={200} />
          </div>
          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Save milestone
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
