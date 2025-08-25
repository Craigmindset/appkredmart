import { backendAxios } from "@/lib/backendaxios";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

interface UserOverviewResponse {
  totalBalance: number;
  activeLoans: number;
  activeOrders: number;
  pendingDeliveries: number;
}

export const fetchUserOverview = async () => {
  const response = await backendAxios.get<
    UserOverviewResponse,
    AxiosResponse<UserOverviewResponse>
  >("/user/overview");
  return response.data;
};

export const useUserOverview = () => {
  const {
    error,
    isPending: loading,
    data,
  } = useQuery({
    queryKey: ["OVERVIEW"],
    queryFn: fetchUserOverview,
  });

  return { data, loading, error };
};
