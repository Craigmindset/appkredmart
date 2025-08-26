import { backendAxios } from "@/lib/backendaxios";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

interface TeamResponse {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  phone: string;

  picture?: string;
  emailVerified?: Date;
  position?: string;
  createdAt: Date;
}

export const fetchAdminTeam = async () => {
  const response = await backendAxios.get<
    TeamResponse[],
    AxiosResponse<TeamResponse[]>
  >("/admin");
  return response.data;
};

export const useFetchAdminTeam = () => {
  const {
    error,
    isPending: loading,
    data,
  } = useQuery({
    queryKey: ["ADMIN_TEAM"],
    queryFn: fetchAdminTeam,
  });

  return { data, loading, error };
};
