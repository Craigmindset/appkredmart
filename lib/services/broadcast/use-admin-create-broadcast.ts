import { backendAxios } from "@/lib/backendaxios";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const createBroadCast = async (data: {
  title: string;
  body: string;
  actor: string;
  unread: boolean;
  type: string;
  tag: string;
  audience: string;
}) => {
  const response = await backendAxios.post("/admin/broadcast", data);

  return response.data;
};

export const useAdminCreateBroadCast = () => {
  const {
    error,
    isPending: loading,
    mutateAsync,
    data,
  } = useMutation({
    mutationFn: createBroadCast,
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
