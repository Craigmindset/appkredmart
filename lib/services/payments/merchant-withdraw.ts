import { backendAxios } from "@/lib/backendaxios";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useMerchantWithdraw = () => {
  return useMutation({
    mutationFn: async (data: {
      amount: string;
      receiverAccount: string;
      receiverBank: string;
    }) => {
      const response = await backendAxios.post(
        "/payments/merchant/withdraw",
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
