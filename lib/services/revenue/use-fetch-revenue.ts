import { backendAxios } from "@/lib/backendaxios";
import { useQuery } from "@tanstack/react-query";

interface RevenueResponseDto {
  id: string;
  totalRevenue: number;
  totalMarkup: number;
  merchantSettlement: number;
  vat: number;
  createdAt: Date;
  amount: number;
  type: string;
  status: string;
  order?: {
    merchantOrders: { merchant: { company: string } }[];
  };
}

type GetRevenueParams = {
  search?: string;
};

export const getRevenues = async (params?: GetRevenueParams) => {
  const response = await backendAxios.get("/admin/revenues", { params });
  return response.data;
};

export const useAdminFetchRevenues = (params?: GetRevenueParams) => {
  return useQuery<RevenueResponseDto[]>({
    queryKey: ["REVENUES", params],
    queryFn: async () => await getRevenues(params),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
};
