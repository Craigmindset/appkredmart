import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { backendAxios } from "../../backendaxios";
import { getQueryClient } from "@/lib/query-client";

type UpdateProductDto = {
  name: string;
  price: number;
  markup: number;
  discount: number;
  quantity: number;
};

export const adminUpdateProduct = async (
  productId: string,
  data: UpdateProductDto
) => {
  const response = await backendAxios.put(`/admin/products/${productId}`, data);
  return response.data;
};

export const useAdminUpdateProduct = () => {
  const queryClient = getQueryClient();
  const {
    error,
    isPending: loading,
    mutateAsync,
    data,
  } = useMutation({
    mutationFn: async ({
      productId,
      productData,
    }: {
      productId: string;
      productData: UpdateProductDto;
    }) => await adminUpdateProduct(productId, productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ADMIN_PRODUCTS"] });
    },
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
