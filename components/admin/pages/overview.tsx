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
import { useAdminOverview } from "@/lib/services/dashboard/admin-overview";

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
  const { user } = useUser();
  const { data } = useAdminOverview();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="rounded-lg p-8 bg-gradient-to-br from-blue-50 to-blue-100">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {user?.firstname} {user?.lastname}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's an overview of your platform
        </p>
      </div>

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
                    {data?.totalUsers.toLocaleString() || 0}
                  </p>
                </div>
                <Users className="h-8 w-8 text-orange-200" />
              </div>
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
