"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Poppins } from "next/font/google";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth-store";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const slides = [
  {
    src: "https://hlfwfvupabrc8fwr.public.blob.vercel-storage.com/shopella-hero-img.png",
    alt: "Shopella Hero Section",
    headline: "Shop Smarter",
    subheadline: "Access Loans",
    description:
      "Welcome to shopella! Your credit-powered e-commerce platform. Access instant wallet loans and shop top products with the best deal.",
    button1: { text: "Get Loans", href: "/sign-up" },
    button2: { text: "Visit Store", href: "/store" },
  },
  {
    src: "/Shopella-hero-slider.png",
    alt: "Shopella Hero Slider",
    headline: "Wallet Credit!",
    subheadline: "When you need it most.",
    description:
      "Get your wallet backed up loan to shop your favourite brand at Shopella. Access to over N500,000 shopping credit to make your purchase and pay flexibly.",
    button1: { text: "Browse Products", href: "/store" },
    button2: { text: "Learn More", href: "/about" },
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const slideCount = slides.length;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slideCount);
    }, 8000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [slideCount]);

  const goToSlide = (idx: number) => setCurrent(idx);
  const goToPrev = () =>
    setCurrent((prev) => (prev - 1 + slideCount) % slideCount);
  const goToNext = () => setCurrent((prev) => (prev + 1) % slideCount);

  const router = useRouter();
  const { user } = useAuth();
  const slide = slides[current];

  return (
    <section className="relative bg-[#0F3D73] min-h-[400px] md:min-h-[600px] lg:min-h-[700px] overflow-hidden">
      {/* Background VIDEO */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover z-0"
        src="https://hlfwfvupabrc8fwr.public.blob.vercel-storage.com/0_Woman_Online_Shopping_1280x720.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        // poster optional: provides a still on slow networks
        // poster="/background-img.jpg"
      />
      {/* Dark/brand overlay to keep text readable */}
      <div className="absolute inset-0 z-[1] bg-black/40 md:bg-black/35" />
      {/* Optional subtle gradient from left for copy legibility */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-black/35 via-black/20 to-transparent" />

      {/* Foreground content */}
      <div className="relative z-10 max-w-[1100px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center h-full min-h-[300px] md:min-h-[500px] lg:min-h-[600px]">
          {/* Left: copy */}
          <div className="space-y-4 md:space-y-6 flex flex-col justify-center pt-2 md:pt-4 px-0 md:px-4">
            <div className="space-y-1">
              <h1
                className={`${poppins.className} text-3xl sm:text-6xl md:text-7xl lg:text-7xl font-black text-white leading-tight tracking-tighter drop-shadow-lg whitespace-nowrap text-center lg:text-left`}
              >
                {slide.headline}
              </h1>
              <h2
                className={`${poppins.className} text-2xl sm:text-3xl lg:text-4xl font-semibold text-white leading-tight tracking-tighter text-center lg:text-left`}
              >
                {slide.subheadline}
              </h2>
            </div>
            <p className="text-xs sm:text-sm md:text-base text-[#F4F6F8] leading-normal max-w-lg">
              {slide.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 md:pt-4 w-full">
              <Button
                size="lg"
                className="bg-[#1A73E8] hover:bg-gray-800 shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 w-full sm:w-auto"
                onClick={() => router.push(slides[0].button1.href)}
              >
                {slides[0].button1.text}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-[#D4AF37] text-white hover:bg-gray-900 hover:text-white shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 bg-transparent w-full sm:w-auto"
                onClick={() => (window.location.href = slides[0].button2.href)}
              >
                {slides[0].button2.text}
              </Button>
            </div>

            {/* Slider controls */}
            <div className="hidden sm:flex items-center gap-3 md:gap-4 pt-6 md:pt-8">
              <button
                aria-label="Previous Slide"
                onClick={goToPrev}
                className="p-2 rounded-full bg-gray-200/90 hover:bg-gray-400 transition"
              >
                &#8592;
              </button>
              <div className="flex gap-2">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    aria-label={`Go to slide ${idx + 1}`}
                    onClick={() => goToSlide(idx)}
                    className={`w-3 h-3 rounded-full transition ${
                      current === idx ? "bg-[#1A73E8]" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
              <button
                aria-label="Next Slide"
                onClick={goToNext}
                className="p-2 rounded-full bg-gray-200/90 hover:bg-gray-400 transition"
              >
                &#8594;
              </button>
            </div>
          </div>

          {/* Right: hero image (per slide) */}
          <div className="relative w-full h-[220px] sm:h-[320px] md:h-[400px] lg:h-[600px] flex items-end justify-center pt-6 md:pt-8">
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              className="object-contain"
              priority
              sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 500px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
