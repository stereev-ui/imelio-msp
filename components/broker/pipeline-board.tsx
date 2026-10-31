import { brokerCommission, dealStages, deals, formatZarCompact } from '@/lib/broker-data'
import { cn } from '@/lib/utils'

export function PipelineBoard() {
  const maxCount = Math.max(...dealStages.map((stage) => deals.filter((d) => d.stage === stage).length), 1)

  return (
    <section aria-labelledby="pipeline-heading" className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 id="pipeline-heading" className="text-base font-semibold text-primary">
            Deal Pipeline
          </h2>
          <p className="text-sm text-muted-foreground">{deals.length} deals across all stages</p>
        </div>
      </div>

      <ol className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {dealStages.map((stage, index) => {
          const stageDeals = deals.filter((d) => d.stage === stage)
          const commission = stageDeals.reduce((sum, d) => sum + brokerCommission(d), 0)
          const isFinal = stage === 'Registered'
          return (
            <li key={stage} className="flex flex-col gap-2 rounded-xl bg-secondary p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-muted-foreground">0{index + 1}</span>
                <span
                  className={cn(
                    'rounded-md px-1.5 py-0.5 text-xs font-semibold',
                    isFinal ? 'bg-accent text-accent-foreground' : 'bg-primary text-primary-foreground',
                  )}
                >
                  {stageDeals.length}
                </span>
              </div>
              <p className="text-sm font-semibold leading-tight text-foreground">{stage}</p>
              <div className="h-1.5 overflow-hidden rounded-full bg-border" aria-hidden="true">
                <div
                  className={cn('h-full rounded-full', isFinal ? 'bg-accent' : 'bg-primary')}
                  style={{ width: `${(stageDeals.length / maxCount) * 100}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{formatZarCompact(commission)} comm.</p>
            </li>
          )
        })}
      </ol>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <caption className="sr-only">Active deals</caption>
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <th scope="col" className="py-2 pr-3 font-medium">Deal</th>
              <th scope="col" className="py-2 pr-3 font-medium">Counterparty</th>
              <th scope="col" className="py-2 pr-3 font-medium">Stage</th>
              <th scope="col" className="py-2 text-right font-medium">Your commission</th>
            </tr>
          </thead>
          <tbody>
            {deals
              .filter((d) => d.stage !== 'Registered')
              .map((deal) => (
                <tr key={deal.id} className="border-b border-border last:border-0">
                  <td className="py-3 pr-3">
                    <p className="font-medium text-foreground">{deal.propertyTitle}</p>
                    <p className="text-xs text-muted-foreground">
                      {deal.id} · {deal.suburb} · {deal.dealType === 'lease' ? 'Lease' : 'Sale'}
                    </p>
                  </td>
                  <td className="py-3 pr-3 text-foreground/80">{deal.counterparty}</td>
                  <td className="py-3 pr-3">
                    <span className="whitespace-nowrap rounded-md bg-secondary px-2 py-1 text-xs font-medium text-primary">
                      {deal.stage}
                    </span>
                  </td>
                  <td className="py-3 text-right font-semibold text-primary">{formatZarCompact(brokerCommission(deal))}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
