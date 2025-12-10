"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Card = {
  image?: string;
  label?: string;
  href?: string;
};

export default function AdBannerMobile({ cards }: { cards?: Card[] }) {
  const defaults: Card[] = [
    {
      image: "/images/refridge-ad.png",
      label: "Refrigerators",
      href: "/store/electronics?preview=scanfrost-sfl150-eco-chest-freezer-480ed941",
    },
    {
      image: "/images/washmachine-ad.png",
      label: "Washing Machines",
      href: "/store/electronics",
    },
    {
      image: "/images/inverter-ad.png",
      label: "Power Solutions",
      href: "/store/electronics?preview=ecoflow-delta-pro-30c535e3",
    },
    {
      image: "/images/aircondition-ad.png",
      label: "Air Conditioners",
      href: "/store/electronics",
    },
  ];

  // Show up to 4 cards arranged as two rows of two on mobile
  const useCards = (cards && cards.length ? cards : defaults).slice(0, 4);

  return (
    <div className="block md:hidden px-0 bg-white mt-10">
      <div className="grid grid-cols-2 gap-2">
        {useCards.map((c, i) => (
          <div
            key={i}
            className="w-full bg-white rounded-lg overflow-hidden shadow-sm flex flex-col items-start"
          >
            <div className="w-full h-48 relative bg-green-500">
              <Image
                src={c.image || "/placeholder.svg"}
                alt={c.label || `Card ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw"
              />
            </div>
            <div className="p-1 w-full">
              <Link href={c.href || "#"} className="w-full">
                <Button className="w-full text-sm py-1" variant="outline">
                  {c.label || "Learn more"}
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
      {/* Full-width single ad row beneath the 2x2 grid */}
      <div className="mt-3 w-full px-0">
        <Link href="/deals" className="block w-full">
          <div className="relative w-full h-44 overflow-hidden shadow-sm rounded-lg">
            <Image
              src="/images/banner-ad.png"
              alt="Kredmart Ad"
              fill
              className="object-cover w-full h-full"
              sizes="100vw"
            />
          </div>
        </Link>
      </div>
    </div>
  );
}
