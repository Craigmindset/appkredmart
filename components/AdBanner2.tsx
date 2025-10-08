"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function AdBanner() {
  const slides = [
    {
      label: "Apple",
      title: ["Silver", "MACBOOK PRO"],
      desc: "6.9 inch Super Retina XDR OLED, Triple 48 mp camera, 16GB RAM, 1TB SSD, 8-core CPU, 10-core GPU, and more.",
      img: "https://hlfwfvupabrc8fwr.public.blob.vercel-storage.com/apple-m1.png",
      cta: { href: "/category/audio", text: "Shop by Apple Brand" },
    },
    {
      label: "Apple",
      title: ["Iphone 17", "512GB Dual SIM"],
      desc: "6.8-inch QHD+ Dynamic AMOLED 2X, 200MP camera, 5000mAh battery, S Pen support, and more.",
      img: "/StoreBanner/IPHONE 17.png",
      cta: { href: "/store?search=iphone+17", text: "Buy Now" },
    },
    {
      label: "SMART TV",
      title: ["Clear", "SPEAKERS"],
      desc: "Amazing sound, deep bass, portable Bluetooth speakers for every occasion.",
      img: "/StoreBanner/TV Stand.png",
      cta: { href: "/category/audio", text: "Shop JBL Speakers" },
    },
  ];

  const [current, setCurrent] = useState(0);
  const prevSlide = () =>
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  const nextSlide = () =>
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 8000); // 8 seconds
    return () => clearInterval(interval);
  }, [slides.length]);

  const slide = slides[current];

  return (
    <section className="w-full max-w-6xl mx-auto bg-gradient-to-tr from-[#0F3D73] to-[#D4AF37] rounded-2xl border-4 border-[#e2e8f0] overflow-hidden shadow-md p-1 md:p-4 flex flex-col md:flex-row items-center justify-between min-h-[60px] md:min-h-[100px] relative">
      {/* Left Arrow hidden */}

      {/* Text Content */}
      <div className="flex flex-col ml-6 gap-3 text-center md:text-left md:max-w-xl">
        <span className="text-white/80 text-sm md:text-base">
          {slide.label}
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
          <span className="text-white/70 block">{slide.title[0]}</span>
          <span className="block">{slide.title[1]}</span>
        </h2>
        <p className="text-white/90 text-sm md:text-base">{slide.desc}</p>
        <Link
          href={slide.cta.href}
          className="inline-block mt-4 bg-red-500 text-white font-semibold px-6 py-3 rounded-full hover:bg-red-600 transition-all duration-200 w-fit mx-auto md:mx-0"
        >
          {slide.cta.text}
        </Link>
      </div>

      {/* Image */}
      <div className="relative w-full max-w-xs md:max-w-md mt-4 md:mt-0">
        <Image
          src={slide.img}
          alt={slide.title[1]}
          width={300}
          height={300}
          className="object-contain w-full h-auto max-h-[120px] md:max-h-[300px]"
        />
      </div>

      {/* Right Arrow hidden */}
    </section>
  );
}
