import { backendAxios } from "@/lib/backendaxios";
import { getQueryClient } from "@/lib/query-client";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const sendCustomerSupport = async (data: {
  subject: string;
  message: string;
}) => {
  const response = await backendAxios.post("/user/customer-support", data);
  return response.data;
};

export const useSendCustomerSupport = () => {
  const queryClient = getQueryClient();
  const {
    error,
    isPending: loading,
    mutateAsync,
    data,
  } = useMutation({
    mutationFn: sendCustomerSupport,
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["notifications", false],
      });
      await queryClient.invalidateQueries({ queryKey: ["unread-count"] });
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
