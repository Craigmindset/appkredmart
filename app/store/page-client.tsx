"use client";

import ProductsGrid from "@/components/products-grid";
import ProductFilter from "@/components/product-filter";
import StoreBanner from "@/components/StoreBanner";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useCallback, useMemo } from "react";

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
  const router = useRouter();
  const search = searchParams.get("search")?.trim() || "";
  const q = (searchParams?.get("search") || "").toString().trim();

  const [filter, setFilter] = useState({
    brand: "",
    price: "",
    color: "",
    dealsOnly: false,
  });

  const handleFilterChange = useCallback(
    (next: {
      brand: string;
      price: string;
      color: string;
      dealsOnly: boolean;
    }) => {
      setFilter(next);

      // If brand is selected, navigate to brand page with SEO-friendly URL
      if (next.brand && next.brand !== filter.brand) {
        const brandSlug = next.brand.toLowerCase().replace(/\s+/g, "-");
        router.push(`/store/brand/${brandSlug}`, { scroll: false });
      }
    },
    [filter.brand, router]
  );

  let sortBy: string | undefined = undefined;
  let sortOrder: "asc" | "desc" | undefined = undefined;
  if (filter.price === "low-high") {
    sortBy = "price";
    sortOrder = "asc";
  } else if (filter.price === "high-low") {
    sortBy = "price";
    sortOrder = "desc";
  }

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteProducts({
      limit: 20,
      search: q,
      brand: filter.brand || undefined,
      color: filter.color || undefined,
      deals: filter.dealsOnly || undefined,
      sortBy,
      sortOrder,
    });

  const products = data?.pages.flatMap((page) => page.data) ?? [];

  const sortedProducts = useMemo(() => {
    if (!products.length) return products;
    if (filter.price === "low-high") {
      return [...products].sort(
        (a, b) => Number(a.price ?? 0) - Number(b.price ?? 0)
      );
    }
    if (filter.price === "high-low") {
      return [...products].sort(
        (a, b) => Number(b.price ?? 0) - Number(a.price ?? 0)
      );
    }
    return products;
  }, [products, filter.price]);

  return (
    <>
      <section className="w-full px-1 sm:px-4 pt-6">
        <div className="w-full max-w-7xl mx-auto px-2 md:px-6">
          {/* Top: Categories (20%), StoreBanner (80%) */}
          <div className="grid gap-2 md:grid-cols-[20%_80%] items-stretch">
            {/* Hide categories and StoreBanner on desktop if search is active */}
            {search === "" && (
              <>
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

                {/* ⬇️ Mobile: auto height; Desktop: keep 400px */}
                <div className="md:col-span-1  border bg-card h-auto md:h-[400px]">
                  <StoreBanner />
                </div>
              </>
            )}
          </div>

          {/* Product Filter above all products, sticky in context */}
          {/* ⬇️ Less padding on mobile to avoid big gaps */}
          <div className="w-full my-0 sticky top-20 z-30 py-3 md:py-14">
            <div className="flex justify-center">
              <ProductFilter
                brand={filter.brand}
                price={filter.price}
                color={filter.color}
                dealsOnly={filter.dealsOnly}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          <div id="results" className="-mt-10">
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
              isLoading={data === undefined}
              isFetching={data === undefined}
              items={sortedProducts}
            />
          </div>
        </div>
      </section>
    </>
  );
}
