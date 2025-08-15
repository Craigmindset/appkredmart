"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Bell, CreditCard, Home, LayoutList, Package, Settings, Wallet, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart, cartSelectors } from "@/store/cart-store"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { BrandLogo } from "@/components/brand-logo"

const items = [
  { label: "Overview", href: "/dashboard/overview", icon: Home },
  { label: "Loan request", href: "/dashboard/loan-request", icon: CreditCard },
  { label: "My loans", href: "/dashboard/my-loans", icon: LayoutList },
  { label: "Transaction", href: "/dashboard/transactions", icon: LayoutList },
  { label: "Wallet", href: "/dashboard/wallet", icon: Wallet },
  { label: "My Order", href: "/dashboard/my-orders", icon: Package },
  { label: "Track Orders", href: "/dashboard/track-orders", icon: Bell },
  { label: "Account Settings", href: "/dashboard/account", icon: Settings },
]

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const cartCount = useCart(cartSelectors.count)

  // Demo user data since auth is removed
  const demoUser = {
    firstName: "Kred",
    lastName: "User",
    email: "user@kredmart.com",
  }

  const initials = (demoUser?.firstName?.[0] ?? "") + (demoUser?.lastName?.[0] ?? (demoUser?.firstName ? "" : "U"))

  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full bg-slate-50">
        <Sidebar collapsible="icon" className="border-r border-sidebar-border">
          <SidebarHeader className="border-b border-sidebar-border bg-sidebar">
            <div className="px-3 py-4">
              <BrandLogo size="md" variant="light" showText={true} />
            </div>
          </SidebarHeader>
          <SidebarContent className="bg-sidebar">
            <SidebarGroup>
              <SidebarGroupLabel className="text-sidebar-foreground/70 font-medium">Dashboard</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((i) => (
                    <SidebarMenuItem key={i.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === i.href}
                        className="data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground hover:bg-sidebar-accent/50"
                      >
                        <Link href={i.href}>
                          <i.icon className="h-4 w-4" />
                          <span>{i.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t border-sidebar-border bg-sidebar px-3 pb-3">
            <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-sidebar-accent/30">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs bg-sidebar-primary text-sidebar-primary-foreground">
                  {initials.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-sidebar-foreground truncate">
                  {demoUser.firstName} {demoUser.lastName}
                </div>
                <div className="text-xs text-sidebar-foreground/60 truncate">{demoUser.email}</div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 bg-transparent border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent"
            >
              Logout
            </Button>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <SidebarInset className="w-full bg-slate-50">
          {/* Dashboard header with dark blue theme */}
          <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/75">
            <div className="w-full px-4 md:px-6 h-16 grid grid-cols-3 items-center">
              {/* Left: Sidebar trigger and brand */}
              <div className="flex items-center gap-3">
                <SidebarTrigger className="text-slate-600 hover:text-slate-900" />
                <Link href="/" className="flex items-center gap-2">
                  <BrandLogo size="sm" variant="gradient" showText={true} />
                </Link>
              </div>

              {/* Center: Navigation */}
              <nav className="hidden md:flex items-center justify-center gap-6">
                <Link
                  href="/"
                  className={`text-sm font-medium transition-colors ${
                    pathname === "/" ? "text-blue-600" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Home
                </Link>
                <Link
                  href="/store"
                  className={`text-sm font-medium transition-colors ${
                    pathname.startsWith("/store") ? "text-blue-600" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Store
                </Link>
              </nav>

              {/* Right: User actions */}
              <div className="flex items-center justify-end gap-2 md:gap-3">
                <Link href="/dashboard/account" aria-label="User profile" className="inline-flex">
                  <Avatar className="h-8 w-8 border-2 border-blue-100">
                    <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                      {initials.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Link>

                <Link
                  href="/cart"
                  aria-label="Cart"
                  className="relative inline-flex p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <ShoppingCart className="h-5 w-5 text-slate-600" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-1 text-xs font-medium text-white">
                      {cartCount}
                    </span>
                  )}
                </Link>

                <Link
                  href="/dashboard/track-orders"
                  aria-label="Notifications"
                  className="inline-flex p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <Bell className="h-5 w-5 text-slate-600" />
                </Link>

                <Link
                  href="/dashboard/wallet"
                  aria-label="Wallet"
                  className="inline-flex p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <Wallet className="h-5 w-5 text-slate-600" />
                </Link>
              </div>
            </div>
          </header>

          <div className="px-4 md:px-6 py-6">{children}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
