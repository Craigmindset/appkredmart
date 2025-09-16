import { backendAxios } from "@/lib/backendaxios";
import { useQuery } from "@tanstack/react-query";

export type ProductSummaryResponseDto = {
  totalProducts: number;
  inStocks: number;
  lowStocks: number;
  outOfStocks: number;
  wellStocked: number;
  totalInventoryValue: number;
  averageMarkup: number;
  activeProducts: number;
};

export const getAdminProductSummary = async () => {
  const response = await backendAxios.get("/admin/products/summary");
  return response.data;
};

export const useAdminFetchProductsSummary = () => {
  return useQuery<ProductSummaryResponseDto>({
    queryKey: ["ADMIN_PRODUCT_SUMMARY"],
    queryFn: async () => await getAdminProductSummary(),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
};
