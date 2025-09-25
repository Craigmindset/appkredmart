"use client";

import { useState, useMemo } from "react";
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
  Search,
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useMerchantFetchProducts } from "@/lib/services/products/use-merchant-fetch-products";
import { useMerchantFetchProductsSummary } from "@/lib/services/products/use-merchant-fetch-products-summary";
import { cn } from "@/lib/utils";

// Demo products data
const demoProducts = [
  {
    id: "PROD-001",
    name: "iPhone 15 Pro Max",
    category: "Electronics",
    subcategory: "Smartphones",
    brand: "Apple",
    price: 1250000,
    discount: 10,
    quantity: 25,
    colors: [
      "Space Black",
      "White Titanium",
      "Blue Titanium",
      "Natural Titanium",
    ],
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "PROD-002",
    name: "MacBook Air M2",
    category: "Electronics",
    subcategory: "Laptops",
    brand: "Apple",
    price: 980000,
    discount: 5,
    quantity: 15,
    colors: ["Silver", "Space Gray", "Gold", "Midnight"],
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "PROD-003",
    name: "Samsung Galaxy S24",
    category: "Electronics",
    subcategory: "Smartphones",
    brand: "Samsung",
    price: 750000,
    discount: 15,
    quantity: 8,
    colors: ["Phantom Black", "Cream", "Violet"],
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "PROD-004",
    name: "Dell XPS 13",
    category: "Electronics",
    subcategory: "Laptops",
    brand: "Dell",
    price: 850000,
    discount: 0,
    quantity: 0,
    colors: ["Silver", "Black"],
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "PROD-005",
    name: "iPad Pro 12.9",
    category: "Electronics",
    subcategory: "Tablets",
    brand: "Apple",
    price: 650000,
    discount: 8,
    quantity: 30,
    colors: ["Silver", "Space Gray"],
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "PROD-006",
    name: "Sony WH-1000XM5",
    category: "Electronics",
    subcategory: "Audio",
    brand: "Sony",
    price: 180000,
    discount: 20,
    quantity: 45,
    colors: ["Black", "Silver"],
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "PROD-007",
    name: "Nike Air Max 270",
    category: "Fashion",
    subcategory: "Shoes",
    brand: "Nike",
    price: 85000,
    discount: 25,
    quantity: 12,
    colors: ["Black", "White", "Red", "Blue"],
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "PROD-008",
    name: "Adidas Ultraboost 22",
    category: "Fashion",
    subcategory: "Shoes",
    brand: "Adidas",
    price: 95000,
    discount: 0,
    quantity: 20,
    colors: ["Core Black", "Cloud White", "Solar Red"],
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "PROD-009",
    name: "Canon EOS R5",
    category: "Electronics",
    subcategory: "Cameras",
    brand: "Canon",
    price: 2500000,
    discount: 12,
    quantity: 5,
    colors: ["Black"],
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "PROD-010",
    name: "Levi's 501 Jeans",
    category: "Fashion",
    subcategory: "Clothing",
    brand: "Levi's",
    price: 45000,
    discount: 30,
    quantity: 35,
    colors: ["Blue", "Black", "Light Blue"],
    image: "/placeholder.svg?height=40&width=40",
  },
];

// Generate more demo data to reach 50+ items
const generateMoreProducts = () => {
  const additionalProducts = [];
  const baseProducts = demoProducts.slice(0, 5);

  for (let i = 0; i < 45; i++) {
    const baseProduct = baseProducts[i % baseProducts.length];
    additionalProducts.push({
      ...baseProduct,
      id: `PROD-${String(i + 11).padStart(3, "0")}`,
      name: `${baseProduct.name} - Variant ${i + 1}`,
      quantity: Math.floor(Math.random() * 50),
      discount: Math.floor(Math.random() * 30),
      price: baseProduct.price + Math.floor(Math.random() * 100000),
    });
  }

  return [...demoProducts, ...additionalProducts];
};

const allProducts = generateMoreProducts();

const getStockStatus = (quantity: number) => {
  if (quantity === 0)
    return {
      status: "Out of Stock",
      color: "bg-red-100 text-red-800",
      icon: XCircle,
    };
  if (quantity < 10)
    return {
      status: "Low Stock",
      color: "bg-yellow-100 text-yellow-800",
      icon: AlertTriangle,
    };
  return {
    status: "In Stock",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  };
};

const getDiscountColor = (discount: number) => {
  if (discount === 0) return "bg-gray-100 text-gray-800";
  if (discount <= 10) return "bg-blue-100 text-blue-800";
  if (discount <= 20) return "bg-orange-100 text-orange-800";
  return "bg-red-100 text-red-800";
};

