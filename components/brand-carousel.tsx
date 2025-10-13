"use client";

import { useEffect, useRef } from "react";

const brandLogos = [
  { name: "LG", src: "/brand-logos/lg.svg" },
  { name: "Casio G-Shock", src: "/brand-logos/casio-gshock.svg" },
  { name: "Lenovo", src: "/brand-logos/lenovo.svg" },
  { name: "Dell", src: "/brand-logos/dell.svg" },
  { name: "Sony", src: "/brand-logos/sony.svg" },
  { name: "Samsung", src: "/brand-logos/samsung.svg" },
  { name: "Apple", src: "/brand-logos/apple.svg" },

  { name: "acer", src: "/brand-logos/acer.svg" },
  { name: "Nikon", src: "/brand-logos/nikon.svg" },
  { name: "HP", src: "/brand-logos/hp.svg" },
  { name: "Panasonic", src: "/brand-logos/panasonic.svg" },
];
export default function BrandCarousel() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    let raf = 0;
    const el = trackRef.current;
    if (!el) return;
    let x = 0;
    const step = () => {
      x -= 0.4;
      el.style.transform = `translateX(${x}px)`;
      if (Math.abs(x) > el.scrollWidth / 2) x = 0;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="border-y bg-muted/40">
      <div className="container mx-auto overflow-hidden">
        <div className="relative py-6">
          <div
            className="flex gap-4 md:gap-10 will-change-transform"
            ref={trackRef}
          >
            {[...brandLogos, ...brandLogos].map((b, i) => (
              <div key={i} className="shrink-0">
                <img
                  src={b.src}
                  alt={b.name + " logo"}
                  className="h-10 w-[80px] object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
