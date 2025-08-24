"use client";

import LayoutShell from "@/components/layout-shell";
import { useCart, cartSelectors } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { formatNaira } from "@/lib/currency";

export default function CartPage() {
  const items = useCart((s) => s.items);
  const increment = useCart((s) => s.increment);
  const decrement = useCart((s) => s.decrement);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const total = useCart(cartSelectors.total);

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
            <div className="md:col-span-2 space-y-3">
              {items.map((i) => (
                <div
                  key={i.product.id}
                  className="flex items-center gap-3 rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow duration-200 p-2 min-w-0"
                >
                  <img
                    src={i.product.image || "/placeholder.svg"}
                    alt={i.product.title}
                    className="h-14 w-16 rounded-lg object-cover border"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">
                      {i.product.title}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {i.product.brand}
                    </div>
                    <div className="font-bold text-primary text-base mt-0.5">
                      {formatNaira(i.product.price)}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 border rounded px-1 py-0.5 bg-muted">
                    <button
                      className="px-2 py-0.5 text-lg text-gray-600 hover:text-primary"
                      onClick={() => decrement(i.product.id)}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="px-2 text-sm font-medium">
                      {i.quantity}
                    </span>
                    <button
                      className="px-2 py-0.5 text-lg text-white bg-blue-500 hover:bg-green-200 rounded"
                      onClick={() => increment(i.product.id)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <div className="font-semibold text-sm w-20 text-right">
                    {formatNaira(i.product.price * i.quantity)}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(i.product.id)}
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4 text-red-500 hover:text-red-700 transition" />
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
            <div className="rounded-xl border bg-card shadow-sm p-4 h-fit">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Subtotal</span>
                <span className="font-bold text-base">
                  {formatNaira(total)}
                </span>
              </div>
              <div className="mt-4">
                <Link
                  href="/checkout"
                  className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-background shadow hover:bg-primary/90 transition"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>
    </LayoutShell>
  );
}
