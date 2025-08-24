"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import LayoutShell from "@/components/layout-shell";
import ProductsGrid from "@/components/products-grid";
import HeroSlider from "@/components/hero-slider";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { allBrands, allCategories, products } from "@/lib/products";
import { slugifyCategory } from "@/lib/categories";
import {
  Smartphone,
  Monitor,
  Zap,
  Fuel,
  Headphones,
  Home,
  Heart,
  Watch,
  Crown,
} from "lucide-react";
import { useGetProducts } from "@/lib/services/products/use-get-products";

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

  // const filtered = useMemo(() => {
  //   let list = products.slice();
  //   if (q) {
  //     const s = q.toLowerCase();
  //     list = list.filter(
  //       (p) =>
  //         p.title.toLowerCase().includes(s) ||
  //         p.brand.toLowerCase().includes(s) ||
  //         p.category.toLowerCase().includes(s)
  //     );
  //   }
  //   if (brand !== "all") list = list.filter((p) => p.brand === brand);
  //   if (onlyDeals) list = list.filter((p) => p.deal);
  //   if (sort === "htl") list.sort((a, b) => b.price - a.price);
  //   if (sort === "lth") list.sort((a, b) => a.price - b.price);
  //   return list;
  // }, [q, brand, onlyDeals, sort]);

  const { data } = useGetProducts();

  return (
    <LayoutShell>
      <section className="container mx-auto px-4 pt-6">
        {/* Top: Categories (20%), Slider (50%) */}
        <div className="grid gap-4 md:grid-cols-7">
          <aside className="md:col-span-2 rounded-lg border bg-card p-4">
            <h4 className="mb-3 text-sm font-semibold">Categories</h4>
            <ul className="space-y-2 text-sm">
              {allCategories.map((c) => (
                <li key={c}>
                  <Link
                    href={`/store/${slugifyCategory(c)}`}
                    className="flex items-center gap-2 hover:underline leading-9"
                  >
                    {(() => {
                      const IconComponent =
                        categoryIcons[c as keyof typeof categoryIcons];
                      return IconComponent ? (
                        <IconComponent className="h-4 w-4" />
                      ) : null;
                    })()}
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>

          <div className="md:col-span-5 rounded-lg border bg-card">
            <HeroSlider />
          </div>
        </div>

        {/* Inline toolbar filters (deals, sort, brand) */}
        <div className="mt-6 rounded-lg border bg-card p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                id="deals"
                checked={onlyDeals}
                onCheckedChange={(v) => setOnlyDeals(Boolean(v))}
              />
              <Label htmlFor="deals">Deals</Label>
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-sm">Sort</Label>
              <Select
                onValueChange={(v: "htl" | "lth" | "none") => setSort(v)}
                defaultValue="none"
                value={sort}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Default</SelectItem>
                  <SelectItem value="htl">High to Low</SelectItem>
                  <SelectItem value="lth">Low to High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-sm">Brand</Label>
              <Select value={brand} onValueChange={(v) => setBrand(v)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All brands" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All brands</SelectItem>
                  {allBrands.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      <ProductsGrid
        title={q ? `Search results for “${q}”` : "All Products"}
        description={
          q
            ? undefined
            : "Browse a curated selection of electronics, phones, audio and more."
        }
        items={data?.data || []}
      />
    </LayoutShell>
  );
}
