import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';
// console.log('Environment check:', {
//   NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
//   finalBaseURL: baseURL,
//   isClient: typeof window !== 'undefined'
// });

const backendAxios = axios.create({
  baseURL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

backendAxios.interceptors.request.use((config) => {
  console.log('Request URL:', (config.baseURL ?? '') + config.url); // Debug
  // Only access localStorage on client side to prevent hydration issues
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export { backendAxios };