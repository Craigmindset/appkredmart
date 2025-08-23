
import { backendAxios } from "@/lib/backendaxios";

export interface GetProductDto {
  id: string;
  name: string;
  sku?: string;
  category?: string | null;
  merchant?: string | null | undefined;
  merchantPrice?: number | null;
  discount?: number;
  markup?: number;
  stock?: number;
  status?: "Active" | "Inactive";
  image?: string;
  createdAt?: string;
  updatedAt?: string;
  // Additional fields from API response
  slug?: string;
  unit?: string | null;
  minPurchase?: number | null;
  images?: string[];
  price?: number | null;
  quantity?: number;
  thumbnail?: string;
  description?: string;
}

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


// class ProductsService {
//   private baseUrl = "/api/products";

//   async getProducts(params: ProductsQueryParams = {}): Promise<ProductsResponse> {
//     const queryParams = new URLSearchParams();
    
//     if (params.search) queryParams.append("search", params.search);
//     if (params.sortBy) queryParams.append("sortBy", params.sortBy);
//     if (params.limit) queryParams.append("limit", params.limit.toString());
//     if (params.page) queryParams.append("page", params.page.toString());

//     const fullUrl = `${this.baseUrl}?${queryParams.toString()}`;
//     console.log("🔍 Fetching products from URL:", fullUrl);
//     console.log("🌐 Backend axios baseURL:", backendAxios.defaults.baseURL);
//     console.log("📋 Complete URL will be:", `${backendAxios.defaults.baseURL}${fullUrl}`);

//     const response = await backendAxios.get(fullUrl);
//     return response.data;
//   }

//   async getProductById(id: string): Promise<GetProductDto> {
//     const response = await backendAxios.get(`${this.baseUrl}/${id}`);
//     return response.data;
//   }

//   async getAllProducts(): Promise<GetProductDto[]> {
//     // Get all products without pagination
//     const response = await backendAxios.get(this.baseUrl);
//     return response.data;
//   }

//   async updateProduct(id: string, data: Partial<GetProductDto>): Promise<GetProductDto> {
//     const response = await backendAxios.put(`${this.baseUrl}/${id}`, data);
//     return response.data;
//   }

//   async bulkUpdateMarkup(productIds: string[], markup: number): Promise<void> {
//     const response = await backendAxios.patch(`${this.baseUrl}/bulk-markup`, {
//       productIds,
//       markup,
//     });
//     return response.data;
//   }

//   // Test method with hardcoded URL
//   async testHardcodedUrl(): Promise<any> {
//     const hardcodedUrl = "http://203.161.57.75/api/products";
//     console.log("🧪 Testing hardcoded URL:", hardcodedUrl);
    
//     try {
//       // Using fetch to bypass axios configuration
//       const response = await fetch(hardcodedUrl, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//       });
      
//       console.log("✅ Response status:", response.status);
//       console.log("📄 Response headers:", Object.fromEntries(response.headers.entries()));
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const data = await response.json();
//       console.log("📦 Response data:", data);
//       return data;
//     } catch (error) {
//       console.error("❌ Hardcoded URL test failed:", error);
//       throw error;
//     }
//   }
// }

// export const productsService = new ProductsService();
