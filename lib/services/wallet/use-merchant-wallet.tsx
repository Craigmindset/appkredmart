import { backendAxios } from "@/lib/backendaxios";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

interface MerchantWalletResponse {
  balance: number;
  accountName?: string;
  accountNumber?: string;
  bankName?: string;
}

export const fetchMerchantWallet = async () => {
  const response = await backendAxios.get<
    MerchantWalletResponse,
    AxiosResponse<MerchantWalletResponse>
  >("/merchant/Wallet");
  return response.data;
};

export const useMerchantWallet = () => {
  const {
    error,
    isPending: loading,
    data,
  } = useQuery({
    queryKey: ["MERCHANT_WALLET"],
    queryFn: fetchMerchantWallet,
  });

  return { data, loading, error };
};
