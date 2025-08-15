"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

const slides = [
  {
    id: 1,
    title: "Shop more, stress less",
    desc: "Flexible shopping with KredMart. Deals you’ll love.",
    image: "/placeholder.svg?height=600&width=1400",
  },
  {
    id: 2,
    title: "Access quick loans",
    desc: "Get the flexibility to buy now and pay later.",
    image: "/placeholder.svg?height=600&width=1400",
  },
]

export default function HeroSlider() {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000)
    return () => clearInterval(t)
  }, [])

  const s = slides[index]
  return (
    <section className="relative overflow-hidden">
      <div
        className="h-[420px] md:h-[520px] w-full bg-cover bg-center"
        style={{ backgroundImage: `url('${s.image}')` }}
      >
        <div className="container mx-auto px-4 h-full">
          <div className="grid h-full md:grid-cols-2 items-center">
            <div className="max-w-xl">
              <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">{s.title}</h1>
              <p className="text-muted-foreground mt-3 md:text-lg">{s.desc}</p>
              <div className="mt-6 flex gap-3">
                <Link
                  href="/access-loan"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-foreground px-6 text-sm font-medium text-background"
                >
                  Get Loans
                </Link>
                <Link
                  href="/store"
                  className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-6 text-sm"
                >
                  Visit Store
                </Link>
              </div>
            </div>
            <div className="hidden md:block" />
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            aria-label={"Go to slide " + (i + 1)}
            className={`h-1.5 w-6 rounded-full ${i === index ? "bg-foreground" : "bg-muted"}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </section>
  )
}
