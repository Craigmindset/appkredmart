"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatNaira } from "@/lib/currency";
import {
  TrendingUp,
  Package,
  ShoppingCart,
  DollarSign,
  Download,
  ArrowUpRight,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
  Upload,
  TrendingDown,
} from "lucide-react";
import { useMerchantOverview } from "@/lib/services/dashboard/merchant-overview";
import { useMerchantGetOrders } from "@/lib/services/order/use-merchant-get-orders";
import { upperCaseText } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

// Demo data for merchant overview
const demoMerchantData = {
  revenue: 2450000,
  orders: 156,
  products: 45,
  customers: 89,
  recentOrders: [
    {
      id: "ORD-001",
      customer: "John Doe",
      product: "iPhone 14 Pro",
      amount: 850000,
      status: "completed",
      date: "2024-01-15",
      paymentMethod: "Card",
    },
    {
      id: "ORD-002",
      customer: "Jane Smith",
      product: "MacBook Air M2",
      amount: 1200000,
      status: "processing",
      date: "2024-01-15",
      paymentMethod: "Wallet",
    },
    {
      id: "ORD-003",
      customer: "Mike Johnson",
      product: "AirPods Pro",
      amount: 180000,
      status: "shipped",
      date: "2024-01-14",
      paymentMethod: "BNPL",
    },
    {
      id: "ORD-004",
      customer: "Sarah Wilson",
      product: "iPad Pro 11",
      amount: 650000,
      status: "pending",
      date: "2024-01-14",
      paymentMethod: "Card",
    },
    {
      id: "ORD-005",
      customer: "David Brown",
      product: "Apple Watch Series 9",
      amount: 320000,
      status: "completed",
      date: "2024-01-13",
      paymentMethod: "Wallet",
    },
  ],
  topProducts: [
    {
      id: "PROD-001",
      name: "iPhone 14 Pro",
      sales: 25,
      revenue: 21250000,
      stock: 12,
    },
    {
      id: "PROD-002",
      name: "MacBook Air M2",
      sales: 18,
      revenue: 21600000,
      stock: 8,
    },
    {
      id: "PROD-003",
      name: "AirPods Pro",
      sales: 45,
      revenue: 8100000,
      stock: 25,
    },
    {
      id: "PROD-004",
      name: "iPad Pro 11",
      sales: 15,
      revenue: 9750000,
      stock: 6,
    },
  ],
};

function getStatusColor(status: string) {
  switch (status) {
    case "completed":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300";
    case "processing":
      return "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300";
    case "shipped":
      return "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300";
    case "pending":
      return "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200";
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4" />;
    case "processing":
      return <Clock className="h-4 w-4" />;
    case "shipped":
      return <Truck className="h-4 w-4" />;
    case "pending":
      return <AlertCircle className="h-4 w-4" />;
    default:
      return null;
  }
}

