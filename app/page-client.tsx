"use client";
import ProductCard from "@/components/product-card";
import { useEffect, useRef, useState } from "react";
import { useGetProducts } from "@/lib/services/products/use-get-products";
import { Skeleton } from "@/components/ui/skeleton";

export const ProductDeals = () => {
  const [page, setPage] = useState(1);
  // // Preload images for next page
  // useEffect(() => {
  //   const preloadNextImages = async () => {
  //     const nextPage = page + 1;
  //     // Fetch next page data (reuse useGetProducts logic)
  //     const res = await fetch(`/api/products?limit=6&page=${nextPage}`);
  //     if (!res.ok) return;
  //     const nextData = await res.json();
  //     if (nextData?.data) {
  //       nextData.data.forEach((p: any) => {
  //         if (p.image) {
  //           const img = new window.Image();
  //           img.src = p.image;
  //         }
  //         if (Array.isArray(p.images)) {
  //           p.images.forEach((imgUrl: string) => {
  //             if (imgUrl) {
  //               const img = new window.Image();
  //               img.src = imgUrl;
  //             }
  //           });
  //         }
  //       });
  //     }
  //   };
  //   preloadNextImages();
  // }, [page]);
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
    <section className="container mx-auto px-6 md:px-12 py-10 bg-[#F4F6F8]">
      {/* Responsive row: on mobile, h2 and link are in a row; on desktop, h2 and link are in separate flex children */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between md:text-left items-center justify-center text-center gap-2">
        {/* Mobile: h2 and link in a row */}
        <div className="w-full flex flex-row items-center justify-between md:hidden">
          <h2
            className="text-3xl font-bold tracking-tight mb-2"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            <span className="text-black">Today's</span>
            <span className="text-[#D4AF37]"> Deals</span>
          </h2>
          <a
            href="/deals"
            className="inline-block ml-2 text-blue-700 font-medium text-xs underline underline-offset-4 hover:text-blue-900 transition-colors"
          >
            View Products
          </a>
        </div>
        {/* Desktop: h2 and link in separate flex children */}
        <div className="hidden md:block">
          <h2
            className="text-4xl font-bold tracking-tight mb-2"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            <span className="text-black">Today's</span>
            <span className="text-[#D4AF37]"> Deals</span>
          </h2>
          <p
            className="text-base text-muted-foreground max-w-xl"
            style={{ fontFamily: "sans-serif" }}
          >
            Shopping experience that gives you the flexibility to shop more
          </p>
        </div>
        <a
          href="/deals"
          className="hidden md:inline-block mt-2 md:mt-0 text-blue-700 font-medium text-sm underline underline-offset-4 hover:text-blue-900 transition-colors"
        >
          View Products
        </a>
      </div>

      {/* MOBILE: 3-per-view horizontal scroll-snap */}
      <div className="md:hidden">
        {/* Navigation buttons hidden on mobile, visible only on md+ */}
        <div className="hidden md:flex items-center justify-between mb-2">
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
          {isFetching
            ? Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="snap-start shrink-0 basis-1/3 px-1 h-50 flex flex-col"//adjust product height on mobile view
                >
                  <Skeleton className="w-full h-full flex-1" />
                </div>
              ))
            : data?.data?.map((p: any) => (
                <div
                  key={p.id}
                  className="snap-start shrink-0 basis-1/3 px-1 h-50 flex flex-col"//adjust product height on mobile view
                >
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
          {isFetching
            ? Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="snap-start shrink-0 basis-1/3 px-1">
                  <Skeleton className="w-full h-72" />
                </div>
              ))
            : data?.data?.map((p: any) => (
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
