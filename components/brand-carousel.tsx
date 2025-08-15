"use client"

import { useEffect, useRef } from "react"

const brands = ["Apple", "Samsung", "Sony", "Xiaomi", "LG", "Nokia", "Huawei", "OnePlus", "Bose", "HP"]

export default function BrandCarousel() {
  const trackRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    let raf = 0
    const el = trackRef.current
    if (!el) return
    let x = 0
    const step = () => {
      x -= 0.4
      el.style.transform = `translateX(${x}px)`
      if (Math.abs(x) > el.scrollWidth / 2) x = 0
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <section className="border-y bg-muted/40">
      <div className="container mx-auto overflow-hidden">
        <div className="relative py-6">
          <div className="flex gap-10 will-change-transform" ref={trackRef}>
            {[...brands, ...brands].map((b, i) => (
              <div key={i} className="shrink-0">
                <img
                  src={"/placeholder.svg?height=40&width=120&query=" + encodeURIComponent(`${b} black logo`)}
                  alt={b + " logo"}
                  className="h-10 w-[120px] object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
