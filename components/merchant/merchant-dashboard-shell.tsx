"use client";

import React from "react";
import { demoMerchant } from "@/lib/merchant-demo";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LogOut,
  Wallet,
  ShoppingBag,
  LayoutList,
  Boxes,
  Upload,
  PackageSearch,
  Settings,
  Home,
} from "lucide-react";

const merchantNavItems = [
  { label: "Overview", href: "/admindesk/dashboard/overview", icon: Home },
  { label: "Orders", href: "/admindesk/dashboard/orders", icon: ShoppingBag },
  {
    label: "Transactions",
    href: "/admindesk/dashboard/transactions",
    icon: LayoutList,
  },
  { label: "Inventory", href: "/admindesk/dashboard/inventory", icon: Boxes },
  {
    label: "Product Upload",
    href: "/admindesk/dashboard/product-upload",
    icon: Upload,
  },
  { label: "Wallet", href: "/admindesk/dashboard/wallet", icon: Wallet },
  {
    label: "Track Order",
    href: "/admindesk/dashboard/track-order",
    icon: PackageSearch,
  },
  {
    label: "Account Settings",
    href: "/admindesk/dashboard/account",
    icon: Settings,
  },
];

export function MerchantDashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();


  const initials =
    (demoMerchant?.firstName?.[0] ?? "") +
    (demoMerchant?.lastName?.[0] ?? (demoMerchant?.firstName ? "" : "M"));

  const handleLogout = () => {
    // Since auth is removed, just redirect to merchant sign-in
    window.location.href = "/admindesk";
  };

  return (
    <SidebarProvider>
      <Sidebar className="border-r border-gray-200 bg-blue-900">
        <SidebarHeader className="border-b border-blue-700 bg-blue-900">
          <div className="flex items-center gap-3 px-3 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Settings className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white">KredMart</span>
              <span className="text-xs text-blue-300">Merchant Portal</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent className="bg-blue-900 overflow-y-auto scrollbar-hide">
          <SidebarGroup>
            <SidebarGroupLabel className="text-blue-300 text-xs font-semibold uppercase tracking-wider px-3 py-2">
              Merchant Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1 px-2">
                {merchantNavItems.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      className="w-full justify-start px-3 py-2.5 text-blue-200 hover:bg-blue-800 hover:text-white data-[active=true]:bg-blue-600 data-[active=true]:text-white rounded-lg transition-all duration-200"
                    >
                      <Link
                        href={item.href}
                        className="flex items-center gap-3"
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t border-blue-700 bg-blue-900 p-4">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-blue-600 text-white text-sm">
                {initials.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {demoMerchant.storeName}
              </p>
              <p className="text-xs text-blue-300 truncate">
                {demoMerchant.email}
              </p>
            </div>
          </div>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleLogout}
                className="w-full justify-start px-3 py-2 text-blue-200 hover:bg-blue-800 hover:text-white rounded-lg transition-colors duration-200"
              >
                <LogOut className="h-4 w-4 mr-3" />
                <span>Log Out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex-1 bg-gray-50">
        {/* Sticky Header */}
  <header className="sticky top-0 z-50 w-full border-b border-blue-700 bg-blue-700/95 backdrop-blur supports-[backdrop-filter]:bg-blue-700/90">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="h-8 w-8 p-0 hover:bg-blue-800 rounded-md transition-colors" />
              <Separator orientation="vertical" className="h-6 bg-blue-300" />
              <div>
                <h1 className="text-xl font-bold text-white">
                  Merchant Dashboard
                </h1>
                <p className="text-sm text-blue-200">
                  Welcome, {demoMerchant.firstName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Home and Store Links */}
              <Link
                href="/"
                className="text-white hover:text-blue-200 text-sm font-medium px-2 py-1 rounded hover:bg-blue-800 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/store"
                className="text-white hover:text-blue-200 text-sm font-medium px-2 py-1 rounded hover:bg-blue-800 transition-colors"
              >
                Store
              </Link>
              {/* Wallet */}
              <Link
                href="/admindesk/dashboard/wallet"
                className="flex items-center gap-2 text-white hover:text-blue-200 text-sm font-medium px-2 py-1 rounded hover:bg-blue-800 transition-colors"
                prefetch={false}
              >
                <Wallet className="h-4 w-4 text-green-300" />
                <span className="hidden sm:inline text-sm font-medium text-white">
                  ₦{demoMerchant.balance.toLocaleString()}
                </span>
              </Link>
              {/* Profile */}
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 hover:bg-blue-800"
              >
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-blue-600 text-white text-xs">
                    {initials.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-sm font-medium text-white">
                  {demoMerchant.firstName}
                </span>
              </Button>
              {/* Logout */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="hover:bg-blue-800"
              >
                <LogOut className="h-4 w-4 text-blue-200" />
              </Button>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-auto">
            <div className="animate-in slide-in-from-right-5 duration-300 ease-out">
              <div className="p-6">{children}</div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
