"use client";

import HeroSlider from "@/components/hero-slider";
import ProductFilter from "@/components/product-filter";
import LayoutShell from "@/components/layout-shell";
import ProductCard from "@/components/product-card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { getCategoryFromSlug } from "@/lib/categories";
import { useInfiniteProducts } from "@/lib/services/products/use-infinite-products";
import Link from "next/link";
import { redirect, useParams, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

/* ---------- helpers ---------- */
type P = any;

const getImage = (p: P) =>
  p?.image || p?.thumbnail || p?.images?.[0] || "/placeholder.svg";

const getTitle = (p: P) => p?.title || p?.name || "Untitled";
const getPrice = (p: P) => Number(p?.price ?? 0);
const getOldPrice = (p: P) =>
  Number(
    p?.oldPrice ?? p?.compareAt ?? p?.compare_at_price ?? p?.listPrice ?? 0
  );
const hasDeal = (p: P) => Boolean(p?.deal) || getOldPrice(p) > getPrice(p);
const getDiscountPct = (p: P) => {
  const oldP = getOldPrice(p);
  const price = getPrice(p);
  if (!oldP || !price || oldP <= price) return 0;
  return Math.round(((oldP - price) / oldP) * 100);
};

/* ---------- constants ---------- */
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
  "home-&-kitchen": {
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
} as const;

/* ---------- small deal tile (for the orange strip) ---------- */
function DealTile({ p }: { p: P }) {
  const price = getPrice(p);
  const old = getOldPrice(p);
  const discount = getDiscountPct(p);

  return (
    <Link href={`/product/${p?.slug || p?.id || ""}`} className="block">
      <div className="relative rounded-lg border bg-white overflow-hidden">
        {/* discount badge */}
        {discount > 0 && (
          <span className="absolute -top-2 right-2 z-10 rounded-md bg-amber-500 px-2 py-1 text-[11px] font-semibold text-white shadow">
            -{discount}%
          </span>
        )}

        {/* image */}
        <div className="aspect-[4/3] bg-gray-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getImage(p)}
            alt={getTitle(p)}
            className="h-full w-full object-contain"
            loading="lazy"
          />
        </div>

        {/* text */}
        <div className="p-2">
          <p className="line-clamp-2 text-[13px]">{getTitle(p)}</p>
          <div className="mt-1">
            <div className="text-sm font-semibold">
              ₦ {price?.toLocaleString?.() ?? price}
            </div>
            {old > price && (
              <div className="text-xs text-muted-foreground line-through">
                ₦ {old?.toLocaleString?.() ?? old}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function CategoryPage() {
  const params = useParams<{ category: string }>();
  const slug = params.category;
  const category = getCategoryFromSlug(slug);

  const qs = useSearchParams();
  const q = (qs.get("search") || "").toString().trim();

  const [brand, setBrand] = useState<string | "all">("all");
  const [onlyDeals, setOnlyDeals] = useState(false);
  const [sort, setSort] = useState<"htl" | "lth" | "none">("none");
  const [color, setColor] = useState("");
  const [price, setPrice] = useState("");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteProducts({
      ...(brand == "all" ? {} : { brand }),
      limit: 20,
      category,
    });

  const products = data?.pages.flatMap((page) => page.data) ?? [];

  /* infinite scroll for main grid */
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!hasNextPage || !loadMoreRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && fetchNextPage(),
      { threshold: 1.0 }
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  /* filtered/sorted list for main grid */
  const list = useMemo(() => {
    let l = products.slice();
    if (q) {
      const s = q.toLowerCase();
      l = l.filter(
        (p: P) =>
          getTitle(p).toLowerCase().includes(s) ||
          (p?.brand || "").toLowerCase().includes(s) ||
          String(p?.category || "")
            .toLowerCase()
            .includes(s)
      );
    }
    if (brand !== "all")
      l = l.filter(
        (p: P) => (p?.brand || "").toLowerCase() === brand.toLowerCase()
      );
    if (onlyDeals) l = l.filter((p: P) => hasDeal(p));
    if (sort === "htl") l.sort((a: P, b: P) => getPrice(b) - getPrice(a));
    if (sort === "lth") l.sort((a: P, b: P) => getPrice(a) - getPrice(b));
    return l;
  }, [products, q, brand, onlyDeals, sort]);

  /* deals slice for the orange strip */
  const deals = useMemo(() => {
    const d = products.filter((p: P) => hasDeal(p));
    // Prefer biggest discounts first
    d.sort((a: P, b: P) => getDiscountPct(b) - getDiscountPct(a));
    return d.slice(0, 15);
  }, [products]);

  const resetFilters = () => {
    setBrand("all");
    setOnlyDeals(false);
    setSort("none");
    setColor("");
    setPrice("");
  };

  if (!category) {
    if (typeof window !== "undefined") redirect("/store");
    return null;
  }

  const bannerConfig = (CATEGORY_BANNERS as any)[slug] || {
    title: category,
    subtitle: `Explore our ${String(category).toLowerCase()} collection`,
    image: `/placeholder.svg?height=340&width=600&query=${encodeURIComponent(
      String(category) + " promo"
    )}`,
    bgColor: "bg-gradient-to-r from-blue-600 to-purple-600",
    textColor: "text-white",
  };

  return (
    <LayoutShell hideHeader>
      <section className="container mx-auto px-4 pt-6">
        {/* Category strip banner: only heading */}
        <div className="w-full bg-[#001F4D] py-4 mb-4 rounded-lg">
          <h2 className="text-2xl font-bold text-white text-center">
            {bannerConfig.title}
          </h2>
        </div>

        {/* Jumia-like DEALS STRIP */}
        {deals.length > 0 && (
          <div className="mb-6">
            {/* header bar */}
            <div className="mb-2 flex items-center justify-between rounded-md bg-amber-600 px-4 py-3 text-white shadow-sm">
              <h3 className="text-base font-semibold">Limited Stock Deals</h3>
              <Link
                href="/store/deals"
                className="inline-flex items-center gap-1 text-sm hover:underline"
              >
                See All
                <span aria-hidden>›</span>
              </Link>
            </div>

            {/* content: mobile = horizontal scroll (3 per view); md+ = 5 across */}
            <div className="md:hidden relative">
              <div
                className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth -mx-2 px-2 gap-2"
                style={{ WebkitOverflowScrolling: "touch" }}
                aria-label="Limited stock deals"
              >
                {deals.map((p: P) => (
                  <div
                    key={p.id}
                    className="snap-start shrink-0 basis-1/3 px-1"
                  >
                    <DealTile p={p} />
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden md:grid grid-cols-5 gap-3">
              {deals.slice(0, 10).map((p: P) => (
                <DealTile key={p.id} p={p} />
              ))}
            </div>
          </div>
        )}

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
          {/* Mobile filter: show ProductFilter only on mobile, sticky at top, no Reset Filters button */}
          <div className="md:hidden mb-4 sticky top-0 z-20 bg-white">
            <ProductFilter
              brand={brand}
              price={price}
              color={color}
              dealsOnly={onlyDeals}
              onChange={({ brand, price, color, dealsOnly }) => {
                setBrand(brand || "all");
                setPrice(price || "");
                setColor(color || "");
                setOnlyDeals(!!dealsOnly);
              }}
            />
          </div>

          {/* Left filter panel: only show on desktop */}
          <aside className="hidden md:block md:col-span-2 rounded-lg border bg-card p-4 h-fit sticky top-[150px]">
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
                {list.length} products found
              </p>
            </div>

            {/* main grid: 3 on mobile, 5 on desktop (like your note) */}
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
              {list.map((p: P) => (
                <ProductCard key={p.id} product={p} />
              ))}

              {list.length === 0 && (
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

            {/* infinite loader for main grid */}
            <div
              ref={loadMoreRef}
              className="h-10 mt-6 flex items-center justify-center w-full"
            >
              {isFetchingNextPage ? (
                <span>Loading more…</span>
              ) : hasNextPage ? (
                <span>Scroll to load more</span>
              ) : (
                <span>No more products</span>
              )}
            </div>
          </div>
        </div>
      </section>
    </LayoutShell>
  );
}
