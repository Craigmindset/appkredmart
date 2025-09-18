import { backendAxios } from "@/lib/backendaxios";
import { useQuery } from "@tanstack/react-query";

export type CustomerTransactionResponseDto = {
  id: string;
  reference: string;
  wallet: {
    merchantId: string;
    merchant: {
      company: string;
    };
  };
  createdAt: Date;
  meta: string;
  method: string;
  amount: number;
  ref: string;
  status: string;
  type: string;
  user: {
    firstname: string;
    lastname: string;
  };
  order: {
    items: {
      quantity: number;
    }[];
    merchantOrders: {
      merchant: {
        company: string;
      };
    }[];
    paymentMethod: string;
    paymentStatus: string;
    orderId: string;
    transaction: { ref: string }[];
    delivery: string;
  };
};

export type CustomerTransactionsResponseDto = {
  data: CustomerTransactionResponseDto[];
  page: number;
  total: number;
};

type GetMerchantTransationParams = {
  offset?: number;
  limit?: number;
  merchant?: string;
  search?: string | null;
  page?: number;
};

export const adminGetMerchantTransactions = async (
  params?: GetMerchantTransationParams
) => {
  const response = await backendAxios.get("/admin/merchant-transactions", {
    params,
  });
  return response.data;
};

export const useAdminGetMerchantTransactions = (
  params?: GetMerchantTransationParams
) => {
  const { offset = 0, limit = 20, page = 1, search, merchant } = params || {};
  const formattedParams = {
    offset,
    limit,
    page,
    ...(search ? { search } : {}),
    ...(merchant ? { merchant } : {}),
  };
  return useQuery<CustomerTransactionsResponseDto>({
    queryKey: ["ADMIN_MERCHANT_TRANSACTIONS", formattedParams],
    queryFn: async () => await adminGetMerchantTransactions(formattedParams),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
};
