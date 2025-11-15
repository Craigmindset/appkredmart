"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GetProductDto } from "@/lib/services/products/products";

export type CartItem = { product: GetProductDto; quantity: number };

type CartState = {
  items: CartItem[];
  add: (product: GetProductDto, quantity?: number) => void;
  remove: (id: string) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  clear: () => void;
  setCart: (items: CartItem[]) => void;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      setCart: (items: CartItem[]) => {
        set({ items });
      },
      add: (product, quantity = 1) => {
        const existing = get().items.find((i) => i.product.id === product.id);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.product.id === product.id
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          });
        } else {
          set({ items: [...get().items, { product, quantity }] });
        }
      },
      remove: (id) =>
        set({ items: get().items.filter((i) => i.product.id !== id) }),
      increment: (id) =>
        set({
          items: get().items.map((i) =>
            i.product.id === id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        }),
      decrement: (id) =>
        set({
          items: get()
            .items.map((i) =>
              i.product.id === id
                ? { ...i, quantity: Math.max(1, i.quantity - 1) }
                : i
            )
            .filter(Boolean) as CartItem[],
        }),
      clear: () => set({ items: [] }),
    }),
    { name: "kredmart-cart" }
  )
);

export const cartSelectors = {
  count: (s: CartState) => s.items.reduce((sum, i) => sum + i.quantity, 0),
  total: (s: CartState) =>
    s.items.reduce((sum, i) => sum + i.quantity * i.product.price, 0),
};
