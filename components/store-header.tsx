"use client";
import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/lib/services/user/user";
import { useCart, cartSelectors } from "@/store/cart-store";
import { Skeleton } from "@/components/ui/skeleton";

import {
  ShoppingCart,
  Search,
  HelpCircle,
  AlignJustify,
  User,
  Smartphone,
  Laptop,
  Tv,
  Zap,
  Plug,
  Utensils,
  Heart,
  Watch,
  Star,
  Home as HomeIcon,
  CreditCard,
  Store as StoreIcon,
  Tag,
  Info,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { allCategories } from "@/lib/products";
import { slugifyCategory } from "@/lib/categories";

/* --------------------------------- Mappings --------------------------------- */
const categoryIcons: Record<string, ReactNode> = {
  "Phones and Tablets": <Smartphone className="h-4 w-4 mr-2" />,
  Computing: <Laptop className="h-4 w-4 mr-2" />,
  Electronics: <Tv className="h-4 w-4 mr-2" />,
  Generators: <Zap className="h-4 w-4 mr-2" />,
  Accessories: <Plug className="h-4 w-4 mr-2" />,
  "Home & Kitchen": <Utensils className="h-4 w-4 mr-2" />,
  Lifestyle: <Heart className="h-4 w-4 mr-2" />,
  Watches: <Watch className="h-4 w-4 mr-2" />,
  "Premium Devices": <Star className="h-4 w-4 mr-2" />,
};

type Props = {
  onOpenCategories?: () => void; // optional: if you have a sheet/drawer to open
};

export default function StoreHeader({ onOpenCategories }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const { user, loading } = useUser();
  const itemCount = useCart(cartSelectors.count);

  /* ------------------------------ Search state ------------------------------ */
  const [term, setTerm] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const productNames = [
    "iPhone 15 Pro Max",
    "Samsung Galaxy S24 Ultra",
    "HP Pavilion Laptop",
    "Sony Bravia TV",
    "Infinix Hot 40",
    "Tecno Camon 20",
    "Apple Watch Series 9",
    "JBL Bluetooth Speaker",
    "Dell XPS 13",
    "Oraimo Power Bank",
    "Hisense Refrigerator",
    "Nike Sneakers",
    "Adidas Backpack",
    "Canon EOS Camera",
    "PlayStation 5 Console",
  ];

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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(term ? `/store?search=${encodeURIComponent(term)}` : "/store");
    setShowSuggestions(false);
    setTimeout(() => {
      const el = document.getElementById("results");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 500);
  };

  const openCategories = () => onOpenCategories?.();

  /* ------------------------------- Main menu ------------------------------- */
  const MAIN_MENU = [
    { href: "/", label: "Home", icon: <HomeIcon className="h-4 w-4" /> },
    {
      href: "/access-loan",
      label: "Access Loan",
      icon: <CreditCard className="h-4 w-4" />,
    },
    { href: "/store", label: "Store", icon: <StoreIcon className="h-4 w-4" /> },
    {
      href: "/deals",
      label: "Kredmart deals",
      icon: <Tag className="h-4 w-4" />,
    },
    { href: "/about", label: "About", icon: <Info className="h-4 w-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0F3D73] text-white shadow">
      <div className="container mx-auto px-4">
        {/* ---------------------- Desktop-only GIF Bar (cover) ---------------------- */}
        <div className="hidden md:block">
          <div
            aria-label="Promotional ad"
            className="relative block mb-2 rounded-md border border-white/20 overflow-hidden"
          >
            {/* ↓ Reduce height as needed: h-14 lg:h-16 (you can change to h-12/h-14/h-16) */}
            <div
              className="relative h-14 lg:h-16 cursor-pointer"
              onClick={() => {
                if (!user) {
                  router.push("/sign-in");
                } else {
                  router.push(
                    user.role === "admin"
                      ? "/admin/dashboard/overview"
                      : user.role === "merchant"
                      ? "/admindesk/dashboard/overview"
                      : "/dashboard"
                  );
                }
              }}
              tabIndex={0}
              role="button"
              aria-label="Go to dashboard or sign in"
            >
              <img
                src="/kredmart-wallet.gif" // place the file in /public
                alt="KredMart promo"
                className="absolute inset-0 h-full w-full object-cover"
                loading="eager"
              />
            </div>
          </div>
        </div>

        {/* ---------------------- Top row: brand + actions ---------------------- */}
        <div className="flex h-14 md:h-16 items-center gap-3">
          {/* Brand */}
          <Link href="/store" className="shrink-0 flex items-center gap-2">
            <img
              src="/Kredmart Logo-02.png"
              alt="KredMart Logo"
              className="h-6 md:h-6 w-auto object-contain"
            />
          </Link>

          {/* Mobile actions (top-right): Login + Cart (smaller) */}
          <div className="md:hidden ml-auto flex items-center gap-2">
            {loading ? (
              <Skeleton className="h-9 w-9 rounded-full" />
            ) : !user ? (
              <button
                aria-label="Login"
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 focus:outline-none"
                onClick={() => router.push("/sign-in")}
              >
                <User className="h-4 w-4" />
              </button>
            ) : (
              <button
                aria-label="Profile"
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 focus:outline-none"
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
              </button>
            )}

            <Link
              href="/cart"
              aria-label="My Cart"
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 focus:outline-none"
            >
              <ShoppingCart className="h-4 w-4" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 grid h-4 min-w-[1rem] place-items-center rounded-sm bg-white px-1 text-[10px] font-bold text-black leading-none">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Desktop: categories dropdown + search pill */}
          <form
            onSubmit={onSubmit}
            className="hidden md:flex flex-1 items-center justify-center"
            role="search"
          >
            <div className="flex w-full max-w-3xl items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    aria-label="Browse categories"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 focus:outline-none"
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
                      {categoryIcons[c] || <Star className="h-4 w-4 mr-2" />}{" "}
                      {c}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="flex flex-1 overflow-hidden rounded-full ring-1 ring-black/10 bg-white">
                <div className="relative w-full">
                  <input
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    placeholder="Search for products, brands and categories..."
                    aria-label="Search products"
                    className="flex-1 h-9 px-3 min-w-[220px] md:min-w-[320px] lg:min-w-[400px] bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none text-sm"
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
                <button
                  type="submit"
                  aria-label="Search"
                  className="h-9 px-3 bg-yellow-500 hover:bg-yellow-600 text-white text-sm"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>
          </form>

          {/* Desktop right actions */}
          <div className="ml-auto hidden md:flex items-center gap-6">
            <button className="inline-flex items-center gap-1 text-xs text-white/90 hover:text-white">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
                <HelpCircle className="h-4 w-4" />
              </span>
              <span className="font-normal">Help</span>
              <span className="text-white/80 text-xs">✓</span>
            </button>

            {loading ? (
              <Skeleton className="h-7 w-16 rounded" />
            ) : !user ? (
              <Link href="/sign-in" className="hover:underline text-xs">
                Login / Signup
              </Link>
            ) : (
              <button
                className="inline-flex items-center gap-1 text-xs text-white/90 hover:text-white"
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
                <span className="font-normal">Profile</span>
              </button>
            )}

            <Link
              href="/cart"
              aria-label="My Cart"
              className="inline-flex items-center gap-1 rounded bg-green-600 px-2 py-1 hover:bg-green-700 focus:outline-none text-xs"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="font-normal">My Cart</span>
              {itemCount > 0 && (
                <span className="ml-1 grid h-4 min-w-[1rem] place-items-center rounded-sm bg-white px-1 text-[10px] font-bold text-black leading-none">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* ----------------- Mobile: categories + search (single pill) ----------------- */}
        <form onSubmit={onSubmit} className="md:hidden pb-2" role="search">
          <div className="flex w-full overflow-hidden rounded-full bg-white ring-1 ring-black/10 shadow items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Browse categories"
                  className="ml-2 grid h-10 w-10 place-items-center text-blue-700 hover:bg-black/5 active:scale-[.98] transition rounded-full"
                >
                  <AlignJustify className="h-5 w-5" strokeWidth={1.9} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>All Categories</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {allCategories.map((c) => (
                  <DropdownMenuItem
                    key={c}
                    onClick={() => router.push(`/store/${slugifyCategory(c)}`)}
                    className="cursor-pointer flex items-center"
                  >
                    {categoryIcons[c] || <Star className="h-4 w-4 mr-2" />} {c}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="relative w-full">
              <input
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Search for products, brands and categories..."
                aria-label="Search products"
                className="flex-1 h-10 px-3 bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none"
                autoComplete="off"
                onFocus={() => setShowSuggestions(suggestions.length > 0)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
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

            <button
              type="submit"
              aria-label="Search"
              className="h-10 px-4 bg-yellow-500 hover:bg-yellow-600 text-white transition"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </form>

        {/* ------------------------- Centered main menu ------------------------- */}
        <nav className="hidden md:flex justify-center py-2">
          <ul className="flex items-center gap-4">
            {MAIN_MENU.map((m) => (
              <li key={m.href}>
                <Link
                  href={m.href}
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-md transition text-sm ${
                    pathname === m.href
                      ? "bg-white/15 ring-1 ring-white/25"
                      : "hover:bg-white/10"
                  }`}
                >
                  {m.icon}
                  <span className="font-normal">{m.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile: horizontal scroll menu */}
        <nav className="md:hidden pb-3">
          <ul className="flex items-center gap-3 overflow-x-auto whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {MAIN_MENU.map((m) => (
              <li key={m.href} className="shrink-0">
                <Link
                  href={m.href}
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-[13px] transition ${
                    pathname === m.href
                      ? "bg-white/15 ring-1 ring-white/25"
                      : "bg-white/10 hover:bg-white/15"
                  }`}
                >
                  {m.icon}
                  {m.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