export function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [brandFilter, setBrandFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceSort, setPriceSort] = useState("none");
  const [discountFilter, setDiscountFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  const { data } = useMerchantFetchProducts({ search: searchTerm });
  const { data: summary } = useMerchantFetchProductsSummary();

  const products = data?.data || [];

  // Get unique brands and categories for filters
  const brands = [...new Set(allProducts.map((p) => p.brand))].sort();
  const categories = [...new Set(allProducts.map((p) => p.category))].sort();

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = allProducts.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesBrand =
        brandFilter === "all" || product.brand === brandFilter;
      const matchesCategory =
        categoryFilter === "all" || product.category === categoryFilter;

      let matchesDiscount = true;
      if (discountFilter === "with-discount")
        matchesDiscount = product.discount > 0;
      else if (discountFilter === "no-discount")
        matchesDiscount = product.discount === 0;
      else if (discountFilter === "high-discount")
        matchesDiscount = product.discount >= 20;

      return (
        matchesSearch && matchesBrand && matchesCategory && matchesDiscount
      );
    });

    // Sort by price
    if (priceSort === "low-to-high") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (priceSort === "high-to-low") {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [searchTerm, brandFilter, categoryFilter, priceSort, discountFilter]);

  // Pagination
  const totalPages =
    data?.total && data.pageSize ? Math.ceil(data.total / data.pageSize) : 0;
  const startIndex = (currentPage - 1) * itemsPerPage;

  const resetFilters = () => {
    setSearchTerm("");
    setBrandFilter("all");
    setCategoryFilter("all");
    setPriceSort("none");
    setDiscountFilter("all");
    setCurrentPage(1);
  };

  // Summary statistics
  // const totalProducts = products.length;
  // const inStock = products.filter((p) => p.quantity > 10).length;
  // const lowStock = products.filter(
  //   (p) => p.quantity > 0 && p.quantity <= 10
  // ).length;
  // const outOfStock = products.filter((p) => p.quantity === 0).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Inventory Management
        </h1>
        <p className="text-muted-foreground">
          Manage and track all your products and stock levels
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-800">
                {summary?.totalProducts || 0}
              </div>
              <div className="text-sm text-blue-600 font-medium">
                Total Products
              </div>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-800">
                {summary?.inStocks || 0}
              </div>
              <div className="text-sm text-green-600 font-medium">In Stock</div>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-yellow-800">
                {summary?.lowStocks}
              </div>
              <div className="text-sm text-yellow-600 font-medium">
                Low Stock
              </div>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-lg border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-red-800">
                {summary?.outOfStocks || 0}
              </div>
              <div className="text-sm text-red-600 font-medium">
                Out of Stock
              </div>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
          <CardDescription>
            View and manage all your products with advanced filtering options
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Controls */}
          <div className="space-y-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by product name, brand, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={resetFilters} variant="outline">
                Reset Filters
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Select value={brandFilter} onValueChange={setBrandFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  {brands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priceSort} onValueChange={setPriceSort}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Sorting</SelectItem>
                  <SelectItem value="low-to-high">
                    Price: Low to High
                  </SelectItem>
                  <SelectItem value="high-to-low">
                    Price: High to Low
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={discountFilter} onValueChange={setDiscountFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Discount" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="with-discount">With Discount</SelectItem>
                  <SelectItem value="no-discount">No Discount</SelectItem>
                  <SelectItem value="high-discount">
                    High Discount (20%+)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Subcategory</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Colors</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No products found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => {
                    const stockInfo = getStockStatus(product.quantity);
                    const discountedPrice =
                      product.price * (1 - product.discount / 100);

                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <img
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              className="w-10 h-10 rounded-md object-cover"
                            />
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {product.id}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{/* {product.subcategory} */}</TableCell>
                        <TableCell className="font-medium">
                          {product.brand}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {product.discount > 0 ? (
                              <>
                                <div className="font-medium">
                                  ₦{discountedPrice.toLocaleString()}
                                </div>
                                <div className="text-sm text-muted-foreground line-through">
                                  ₦{product.price.toLocaleString()}
                                </div>
                              </>
                            ) : (
                              <div className="font-medium">
                                ₦{product.price.toLocaleString()}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {product.discount > 0 ? (
                            <Badge
                              variant="secondary"
                              className={getDiscountColor(product.discount)}
                            >
                              {product.discount}% OFF
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">
                              No discount
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {product.quantity}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={cn(stockInfo.color, "text-nowrap")}
                          >
                            <stockInfo.icon className="w-3 h-3 mr-1" />
                            {stockInfo.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {/* {product.colors.slice(0, 3).map((color, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {color}
                              </Badge>
                            ))}
                            {product.colors.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{product.colors.length - 3}
                              </Badge>
                            )} */}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {data?.total && data?.pageSize && totalPages > 1 && (
            <div className="flex items-center justify-between pt-6">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * (data?.pageSize || 0) + 1} to{" "}
                {Math.min(currentPage * data.pageSize, data.total)} of{" "}
                {data?.total} products
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum =
                      currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                    if (pageNum > totalPages) return null;
                    return (
                      <Button
                        key={pageNum}
                        variant={
                          currentPage === pageNum ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-8 h-8 p-0"
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
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
