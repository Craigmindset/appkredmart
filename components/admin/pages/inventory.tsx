"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminFetchProducts } from "@/lib/services/products/use-admin-fetch-products";
import { useAdminFetchProductsSummary } from "@/lib/services/products/use-admin-fetch-products-summary";
import { formatDate } from "date-fns";
import {
  AlertTriangle,
  Package,
  Search,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

// Demo inventory data with Slot and Gbam Inc. merchants
const mockInventoryData = Array.from({ length: 50 }, (_, i) => {
  const currentStock = Math.max(0, 100 - i * 3);
  const minStock = 10;
  const maxStock = 100;

  // Calculate status based on stock levels
  let status = "Normal";
  if (currentStock === 0) {
    status = "Out of Stock";
  } else if (currentStock <= minStock) {
    status = "Low Stock";
  } else if (currentStock >= maxStock * 0.8) {
    status = "Well Stocked";
  }

  // Calculate stock level percentage
  const stockLevel =
    currentStock === 0 ? 0 : Math.max(20, (currentStock / maxStock) * 100);

  return {
    id: `INV${1000 + i}`,
    productName: [
      "iPhone 15 Pro Max",
      "Samsung Galaxy S24",
      "MacBook Air M3",
      "Dell XPS 13",
      "Sony WH-1000XM5",
      "AirPods Pro",
      "iPad Pro",
      "Surface Pro 9",
      "Gaming Chair",
      "Mechanical Keyboard",
      "4K Monitor",
      "Wireless Mouse",
    ][i % 12],
    category: [
      "Phones and Tablets",
      "Computing",
      "Electronics",
      "Accessories",
      "Home & Kitchen",
      "Premium Devices",
    ][i % 6],
    merchant: i % 2 === 0 ? "Slot" : "Gbam Inc.",
    currentStock,
    minStock,
    maxStock,
    price: 50000 + i * 5000,
    deals: i % 4 === 0 ? "Kredmart deals" : i % 5 === 0 ? "Flash Sale" : null,
    bestPrice: i % 3 === 0,
    lastRestocked: new Date(
      Date.now() - i * 24 * 60 * 60 * 1000
    ).toLocaleDateString(),
    status,
    stockLevel: Math.round(stockLevel),
  };
});

const merchants = ["All", "Slot", "Gbam Inc."];
const categories = [
  "All",
  "Phones and Tablets",
  "Computing",
  "Electronics",
  "Accessories",
  "Home & Kitchen",
  "Premium Devices",
];
const dealTypes = ["All", "Kredmart deals", "Flash Sale", "No Deals"];
const priceTypes = ["All", "Best Price", "Regular Price"];

// Currency formatter for Naira
const formatNaira = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function InventoryAdminPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [merchantFilter, setMerchantFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [dealFilter, setDealFilter] = useState("All");
  const [priceFilter, setPriceFilter] = useState("All");

  const { data, isLoading } = useAdminFetchProducts({
    search: searchQuery,
    merchant: merchantFilter,
    category: categoryFilter,
    ...(priceFilter === "Best Price"
      ? {
          sortBy: "price",
          order: "asc",
        }
      : {}),
  });

  const { data: summary } = useAdminFetchProductsSummary();
  const inventories = data?.data || [];

  // const filteredData = useMemo(() => {
  //   return mockInventoryData.filter((item) => {
  //     const matchesSearch =
  //       item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       item.merchant.toLowerCase().includes(searchQuery.toLowerCase());

  //     const matchesMerchant =
  //       merchantFilter === "All" || item.merchant === merchantFilter;
  //     const matchesCategory =
  //       categoryFilter === "All" || item.category === categoryFilter;
  //     const matchesDeals =
  //       dealFilter === "All" ||
  //       (dealFilter === "No Deals" && !item.deals) ||
  //       (dealFilter !== "No Deals" && item.deals === dealFilter);
  //     const matchesPrice =
  //       priceFilter === "All" ||
  //       (priceFilter === "Best Price" && item.bestPrice) ||
  //       (priceFilter === "Regular Price" && !item.bestPrice);

  //     return (
  //       matchesSearch &&
  //       matchesMerchant &&
  //       matchesCategory &&
  //       matchesDeals &&
  //       matchesPrice
  //     );
  //   });
  // }, [searchQuery, merchantFilter, categoryFilter, dealFilter, priceFilter]);

  // Calculate summary stats
  const totalProducts = inventories.length;
  const outOfStock = inventories.filter((item) => item.quantity < 0).length;
  const lowStock = inventories.filter((item) => item.quantity < 10).length;
  const wellStocked = inventories.filter((item) => item.quantity >= 10).length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Out of Stock":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800">
            {status}
          </Badge>
        );
      case "Low Stock":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            {status}
          </Badge>
        );
      case "Well Stocked":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            {status}
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStockLevelColor = (level: number) => {
    if (level === 0) return "bg-red-500";
    if (level <= 20) return "bg-red-400";
    if (level <= 50) return "bg-yellow-400";
    return "bg-green-500";
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-blue-50">
            <CardTitle className="text-sm font-medium text-blue-700">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {summary?.totalProducts || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-red-50">
            <CardTitle className="text-sm font-medium text-red-700">
              Out of Stock
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">
              {summary?.outOfStocks || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-yellow-50">
            <CardTitle className="text-sm font-medium text-yellow-700">
              Low Stock
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">
              {summary?.lowStocks || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-green-50">
            <CardTitle className="text-sm font-medium text-green-700">
              Well Stocked
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {summary?.wellStocked || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Management</CardTitle>
          <CardDescription>
            Monitor stock levels across all merchants and categories.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by product name, ID, or merchant..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Select value={merchantFilter} onValueChange={setMerchantFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by merchant" />
                </SelectTrigger>
                <SelectContent>
                  {merchants.map((merchant) => (
                    <SelectItem key={merchant} value={merchant}>
                      {merchant}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={dealFilter} onValueChange={setDealFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by deals" />
                </SelectTrigger>
                <SelectContent>
                  {dealTypes.map((deal) => (
                    <SelectItem key={deal} value={deal}>
                      {deal}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by price" />
                </SelectTrigger>
                <SelectContent>
                  {priceTypes.map((price) => (
                    <SelectItem key={price} value={price}>
                      {price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product ID</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Merchant</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Deals</TableHead>
                <TableHead>Last Restocked</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 7 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 8 }).map((_, j) => (
                        <TableCell key={j} className="p-2">
                          <Skeleton className="h-6 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : inventories.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {item.name}
                          {/* {item?.bestPrice && (
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700 text-xs"
                        >
                          Best Price
                        </Badge>
                      )} */}
                        </div>
                      </TableCell>
                      <TableCell>{item.category.join(", ")}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-gray-50">
                          {item?.merchant?.company}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{item?.quantity}</span>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatNaira(item.price)}
                      </TableCell>
                      <TableCell>
                        {/* {item?.deals ? (
                      <Badge
                        variant="default"
                        className={
                          item.deals === "Kredmart deals"
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-orange-500 hover:bg-orange-600"
                        }
                      >
                        {item.deals}
                      </Badge>
                    ) : ( */}
                        <span className="text-muted-foreground text-sm">
                          No deals
                        </span>
                        {/* )} */}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {item.updatedAt &&
                          formatDate(item.updatedAt, "dd/MM/yyyy")}
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
