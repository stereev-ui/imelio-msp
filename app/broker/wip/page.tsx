import type { Metadata } from 'next'
import { PageHeader } from '@/components/broker/page-header'
import { WipCalendar } from '@/components/broker/wip-calendar'
import { WipTaskList } from '@/components/broker/wip-task-list'
import { AddMilestoneDialog } from '@/components/broker/add-milestone-dialog'
import { DealTimelines } from '@/components/broker/deal-timelines'

export const metadata: Metadata = { title: 'WIP Diary & Milestones' }

export default function BrokerWipPage() {
  return (
    <>
      <PageHeader
        eyebrow="Work in progress"
        title="WIP Diary & Milestones"
        description="Suspensive conditions, due diligence periods, bond approvals, deposits and transfer dates for every live deal."
        actions={<AddMilestoneDialog />}
      />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <WipCalendar className="xl:col-span-2 xl:self-start" />
        <WipTaskList className="xl:col-span-3" />
      </div>
      <DealTimelines />
    </>
  )
}
