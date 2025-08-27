import { backendAxios } from "@/lib/backendaxios";
import { useQuery } from "@tanstack/react-query";
import { GetProductDto } from "./products";

export type ProductsResponseDto = {
  data: GetProductDto[];
  count: number;
  offset: number;
  limit: number;
};

type GetProductsParams = {
  offset?: number;
  limit?: number;
  search?: string;
};

export const getAdminProducts = async (params?: GetProductsParams) => {
  const response = await backendAxios.get("/admin/products", { params });
  return response.data;
};

export const useAdminFetchProducts = (params?: GetProductsParams) => {
  const { offset = 0, limit = 20, search } = params || {};

  return useQuery<ProductsResponseDto>({
    queryKey: ["ADMIN_PRODUCTS", { offset, limit, search }],
    queryFn: async () => await getAdminProducts({ offset, limit, search }),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
};
