"use client";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/lib/services/user/user";
import { useCart, cartSelectors } from "@/store/cart-store";
import { Skeleton } from "@/components/ui/skeleton";

import {
  ShoppingCart,
  Search,
  AlignJustify,
  User,
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

/* ----------------------------- Helpers / Icons ----------------------------- */
const NigeriaFlag = () => (
  <span
    aria-label="Nigeria"
    className="inline-flex h-5 w-5 overflow-hidden rounded-full ring-1 ring-black/5"
    role="img"
  >
    {/* Simple CSS flag */}
    <span className="h-full w-1/3 bg-[#1A8F5C]" />
    <span className="h-full w-1/3 bg-white" />
    <span className="h-full w-1/3 bg-[#1A8F5C]" />
  </span>
);

type Props = {
  onOpenCategories?: () => void;
};

export default function StoreHeader({ onOpenCategories }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useUser();
  const itemCount = useCart(cartSelectors.count);

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
    const filtered = productNames.filter((n) =>
      n.toLowerCase().includes(term.toLowerCase())
    );
    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  }, [term]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(term ? `/store?search=${encodeURIComponent(term)}` : "/store");
    setShowSuggestions(false);
    setTimeout(() => {
      document
        .getElementById("results")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

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
    <header className="sticky top-0 z-50 bg-[#0F3D73] text-[#122642]">
      <div className="mx-auto w-full max-w-7xl px-4">
        {/* --------------------------- Row 1: Top bar --------------------------- */}
        <div className="flex h-14 items-center gap-4">
          {/* Logo */}
          <Link href="/store" className="flex shrink-0 items-center gap-2">
            <img
              src="/Kredmart Logo-01.png"
              alt="kredmart"
              className="h-6 w-auto object-contain"
            />
          </Link>

          {/* Center menu (desktop) */}
          <nav className="hidden md:block flex-1">
            <ul className="mx-auto flex w-max items-center gap-2 rounded-2xl bg-white/30 px-2 py-1 ring-1 ring-black/5 backdrop-blur-sm">
              {MAIN_MENU.map((m) => {
                const active = pathname === m.href;
                return (
                  <li key={m.href}>
                    <Link
                      href={m.href}
                      className={[
                        "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition",
                        active
                          ? "bg-[#122642] text-white shadow-sm"
                          : m.href === "/"
                          ? "bg-white/70 text-[#122642]"
                          : "hover:bg-white/60 text-[#122642]/90",
                      ].join(" ")}
                    >
                      {m.icon}
                      <span>{m.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right: country, cart, user */}
          <div className="ml-auto flex items-center gap-4">
            <button
              type="button"
              className="hidden items-center gap-2 rounded-full px-3 py-1.5 text-sm hover:bg-white/50 md:inline-flex"
            >
              <NigeriaFlag />
              <span>Nigeria</span>
            </button>

            <Link
              href="/cart"
              aria-label="Cart"
              className="relative grid h-6 w-6 place-items-center text-[#122642] hover:opacity-80"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 grid h-4 min-w-[1rem] place-items-center rounded bg-[#122642] px-1 text-[10px] font-semibold text-white">
                  {itemCount}
                </span>
              )}
            </Link>

            {loading ? (
              <Skeleton className="h-6 w-6 rounded-full" />
            ) : !user ? (
              <button
                aria-label="Account"
                onClick={() => router.push("/sign-in")}
                className="grid h-6 w-6 place-items-center rounded-full text-[#122642] hover:opacity-80"
              >
                <User className="h-5 w-5" />
              </button>
            ) : (
              <button
                aria-label="Account"
                onClick={() =>
                  router.push(
                    user.role === "admin"
                      ? "/admin/dashboard/overview"
                      : user.role === "merchant"
                      ? "/admindesk/dashboard/overview"
                      : "/dashboard"
                  )
                }
                className="grid h-6 w-6 place-items-center rounded-full text-[#122642] hover:opacity-80"
              >
                <User className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* ------------------------- Row 2: Search row ------------------------- */}
        <form
          onSubmit={submitSearch}
          role="search"
          className="mb-2 flex items-center gap-3 pb-2 md:pb-3"
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
                  onClick={() => router.push(`/store/${slugifyCategory(c)}`)}
                  className="cursor-pointer"
                >
                  {c}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Search pill with gold button at the right */}
          <div className="relative flex min-h-10 flex-1 overflow-hidden rounded-full bg-white ring-1 ring-black/10">
            <div className="relative w-full">
              <input
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Search for products, brands and categories..."
                aria-label="Search"
                autoComplete="off"
                onFocus={() => setShowSuggestions(suggestions.length > 0)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
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

            {/* Gold search button flush to the right */}
            <button
              type="submit"
              aria-label="Search"
              className="grid h-10 w-14 place-items-center self-end rounded-l-none bg-[#D4AF37] text-white transition hover:brightness-110"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </form>

        {/* ---------------------------- Mobile menu ---------------------------- */}
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
                        ? "bg-[#122642] text-white"
                        : m.href === "/access-loan"
                        ? "bg-white/70 text-[#122642]"
                        : "bg-white/40 text-[#122642]/90",
                    ].join(" ")}
                  >
                    {m.icon}
                    {m.label}
                  </Link>
                </li>
              );
            })}
            <span className="ml-auto inline-flex items-center gap-2 rounded-full px-3 py-2 text-[13px] text-[#122642]">
              <NigeriaFlag />
              Nigeria
            </span>
          </ul>
        </nav>
      </div>
    </header>
  );
}
