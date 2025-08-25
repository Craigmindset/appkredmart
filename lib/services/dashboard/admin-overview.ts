import { backendAxios } from "@/lib/backendaxios";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

interface AdminOverviewResponse {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
}

export const fetchOverview = async () => {
  const response = await backendAxios.get<
    AdminOverviewResponse,
    AxiosResponse<AdminOverviewResponse>
  >("/api/admin/dashboard/overview");
  return response.data;
};

export const useAdminOverview = () => {
  const {
    error,
    isPending: loading,
    data,
  } = useQuery({
    queryKey: ["ADMIN_OVERVIEW"],
    queryFn: fetchOverview,
  });

  return { data, loading, error };
};
