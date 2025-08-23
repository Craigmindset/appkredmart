import { backendAxios } from "@/lib/backendaxios";

export interface InventoryItem {
  id: string;
  productName: string;
  category: string;
  merchant: { company: string };
  currentStock: number;
  minStock: number;
  maxStock: number;
  price: number;
  deals?: string | null;
  bestPrice: boolean;
  lastRestocked: string;
  status: "Out of Stock" | "Low Stock" | "Normal" | "Well Stocked";
  stockLevel: number;
}


export interface InventoryResponse {
  data: InventoryItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface InventoryQueryParams {
  search?: string;
  merchant?: string;
  category?: string;
  deals?: string;
  priceType?: string;
  limit?: number;
  page?: number;
}

// Helper function to transform product data to inventory format
function transformProductToInventory(product: any): InventoryItem {
  const currentStock = product.stock || product.quantity || 0;
  const stockLevel = Math.min((currentStock / 100) * 100, 100); // Assuming max stock is 100 for percentage calculation

  let status: "Out of Stock" | "Low Stock" | "Normal" | "Well Stocked";
  if (currentStock === 0) status = "Out of Stock";
  else if (currentStock <= 10) status = "Low Stock";
  else if (currentStock <= 50) status = "Normal";
  else status = "Well Stocked";

  const price = product.merchantPrice || product.price || 0;
  const discount = product.discount || 0;

  return {
    id: product.id,
    productName: product.name || "Unknown Product",
    category: product.category || "Uncategorized",
    merchant: product.merchant || "Unknown",
    currentStock,
    minStock: product.minPurchase || 5, // Use minPurchase from API or default
    maxStock: 100, // Default max stock
    price,
    deals: discount > 0 ? "Kredmart deals" : null,
    bestPrice: discount > 15, // Consider products with >15% discount as best price
    lastRestocked:
      product.updatedAt || product.createdAt || new Date().toISOString(),
    status,
    stockLevel: Math.max(stockLevel, 0),
  };
}

class InventoryService {
  private baseUrl = "/api/products";

  async getInventory(
    params: InventoryQueryParams = {},
  ): Promise<InventoryResponse> {
    const queryParams = new URLSearchParams();

    if (params.search) queryParams.append("search", params.search);
    if (params.merchant && params.merchant !== "All")
      queryParams.append("merchant", params.merchant);
    if (params.category && params.category !== "All")
      queryParams.append("category", params.category);
    if (params.limit) queryParams.append("pageSize", params.limit.toString());
    if (params.page) queryParams.append("page", params.page.toString());

    const fullUrl = `${this.baseUrl}?${queryParams.toString()}`;
    const response = await backendAxios.get(fullUrl);
    const data = response.data;

    // Transform products data to inventory format
    const transformedData = data.data.map(transformProductToInventory);

    // Filter by deals and price type if specified
    let filteredData = transformedData;

    if (params.deals && params.deals !== "All") {
      if (params.deals === "No Deals") {
        filteredData = filteredData.filter(
          (item: InventoryItem) => !item.deals,
        );
      } else {
        filteredData = filteredData.filter(
          (item: InventoryItem) => item.deals === params.deals,
        );
      }
    }

    if (params.priceType && params.priceType !== "All") {
      if (params.priceType === "Best Price") {
        filteredData = filteredData.filter(
          (item: InventoryItem) => item.bestPrice,
        );
      } else if (params.priceType === "Regular Price") {
        filteredData = filteredData.filter(
          (item: InventoryItem) => !item.bestPrice,
        );
      }
    }

    return {
      data: filteredData,
      total: data.total,
      page: data.page,
      pageSize: data.pageSize,
      totalPages: data.totalPages,
    };
  }

  async getInventoryStats(): Promise<{
    totalProducts: number;
    outOfStock: number;
    lowStock: number;
    wellStocked: number;
  }> {
    // Get all products to calculate stats
    const response = await backendAxios.get(this.baseUrl);
    const data = response.data;
    const products = data.data || [];

    const stats = {
      totalProducts: products.length,
      outOfStock: products.filter(
        (p: any) => (p.stock || p.quantity || 0) === 0,
      ).length,
      lowStock: products.filter((p: any) => {
        const stock = p.stock || p.quantity || 0;
        return stock > 0 && stock <= 10;
      }).length,
      wellStocked: products.filter(
        (p: any) => (p.stock || p.quantity || 0) > 50,
      ).length,
    };

    return stats;
  }
}

export const inventoryService = new InventoryService();