export function Overview() {
  const [activeTab, setActiveTab] = useState<"orders" | "products">("orders");
  const { data: overview, loading: overViewLoading } = useMerchantOverview();
  const { data: orders } = useMerchantGetOrders({ limit: 5 });

  return (
    <div className="space-y-8 w-full max-w-full overflow-hidden">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mt-6 md:mt-10">
        <div className="space-y-1 md:space-y-2">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm md:text-lg text-muted-foreground">
            Monitor your store performance and track key business metrics
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="default"
            className="gap-2 bg-transparent w-full sm:w-auto"
          >
            <Download className="h-4 w-4" />
            <span className="sm:inline">Export Report</span>
          </Button>
          <Button asChild size="default" className="gap-2 w-full sm:w-auto">
            <Link href="/admindesk/dashboard/transactions">
              <span className="sm:inline">View All Transactions</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards - Centralized Layout */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3 justify-center place-items-stretch">
        <Link
          href="/admindesk/dashboard/transactions"
          className="block h-full w-full"
        >
          <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer h-full w-full">
            <CardHeader className="bg-[#0F3D73] text-white pb-3 sm:pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-base sm:text-lg">
                  Total Sales
                </CardTitle>
                <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 opacity-90" />
              </div>
            </CardHeader>
            <CardContent className="py-3 sm:py-6">
              <div className="text-lg sm:text-xl font-semibold mb-2">
                {formatNaira(overview?.totalSales || 0)}
              </div>
              {overViewLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="flex items-center text-xs sm:text-sm text-emerald-600">
                  {overview?.metrics.sales.trend === "decrease" ? (
                    <TrendingDown className="h-4 w-4 mr-2" />
                  ) : (
                    <TrendingUp className="h-4 w-4 mr-2" />
                  )}
                  {overview?.metrics.sales.trend == "decrease" ? "-" : "+"}
                  {overview?.metrics.sales.change}% from last month
                </div>
              )}
            </CardContent>
          </Card>
        </Link>

        <Link
          href="/admindesk/dashboard/orders"
          className="block h-full w-full"
        >
          <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer h-full w-full">
            <CardHeader className="bg-[#D4AF37] text-white pb-3 sm:pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-base sm:text-lg">
                  Total Orders
                </CardTitle>
                <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 opacity-90" />
              </div>
            </CardHeader>
            <CardContent className="py-3 sm:py-6">
              <div className="text-lg sm:text-xl font-semibold mb-2">
                {overview?.totalOrders || 0}
              </div>
              {overViewLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="flex items-center text-xs sm:text-sm text-blue-600">
                  {overview?.metrics.orders.trend === "decrease" ? (
                    <TrendingDown className="h-4 w-4 mr-2" />
                  ) : (
                    <TrendingUp className="h-4 w-4 mr-2" />
                  )}
                  {overview?.metrics.orders.trend == "decrease" ? "-" : "+"}
                  {overview?.metrics.orders.change}% from last month
                </div>
              )}
            </CardContent>
          </Card>
        </Link>

        <Link
          href="/admindesk/dashboard/inventory"
          className="block h-full w-full"
        >
          <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer h-full w-full">
            <CardHeader className="bg-[#1A73E8] text-white pb-3 sm:pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-base sm:text-lg">
                  Products
                </CardTitle>
                <Package className="h-5 w-5 sm:h-6 sm:w-6 opacity-90" />
              </div>
            </CardHeader>
            <CardContent className="py-3 sm:py-6">
              <div className="text-lg sm:text-xl font-semibold mb-2">
                {overview?.totalProducts}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                {(overview?.metrics.products.change || 0) >= 0 && "+"}
                {overview?.metrics.products.change} new products this month
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Quick Actions Section */}
      <div className="grid gap-6 md:grid-cols-3 justify-center place-items-center">
        <Link
          href="/admindesk/dashboard/product-upload"
          className="block w-full"
        >
          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
            <CardContent className="p-3 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <Upload className="h-6 w-6 text-blue-600" />
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-blue-600 transition-colors" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Add New Product</h3>
              <p className="text-muted-foreground">
                Upload and manage your product catalog with ease
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admindesk/dashboard/inventory" className="block w-full">
          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
            <CardContent className="p-3 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-green-600 transition-colors" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Manage Inventory</h3>
              <p className="text-muted-foreground">
                Update stock levels, pricing, and product details
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admindesk/dashboard/orders" className="block w-full">
          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
            <CardContent className="p-3 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <Truck className="h-6 w-6 text-purple-600" />
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-purple-600 transition-colors" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Track Orders</h3>
              <p className="text-muted-foreground">
                See customer delivery status and track order progress
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Activity Section */}
      <Card className="w-full overflow-hidden">
        <CardHeader className="pb-3 sm:pb-6 px-3 sm:px-6 pt-3 sm:pt-6">
          <div className="flex flex-col gap-2 sm:gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1 sm:space-y-2">
              <CardTitle className="text-lg sm:text-xl md:text-2xl text-red-600 font-medium">
                Recent Activity
              </CardTitle>
              <p className="text-xs sm:text-sm md:text-base text-black">
                View your latest orders and top-performing products
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <Button
                asChild
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-10"
              >
                <Link href="/dashboard/merchant/transactions">View All</Link>
              </Button>
              <Button
                size="sm"
                className="gap-2 bg-black hover:bg-gray-900 text-white border-none w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-10"
              >
                <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          {/* Only show Recent Orders table, remove product tab and its elements */}
          <div className="overflow-x-auto -mx-3 sm:-mx-0 px-2 sm:px-0">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden sm:rounded-lg">
                <Table className="min-w-[320px] sm:min-w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[55px] sm:w-[120px] px-0.5 sm:px-4 text-[10px] sm:text-sm">
                        Order
                      </TableHead>
                      <TableHead className="hidden md:table-cell px-0.5 sm:px-4">
                        Customer
                      </TableHead>
                      <TableHead className="px-0.5 sm:px-4 text-[10px] sm:text-sm">
                        Product
                      </TableHead>
                      <TableHead className="text-left w-[60px] sm:w-[150px] px-0.5 sm:px-4 text-[10px] sm:text-sm">
                        Price
                      </TableHead>
                      <TableHead className="hidden lg:table-cell w-[160px] px-0.5 sm:px-4">
                        Payment
                      </TableHead>
                      <TableHead className="px-0.5 sm:px-4 text-[10px] sm:text-sm">
                        Status
                      </TableHead>
                      <TableHead className="hidden sm:table-cell px-0.5 sm:px-4">
                        Date
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(orders?.data || []).map((order) => (
                      <TableRow key={order.id} className="hover:bg-emerald-50">
                        <TableCell className="font-medium text-[9px] sm:text-sm px-0.5 sm:px-4">
                          {order.orderId}
                        </TableCell>
                        <TableCell className="hidden md:table-cell font-medium px-0.5 sm:px-4">
                          {order.order.user.firstname}{" "}
                          {order.order.user.lastname}
                        </TableCell>
                        <TableCell className="max-w-[65px] sm:max-w-[200px] truncate text-[9px] sm:text-sm px-0.5 sm:px-4">
                          {order.items[0]?.title}
                        </TableCell>
                        <TableCell className="text-left font-semibold text-[9px] sm:text-sm px-0.5 sm:px-4">
                          {formatNaira(order.subtotal)}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell px-0.5 sm:px-4">
                          <Badge
                            variant="outline"
                            className="font-medium text-xs"
                          >
                            {upperCaseText(order.order.paymentMethod)}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-0.5 sm:px-4">
                          <div className="flex items-center gap-0.5 sm:gap-2">
                            {getStatusIcon(
                              upperCaseText(order.order.fulfillment)
                            )}
                            <Badge
                              className={`font-medium text-[9px] sm:text-xs whitespace-nowrap px-1 ${getStatusColor(
                                upperCaseText(order.order.fulfillment)
                              )}`}
                            >
                              {upperCaseText(order.order.fulfillment)}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground text-xs sm:text-sm px-0.5 sm:px-4">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
