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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  MoreHorizontal,
  MapPin,
  User,
  Truck,
  Share2,
} from "lucide-react";
import { toast } from "sonner";

// Demo transactions data
const demoTransactions = [
  {
    id: "1",
    sn: "001",
    orderId: "ORD-2024-001",
    transactionId: "TXN-12345678",
    username: "john_doe",
    customerName: "John Doe",
    itemSold: "iPhone 15 Pro Max 256GB",
    category: "Electronics",
    amount: 1250000,
    paymentStatus: "Completed",
    deliveryStatus: "Pending",
    pickupAddress: "123 Main Street, Victoria Island, Lagos State",
    customerAddress: "456 Oak Avenue, Lekki Phase 1, Lagos State",
    customerPhone: "+234 801 234 5678",
    customerEmail: "john.doe@email.com",
    orderDate: "2024-01-15",
  },
  {
    id: "2",
    sn: "002",
    orderId: "ORD-2024-002",
    transactionId: "TXN-12345679",
    username: "jane_smith",
    customerName: "Jane Smith",
    itemSold: "MacBook Air M2 13-inch",
    category: "Electronics",
    amount: 980000,
    paymentStatus: "Completed",
    deliveryStatus: "Processing",
    pickupAddress: "789 Business District, Ikeja, Lagos State",
    customerAddress: "321 Palm Street, Ajah, Lagos State",
    customerPhone: "+234 802 345 6789",
    customerEmail: "jane.smith@email.com",
    orderDate: "2024-01-15",
  },
  {
    id: "3",
    sn: "003",
    orderId: "ORD-2024-003",
    transactionId: "TXN-12345680",
    username: "mike_johnson",
    customerName: "Mike Johnson",
    itemSold: "Samsung Galaxy S24 Ultra",
    category: "Electronics",
    amount: 750000,
    paymentStatus: "Pending",
    deliveryStatus: "Ready",
    pickupAddress: "555 Tech Hub, Yaba, Lagos State",
    customerAddress: "888 Garden City, Port Harcourt, Rivers State",
    customerPhone: "+234 803 456 7890",
    customerEmail: "mike.johnson@email.com",
    orderDate: "2024-01-14",
  },
  {
    id: "4",
    sn: "004",
    orderId: "ORD-2024-004",
    transactionId: "TXN-12345681",
    username: "sarah_wilson",
    customerName: "Sarah Wilson",
    itemSold: "Dell XPS 13 Laptop",
    category: "Electronics",
    amount: 850000,
    paymentStatus: "Completed",
    deliveryStatus: "Shipped",
    pickupAddress: "222 Commerce Plaza, Abuja FCT",
    customerAddress: "777 Residential Area, Gwarinpa, Abuja FCT",
    customerPhone: "+234 804 567 8901",
    customerEmail: "sarah.wilson@email.com",
    orderDate: "2024-01-14",
  },
  {
    id: "5",
    sn: "005",
    orderId: "ORD-2024-005",
    transactionId: "TXN-12345682",
    username: "david_brown",
    customerName: "David Brown",
    itemSold: "iPad Pro 12.9-inch",
    category: "Electronics",
    amount: 650000,
    paymentStatus: "Completed",
    deliveryStatus: "Delivered",
    pickupAddress: "999 Shopping Mall, Kano State",
    customerAddress: "111 New Layout, Kano State",
    customerPhone: "+234 805 678 9012",
    customerEmail: "david.brown@email.com",
    orderDate: "2024-01-13",
  },
  {
    id: "6",
    sn: "006",
    orderId: "ORD-2024-006",
    transactionId: "TXN-12345683",
    username: "emma_davis",
    customerName: "Emma Davis",
    itemSold: "Nike Air Max Sneakers",
    category: "Fashion",
    amount: 85000,
    paymentStatus: "Completed",
    deliveryStatus: "Processing",
    pickupAddress: "444 Fashion District, Lagos Island",
    customerAddress: "666 Estate Road, Magodo, Lagos State",
    customerPhone: "+234 806 789 0123",
    customerEmail: "emma.davis@email.com",
    orderDate: "2024-01-13",
  },
  {
    id: "7",
    sn: "007",
    orderId: "ORD-2024-007",
    transactionId: "TXN-12345684",
    username: "alex_taylor",
    customerName: "Alex Taylor",
    itemSold: "Adidas Ultraboost 22",
    category: "Fashion",
    amount: 95000,
    paymentStatus: "Failed",
    deliveryStatus: "Cancelled",
    pickupAddress: "333 Sports Center, Ibadan, Oyo State",
    customerAddress: "555 University Area, Ibadan, Oyo State",
    customerPhone: "+234 807 890 1234",
    customerEmail: "alex.taylor@email.com",
    orderDate: "2024-01-12",
  },
];

const getPaymentStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case "failed":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

const getDeliveryStatusColor = (status: string) => {
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
    case "cancelled":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

export function Transactions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [deliveryStatusFilter, setDeliveryStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [dialogType, setDialogType] = useState<
    "pickup" | "customer" | "delivery" | null
  >(null);

  // Filter transactions first
  const filteredTransactions = demoTransactions.filter((transaction) => {
    const matchesSearch =
      transaction.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.transactionId
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.itemSold.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDeliveryStatus =
      deliveryStatusFilter === "all" ||
      transaction.deliveryStatus.toLowerCase() ===
        deliveryStatusFilter.toLowerCase();

    const matchesCategory =
      categoryFilter === "all" ||
      transaction.category.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesDeliveryStatus && matchesCategory;
  });

  // Pagination state
  const [page, setPage] = useState(1);
  const rowsPerPage = 50;
  const totalRows = filteredTransactions.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handlePickupLocation = (transaction: any) => {
    setSelectedTransaction(transaction);
    setDialogType("pickup");
  };

  const handleCustomerAddress = (transaction: any) => {
    setSelectedTransaction(transaction);
    setDialogType("customer");
  };

  const handleProceedToDelivery = (transaction: any) => {
    setSelectedTransaction(transaction);
    setDialogType("delivery");
  };

  const shareToDeliveryService = () => {
    if (selectedTransaction) {
      // Simulate sharing to 3rd party delivery service
      toast.success(
        `Transaction ${selectedTransaction.transactionId} shared with delivery service`
      );
      setDialogType(null);
      setSelectedTransaction(null);
    }
  };

  const categories = [...new Set(demoTransactions.map((t) => t.category))];

  return (
    <div className="space-y-4 px-2">
      <div className="mb-2">
        <h1 className="text-xl font-bold tracking-tight">Transactions</h1>
        <p className="text-muted-foreground text-sm mt-1">
          View and manage all your sales transactions and deliveries
        </p>
      </div>

      {/* Summary Stats - Moved to top */}
      <div className="flex gap-2 mx-0">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-2 rounded border border-blue-200 w-[300px]">
          <div className="text-xl font-bold text-blue-800">
            {demoTransactions.length}
          </div>
          <div className="text-xs text-blue-600 font-medium">
            Total Transactions
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-2 rounded border border-green-200 w-[300px]">
          <div className="text-xl font-bold text-green-800">
            {
              demoTransactions.filter((t) => t.paymentStatus === "Completed")
                .length
            }
          </div>
          <div className="text-xs text-green-600 font-medium">
            Completed Payments
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-2 rounded border border-purple-200 w-[300px]">
          <div className="text-xl font-bold text-purple-800">
            ₦
            {demoTransactions
              .filter((t) => t.paymentStatus === "Completed")
              .reduce((sum, t) => sum + t.amount, 0)
              .toLocaleString("en-NG")}
          </div>
          <div className="text-xs text-purple-600 font-medium">
            Completed Value
          </div>
        </div>
      </div>

      <Card className="w-[1000px]">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Transaction Management</CardTitle>
          <CardDescription className="text-sm">
            Track all your sales, payments, and delivery status in one place
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Search and Filter Controls */}
          <div className="flex flex-col lg:flex-row gap-2">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by Order ID, Transaction ID, Username, or Item..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[180px] h-11">
                  <SelectValue placeholder="Filter by Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={deliveryStatusFilter}
                onValueChange={setDeliveryStatusFilter}
              >
                <SelectTrigger className="w-full sm:w-[180px] h-11">
                  <SelectValue placeholder="Filter by Delivery" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="rounded border w-full">
            <div className="w-full">
              <div
                className="overflow-x-auto overflow-y-auto"
                style={{ maxHeight: 320 }}
              >
                <Table className="min-w-max text-sm align-middle">
                  <TableHeader>
                    <TableRow className="bg-muted/50 h-8">
                      <TableHead className="font-semibold">S/N</TableHead>
                      <TableHead className="font-semibold">Order ID</TableHead>
                      <TableHead className="font-semibold">
                        Transaction ID
                      </TableHead>
                      <TableHead className="font-semibold">Username</TableHead>
                      <TableHead className="font-semibold">Item Sold</TableHead>
                      <TableHead className="font-semibold">Category</TableHead>
                      <TableHead className="font-semibold">Amount</TableHead>
                      <TableHead className="font-semibold">
                        Payment Status
                      </TableHead>
                      <TableHead className="font-semibold">
                        Delivery Status
                      </TableHead>
                      <TableHead className="font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={10}
                          className="text-center py-12 text-muted-foreground"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <Search className="h-8 w-8 text-muted-foreground/50" />
                            <p>No transactions found matching your criteria</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedTransactions.map((transaction) => (
                        <TableRow
                          key={transaction.id}
                          className="hover:bg-muted/30 h-8"
                        >
                          <TableCell className="font-medium">
                            {transaction.sn}
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {transaction.orderId}
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {transaction.transactionId}
                          </TableCell>
                          <TableCell className="font-medium">
                            {transaction.username}
                          </TableCell>
                          <TableCell
                            className="max-w-[200px] truncate"
                            title={transaction.itemSold}
                          >
                            {transaction.itemSold}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-medium">
                              {transaction.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-semibold">
                            ₦{transaction.amount.toLocaleString("en-NG")}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={getPaymentStatusColor(
                                transaction.paymentStatus
                              )}
                            >
                              {transaction.paymentStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={getDeliveryStatusColor(
                                transaction.deliveryStatus
                              )}
                            >
                              {transaction.deliveryStatus}
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
                              <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuItem
                                  onClick={() =>
                                    handlePickupLocation(transaction)
                                  }
                                >
                                  <MapPin className="mr-2 h-4 w-4" />
                                  See Pick Location
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleCustomerAddress(transaction)
                                  }
                                >
                                  <User className="mr-2 h-4 w-4" />
                                  Customer Address
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleProceedToDelivery(transaction)
                                  }
                                >
                                  <Truck className="mr-2 h-4 w-4" />
                                  Proceed to Delivery
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
            </div>
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center p-4 border-t bg-white">
                <span className="text-xs text-gray-500">
                  Showing {(page - 1) * rowsPerPage + 1} -{" "}
                  {Math.min(page * rowsPerPage, totalRows)} of {totalRows}
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-xs px-2">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pickup Location Dialog */}
      <Dialog
        open={dialogType === "pickup"}
        onOpenChange={() => setDialogType(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              Pickup Location
            </DialogTitle>
            <DialogDescription>
              Customer selected pickup address for Order{" "}
              {selectedTransaction?.orderId}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">
                Pickup Address:
              </h4>
              <p className="text-blue-800">
                {selectedTransaction?.pickupAddress}
              </p>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setDialogType(null)}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Customer Address Dialog */}
      <Dialog
        open={dialogType === "customer"}
        onOpenChange={() => setDialogType(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-green-600" />
              Customer Information
            </DialogTitle>
            <DialogDescription>
              Customer details for Order {selectedTransaction?.orderId}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200 space-y-3">
              <div>
                <h4 className="font-semibold text-green-900">Customer Name:</h4>
                <p className="text-green-800">
                  {selectedTransaction?.customerName}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-green-900">Phone:</h4>
                <p className="text-green-800">
                  {selectedTransaction?.customerPhone}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-green-900">Email:</h4>
                <p className="text-green-800">
                  {selectedTransaction?.customerEmail}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-green-900">Address:</h4>
                <p className="text-green-800">
                  {selectedTransaction?.customerAddress}
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setDialogType(null)}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Proceed to Delivery Dialog */}
      <Dialog
        open={dialogType === "delivery"}
        onOpenChange={() => setDialogType(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-purple-600" />
              Proceed to Delivery
            </DialogTitle>
            <DialogDescription>
              Share transaction details with 3rd party delivery service
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 space-y-2">
              <div className="flex justify-between">
                <span className="font-semibold text-purple-900">Order ID:</span>
                <span className="text-purple-800">
                  {selectedTransaction?.orderId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-purple-900">
                  Transaction ID:
                </span>
                <span className="text-purple-800 font-mono text-sm">
                  {selectedTransaction?.transactionId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-purple-900">Customer:</span>
                <span className="text-purple-800">
                  {selectedTransaction?.customerName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-purple-900">Item:</span>
                <span className="text-purple-800">
                  {selectedTransaction?.itemSold}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-purple-900">Amount:</span>
                <span className="text-purple-800 font-semibold">
                  ₦{selectedTransaction?.amount.toLocaleString("en-NG")}
                </span>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogType(null)}>
                Cancel
              </Button>
              <Button
                onClick={shareToDeliveryService}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share with Delivery Service
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
