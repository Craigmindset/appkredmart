import { backendAxios } from "@/lib/backendaxios";
import { getQueryClient } from "@/lib/query-client";
import { useMutation } from "@tanstack/react-query";

export function useLogout() {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async () => {
      await backendAxios.post("/auth/logout");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["USER"],
      });
    },
  });
}
