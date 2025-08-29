import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";
import { backendAxios } from "../../backendaxios";
import { Product } from "@/lib/products";

interface VerifiedCartDto {
  quantity: number;
  product: Product;
}

interface ShipmentResponseDto {
  cart: VerifiedCartDto[];
  deliveryPrice: number;
}

export const getShipment = async (data: {
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
}) => {
  const response = await backendAxios.post<
    ShipmentResponseDto,
    AxiosResponse<ShipmentResponseDto>
  >("/order/shipment", data);

  return response.data;
};

export const useGetShipment = () => {
  const {
    error,
    isPending: loading,
    mutateAsync,
    data,
  } = useMutation({
    mutationFn: getShipment,

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
