"use client";
import { useEffect, useRef } from "react";
import ProductCard from "./product-card";
import Spinner from "@/components/ui/spinner";

export default function ProductsGrid({
  title,
  description,
  items,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  showDealBadge = false,
  isLoading = false,
  isFetching = false,
}: {
  title?: string;
  description?: string;
  fetchNextPage?: () => void;
  items: any[];
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  isLoading?: boolean;
  isFetching?: boolean;
  showDealBadge?: boolean;
}) {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Auto-fetch next page after initial load
    if (fetchNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage]);

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

      {/* Spinner while searching/loading */}
      {isLoading || isFetching ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Spinner className="h-10 w-10 mb-4" />
          <span className="text-gray-500 text-base">Searching…</span>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <span className="text-gray-500 text-base">Product not found</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} showDealBadge={showDealBadge} />
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
        </>
      )}
    </section>
  );
}
