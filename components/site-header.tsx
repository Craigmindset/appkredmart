"use client";
import type React from "react";
import { Suspense, useMemo, useState, useEffect } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { slugifyCategory } from "@/lib/categories";
import { appFontClass } from "@/lib/fonts";
import { allCategories } from "@/lib/products";
import { useUser } from "@/lib/services/user/user";
import { cartSelectors, useCart } from "@/store/cart-store";
import {
  AlignJustify,
  CreditCard,
  Home,
  Info,
  Lock,
  Menu,
  ShoppingCart,
  Store,
  Tag,
  User,
  Truck,
  Smartphone,
  Laptop,
  Tv,
  Zap,
  Plug,
  Utensils,
  Heart,
  Watch,
  Star,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Skeleton } from "./ui/skeleton";

// Map category names to Lucide icons
const categoryIcons: Record<string, React.ReactNode> = {
  "Phones & Tablets": <Smartphone className="h-4 w-4 mr-2" />,
  Computing: <Laptop className="h-4 w-4 mr-2" />,
  Electronics: <Tv className="h-4 w-4 mr-2" />,
  Generators: <Zap className="h-4 w-4 mr-2" />,
  Accessories: <Plug className="h-4 w-4 mr-2" />,
  "Home & Kitchen": <Utensils className="h-4 w-4 mr-2" />,
  Lifestyle: <Heart className="h-4 w-4 mr-2" />,
  Watches: <Watch className="h-4 w-4 mr-2" />,
  "Premium Devices": <Star className="h-4 w-4 mr-2" />,
};

const MAIN_MENU = [
  { href: "/", label: "Home", icon: <Home className="h-4 w-4" /> },
  {
    href: "/access-loan",
    label: "Access Loan",
    icon: <CreditCard className="h-4 w-4" />,
  },
  { href: "/store", label: "Store", icon: <Store className="h-4 w-4" /> },
  {
    href: "/deals",
    label: "Kredmart deals",
    icon: <Tag className="h-4 w-4" />,
  },
  { href: "/about", label: "About", icon: <Info className="h-4 w-4" /> },
];

/* ---------------------------- Top bar only (static) ---------------------------- */

function TopBar() {
  return (
    <div className="w-full bg-blue-900 text-white text-xs py-2 flex items-center justify-center gap-4 pr-4 ">
      <div className="flex items-center gap-2">
        <Truck className="h-4 w-4 mr-1 inline-block" />
        <span>Return Policy</span>
      </div>
      <span className="hidden sm:inline-block h-4 border-l border-blue-700 mx-2" />
      <div className="flex items-center gap-1">
        <span>Help:</span>
        <span>Need help?</span>
        <a
          href="https://wa.me/2349057871672"
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-green-300 hover:text-green-200 font-medium ml-1"
        >
          Chat live
        </a>
      </div>
    </div>
  );
}

/* ------------------------------- Country picker ------------------------------- */

type Country = { code: "NGN" | "GHA" | "GB"; label: string; flag: string };
const COUNTRIES: Country[] = [
  { code: "NGN", label: "Nigeria", flag: "/images/flags/ng.png" },
  { code: "GHA", label: "Ghana", flag: "/images/flags/gh.png" },
  { code: "GB", label: "United Kingdom", flag: "/images/flags/uk.png" },
];

