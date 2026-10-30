import { Check } from 'lucide-react'

const benefits = [
  'Keep 90% of every commission you earn',
  'List commercial and residential stock in one place',
  'Lead routing straight to your inbox and WhatsApp',
  'PPRA-compliant onboarding and FFC support',
]

export function JoinSection() {
  return (
    <section id="join" aria-labelledby="join-heading" className="scroll-mt-16 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 items-center gap-10 overflow-hidden rounded-3xl bg-primary p-8 sm:p-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">For brokers & agents</p>
            <h2
              id="join-heading"
              className="mt-3 text-balance text-3xl font-semibold tracking-tight text-primary-foreground sm:text-4xl"
            >
              Join Imelio on a 90/10 commission split.
            </h2>
            <p className="mt-4 max-w-lg text-pretty leading-relaxed text-primary-foreground/80">
              Build your own brand with the tools, listings exposure and compliance backing of a national platform —
              without giving away half your earnings.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="mailto:brokers@imelio.co.za?subject=Join%20Imelio%20(90%2F10%20Split)"
                className="inline-flex h-11 items-center justify-center rounded-lg bg-accent px-6 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
              >
                Apply to join
              </a>
              <a
                href="/broker/login"
                className="inline-flex h-11 items-center justify-center rounded-lg border border-primary-foreground/25 px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
              >
                Broker Login
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-end gap-4">
              <div className="flex-[9] rounded-2xl bg-accent p-5 text-accent-foreground">
                <p className="text-4xl font-semibold">90%</p>
                <p className="text-sm font-medium opacity-80">To you</p>
              </div>
              <div className="flex-[2] rounded-2xl bg-primary-foreground/10 p-5 text-primary-foreground">
                <p className="text-2xl font-semibold">10%</p>
                <p className="text-xs opacity-70">Imelio</p>
              </div>
            </div>
            <ul className="flex flex-col gap-3">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3 text-sm text-primary-foreground/90">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent">
                    <Check className="size-3.5" aria-hidden="true" />
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
