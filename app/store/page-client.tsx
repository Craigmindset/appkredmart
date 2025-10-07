"use client";

import ProductsGrid from "@/components/products-grid";
import StoreBanner from "@/components/StoreBanner";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { slugifyCategory } from "@/lib/categories";
import { allCategories } from "@/lib/products";
import { useInfiniteProducts } from "@/lib/services/products/use-infinite-products";
import {
  Crown,
  Fuel,
  Headphones,
  Heart,
  Home,
  Monitor,
  Smartphone,
  Watch,
  Zap,
} from "lucide-react";

const categoryIcons = {
  "Phones and Tablets": Smartphone,
  Computing: Monitor,
  Electronics: Zap,
  Power: Fuel,
  Accessories: Headphones,
  "Home & Kitchen": Home,
  Lifestyle: Heart,
  Watches: Watch,
  "Premium Devices": Crown,
  "Beauty Products": Heart,
  Fashion: Crown,
};

export default function StorePage() {
  const searchParams = useSearchParams();
  const q = (searchParams?.get("search") || "").toString().trim();

  const [brand, setBrand] = useState<string>("all");
  const [onlyDeals, setOnlyDeals] = useState(false);
  const [sort, setSort] = useState<"htl" | "lth" | "none">("none");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteProducts({
      ...(brand == "all" ? {} : { brand }),
      limit: 20,
      search: q,
    });

  const products = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <>
      <section className="w-full px-1 sm:px-4 pt-6 ">
        {/* Top: Categories (20%), StoreBanner (80%) */}
        <div className="grid gap-2 md:grid-cols-[20%_80%] items-stretch">
          <aside className="hidden md:block md:col-span-1 rounded-lg bg-blue-100 p-4 h-[400px]">
            <h4
              className="mb-3 ml-6 text-sm font-semibold text-black-100"
              style={{ fontFamily: "sans-serif" }}
            >
              Categories
            </h4>
            <ul
              className=" ml-6 space-y-0 text-sm text-black"
              style={{ fontFamily: "sans-serif" }}
            >
              {allCategories.map((c) => (
                <li key={c}>
                  <Link
                    href={`/store/${slugifyCategory(c)}`}
                    className="flex items-center gap-1 hover:underline leading-7"
                  >
                    {(() => {
                      const IconComponent =
                        categoryIcons[c as keyof typeof categoryIcons];
                      return IconComponent ? (
                        <IconComponent
                          className="h-4 w-4"
                          style={{ color: "#000000" }}
                        />
                      ) : null;
                    })()}
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>

          <div className="md:col-span-1 rounded-lg border bg-card h-[600px] md:h-[400px]">
            <StoreBanner />
          </div>
        </div>
      </section>

      <div id="results">
        <ProductsGrid
          title={q ? `Search results for “${q}”` : "All Products"}
          description={
            q
              ? undefined
              : "Browse a curated selection of electronics, phones, audio and more."
          }
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          items={products}
        />
      </div>
    </>
  );
}
