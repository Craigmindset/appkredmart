
// lib/services/products/use-products.ts
import { useState, useEffect, useCallback, useMemo } from "react";
import { productsService, GetProductDto, ProductsQueryParams } from "./products";
import { useToast } from "@/hooks/use-toast";

export function useProducts(initialParams: ProductsQueryParams = { limit: 10, page: 1 }) {
  const [products, setProducts] = useState<GetProductDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialParams.page || 1);
  const { toast } = useToast();


  const stableInitialParams = useMemo(() => initialParams, [
    initialParams.limit,
    initialParams.page,
    initialParams.search,
    initialParams.sortBy
  ]);

  const fetchProducts = useCallback(async (params: ProductsQueryParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      const mergedParams = { ...stableInitialParams, ...params };
      
      const response = await productsService.getProducts(mergedParams);
      
      setProducts(response.data);
      setTotalPages(response.totalPages);
      setTotal(response.total);
      setCurrentPage(response.page);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Failed to fetch products";
      setError(errorMessage);
      console.error("🚨 Full error object:", err);
      console.error("🚨 Error response:", err?.response);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [stableInitialParams, toast]);

  const updateProduct = async (id: string, data: Partial<GetProductDto>) => {
    try {
      const updatedProduct = await productsService.updateProduct(id, data);
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
      return updatedProduct;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Failed to update product";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  const bulkUpdateMarkup = async (productIds: string[], markup: number) => {
    try {
      await productsService.bulkUpdateMarkup(productIds, markup);
      // Refetch products to get updated data
      await fetchProducts({ page: currentPage });
      toast({
        title: "Success",
        description: `Applied ${markup}% markup to ${productIds.length} products`,
      });
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Failed to apply bulk markup";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    totalPages,
    total,
    currentPage,
    fetchProducts,
    updateProduct,
    bulkUpdateMarkup,
    refetch: () => fetchProducts({ page: currentPage }),
  };
}

export function useProduct(id: string) {
  const [product, setProduct] = useState<GetProductDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProduct = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await productsService.getProductById(id);
      setProduct(data);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Failed to fetch product";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    product,
    loading,
    error,
    refetch: fetchProduct,
  };
}
