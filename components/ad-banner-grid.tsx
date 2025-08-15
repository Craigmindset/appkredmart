"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdBannerGrid() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  const banners = Array.from({ length: 6 }).map((_, i) => ({
    id: i,
    src: `/placeholder.svg?height=220&width=360&query=promotion+banner+${i + 1}`,
    alt: `Ad banner ${i + 1}`,
  }))

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
  }

  if (isMobile) {
    return (
      <section className="container mx-auto px-4 py-10">
        <div className="relative">
          <div className="overflow-hidden rounded-lg">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {banners.map((banner) => (
                <div key={banner.id} className="w-full flex-shrink-0">
                  <img
                    src={banner.src || "/placeholder.svg"}
                    alt={banner.alt}
                    className="h-[220px] w-full rounded-lg object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
            onClick={nextSlide}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-4 space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide ? "bg-primary" : "bg-gray-300"
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Desktop grid layout
  return (
    <section className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {banners.map((banner) => (
          <div key={banner.id} className="flex items-center justify-center">
            <img
              src={banner.src || "/placeholder.svg"}
              alt={banner.alt}
              className="h-[220px] w-full rounded-lg object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  )
}
