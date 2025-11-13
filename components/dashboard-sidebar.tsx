"use client";

import React from "react";
import { useSidebar } from "@/components/ui/sidebar";
import Link from "next/link";
import { redirect, usePathname, useRouter } from "next/navigation";
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
} from "@/components/ui/sidebar";
import {
  Bell,
  CreditCard,
  Home,
  LayoutList,
  Package,
  Settings,
  Wallet,
  ShoppingCart,
  Loader2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/lib/services/user/user";
import { useCart, cartSelectors } from "@/store/cart-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BrandLogo } from "@/components/brand-logo";
import { useLogout } from "@/lib/services/auth/use-logout";
import { useUnreadCount } from "@/lib/services/notifications/use-notification";

const items = [
  { label: "Overview", href: "/dashboard/overview", icon: Home },
  { label: "Loan request", href: "/dashboard/loan-request", icon: CreditCard },
  { label: "My loans", href: "/dashboard/my-loans", icon: LayoutList },
  { label: "Transaction", href: "/dashboard/transactions", icon: LayoutList },
  { label: "Wallet", href: "/dashboard/wallet", icon: Wallet },
  { label: "My Order", href: "/dashboard/my-orders", icon: Package },
  { label: "Track Orders", href: "/dashboard/track-orders", icon: Bell },
  { label: "Account Settings", href: "/dashboard/account", icon: Settings },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const cartCount = useCart(cartSelectors.count);
  const { user, loading } = useUser();
  const router = useRouter();
  const { mutateAsync, isPending } = useLogout();
  const { isMobile, setOpenMobile } = useSidebar();

  const firstName = user?.firstname || "Kred";
  const lastName = user?.lastname || "User";
  const email = user?.email || "user@kredmart.com";
  const initials =
    (firstName?.[0] ?? "") + (lastName?.[0] ?? (firstName ? "" : "U"));

  if (loading) return <Loader2 className="animate-spin" />;

  if (!user || user.role !== "user") {
    redirect("/sign-in");
  }

  const { data: unreadCount } = useUnreadCount();

  const handleLogout = async () => {
    await mutateAsync().then(() => {
      localStorage.removeItem("token");
      router.push("/");
    });
  };

  return (
    <div className="flex min-h-svh w-full bg-slate-50">
      <Sidebar collapsible="icon" className="border-r border-sidebar-border">
        <SidebarHeader className="border-b border-sidebar-border bg-sidebar">
          <div className="px-3 py-4 flex items-center justify-between">
            <img
              src="/Kredmart Logo-02.png"
              alt="KredMart Logo"
              className="h-6 md:h-8 w-auto object-contain"
            />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-8 w-8"
              onClick={() => setOpenMobile(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </SidebarHeader>

        <SidebarContent className="bg-sidebar">
          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground/70 font-medium">
              Dashboard
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenu className="space-y-2 md:space-y-0">
                  {items.map((i) => (
                    <SidebarMenuItem key={i.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === i.href}
                        className="text-base md:text-sm data-[active=true]:bg-blue-600 data-[active=true]:text-white hover:bg-blue-500 hover:text-white"
                        onClick={() => {
                          if (isMobile) setOpenMobile(false);
                        }}
                      >
                        <Link href={i.href}>
                          <i.icon className="h-4 w-4" />
                          <span>{i.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border bg-sidebar px-3 pb-3">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-sidebar-accent/30">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.picture} />
              <AvatarFallback className="text-xs bg-sidebar-primary text-sidebar-primary-foreground">
                {initials.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-sidebar-foreground truncate">
                {firstName} {lastName}
              </div>
              <div className="text-xs text-sidebar-foreground/60 truncate">
                {email}
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 bg-transparent border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={handleLogout}
            disabled={isPending}
          >
            Logout
          </Button>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset className="w-full bg-slate-50">
        {/* Sticky header */}
        <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/75">
          {/* ---------- Mobile header: brand left, actions right ---------- */}
          <div className="md:hidden flex h-14 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="text-slate-600 hover:text-slate-900" />
              <Link href="/" className="flex items-center gap-2">
                <img
                  src="/Kredmart Logo-01.png"
                  alt="KredMart"
                  className="h-6 w-auto"
                />
              </Link>
            </div>

            <div className="flex items-center gap-1.5">
              <Link
                href="/cart"
                aria-label="Cart"
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-slate-100 transition"
              >
                <ShoppingCart className="h-5 w-5 text-slate-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-1 text-xs font-medium text-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button
                type="button"
                aria-label="Notifications"
                onClick={() => router.push("/dashboard/notification")}
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-slate-100 transition"
              >
                <Bell className="h-5 w-5 text-slate-700" />

                {!!unreadCount && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-1 text-xs font-medium text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              <Link
                href="/dashboard/wallet"
                aria-label="Wallet"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-slate-100 transition"
              >
                <Wallet className="h-5 w-5 text-slate-700" />
              </Link>

              <Link
                href="/dashboard/account"
                aria-label="User profile"
                className="inline-flex h-9 w-9 items-center justify-center"
              >
                <Avatar className="h-9 w-9 ring-2 ring-blue-100">
                  <AvatarImage src={user?.picture} alt="Profile" />
                  <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                    {initials.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </div>
          </div>

          {/* ---------- Desktop header: brand | centered nav | actions ---------- */}
          <div className="hidden md:grid w-full h-16 grid-cols-[auto_1fr_auto] items-center px-6">
            {/* Left: Sidebar trigger + brand */}
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-slate-600 hover:text-slate-900" />
              <Link href="/" className="flex items-center gap-2">
                <img
                  src="/Kredmart Logo-01.png"
                  alt="KredMart"
                  className="h-8 w-auto"
                />
              </Link>
            </div>

            {/* Center nav */}
            <nav className="flex items-center justify-center gap-6">
              <Link
                href="/"
                className={`text-sm font-medium transition-colors ${
                  pathname === "/"
                    ? "text-blue-600"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Home
              </Link>
              <Link
                href="/store"
                className={`text-sm font-medium transition-colors ${
                  pathname.startsWith("/store")
                    ? "text-blue-600"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Store
              </Link>
            </nav>

            {/* Right actions */}
            <div className="flex items-center justify-end gap-2">
              <Link
                href="/dashboard/account"
                aria-label="User profile"
                className="inline-flex"
              >
                <Avatar className="h-8 w-8 border-2 border-blue-100">
                  <AvatarImage src={user?.picture} />
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

              <button
                aria-label="Notifications"
                className="relative inline-flex p-2 rounded-lg hover:bg-slate-100 transition-colors"
                onClick={() => router.push("/dashboard/notification")}
                type="button"
              >
                <Bell className="h-5 w-5 text-slate-600" />

                {!!unreadCount && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-1 text-xs font-medium text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

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
  );
}
