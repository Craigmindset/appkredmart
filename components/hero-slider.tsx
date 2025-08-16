"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Poppins } from "next/font/google";
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
  // Only two slides now
];

import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth-store";

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const slideCount = slides.length;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slideCount);
    }, 4000);
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
  console.log("Auth user in HeroSection:", user);
  const slide = slides[current];

  return (
    <section className="relative bg-[#d0e6f5] min-h-[400px] md:min-h-[600px] lg:min-h-[700px] overflow-hidden">
      {/* Background image with opacity */}
      <div
        className="absolute inset-0 w-full h-full z-0"
        style={{
          backgroundImage: `url('/background-img.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.05,
          transition: "background-image 0.5s ease-in-out",
        }}
      />
      <div className="relative max-w-[1100px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center h-full min-h-[300px] md:min-h-[500px] lg:min-h-[600px]">
          {/* Left Column - Content */}
          <div className="space-y-4 md:space-y-6 flex flex-col justify-center pt-2 md:pt-4 px-0 md:px-4">
            <div className="space-y-1">
              <h1
                className={`${poppins.className} text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-tight tracking-tighter drop-shadow-lg whitespace-nowrap text-left`}
              >
                {slide.headline}
              </h1>
              <h2
                className={`${poppins.className} text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 leading-tight tracking-tighter text-left`}
              >
                {slide.subheadline}
              </h2>
            </div>
            <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-normal max-w-lg">
              {slide.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 md:pt-4 w-full">
              <Button
                size="lg"
                className="bg-green-900 hover:bg-gray-800 shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 w-full sm:w-auto"
                onClick={() => router.push("/sign-up")}
              >
                {slides[0].button1.text}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 bg-transparent w-full sm:w-auto"
                onClick={() => (window.location.href = slides[0].button2.href)}
              >
                {slides[0].button2.text}
              </Button>
            </div>
            {/* Slider Controls - hidden on mobile */}
            <div className="hidden sm:flex items-center gap-3 md:gap-4 pt-6 md:pt-8">
              <button
                aria-label="Previous Slide"
                onClick={goToPrev}
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-400 transition"
              >
                &#8592;
              </button>
              <div className="flex gap-2">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    aria-label={`Go to slide ${idx + 1}`}
                    onClick={() => goToSlide(idx)}
                    className={`w-3 h-3 rounded-full ${
                      current === idx ? "bg-green-900" : "bg-gray-300"
                    } transition`}
                  />
                ))}
              </div>
              <button
                aria-label="Next Slide"
                onClick={goToNext}
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-400 transition"
              >
                &#8594;
              </button>
            </div>
          </div>
          {/* Right Column - Image aligned bottom */}
          <div className="relative w-full h-[220px] sm:h-[320px] md:h-[400px] lg:h-[500px] flex items-end justify-center pt-6 md:pt-8">
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
