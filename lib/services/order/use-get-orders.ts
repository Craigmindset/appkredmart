import { backendAxios } from "@/lib/backendaxios";
import { useQuery } from "@tanstack/react-query";
import { GetProductDto } from "../products/products";
import { Fulfillment, PaymentStatus } from "@/store/orders-store";

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
  items: {
    id: string;
    image: string;
    title: string;
    quantity: number;
    price: number;
  }[];
};

export type CustomerOrdersResponseDto = {
  data: CustomerOrderItemResponseDto[];
  count: number;
  offset: number;
  limit: number;
};

type GetProductsParams = {
  offset?: number;
  limit?: number;
  search?: string | null;
  page?: number;
};

export const getOrders = async (params?: GetProductsParams) => {
  const response = await backendAxios.get("/orders", { params });
  return response.data;
};

export const useGetOrders = (params?: GetProductsParams) => {
  const { offset = 0, limit = 20, page = 1, search } = params || {};
  const formattedParams = {
    offset,
    limit,
    page,
    ...(search ? { search } : {}),
  };
  return useQuery<CustomerOrdersResponseDto>({
    queryKey: ["ORDERS", formattedParams],
    queryFn: async () => await getOrders(formattedParams),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
};
