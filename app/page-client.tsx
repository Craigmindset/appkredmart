"use client";
import ProductCard from "@/components/product-card";
import { useEffect, useRef, useState } from "react";
import { useGetProducts } from "@/lib/services/products/use-get-products";

export const ProductDeals = () => {
  const [page, setPage] = useState(1);
  // Preload images for next page
  useEffect(() => {
    const preloadNextImages = async () => {
      const nextPage = page + 1;
      // Fetch next page data (reuse useGetProducts logic)
      const res = await fetch(`/api/products?limit=6&page=${nextPage}`);
      if (!res.ok) return;
      const nextData = await res.json();
      if (nextData?.data) {
        nextData.data.forEach((p: any) => {
          if (p.image) {
            const img = new window.Image();
            img.src = p.image;
          }
          if (Array.isArray(p.images)) {
            p.images.forEach((imgUrl: string) => {
              if (imgUrl) {
                const img = new window.Image();
                img.src = imgUrl;
              }
            });
          }
        });
      }
    };
    preloadNextImages();
  }, [page]);
  const { data, isFetching } = useGetProducts({ limit: 6, page });

  // Desktop/tablet page controls
  const handlePrevPage = () => {
    if (page > 1) setPage((p) => p - 1);
  };
  const handleNextPage = () => {
    if (data && data.data.length === 6) setPage((p) => p + 1);
  };

  // Mobile scroller
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const scrollMobile = (dir: "prev" | "next") => {
    const el = scrollerRef.current;
    if (!el) return;
    const chunk = el.clientWidth; // roughly one viewport width
    el.scrollBy({ left: dir === "next" ? chunk : -chunk, behavior: "smooth" });
  };

  return (
    <section className="container mx-auto px-6 md:px-12 py-10">
      <div className="mb-6 flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
          <span className="text-black">KredMart</span>
          <span className="text-red-600"> Deals</span>
        </h2>
        <p className="text-sm md:text-base text-muted-foreground max-w-xl">
          Shopping experience that gives you the flexibility to shop more
        </p>
      </div>

      {/* MOBILE: 3-per-view horizontal scroll-snap */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            onClick={() => scrollMobile("prev")}
            className="rounded-full bg-white/90 shadow px-3 py-2 text-xs"
            aria-label="Previous"
          >
            ◀
          </button>
          <button
            type="button"
            onClick={() => scrollMobile("next")}
            className="rounded-full bg-white/90 shadow px-3 py-2 text-xs"
            aria-label="Next"
          >
            ▶
          </button>
        </div>
        <div
          ref={scrollerRef}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth -mx-3 px-3 gap-0"
          style={{ WebkitOverflowScrolling: "touch" }}
          aria-label="Deals carousel"
        >
          {data?.data?.map((p: any) => (
            <div key={p.id} className="snap-start shrink-0 basis-1/3 px-1">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
        {/* Removed mobile page indicator and prev/next page buttons for cleaner navigation-only UI */}
      </div>

      {/* DESKTOP/TABLET: keep grid + side page buttons */}
      <div className="hidden md:flex items-center gap-2">
        <button
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition disabled:opacity-50"
          onClick={handlePrevPage}
          disabled={page === 1 || isFetching}
          aria-label="Previous page"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6 text-gray-700"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 w-full">
          {data?.data?.map((p: any) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        <button
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition disabled:opacity-50"
          onClick={handleNextPage}
          disabled={isFetching || !data || data.data.length < 6}
          aria-label="Next page"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6 text-gray-700"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </section>
  );
};
