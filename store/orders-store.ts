"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type PaymentMethod = "Wallet" | "Card" | "Pay on Delivery"
export type PaymentStatus = "Paid" | "Pending" | "Refunded" | "Failed"
export type Fulfillment = "Processing" | "Ready for Delivery" | "Rider on Move" | "Delivered" | "Canceled"
export type DeliveryStatus = "Arriving Today" | "In Progress"

export type OrderItem = {
  id: string
  title: string
  qty: number
  price: number
  image?: string
}

export type Order = {
  id: string
  items: OrderItem[]
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  fulfillment: Fulfillment
  delivery: DeliveryStatus
  createdAt: string // ISO date
}

export function orderTotal(o: Order) {
  return o.items.reduce((sum, it) => sum + it.qty * it.price, 0)
}

type OrdersState = {
  orders: Order[]
  add: (o: Order) => void
  update: (id: string, patch: Partial<Order>) => void
  clear: () => void
  seedDemo: () => void
}

export const useOrders = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],
      add: (o) => set({ orders: [o, ...get().orders] }),
      update: (id, patch) => set({ orders: get().orders.map((o) => (o.id === id ? { ...o, ...patch } : o)) }),
      clear: () => set({ orders: [] }),
      seedDemo: () => {
        const now = new Date()
        const days = (d: number) => {
          const x = new Date(now)
          x.setDate(now.getDate() - d)
          return x.toISOString()
        }
        set({
          orders: [
            {
              id: "KM-ORD-240091",
              items: [
                {
                  id: "p-1",
                  title: "Smartphone X Pro",
                  qty: 1,
                  price: 299999,
                  image: "/placeholder.svg?height=56&width=56",
                },
                { id: "p-7", title: "Wireless Earbuds Pro", qty: 1, price: 79999 },
              ],
              paymentMethod: "Card",
              paymentStatus: "Paid",
              fulfillment: "Rider on Move",
              delivery: "In Progress",
              createdAt: days(0),
            },
            {
              id: "KM-ORD-240088",
              items: [{ id: "p-3", title: "4K Ultra HD TV 55”", qty: 1, price: 599000 }],
              paymentMethod: "Wallet",
              paymentStatus: "Paid",
              fulfillment: "Delivered",
              delivery: "Arriving Today",
              createdAt: days(2),
            },
            {
              id: "KM-ORD-240073",
              items: [{ id: "p-10", title: "Robot Vacuum", qty: 1, price: 349000 }],
              paymentMethod: "Card",
              paymentStatus: "Paid",
              fulfillment: "Ready for Delivery",
              delivery: "In Progress",
              createdAt: days(5),
            },
            {
              id: "KM-ORD-240060",
              items: [{ id: "p-6", title: "Bluetooth Speaker Mini", qty: 2, price: 79000 }],
              paymentMethod: "Pay on Delivery",
              paymentStatus: "Pending",
              fulfillment: "Processing",
              delivery: "In Progress",
              createdAt: days(7),
            },
            {
              id: "KM-ORD-240052",
              items: [{ id: "p-9", title: "Mechanical Keyboard TKL", qty: 1, price: 129000 }],
              paymentMethod: "Card",
              paymentStatus: "Refunded",
              fulfillment: "Canceled",
              delivery: "In Progress",
              createdAt: days(12),
            },
          ],
        })
      },
    }),
    { name: "kredmart-orders" },
  ),
)
