"use client";

import {
  BarChart3,
  DollarSign,
  FileText,
  HeadphonesIcon,
  Loader2,
  LogOut,
  Package,
  Radio,
  Settings,
  ShoppingCart,
  Store,
  Truck,
  Upload,
  User,
  Users,
  Wallet,
  Megaphone,
} from "lucide-react";
import type * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useLogout } from "@/lib/services/auth/use-logout";
import { useUser } from "@/lib/services/user/user";
import { useAdminWallet } from "@/lib/services/wallet/use-admin-wallet";
import { type Permission } from "@/store/admin-rbac-store";
import Link from "next/link";
import { redirect, usePathname, useRouter } from "next/navigation";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";

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

  const { mutateAsync: signOut } = useLogout();
  const { user, loading } = useUser();
  const { data: wallet } = useAdminWallet();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [broadcastSent, setBroadcastSent] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (e) {
      // Optionally log error or show a toast
      console.error("Logout failed", e);
    } finally {
      router.push("/admin");
    }
  };

  const handleBroadcast = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
      setDialogOpen(false);
    }, 2000);
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
              <AvatarImage
                src={user?.picture || "/placeholder.svg?height=32&width=32"}
              />
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
                    ₦{(wallet?.balance || 0).toLocaleString()}
                  </span>
                </Button>
              </Link>

              {/* Broadcast */}
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-gray-100"
                    title="Send Broadcast"
                  >
                    <Radio className="h-4 w-4 text-blue-500" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Send Broadcast Message</DialogTitle>
                  </DialogHeader>
                  <form className="space-y-4" onSubmit={handleBroadcast}>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Message
                      </label>
                      <textarea
                        className="w-full border rounded p-2 min-h-[80px]"
                        placeholder="Enter your broadcast message..."
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Recipients
                      </label>
                      <select
                        className="w-full border rounded p-2"
                        defaultValue="all"
                      >
                        <option value="all">All Users & Merchants</option>
                        <option value="users">All Users</option>
                        <option value="merchants">All Merchants</option>
                      </select>
                    </div>
                    <DialogFooter>
                      <Button
                        type="submit"
                        className="w-full bg-blue-700 text-white hover:bg-blue-800"
                      >
                        Send Broadcast
                      </Button>
                    </DialogFooter>
                  </form>
                  {broadcastSent && (
                    <div className="mt-4">
                      <Alert>
                        <AlertTitle>Broadcast sent!</AlertTitle>
                        <AlertDescription>
                          Your message was sent to the selected recipients.
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              {/* Profile */}
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 hover:bg-gray-100"
              >
                <Avatar className="h-7 w-7">
                  <AvatarImage
                    src={user?.picture || "/placeholder.svg?height=28&width=28"}
                  />
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
