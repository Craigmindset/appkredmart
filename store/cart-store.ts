"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Product } from "@/lib/products"

export type CartItem = { product: Product; quantity: number }

type CartState = {
  items: CartItem[]
  add: (product: Product, quantity?: number) => void
  remove: (id: string) => void
  increment: (id: string) => void
  decrement: (id: string) => void
  clear: () => void
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (product, quantity = 1) => {
        const existing = get().items.find((i) => i.product.id === product.id)
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i,
            ),
          })
        } else {
          set({ items: [...get().items, { product, quantity }] })
        }
      },
      remove: (id) => set({ items: get().items.filter((i) => i.product.id !== id) }),
      increment: (id) =>
        set({
          items: get().items.map((i) => (i.product.id === id ? { ...i, quantity: i.quantity + 1 } : i)),
        }),
      decrement: (id) =>
        set({
          items: get()
            .items.map((i) => (i.product.id === id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i))
            .filter(Boolean) as CartItem[],
        }),
      clear: () => set({ items: [] }),
    }),
    { name: "kredmart-cart" },
  ),
)

export const cartSelectors = {
  count: (s: CartState) => s.items.reduce((sum, i) => sum + i.quantity, 0),
  total: (s: CartState) => s.items.reduce((sum, i) => sum + i.quantity * i.product.price, 0),
}
