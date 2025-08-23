// import _axios from "axios";

// export const backendAxios = _axios.create({
//   // baseURL: env().NEXT_PUBLIC_BACKEND_URL,
//   baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true,
// });
// // lib/backendaxios.ts
import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { getQueryClient } from "./query-client";

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

const backendAxios = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

const axiosForRefresh = axios.create({
  baseURL,
  withCredentials: true,
});

// backendAxios.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

const refreshToken = async () => {
  try {
    await axiosForRefresh.post("/api/auth/refresh"); // Refreshes the access token
    return Promise.resolve(); // Retry the original request
  } catch (error) {
    return Promise.reject(error);
  }
};

const handleAuthError = () => refreshToken();

const handleRefreshError = async () => {
  const queryClient = getQueryClient();

  await queryClient.setQueryData(["USER"], null);
};

createAuthRefreshInterceptor(backendAxios, handleAuthError, {
  statusCodes: [403, 401],
});

createAuthRefreshInterceptor(axiosForRefresh, handleRefreshError);

export { backendAxios };
