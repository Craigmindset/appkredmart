"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, MoreHorizontal, MapPin, User, Truck } from "lucide-react";
import { useMerchantGetOrders } from "@/lib/services/order/use-merchant-get-orders";
import { upperCaseText } from "@/lib/utils";

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
];

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case "processing":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "ready":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "shipped":
      return "bg-purple-100 text-purple-800 hover:bg-purple-200";
    case "delivered":
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

const getPaymentColor = (payment: string) => {
  switch (payment.toLowerCase()) {
    case "card":
      return "bg-blue-100 text-blue-800";
    case "wallet":
      return "bg-green-100 text-green-800";
    case "bnpl":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function MerchantOrders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { data, isPending } = useMerchantGetOrders({ search: searchTerm });

  const orders = data?.data || [];

  const filteredOrders = demoOrders.filter((order) => {
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      order.deliveryStatus.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const handlePickLocation = (orderId: string) => {
    alert(`Pick Location for Order: ${orderId}`);
  };

  const handleCustomerAddress = (orderId: string, customer: string) => {
    alert(`View Customer Address for ${customer} - Order: ${orderId}`);
  };

  const handleProceedToDeliver = (orderId: string) => {
    alert(`Proceed to Deliver Order: ${orderId}`);
  };

  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto overflow-hidden mt-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">
          Manage and track all your customer orders
        </p>
      </div>

      {/* Summary Stats - Responsive Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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

      <Card className="w-full max-w-6xl mx-auto flex flex-col flex-1 min-h-0">
        <CardHeader>
          <CardTitle>Order Management</CardTitle>
          <CardDescription>
            View and manage all customer orders for your store
          </CardDescription>
        </CardHeader>
        <CardContent className="p-2 sm:p-4 md:p-6 flex flex-col flex-1 min-h-0 ">
          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 sm:mb-6 -z[-5] ">
            <div className="relative flex-1 min-w-0">
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
                <SelectItem value="shipped">Delivered</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Orders Table - Responsive */}
          <div className="rounded-md border w-full">
            <div className="overflow-x-auto w-full">
              <Table className="w-full min-w-[800px]">
                <TableHeader className="sticky top-0 bg-background z-5">
                  <TableRow>
                    <TableHead className="w-[80px] text-xs md:text-sm">
                      Date
                    </TableHead>
                    <TableHead className="w-[90px] text-xs md:text-sm">
                      Order ID
                    </TableHead>
                    <TableHead className="hidden md:table-cell w-[120px] text-xs md:text-sm">
                      Transaction ID
                    </TableHead>
                    <TableHead className="text-xs md:text-sm">
                      Customer
                    </TableHead>
                    <TableHead className="hidden lg:table-cell w-[120px] text-xs md:text-sm">
                      Contact
                    </TableHead>
                    <TableHead className="max-w-[120px] md:max-w-[200px] text-xs md:text-sm">
                      Product
                    </TableHead>
                    <TableHead className="w-[110px] text-xs md:text-sm">
                      Amount
                    </TableHead>
                    <TableHead className="hidden xl:table-cell w-[110px] text-xs md:text-sm">
                      Payment
                    </TableHead>
                    <TableHead className="text-xs md:text-sm">Status</TableHead>
                    <TableHead className="w-[70px] text-xs md:text-sm">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={10}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No orders found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.map((order) => {
                      const first = order.items[0];
                      const more = order.items.length - 1;
                      return (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium text-xs md:text-sm">
                            {order.createdAt}
                          </TableCell>
                          <TableCell className="font-mono text-xs md:text-sm">
                            {order.order.orderId}
                          </TableCell>
                          <TableCell className="font-mono text-xs hidden md:table-cell">
                            {order.order.transaction.ref || ""}
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[100px] md:max-w-[140px]">
                              <div className="font-medium text-xs md:text-sm truncate">
                                {order.order.user.firstname}{" "}
                                {order.order.user.lastname}
                              </div>
                              <div className="text-xs text-muted-foreground lg:hidden truncate">
                                {order.order.user.phone}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-xs hidden lg:table-cell">
                            {order.order.phone}
                          </TableCell>
                          <TableCell>
                            <div
                              className="max-w-[120px] md:max-w-[200px] truncate text-xs md:text-sm"
                              title={first.title}
                            >
                              {first.title}
                              {more > 0 ? ` (+${more} more)` : ""}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium text-xs md:text-sm">
                            ₦{order.subtotal.toLocaleString()}
                          </TableCell>
                          <TableCell className="hidden xl:table-cell">
                            <Badge
                              variant="secondary"
                              className={`${getPaymentColor(
                                upperCaseText(order.order.paymentMethod)
                              )} text-xs`}
                            >
                              {upperCaseText(order.order.paymentMethod)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={`${getStatusColor(
                                upperCaseText(order.order.delivery)
                              )} text-xs`}
                            >
                              {upperCaseText(order.order.delivery)}
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
                                <DropdownMenuItem
                                  onClick={() =>
                                    handlePickLocation(order.orderId)
                                  }
                                >
                                  <MapPin className="mr-2 h-4 w-4" />
                                  Pick Location
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleCustomerAddress(
                                      order.orderId,
                                      order.order.address
                                    )
                                  }
                                >
                                  <User className="mr-2 h-4 w-4" />
                                  Customer Address
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleProceedToDeliver(order.orderId)
                                  }
                                >
                                  <Truck className="mr-2 h-4 w-4" />
                                  Proceed to Deliver
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
