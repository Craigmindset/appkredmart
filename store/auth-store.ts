"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

type User = {
  firstName: string
  lastName: string
  email: string
  phone: string
}

type AuthState = {
  user: User | null
  signupDraft?: Partial<User>
  setSignupDraft: (draft: Partial<User>) => void
  setUser: (user: User | null) => void
  verified: boolean
  setVerified: (v: boolean) => void
  logout: () => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      signupDraft: {},
      verified: false,
      setSignupDraft: (draft) => set({ signupDraft: { ...draft } }),
      setUser: (user) => set({ user }),
      setVerified: (v) => set({ verified: v }),
      logout: () => set({ user: null, verified: false, signupDraft: {} }),
    }),
    { name: "kredmart-auth" },
  ),
)
