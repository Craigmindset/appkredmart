import { backendAxios } from "@/lib/backendaxios";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

interface AdminWalletTransactionsResponse {
  id: string;
  status: string;
  amount: number;
  type: string;
  description: string;
  reference: string;
  createdAt: Date;
}

export const fetchAdminWalletTransactions = async () => {
  const response = await backendAxios.get<
    AdminWalletTransactionsResponse[],
    AxiosResponse<AdminWalletTransactionsResponse[]>
  >("/admin/Wallet/transactions");
  return response.data;
};

export const useAdminWalletTransactions = () => {
  const {
    error,
    isPending: loading,
    data,
  } = useQuery({
    queryKey: ["ADMIN_WALLET_HISTORY"],
    queryFn: fetchAdminWalletTransactions,
  });

  return { data, loading, error };
};
