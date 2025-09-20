"use client";

import React, { useRef, useEffect } from "react";

export default function ThreeColumnAd() {
  const row1Ref = useRef<HTMLDivElement>(
    null
  ) as React.RefObject<HTMLDivElement>;
  const row2Ref = useRef<HTMLDivElement>(
    null
  ) as React.RefObject<HTMLDivElement>;

  // Auto-scroll logic for mobile
  useEffect(() => {
    function autoScrollRow(
      ref: React.RefObject<HTMLDivElement>,
      interval = 2500
    ) {
      if (!ref.current) return;
      let scrollAmount = 0;
      const container = ref.current;
      const card = container.querySelector("div");
      if (!card) return;
      const cardWidth = card.clientWidth + 24; // 24px gap-6
      let timer: NodeJS.Timeout;

      function scrollNext() {
        if (!container) return;
        // If at end, reset to start
        if (
          container.scrollLeft + container.offsetWidth >=
          container.scrollWidth - 5
        ) {
          container.scrollTo({ left: 0, behavior: "auto" });
        } else {
          container.scrollBy({ left: cardWidth, behavior: "smooth" });
        }
      }
      timer = setInterval(scrollNext, interval);
      return () => clearInterval(timer);
    }

    // Only run on small screens
    const isMobile = window.innerWidth < 640;
    let cleanup1: (() => void) | undefined;
    let cleanup2: (() => void) | undefined;
    if (isMobile) {
      cleanup1 = autoScrollRow(row1Ref);
      cleanup2 = autoScrollRow(row2Ref);
    }
    return () => {
      if (cleanup1) cleanup1();
      if (cleanup2) cleanup2();
    };
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 p-6 justify-center">
      {/* Mobile: Only show Airpods Pro and Apple Watch in first row, Clear Speakers and VR Gaming in second row. Desktop: show all as before. */}
      {/* First row for mobile (Airpods Pro, Apple Watch) - stacked, no slider */}
      <div className="flex flex-col gap-4 sm:hidden w-full">
        <div
          className="group rounded-2xl shadow-lg overflow-hidden flex items-center justify-center w-full"
          style={{
            maxWidth: 400,
            width: "100%",
            height: 260, // increased height for more padding
            margin: "0 auto",
          }}
        >
          <img
            src="/StoreBanner/kredmart-1.gif"
            alt="Airpods Pro"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.4s cubic-bezier(.4,2,.6,1)",
              willChange: "transform",
            }}
            className="group-hover:scale-110"
          />
        </div>
        <div
          className="group rounded-2xl shadow-lg overflow-hidden flex items-center justify-center w-full"
          style={{
            maxWidth: 400,
            width: "100%",
            height: 260, // increased height for more padding
            margin: "0 auto",
          }}
        >
          <img
            src="/StoreBanner/kredmart-1 (2).png"
            alt="Apple Watch"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.4s cubic-bezier(.4,2,.6,1)",
              willChange: "transform",
            }}
            className="group-hover:scale-110"
          />
        </div>
      </div>
      {/* First row for desktop (all three) */}
      <div
        ref={row1Ref}
        className="hidden sm:flex gap-6 justify-center overflow-x-auto scrollbar-hide sm:flex-row flex-nowrap sm:overflow-visible"
      >
        <div
          className="group rounded-2xl shadow-lg overflow-hidden flex items-center justify-center min-w-[60vw] sm:min-w-0"
          style={{ width: 300, height: 250 }}
        >
          <img
            src="/StoreBanner/kredmart-1 (3).png"
            alt="Airpods Pro"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.4s cubic-bezier(.4,2,.6,1)",
              willChange: "transform",
            }}
            className="group-hover:scale-110"
          />
        </div>
        <div
          className="group rounded-2xl shadow-lg overflow-hidden flex items-center justify-center min-w-[80vw] sm:min-w-0"
          style={{ width: 300, height: 250 }}
        >
          <img
            src="/StoreBanner/kredmart-1 (2).png"
            alt="Apple Watch"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.4s cubic-bezier(.4,2,.6,1)",
              willChange: "transform",
            }}
            className="group-hover:scale-110"
          />
        </div>
        <div
          className="group rounded-2xl shadow-lg overflow-hidden flex items-center justify-center min-w-[80vw] sm:min-w-0"
          style={{ width: 450, height: 250 }}
        >
          <img
            src="/StoreBanner/kredmart-1 (1).png"
            alt="Ad banner 3"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.4s cubic-bezier(.4,2,.6,1)",
              willChange: "transform",
            }}
            className="group-hover:scale-110"
          />
        </div>
      </div>
      {/* Second row for mobile (Clear Speakers, VR Gaming) - stacked, no slider */}
      <div className="flex flex-col gap-4 sm:hidden w-full mt-2">
        <div
          className="group rounded-2xl shadow-lg overflow-hidden flex items-center justify-center w-full"
          style={{
            maxWidth: 400,
            width: "100%",
            height: 260, // increased height for more padding
            margin: "0 auto",
          }}
        >
          <img
            src="/StoreBanner/kredmart-img (2).png"
            alt="Clear Speakers"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.4s cubic-bezier(.4,2,.6,1)",
              willChange: "transform",
            }}
            className="group-hover:scale-110"
          />
        </div>
        <div
          className="group rounded-2xl shadow-lg overflow-hidden flex items-center justify-center w-full"
          style={{
            maxWidth: 400,
            width: "100%",
            height: 260, // increased height for more padding
            margin: "0 auto",
          }}
        >
          <img
            src="/StoreBanner/kredmart-img (3).png"
            alt="VR Gaming"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.4s cubic-bezier(.4,2,.6,1)",
              willChange: "transform",
            }}
            className="group-hover:scale-110"
          />
        </div>
      </div>
      {/* Second row for desktop (all three) */}
      <div
        ref={row2Ref}
        className="hidden sm:flex gap-6 justify-center overflow-x-auto scrollbar-hide sm:flex-row flex-nowrap sm:overflow-visible"
      >
        <div
          className="group rounded-2xl shadow-lg overflow-hidden flex items-center justify-center min-w-[80vw] sm:min-w-0"
          style={{ width: 450, height: 280 }}
        >
          <img
            src="/StoreBanner/kredmart-img (2).png"
            alt="Clear Speakers"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.4s cubic-bezier(.4,2,.6,1)",
              willChange: "transform",
            }}
            className="group-hover:scale-110"
          />
        </div>
        <div
          className="group rounded-2xl shadow-lg overflow-hidden flex items-center justify-center min-w-[80vw] sm:min-w-0"
          style={{ width: 300, height: 280 }}
        >
          <img
            src="/StoreBanner/kredmart-img (1).png"
            alt="Ad banner 5"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.4s cubic-bezier(.4,2,.6,1)",
              willChange: "transform",
            }}
            className="group-hover:scale-110"
          />
        </div>
        <div
          className="group rounded-2xl shadow-lg overflow-hidden flex items-center justify-center min-w-[80vw] sm:min-w-0"
          style={{ width: 300, height: 280 }}
        >
          <img
            src="/StoreBanner/kredmart-img (3).png"
            alt="VR Gaming"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.4s cubic-bezier(.4,2,.6,1)",
              willChange: "transform",
            }}
            className="group-hover:scale-110"
          />
        </div>
      </div>
    </div>
  );
}
