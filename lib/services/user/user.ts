import { backendAxios } from "@/lib/backendaxios";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

interface UserResponse {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
  picture?: string;
  emailVerified?: Date;
  position?: string;
  company?: string;
  role?: "user" | "merchant" | "admin";
}

export const fetchUser = async () => {
  const response = await backendAxios.get<
    UserResponse,
    AxiosResponse<UserResponse>
  >("/user/me");
  return response.data;
};

export const useUser = () => {
  const {
    error,
    isPending: loading,
    data,
  } = useQuery({
    queryKey: ["USER"],
    queryFn: fetchUser,
  });

  return { user: data, loading, error };
};
