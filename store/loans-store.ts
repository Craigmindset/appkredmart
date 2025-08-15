"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type LoanStatus = "Pending" | "Approved" | "Disbursed" | "Active" | "Rejected"

export type Loan = {
  id: string // Loan ID / Reference
  provider: string
  loanAmount: number
  repaymentAmount: number
  interestRate: number // e.g. 12 means 12%
  status: LoanStatus
  startDate?: string // ISO; when disbursed
  dueDate?: string // ISO; end of term
  balance: number // amount left to repay
}

type LoansState = {
  loans: Loan[]
  add: (loan: Loan) => void
  update: (id: string, patch: Partial<Loan>) => void
  clear: () => void
  seedDemo: () => void
}

export const useLoans = create<LoansState>()(
  persist(
    (set, get) => ({
      loans: [],
      add: (loan) => set({ loans: [loan, ...get().loans] }),
      update: (id, patch) =>
        set({
          loans: get().loans.map((l) => (l.id === id ? { ...l, ...patch } : l)),
        }),
      clear: () => set({ loans: [] }),
      seedDemo: () => {
        const now = new Date()
        const start = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
        const due = new Date(now.getFullYear(), now.getMonth() + 2, now.getDate())
        const startISO = start.toISOString()
        const dueISO = due.toISOString()
        set({
          loans: [
            {
              id: "KM-LOAN-1000123",
              provider: "CreditDirect",
              loanAmount: 200_000,
              repaymentAmount: 230_000,
              interestRate: 15,
              status: "Active",
              startDate: startISO,
              dueDate: dueISO,
              balance: 125_000,
            },
            {
              id: "KM-LOAN-1000456",
              provider: "FairMoney",
              loanAmount: 100_000,
              repaymentAmount: 112_000,
              interestRate: 12,
              status: "Pending",
              balance: 112_000,
            },
          ],
        })
      },
    }),
    { name: "kredmart-loans" },
  ),
)
