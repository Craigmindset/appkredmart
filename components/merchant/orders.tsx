"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, MapPin, User, Truck } from "lucide-react"

// Demo orders data
const demoOrders = [
  {
    id: "ORD-001",
    date: "2024-01-15",
    orderId: "ORD-001",
    transactionId: "TXN-12345",
    customer: "John Doe",
    customerContact: "+234 801 234 5678",
    product: "iPhone 15 Pro Max",
    amount: 1250000,
    payment: "Card",
    deliveryStatus: "Pending",
  },
  {
    id: "ORD-002",
    date: "2024-01-15",
    orderId: "ORD-002",
    transactionId: "TXN-12346",
    customer: "Jane Smith",
    customerContact: "+234 802 345 6789",
    product: "MacBook Air M2",
    amount: 980000,
    payment: "Wallet",
    deliveryStatus: "Processing",
  },
  {
    id: "ORD-003",
    date: "2024-01-14",
    orderId: "ORD-003",
    transactionId: "TXN-12347",
    customer: "Mike Johnson",
    customerContact: "+234 803 456 7890",
    product: "Samsung Galaxy S24",
    amount: 750000,
    payment: "BNPL",
    deliveryStatus: "Ready",
  },
  {
    id: "ORD-004",
    date: "2024-01-14",
    orderId: "ORD-004",
    transactionId: "TXN-12348",
    customer: "Sarah Wilson",
    customerContact: "+234 804 567 8901",
    product: "Dell XPS 13",
    amount: 850000,
    payment: "Card",
    deliveryStatus: "Shipped",
  },
  {
    id: "ORD-005",
    date: "2024-01-13",
    orderId: "ORD-005",
    transactionId: "TXN-12349",
    customer: "David Brown",
    customerContact: "+234 805 678 9012",
    product: "iPad Pro 12.9",
    amount: 650000,
    payment: "Wallet",
    deliveryStatus: "Delivered",
  },
]

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
    case "processing":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200"
    case "ready":
      return "bg-green-100 text-green-800 hover:bg-green-200"
    case "shipped":
      return "bg-purple-100 text-purple-800 hover:bg-purple-200"
    case "delivered":
      return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200"
  }
}

const getPaymentColor = (payment: string) => {
  switch (payment.toLowerCase()) {
    case "card":
      return "bg-blue-100 text-blue-800"
    case "wallet":
      return "bg-green-100 text-green-800"
    case "bnpl":
      return "bg-orange-100 text-orange-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function MerchantOrders() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredOrders = demoOrders.filter((order) => {
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.deliveryStatus.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  const handlePickLocation = (orderId: string) => {
    alert(`Pick Location for Order: ${orderId}`)
  }

  const handleCustomerAddress = (orderId: string, customer: string) => {
    alert(`View Customer Address for ${customer} - Order: ${orderId}`)
  }

  const handleProceedToDeliver = (orderId: string) => {
    alert(`Proceed to Deliver Order: ${orderId}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">Manage and track all your customer orders</p>
      </div>

      {/* Summary Stats - Moved to top */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-800">
            {demoOrders.filter((o) => o.deliveryStatus === "Pending").length}
          </div>
          <div className="text-sm text-yellow-600">Pending Orders</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-800">
            {demoOrders.filter((o) => o.deliveryStatus === "Processing").length}
          </div>
          <div className="text-sm text-blue-600">Processing</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-800">
            {demoOrders.filter((o) => o.deliveryStatus === "Ready").length}
          </div>
          <div className="text-sm text-green-600">Ready to Deliver</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-800">
            {demoOrders.filter((o) => o.deliveryStatus === "Delivered").length}
          </div>
          <div className="text-sm text-purple-600">Delivered</div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Management</CardTitle>
          <CardDescription>View and manage all customer orders for your store</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by Order ID, Transaction ID, Customer, or Product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Orders Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Delivery Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                      No orders found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.date}</TableCell>
                      <TableCell>{order.orderId}</TableCell>
                      <TableCell className="font-mono text-sm">{order.transactionId}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell className="font-mono text-sm">{order.customerContact}</TableCell>
                      <TableCell>{order.product}</TableCell>
                      <TableCell className="font-medium">₦{order.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getPaymentColor(order.payment)}>
                          {order.payment}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getStatusColor(order.deliveryStatus)}>
                          {order.deliveryStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handlePickLocation(order.orderId)}>
                              <MapPin className="mr-2 h-4 w-4" />
                              Pick Location
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCustomerAddress(order.orderId, order.customer)}>
                              <User className="mr-2 h-4 w-4" />
                              Customer Address
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleProceedToDeliver(order.orderId)}>
                              <Truck className="mr-2 h-4 w-4" />
                              Proceed to Deliver
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
