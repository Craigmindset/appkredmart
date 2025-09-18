import { backendAxios } from "@/lib/backendaxios";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

interface AdminOverviewResponse {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  metrics: {
    sales: {
      current: number;
      change: number;
      trend: "increase" | "decrease";
    };
    orders: {
      current: number;
      previous: number;
      change: number;
      trend: "increase" | "decrease";
    };
    products: {
      current: number;
      previous: number;
      change: number;
      trend: "increase" | "decrease";
    };
  };
}

export const merchantOverview = async () => {
  const response = await backendAxios.get<
    AdminOverviewResponse,
    AxiosResponse<AdminOverviewResponse>
  >("/merchant/overview");
  return response.data;
};

export const useMerchantOverview = () => {
  const {
    error,
    isPending: loading,
    data,
  } = useQuery({
    queryKey: ["MERCHANT_OVERVIEW"],
    queryFn: merchantOverview,
  });

  return { data, loading, error };
};
