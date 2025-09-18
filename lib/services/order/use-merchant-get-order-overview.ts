import { backendAxios } from "@/lib/backendaxios";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export type MerchantOrderOverviewDto = {
  ordersPending: number;
  ordersProcessing: number;
  ordersReadyToDeliver: number;
  ordersDelivered: number;
};

export const merchantGetOrderOverview = async () => {
  const response = await backendAxios.get<
    MerchantOrderOverviewDto,
    AxiosResponse<MerchantOrderOverviewDto>
  >("/merchant/order/overview");
  return response.data;
};

export const useMerchantGetOrderOverview = () => {
  return useQuery<MerchantOrderOverviewDto>({
    queryKey: ["MERCHANT_ORDER_OVERVIEW"],
    queryFn: async () => await merchantGetOrderOverview(),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
};
