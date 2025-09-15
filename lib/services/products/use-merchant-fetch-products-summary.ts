import { backendAxios } from "@/lib/backendaxios";
import { useQuery } from "@tanstack/react-query";

export type ProductSummaryResponseDto = {
  totalProducts: number;
  inStocks: number;
  lowStocks: number;
  outOfStocks: number;
};

export const getMerchantProductSummary = async () => {
  const response = await backendAxios.get("/merchant/products/summary");
  return response.data;
};

export const useMerchantFetchProductsSummary = () => {
  return useQuery<ProductSummaryResponseDto>({
    queryKey: ["MERCHANT_PRODUCT_SUMMARY"],
    queryFn: async () => await getMerchantProductSummary(),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
};
