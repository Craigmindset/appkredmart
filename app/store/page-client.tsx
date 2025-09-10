"use client";

import LayoutShell from "@/components/layout-shell";
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
  Generators: Fuel,
  Accessories: Headphones,
  "Home & Kitchen": Home,
  Lifestyle: Heart,
  Watches: Watch,
  "Premium Devices": Crown,
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
    <LayoutShell>
      <section className="container mx-auto px-0 pt-0">
        <div className="w-full">
          <StoreBanner />
        </div>
      </section>

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
    </LayoutShell>
  );
}
