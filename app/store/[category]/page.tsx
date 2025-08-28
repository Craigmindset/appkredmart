"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import LayoutShell from "@/components/layout-shell";
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
import ProductCard from "@/components/product-card";
import { products } from "@/lib/products";
import { getCategoryFromSlug } from "@/lib/categories";
import { useProducts } from "@/lib/services/products/use-products";
import { useGetProducts } from "@/lib/services/products/use-get-products";

const BRAND_OPTIONS = [
  "Apple",
  "Samsung",
  "Panasonic",
  "Hisense",
  "Dell",
  "HP",
  "TCL",
  "JVC",
  "Polystar",
  "Haier",
  "Binatone",
  "Sony",
  "Infinix",
  "Techno",
  "Lenovo",
  "LG",
  "Xiaomi",
  "Huawei",
  "OnePlus",
  "Google",
  "Microsoft",
  "Asus",
  "Acer",
  "Canon",
  "Nikon",
  "Bose",
  "JBL",
  "Beats",
  "Rolex",
  "Casio",
  "Fitbit",
  "Garmin",
] as const;

// Category-specific banner content
const CATEGORY_BANNERS = {
  "phones-and-tablets": {
    title: "Latest Phones & Tablets",
    subtitle: "Discover cutting-edge smartphones and tablets from top brands",
    image: "/placeholder.svg?height=340&width=600",
    bgColor: "bg-gradient-to-r from-blue-600 to-purple-600",
    textColor: "text-white",
  },
  computing: {
    title: "Computing Solutions",
    subtitle: "Laptops, desktops, and accessories for work and gaming",
    image: "/placeholder.svg?height=340&width=600",
    bgColor: "bg-gradient-to-r from-gray-800 to-gray-600",
    textColor: "text-white",
  },
  electronics: {
    title: "Consumer Electronics",
    subtitle: "TVs, audio systems, cameras and smart home devices",
    image: "/placeholder.svg?height=340&width=600",
    bgColor: "bg-gradient-to-r from-green-600 to-teal-600",
    textColor: "text-white",
  },
  generators: {
    title: "Power Generators",
    subtitle: "Reliable backup power solutions for home and business",
    image: "/placeholder.svg?height=340&width=600",
    bgColor: "bg-gradient-to-r from-orange-600 to-red-600",
    textColor: "text-white",
  },
  accessories: {
    title: "Tech Accessories",
    subtitle: "Cases, chargers, cables and essential tech accessories",
    image: "/placeholder.svg?height=340&width=600",
    bgColor: "bg-gradient-to-r from-indigo-600 to-blue-600",
    textColor: "text-white",
  },
  "home-kitchen": {
    title: "Home & Kitchen",
    subtitle: "Appliances and essentials for modern living",
    image: "/placeholder.svg?height=340&width=600",
    bgColor: "bg-gradient-to-r from-pink-600 to-rose-600",
    textColor: "text-white",
  },
  lifestyle: {
    title: "Lifestyle Products",
    subtitle: "Fashion, fitness, and lifestyle essentials",
    image: "/placeholder.svg?height=340&width=600",
    bgColor: "bg-gradient-to-r from-purple-600 to-pink-600",
    textColor: "text-white",
  },
  watches: {
    title: "Watches & Wearables",
    subtitle: "Smart watches, fitness trackers, and luxury timepieces",
    image: "/placeholder.svg?height=340&width=600",
    bgColor: "bg-gradient-to-r from-yellow-600 to-orange-600",
    textColor: "text-white",
  },
  "premium-devices": {
    title: "Premium Devices",
    subtitle: "Exclusive high-end electronics and luxury tech",
    image: "/placeholder.svg?height=340&width=600",
    bgColor: "bg-gradient-to-r from-black to-gray-800",
    textColor: "text-white",
  },
};

