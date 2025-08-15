"use client"

import LayoutShell from "@/components/layout-shell"
import { useCart, cartSelectors } from "@/store/cart-store"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import Link from "next/link"
import { formatNaira } from "@/lib/currency"

export default function CartPage() {
  const items = useCart((s) => s.items)
  const increment = useCart((s) => s.increment)
  const decrement = useCart((s) => s.decrement)
  const remove = useCart((s) => s.remove)
  const clear = useCart((s) => s.clear)
  const total = useCart(cartSelectors.total)

  return (
    <LayoutShell>
      <section className="container mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold tracking-tight">Your Cart</h1>
        {items.length === 0 ? (
          <div className="mt-8">
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Link href="/store" className="mt-3 inline-block underline">
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-4">
              {items.map((i) => (
                <div key={i.product.id} className="flex items-center gap-4 rounded-lg border p-4">
                  <img
                    src={i.product.image || "/placeholder.svg"}
                    alt={i.product.title}
                    className="h-20 w-24 rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{i.product.title}</div>
                    <div className="text-sm text-muted-foreground">{i.product.brand}</div>
                    <div className="mt-1 font-semibold">{formatNaira(i.product.price)}</div>
                    <div className="mt-2 inline-flex items-center rounded border">
                      <button
                        className="px-3 py-1"
                        onClick={() => decrement(i.product.id)}
                        aria-label="Decrease quantity"
                      >
                        {"−"}
                      </button>
                      <span className="px-3 py-1 text-sm">{i.quantity}</span>
                      <button
                        className="px-3 py-1"
                        onClick={() => increment(i.product.id)}
                        aria-label="Increase quantity"
                      >
                        {"+"}
                      </button>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => remove(i.product.id)} aria-label="Remove">
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              ))}
              <div className="flex items-center gap-3">
                <Link href="/store" className="underline text-sm">
                  Continue shopping
                </Link>
                <Button variant="outline" onClick={clear}>
                  Clear cart
                </Button>
              </div>
            </div>
            <div className="rounded-lg border p-4 h-fit">
              <div className="flex items-center justify-between">
                <span className="text-sm">Subtotal</span>
                <span className="font-semibold">{formatNaira(total)}</span>
              </div>
              <div className="mt-4">
                <Link
                  href="/checkout"
                  className="inline-flex h-10 w-full items-center justify-center rounded-md bg-foreground px-4 text-sm font-medium text-background"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>
    </LayoutShell>
  )
}
