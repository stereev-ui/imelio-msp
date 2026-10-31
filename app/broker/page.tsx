import type { Metadata } from 'next'
import { PageHeader } from '@/components/broker/page-header'
import { MetricCards } from '@/components/broker/metric-cards'
import { PipelineBoard } from '@/components/broker/pipeline-board'
import { WipCalendar } from '@/components/broker/wip-calendar'
import { WipTaskList } from '@/components/broker/wip-task-list'
import { AddMilestoneDialog } from '@/components/broker/add-milestone-dialog'
import { broker } from '@/lib/broker-data'

export const metadata: Metadata = { title: 'Overview & Pipeline' }

export default function BrokerOverviewPage() {
  return (
    <>
      <PageHeader
        eyebrow={broker.firm}
        title={`Welcome back, ${broker.name.split(' ')[0]}`}
        description="Your pipeline, commission and every WIP deadline across live transactions, in one place."
        actions={<AddMilestoneDialog />}
      />
      <MetricCards />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <WipCalendar className="xl:col-span-2" />
        <WipTaskList className="xl:col-span-3" limit={6} />
      </div>
      <PipelineBoard />
    </>
  )
}
