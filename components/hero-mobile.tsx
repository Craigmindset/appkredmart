"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Poppins } from "next/font/google";
import { Button } from "@/components/ui/button";
// ...existing code...

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const PHONE_IMG =
  "https://hlfwfvupabrc8fwr.public.blob.vercel-storage.com/kredmart-mobile.png";

// Use the same slides array as hero-slider
const slides = [
  {
    src: "https://hlfwfvupabrc8fwr.public.blob.vercel-storage.com/shopella-hero-img.png",
    alt: "Shopella Hero Section",
    headline: "Shop Freely",
    subheadline: "Pay Flexibly",
    description:
      " your credit-powered marketplace where you can shop top products, unlock wallet loans instantly, and get the best deals all in one place..",
    button1: { text: "Get Loans", href: "/sign-up" },
    button2: { text: "Visit Store", href: "/store" },
  },
  {
    src: "/Shopella-hero-slider.png",
    alt: "Shopella Hero Slider",
    headline: "Wallet Credit!",
    subheadline: "When you need it most.",
    description:
      "Get instant shopping power with Kredmart Wallet Credit. Access flexible shopping credit to buy your favorite products and pay at your own pace.",
    button1: { text: "Browse Products", href: "/store" },
    button2: { text: "Learn More", href: "/about" },
  },
];

const HeroMobile: React.FC = () => {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const slideCount = slides.length;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slideCount);
    }, 8000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [slideCount]);

  const slide = slides[current];
  return (
    <section
      className="md:hidden relative overflow-hidden bg-[#0F3D73] text-center px-5 pt-10 pb-4 min-h-[92vh] flex flex-col"
      aria-label="KredMart wallet credit hero"
    >
      {/* Background VIDEO */}
      <video
        className="absolute inset-0 h-full w-full object-cover z-0"
        src="https://hlfwfvupabrc8fwr.public.blob.vercel-storage.com/Kredmart-video.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
      {/* Dark/brand overlay to keep text readable */}
      <div className="absolute inset-0 z-[1] bg-black/40" />
      {/* Dotted world pattern hidden */}

      {/* Headline */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full mt-10 ">
        <h1
          className={`${poppins.className} text-5xl sm:text-6xl md:text-7xl font-extrabold text-white mb-1 drop-shadow-lg leading-tight break-words max-w-full tracking-tighter`}
        >
          {slide.headline}
        </h1>
        <h2 className="text-xl font-semibold text-white mb-2 drop-shadow">
          {slide.subheadline}
        </h2>
        <p className="mt-2 text-sm text-[#ffffff]/80 max-w-md mx-auto">
          {slide.description}
        </p>
      </div>
      {/* Always show Get Loans and Visit Store buttons, regardless of slide */}
      <div className="flex flex-row items-center justify-center gap-3 mt-8 mb-2 z-30 z-[3]">
        <button
          type="button"
          className="px-8 py-2 rounded-full bg-blue-700 text-white font-semibold text-sm shadow hover:bg-blue-900 transition-colors active:opacity-70"
          onClick={() => router.push(slides[0].button1.href)}
        >
          {slides[0].button1.text}
        </button>
        <button
          type="button"
          className="px-8 py-2 rounded-full bg-gray-200 text-blue-900 border border-blue-900 font-semibold text-sm shadow hover:bg-blue-100 transition-colors active:opacity-70"
          onClick={() => router.push(slides[0].button2.href)}
        >
          {slides[0].button2.text}
        </button>
      </div>
      {/* Phone image overflowing below bottom */}
      {/* Phone image hidden for this version */}
    </section>
  );
};

export default HeroMobile;
