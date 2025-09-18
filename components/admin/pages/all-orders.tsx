"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Fulfillment, PaymentStatus } from "@/store/orders-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  HighlighterIcon as Highlight,
  Download,
  Package,
  CreditCard,
  Truck,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { useAdminGetOrders } from "@/lib/services/order/use-admin-get-orders";
import { formatNaira } from "@/lib/currency";
import { upperCaseText } from "@/lib/utils";
import { useFetchMerchants } from "@/lib/services/merchant/use-fetch-merchants";
import { Skeleton } from "@/components/ui/skeleton";

// Demo data for all orders
const generateOrdersData = () => {
  const merchants = ["Slot", "Gbam Inc."];
  const users = [
    "John Doe",
    "Jane Smith",
    "Mike Johnson",
    "Sarah Wilson",
    "David Brown",
    "Lisa Davis",
    "Tom Wilson",
    "Emma Jones",
    "Alex Turner",
    "Maria Garcia",
    "James Wilson",
    "Sophie Chen",
    "Robert Taylor",
    "Nina Patel",
    "Chris Anderson",
  ];
  const items = [
    "iPhone 14 Pro",
    "Samsung Galaxy S23",
    "MacBook Air M2",
    "Dell XPS 13",
    "Sony WH-1000XM4",
    "iPad Pro",
    "AirPods Pro",
    "Surface Laptop",
    "HP Pavilion",
    "Lenovo ThinkPad",
    "Canon EOS R5",
    "Nintendo Switch",
    "PlayStation 5",
    "Xbox Series X",
    "Apple Watch Series 8",
  ];
  const paymentMethods = ["Card", "Wallet", "BNPL"];
  const merchantStatuses = ["Settled", "Pending"];
  const deliveryStatuses = [
    "Order Confirmed",
    "Order Processing",
    "Set for Delivery",
    "Delivered",
  ];

  return Array.from({ length: 250 }, (_, i) => {
    const merchantPrice = Math.floor(Math.random() * 500000) + 50000;
    const markup = Math.floor(Math.random() * 20) + 5; // 5-25% markup
    const salePrice = merchantPrice + (merchantPrice * markup) / 100;

    return {
      id: i + 1,
      sn: i + 1,
      orderId: `ORD${String(i + 1).padStart(4, "0")}`,
      transactionId: `TXN${String(Math.floor(Math.random() * 999999)).padStart(
        6,
        "0"
      )}`,
      userName: users[Math.floor(Math.random() * users.length)],
      merchant: merchants[Math.floor(Math.random() * merchants.length)],
      itemOrdered: items[Math.floor(Math.random() * items.length)],
      paymentMethod:
        paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      salePrice: salePrice,
      merchantStatus:
        merchantStatuses[Math.floor(Math.random() * merchantStatuses.length)],
      deliverySettlement:
        merchantStatuses[Math.floor(Math.random() * merchantStatuses.length)],
      markup: markup,
      deliveryStatus:
        deliveryStatuses[Math.floor(Math.random() * deliveryStatuses.length)],
      highlighted: false,
      orderDate: new Date(
        Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
      ).toLocaleDateString(),
    };
  });
};

