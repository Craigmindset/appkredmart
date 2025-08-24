
import { backendAxios } from "@/lib/backendaxios";
export interface GetProductDto {
  id: string;
  productName: string; // Matches inventory.tsx
  description: string;
  sku: string;
  category: string;
  brand?: string;
  merchant: { company: string };
  label?: string;
  specs?: string[];
  price: number;
  discount?: number; 
  markup?: number; 
  currentStock: number; // Matches inventory.tsx (replaces quantity)
  stockLevel: number; // Matches inventory.tsx
  status: "Active" | "Inactive" | "Out of Stock" | "Low Stock" | "Well Stocked"; // Expanded to match getStatusBadge
  images: string[];
  thumbnail?: string;
  deals?: "Kredmart deals" | "Flash Sale" | string; // Matches inventory.tsx
  bestPrice?: boolean; // Matches inventory.tsx
  lastRestocked?: string; // Matches inventory.tsx
  slug?: string;
  unit?: string | null;
  minPurchase?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

// export interface GetProductDto {
//   id: string;
//   name: string;
//   description: string;
//   sku: string;
//   category: string;
//   brand?: string; // Added brand field (optional for now)
//   merchant: {
//     company: string;
//   };
//   label?: string;
//   specs?: string[];
//   price: number;
//   discount: number;
//   markup: number;
//   quantity: number;
//   status: "Active" | "Inactive";
//   images: string[];
//   image?: string;
//   createdAt?: string;
//   updatedAt?: string;
//   // Additional fields from API response
//   slug?: string;
//   unit?: string | null;
//   minPurchase?: number | null;
//   images?: string[];
//   price?: number | null;
//   quantity?: number;
//   thumbnail?: string;
//   description?: string;
// }

// export interface ProductsResponse {
//   data: GetProductDto[];
//   total: number;
//   page: number;
//   limit: number;
//   totalPages: number;
// }

// export interface ProductsQueryParams {
//   search?: string;
//   sortBy?: "createdAt" | "updatedAt";
//   limit?: number;
//   page?: number;
// }
export interface ProductsResponse {
  data: GetProductDto[];
  total: number;
  page: number;
  pageSize: number; // Changed from limit
  totalPages: number;
}

export interface ProductsQueryParams {
  search?: string;
  sortBy?: "createdAt" | "updatedAt";
  limit?: number;
  page?: number;
}
class ProductsService {
  private baseUrl = "/api/products";

  async getProducts(
    params: ProductsQueryParams = {}
  ): Promise<ProductsResponse> {
    const queryParams = new URLSearchParams();

    if (params.search) queryParams.append("search", params.search);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.limit) queryParams.append("pageSize", params.limit.toString());
    if (params.page) queryParams.append("page", params.page.toString());

    const fullUrl = `${this.baseUrl}?${queryParams.toString()}`;
    const response = await backendAxios.get(fullUrl);
    return response.data;
  }

  async getProductById(id: string): Promise<GetProductDto> {
    const response = await backendAxios.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async getAllProducts(): Promise<GetProductDto[]> {
    const response = await backendAxios.get(this.baseUrl);
    return response.data;
  }

  async updateProduct(
    id: string,
    data: Partial<GetProductDto>
  ): Promise<GetProductDto> {
    const response = await backendAxios.put(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  async bulkUpdateMarkup(productIds: string[], markup: number): Promise<void> {
    const response = await backendAxios.patch(`${this.baseUrl}/bulk-markup`, {
      productIds,
      markup,
    });
    return response.data;
  }
}

export const productsService = new ProductsService();
