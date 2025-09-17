"use client";
import { RBACGuard } from "@/components/admin/rbac-guard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import {
  AdminGetProductDto,
  useAdminFetchProducts,
} from "@/lib/services/products/use-admin-fetch-products";
import { useAdminFetchProductsSummary } from "@/lib/services/products/use-admin-fetch-products-summary";
import { useAdminUpdateProduct } from "@/lib/services/products/use-admin-update-product";
import {
  DollarSign,
  Download,
  Edit,
  Eye,
  Loader2,
  Package,
  Percent,
  Search,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";

export default function ProductsAdminPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMerchant, setSelectedMerchant] = useState("all");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [bulkMarkup, setBulkMarkup] = useState("");
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isApplyingBulk, setIsApplyingBulk] = useState(false);
  const [editProduct, setEditProduct] = useState<AdminGetProductDto | null>(
    null
  );
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // const {
  //   products,
  //   loading,
  //   error,
  //   totalPages,
  //   total,
  //   fetchProducts,
  //   updateProduct,
  //   bulkUpdateMarkup,
  // } = useAdminProducts({ limit: 50, page: currentPage });

  const {
    data,
    isLoading: loading,
    refetch,
    error,
  } = useAdminFetchProducts({
    search: searchTerm,
    page: currentPage,
    merchant: selectedMerchant,
    category: selectedCategory,
  });

  const { mutateAsync: updateProductAsync, loading: updateLoading } =
    useAdminUpdateProduct();
  const { data: summary, isPending: summaryLoading } =
    useAdminFetchProductsSummary();
  const products = data?.data || [];

  const totalPages =
    data?.total && data.pageSize ? Math.ceil(data.total / data.pageSize) : 0;
  // Debounced search effect
  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     fetchProducts({
  //       search: searchTerm || undefined,
  //       page: 1,
  //       limit: 50,
  //     });
  //     setCurrentPage(1);
  //   }, 500);

  //   return () => clearTimeout(timeoutId);
  // }, [searchTerm, fetchProducts]);

  // Filter products client-side for category and merchant
  // const filteredProducts = useMemo(() => {
  //   if (!products || !Array.isArray(products)) return [];
  //   return products.filter((product) => {
  //     const matchesCategory =
  //       selectedCategory === "all" || product.category === selectedCategory;
  //     const matchesMerchant =
  //       selectedMerchant === "all" ||
  //       product.merchant.company === selectedMerchant;

  //     return matchesCategory && matchesMerchant;
  //   });
  // }, [products, selectedCategory, selectedMerchant]);

  // Get unique categories and merchants from current products
  const categories = useMemo(() => {
    if (!products || !Array.isArray(products)) return [];
    return Array.from(
      new Set(
        products.flatMap((p) => p.category ?? []) // flatten all category arrays
      )
    ).filter(Boolean) as string[];
  }, [products]);

  const merchants = useMemo(() => {
    if (!products || !Array.isArray(products)) return [];
    return Array.from(new Set(products.map((p) => p.merchant.company))).filter(
      Boolean
    );
  }, [products]);

  // Calculate display price: merchant price - discount + markup
  const getDisplayPrice = (
    merchantPrice: number,
    discount: number,
    markup: number
  ) => {
    const discountAmount = (merchantPrice * discount) / 100;
    const markupAmount = (merchantPrice * markup) / 100;
    return merchantPrice - discountAmount + markupAmount;
  };

  // Handle individual product selection
  const handleProductSelect = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts((prev) => [...prev, productId]);
    } else {
      setSelectedProducts((prev) => prev.filter((id) => id !== productId));
    }
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(products.map((p) => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  // Handle bulk markup application
  const handleBulkMarkup = async () => {
    if (!bulkMarkup || selectedProducts.length === 0) {
      toast({
        title: "Error",
        description: "Please enter markup percentage and select products.",
        variant: "destructive",
      });
      return;
    }

    setIsApplyingBulk(true);

    try {
      // await bulkUpdateMarkup(selectedProducts, Number(bulkMarkup));
      setIsBulkModalOpen(false);
      setBulkMarkup("");
      setSelectedProducts([]);
    } catch (error) {
      console.error("Bulk markup failed:", error);
    } finally {
      setIsApplyingBulk(false);
    }
  };

  const handleEditClick = (product: AdminGetProductDto) => {
    setEditProduct({ ...product });
    setEditModalOpen(true);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditProduct((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async () => {
    if (!editProduct) return;

    try {
      await updateProductAsync({
        productId: editProduct.id,
        productData: {
          name: editProduct.name,
          price: Number(editProduct.price),
          markup: Number(editProduct.markup),
          discount: Number(editProduct.discount),
          quantity: Number(editProduct.quantity),
        },
      }).then(async () => {
        await refetch();
        setEditProduct(null);
        setEditModalOpen(false);
      });
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // fetchProducts({ page, limit: 50 });
  };

  // Calculate summary stats

  const activeProducts =
    products?.filter((p) => p.status === "PUBLISHED").length || 0;
  const totalInventoryValue =
    products?.reduce((sum, p) => sum + (p.price || 0) * (p.quantity || 0), 0) ||
    0;
  const averageMarkup =
    products?.length > 0
      ? products.reduce((sum, p) => sum + (p.markup || 0), 0) / products.length
      : 0;

  if (error) {
    return (
      <RBACGuard permissions={["view_products"]}>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600">
              Error Loading Products
            </h2>
            <p className="text-gray-600 mt-2">{(error as Error)?.message}</p>
            <Button
              onClick={() => refetch()}
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
                  <div className="text-2xl font-bold">
                    {summaryLoading ? (
                      <Skeleton className="h-8 w-16 bg-blue-400" />
                    ) : (
                      (summary?.totalProducts || 0).toLocaleString()
                    )}
                  </div>
                </div>
                <Package className="h-8 w-8 text-blue-200" />
              </div>
              <div className="flex flex-row items-center gap-1 text-xs text-purple-100 mt-1 whitespace-nowrap">
                <span>Total product on inventory</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Active Products</p>
                  <div className="text-2xl font-bold">
                    {summaryLoading ? (
                      <Skeleton className="h-8 w-16 bg-green-400" />
                    ) : (
                      (summary?.activeProducts || 0).toLocaleString()
                    )}
                  </div>
                </div>
                <TrendingUp className="h-8 w-8 text-green-200" />
              </div>
              <div className="flex flex-row items-center gap-1 text-xs text-purple-100 mt-1 whitespace-nowrap">
                <span>Total product on sales</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Inventory Value</p>
                  <div className="text-2xl font-bold">
                    {summaryLoading ? (
                      <Skeleton className="h-8 w-20 bg-purple-400" />
                    ) : (
                      new Intl.NumberFormat("en-NG", {
                        style: "currency",
                        currency: "NGN",
                        notation: "compact",
                        maximumFractionDigits: 1,
                      }).format(summary?.totalInventoryValue || 0)
                    )}
                  </div>
                </div>
                <DollarSign className="h-8 w-8 text-purple-200" />
              </div>
              <div className="flex flex-row items-center gap-1 text-xs text-purple-100 mt-1 whitespace-nowrap">
                <span>Sum of the total products price with quantity</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Avg. Markup</p>
                  <div className="text-2xl font-bold">
                    {summaryLoading ? (
                      <Skeleton className="h-8 w-16 bg-orange-400" />
                    ) : (
                      `${(summary?.averageMarkup || 0).toFixed(1)}%`
                    )}
                  </div>
                </div>
                <Percent className="h-8 w-8 text-orange-200" />
              </div>
              <div className="flex flex-row items-center gap-1 text-xs text-purple-100 mt-1 whitespace-nowrap">
                <span>Total product markup divided by total products</span>
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
                    <SelectItem key={`${category}-${index}`} value={category}>
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
                  {merchants.map((merchant) => (
                    <SelectItem key={merchant} value={merchant}>
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
                Products ({products.length})
                {loading && (
                  <Loader2 className="inline ml-2 h-4 w-4 animate-spin" />
                )}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={
                    selectedProducts.length === products.length &&
                    products.length > 0
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
                          />
                        </div>
                        <p className="text-sm text-gray-600">
                          This will apply {bulkMarkup}% markup to{" "}
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
                    Array.from({ length: 7 }).map((_, i) => (
                      <tr key={i} className="border-b">
                        {Array.from({ length: 11 }).map((_, j) => (
                          <td key={j} className="p-2">
                            <Skeleton className="h-6 w-full" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : products.length === 0 ? (
                    <tr>
                      <td
                        colSpan={11}
                        className="text-center py-8 text-gray-500"
                      >
                        No products found
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
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
                          <p className="font-medium text-sm truncate max-w-[140px]">
                            {product.name}
                          </p>
                        </td>
                        <td className="p-2 text-sm text-gray-600">
                          {product.id.slice(0, 5)}...
                        </td>
                        <td className="p-2">
                          {product.category.map((p) => (
                            <Badge variant="outline" className="mr-2" key={p}>
                              {p}
                            </Badge>
                          ))}
                        </td>
                        <td className="p-2">
                          <Badge variant="secondary" className="text-nowrap">
                            {product.brand || "-"}
                          </Badge>
                        </td>
                        <td className="p-2">
                          <Badge
                            variant={
                              product.merchant.company === "Slot"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {product.merchant.company}
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
                            fallback={
                              <span className="text-sm">{product.markup}%</span>
                            }
                          >
                            <Input
                              type="number"
                              value={product.markup}
                              className="w-20 h-8"
                              min="0"
                              max="100"
                              onChange={(e) => {
                                const newMarkup = Number(e.target.value);
                                // updateProduct(product.id, {
                                //   markup: newMarkup,
                                // });
                              }}
                            />
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
            {!!data?.total && data?.pageSize > 1 && (
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
                    value={editProduct.name}
                    onChange={handleEditChange}
                  />
                </div>
                <div>
                  <Label htmlFor="merchantPrice">Merchant Price</Label>
                  <Input
                    id="merchantPrice"
                    name="price"
                    type="number"
                    value={editProduct.price}
                    onChange={handleEditChange}
                  />
                </div>
                <div>
                  <Label htmlFor="discount">Discount (%)</Label>
                  <Input
                    id="discount"
                    name="discount"
                    type="number"
                    value={editProduct.discount}
                    onChange={handleEditChange}
                  />
                </div>
                <div>
                  <Label htmlFor="markup">Markup (%)</Label>
                  <Input
                    id="markup"
                    name="markup"
                    type="number"
                    value={editProduct.markup}
                    onChange={handleEditChange}
                  />
                </div>
                <div>
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    name="quantity"
                    type="number"
                    value={editProduct.quantity}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="submit" disabled={updateLoading}>
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    disabled={updateLoading}
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
