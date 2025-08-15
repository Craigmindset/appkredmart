"use client"

export function StepProgress({ current, total = 3 }: { current: number; total?: number }) {
  const clamped = Math.max(1, Math.min(current, total))
  return (
    <div className="mb-4">
      <div className="mb-2 text-[11px] font-medium text-muted-foreground">
        {"Step "}
        {clamped}
        {" of "}
        {total}
      </div>
      <div className="flex gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full ${i < clamped ? "bg-foreground" : "bg-muted"}`}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  )
}
