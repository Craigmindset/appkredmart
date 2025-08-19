import _axios from "axios";
// import { env } from "./env";

export const backendAxios = _axios.create({
  // baseURL: env().NEXT_PUBLIC_BACKEND_URL,
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
