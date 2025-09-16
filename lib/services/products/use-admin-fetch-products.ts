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
  merchant?: string;
  brand?: string;
  offset?: number;
  limit?: number;
  page?: number;
  search?: string;
  sortBy?: string;
  order?: "asc" | "desc";
  category?: string;
};

export const getAdminProducts = async (params?: GetProductsParams) => {
  const response = await backendAxios.get("/admin/products", { params });
  return response.data;
};

export const useAdminFetchProducts = (params?: GetProductsParams) => {
  const {
    page = 1,
    offset = 0,
    limit = 20,

    ...otherParams
  } = params || {};

  const formattedParams = {
    page,
    offset,
    limit,
    ...otherParams,
  };

  return useQuery<ProductsResponseDto>({
    queryKey: ["ADMIN_PRODUCTS", formattedParams],
    queryFn: async () => await getAdminProducts(formattedParams),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
};
