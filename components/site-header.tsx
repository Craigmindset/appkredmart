"use client"

import type React from "react"

import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { AlignJustify, Menu, ShoppingCart, Home, CreditCard, Store, Tag, Info, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useCart, cartSelectors } from "@/store/cart-store"
import { appFontClass } from "@/lib/fonts"
import { useEffect, useMemo, useState } from "react"
import { allCategories } from "@/lib/products"
import { slugifyCategory } from "@/lib/categories"

const MENU = [
  { href: "/", label: "Home" },
  { href: "/access-loan", label: "Access Loan" },
  { href: "/store", label: "Store" },
  { href: "/deals", label: "Kredmart deals" },
  { href: "/about", label: "About" },
]

type Country = { code: "NGN" | "GHA" | "GB"; label: string; flag: string }
const COUNTRIES: Country[] = [
  { code: "NGN", label: "Nigeria", flag: "🇳🇬" },
  { code: "GHA", label: "Ghana", flag: "🇬🇭" },
  { code: "GB", label: "United Kingdom", flag: "🇬🇧" },
]

function CountrySelector() {
  const [selected, setSelected] = useState<Country>(COUNTRIES[0])

  useEffect(() => {
    try {
      const saved = localStorage.getItem("kredmart-country")
      if (saved) {
        const found = COUNTRIES.find((c) => c.code === saved)
        if (found) setSelected(found)
      } else {
        localStorage.setItem("kredmart-country", COUNTRIES[0].code)
      }
    } catch {}
  }, [])

  const onSelect = (c: Country) => {
    setSelected(c)
    try {
      localStorage.setItem("kredmart-country", c.code)
    } catch {}
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-2">
          <span
            aria-hidden="true"
            className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs"
            title={selected.label}
          >
            {selected.flag}
          </span>
          <span className="text-xs font-medium">{selected.code}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {COUNTRIES.map((c) => (
          <DropdownMenuItem key={c.code} onClick={() => onSelect(c)}>
            <span
              aria-hidden="true"
              className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[11px]"
            >
              {c.flag}
            </span>
            <span className="text-sm">{c.label}</span>
            <span className="ml-auto text-xs text-muted-foreground">{c.code}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function SiteHeader() {
  const pathname = usePathname()
  const isStore = useMemo(() => pathname?.startsWith("/store"), [pathname])
  const storeSegment = useMemo(() => {
    if (!pathname) return null
    const parts = pathname.split("/").filter(Boolean)
    if (parts[0] === "store" && parts[1]) return parts[1]
    return null
  }, [pathname])
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQ = (searchParams?.get("search") ?? "").toString()
  const [term, setTerm] = useState(initialQ)
  const itemCount = useCart(cartSelectors.count)

  const submitSearch = (e?: React.FormEvent) => {
    e?.preventDefault()
    const q = term.trim()
    if (storeSegment) {
      const url = q ? `/store/${storeSegment}?search=${encodeURIComponent(q)}` : `/store/${storeSegment}`
      router.push(url)
    } else {
      const url = q ? `/store?search=${encodeURIComponent(q)}` : "/store"
      router.push(url)
    }
  }

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
                    <Link href="/" className="flex items-center gap-3 rounded px-2 py-3 text-sm hover:bg-muted">
                      <Home className="h-4 w-4" />
                      Home
                    </Link>
                    <Link
                      href="/access-loan"
                      className="flex items-center gap-3 rounded px-2 py-3 text-sm hover:bg-muted"
                    >
                      <CreditCard className="h-4 w-4" />
                      Access Loan
                    </Link>
                    <Link href="/store" className="flex items-center gap-3 rounded px-2 py-3 text-sm hover:bg-muted">
                      <Store className="h-4 w-4" />
                      Store
                    </Link>
                    <Link href="/deals" className="flex items-center gap-3 rounded px-2 py-3 text-sm hover:bg-muted">
                      <Tag className="h-4 w-4" />
                      Kredmart deals
                    </Link>
                    <Link href="/about" className="flex items-center gap-3 rounded px-2 py-3 text-sm hover:bg-muted">
                      <Info className="h-4 w-4" />
                      About
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
                  pathname === m.href ? "font-medium" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m.label}
              </Link>
            ))}
          </nav>

          {/* Right: Country dropdown, Cart, Auth */}
          <div className="flex items-center justify-end gap-2">
            {/* Mobile icons - Country, Login, User Profile */}
            <div className="flex items-center gap-1 md:hidden">
              <CountrySelector />

              {/* Login icon for mobile - only show when not logged in */}
              <Button variant="ghost" size="icon" onClick={() => router.push("/sign-in")}>
                <Lock className="h-4 w-4" />
                <span className="sr-only">Login</span>
              </Button>

              {/* User profile icon for mobile - only show when logged in */}
              {/* TODO: Add condition to check if user is logged in */}
              {/* <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
                <User className="h-4 w-4" />
                <span className="sr-only">Profile</span>
              </Button> */}
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
            <Link href="/sign-in" className="hidden md:inline text-sm hover:underline">
              Login
            </Link>
            <Link
              href="/sign-up"
              className="hidden md:inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-sm"
            >
              Sign Up
            </Link>
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
                {/* Align-justify categories dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" aria-label="Browse categories">
                      <AlignJustify className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64 max-h-80 overflow-auto">
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

                {/* Search */}
                <div className="flex-1 flex items-center gap-2">
                  <Input
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    placeholder="Search products, brands, categories"
                    className="w-full min-w-[400px] sm:min-w-[500px] md:min-w-[600px]"
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
  )
}
