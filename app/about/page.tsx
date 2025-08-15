import LayoutShell from "@/components/layout-shell"

export default function AboutPage() {
  return (
    <LayoutShell>
      <section className="container mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold tracking-tight">About KredMart</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl">
          KredMart is a modern shopping experience offering flexibility with deals and access to loans.
        </p>
      </section>
    </LayoutShell>
  )
}
