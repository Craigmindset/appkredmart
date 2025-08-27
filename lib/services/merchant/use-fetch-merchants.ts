import { backendAxios } from "@/lib/backendaxios";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export interface MerchantDto {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  phone: string;

  picture?: string;
  emailVerified?: Date;
  position?: string;
  createdAt: Date;
  cac: string;
  documentMedia: { original: string };
  products: { id: string; markup: number; orderItem: [] }[];
}

type MerchantResponseDto = {
  data: MerchantDto[];
  count: number;
  offset: number;
};

export const fetchMerchants = async () => {
  const response = await backendAxios.get<
    MerchantResponseDto,
    AxiosResponse<MerchantResponseDto>
  >("/admin/merchants");
  return response.data;
};

export const useFetchMerchants = () => {
  const {
    error,
    isPending: loading,
    data,
  } = useQuery({
    queryKey: ["ADMIN_MERCHANTS"],
    queryFn: fetchMerchants,
  });

  return { data, loading, error };
};