export default function AllOrdersAdminPage() {
  // const [orders, setOrders] = useState(generateOrdersData())
  const [searchTerm, setSearchTerm] = useState("");
  const [merchantFilter, setMerchantFilter] = useState("all");
  const [deliveryStatusFilter, setDeliveryStatusFilter] = useState("all");
  const [settlementFilter, setSettlementFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);

  const ITEMS_PER_PAGE = 50;
  const { data, isLoading: ordersLoading } = useAdminGetOrders({
    limit: ITEMS_PER_PAGE,
    search: searchTerm,
    merchant: merchantFilter,
    settlement: settlementFilter,
    delivery: deliveryStatusFilter,
  });

  const { data: merhants } = useFetchMerchants();

  const orders = data?.data || [];

  // Filter orders based on search and filters
  // const filteredOrders = useMemo(() => {
  //   return orders.filter((order) => {
  //     const matchesSearch =
  //       order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       order.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       order.merchant.toLowerCase().includes(searchTerm.toLowerCase());

  //     const matchesMerchant =
  //       merchantFilter === "all" || order.merchant === merchantFilter;
  //     const matchesDeliveryStatus =
  //       deliveryStatusFilter === "all" ||
  //       order.deliveryStatus === deliveryStatusFilter;
  //     const matchesSettlement =
  //       settlementFilter === "all" || order.merchantStatus === settlementFilter;

  //     return (
  //       matchesSearch &&
  //       matchesMerchant &&
  //       matchesDeliveryStatus &&
  //       matchesSettlement
  //     );
  //   });
  // }, [
  //   orders,
  //   searchTerm,
  //   merchantFilter,
  //   deliveryStatusFilter,
  //   settlementFilter,
  // ]);

  // Pagination calculations
  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
  // const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  // const endIndex = startIndex + ITEMS_PER_PAGE;
  // const currentOrders = filteredOrders.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, merchantFilter, deliveryStatusFilter, settlementFilter]);

  // Calculate summary statistics
  // const totalOrders = filteredOrders.length;
  // const totalRevenue = filteredOrders.reduce(
  //   (sum, order) => sum + order.salePrice,
  //   0
  // );
  // const totalMarkup = filteredOrders.reduce(
  //   (sum, order) => sum + (order.salePrice * order.markup) / 100,
  //   0
  // );
  // const pendingOrders = filteredOrders.filter(
  //   (order) => order.merchantStatus === "Pending"
  // ).length;

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalMarkup = 0;
  const pendingOrders = orders.filter(
    (order) => order.fulfillment === "Processing"
  ).length;

  // Handle highlight toggle
  // const toggleHighlight = (orderId: string) => {
  //   setOrders((prevOrders) =>
  //     prevOrders.map((order) =>
  //       order.orderId === orderId
  //         ? { ...order, highlighted: !order.highlighted }
  //         : order
  //     )
  //   );
  //   toast.success("Order highlight toggled");
  // };

  // Handle CSV export (all orders)
  const exportAllToCSV = async () => {
    setIsExporting(true);
    try {
      const headers = [
        "SN",
        "Order ID",
        "Transaction ID",
        "User Name",
        "Merchant",
        "Item Ordered",
        "Payment Method",
        "Sale Price (₦)",
        "Merchant Status",
        "Delivery Settlement",
        "Markup (%)",
        "Delivery Status",
        "Order Date",
      ];

      const csvContent = [
        headers.join(","),
        ...orders.map((order) =>
          [
            // order.sn,
            order.orderId,
            // order.transactionId,
            // `"${order.userName}"`,
            // order.merchant,
            // `"${order.itemOrdered}"`,
            // order.paymentMethod,
            // order.salePrice.toLocaleString(),
            // order.merchantStatus,
            // order.deliverySettlement,
            // order.markup,
            // order.deliveryStatus,
            // order.orderDate,
          ].join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `all-orders-complete-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success(`All ${orders.length} orders exported to CSV successfully`);
    } catch (error) {
      toast.error("Failed to export CSV");
    } finally {
      setIsExporting(false);
    }
  };

  // Handle PDF export (all orders)
  const exportAllToPDF = async () => {
    setIsExporting(true);
    try {
      // Create HTML content for PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>KredMart - All Orders Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #1e40af; margin-bottom: 10px; }
            .stamp { background: #1e40af; color: white; padding: 5px 15px; border-radius: 20px; display: inline-block; }
            .date { margin: 10px 0; color: #666; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f8f9fa; font-weight: bold; }
            .summary { margin-bottom: 20px; }
            .summary-item { display: inline-block; margin-right: 30px; }
            .footer { margin-top: 30px; text-align: center; color: #666; font-size: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">KREDMART</div>
            <div class="stamp">OFFICIAL REPORT</div>
            <div class="date">Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</div>
          </div>
          
          <div class="summary">
            <div class="summary-item"><strong>Total Orders:</strong> ${
              orders.length
            }</div>
            <div class="summary-item"><strong>Total Revenue:</strong> ₦${orders
              .reduce((sum, order) => sum + order.total, 0)
              .toLocaleString()}</div>
            <div class="summary-item"><strong>Total Markup:</strong> ₦${orders
              .reduce((sum, order) => sum + (order.total * 5) / 100, 0)
              .toLocaleString()}</div>
          </div>

          <table>
            <thead>
              <tr>
                <th>SN</th>
                <th>Order ID</th>
                <th>Transaction ID</th>
                <th>User Name</th>
                <th>Merchant</th>
                <th>Item Ordered</th>
                <th>Payment Method</th>
                <th>Sale Price (₦)</th>
                <th>Merchant Status</th>
                <th>Delivery</th>
                <th>Markup (%)</th>
                <th>Delivery Status</th>
                <th>Order Date</th>
              </tr>
            </thead>
            <tbody>
              ${orders
                .map(
                  (order) => `
                <tr>
                  <td>${order.id}</td>
                  <td>${order.orderId}</td>
                  <td>${order.transaction[0]?.ref}</td>
                  <td>${order.user.firstname}</td>
                  <td>${order.user.lastname}</td>
                  <td>${order.items.length}</td>
                  <td>${order.paymentMethod}</td>
                  <td>₦${order.total.toLocaleString()}</td>
                
                  <td>${new Date(order.createdAt).toLocaleString()}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>

          <div class="footer">
            <p>This is an official KredMart report generated automatically.</p>
            <p>© ${new Date().getFullYear()} KredMart. All rights reserved.</p>
          </div>
        </body>
        </html>
      `;

      // Create a new window and print
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();

        // Wait for content to load then print
        printWindow.onload = () => {
          printWindow.print();
          printWindow.close();
        };

        toast.success(
          `All ${orders.length} orders exported to PDF successfully`
        );
      } else {
        toast.error(
          "Failed to open print window. Please check your popup blocker."
        );
      }
    } catch (error) {
      toast.error("Failed to export PDF");
    } finally {
      setIsExporting(false);
    }
  };

  // Handle CSV export (filtered orders)
  const exportFilteredToCSV = async () => {
    setIsExporting(true);
    try {
      const headers = [
        "SN",
        "Order ID",
        "Transaction ID",
        "User Name",
        "Merchant",
        "Item Ordered",
        "Payment Method",
        "Sale Price (₦)",
        "Merchant Status",
        "Delivery Settlement",
        "Markup (%)",
        "Delivery Status",
        "Order Date",
      ];

      const csvContent = [
        headers.join(","),
        ...orders.map((order) =>
          [
            // order.sn,
            order.orderId,
            // order.transactionId,
            // `"${order.userName}"`,
            // order.merchant,
            // `"${order.itemOrdered}"`,
            order.paymentMethod,
            // order.salePrice.toLocaleString(),
            // order.merchantStatus,
            // order.deliverySettlement,
            // order.markup,
            // order.deliveryStatus,
            // order.orderDate,
          ].join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `filtered-orders-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success(
        `${orders.length} filtered orders exported to CSV successfully`
      );
    } catch (error) {
      toast.error("Failed to export filtered CSV");
    } finally {
      setIsExporting(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "settled":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "delivered":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "order confirmed":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "order processing":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "set for delivery":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case "Card":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Wallet":
        return "bg-green-100 text-green-800 border-green-200";
      case "BNPL":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-5 duration-500 ease-out">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Orders</h1>
          <p className="text-gray-600 mt-1">
            Manage and monitor all platform orders
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={exportFilteredToCSV}
            disabled={isExporting}
            className="bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Filtered CSV
          </Button>
          <Button
            onClick={exportAllToCSV}
            disabled={isExporting}
            className="bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Download className="w-4 h-4 mr-2" />
            Export All CSV
          </Button>
          <Button
            onClick={exportAllToPDF}
            disabled={isExporting}
            className="bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <FileText className="w-4 h-4 mr-2" />
            Export All PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">
              Total Orders
            </CardTitle>
            <Package className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">
              {totalOrders.toLocaleString()}
            </div>
            <p className="text-xs text-blue-600 mt-1">Filtered results</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">
              ₦{totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-green-600 mt-1">Total sales value</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">
              Total Markup
            </CardTitle>
            <CreditCard className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">
              ₦{totalMarkup.toLocaleString()}
            </div>
            <p className="text-xs text-purple-600 mt-1">Platform earnings</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-50 to-orange-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">
              Pending Orders
            </CardTitle>
            <Truck className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">
              {pendingOrders}
            </div>
            <p className="text-xs text-orange-600 mt-1">Awaiting settlement</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Input
              placeholder="Search orders, transactions, users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="md:col-span-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />

            <Select value={merchantFilter} onValueChange={setMerchantFilter}>
              <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="All Merchants" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Merchants</SelectItem>
                {merhants?.data.map((merhant) => (
                  <SelectItem
                    key={merhant.id}
                    value={merhant.company.toLowerCase()}
                  >
                    {merhant.company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={deliveryStatusFilter}
              onValueChange={setDeliveryStatusFilter}
            >
              <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Delivery Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Order Confirmed">Order Confirmed</SelectItem>
                <SelectItem value="Order Processing">
                  Order Processing
                </SelectItem>
                <SelectItem value="Set for Delivery">
                  Set for Delivery
                </SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={settlementFilter}
              onValueChange={setSettlementFilter}
            >
              <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Settlement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Settlement</SelectItem>
                <SelectItem value="Settled">Settled</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Orders List ({orders.length} total orders)
            </CardTitle>
            {/* <div className="text-sm text-gray-600">
              Showing {startIndex + 1}-{Math.min(endIndex, orders.length)} of{" "}
              {orders.length} orders
            </div> */}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">
                    SN
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Order ID
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Transaction ID
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    User Name
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Merchant
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Item Ordered
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Payment Method
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Sale Price
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Merchant Status
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Delivery
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Markup
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Delivery Status
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ordersLoading &&
                  !orders.length &&
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i} className="border-b">
                      {Array.from({ length: 13 }).map((_, j) => (
                        <TableCell key={j} className="p-2">
                          <Skeleton className="h-8 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                {orders.map((order) => (
                  <TableRow
                    key={order.orderId}
                    className={`hover:bg-gray-50 transition-colors duration-200
                       ${
                         order.highlighted
                           ? "bg-orange-50 border-l-4 border-l-orange-400 shadow-md"
                           : ""
                       }`}
                  >
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell className="font-mono text-sm text-blue-600">
                      {order.orderId}
                    </TableCell>
                    <TableCell className="font-mono text-sm text-gray-600">
                      {order.transaction[0]?.ref}
                    </TableCell>
                    <TableCell className="font-medium">
                      {order.user.firstname} {order.user.lastname}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {order.items.map((item) => (
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-700 border-blue-200 font-medium"
                            key={item.id}
                          >
                            {item.merchant.company}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate font-medium">
                      {order.items.length}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${getPaymentMethodColor(
                          order.paymentMethod
                        )} font-medium`}
                      >
                        {upperCaseText(order.paymentMethod)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-bold text-green-600">
                      {/* ₦{order.salePrice.toLocaleString()} */}
                      {formatNaira(order.total)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${getStatusBadgeColor(
                          upperCaseText(order.fulfillment)
                        )} font-medium`}
                      >
                        {/* {order.merchantStatus} */}
                        {upperCaseText(order.fulfillment)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${getStatusBadgeColor(
                          upperCaseText(order.delivery)
                        )} font-medium text-nowrap`}
                      >
                        {upperCaseText(order.delivery)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-bold text-purple-600">
                      {order.items.reduce((acc, item) => acc + item.markup, 0)}%
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${getStatusBadgeColor(
                          upperCaseText(order.delivery)
                        )} font-medium text-nowrap`}
                      >
                        {upperCaseText(order.delivery)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        // onClick={() => toggleHighlight(order.orderId)}
                        className={`transition-all duration-200 hover:scale-105 ${
                          order.highlighted
                            ? "bg-orange-100 border-orange-300 text-orange-700 hover:bg-orange-200"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <Highlight className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages} ({orders.length} total orders)
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 p-0 ${
                        currentPage === pageNum
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="flex items-center gap-1"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
