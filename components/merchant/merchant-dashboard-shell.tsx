"use client"

import React from "react"

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
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Home, LayoutList, Settings, Wallet, Upload, PackageSearch, Boxes, LogOut, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const merchantNavItems = [
  { label: "Overview", href: "/dashboard/merchant/overview", icon: Home },
  { label: "Orders", href: "/dashboard/merchant/orders", icon: ShoppingBag },
  { label: "Transactions", href: "/dashboard/merchant/transactions", icon: LayoutList },
  { label: "Inventory", href: "/dashboard/merchant/inventory", icon: Boxes },
  { label: "Product Upload", href: "/dashboard/merchant/product-upload", icon: Upload },
  { label: "Wallet", href: "/dashboard/merchant/wallet", icon: Wallet },
  { label: "Track Order", href: "/dashboard/merchant/track-order", icon: PackageSearch },
  { label: "Account Settings", href: "/dashboard/merchant/account", icon: Settings },
]

export function MerchantDashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Demo merchant data since auth is removed
  const demoMerchant = {
    firstName: "Merchant",
    lastName: "Store",
    email: "merchant@kredmart.com",
    storeName: "Demo Store",
    balance: 125000,
    pendingOrders: 8,
    totalProducts: 45,
  }

  const initials =
    (demoMerchant?.firstName?.[0] ?? "") + (demoMerchant?.lastName?.[0] ?? (demoMerchant?.firstName ? "" : "M"))

  const handleLogout = () => {
    // Since auth is removed, just redirect to merchant sign-in
    window.location.href = "/admindesk"
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full">
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <div className="px-2 py-1">
              <div className="text-sm font-semibold">KredMart</div>
              <div className="text-xs text-muted-foreground">Merchant Portal</div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Merchant Dashboard</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {merchantNavItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={pathname === item.href}>
                        <Link href={item.href}>
                          {React.createElement(item.icon)}
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="px-2 pb-2">
            <div className="flex items-center gap-2 px-2 mb-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-[10px]">{initials.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium truncate">{demoMerchant.storeName}</div>
                <div className="text-xs text-muted-foreground truncate">{demoMerchant.email}</div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-1 bg-transparent text-rose-600 hover:text-rose-700 hover:bg-rose-50"
              onClick={handleLogout}
            >
              <LogOut className="h-3 w-3 mr-1" />
              Logout
            </Button>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <SidebarInset className="w-full">
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
