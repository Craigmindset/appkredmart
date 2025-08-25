"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function AdBanner() {
  const slides = [
    {
      label: "Apple",
      title: ["Silver", "MACBOOK PRO"],
      desc: "13.3-inch (diagonal) LED-backlit display with IPS technology; 2560-by-1600 native resolution at 227 pixels per inch with support for millions of colors",
      img: "https://hlfwfvupabrc8fwr.public.blob.vercel-storage.com/apple-m1.png",
      cta: { href: "/category/audio", text: "Shop by Apple Brand" },
    },
    {
      label: "Samsung",
      title: ["Galaxy", "S24 Ultra"],
      desc: "6.8-inch QHD+ Dynamic AMOLED 2X, 200MP camera, 5000mAh battery, S Pen support, and more.",
      img: "/StoreBanner/kredmart-img (3).png",
      cta: { href: "/category/phones", text: "Shop Samsung Phones" },
    },
    {
      label: "JBL",
      title: ["Clear", "SPEAKERS"],
      desc: "Amazing sound, deep bass, portable Bluetooth speakers for every occasion.",
      img: "/StoreBanner/kredmart-img (3).png",
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
    }, 4000); // 4 seconds
    return () => clearInterval(interval);
  }, [slides.length]);

  const slide = slides[current];

  return (
    <section className="w-full max-w-6xl mx-auto bg-gradient-to-tr from-[#bcc7d1] to-[#123d61] rounded-2xl border-4 border-[#e2e8f0] overflow-hidden shadow-md p-2 md:p-6 flex flex-col md:flex-row items-center justify-between min-h-[80px] md:min-h-[150px] relative">
      {/* Left Arrow */}
      <button
        aria-label="Previous"
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white text-[#123d61] rounded-full p-2 shadow-md transition"
        style={{ outline: "none" }}
      >
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      {/* Text Content */}
      <div className="flex flex-col ml-12 gap-4 text-center md:text-left md:max-w-xl">
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
      <div className="relative w-full max-w-md mt-8 md:mt-0">
        <Image
          src={slide.img}
          alt={slide.title[1]}
          width={500}
          height={500}
          className="object-contain w-full h-auto"
        />
      </div>

      {/* Right Arrow */}
      <button
        aria-label="Next"
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white text-[#123d61] rounded-full p-2 shadow-md transition"
        style={{ outline: "none" }}
      >
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </section>
  );
}
