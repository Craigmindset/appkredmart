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
import { useAdminGetOrders } from "@/lib/services/order/use-admin-get-orders";
import { upperCaseText } from "@/lib/utils";

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

export default function OverviewAdminPage() {
  const { user } = useUser();
  const { data } = useAdminOverview();
  const { data: ordersData, isPending: orderLoading } = useAdminGetOrders();
  const orders = ordersData?.data || [];
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="rounded-lg p-8 bg-gradient-to-r from-[#0F3D73] to-[#D4AF37]">
        <h1 className="text-3xl font-bold text-white">
          Welcome, {user?.firstname} {user?.lastname}!
        </h1>
        <p className="text-blue-100 mt-2">
          Here's an overview of your platform
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Revenue Card */}
        <div className="relative group">
          <Card className="bg-[#0F3D73] text-white hover:shadow-lg transition-shadow">
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
          <Card className="bg-[#D4AF37] text-white hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Total Orders</p>
                  <p className="text-2xl font-bold">
                    {data?.totalOrders.toLocaleString() || 0}
                  </p>
                </div>
                <ShoppingCart className="h-8 w-8 text-white" />
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
          <Card className="bg-[#1A73E8] text-white hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Total Products</p>
                  <p className="text-2xl font-bold">
                    {data?.totalProducts?.toLocaleString() || 0}
                  </p>
                </div>
                <Package className="h-8 w-8 text-white" />
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
          <Card className="bg-black text-white hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Total Users</p>
                  <p className="text-2xl font-bold">
                    {data?.totalUsers.toLocaleString() || 0}
                  </p>
                </div>
                <Users className="h-8 w-8 text-white" />
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
                  <TableHead>Date</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="font-medium">
                      {order.orderId}
                    </TableCell>
                    <TableCell>
                      {order.user.firstname} {order.user.lastname}
                    </TableCell>
                    <TableCell>₦{order?.total?.toLocaleString()}</TableCell>
                    <TableCell>{upperCaseText(order.paymentMethod)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {upperCaseText(order.fulfillment)}
                      </Badge>
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
