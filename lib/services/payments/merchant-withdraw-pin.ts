import { backendAxios } from "@/lib/backendaxios";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useMerchantWithdrawPin = () => {
  return useMutation({
    mutationFn: async (data: { pin: string }) => {
      const response = await backendAxios.post(
        "/payments/merchant/withdraw/validate",
        data
      );
      return response.data;
    },
    onError: async (error) => {
      // Handle error (you can customize this as needed)
      console.error("Withdrawal error:", error);
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
};
