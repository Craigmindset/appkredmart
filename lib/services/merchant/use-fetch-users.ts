import { backendAxios } from "@/lib/backendaxios";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export interface AdminUserDto {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  phone: string;

  picture?: string;
  emailVerified?: Date;
  position?: string;
  status: "ACTIVE" | "INACTIVE";
  wallet: { accountNumber?: string };
  loanApplications: { status: string }[];
  _count: { orders: number };
}

type AdminUsersResponseDto = {
  data: AdminUserDto[];
  count: number;
  offset: number;
};

export const fetchUsers = async () => {
  const response = await backendAxios.get<
    AdminUsersResponseDto,
    AxiosResponse<AdminUsersResponseDto>
  >("/admin/users");
  return response.data || [];
};

export const useFetchUsers = () => {
  const {
    error,
    isPending: loading,
    data,
  } = useQuery({
    queryKey: ["ADMIN_USERS"],
    queryFn: fetchUsers,
  });

  return { data, loading, error };
};
