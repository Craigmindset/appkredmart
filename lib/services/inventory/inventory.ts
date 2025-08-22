
import { backendAxios } from "@/lib/backendaxios";

export interface InventoryItem {
  id: string;
  productName: string;
  category: string;
  merchant: string;
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
  const stockLevel = (product.stock / 100) * 100; // Assuming max stock is 100 for percentage calculation
  
  let status: "Out of Stock" | "Low Stock" | "Normal" | "Well Stocked";
  if (product.stock === 0) status = "Out of Stock";
  else if (product.stock <= 10) status = "Low Stock";
  else if (product.stock <= 50) status = "Normal";
  else status = "Well Stocked";

  return {
    id: product.id,
    productName: product.name,
    category: product.category,
    merchant: product.merchant,
    currentStock: product.stock,
    minStock: 5, // Default min stock
    maxStock: 100, // Default max stock
    price: product.merchantPrice,
    deals: product.discount > 0 ? "Kredmart deals" : null,
    bestPrice: product.discount > 15, // Consider products with >15% discount as best price
    lastRestocked: product.updatedAt || product.createdAt || new Date().toISOString(),
    status,
    stockLevel: Math.min(stockLevel, 100)
  };
}

class InventoryService {
  private baseUrl = "/api/products";

  async getInventory(params: InventoryQueryParams = {}): Promise<InventoryResponse> {
    const queryParams = new URLSearchParams();

    if (params.search) queryParams.append("search", params.search);
    if (params.merchant && params.merchant !== "All") queryParams.append("merchant", params.merchant);
    if (params.category && params.category !== "All") queryParams.append("category", params.category);
    if (params.limit) queryParams.append("pageSize", params.limit.toString());
    if (params.page) queryParams.append("page", params.page.toString());

    const fullUrl = `${this.baseUrl}?${queryParams.toString()}`;
    const response = await backendAxios.get(fullUrl);
    
    // Transform products data to inventory format
    const transformedData = response.data.data.map(transformProductToInventory);
    
    // Filter by deals and price type if specified
    let filteredData = transformedData;
    
    if (params.deals && params.deals !== "All") {
      if (params.deals === "No Deals") 
        {
        filteredData = filteredData.filter((item: InventoryItem) => !item.deals);
      } else {
        filteredData = filteredData.filter((item: InventoryItem) => item.deals === params.deals);
      }
    }
    
    if (params.priceType && params.priceType !== "All") {
      if (params.priceType === "Best Price") {
        filteredData = filteredData.filter((item: InventoryItem) => item.bestPrice);
      } else if (params.priceType === "Regular Price") {
        filteredData = filteredData.filter((item: InventoryItem) => !item.bestPrice);
      }
    }

    return {
      data: filteredData,
      total: response.data.total,
      page: response.data.page,
      pageSize: response.data.pageSize,
      totalPages: response.data.totalPages
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
    const products = response.data.data || [];
    
    const stats = {
      totalProducts: products.length,
      outOfStock: products.filter((p: any) => p.stock === 0).length,
      lowStock: products.filter((p: any) => p.stock > 0 && p.stock <= 10).length,
      wellStocked: products.filter((p: any) => p.stock > 50).length
    };

    return stats;
  }
}

export const inventoryService = new InventoryService();
