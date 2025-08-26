import { backendAxios } from "@/lib/backendaxios";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

interface ValidateResponse {
  email: string;
}

export const validateInvite = async (token?: string | null) => {
  const response = await backendAxios.get<
    ValidateResponse,
    AxiosResponse<ValidateResponse>
  >(`/auth/admin/validate-token?token=${encodeURIComponent(token || "")}`);
  return response.data;
};

export const useValidateAdminInvite = (token?: string | null) => {
  const {
    error,
    isPending: loading,
    data,
  } = useQuery({
    queryKey: ["ADMIN_INVITE"],
    queryFn: () => validateInvite(token),
    enabled: !!token,
  });

  return { data, loading, error };
};
