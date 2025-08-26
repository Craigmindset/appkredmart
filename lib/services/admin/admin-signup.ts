import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { backendAxios } from "../../backendaxios";

export const adminRegister = async (data: {
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  confirmPassword: string;
  token: string;
}) => {
  const response = await backendAxios.put("/auth/admin", data);
  return response.data;
};

export const useAdminRegister = () => {
  const {
    error,
    isPending: loading,
    mutateAsync,
    data,
  } = useMutation({
    mutationFn: adminRegister,
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
