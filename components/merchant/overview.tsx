"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatNaira } from "@/lib/currency"
import {
  TrendingUp,
  Package,
  ShoppingCart,
  DollarSign,
  Users,
  Eye,
  Download,
  MoreHorizontal,
  ArrowUpRight,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
  Upload,
} from "lucide-react"

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
}

function getStatusColor(status: string) {
  switch (status) {
    case "completed":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
    case "processing":
      return "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
    case "shipped":
      return "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300"
    case "pending":
      return "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200"
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4" />
    case "processing":
      return <Clock className="h-4 w-4" />
    case "shipped":
      return <Truck className="h-4 w-4" />
    case "pending":
      return <AlertCircle className="h-4 w-4" />
    default:
      return null
  }
}

export function Overview() {
  const [activeTab, setActiveTab] = useState<"orders" | "products">("orders")

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-lg text-muted-foreground">Monitor your store performance and track key business metrics</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="default" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button asChild size="default" className="gap-2">
            <Link href="/dashboard/merchant/transactions">
              View All Transactions
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards - Spacious Layout */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="overflow-hidden">
          <CardHeader className="bg-emerald-600 text-emerald-50 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-emerald-50 text-lg">Total Revenue</CardTitle>
              <DollarSign className="h-6 w-6 opacity-90" />
            </div>
          </CardHeader>
          <CardContent className="py-6">
            <div className="text-3xl font-bold mb-2">{formatNaira(demoMerchantData.revenue)}</div>
            <div className="flex items-center text-sm text-emerald-600">
              <TrendingUp className="h-4 w-4 mr-2" />
              +12.5% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="bg-blue-600 text-blue-50 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-blue-50 text-lg">Total Orders</CardTitle>
              <ShoppingCart className="h-6 w-6 opacity-90" />
            </div>
          </CardHeader>
          <CardContent className="py-6">
            <div className="text-3xl font-bold mb-2">{demoMerchantData.orders}</div>
            <div className="flex items-center text-sm text-blue-600">
              <TrendingUp className="h-4 w-4 mr-2" />
              +8.2% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="bg-purple-600 text-purple-50 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-purple-50 text-lg">Products</CardTitle>
              <Package className="h-6 w-6 opacity-90" />
            </div>
          </CardHeader>
          <CardContent className="py-6">
            <div className="text-3xl font-bold mb-2">{demoMerchantData.products}</div>
            <div className="text-sm text-muted-foreground">+3 new products this month</div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="bg-orange-600 text-orange-50 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-orange-50 text-lg">Customers</CardTitle>
              <Users className="h-6 w-6 opacity-90" />
            </div>
          </CardHeader>
          <CardContent className="py-6">
            <div className="text-3xl font-bold mb-2">{demoMerchantData.customers}</div>
            <div className="flex items-center text-sm text-orange-600">
              <TrendingUp className="h-4 w-4 mr-2" />
              +15.3% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Section */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Upload className="h-6 w-6 text-blue-600" />
              </div>
              <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-blue-600 transition-colors" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Add New Product</h3>
            <p className="text-muted-foreground">Upload and manage your product catalog with ease</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <Package className="h-6 w-6 text-green-600" />
              </div>
              <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-green-600 transition-colors" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Manage Inventory</h3>
            <p className="text-muted-foreground">Update stock levels, pricing, and product details</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-purple-600 transition-colors" />
            </div>
            <h3 className="font-semibold text-lg mb-2">View Analytics</h3>
            <p className="text-muted-foreground">Detailed performance reports and insights</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <Card>
        <CardHeader className="pb-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">Recent Activity</CardTitle>
              <p className="text-muted-foreground">View your latest orders and top-performing products</p>
            </div>
            <div className="flex gap-3">
              <Button asChild variant="outline" size="default">
                <Link href="/dashboard/merchant/transactions">View All</Link>
              </Button>
              <Button variant="outline" size="default" className="gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="orders" className="text-base py-3">
                Recent Orders
              </TabsTrigger>
              <TabsTrigger value="products" className="text-base py-3">
                Top Products
              </TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="mt-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {demoMerchantData.recentOrders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell className="font-medium">{order.customer}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{order.product}</TableCell>
                        <TableCell className="text-right font-semibold">{formatNaira(order.amount)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-medium">
                            {order.paymentMethod}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(order.status)}
                            <Badge className={`font-medium ${getStatusColor(order.status)}`}>{order.status}</Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(order.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="products" className="mt-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">Product ID</TableHead>
                      <TableHead>Product Name</TableHead>
                      <TableHead className="text-right">Sales Count</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                      <TableHead className="text-right">Stock Level</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {demoMerchantData.topProducts.map((product) => (
                      <TableRow key={product.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{product.id}</TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="text-right font-semibold">{product.sales}</TableCell>
                        <TableCell className="text-right font-semibold">{formatNaira(product.revenue)}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={product.stock < 10 ? "destructive" : "secondary"} className="font-medium">
                            {product.stock} in stock
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
