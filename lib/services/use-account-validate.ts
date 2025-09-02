import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";
import { backendAxios } from "../backendaxios";

interface AccountValidateResponse {
  account_number: string;
  account_name: string;
}

export const accountValidate = async (data: {
  account_number: string;
  bank_code: string;
}) => {
  const response = await backendAxios.post<
    AccountValidateResponse,
    AxiosResponse<AccountValidateResponse>
  >("/payments/validate-account-number", data);
  return response.data;
};

export const useAccountNumberValidate = () => {
  const {
    error,
    isPending: loading,
    mutateAsync,
    data,
  } = useMutation({
    mutationFn: accountValidate,
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
