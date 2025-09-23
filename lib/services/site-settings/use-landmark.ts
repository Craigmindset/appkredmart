import { backendAxios } from "@/lib/backendaxios";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export type LandmarksResponse = {
  id: string;
  name: string;
  address: string;
};

export const getLandmarks = async () => {
  const response = await backendAxios.get<
    LandmarksResponse[],
    AxiosResponse<LandmarksResponse[]>
  >("/site-setting/landmarks");
  return response.data;
};

export const useLandmarks = () => {
  return useQuery({
    queryKey: ["LANDMARkS"],
    queryFn: async () => await getLandmarks(),
    staleTime: 5 * 60 * 1000,
  });
};
