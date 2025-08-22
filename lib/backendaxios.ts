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
import axios from 'axios';


const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'localhost:3000';
console.log('BackendAxios baseURL:', baseURL); // Debug

const backendAxios = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

backendAxios.interceptors.request.use((config) => {
  console.log('Request URL:', (config.baseURL ?? '') + config.url); // Debug
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { backendAxios };