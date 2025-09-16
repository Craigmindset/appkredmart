import { backendAxios } from "@/lib/backendaxios";
import { useQuery } from "@tanstack/react-query";

interface RevenueSummaryResponseDto {
  totalRevenue: number;
  totalMarkup: number;
  merchantSettlement: number;
  totalTransactions: number;
  totalVats: number;
}

export const getRevenueSummary = async () => {
  const response = await backendAxios.get("/admin/revenues/summary");
  return response.data;
};

export const useAdminFetchRevenueSummary = () => {
  return useQuery<RevenueSummaryResponseDto>({
    queryKey: ["REVENUE_SUMMARY"],
    queryFn: async () => await getRevenueSummary(),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
};
