"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useInventory } from "@/lib/services/inventory/use-inventory";

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

  const { 
    inventory, 
    loading, 
    error, 
    stats,
    fetchInventory 
  } = useInventory({
    limit: 50,
    page: 1,
  });

  const filteredData = useMemo(() => {
    return inventory.filter((item) => {
      const matchesSearch =
        item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.merchant?.company || "").toLowerCase().includes(searchQuery.toLowerCase());

      const matchesMerchant =
        merchantFilter === "All" || (item.merchant?.company || "") === merchantFilter;
      const matchesCategory =
        categoryFilter === "All" || item.category === categoryFilter;
      const matchesDeals =
        dealFilter === "All" ||
        (dealFilter === "No Deals" && !item.deals) ||
        (dealFilter !== "No Deals" && item.deals === dealFilter);
      const matchesPrice =
        priceFilter === "All" ||
        (priceFilter === "Best Price" && item.bestPrice) ||
        (priceFilter === "Regular Price" && !item.bestPrice);

      return (
        matchesSearch &&
        matchesMerchant &&
        matchesCategory &&
        matchesDeals &&
        matchesPrice
      );
    });
  }, [inventory, searchQuery, merchantFilter, categoryFilter, dealFilter, priceFilter]);

  // Apply backend filters when they change
  const handleFilterChange = () => {
    fetchInventory({
      search: searchQuery || undefined,
      merchant: merchantFilter !== "All" ? merchantFilter : undefined,
      category: categoryFilter !== "All" ? categoryFilter : undefined,
      deals: dealFilter !== "All" ? dealFilter : undefined,
      priceType: priceFilter !== "All" ? priceFilter : undefined,
    });
  };

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

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
              <p>Failed to load inventory data: {error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              {loading ? <Skeleton className="h-8 w-16" /> : stats.totalProducts}
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
              {loading ? <Skeleton className="h-8 w-16" /> : stats.outOfStock}
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
              {loading ? <Skeleton className="h-8 w-16" /> : stats.lowStock}
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
              {loading ? <Skeleton className="h-8 w-16" /> : stats.wellStocked}
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
                onKeyPress={(e) => e.key === 'Enter' && handleFilterChange()}
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Select value={merchantFilter} onValueChange={(value) => {
                setMerchantFilter(value);
                setTimeout(handleFilterChange, 100);
              }}>
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

              <Select value={categoryFilter} onValueChange={(value) => {
                setCategoryFilter(value);
                setTimeout(handleFilterChange, 100);
              }}>
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

              <Select value={dealFilter} onValueChange={(value) => {
                setDealFilter(value);
                setTimeout(handleFilterChange, 100);
              }}>
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

              <Select value={priceFilter} onValueChange={(value) => {
                setPriceFilter(value);
                setTimeout(handleFilterChange, 100);
              }}>
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
                <TableHead>Stock Status</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Deals</TableHead>
                <TableHead>Last Restocked</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 10 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  </TableRow>
                ))
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <Package className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">No inventory items found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {item.productName}
                        {item.bestPrice && (
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-700 text-xs"
                          >
                            Best Price
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-gray-50">
                        {item.merchant?.company || "Unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(item.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.currentStock}</span>
                        <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${getStockLevelColor(item.stockLevel)}`}
                            style={{ width: `${Math.min(item.stockLevel, 100)}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatNaira(item.price)}
                    </TableCell>
                    <TableCell>
                      {item.deals ? (
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
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          No deals
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {item.lastRestocked}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}