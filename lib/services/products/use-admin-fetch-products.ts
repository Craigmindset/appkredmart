import { backendAxios } from "@/lib/backendaxios";
import { useQuery } from "@tanstack/react-query";

export interface AdminGetProductDto {
  id: string;
  name: string;
  description: string;
  sku: string;
  category: string[];
  brand?: string; // Added brand field (optional for now)
  merchant: {
    company: string;
  };
  label?: string;
  specs?: string[];
  price: number;
  discount: number;
  markup: number;
  quantity: number;
  status: "DRAFT" | "PUBLISHED" | "REJECTED";
  images: string[];
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type ProductsResponseDto = {
  data: AdminGetProductDto[];
  total: number;
  page: number;
  pageSize: number;
};

type GetProductsParams = {
  offset?: number;
  limit?: number;
  page?: number;
  search?: string;
};

export const getAdminProducts = async (params?: GetProductsParams) => {
  const response = await backendAxios.get("/admin/products", { params });
  return response.data;
};

export const useAdminFetchProducts = (params?: GetProductsParams) => {
  const { page = 1, offset = 0, limit = 20, search } = params || {};

  return useQuery<ProductsResponseDto>({
    queryKey: ["ADMIN_PRODUCTS", { offset, limit, search, page }],
    queryFn: async () =>
      await getAdminProducts({ offset, limit, search, page }),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
};
