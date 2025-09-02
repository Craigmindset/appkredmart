import { backendAxios } from "@/lib/backendaxios";
import { useQuery } from "@tanstack/react-query";

export type BanksResponseDto = {
  id: number;
  code: string;
  country: string;
  currency: string;
  name: string;
  type: string;
  slug: string;
  supports_transfer: boolean;
};

export const getBanks = async () => {
  const response = await backendAxios.get("/payments/banks");
  return response.data;
};

export const useGetBanks = () => {
  return useQuery<BanksResponseDto[]>({
    queryKey: ["BANKS"],
    queryFn: async () => await getBanks(),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
};