function CountrySelector() {
  const [selected, setSelected] = useState<Country>(COUNTRIES[0]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 px-2">
          <img
            src={selected.flag}
            alt={`${selected.label} flag`}
            className="w-5 h-5 rounded-full object-cover"
          />
          <span className="hidden md:inline text-xs font-medium">
            {selected.label}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Select Country</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {COUNTRIES.map((country) => (
          <DropdownMenuItem
            key={country.code}
            onClick={() => setSelected(country)}
            className="flex items-center gap-2"
          >
            <img
              src={country.flag}
              alt={`${country.label} flag`}
              className="w-5 h-5 rounded-full object-cover"
            />
            <span className="text-xs font-medium">{country.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ------------------------ The hook-using header content ----------------------- */
/* This is the ONLY place we call usePathname/useSearchParams/useRouter.         */
/* We wrap THIS component with <Suspense> in the default export below.            */

function HeaderCore() {
  // --- Search Suggestions State ---
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  // Product names for suggestions (to be populated from API or real data)
  const productNames: string[] = [];
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isStore = useMemo(() => pathname?.startsWith("/store"), [pathname]);
  const storeSegment = useMemo(() => {
    if (!pathname) return null;
    const parts = pathname.split("/").filter(Boolean);
    if (parts[0] === "store" && parts[1]) return parts[1];
    return null;
  }, [pathname]);

  const { user, loading } = useUser();
  const itemCount = useCart(cartSelectors.count);

  // Keep search term in sync with URL ?search=
  const [term, setTerm] = useState("");
  const q = (searchParams?.get("search") ?? "").toString();
  useEffect(() => setTerm(q), [q]);

  const submitSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const next = term.trim();
    if (storeSegment) {
      router.push(
        next
          ? `/store/${storeSegment}?search=${encodeURIComponent(next)}`
          : `/store/${storeSegment}`
      );
    } else {
      router.push(
        next ? `/store?search=${encodeURIComponent(next)}` : "/store"
      );
    }
    setShowSuggestions(false);
    // Auto-scroll to results after navigation
    setTimeout(() => {
      const el = document.getElementById("results");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 500);
  };

  // Update suggestions as user types
  useEffect(() => {
    if (term.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const filtered = productNames.filter((name) =>
      name.toLowerCase().includes(term.toLowerCase())
    );
    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  }, [term]);

  const MENU = [
    { href: "/", label: "Home", icon: <Home className="h-4 w-4" /> },
    {
      href: "/access-loan",
      label: "Access Loan",
      icon: <CreditCard className="h-5 w-5 mr-1" />,
    },
    {
      href: "/store",
      label: "Store",
      icon: <Store className="h-5 w-5 mr-1" />,
    },
    {
      href: "/deals",
      label: "Kredmart deals",
      icon: <Tag className="h-5 w-5 mr-1" />,
    },
    { href: "/about", label: "About", icon: <Info className="h-5 w-5 mr-1" /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#d3e7f6] border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 md:h-20 items-center justify-between">
          {/* Left: Mobile menu + Site name */}
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden focus-visible:ring-2 focus-visible:ring-blue-500 text-black"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-64 bg-blue-900 h-dvh grid grid-rows-[auto_1fr_auto] p-0"
              >
                {/* Row 1: Header */}
                <SheetHeader className="px-5 py-4">
                  <SheetTitle className="text-white">KredMart</SheetTitle>
                </SheetHeader>

                {/* Row 2: Scrollable menu area */}
                <div className="overflow-y-auto px-2 py-6">
                  <nav className="flex flex-col gap-2">
                    {MAIN_MENU.map((m) => (
                      <Link
                        key={m.href}
                        href={m.href}
                        className="flex items-center gap-2 rounded px-2 py-4 text-xl text-white hover:bg-blue-800 focus-visible:ring-2 focus-visible:ring-blue-300"
                      >
                        {m.icon}
                        <span>{m.label}</span>
                      </Link>
                    ))}
                  </nav>
                </div>

                {/* Row 3: Footer pinned to bottom */}
                <div className="px-4 py-4 text-center text-xs text-blue-100">
                  Powered by KredMart &copy; {new Date().getFullYear()}
                </div>
              </SheetContent>
            </Sheet>

            <Link href="/" className="flex items-center h-10">
              <img
                src="/Kredmart Logo-01.png"
                alt="Kredmart Logo"
                className="h-6 w-auto"
                style={{ maxWidth: 180 }}
              />
            </Link>
          </div>

          {/* Center: Menu (desktop) */}
          <nav className="hidden md:flex items-center gap-4">
            {MAIN_MENU.map((m) => (
              <Link
                key={m.href}
                href={m.href}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  pathname === m.href
                    ? "bg-[#0F3D73] ring-1 ring-white/25 text-white"
                    : "hover:bg-white/10 text-[#0F3D73]"
                }`}
              >
                {m.icon}
                <span>{m.label}</span>
              </Link>
            ))}
          </nav>

          {/* Right: Country dropdown, Cart, Auth */}
          <div className="flex items-center justify-end gap-2">
            {/* Mobile icons */}
            <div className="flex items-center gap-1 md:hidden">
              <CountrySelector />

              {loading ? (
                <Skeleton className="w-10 h-10" />
              ) : !user ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push("/sign-in")}
                >
                  <Lock className="h-4 w-4" />
                  <span className="sr-only">Login</span>
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    router.push(
                      user.role === "admin"
                        ? "/admin/dashboard/overview"
                        : user.role === "merchant"
                        ? "/admindesk/dashboard/overview"
                        : "/dashboard"
                    )
                  }
                >
                  <User className="h-4 w-4" />
                  <span className="sr-only">Profile</span>
                </Button>
              )}
            </div>

            {/* Desktop country selector */}
            <div className="hidden md:block">
              <CountrySelector />
            </div>

            <Button
              variant="ghost"
              size="icon"
              aria-label="Cart"
              onClick={() => router.push("/cart")}
              className="relative focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge className="absolute -right-2 -top-2 px-1.5 py-0 text-[10px] bg-red-500 hover:bg-red-600 text-white">
                  {itemCount}
                </Badge>
              )}
            </Button>

            {/* Desktop auth links */}
            {loading ? (
              <Skeleton className="w-10 h-8 ml-2" />
            ) : !user ? (
              <>
                <Link
                  href="/sign-in"
                  className="hidden md:inline text-sm hover:underline focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  Login
                </Link>
                <Link
                  href="/sign-up"
                  className="hidden md:inline-flex h-8 items-center justify-center rounded-md border border-input  px-3 text-sm font-bold focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  router.push(
                    user.role === "admin"
                      ? "/admin/dashboard/overview"
                      : user.role === "merchant"
                      ? "/admindesk/dashboard/overview"
                      : "/dashboard"
                  )
                }
              >
                <User className="h-4 w-4" />
                <span className="sr-only">Profile</span>
              </Button>
            )}
          </div>
        </div>

        {/* Store toolbar: category picker + search + action */}
        {isStore && (
          <div className="border-t py-2 px-6 bg-blue-500">
            <form
              onSubmit={submitSearch}
              className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-2">
                {/* Categories */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Browse categories"
                    >
                      <AlignJustify className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64">
                    <DropdownMenuLabel>All Categories</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {allCategories.map((c) => (
                      <DropdownMenuItem
                        key={c}
                        onClick={() =>
                          router.push(`/store/${slugifyCategory(c)}`)
                        }
                        className="cursor-pointer flex items-center"
                      >
                        {categoryIcons[c] || <Tag className="h-4 w-4 mr-2" />}{" "}
                        {c}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Search */}
                <div className="flex-1 flex items-center gap-2">
                  <div className="relative w-full">
                    <Input
                      value={term}
                      onChange={(e) => setTerm(e.target.value)}
                      placeholder="Search products, brands, categories"
                      className="w-full min-w-0 sm:min-w-[280px] md:min-w-[400px] lg:min-w-[500px] transition-opacity focus:opacity-90 active:opacity-80"
                      aria-label="Search products"
                      autoComplete="off"
                      onFocus={() => setShowSuggestions(suggestions.length > 0)}
                      onBlur={() =>
                        setTimeout(() => setShowSuggestions(false), 100)
                      }
                      style={{ opacity: 0.95 }}
                    />
                    {showSuggestions && (
                      <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-50 max-h-56 overflow-y-auto transition-opacity opacity-95 hover:opacity-100">
                        {suggestions.map((s, i) => (
                          <li
                            key={s + i}
                            className="px-4 py-2 cursor-pointer hover:bg-blue-100 text-sm text-gray-800 transition-opacity active:opacity-80"
                            onMouseDown={() => {
                              setTerm(s);
                              setShowSuggestions(false);
                            }}
                          >
                            {s}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <Button type="submit">Search</Button>
                </div>
              </div>

              <Link
                href="/access-loan"
                className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium"
              >
                Get loans to Shop
              </Link>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}

/* ----------------------------- Public export ----------------------------- */

export default function SiteHeader() {
  return (
    <>
      <TopBar />
      {/* 👇 This Suspense fixes the build error for pages like /checkout */}
      <Suspense fallback={<HeaderFallback />}>
        <HeaderCore />
      </Suspense>
    </>
  );
}

/* Lightweight fallback to avoid layout jump */
function HeaderFallback() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-blue-800">
      <div className="container mx-auto px-4">
        <div className="h-16" />
      </div>
    </header>
  );
}
