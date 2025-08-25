import { backendAxios } from "@/lib/backendaxios";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

interface UserWalletResponse {
  balance: number;
  accountName?: string;
  accountNumber?: string;
  bankName?: string;
}

export const fetchUserWallet = async () => {
  const response = await backendAxios.get<
    UserWalletResponse,
    AxiosResponse<UserWalletResponse>
  >("/user/Wallet");
  return response.data;
};

export const useUserWallet = () => {
  const {
    error,
    isPending: loading,
    data,
  } = useQuery({
    queryKey: ["WALLET"],
    queryFn: fetchUserWallet,
  });

  return { data, loading, error };
};
