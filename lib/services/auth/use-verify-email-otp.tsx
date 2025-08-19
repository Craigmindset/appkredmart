import { backendAxios } from "@/lib/backendaxios";
import { useMutation } from "@tanstack/react-query";

export const verifyEmailOtp = async (data: { token: string }) => {
  const response = await backendAxios.post("/auth/verify-email", data);

  return response.data;
};

export const useVerifyEmailOtp = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: verifyEmailOtpFn,
  } = useMutation({
    mutationFn: verifyEmailOtp,
  });

  return { verifyOtp: verifyEmailOtpFn, loading, error };
};
