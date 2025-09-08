import { backendAxios } from "@/lib/backendaxios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GetProductDto } from "../products/products";
import { Fulfillment, PaymentStatus } from "@/store/orders-store";
import { AxiosError } from "axios";
import { toast } from "sonner";

export type CustomerOrderItemResponseDto = {
  id: string;
  orderId: string;
  createdAt: string;
  fulfillment: Fulfillment;
};

export const proceedToDeliver = async (orderId: string | null) => {
  const response = await backendAxios.post(`/merchant/orders/shipment`, {
    orderId,
  });
  return response.data;
};

export const useProceedToDeliver = () => {
  const {
    error,
    isPending: loading,
    mutateAsync,
    data,
  } = useMutation({
    mutationFn: proceedToDeliver,
    onError: async (error) => {
      if (error instanceof AxiosError) {
        const message = error.response?.data.message;
        const description = message || "An error occured";

        if (description) {
          toast.error(`An error occured!`, {
            description,
          });
        }
      }
    },
  });
  return { mutateAsync, loading, data, error };
};
