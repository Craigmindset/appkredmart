import { backendAxios } from "@/lib/backendaxios";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export type MerchantTransactionOverviewDto = {
  totalTransactions: number;
  completedPayments: number;
  completedValue: number;
};

export const merchantTransactionOverview = async () => {
  const response = await backendAxios.get<
    MerchantTransactionOverviewDto,
    AxiosResponse<MerchantTransactionOverviewDto>
  >("/merchant/transaction/overview");
  return response.data;
};

export const useMerchantTransactionOverview = () => {
  return useQuery<MerchantTransactionOverviewDto>({
    queryKey: ["MERCHANT_TRANSACTION_OVERVIEW"],
    queryFn: async () => await merchantTransactionOverview(),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
};
