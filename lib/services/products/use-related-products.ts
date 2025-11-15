import { backendAxios } from "@/lib/backendaxios";
import { useQuery } from "@tanstack/react-query";
import { GetProductDto } from "./products";

/**
 * Fetch related products based on category, brand, or other attributes
 */
export const getRelatedProducts = async (
  productId: string,
  limit = 6
): Promise<GetProductDto[]> => {
  try {
    console.log(`Fetching related products for: ${productId}`);
    const response = await backendAxios.get(`/products/${productId}/related`, {
      params: { limit },
    });
    console.log("Related products response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching related products:", error);
    throw error;
  }
};

export const useRelatedProducts = (
  productId: string,
  limit = 6,
  enabled = true
) => {
  return useQuery<GetProductDto[]>({
    queryKey: ["RELATED_PRODUCTS", productId, limit],
    queryFn: () => getRelatedProducts(productId, limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: enabled && !!productId,
  });
};
