import { backendAxios } from "@/lib/backendaxios";
import { getQueryClient } from "@/lib/query-client";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const updateMerchantAccount = async (data: {
  firstname?: string;
  lastname?: string;
  picture?: string;
}) => {
  const response = await backendAxios.patch("/merchant/me", data);
  return response.data;
};

export const useUpdateMerchantAccount = () => {
  const queryClient = getQueryClient();
  const {
    error,
    isPending: loading,
    mutateAsync,
    data,
  } = useMutation({
    mutationFn: updateMerchantAccount,
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["USER"] });
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
