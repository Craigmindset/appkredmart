"use client";

import { backendAxios } from "@/lib/backendaxios";
import { useQuery } from "@tanstack/react-query";

export const fetchUser = async () => {
  const response = await backendAxios.get("/user/me");
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
