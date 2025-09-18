import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { backendAxios } from "../../backendaxios";
import { getQueryClient } from "@/lib/query-client";

type BulkMarkupDto = {
  selectedProducts: string[];
  bulkMarkup: string;
};

export const adminBulkMarkup = async (data: BulkMarkupDto) => {
  const response = await backendAxios.put(`/admin/products/bulk-markup`, data);
  return response.data;
};

export const useAdminBulkMarkup = () => {
  const queryClient = getQueryClient();
  const {
    error,
    isPending: loading,
    mutateAsync,
    data,
  } = useMutation({
    mutationFn: async (productData: BulkMarkupDto) =>
      await adminBulkMarkup(productData),
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ["ADMIN_PRODUCTS"] });
    // },
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
