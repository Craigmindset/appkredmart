import { backendAxios } from "@/lib/backendaxios";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

interface UserResponse {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
  picture?: string;
  emailVerified?: Date;
  position?: string;
  role?: string;
}

const checkAuth = () => {
  if (typeof window === 'undefined') {
    return null; // Return null instead of throwing error
  }
  const token = localStorage.getItem('token');
  return token; // Return token or null
};

export const fetchUser = async () => {
  // Check authentication before making request
  const token = checkAuth();
  console.log('🔑 Token found:', !!token, token ? `${token.substring(0, 20)}...` : 'None');
  
  if (!token) {
    console.log('❌ No authentication token found');
    throw new Error('No authentication token found');
  }
  
  try {
    console.log('📡 Making request to /api/user/me...');
    const response = await backendAxios.get<
      UserResponse,
      AxiosResponse<UserResponse>
    >("/api/user/me");
    
    console.log('✅ User data received:', response.data);
    console.log('📋 User details:', {
      id: response.data.id,
      email: response.data.email,
      firstname: response.data.firstname,
      lastname: response.data.lastname,
      phone: response.data.phone,
      emailVerified: response.data.emailVerified
    });
    
    return response.data;
  } catch (error: any) {
    console.log('❌ Error fetching user data:', error);
    console.log('📄 Error response:', error.response?.data);
    console.log('🔢 Error status:', error.response?.status);
    
    if (error.response?.status === 401) {
      // Clear invalid token and throw authentication error
      console.log('🚫 Authentication failed, clearing token');
      localStorage.removeItem('token');
      throw new Error('Authentication failed. Please log in again.');
    }
    throw error;
  }
};

export const useUser = () => {
  const {
    error,
    isPending: loading,
    data,
  } = useQuery({
    queryKey: ["USER"],
    queryFn: fetchUser,
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('token'), // Only run query if token exists
    retry: (failureCount, error: any) => {
      // Don't retry on authentication errors
      if (error?.message?.includes('Authentication failed') || error?.message?.includes('No authentication token found')) {
        return false;
      }
      return failureCount < 3;
    },
  });

  return { user: data, loading, error };
};
