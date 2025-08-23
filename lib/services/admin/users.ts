import { backendAxios } from "@/lib/backendaxios";
import { useQuery } from "@tanstack/react-query";
// import { AxiosResponse } from "axios";

export interface AdminUserResponse {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
  picture?: string;
  emailVerified?: Date;
  createdAt: string;
  updatedAt: string;
  status?: "Active" | "Inactive" | "Suspended";
  totalOrders?: number;
  totalSpent?: number;
}

export interface UsersResponse {
  data: AdminUserResponse[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface UsersQueryParams {
  search?: string;
  status?: "Active" | "Inactive" | "Suspended";
  sortBy?: "createdAt" | "updatedAt" | "email";
  limit?: number;
  page?: number;
}

class AdminUsersService {
  private baseUrl = "/user/me";
  private adminBaseUrl = "/api/admin/users"; // Keep for admin-specific, operations like in the future (POST, PUT, PATCH, DELETE)

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

  async getUsers(params: UsersQueryParams = {}): Promise<UsersResponse> {
    // Check authentication before making request
    this.checkAuth();

    const queryParams = new URLSearchParams();

    if (params.search) queryParams.append("search", params.search);
    if (params.status) queryParams.append("status", params.status);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.limit) queryParams.append("pageSize", params.limit.toString());
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

  async getUserById(id: string): Promise<AdminUserResponse> {
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

  async getUserStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    newUsersToday: number;
    verifiedUsers: number;
  }> {
    this.checkAuth();
    
    try {
      //I am Using /api/user/me for stats as well since it's a GET operation
      const response = await backendAxios.get(`${this.baseUrl}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        throw new Error('Authentication failed. Please log in again.');
      }
      throw error;
    }
  }

  async updateUserStatus(id: string, status: "Active" | "Inactive" | "Suspended"): Promise<AdminUserResponse> {
    // Use admin endpoint for user management operations (PATCH method)
    const response = await backendAxios.patch(`${this.adminBaseUrl}/${id}/status`, { status });
    return response.data;
  }
}

export const adminUsersService = new AdminUsersService();

export const useAdminUsers = (params: UsersQueryParams = {}) => {
  const {
    error,
    isPending: loading,
    data,
    refetch,
  } = useQuery({
    queryKey: ["ADMIN_USERS", params],
    queryFn: () => adminUsersService.getUsers(params),
    retry: (failureCount, error: any) => {
      // Don't retry on authentication errors
      if (error?.message?.includes('Authentication failed')) {
        return false;
      }
      return failureCount < 3;
    },
  });

  return { 
    users: data?.data || [], 
    total: data?.total || 0,
    totalPages: data?.totalPages || 0,
    loading, 
    error,
    refetch 
  };
};

export const useAdminUserStats = () => {
  const {
    error,
    isPending: loading,
    data,
  } = useQuery({
    queryKey: ["ADMIN_USER_STATS"],
    queryFn: adminUsersService.getUserStats,
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