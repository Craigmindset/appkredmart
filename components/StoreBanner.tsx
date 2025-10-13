"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

/* ---------- DATA ---------- */
const sliderImages = [
  {
    src: "/StoreBanner/kredmart-slide-img.jpg",
    alt: "shop with kredmart",
    text: "",
  },
  {
    src: "/StoreBanner/2149670637.jpg",
    alt: "Store Banner 2",
    text: "",
  },
  {
    src: "/StoreBanner/2151074307.jpg",
    alt: "Store Banner 3",
    text: "",
  },
];

const promoImages = [
  { src: "/StoreBanner/creditcredit-ad.jpg", alt: "Join Now Promo" },
];

export default function StoreBanner() {
  const [current, setCurrent] = useState(0);
  const [promoIndex, setPromoIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((p) => (p + 1) % sliderImages.length);
      setPromoIndex((p) => (p + 1) % promoImages.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const nextSlide = () => setCurrent((p) => (p + 1) % sliderImages.length);
  const prevSlide = () =>
    setCurrent((p) => (p - 1 + sliderImages.length) % sliderImages.length);

  return (
    <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto gap-4 px-2 md:px-2 md:h-[400px] mb-0 pb-0">
      {/* LEFT: MAIN SLIDER (desktop unchanged) */}
      <div className="relative w-full md:w-[68%] rounded-2xl overflow-hidden bg-[#0b101a] min-h-[220px] md:min-h-[350px]">
        <Image
          src={sliderImages[current].src}
          alt={sliderImages[current].alt}
          fill
          priority
          className="object-cover"
          sizes="(max-width:768px) 100vw, 68vw"
        />

        {/* overlay text + CTA */}
        <div className="absolute inset-0 bg-black/25 flex flex-col items-start justify-end p-4 md:p-6">
          <h2 className="text-white text-lg md:text-3xl font-extrabold leading-snug max-w-[90%] md:max-w-[70%] drop-shadow">
            {sliderImages[current].text}
          </h2>
          <div className="mt-3">
            <button className="bg-white/90 text-black text-xs md:text-sm font-semibold px-4 py-2 rounded-full hover:bg-white transition">
              Discover
            </button>
          </div>
        </div>

        {/* arrows (desktop only) */}
        <button
          aria-label="Previous"
          onClick={prevSlide}
          className="hidden md:block absolute left-2 top-1/2 -translate-y-1/2 bg-white/85 hover:bg-white rounded-full px-2 py-1 text-black shadow"
        >
          &#8592;
        </button>
        <button
          aria-label="Next"
          onClick={nextSlide}
          className="hidden md:block absolute right-2 top-1/2 -translate-y-1/2 bg-white/85 hover:bg-white rounded-full px-2 py-1 text-black shadow"
        >
          &#8594;
        </button>

        {/* dots (desktop only) */}
        <div className="hidden md:flex absolute bottom-3 left-1/2 -translate-x-1/2 gap-2">
          {sliderImages.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setCurrent(i)}
              className={`h-2.5 w-2.5 rounded-full transition ${
                i === current ? "bg-white/90" : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      </div>

      {/* RIGHT: PROMO */}
      {/* Mobile: 2-column grid with tighter gap and shorter aspect ratio */}
      {/* Desktop (md+): original stacked column preserved */}
      <div
        className="
          w-full md:w-[32%]
          grid grid-cols-2 gap-2
          md:grid-cols-1 md:gap-4 md:flex md:flex-col
          mb-0 pb-0
        "
      >
        {/* Promo Card 1 */}
        <div className="relative rounded-xl overflow-hidden bg-[#f59e0b] aspect-[1/1.05] md:min-h-[180px] md:aspect-auto">
          <Image
            src={promoImages[promoIndex].src}
            alt={promoImages[promoIndex].alt}
            fill
            className="object-cover"
            sizes="(max-width:768px) 50vw, 32vw"
            priority={false}
          />
        </div>

        {/* Promo Card 2: GIF on mobile, static image on desktop */}
        {/* Mobile only GIF */}
        <div className="relative rounded-xl overflow-hidden bg-[#f59e0b] aspect-[1/1.05] md:min-h-[180px] md:aspect-auto block md:hidden">
          <Image
            src="/StoreBanner/slide-samsung.gif"
            alt="Samsung Promo"
            fill
            className="object-cover"
            sizes="(max-width:768px) 50vw, 32vw"
            priority={false}
          />
        </div>
        {/* Desktop/Tablet only static image, top center */}
        <div className="relative hidden md:flex md:justify-center md:items-start rounded-xl overflow-hidden bg-[#f59e0b] aspect-[1/1.05] md:min-h-[190px] md:aspect-auto">
          <Image
            src="/StoreBanner/new-samsung.gif"
            alt="Samsung Promo"
            fill
            className="object-cover md:object-top"
            sizes="(max-width:768px) 50vw, 32vw"
            priority={false}
          />
        </div>
      </div>
    </div>
  );
}
