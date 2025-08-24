
"use client";
import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { RBACGuard } from "@/components/admin/rbac-guard";
import {
  Search,
  Package,
  DollarSign,
  TrendingUp,
  Edit,
  Eye,
  Download,
  Percent,
  Loader2,
} from "lucide-react";
import { useProducts } from "@/lib/services/products/use-products";
import { GetProductDto } from "@/lib/services/products/products";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsAdminPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMerchant, setSelectedMerchant] = useState("all");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [bulkMarkup, setBulkMarkup] = useState("");
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isApplyingBulk, setIsApplyingBulk] = useState(false);
  const [editProduct, setEditProduct] = useState<GetProductDto | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    products,
    loading,
    error,
    totalPages,
    total,
    fetchProducts,
    updateProduct,
    bulkUpdateMarkup,
  } = useProducts({ limit: 50, page: currentPage });

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProducts({
        search: searchTerm || undefined,
        page: 1,
        limit: 50,
      });
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, fetchProducts]);

  // Helper function to safely extract string value from any type
  const safeStringValue = (value: any): string => {
    if (value === null || value === undefined) return "";
    if (typeof value === "string") return value.trim();
    if (typeof value === "object") {
      // Try to extract meaningful string from object
      if (value.company) return String(value.company).trim();
      if (value.name) return String(value.name).trim();
      if (value.storeName) return String(value.storeName).trim();
      if (value.title) return String(value.title).trim();
      return "";
    }
    return String(value).trim();
  };

  // Helper function to safely extract number value
  const safeNumberValue = (value: any): number => {
    if (value === null || value === undefined) return 0;
    if (typeof value === "number" && !isNaN(value)) return value;
    if (typeof value === "string") {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  // Helper function to safely format currency
  const formatCurrency = (value: any): string => {
    const numValue = safeNumberValue(value);
    if (numValue === 0) return "₦0";
    return `₦${numValue.toLocaleString()}`;
  };

  // Helper function to safely display category
  const getCategory = (category: any): string => {
    const cat = safeStringValue(category);
    return cat || "Uncategorized";
  };

  // Helper function to safely display merchant
  const getMerchant = (merchant: any): string => {
    const merchantName = safeStringValue(merchant);
    return merchantName || "Unknown";
  };

  // Helper function to safely get product ID
  const getProductId = (product: any): string => {
    return safeStringValue(product?.id) || `product-${Date.now()}`;
  };

  // Helper function to safely get product name
  const getProductName = (product: any): string => {
    return safeStringValue(product?.name) || "Unnamed Product";
  };

  // Helper function to safely get SKU
  const getProductSku = (product: any): string => {
    return safeStringValue(product?.sku) || "N/A";
  };

  // Helper function to safely get stock/quantity
  const getStock = (product: any): number => {
    return Math.max(0, safeNumberValue(product?.stock || product?.quantity));
  };

  // Helper function to safely get price
  const getPrice = (product: any): number => {
    return Math.max(0, safeNumberValue(product?.merchantPrice || product?.price));
  };

  // Helper function to safely get discount
  const getDiscount = (product: any): number => {
    return Math.max(0, Math.min(100, safeNumberValue(product?.discount)));
  };

  // Helper function to safely get markup
  const getMarkup = (product: any): number => {
    return Math.max(0, Math.min(100, safeNumberValue(product?.markup)));
  };

  // Safe products array
  const safeProducts = useMemo(() => {
    if (!products || !Array.isArray(products)) return [];
    return products.filter(product => product && typeof product === 'object');
  }, [products]);

  // Filter products client-side for category and merchant
  const filteredProducts = useMemo(() => {
    return safeProducts.filter((product) => {
      const productCategory = getCategory(product.category);
      const productMerchant = getMerchant(product.merchant);
      
      const matchesCategory =
        selectedCategory === "all" || 
        productCategory.toLowerCase().includes(selectedCategory.toLowerCase());
      
      const matchesMerchant =
        selectedMerchant === "all" ||
        product.merchant.company === selectedMerchant;

      return matchesCategory && matchesMerchant;
    });
  }, [safeProducts, selectedCategory, selectedMerchant]);

  // Get unique categories and merchants from current products
  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    safeProducts.forEach(product => {
      const category = getCategory(product.category);
      if (category && category !== "Uncategorized") {
        categorySet.add(category);
      }
    });
    return Array.from(categorySet).sort();
  }, [safeProducts]);

  const merchants = useMemo(() => {
    if (!products || !Array.isArray(products)) return [];
    return Array.from(new Set(products.map((p) => p.seller.shopName))).filter(
      Boolean
    );
  }, [products]);

  // Calculate display price: merchant price - discount + markup
  const getDisplayPrice = (product: any) => {
    const merchantPrice = getPrice(product);
    const discount = getDiscount(product);
    const markup = getMarkup(product);
    
    if (merchantPrice === 0) return 0;
    
    const discountAmount = (merchantPrice * discount) / 100;
    const markupAmount = (merchantPrice * markup) / 100;
    return Math.max(0, merchantPrice - discountAmount + markupAmount);
  };

  // Handle individual product selection
  const handleProductSelect = (productId: string, checked: boolean) => {
    if (!productId) return;
    
    if (checked) {
      setSelectedProducts((prev) => {
        if (!prev.includes(productId)) {
          return [...prev, productId];
        }
        return prev;
      });
    } else {
      setSelectedProducts((prev) => prev.filter((id) => id !== productId));
    }
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const validIds = filteredProducts
        .map(p => getProductId(p))
        .filter(id => id && id !== `product-${Date.now()}`);
      setSelectedProducts(validIds);
    } else {
      setSelectedProducts([]);
    }
  };

  // Handle bulk markup application
  const handleBulkMarkup = async () => {
    const markupValue = safeNumberValue(bulkMarkup);
    
    if (markupValue <= 0 || selectedProducts.length === 0) {
      toast({
        title: "Error",
        description: "Please enter a valid markup percentage and select products.",
        variant: "destructive",
      });
      return;
    }

    setIsApplyingBulk(true);

    try {
      await bulkUpdateMarkup(selectedProducts, markupValue);
      setIsBulkModalOpen(false);
      setBulkMarkup("");
      setSelectedProducts([]);
      toast({
        title: "Success",
        description: `Applied ${markupValue}% markup to ${selectedProducts.length} products.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to apply bulk markup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsApplyingBulk(false);
    }
  };

  const handleEditClick = (product: GetProductDto) => {
    if (!product) return;
    setEditProduct({ ...product });
    setEditModalOpen(true);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditProduct((prev: any) => {
      if (!prev) return null;
      return { ...prev, [name]: value };
    });
  };

  const handleEditSave = async () => {
    if (!editProduct) return;

    try {
      const updateData = {
        name: safeStringValue(editProduct.name) || "Unnamed Product",
        merchantPrice: safeNumberValue(editProduct.merchantPrice || editProduct.price),
        markup: safeNumberValue(editProduct.markup),
        discount: safeNumberValue(editProduct.discount),
        stock: safeNumberValue(editProduct.stock || editProduct.quantity),
      };

      await updateProduct(editProduct.id, updateData);
      setEditModalOpen(false);
      setEditProduct(null);
      toast({
        title: "Success",
        description: "Product updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || (totalPages && page > totalPages)) return;
    setCurrentPage(page);
    fetchProducts({ page, limit: 50 });
  };

  const handleMarkupChange = async (product: any, newMarkup: string) => {
    const markupValue = safeNumberValue(newMarkup);
    if (markupValue < 0 || markupValue > 100) return;

    try {
      await updateProduct(getProductId(product), { markup: markupValue });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update markup.",
        variant: "destructive",
      });
    }
  };

  // Calculate summary stats
  const totalProducts = safeNumberValue(total);
  const activeProducts = safeProducts.filter((p) => 
    safeStringValue(p.status).toLowerCase() === "active"
  ).length;
  
  const totalInventoryValue = safeProducts.reduce((sum, p) => {
    const price = getPrice(p);
    const stock = getStock(p);
    return sum + (price * stock);
  }, 0);
  
  const averageMarkup = safeProducts.length > 0 
    ? safeProducts.reduce((sum, p) => sum + getMarkup(p), 0) / safeProducts.length 
    : 0;

  if (error) {
    return (
      <RBACGuard permissions={["view_products"]}>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600">Error Loading Products</h2>
            <p className="text-gray-600 mt-2">{String(error)}</p>
            <Button 
              onClick={() => fetchProducts()} 
              className="mt-4"
              variant="outline"
            >
              Try Again
            </Button>
          </div>
        </div>
      </RBACGuard>
    );
  }

  return (
    <RBACGuard permissions={["view_products"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Products Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage pricing and markup for all merchant products
            </p>
          </div>
          <RBACGuard permissions={["manage_products"]} requireAll={false}>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </RBACGuard>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Products</p>
                  <p className="text-2xl font-bold">
                    {loading ? (
                      <Skeleton className="h-8 w-16 bg-blue-400" />
                    ) : (
                      (totalProducts || 0).toLocaleString()
                    )}
                  </p>
                </div>
                <Package className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Active Products</p>
                  <p className="text-2xl font-bold">
                    {loading ? (
                      <Skeleton className="h-8 w-16 bg-green-400" />
                    ) : (
                      (activeProducts || 0).toLocaleString()
                    )}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Inventory Value</p>
                  <p className="text-2xl font-bold">
                    {loading ? (
                      <Skeleton className="h-8 w-16 bg-purple-400" />
                    ) : (
                      `₦${((totalInventoryValue || 0) / 1000000).toFixed(1)}M`
                    )}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Avg. Markup</p>
                  <p className="text-2xl font-bold">
                    {loading ? (
                      <Skeleton className="h-8 w-16 bg-orange-400" />
                    ) : (
                      `${(averageMarkup || 0).toFixed(1)}%`
                    )}
                  </p>
                </div>
                <Percent className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search products, SKU, or merchant..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category, index) => (
                    <SelectItem key={`category-${index}`} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={selectedMerchant}
                onValueChange={setSelectedMerchant}
              >
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Merchant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Merchants</SelectItem>
                  {merchants.map((merchant, index) => (
                    <SelectItem key={`merchant-${index}`} value={merchant}>
                      {merchant}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                Products ({filteredProducts.length})
                {loading && <Loader2 className="inline ml-2 h-4 w-4 animate-spin" />}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={
                    selectedProducts.length === filteredProducts.length &&
                    filteredProducts.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm text-gray-600">Select All</span>
                <RBACGuard permissions={["manage_products"]} requireAll={false}>
                  <Dialog
                    open={isBulkModalOpen}
                    onOpenChange={setIsBulkModalOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        disabled={selectedProducts.length === 0}
                        className="w-30 min-w-0 px-2 text-xs whitespace-nowrap overflow-hidden text-ellipsis"
                      >
                        <Percent className="h-4 w-4 mr-1" />
                        Bulk Markup
                        <span className="ml-1">
                          ({selectedProducts.length})
                        </span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Apply Bulk Markup</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="bulkMarkup">Markup Percentage</Label>
                          <Input
                            id="bulkMarkup"
                            type="number"
                            placeholder="Enter markup %"
                            value={bulkMarkup}
                            onChange={(e) => setBulkMarkup(e.target.value)}
                            min="0"
                            max="100"
                          />
                        </div>
                        <p className="text-sm text-gray-600">
                          This will apply {safeNumberValue(bulkMarkup)}% markup to{" "}
                          {selectedProducts.length} selected products.
                        </p>
                        <div className="flex gap-2">
                          <Button
                            onClick={handleBulkMarkup}
                            disabled={isApplyingBulk}
                          >
                            {isApplyingBulk ? "Applying..." : "Apply Markup"}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setIsBulkModalOpen(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </RBACGuard>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-sm">
                    <th className="text-left p-2">Select</th>
                    <th className="text-left p-2">Product</th>
                    <th className="text-left p-2">Product ID</th>
                    <th className="text-left p-2">Category</th>
                    <th className="text-left p-2">Brand</th>
                    <th className="text-left p-2">Merchant</th>
                    <th className="text-left p-2">Merchant Price</th>
                    <th className="text-left p-2">Discount (%)</th>
                    <th className="text-left p-2">Markup %</th>
                    <th className="text-left p-2">Display Price</th>
                    <th className="text-left p-2">Quantity</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="border-b">
                        {Array.from({ length: 11 }).map((_, j) => (
                          <td key={j} className="p-2">
                            <Skeleton className="h-4 w-full" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="text-center py-8 text-gray-500">
                        No products found
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="p-2">
                          <Checkbox
                            checked={selectedProducts.includes(product.id)}
                            onCheckedChange={(checked) =>
                              handleProductSelect(
                                product.id,
                                checked as boolean
                              )
                            }
                          />
                        </td>
                        <td className="p-2">
                          <p className="font-medium">{product.name}</p>
                        </td>
                        <td className="p-2 text-sm text-gray-600">
                          {product.id.slice(0, 5)}...
                        </td>
                        <td className="p-2">
                          <Badge variant="outline">{product.category}</Badge>
                        </td>
                        <td className="p-2">
                          <Badge
                            variant={
                              product.seller.shopName === "Slot"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {product.seller.shopName}
                          </Badge>
                        </td>
                        <td className="p-2 font-regular text-sm">
                          ₦{(product.price || 0).toLocaleString()}
                        </td>
                        <td className="p-2 font-regular text-sm">
                          {product.discount}%
                        </td>
                        <td className="p-2">
                          <RBACGuard
                            permissions={["manage_products"]}
                            requireAll={false}
                          >
                            <Input
                              type="number"
                              value={product.markup}
                              className="w-20 h-8"
                              min="0"
                              max="100"
                              onChange={(e) => {
                                const newMarkup = Number(e.target.value);
                                updateProduct(product.id, {
                                  markup: newMarkup,
                                });
                              }}
                            />
                          </RBACGuard>
                          <RBACGuard
                            permissions={["manage_products"]}
                            requireAll={false}
                            fallback={
                              <span className="text-sm">{product.markup}%</span>
                            }
                          >
                            <span className="text-sm">{product.markup}%</span>
                          </RBACGuard>
                        </td>
                        <td className="p-2 font-medium text-sm text-green-600">
                          ₦
                          {getDisplayPrice(
                            product.price || 0,
                            product.discount || 0,
                            product.markup || 0
                          ).toLocaleString()}
                        </td>
                        <td className="p-2">
                          <Badge
                            variant={
                              product.quantity > 10 ? "default" : "destructive"
                            }
                          >
                            {product.quantity}
                          </Badge>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <RBACGuard
                              permissions={["manage_products"]}
                              requireAll={false}
                            >
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditClick(product)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </RBACGuard>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || loading}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || loading}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Product Modal */}
        <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>
            {editProduct && (
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleEditSave();
                }}
              >
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={safeStringValue(editProduct.name)}
                    onChange={handleEditChange}
                  />
                </div>
                <div>
                  <Label htmlFor="merchantPrice">Merchant Price</Label>
                  <Input
                    id="merchantPrice"
                    name="merchantPrice"
                    type="number"
                    value={safeNumberValue(editProduct.merchantPrice || editProduct.price)}
                    onChange={handleEditChange}
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="discount">Discount (%)</Label>
                  <Input
                    id="discount"
                    name="discount"
                    type="number"
                    value={safeNumberValue(editProduct.discount)}
                    onChange={handleEditChange}
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <Label htmlFor="markup">Markup (%)</Label>
                  <Input
                    id="markup"
                    name="markup"
                    type="number"
                    value={safeNumberValue(editProduct.markup)}
                    onChange={handleEditChange}
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    value={safeNumberValue(editProduct.stock || editProduct.quantity)}
                    onChange={handleEditChange}
                    min="0"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="submit">Save</Button>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </RBACGuard>
  );
}
