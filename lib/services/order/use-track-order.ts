import { backendAxios } from "@/lib/backendaxios";
import { useQuery } from "@tanstack/react-query";
import { GetProductDto } from "../products/products";
import { Fulfillment, PaymentStatus } from "@/store/orders-store";

export type CustomerOrderItemResponseDto = {
  id: string;
  orderId: string;
  createdAt: string;
  fulfillment: Fulfillment;
};

export const trackOrder = async (orderId: string | null) => {
  const response = await backendAxios.get(`/order/track/${orderId}`);
  return response.data;
};

export const useTrackOrder = (orderId: string | null) => {
  return useQuery<CustomerOrderItemResponseDto>({
    queryKey: ["TRACK_ORDER", orderId],
    queryFn: async () => await trackOrder(orderId),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    enabled: !!orderId && orderId.length > 6,
  });
};
