import { Product } from "@/lib/products";
import { getQueryClient } from "@/lib/query-client";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { backendAxios } from "../../backendaxios";

export const createOrder = async (data: {
  user: {
    firstName: string;
    lastName: string;
    address: string;
    phone: string;
    email: string;
    city: string;
    state: string;
  };
  items: { product: Product; quantity: number }[];
  paymentMethod: string;
}) => {
  const response = await backendAxios.post("/order", data);

  return response.data;
};

export const useCreateOrder = () => {
  const queryClient = getQueryClient();
  const {
    error,
    isPending: loading,
    mutateAsync,
    data,
  } = useMutation({
    mutationFn: createOrder,
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
