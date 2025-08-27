import { backendAxios } from "@/lib/backendaxios";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const verifyMerchantEmailOtp = async (data: { token: string }) => {
  const response = await backendAxios.post("/auth/merchant/verify-email", data);

  return response.data;
};

export const useVerifyMerchantEmailOtp = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: verifyEmailOtpFn,
  } = useMutation({
    mutationFn: verifyMerchantEmailOtp,
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

  return { verifyOtp: verifyEmailOtpFn, loading, error };
};
