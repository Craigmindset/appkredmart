import { backendAxios } from "@/lib/backendaxios";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { toast } from "sonner";

interface UploadMediaResponseDto {
  id: string;
  original: string;
  thumbnail: string;
}

export const uploadMedia = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await backendAxios.post<
    UploadMediaResponseDto,
    AxiosResponse<UploadMediaResponseDto>
  >("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data; // should contain { id, thumbnail, original, filename }
};

export const useUploadMedia = () => {
  return useMutation({
    mutationFn: uploadMedia,
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error("Upload failed", {
          description: error.response?.data?.message || "Something went wrong",
        });
      }
    },
  });
};
