"use client";
import { useEffect, useRef } from "react";
import ProductCard from "./product-card";

export default function ProductsGrid({
  title,
  description,
  items,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
}: {
  title?: string;
  description?: string;
  // items: Product[];
  fetchNextPage?: () => void;
  items: any[];
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
}) {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!fetchNextPage || !hasNextPage || !loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  return (
    <section className="container mx-auto px-6 md:px-12 py-10">
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-sm md:text-base text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </div>
      )}
      {/* Keep generic grid for shared usage; category page uses its own 3/5 layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {/* Sentinel for infinite scroll */}
      {fetchNextPage && (
        <div
          ref={loadMoreRef}
          className="h-10 mt-6 flex items-center justify-center"
        >
          {isFetchingNextPage ? (
            <span>Loading more…</span>
          ) : hasNextPage ? (
            <span>Scroll to load more</span>
          ) : (
            <span>No more products</span>
          )}
        </div>
      )}
    </section>
  );
}
