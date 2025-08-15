import { BadgeCheck, Bell, Scale, Zap } from "lucide-react"

export default function WhyUs() {
  const items = [
    {
      icon: BadgeCheck,
      title: "Competitive rates",
      desc: "Access partner lenders offering fair, flexible rates tailored to your shopping needs. Review terms before you apply.",
    },
    {
      icon: Scale,
      title: "No hidden fees",
      desc: "Transparent pricing from application to repayment. See exact costs and schedules up front inside your dashboard.",
    },
    {
      icon: Zap,
      title: "Instant wallet credit",
      desc: "Once approved, funds reflect in your KredMart wallet so you can check out immediately for eligible items.",
    },
    {
      icon: Bell,
      title: "Real‑time notifications",
      desc: "Stay informed with status updates, reminders, and repayments. Manage everything from your phone.",
    },
  ]

  return (
    <section className="bg-background">
      <div className="container mx-auto px-4 py-10 md:py-14">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto inline-flex items-center rounded-full bg-fuchsia-600/10 px-3 py-1 text-[10px] font-semibold tracking-wide text-fuchsia-700 md:text-xs">
            LOANS & WALLET
          </div>
          <h2 className="mt-3 text-xl font-semibold tracking-tight md:text-3xl">
            A better way to finance your shopping
          </h2>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">
            KredMart connects you to premium lenders and credits your wallet on approval, so you can buy now and repay
            with confidence.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:gap-6">
          {items.map((it) => (
            <div
              key={it.title}
              className="group rounded-xl border bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-sm md:p-5"
            >
              <div className="flex items-start gap-3 md:gap-4">
                <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-fuchsia-600/15 text-fuchsia-700 ring-1 ring-fuchsia-700/10 transition-colors group-hover:bg-fuchsia-600/20">
                  <it.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold tracking-tight md:text-base">{it.title}</div>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground md:text-sm">{it.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
