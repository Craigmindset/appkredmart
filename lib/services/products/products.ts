import { backendAxios } from "@/lib/backendaxios";

export interface GetProductDto {
  id: string;
  name: string;
  sku: string;
  category: string;
  merchant: string;
  merchantPrice: number;
  discount: number;
  markup: number;
  stock: number;
  status: "Active" | "Inactive";
  image?: string;
  createdAt?: string;
  updatedAt?: string;
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

  async getProducts(params: ProductsQueryParams = {}): Promise<ProductsResponse> {
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

  async updateProduct(id: string, data: Partial<GetProductDto>): Promise<GetProductDto> {
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