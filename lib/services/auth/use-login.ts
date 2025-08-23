import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { backendAxios } from "../../backendaxios";
import { getQueryClient } from "../../query-client";
import { loginSchemaType } from "../../validations/auth";

export const login = async (data: loginSchemaType) => {
  const response = await backendAxios.post("/auth/login", data);
  return response.data;
};

export const useLogin = () => {
  const queryClient = getQueryClient();
  const {
    error,
    isPending: loading,
    mutateAsync,
    data,
  } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      // Store the token in localStorage after successful login
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["USER"] });
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
