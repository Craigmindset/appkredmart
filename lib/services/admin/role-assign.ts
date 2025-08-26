import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { backendAxios } from "../../backendaxios";
import { getQueryClient } from "@/lib/query-client";

export const roleAssign = async (data: { email: string; role: string }) => {
  const response = await backendAxios.post("/admin", data);

  return response.data;
};

export const useAdminRoleAssign = () => {
  const queryClient = getQueryClient();
  const {
    error,
    isPending: loading,
    mutateAsync,
    data,
  } = useMutation({
    mutationFn: roleAssign,
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ADMIN_TEAM"] });
    },
  });
  return { mutateAsync, loading, data, error };
};
