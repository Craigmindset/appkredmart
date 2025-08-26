"use client";

import type * as React from "react";
import {
  BarChart3,
  Users,
  Store,
  Package,
  Upload,
  FileText,
  ShoppingCart,
  Truck,
  Settings,
  User,
  LogOut,
  Wallet,
  Radio,
  DollarSign,
  HeadphonesIcon,
  Loader2,
} from "lucide-react";

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useWallet } from "@/store/wallet-store";
import { redirect, usePathname, useRouter } from "next/navigation";
import { useAdminRBACStore, type Permission } from "@/store/admin-rbac-store";
import { useUser } from "@/lib/services/user/user";
import { useLogout } from "@/lib/services/auth/use-logout";

interface AdminNavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  permissions: Permission[];
}

const adminNavItems: AdminNavItem[] = [
  {
    title: "Overview",
    url: "/admin/dashboard/overview",
    icon: BarChart3,
    permissions: ["view_overview"],
  },
  {
    title: "Merchant",
    url: "/admin/dashboard/merchant",
    icon: Store,
    permissions: ["manage_merchants"],
  },
  {
    title: "Users",
    url: "/admin/dashboard/users",
    icon: Users,
    permissions: ["manage_users"],
  },
  {
    title: "Inventory",
    url: "/admin/dashboard/inventory",
    icon: Package,
    permissions: ["view_inventory"],
  },
  {
    title: "Products",
    url: "/admin/dashboard/products",
    icon: Package,
    permissions: ["view_products"],
  },
  {
    title: "Product Upload",
    url: "/admin/dashboard/product-upload",
    icon: Upload,
    permissions: ["upload_products"],
  },
  {
    title: "Revenue",
    url: "/admin/dashboard/revenue",
    icon: DollarSign,
    permissions: ["view_revenue"],
  },
  {
    title: "Transactions",
    url: "/admin/dashboard/transactions",
    icon: FileText,
    permissions: ["view_transactions"],
  },
  {
    title: "Wallet",
    url: "/admin/dashboard/wallet",
    icon: Wallet,
    permissions: ["view_wallet"],
  },
  {
    title: "All Orders",
    url: "/admin/dashboard/all-orders",
    icon: ShoppingCart,
    permissions: ["view_orders"],
  },
  {
    title: "Track Orders",
    url: "/admin/dashboard/track-orders",
    icon: Truck,
    permissions: ["track_orders"],
  },
  {
    title: "Support",
    url: "/admin/dashboard/support",
    icon: HeadphonesIcon,
    permissions: ["view_support"],
  },
  {
    title: "Site Manager",
    url: "/admin/dashboard/site-manager",
    icon: Settings,
    permissions: ["manage_site"],
  },
  {
    title: "Account",
    url: "/admin/dashboard/account",
    icon: User,
    permissions: ["manage_accounts"],
  },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  // const { currentUser, hasAnyPermission } = useAdminRBACStore();
  const { mutateAsync: signOut } = useLogout();
  const { user, loading } = useUser();
  const { balance } = useWallet();

  const handleLogout = async () => {
    await signOut().then(() => {
      router.push("/admin");
    });
  };

  if (loading) {
    return <Loader2 className="animate-spin" />;
  }

  if (!loading && (!user || user?.role !== "admin")) {
    redirect("/admin");
  }

  // Show Wallet tab always for super-admin, permission-based for others
  const visibleNavItems = adminNavItems.filter((item) => {
    if (item.title === "Wallet" && user?.position === "super-admin") {
      return true;
      // return user.position
    }
    // return hasAnyPermission(item.permissions);
    return true;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "super-admin":
        return "bg-red-100 text-red-800 border-red-200";
      case "manager":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "marketer":
        return "bg-green-100 text-green-800 border-green-200";
      case "finance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <SidebarProvider>
      <Sidebar
        className="border-r border-gray-200 bg-blue-900 z-[60]"
        suppressHydrationWarning
      >
        <SidebarHeader className="border-b border-blue-700 bg-blue-900 z-[60]">
          <div className="flex items-center gap-3 px-3 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Settings className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white">KredMart</span>
              <span className="text-xs text-blue-300">Admin Portal</span>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="bg-blue-900 overflow-y-auto scrollbar-hide">
          <SidebarGroup>
            <SidebarGroupLabel className="text-blue-300 text-xs font-semibold uppercase tracking-wider px-3 py-2">
              Administration
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1 px-2">
                {visibleNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      className="w-full justify-start px-3 py-2.5 text-blue-200 hover:bg-blue-800 hover:text-white data-[active=true]:bg-blue-600 data-[active=true]:text-white rounded-lg transition-all duration-200"
                    >
                      <Link href={item.url} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        <span className="font-medium">{item.title}</span>
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
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback className="bg-blue-600 text-white text-sm">
                {`${user?.firstname} ${user?.lastname}`
                  .split(" ")
                  .map((n) => n[0])
                  .join("") || "AD"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.firstname}
              </p>
              <p className="text-xs text-blue-300 truncate">{user?.email}</p>
              {/* Only show the role badge, remove any duplicate role text */}
              {user && (
                <Badge
                  variant="outline"
                  className={`text-xs mt-1 ${getRoleBadgeColor(
                    user.position || ""
                  )}`}
                >
                  {(user.position || "").replace("-", " ").toUpperCase()}
                </Badge>
              )}
            </div>
          </div>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleLogout}
                type="button"
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
        {/* Static Header */}
        <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/75">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="h-8 w-8 p-0 hover:bg-gray-100 rounded-md transition-colors" />
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-500">
                  {user
                    ? `Welcome, ${user?.firstname} ${user?.lastname}`
                    : "Manage your platform"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* System Wallet */}

              <Link href="/admin/dashboard/wallet" passHref legacyBehavior>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 hover:bg-gray-100"
                >
                  <Wallet className="h-4 w-4 text-green-600" />
                  <span className="hidden sm:inline text-sm font-medium text-gray-900">
                    ₦{balance.toLocaleString()}
                  </span>
                </Button>
              </Link>

              {/* Broadcast */}
              <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                <Radio className="h-4 w-4 text-blue-600" />
              </Button>

              {/* Profile */}
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 hover:bg-gray-100"
              >
                <Avatar className="h-7 w-7">
                  <AvatarImage src="/placeholder.svg?height=28&width=28" />
                  <AvatarFallback className="bg-blue-600 text-white text-xs">
                    {`${user?.firstname} ${user?.lastname}`
                      .split(" ")
                      .map((n) => n[0])
                      .join("") || "AD"}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-sm font-medium text-gray-900">
                  {user?.firstname} {user?.lastname}
                </span>
              </Button>

              {/* Logout */}
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={handleLogout}
                className="hover:bg-gray-100"
              >
                <LogOut className="h-4 w-4 text-gray-600" />
              </Button>
            </div>
          </div>
        </header>

        {/* Dynamic Content Area with Slide Animation */}
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