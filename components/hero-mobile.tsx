"use client";
import React from "react";
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

const HeroMobile: React.FC = () => {
  const router = useRouter();
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
      <div className="relative z-10 flex flex-col items-center justify-center w-full mt-10 z-[3]">
        <Image
          src="/kredmart-text.png"
          alt="Smart Shopping Wallet Credit"
          width={400}
          height={120}
          className="mx-auto w-full max-w-[420px] h-auto"
          priority
        />
        <p className="mt-2 text-sm text-[#ffffff]/80">
          Your credit-powered e-commerce platform. Access instant wallet loans
          and shop top products with the best deal.
        </p>
      </div>
      <div className="flex flex-row items-center justify-center gap-3 mt-8 mb-2 z-30 z-[3]">
        <button
          type="button"
          className="px-8 py-2 rounded-full bg-blue-700 text-white font-semibold text-sm shadow hover:bg-blue-900 transition-colors active:opacity-70"
          onClick={() => router.push("/sign-up")}
        >
          Get Loans
        </button>
        <button
          type="button"
          className="px-8 py-2 rounded-full bg-gray-200 text-blue-900 border border-blue-900 font-semibold text-sm shadow hover:bg-blue-100 transition-colors active:opacity-70"
          onClick={() => router.push("/store")}
        >
          Visit Store
        </button>
      </div>
      {/* Phone image overflowing below bottom */}
      {/* Phone image hidden for this version */}
    </section>
  );
};

export default HeroMobile;
