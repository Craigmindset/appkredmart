"use client"

import { useEffect, useState } from "react"

type Testimonial = { name: string; text: string; avatar: string }

const testimonials: Testimonial[] = [
  {
    name: "Jordan",
    text: "KredMart made my shopping so flexible. Love the deals!",
    avatar: "/placeholder.svg?height=64&width=64",
  },
  {
    name: "Amara",
    text: "Fast checkout and great support. Highly recommend.",
    avatar: "/placeholder.svg?height=64&width=64",
  },
  {
    name: "Luis",
    text: "The loan feature helped me upgrade my workspace.",
    avatar: "/placeholder.svg?height=64&width=64",
  },
  {
    name: "Maya",
    text: "Modern design, smooth experience across devices.",
    avatar: "/placeholder.svg?height=64&width=64",
  },
]

export default function TestimonialsSlider() {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 4000)
    return () => clearInterval(t)
  }, [])

  const visible = 3
  const items = [
    ...testimonials.slice(index, index + visible),
    ...testimonials.slice(0, Math.max(0, index + visible - testimonials.length)),
  ]

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <h3 className="text-xl md:text-2xl font-semibold tracking-tight">What our customers say</h3>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((t, i) => (
          <div key={i} className="rounded-lg border bg-card p-5">
            <div className="flex items-center gap-3">
              <img
                src={t.avatar || "/placeholder.svg"}
                alt={t.name + " avatar"}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div className="font-medium">{t.name}</div>
            </div>
            <p className="mt-3 text-muted-foreground">{t.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
