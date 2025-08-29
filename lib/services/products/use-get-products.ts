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
  category?: string | null;
  page?: number;
  brand?: string;
};

export const getProducts = async (params?: GetProductsParams) => {
  const response = await backendAxios.get("/products", { params });
  return response.data;
};

export const useGetProducts = (params?: GetProductsParams) => {
  const { offset = 0, limit = 20, page = 1, category, brand } = params || {};
  const formattedParams = {
    offset,
    limit,
    page,
    ...(category ? { category } : {}),
    ...(brand ? { brand } : {}),
  };
  return useQuery<ProductsResponseDto>({
    queryKey: ["PRODUCTS", formattedParams],
    queryFn: async () => await getProducts(formattedParams),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
};
