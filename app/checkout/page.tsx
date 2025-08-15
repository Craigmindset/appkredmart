"use client"

import type React from "react"

import LayoutShell from "@/components/layout-shell"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useCart, cartSelectors } from "@/store/cart-store"
import { useRouter } from "next/navigation"
import { formatNaira } from "@/lib/currency"

export default function CheckoutPage() {
  const total = useCart(cartSelectors.total)
  const clear = useCart((s) => s.clear)
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const onPay = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    clear()
    setLoading(false)
    router.push("/")
  }

  return (
    <LayoutShell>
      <section className="container mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold tracking-tight">Checkout</h1>
        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <form onSubmit={onPay} className="rounded-lg border bg-card p-6 space-y-4">
            <h2 className="text-lg font-medium">Shipping Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input placeholder="First name" required />
              <Input placeholder="Last name" required />
            </div>
            <Input type="email" placeholder="Email" required />
            <Input placeholder="Address" required />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input placeholder="City" required />
              <Input placeholder="State" required />
              <Input placeholder="ZIP" required />
            </div>

            <h2 className="pt-4 text-lg font-medium">Payment</h2>
            <Input placeholder="Card number" required />
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="MM/YY" required />
              <Input placeholder="CVC" required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Processing..." : `Pay ${formatNaira(total)}`}
            </Button>
          </form>
          <div className="rounded-lg border p-6 h-fit">
            <h2 className="text-lg font-medium">Order Summary</h2>
            <div className="mt-3 flex items-center justify-between">
              <span>Subtotal</span>
              <span className="font-semibold">{formatNaira(total)}</span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span>Shipping</span>
              <span className="font-semibold">{formatNaira(0)}</span>
            </div>
            <div className="mt-3 border-t pt-3 flex items-center justify-between">
              <span>Total</span>
              <span className="text-xl font-semibold">{formatNaira(total)}</span>
            </div>
          </div>
        </div>
      </section>
    </LayoutShell>
  )
}
