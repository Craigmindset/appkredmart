"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type CurrencyCode = "NGN" | "GHA" | "GB"

type WalletState = {
  balance: number
  currency: CurrencyCode
  accountNumber: string
  accountName: string
  bankName: string
  bankLogo: string
  setCurrency: (c: CurrencyCode) => void
  addFunds: (amount: number) => void
  deduct: (amount: number) => boolean
  setAccountName: (name: string) => void
}

function genAccountNumber() {
  // 10-digit non-leading-zero
  return String(Math.floor(1000000000 + Math.random() * 9000000000))
}

export const useWallet = create<WalletState>()(
  persist(
    (set, get) => ({
      balance: 125000, // initial demo balance
      currency: "NGN",
      accountNumber: genAccountNumber(),
      accountName: "KredMart Wallet",
      bankName: "Kred Bank",
      bankLogo: "/placeholder.svg?height=28&width=28",
      setCurrency: (c) => set({ currency: c }),
      addFunds: (amount) => set({ balance: Math.max(0, get().balance + Math.max(0, amount)) }),
      deduct: (amount) => {
        const bal = get().balance
        if (amount <= 0 || amount > bal) return false
        set({ balance: bal - amount })
        return true
      },
      setAccountName: (name) => set({ accountName: name }),
    }),
    { name: "kredmart-wallet" },
  ),
)
