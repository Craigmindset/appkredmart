import { backendAxios } from "@/lib/backendaxios";
import { useQuery } from "@tanstack/react-query";

export type CustomerTransactionResponseDto = {
  id: string;
  createdAt: Date;
  meta: string;
  method: string;
  amount: number;
  ref: string;
  status: string;
  type: string;
};

export type CustomerTransactionsResponseDto = {
  data: CustomerTransactionResponseDto[];
  page: number;
  total: number;
};

type GetProductsParams = {
  offset?: number;
  limit?: number;
  search?: string | null;
  page?: number;
};

export const getTransactions = async (params?: GetProductsParams) => {
  const response = await backendAxios.get("/transactions", { params });
  return response.data;
};

export const useGetTransactions = (params?: GetProductsParams) => {
  const { offset = 0, limit = 20, page = 1, search } = params || {};
  const formattedParams = {
    offset,
    limit,
    page,
    ...(search ? { search } : {}),
  };
  return useQuery<CustomerTransactionsResponseDto>({
    queryKey: ["TRANSACTIONS", formattedParams],
    queryFn: async () => await getTransactions(formattedParams),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
};
