import { backendAxios } from "@/lib/backendaxios";
import { Fulfillment, PaymentStatus } from "@/store/orders-store";
import { useQuery } from "@tanstack/react-query";

export type CustomerOrderItemResponseDto = {
  id: string;
  orderId: string;
  paymentStatus: PaymentStatus;
  createdAt: string;
  paymentMethod: string;
  image: string;
  fulfillment: Fulfillment;
  delivery: string;
  total: number;
  subtotal: number;
  shippingFees: number;
  user: { firstname: string; lastname: string };
  transaction: { ref: string }[];
  highlighted?: boolean;
  rider?: string;
  items: {
    id: string;
    markup: number;
    image: string;
    title: string;
    quantity: number;
    price: number;
    merchant: {
      company: string;
    };
  }[];
};

export type CustomerOrdersResponseDto = {
  data: CustomerOrderItemResponseDto[];
  count: number;
  offset: number;
  limit: number;
};

type GetOrdersParams = {
  offset?: number;
  limit?: number;
  search?: string | null;
  merchant?: string;
  settlement?: string;
  delivery?: string;
  page?: number;
};

export const adminGetOrders = async (params?: GetOrdersParams) => {
  const response = await backendAxios.get("/admin/orders", { params });
  return response.data;
};

export const useAdminGetOrders = (params?: GetOrdersParams) => {
  const {
    offset = 0,
    limit = 20,
    page = 1,
    search,
    merchant,
    delivery,
    settlement,
  } = params || {};
  const formattedParams = {
    offset,
    limit,
    page,
    ...(search ? { search } : {}),
    ...(delivery ? { delivery } : {}),
    ...(merchant ? { merchant } : {}),
    ...(settlement ? { settlement } : {}),
  };
  return useQuery<CustomerOrdersResponseDto>({
    queryKey: ["ADMIN_ORDERS", formattedParams],
    queryFn: async () => await adminGetOrders(formattedParams),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
};
