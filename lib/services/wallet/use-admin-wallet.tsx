import { backendAxios } from "@/lib/backendaxios";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

interface AdminWalletResponse {
  balance: number;
  accountName?: string;
  accountNumber?: string;
  bankName?: string;
}

export const fetchAdminWallet = async () => {
  const response = await backendAxios.get<
    AdminWalletResponse,
    AxiosResponse<AdminWalletResponse>
  >("/admin/wallet");
  return response.data;
};

export const useAdminWallet = () => {
  const {
    error,
    isPending: loading,
    data,
  } = useQuery({
    queryKey: ["ADMIN_WALLET"],
    queryFn: fetchAdminWallet,
  });

  return { data, loading, error };
};
