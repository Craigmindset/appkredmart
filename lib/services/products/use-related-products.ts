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
    console.log(
      `[CROSS-SELL] Fetching related products for product ID: ${productId}`
    );

    // Fetch all products (the /products/:id endpoint doesn't work properly)
    const response = await backendAxios.get("/products", {
      params: {
        limit: 50, // Fetch more products to have options
      },
    });

    console.log("[CROSS-SELL] API Response structure:", {
      hasData: !!response.data,
      hasDataArray: !!response.data?.data,
      dataLength: response.data?.data?.length || 0,
    });

    // Response structure: { data: [...], total, page, pageSize }
    const products = response.data?.data || [];

    if (!Array.isArray(products)) {
      console.error("[CROSS-SELL] Products is not an array:", products);
      return [];
    }

    console.log("[CROSS-SELL] Total products fetched:", products.length);

    // Find the current product in the fetched list
    const currentProduct = products.find(
      (p: GetProductDto) => p.id === productId
    );
    console.log("[CROSS-SELL] Current product found:", !!currentProduct);
    if (currentProduct) {
      console.log(
        "[CROSS-SELL] Current product categories:",
        currentProduct.category
      );
    }

    // Filter out the current product
    let relatedProducts = products.filter(
      (p: GetProductDto) => p.id !== productId
    );
    console.log(
      "[CROSS-SELL] After filtering current product:",
      relatedProducts.length
    );

    // If we have current product info, filter by category (category is an array of strings)
    if (
      currentProduct &&
      currentProduct.category &&
      Array.isArray(currentProduct.category) &&
      currentProduct.category.length > 0
    ) {
      const currentCategories = currentProduct.category;

      const categoryProducts = relatedProducts.filter((p: GetProductDto) => {
        if (!p.category || !Array.isArray(p.category)) return false;
        // Check if any category matches
        return p.category.some((cat) => currentCategories.includes(cat));
      });

      console.log(
        "[CROSS-SELL] Products matching categories:",
        categoryProducts.length
      );

      // Use category-filtered if we have enough, otherwise use all
      if (categoryProducts.length > 0) {
        relatedProducts = categoryProducts;
      }
    }

    // Limit results
    const finalProducts = relatedProducts.slice(0, limit);

    console.log("[CROSS-SELL] Final products to return:", finalProducts.length);

    return finalProducts;
  } catch (error) {
    console.error("[CROSS-SELL] Error fetching related products:", error);
    return []; // Return empty array on error instead of throwing
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
