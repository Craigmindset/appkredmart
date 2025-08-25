"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import Link from "next/link";
import { useAdminRBACStore } from "@/store/admin-rbac-store";
import { useUser } from "@/lib/services/user/user";
import { useAdminUserStats } from "@/lib/services/admin/users";
import { Skeleton } from "@/components/ui/skeleton";

// Demo data
const recentOrders = [
  {
    id: "ORD-2024-001",
    customer: "John Doe",
    date: "2024-01-15",
    amount: 150000,
    paymentMethod: "Card",
    status: "Delivered",
  },
  {
    id: "ORD-2024-002",
    customer: "Jane Smith",
    date: "2024-01-14",
    amount: 75000,
    paymentMethod: "Wallet",
    status: "Shipped",
  },
  {
    id: "ORD-2024-003",
    customer: "Mike Johnson",
    date: "2024-01-13",
    amount: 300000,
    paymentMethod: "BNPL",
    status: "Processing",
  },
];

const topProducts = [
  {
    name: "iPhone 14 Pro Max",
    sales: 1250,
    revenue: 85000000,
  },
  {
    name: "Samsung Galaxy S23",
    sales: 980,
    revenue: 65000000,
  },
  {
    name: "MacBook Air M2",
    sales: 720,
    revenue: 90000000,
  },
];

export default function OverviewAdminPage() {
  const { currentUser } = useAdminRBACStore();
  const { user, loading: userLoading, error: userError } = useUser();
  const { stats: userStats, loading: statsLoading, error: statsError } = useAdminUserStats();

  // Mock data for overview stats until backend is ready
  const data = {
    totalRevenue: 5420000,
    totalOrders: 1247,
    totalProducts: 856,
    totalUsers: 247
  };

  // Show loading state
  if (userLoading || statsLoading) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg p-8 bg-gradient-to-br from-blue-50 to-blue-100">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="rounded-lg p-8 bg-gradient-to-br from-blue-50 to-blue-100">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {currentUser?.name || "Admin"}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's an overview of your platform
        </p>
      </div>

      {/* User Info Card */}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle>Admin User Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="text-lg font-semibold">{user.firstname} {user.lastname}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-lg font-semibold">{user.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p className="text-lg font-semibold">{user.phone || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email Verified</p>
                <Badge variant={user.emailVerified ? "default" : "secondary"}>
                  {user.emailVerified ? "Verified" : "Not Verified"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {userError && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">Failed to load user data: {userError.message}</p>
          </CardContent>
        </Card>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Revenue Card */}
        <div className="relative group">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Revenue</p>
                  <p className="text-2xl font-bold">
                    ₦{data?.totalRevenue.toLocaleString() || 0}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
            <Link
              href="/admin/dashboard/revenue"
              className="absolute inset-0 z-10"
              aria-label="Go to Revenue page"
            />
          </Card>
        </div>

        {/* Orders Card */}
        <div className="relative group">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Total Orders</p>
                  <p className="text-2xl font-bold">
                    {data?.totalOrders.toLocaleString() || 0}
                  </p>
                </div>
                <ShoppingCart className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
            <Link
              href="/admin/dashboard/all-orders"
              className="absolute inset-0 z-10"
              aria-label="Go to All Orders page"
            />
          </Card>
        </div>

        {/* Products Card */}
        <div className="relative group">
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Total Products</p>
                  <p className="text-2xl font-bold">
                    {data?.totalProducts?.toLocaleString() || 0}
                  </p>
                </div>
                <Package className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
            <Link
              href="/admin/dashboard/products"
              className="absolute inset-0 z-10"
              aria-label="Go to Products page"
            />
          </Card>
        </div>

        {/* Users Card */}
        <div className="relative group">
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Total Users</p>
                  <p className="text-2xl font-bold">
                    {data?.totalUsers?.toLocaleString() || 0}
                  </p>
                </div>
                <Users className="h-8 w-8 text-orange-200" />
              </div>
              {userStats && (
                <div className="mt-2 text-xs text-orange-100">
                  {userStats.activeUsers} active • {userStats.verifiedUsers} verified
                </div>
              )}
            </CardContent>
            <Link
              href="/admin/dashboard/users"
              className="absolute inset-0 z-10"
              aria-label="Go to Users page"
            />
          </Card>
        </div>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>₦{order.amount.toLocaleString()}</TableCell>
                    <TableCell>{order.paymentMethod}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{order.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Sales</TableHead>
                  <TableHead>Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topProducts.map((product) => (
                  <TableRow key={product.name}>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>{product.sales.toLocaleString()}</TableCell>
                    <TableCell>
                      ₦{(product.revenue / 1000000).toFixed(1)}M
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
