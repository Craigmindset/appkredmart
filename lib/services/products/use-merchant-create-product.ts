import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { backendAxios } from "../../backendaxios";
import { getQueryClient } from "@/lib/query-client";

export const merchantCreateProduct = async (data: {
  name: string;
  brand: string;
  category: string[];
  color: string;
  description: string;
  image: string;
  images: string[];
  price: number;
  discountPrice: number;
  status: "draft" | "publish";
}) => {
  const response = await backendAxios.post("/merchant/product", data);
  return response.data;
};

export const useMerchantCreateProduct = () => {
  const queryClient = getQueryClient();
  const {
    error,
    isPending: loading,
    mutateAsync,
    data,
  } = useMutation({
    mutationFn: merchantCreateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["MERCHANT_PRODUCTS"] });
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
