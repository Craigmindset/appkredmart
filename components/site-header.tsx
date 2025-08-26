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
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Skeleton } from "./ui/skeleton";

/* ---------------------------- Top bar only (static) ---------------------------- */

function TopBar() {
  return (
    <div className="w-full bg-blue-900 text-white text-xs py-1 flex items-center justify-end gap-4 pr-4">
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
          <span className="text-xs font-medium">{selected.label}</span>
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
  };

  const MENU = [
    { href: "/", label: "Home" },
    { href: "/access-loan", label: "Access Loan" },
    { href: "/store", label: "Store" },
    { href: "/deals", label: "Kredmart deals" },
    { href: "/about", label: "About" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b bg-blue-800 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75 ${appFontClass}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Mobile menu + Site name */}
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>KredMart</SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-2">
                  <nav className="flex flex-col">
                    <Link
                      href="/"
                      className="flex items-center gap-3 rounded px-2 py-3 text-sm hover:bg-muted"
                    >
                      <Home className="h-4 w-4" /> Home
                    </Link>
                    <Link
                      href="/access-loan"
                      className="flex items-center gap-3 rounded px-2 py-3 text-sm hover:bg-muted"
                    >
                      <CreditCard className="h-4 w-4" /> Access Loan
                    </Link>
                    <Link
                      href="/store"
                      className="flex items-center gap-3 rounded px-2 py-3 text-sm hover:bg-muted"
                    >
                      <Store className="h-4 w-4" /> Store
                    </Link>
                    <Link
                      href="/deals"
                      className="flex items-center gap-3 rounded px-2 py-3 text-sm hover:bg-muted"
                    >
                      <Tag className="h-4 w-4" /> Kredmart deals
                    </Link>
                    <Link
                      href="/about"
                      className="flex items-center gap-3 rounded px-2 py-3 text-sm hover:bg-muted"
                    >
                      <Info className="h-4 w-4" /> About
                    </Link>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>

            <Link href="/" className="text-xl font-semibold tracking-tight">
              KredMart
            </Link>
          </div>

          {/* Center: Menu (desktop) */}
          <nav className="hidden md:flex items-center justify-center gap-5">
            {MENU.map((m) => (
              <Link
                key={m.href}
                href={m.href}
                className={`text-sm transition-colors ${
                  pathname === m.href
                    ? "font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m.label}
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
              className="relative"
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
                  className="hidden md:inline text-sm hover:underline"
                >
                  Login
                </Link>
                <Link
                  href="/sign-up"
                  className="hidden md:inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-sm"
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
          <div className="border-t py-2">
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
                  <DropdownMenuContent
                    align="start"
                    className="w-64 max-h-80 overflow-auto"
                  >
                    <DropdownMenuLabel>All Categories</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {allCategories.map((c) => (
                      <DropdownMenuItem
                        key={c}
                        onClick={() =>
                          router.push(`/store/${slugifyCategory(c)}`)
                        }
                        className="cursor-pointer"
                      >
                        {c}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Search */}
                <div className="flex-1 flex items-center gap-2">
                  <Input
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    placeholder="Search products, brands, categories"
                    className="w-full min-w-[280px] sm:min-w-[400px] md:min-w-[500px]"
                    aria-label="Search products"
                  />
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
