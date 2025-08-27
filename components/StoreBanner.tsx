"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { PhoneCall, Store as StoreIcon, Package } from "lucide-react";

/* ---------- DATA ---------- */
const sliderImages = [
  {
    src: "/StoreBanner/8502320_192.jpg",
    alt: "Natural Cosmetics Banner",
    text: "Berries Natural Cosmetics - Refreshing and Moisturizing",
  },
  {
    src: "/StoreBanner/2149670637.jpg",
    alt: "Store Banner 2",
    text: "Discover our latest skincare collection",
  },
  {
    src: "/StoreBanner/2151074307.jpg",
    alt: "Store Banner 3",
    text: "Shop premium beauty products today",
  },
];

const promoImages = [
  // bottom-right promo card (you can keep one or rotate through several)
  { src: "/StoreBanner/creditcredit-ad.jpg", alt: "Join Now Promo" },
];

const CALL_TO_ORDER = "+2349057871672"; // change if needed

/* ---------- COMPONENT ---------- */
export default function StoreBanner() {
  const [current, setCurrent] = useState(0);
  const [promoIndex, setPromoIndex] = useState(0);

  // Auto-slide every 5s
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
    <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto gap-4 px-2 md:px-2  md:h-[400px]">
      {/* LEFT: MAIN SLIDER */}
      <div className="relative w-full md:w-[68%] rounded-xl overflow-hidden bg-[#0b101a] min-h-[220px] md:min-h-[360px]">
        {/* slide image */}
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
          <div className="mt-3 flex items-center gap-3">
            <button className="bg-white/90 text-black text-xs md:text-sm font-semibold px-4 py-2 rounded-full hover:bg-white transition">
              Discover
            </button>
          </div>
        </div>

        {/* arrows */}
        <button
          aria-label="Previous"
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/85 hover:bg-white rounded-full px-2 py-1 text-black shadow"
        >
          &#8592;
        </button>
        <button
          aria-label="Next"
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/85 hover:bg-white rounded-full px-2 py-1 text-black shadow"
        >
          &#8594;
        </button>

        {/* dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {sliderImages.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setCurrent(i)}
              className={`h-2.5 w-2.5 rounded-full transition
                ${
                  i === current
                    ? "bg-white/90"
                    : "bg-white/50 hover:bg-white/75"
                }`}
            />
          ))}
        </div>
      </div>

      {/* RIGHT: ACTIONS + PROMO STACK */}
      <div className="w-full md:w-[32%] flex flex-col gap-4">
        {/* Quick Actions Card */}
        <div className="bg-white rounded-xl shadow-sm border border-black/5 p-4 md:p-5">
          <a
            href={`tel:${CALL_TO_ORDER}`}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-black/[0.03] transition"
          >
            <div className="h-9 w-9 rounded-full grid place-items-center border text-[#f59e0b] border-[#f59e0b]/30">
              <PhoneCall className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                Call to Order
              </p>
              <p className="text-xs text-gray-600">{CALL_TO_ORDER}</p>
            </div>
          </a>

          <hr className="my-2 border-gray-200" />

          <a
            href="/send"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-black/[0.03] transition"
          >
            <div className="h-9 w-9 rounded-full grid place-items-center border text-gray-700 border-gray-300">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm">
                Send Your Packages
              </p>
              <p className="text-xs text-gray-600">Fast delivery nationwide</p>
            </div>
          </a>
        </div>

        {/* Promo Card */}
        <div className="relative rounded-xl overflow-hidden bg-[#f59e0b] min-h-[200px] md:min-h-[180px]">
          <Image
            src={promoImages[promoIndex].src}
            alt={promoImages[promoIndex].alt}
            fill
            className="object-cover"
            sizes="(max-width:768px) 100vw, 32vw"
            priority={false}
          />
          {/* Optional overlay text */}
          {/* <div className="absolute inset-0 bg-black/20" /> */}
        </div>
      </div>
    </div>
  );
}