export default function CategoryPage() {
  const params = useParams<{ category: string }>();
  const slug = params.category;
  const category = getCategoryFromSlug(slug);

  const router = useRouter();
  const qs = useSearchParams();
  const q = (qs.get("search") || "").toString().trim();

  const [brand, setBrand] = useState<string | "all">("all");
  const [onlyDeals, setOnlyDeals] = useState(false);
  const [sort, setSort] = useState<"htl" | "lth" | "none">("none");
  const { data } = useGetProducts({
    category,
    limit: 20,
    page: 1,
    brand: brand === "all" ? undefined : brand,
  });
  const products = data?.data || [];
  // const list = useMemo(() => {
  //   let list = products.filter((p) => p.category === category);
  //   if (q) {
  //     const s = q.toLowerCase();
  //     list = list.filter(
  //       (p) =>
  //         p.title.toLowerCase().includes(s) ||
  //         p.brand.toLowerCase().includes(s) ||
  //         p.category.toLowerCase().includes(s)
  //     );
  //   }
  //   if (brand !== "all")
  //     list = list.filter((p) => p.brand.toLowerCase() === brand.toLowerCase());
  //   if (onlyDeals) list = list.filter((p) => p.deal);
  //   if (sort === "htl") list.sort((a, b) => b.price - a.price);
  //   if (sort === "lth") list.sort((a, b) => a.price - b.price);
  //   return list;
  // }, [category, q, brand, onlyDeals, sort]);

  const resetFilters = () => {
    setBrand("all");
    setOnlyDeals(false);
    setSort("none");
  };

  if (!category) {
    if (typeof window !== "undefined") router.replace("/store");
    return null;
  }

  const bannerConfig = CATEGORY_BANNERS[
    slug as keyof typeof CATEGORY_BANNERS
  ] || {
    title: category,
    subtitle: `Explore our ${category.toLowerCase()} collection`,
    image: `/placeholder.svg?height=340&width=600&query=${encodeURIComponent(
      category + " promo"
    )}`,
    bgColor: "bg-gradient-to-r from-blue-600 to-purple-600",
    textColor: "text-white",
  };

  return (
    <LayoutShell>
      <section className="container mx-auto px-4 pt-6">
        {/* Hero: 60% slider, 40% category banner */}
        <div className="grid gap-4 md:grid-cols-10">
          <div className="md:col-span-6 rounded-lg border bg-card">
            <HeroSlider />
          </div>
          <div
            className={`md:col-span-4 rounded-lg border ${bannerConfig.bgColor} p-6 flex flex-col justify-center`}
          >
            <div className={bannerConfig.textColor}>
              <h2 className="text-2xl font-bold mb-2">{bannerConfig.title}</h2>
              <p className="text-sm opacity-90 mb-4">{bannerConfig.subtitle}</p>
              <div className="relative h-48 rounded-md overflow-hidden">
                <img
                  src={bannerConfig.image || "/placeholder.svg"}
                  alt={`${category} collection`}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Breadcrumb / heading */}
        <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
          <Link href="/store" className="text-muted-foreground hover:underline">
            Store
          </Link>
          <span>{">"}</span>
          <span className="font-medium">{category}</span>
          {q && (
            <>
              <span>{">"}</span>
              <span className="text-muted-foreground">Search: "{q}"</span>
            </>
          )}
        </div>

        {/* Content with filters */}
        <div className="mt-4 grid gap-4 md:grid-cols-10">
          {/* Left filter panel */}
          <aside className="md:col-span-2 rounded-lg border bg-card p-4 h-fit sticky top-[72px]">
            <h4 className="mb-3 text-sm font-semibold">Filter</h4>

            <div className="mb-4">
              <div className="text-sm font-medium mb-2">Brand</div>
              <Select onValueChange={(v) => setBrand(v)} value={brand}>
                <SelectTrigger>
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All brands</SelectItem>
                  {BRAND_OPTIONS.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mb-4 flex items-center gap-2">
              <Switch
                id="deals"
                checked={onlyDeals}
                onCheckedChange={(v) => setOnlyDeals(Boolean(v))}
              />
              <Label htmlFor="deals" className="text-sm">
                Deals only
              </Label>
            </div>

            <div className="mb-4">
              <div className="text-sm font-medium mb-2">Pricing</div>
              <Select
                onValueChange={(v: "htl" | "lth" | "none") => setSort(v)}
                value={sort}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Default</SelectItem>
                  <SelectItem value="lth">Low to High</SelectItem>
                  <SelectItem value="htl">High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <button
              onClick={resetFilters}
              className="mt-2 inline-flex w-full items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              Reset Filters
            </button>
          </aside>

          {/* Products */}
          <div className="md:col-span-8">
            <div className="mb-3">
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
                {category}
              </h2>
              {q && (
                <p className="text-sm text-muted-foreground">
                  Showing results for "{q}"
                </p>
              )}
              <p className="text-sm text-muted-foreground mt-1">
                {products.length} products found
              </p>
            </div>
            {/* 5 per row on desktop, 3 per row on mobile */}
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
              {products.length === 0 && (
                <div className="col-span-3 md:col-span-5 text-center py-8">
                  <p className="text-muted-foreground">No products found.</p>
                  <button
                    onClick={resetFilters}
                    className="mt-2 text-sm text-blue-600 hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </LayoutShell>
  );
}
