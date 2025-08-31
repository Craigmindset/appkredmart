import { backendAxios } from "@/lib/backendaxios";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

interface MerchantWalletTransactionsResponse {
  id: string;
  status: string;
  amount: number;
  type: string;
  description: string;
  reference: string;
}

export const fetchMerchantWalletTransactions = async () => {
  const response = await backendAxios.get<
    MerchantWalletTransactionsResponse[],
    AxiosResponse<MerchantWalletTransactionsResponse[]>
  >("/merchant/Wallet/history");
  return response.data;
};

export const useMerchantWalletTransactions = () => {
  const {
    error,
    isPending: loading,
    data,
  } = useQuery({
    queryKey: ["MERCHANT_WALLET_HISTORY"],
    queryFn: fetchMerchantWalletTransactions,
  });

  return { data, loading, error };
};
