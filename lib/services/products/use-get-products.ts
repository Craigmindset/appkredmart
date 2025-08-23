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
};

export const getProducts = async (params?: GetProductsParams) => {
  const response = await backendAxios.get("/products", { params });
  return response.data;
};

export const useGetProducts = (params?: GetProductsParams) => {
  const { offset = 0, limit = 20 } = params || {};

  return useQuery<ProductsResponseDto>({
    queryKey: ["PRODUCTS", { offset, limit }],
    queryFn: async () => await getProducts({ offset, limit }),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
};
