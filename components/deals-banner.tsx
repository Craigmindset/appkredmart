"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const slides = [
  {
    src: "/StoreBanner/8502320_192.jpg",
    alt: "Deal Slide 1",
    text: "Big Savings on Electronics!",
  },
  {
    src: "/StoreBanner/2149670637.jpg",
    alt: "Deal Slide 2",
    text: "Exclusive Deals on Phones & Gadgets!",
  },
  {
    src: "/StoreBanner/2151074307.jpg",
    alt: "Deal Slide 3",
    text: "Shop Now & Enjoy Discounts!",
  },
];

export default function DealsBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const slide = slides[current];

  return (
    <div
      className="w-full max-w-6xl mx-auto my-6 rounded-1xl overflow-hidden"
      style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}
    >
      <div className="relative w-full h-[220px] sm:h-[320px] md:h-[400px] flex items-center justify-center">
        <Image
          src={slide.src}
          alt={slide.alt}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 90vw, (max-width: 1200px) 80vw, 1200px"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <h2 className="text-white text-2xl sm:text-4xl md:text-5xl font-bold drop-shadow-lg text-center px-4">
            {slide.text}
          </h2>
        </div>
      </div>
    </div>
  );
}
