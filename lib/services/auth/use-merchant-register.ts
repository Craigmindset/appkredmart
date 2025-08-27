import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { backendAxios } from "../../backendaxios";
import { merchantRegisterSchemaType } from "../../validations/auth";
import { uploadMedia } from "../upload/useUploadMedia";

export const merchantRegister = async ({
  documentFile,
  ...rest
}: Omit<merchantRegisterSchemaType, "document"> & { documentFile: File }) => {
  const media = await uploadMedia(documentFile);
  const payload = {
    ...rest,
    document: { id: media.id },
  };
  const response = await backendAxios.post("/auth/merchant/register", payload);
  return response.data;
};

export const useMerchantRegister = () => {
  const {
    error,
    isPending: loading,
    mutateAsync,
    data,
  } = useMutation({
    mutationFn: merchantRegister,
    onError: async (error) => {
      if (error instanceof AxiosError) {
        const message = error.response?.data.message;
        const description = message || "An error occured";

        if (description) {
          toast.error(`An error occured!`, {
            description,
          });
        }
      }
    },
  });
  return { mutateAsync, loading, data, error };
};
