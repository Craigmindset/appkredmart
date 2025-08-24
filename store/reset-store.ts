"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type ResetState = {
  email: string | null;
  token: string | null;
  setEmail: (email: string | null) => void;
  setToken: (token: string | null) => void;
};

export const useReset = create<ResetState>()(
  persist(
    (set) => ({
      email: null,
      token: null,
      setEmail: (email) => set({ email }),
      setToken: (token) => set({ token }),
    }),
    { name: "kredmart-reset" }
  )
);
