
import { useState, useEffect, useCallback, useMemo } from "react";
import { inventoryService, InventoryItem, InventoryQueryParams } from "./inventory";
import { useToast } from "@/hooks/use-toast";

export function useInventory(initialParams: InventoryQueryParams = { limit: 50, page: 1 }) {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialParams.page || 1);
  const [stats, setStats] = useState({
    totalProducts: 0,
    outOfStock: 0,
    lowStock: 0,
    wellStocked: 0,
  });
  const { toast } = useToast();

  const stableInitialParams = useMemo(() => initialParams, [
    initialParams.limit,
    initialParams.page,
    initialParams.search,
    initialParams.merchant,
    initialParams.category,
    initialParams.deals,
    initialParams.priceType
  ]);

  const fetchInventory = useCallback(async (params: InventoryQueryParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      const mergedParams = { ...stableInitialParams, ...params };
      
      const response = await inventoryService.getInventory(mergedParams);
      
      setInventory(response.data);
      setTotalPages(response.totalPages);
      setTotal(response.total);
      setCurrentPage(response.page);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Failed to fetch inventory";
      setError(errorMessage);
      console.error("🚨 Inventory fetch error:", err);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [stableInitialParams, toast]);

  const fetchStats = useCallback(async () => {
    try {
      const statsData = await inventoryService.getInventoryStats();
      setStats(statsData);
    } catch (err: any) {
      console.error("🚨 Stats fetch error:", err);
    }
  }, []);

  useEffect(() => {
    fetchInventory();
    fetchStats();
  }, [fetchInventory, fetchStats]);

  return {
    inventory,
    loading,
    error,
    totalPages,
    total,
    currentPage,
    stats,
    fetchInventory,
    refetch: () => {
      fetchInventory({ page: currentPage });
      fetchStats();
    },
  };
}
