"use client";
import { useState } from "react";
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
} from "lucide-react";

// Demo data
const demoProducts = Array.from({ length: 50 }, (_, i) => ({
  id: `PRD${String(i + 1).padStart(3, "0")}`,
  name: [
    "iPhone 14 Pro Max",
    "Samsung Galaxy S23",
    "MacBook Air M2",
    "Dell XPS 13",
    "Sony WH-1000XM4",
    "AirPods Pro",
    'iPad Pro 12.9"',
    "Surface Pro 9",
    "Canon EOS R5",
    "Nintendo Switch OLED",
    "PlayStation 5",
    "Xbox Series X",
    "Apple Watch Series 8",
    "Fitbit Versa 4",
    "Kindle Paperwhite",
    "Echo Dot 5th Gen",
  ][i % 16],
  sku: `SKU${String(i + 1).padStart(6, "0")}`,
  category: ["Phones and Tablets", "Computing", "Electronics", "Accessories"][
    i % 4
  ],
  merchant: ["Slot", "Gbam Inc."][i % 2],
  merchantPrice: Math.floor(Math.random() * 500000) + 50000,
  discount: Math.floor(Math.random() * 21),
  markup: Math.floor(Math.random() * 30) + 5,
  stock: Math.floor(Math.random() * 100) + 1,
  status: ["Active", "Inactive"][Math.floor(Math.random() * 2)],
  image: `/placeholder.svg?height=60&width=60&text=Product${i + 1}`,
}));

export default function ProductsAdminPage() {
  const [products] = useState(demoProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMerchant, setSelectedMerchant] = useState("all");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [bulkMarkup, setBulkMarkup] = useState("");
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isApplyingBulk, setIsApplyingBulk] = useState(false);

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.merchant.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchesMerchant =
      selectedMerchant === "all" || product.merchant === selectedMerchant;

    return matchesSearch && matchesCategory && matchesMerchant;
  });

  // Calculate display price
  const getDisplayPrice = (merchantPrice: number, markup: number) => {
    return merchantPrice + (merchantPrice * markup) / 100;
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
      setSelectedProducts(filteredProducts.map((p) => p.id));
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

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Markup Applied",
      description: `Applied ${bulkMarkup}% markup to ${selectedProducts.length} products.`,
    });

    setIsBulkModalOpen(false);
    setBulkMarkup("");
    setSelectedProducts([]);
    setIsApplyingBulk(false);
  };

  // Calculate summary stats
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.status === "Active").length;
  const totalInventoryValue = products.reduce(
    (sum, p) => sum + p.merchantPrice * p.stock,
    0
  );
  const averageMarkup =
    products.reduce((sum, p) => sum + p.markup, 0) / products.length;

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
              <Dialog open={isBulkModalOpen} onOpenChange={setIsBulkModalOpen}>
                <DialogTrigger asChild>
                  <Button disabled={selectedProducts.length === 0}>
                    <Percent className="h-4 w-4 mr-2" />
                    Bulk Markup ({selectedProducts.length})
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
                    {totalProducts.toLocaleString()}
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
                    {activeProducts.toLocaleString()}
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
                    ₦{(totalInventoryValue / 1000000).toFixed(1)}M
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
                    {averageMarkup.toFixed(1)}%
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
                  <SelectItem value="Phones and Tablets">
                    Phones and Tablets
                  </SelectItem>
                  <SelectItem value="Computing">Computing</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Accessories">Accessories</SelectItem>
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
                  <SelectItem value="Slot">Slot</SelectItem>
                  <SelectItem value="Gbam Inc.">Gbam Inc.</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Products ({filteredProducts.length})</CardTitle>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={
                    selectedProducts.length === filteredProducts.length &&
                    filteredProducts.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm text-gray-600">Select All</span>
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
                    <th className="text-left p-2">Merchant</th>
                    <th className="text-left p-2">Merchant Price</th>
                    <th className="text-left p-2">Discount (%)</th>
                    <th className="text-left p-2">Markup %</th>
                    <th className="text-left p-2">Display Price</th>
                    <th className="text-left p-2">Stock</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        <Checkbox
                          checked={selectedProducts.includes(product.id)}
                          onCheckedChange={(checked) =>
                            handleProductSelect(product.id, checked as boolean)
                          }
                        />
                      </td>
                      <td className="p-2">
                        <p className="font-medium">{product.name}</p>
                      </td>
                      <td className="p-2 text-sm text-gray-600">
                        {product.sku}
                      </td>
                      <td className="p-2">
                        <Badge variant="outline">{product.category}</Badge>
                      </td>
                      <td className="p-2">
                        <Badge
                          variant={
                            product.merchant === "Slot"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {product.merchant}
                        </Badge>
                      </td>
                      <td className="p-2 font-medium">
                        ₦{product.merchantPrice.toLocaleString()}
                      </td>
                      <td className="p-2 font-medium">{product.discount}%</td>
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
                          />
                        </RBACGuard>
                        <RBACGuard
                          permissions={["manage_products"]}
                          requireAll={false}
                          fallback={
                            <span className="text-sm">{product.markup}%</span>
                          }
                        />
                      </td>
                      <td className="p-2 font-bold text-green-600">
                        ₦
                        {getDisplayPrice(
                          product.merchantPrice,
                          product.markup
                        ).toLocaleString()}
                      </td>
                      <td className="p-2">
                        <Badge
                          variant={
                            product.stock > 10 ? "default" : "destructive"
                          }
                        >
                          {product.stock}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <Badge
                          variant={
                            product.status === "Active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {product.status}
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
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </RBACGuard>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </RBACGuard>
  );
}
