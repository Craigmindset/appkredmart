"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

type MerchantUser = {
  firstName: string
  lastName?: string
  email: string
  avatarUrl?: string
}

type MerchantAuthState = {
  user: MerchantUser | null
  isHydrated: boolean
  login: (u: MerchantUser) => void
  logout: () => void
  setHydrated: (hydrated: boolean) => void
}

export const useMerchantAuth = create<MerchantAuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isHydrated: false,
      login: (u) => {
        console.log("Merchant login called with:", u)
        set({ user: u })
      },
      logout: () => {
        console.log("Merchant logout called")
        set({ user: null })
      },
      setHydrated: (hydrated) => set({ isHydrated: hydrated }),
    }),
    {
      name: "kredmart-merchant-auth",
      onRehydrateStorage: () => (state) => {
        console.log("Merchant auth rehydrated:", state)
        if (state) {
          state.setHydrated(true)
        }
      },
    },
  ),
)
