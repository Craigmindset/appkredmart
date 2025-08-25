
import { backendAxios } from "@/lib/backendaxios";
import { useQuery } from "@tanstack/react-query";

export interface MerchantResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role?: string;
  totalInventory?: number;
  totalSold?: number;
  totalMarkup?: number;
  totalOrders?: number;
  status?: "Active" | "Inactive" | "Suspended";
  createdAt: string;
  updatedAt: string;
  cacDocUrl?: string;
}

export interface MerchantsResponse {
  data: MerchantResponse[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface MerchantsQueryParams {
  search?: string;
  sortBy?: "createdAt" | "updatedAt";
  limit?: number;
  page?: string | number;
}

class MerchantsService {
  private baseUrl = "/api/admin/merchants";

  private checkAuth() {
    if (typeof window === 'undefined') {
      throw new Error('Authentication check can only be performed on client side');
    }
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    return token;
  }

  async getMerchants(params: MerchantsQueryParams = {}): Promise<MerchantsResponse> {
    // Check authentication before making request
    this.checkAuth();

    const queryParams = new URLSearchParams();

    if (params.search) queryParams.append("search", params.search);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.page) queryParams.append("page", params.page.toString());

    const fullUrl = `${this.baseUrl}?${queryParams.toString()}`;
    
    try {
      const response = await backendAxios.get(fullUrl);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        // Clear invalid token and throw authentication error
        localStorage.removeItem('token');
        throw new Error('Authentication failed. Please log in again.');
      }
      throw error;
    }
  }

  async getMerchantById(id: string): Promise<MerchantResponse> {
    this.checkAuth();
    
    try {
      const response = await backendAxios.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        throw new Error('Authentication failed. Please log in again.');
      }
      throw error;
    }
  }

  async getMerchantStats(): Promise<{
    totalMerchants: number;
    activeMerchants: number;
    totalInventory: number;
    totalRevenue: number;
  }> {
    this.checkAuth();
    
    try {
      const response = await backendAxios.get(`${this.baseUrl}/stats`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        throw new Error('Authentication failed. Please log in again.');
      }
      throw error;
    }
  }

  async updateMerchantStatus(id: string, status: "Active" | "Inactive" | "Suspended"): Promise<MerchantResponse> {
    this.checkAuth();
    
    try {
      const response = await backendAxios.patch(`${this.baseUrl}/${id}/status`, { status }); 
      //later change to put the correct endpoint url
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        throw new Error('Authentication failed. Please log in again.');
      }
      throw error;
    }
  }
}

export const merchantsService = new MerchantsService();

export const useMerchants = (params: MerchantsQueryParams = {}) => {
  const {
    error,
    isPending: loading,
    data,
    refetch,
  } = useQuery({
    queryKey: ["MERCHANTS", params],
    queryFn: () => merchantsService.getMerchants(params),
    retry: (failureCount, error: any) => {
      // Don't retry on authentication errors
      if (error?.message?.includes('Authentication failed')) {
        return false;
      }
      return failureCount < 3;
    },
  });

  return { 
    merchants: data?.data || [], 
    total: data?.total || 0,
    totalPages: data?.totalPages || 0,
    loading, 
    error,
    refetch 
  };
};

export const useMerchantStats = () => {
  const {
    error,
    isPending: loading,
    data,
  } = useQuery({
    queryKey: ["MERCHANT_STATS"],
    queryFn: merchantsService.getMerchantStats,
    retry: (failureCount, error: any) => {
      // Don't retry on authentication errors
      if (error?.message?.includes('Authentication failed')) {
        return false;
      }
      return failureCount < 3;
    },
  });

  return { stats: data, loading, error };
};
