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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { slugifyCategory } from "@/lib/categories";
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
  Search,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Skeleton } from "./ui/skeleton";

/* ----------------------- Category → icon mapping ----------------------- */
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

/* ---------------------------- Top bar (static) ---------------------------- */
function TopBar() {
  return (
    <div className="w-full bg-blue-900 text-white text-xs py-2 flex items-center justify-center gap-4 pr-4">
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

/* ----------------------------- Country picker ----------------------------- */
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
            alt=""
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
              alt=""
              className="w-5 h-5 rounded-full object-cover"
            />
            <span className="text-xs font-medium">{country.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ------------------------------- Header Core ------------------------------- */
function HeaderCore() {
  // search + suggestions
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const productNames: string[] = []; // plug in real data when ready

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

  // tie input to ?search=
  const [term, setTerm] = useState("");
  const q = (searchParams?.get("search") ?? "").toString();
  useEffect(() => setTerm(q), [q]);

  const submitSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const next = term.trim();
    const to = storeSegment
      ? next
        ? `/store/${storeSegment}?search=${encodeURIComponent(next)}`
        : `/store/${storeSegment}`
      : next
      ? `/store?search=${encodeURIComponent(next)}`
      : "/store";

    router.push(to);
    setShowSuggestions(false);
    setTimeout(
      () =>
        document
          .getElementById("results")
          ?.scrollIntoView({ behavior: "smooth" }),
      400
    );
  };

  useEffect(() => {
    if (term.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const filtered = productNames.filter((n) =>
      n.toLowerCase().includes(term.toLowerCase())
    );
    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  }, [term]);

  return (
    <header className="sticky top-0 z-50 bg-[#d3e7f6]">
      <div className="container mx-auto px-4">
        {/* ---------------------------- Row 1: Top nav ---------------------------- */}
        <div className="flex h-16 md:h-20 items-center justify-between">
          {/* Left: mobile drawer + logo */}
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-black"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>

              {/* Mobile drawer */}
              <SheetContent
                side="left"
                className="w-64 bg-blue-900 h-dvh grid grid-rows-[auto_1fr_auto] p-0"
              >
                <SheetHeader className="px-5 py-4">
                  <SheetTitle className="text-white">KredMart</SheetTitle>
                </SheetHeader>

                <div className="overflow-y-auto px-2 py-6">
                  <nav className="flex flex-col gap-2">
                    {MAIN_MENU.map((m) => (
                      <Link
                        key={m.href}
                        href={m.href}
                        className="flex items-center gap-2 rounded px-2 py-4 text-xl text-white hover:bg-blue-800"
                      >
                        {m.icon}
                        <span>{m.label}</span>
                      </Link>
                    ))}
                  </nav>
                </div>

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

          {/* Center: desktop menu (kept) */}
          <nav className="hidden md:flex items-center gap-3">
            {MAIN_MENU.map((m) => (
              <Link
                key={m.href}
                href={m.href}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition ${
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

          {/* Right: country + cart + auth */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* mobile country & auth */}
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

            {/* desktop country */}
            <div className="hidden md:block">
              <CountrySelector />
            </div>

            <Button
              variant="ghost"
              size="icon"
              aria-label="Cart"
              onClick={() => router.push("/cart")}
              className="relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge className="absolute -right-2 -top-2 px-1.5 py-0 text-[10px] bg-red-500 hover:bg-red-600 text-white">
                  {itemCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* ---------------------- NEW: Mobile horizontal pills ---------------------- */}
        <nav className="md:hidden -mt-1 pb-2">
          <ul className="flex items-center gap-2 overflow-x-auto whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {MAIN_MENU.map((m) => {
              const active = pathname === m.href;
              return (
                <li key={m.href} className="shrink-0">
                  <Link
                    href={m.href}
                    className={[
                      "inline-flex items-center gap-2 rounded-full px-3 py-2 text-[13px]",
                      active
                        ? "bg-[#0F3D73] text-white"
                        : m.href === "/access-loan"
                        ? "bg-white/70 text-[#0F3D73]"
                        : "bg-white/40 text-[#0F3D73]/90",
                    ].join(" ")}
                  >
                    {m.icon}
                    {m.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* --------------- Store toolbar: categories + SEARCH (restyled) --------------- */}
        {isStore && (
          <div className="pb-3">
            <form
              onSubmit={submitSearch}
              className="flex items-center gap-3"
              role="search"
            >
              {/* Blue circular hamburger */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    aria-label="Browse categories"
                    className="grid h-10 w-10 place-items-center rounded-full bg-[#3a5686] text-white shadow-sm ring-1 ring-black/10 hover:brightness-110"
                  >
                    <AlignJustify className="h-5 w-5" />
                  </button>
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
                      {categoryIcons[c] || <Tag className="h-4 w-4 mr-2" />} {c}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* White search pill + gold button */}
              <div className="relative flex min-h-10 flex-1 overflow-hidden rounded-full bg-white ring-1 ring-black/10">
                <div className="relative w-full">
                  <input
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    placeholder="Search for products, brands and categories..."
                    aria-label="Search products"
                    autoComplete="off"
                    onFocus={() => setShowSuggestions(suggestions.length > 0)}
                    onBlur={() =>
                      setTimeout(() => setShowSuggestions(false), 100)
                    }
                    className="h-10 w-full bg-transparent px-4 text-[15px] text-[#123] placeholder:text-[#6b7a8b] focus:outline-none"
                  />
                  {showSuggestions && (
                    <ul className="absolute left-0 right-0 z-50 mt-1 max-h-56 overflow-y-auto rounded-lg border border-gray-200 bg-white text-sm shadow-lg">
                      {suggestions.map((s, i) => (
                        <li
                          key={s + i}
                          className="cursor-pointer px-4 py-2 hover:bg-blue-50"
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

                {/* Gold search button flush right */}
                <button
                  type="submit"
                  aria-label="Search"
                  className="grid h-10 w-14 place-items-center self-end rounded-l-none bg-[#D4AF37] text-white transition hover:brightness-110"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>

              {/* Optional CTA at the far right (kept) */}
              <Link
                href="/access-loan"
                className="hidden sm:inline-flex h-10 items-center justify-center rounded-full border border-input bg-white/60 px-4 text-sm font-medium text-[#0F3D73] hover:bg-white/80"
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
      <Suspense fallback={<HeaderFallback />}>
        <HeaderCore />
      </Suspense>
    </>
  );
}

/* ------------------------ Lightweight suspense fallback ------------------------ */
function HeaderFallback() {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#d3e7f6]">
      <div className="container mx-auto px-4">
        <div className="h-16" />
      </div>
    </header>
  );
}
