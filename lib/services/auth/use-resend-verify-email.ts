import { backendAxios } from "@/lib/backendaxios";
import { getQueryClient } from "@/lib/query-client";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useResendVerifyEmail = () => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await backendAxios.post("/auth/verify-email/resend");
      return response.data;
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["USER"],
      });
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
};
