"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Phone,
  Truck,
  Package,
  CheckCircle,
  Clock,
  Navigation,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useAdminGetOrders } from "@/lib/services/order/use-admin-get-orders";
import { upperCaseText } from "@/lib/utils";

// Demo data for tracking orders
const generateTrackingOrders = () => {
  const statuses = [
    "Order Confirmed",
    "Order Processing",
    "Order Set for Delivery",
    "Order Delivered",
  ];
  const customers = [
    "John Doe",
    "Jane Smith",
    "Mike Johnson",
    "Sarah Wilson",
    "David Brown",
    "Lisa Davis",
    "Tom Wilson",
    "Emma Jones",
  ];
  const products = [
    "iPhone 14 Pro",
    "Samsung Galaxy S23",
    "MacBook Air M2",
    "Dell XPS 13",
    "iPad Pro",
    "AirPods Pro",
    "Sony WH-1000XM4",
    "Nintendo Switch",
  ];
  const riders = [
    {
      name: "Ahmed Musa",
      phone: "+234 801 234 5678",
      location: { lat: 6.5244, lng: 3.3792 },
    },
    {
      name: "Kemi Adebayo",
      phone: "+234 802 345 6789",
      location: { lat: 6.4281, lng: 3.4219 },
    },
    {
      name: "Chidi Okafor",
      phone: "+234 803 456 7890",
      location: { lat: 6.6018, lng: 3.3515 },
    },
    {
      name: "Fatima Ibrahim",
      phone: "+234 804 567 8901",
      location: { lat: 6.5795, lng: 3.3211 },
    },
    {
      name: "Tunde Bakare",
      phone: "+234 805 678 9012",
      location: { lat: 6.4698, lng: 3.5852 },
    },
  ];

  return Array.from({ length: 150 }, (_, i) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const rider = riders[Math.floor(Math.random() * riders.length)];

    return {
      sn: i + 1,
      orderId: `KM${String(10001 + i).padStart(6, "0")}`,
      transactionId: `TXN${String(20001 + i).padStart(8, "0")}`,
      customer: customers[Math.floor(Math.random() * customers.length)],
      product: products[Math.floor(Math.random() * products.length)],
      deliveryStatus: status,
      rider:
        status === "Order Set for Delivery" || status === "Order Delivered"
          ? rider
          : null,
      estimatedDelivery: new Date(
        Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000
      ).toLocaleDateString(),
      orderDate: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ).toLocaleDateString(),
    };
  });
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Order Confirmed":
      return <CheckCircle className="h-4 w-4" />;
    case "Order Processing":
      return <Clock className="h-4 w-4" />;
    case "Order Set for Delivery":
      return <Truck className="h-4 w-4" />;
    case "Order Delivered":
      return <Package className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Order Confirmed":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "Order Processing":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Order Set for Delivery":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "Order Delivered":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const DeliveryProgressBar = ({ status }: { status: string }) => {
  console.log({ status });
  const steps = [
    { key: "COMFIRMED", label: "Order confirmed" },
    { key: "READY_FOR_DELIVERY", label: "Packed" },
    { key: "ITEM_PICKED", label: "Item picked" },
    { key: "RIDER_ON_MOVE", label: "Rider on move" },
    { key: "DELIVERED", label: "Delivered" },
  ];
  const currentStep = steps.findIndex((step) => step.key === status);

  return (
    <div className="flex items-center space-x-2">
      {steps.map((step, index) => (
        <div key={step.key} className="flex items-center">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
              index <= currentStep
                ? "bg-blue-500 border-blue-500 text-white"
                : "bg-gray-200 border-gray-300 text-gray-500"
            }`}
          >
            {index <= currentStep ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <span className="text-xs font-semibold">{index + 1}</span>
            )}
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-12 h-1 ${
                index < currentStep ? "bg-blue-500" : "bg-gray-300"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

const RiderTrackingModal = ({
  rider,
  orderId,
}: {
  rider: any;
  orderId: string;
}) => {
  const [isTracking, setIsTracking] = useState(false);

  const handleTrackRider = async () => {
    setIsTracking(true);
    // Simulate API call to GIG delivery service
    setTimeout(() => {
      setIsTracking(false);
      toast({
        title: "Rider Location Updated",
        description: `Successfully retrieved location for ${rider.name}`,
      });
    }, 2000);
  };

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Navigation className="h-5 w-5" />
          Track Order {orderId}
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">
            Rider Information
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-blue-600" />
              <span className="font-medium">{rider.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-green-600" />
              <span className="text-sm">{rider.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-red-600" />
              <span className="text-sm">
                Lat: {rider.location.lat}, Lng: {rider.location.lng}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Live Location</h4>
          <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Map integration placeholder</p>
            <p className="text-xs text-gray-400 mt-1">
              Real map would show rider's current location
            </p>
          </div>
        </div>

        <Button
          onClick={handleTrackRider}
          disabled={isTracking}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {isTracking ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Tracking Rider...
            </>
          ) : (
            <>
              <Navigation className="h-4 w-4 mr-2" />
              Update Rider Location
            </>
          )}
        </Button>
      </div>
    </DialogContent>
  );
};

export default function TrackOrdersAdminPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 50;

  const { data, isLoading: ordersLoading } = useAdminGetOrders({
    limit: ordersPerPage,
  });

  const orders = data?.data || [];

  // const orders = useMemo(() => generateTrackingOrders(), [])

  // const filteredOrders = useMemo(() => {
  //   return orders.filter((order) => {
  //     const matchesSearch =
  //       order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       order.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       order.product.toLowerCase().includes(searchTerm.toLowerCase())

  //     const matchesStatus = statusFilter === "all" || order.deliveryStatus === statusFilter

  //     return matchesSearch && matchesStatus
  //   })
  // }, [orders, searchTerm, statusFilter])

  // const totalPages = Math.ceil(filteredOrders.length / ordersPerPage)
  const startIndex = (currentPage - 1) * ordersPerPage;
  // const paginatedOrders = filteredOrders.slice(startIndex, startIndex + ordersPerPage)

  const statusCounts = useMemo(() => {
    return orders.reduce((acc, order) => {
      acc[order.delivery] = (acc[order.delivery] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [orders]);

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">
              Order Confirmed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-blue-900">
                {statusCounts["Order Confirmed"] || 0}
              </span>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700">
              Order Processing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-yellow-900">
                {statusCounts["Order Processing"] || 0}
              </span>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">
              Set for Delivery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-purple-900">
                {statusCounts["Order Set for Delivery"] || 0}
              </span>
              <Truck className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700">
              Order Delivered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-green-900">
                {statusCounts["Order Delivered"] || 0}
              </span>
              <Package className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Track All Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search by Order ID, Transaction ID, Customer, or Product..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Order Confirmed">Order Confirmed</SelectItem>
                <SelectItem value="Order Processing">
                  Order Processing
                </SelectItem>
                <SelectItem value="Order Set for Delivery">
                  Set for Delivery
                </SelectItem>
                <SelectItem value="Order Delivered">Order Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3 font-semibold">SN</th>
                  <th className="text-left p-3 font-semibold">Order ID</th>
                  <th className="text-left p-3 font-semibold">
                    Transaction ID
                  </th>
                  <th className="text-left p-3 font-semibold">Customer</th>
                  <th className="text-left p-3 font-semibold">Product</th>
                  <th className="text-left p-3 font-semibold">
                    Delivery Progress
                  </th>
                  <th className="text-left p-3 font-semibold">Status</th>
                  <th className="text-left p-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={order.orderId} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      {String(index + 1).padStart(3, "0")}
                    </td>
                    <td className="p-3 font-medium text-blue-600">
                      {order.orderId}
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      {order.transaction[0]?.ref}
                    </td>
                    <td className="p-3">
                      {order.user.firstname} {order.user.lastname}
                    </td>
                    <td className="p-3 text-sm">{order.items[0]?.title}</td>
                    <td className="p-3">
                      <div className="min-w-[300px]">
                        <DeliveryProgressBar status={order.delivery} />
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge
                        className={`${getStatusColor(
                          upperCaseText(order.delivery)
                        )} flex items-center gap-1 text-nowrap`}
                      >
                        {getStatusIcon(upperCaseText(order.delivery))}
                        {upperCaseText(order.delivery)}
                      </Badge>
                    </td>
                    <td className="p-3">
                      {order?.rider ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            >
                              <Navigation className="h-4 w-4 mr-1" />
                              Track GIG
                            </Button>
                          </DialogTrigger>
                          <RiderTrackingModal
                            rider={order.rider}
                            orderId={order.orderId}
                          />
                        </Dialog>
                      ) : (
                        <Button size="sm" variant="outline" disabled>
                          <Clock className="h-4 w-4 mr-1" />
                          Pending
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            {/* <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + ordersPerPage, filteredOrders.length)} of{" "}
              {filteredOrders.length} orders
            </div> */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>

              {/* {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum =
                  Math.max(1, Math.min(currentPage - 2, totalPages - 4)) + i;
                if (pageNum > totalPages) return null;

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className={
                      currentPage === pageNum
                        ? "bg-blue-600 hover:bg-blue-700"
                        : ""
                    }
                  >
                    {pageNum}
                  </Button>
                );
              })} */}

              {/* <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button> */}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
