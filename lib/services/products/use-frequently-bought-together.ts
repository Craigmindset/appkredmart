import { backendAxios } from "@/lib/backendaxios";
import { useQuery } from "@tanstack/react-query";
import { GetProductDto } from "./products";

/**
 * Fetch products that are frequently bought together with the given product
 * Based on historical order data
 */
export const getFrequentlyBoughtTogether = async (
  productId: string,
  limit = 4
): Promise<GetProductDto[]> => {
  try {
    console.log(`Fetching frequently bought together for: ${productId}`);
    const response = await backendAxios.get(
      `/products/${productId}/frequently-bought-together`,
      {
        params: { limit },
      }
    );
    console.log("Frequently bought together response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching frequently bought together:", error);
    throw error;
  }
};

export const useFrequentlyBoughtTogether = (
  productId: string,
  limit = 4,
  enabled = true
) => {
  return useQuery<GetProductDto[]>({
    queryKey: ["FREQUENTLY_BOUGHT_TOGETHER", productId, limit],
    queryFn: () => getFrequentlyBoughtTogether(productId, limit),
    staleTime: 30 * 60 * 1000, // 30 minutes
    enabled: enabled && !!productId,
  });
};
