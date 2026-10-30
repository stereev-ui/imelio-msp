import { cn } from '@/lib/utils'

export function ImelioLogo({
  className,
  inverted = false,
}: {
  className?: string
  inverted?: boolean
}) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <span
        aria-hidden="true"
        className="flex size-8 items-center justify-center rounded-lg bg-accent text-base font-bold text-accent-foreground"
      >
        i
      </span>
      <span
        className={cn(
          'text-xl font-semibold tracking-tight',
          inverted ? 'text-primary-foreground' : 'text-primary',
        )}
      >
        imelio
      </span>
    </span>
  )
}
