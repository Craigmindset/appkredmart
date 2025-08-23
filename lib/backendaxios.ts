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

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

const backendAxios = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

backendAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { backendAxios };
