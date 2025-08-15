"use client"

import type * as React from "react"
import { Package, Upload, Truck, Settings, LogOut, FileText, Wallet, Bell, Home } from "lucide-react"

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
  SidebarRail,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

const merchantNavItems = [
  {
    title: "Overview",
    url: "/dashboard/merchant/overview",
    icon: Home,
  },
  {
    title: "Transactions",
    url: "/dashboard/merchant/transactions",
    icon: FileText,
  },
  {
    title: "Inventory",
    url: "/dashboard/merchant/inventory",
    icon: Package,
  },
  {
    title: "Product Upload",
    url: "/dashboard/merchant/product-upload",
    icon: Upload,
  },
  {
    title: "Wallet",
    url: "/dashboard/merchant/wallet",
    icon: Wallet,
  },
  {
    title: "Track Order",
    url: "/dashboard/merchant/track-order",
    icon: Truck,
  },
  {
    title: "Account Settings",
    url: "/dashboard/merchant/account",
    icon: Settings,
  },
]

export default function MerchantShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    router.push("/admindesk")
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Package className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">KredMart</span>
              <span className="text-xs text-muted-foreground">Merchant Portal</span>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {merchantNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                <span>Log Out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-lg font-semibold">Merchant Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Wallet */}
            <Button variant="ghost" size="sm" className="gap-2">
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline">₦25,000</span>
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs">3</Badge>
            </Button>

            {/* Profile */}
            <Button variant="ghost" size="sm" className="gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src="/placeholder.svg?height=24&width=24" />
                <AvatarFallback>MU</AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline">Merchant User</span>
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
