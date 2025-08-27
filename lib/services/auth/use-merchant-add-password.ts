import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { backendAxios } from "../../backendaxios";
import { registerPasswordSchemaType } from "../../validations/auth";

export const addPassword = async (data: registerPasswordSchemaType) => {
  const response = await backendAxios.post("/auth/merchant/password", data);
  return response.data;
};

export const useMerchantAddPassword = () => {
  const {
    error,
    isPending: loading,
    mutateAsync,
    data,
  } = useMutation({
    mutationFn: addPassword,
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
