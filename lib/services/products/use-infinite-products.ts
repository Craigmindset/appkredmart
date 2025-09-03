import { backendAxios } from "@/lib/backendaxios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { GetProductDto } from "./products";
import { ProductsResponseDto } from "./use-get-products";

type GetProductsParams = {
  offset?: number;
  limit?: number;
  search?: string;
  category?: string | null;
  page?: number;
  brand?: string;
};

export const getProducts = async (params?: GetProductsParams) => {
  const response = await backendAxios.get("/products", { params });
  return response.data;
};

export const useInfiniteProducts = (
  params?: Omit<GetProductsParams, "page" | "offset">
) => {
  const { limit = 20, category, brand, search } = params || {};

  return useInfiniteQuery<ProductsResponseDto>({
    queryKey: [
      "PRODUCTS",
      {
        limit,
        ...(category ? { category } : {}),
        ...(brand ? { brand } : {}),
        ...(search ? { search } : {}),
      },
    ],
    queryFn: async ({ pageParam = 1 }) => {
      const formattedParams: GetProductsParams = {
        page: pageParam as number,
        limit,
        ...(category ? { category } : {}),
        ...(brand ? { brand } : {}),
        ...(search ? { search } : {}),
      };
      return getProducts(formattedParams);
    },
    initialPageParam: 1, // 👈 start from page 1
    getNextPageParam: (lastPage) => {
      const { page, pageSize, total } = lastPage;
      const totalPages = Math.ceil(total / pageSize);
      return page < totalPages ? page + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000,
  });
};
