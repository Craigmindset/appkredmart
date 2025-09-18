"use client";
import React from "react";
import Image from "next/image";

const PHONE_IMG =
  "https://hlfwfvupabrc8fwr.public.blob.vercel-storage.com/kredmart-mobile.png";

const HeroMobile: React.FC = () => {
  return (
    <section
      className="
        md:hidden relative overflow-hidden
        bg-[#9FE3F3]  /* soft blue like your mock */
        text-center
        px-5 pt-10 pb-4
        min-h-[92vh] flex flex-col
      "
      aria-label="KredMart wallet credit hero"
    >
      {/* Dotted world pattern */}
      <svg
        className="pointer-events-none absolute inset-0 opacity-40"
        width="100%"
        height="100%"
        viewBox="0 0 360 740"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="dots"
            x="0"
            y="0"
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="1" fill="#6CC2D1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
        <rect
          width="100%"
          height="45%"
          y="0"
          fill="url(#dots)"
          opacity="0.35"
        />
      </svg>

      {/* Headline */}
      <div className="relative z-10">
        <h1
          className="
            text-4xl leading-tight font-extrabold tracking-tight
            text-[#4A0F0F] drop-shadow-sm
          "
        >
          Wallet Credit
        </h1>
        <p className="mt-2 text-sm text-[#224C56]/80">
          Your credit-powered e-commerce platform. Access instant wallet loans
          and shop top products with the best deal.
        </p>
        <div className="mt-5  flex flex-row items-center justify-center gap-3 ">
          <a
            href="/sign-up"
            className="px-5 py-2 rounded-full bg-[#4A0F0F] text-white font-semibold text-sm shadow hover:bg-[#6b1a1a] transition-colors"
          >
            Get Loans
          </a>
          <a
            href="/store"
            className="px-5 py-2 rounded-full bg-white text-[#224C56] border border-[#224C56] font-semibold text-sm shadow hover:bg-[#e6f7fa] transition-colors"
          >
            Visit Store
          </a>
        </div>
      </div>

      {/* Phone image overflowing below bottom */}
      <div className="relative z-10 flex-1 flex items-end justify-center pb-0 ">
        <div className="absolute left-1/2 bottom-[-60px] -translate-x-1/2 w-[96%] max-w-[360px]">
          <Image
            src={PHONE_IMG}
            alt="KredMart mobile app showing wallet credit shopping screen"
            width={720}
            height={1560}
            priority
            className="-ml-12"
            style={{ marginTop: 0 }}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroMobile;
