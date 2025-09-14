"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";

type DealAdItem = {
  id: string;
  title: string;
  image: string; // URL or /public path
  href?: string; // optional link target
  alt?: string;
};

type DealsAdsProps = {
  items?: DealAdItem[];
  heading?: string;
  seeAllHref?: string;
  className?: string;
};

/**
 * DealsAds — Jumia-style deals strip.
 * - Mobile: horizontal scroll-snap (3 tiles per view)
 * - Desktop: grid (5–8 columns responsive)
 * - Clean, accessible, and easy to theme.
 *
 * NOTE: For remote images with next/image, ensure domains are allowed in next.config.js.
 */
export default function DealsAds({
  items = DEFAULT_ITEMS,
  heading = "KredMart Deals",
  className = "",
}: DealsAdsProps) {
  const [current, setCurrent] = useState(0);
  const perSlide = 3;
  const totalSlides = Math.ceil(items.length / perSlide);

  useEffect(() => {
    if (items.length <= perSlide) return;
    const id = setInterval(() => {
      setCurrent((prev) => (prev + 1) % totalSlides);
    }, 4000);
    return () => clearInterval(id);
  }, [items.length, totalSlides]);

  // Helper to get 3 items per view, looping if needed
  const getLoopedItems = () => {
    if (items.length === 0) return [];
    const start = current * perSlide;
    let view = items.slice(start, start + perSlide);
    if (view.length < perSlide) {
      view = view.concat(items.slice(0, perSlide - view.length));
    }
    return view;
  };

  return (
    <section className={`w-full max-w-6xl mx-auto ${className}`}>
      {/* MOBILE: auto-sliding carousel, 3 cards per slide, looped */}
      <div className="relative md:hidden">
        <div className="w-full flex justify-center items-center gap-1.5">
          {getLoopedItems().map((it) => (
            <Tile
              key={it.id}
              item={it}
              className="w-[110px] h-[170px] flex-shrink-0"
            />
          ))}
        </div>
      </div>

      {/* DESKTOP/TABLET: responsive grid */}
      <div className="hidden md:grid grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-2">
        {items.map((it) => (
          <Tile key={it.id} item={it} className="w-[110px] h-[170px] mx-auto" />
        ))}
      </div>
    </section>
  );
}

/* ---------- Subcomponents ---------- */

function Tile({
  item,
  className = "",
}: {
  item: DealAdItem;
  className?: string;
}) {
  const body = (
    <div
      className={`group flex flex-col items-center justify-between ${className}`}
      aria-label={item.title}
      role="link"
      tabIndex={0}
    >
      {/* Image card only, no caption */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm transition group-hover:shadow-md w-full h-[110px] flex items-center justify-center">
        <div className="relative w-[90px] h-[90px]">
          <Image
            src={item.image}
            alt={item.alt || item.title}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 33vw, (max-width: 1280px) 12vw, 10vw"
            priority={false}
          />
        </div>
      </div>
    </div>
  );

  return body;
}

/* ---------- Defaults (replace with your own) ---------- */

const DEFAULT_ITEMS: DealAdItem[] = [
  {
    id: "awoof",
    title: "Awoof Deals",
    image: "/placeholder.svg?height=300&width=300&text=Awoof",
    href: "/deals/awoof",
  },
  {
    id: "paydeal",
    title: "Pay Deal KredMart",
    image: "/pay-deal-kredmart.png",
    href: "/deals/pay-deal-kredmart",
  },
  {
    id: "clearance",
    title: "Up to 80% Off",
    image: "/placeholder.svg?height=300&width=300&text=Clearance",
    href: "/deals/clearance",
  },
  {
    id: "delivery",
    title: "Send Packages Securely",
    image: "/placeholder.svg?height=300&width=300&text=Delivery",
    href: "/logistics",
  },
  {
    id: "b2p1",
    title: "Buy 2 pay for 1",
    image: "/placeholder.svg?height=300&width=300&text=Buy2Pay1",
    href: "/deals/buy-2-pay-1",
  },
  {
    id: "force",
    title: "Earn While You Shop",
    image: "/placeholder.svg?height=300&width=300&text=Earn",
    href: "/affiliate",
  },
  {
    id: "unlock",
    title: "Unlock Your Deal",
    image: "/placeholder.svg?height=300&width=300&text=Unlock",
    href: "/deals/unlock",
  },
  {
    id: "sport",
    title: "Sporting Goods",
    image: "/placeholder.svg?height=300&width=300&text=Sport",
    href: "/category/sporting-goods",
  },
];
