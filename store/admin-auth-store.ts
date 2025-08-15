"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

type AdminInfo = {
  email: string
  name: string
}

type AdminAuthState = {
  isAuthenticated: boolean
  admin: AdminInfo | null
  signInDemo: (email?: string) => void
  signOut: () => void
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      admin: null,
      signInDemo: (email = "admin@demo.com") =>
        set({
          isAuthenticated: true,
          admin: { email, name: "Demo Admin" },
        }),
      signOut: () => set({ isAuthenticated: false, admin: null }),
    }),
    {
      name: "admin-auth",
      version: 1,
    },
  ),
)
