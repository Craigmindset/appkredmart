"use client";

import LayoutShell from "@/components/layout-shell";
import { useCart, cartSelectors } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { Trash2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatNaira } from "@/lib/currency";
import CrossSellProducts from "@/components/cross-sell-products";
import { useRelatedProducts } from "@/lib/services/products/use-related-products";

export default function CartPage() {
  const items = useCart((s) => s.items);
  const increment = useCart((s) => s.increment);
  const decrement = useCart((s) => s.decrement);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const total = useCart(cartSelectors.total);

  // Get related products based on first item in cart
  const firstProductId = items[0]?.product.id;
  const { data: recommendedProducts, isLoading: recommendedLoading } =
    useRelatedProducts(firstProductId || "", 6, !!firstProductId);

  // Debug cross-sell on cart
  console.log("Cart - First Product ID:", firstProductId);
  console.log("Cart - Recommended Products:", recommendedProducts);
  console.log("Cart - Recommended Loading:", recommendedLoading);

  return (
    <LayoutShell>
      <section className="container mx-auto px-3 sm:px-4 md:px-6 py-8 md:py-10 min-h-[56vh]">
        <h1
          className="text-xl sm:text-3xl font-semibold tracking-tight"
          style={{ fontFamily: "sans-serif" }}
        >
          Your Cart
        </h1>

        {items.length === 0 ? (
          <div className="mt-8">
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Button asChild className="mt-4 bg-[#0F3D73] hover:bg-[#0F3D73]/90">
              <Link href="/store">Continue shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {/* Items */}
            <div className="lg:col-span-2 space-y-3">
              <ul role="list" className="space-y-3">
                {items.map((i) => {
                  const lineTotal = i.product.price * i.quantity;
                  const qtyId = `qty-${i.product.id}`;
                  return (
                    <li
                      key={i.product.id}
                      className="grid grid-cols-[22px_64px_1fr_auto] sm:grid-cols-[22px_80px_1fr_auto] items-center gap-2 sm:gap-3 rounded-xl border bg-card p-2 sm:p-3 shadow-sm"
                    >
                      {/* Status tick */}
                      <div className="flex items-center justify-center">
                        <CheckCircle2
                          className="h-4 w-4 sm:h-5 sm:w-5 text-green-600"
                          aria-label="In stock"
                        />
                      </div>

                      {/* Image */}
                      <div className="relative h-12 w-12 sm:h-16 sm:w-16 overflow-hidden rounded-md border">
                        <Image
                          src={i.product.image || "/placeholder.svg"}
                          alt={i.product.name}
                          fill
                          sizes="(max-width: 640px) 48px, 64px"
                          className="object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="min-w-0">
                        <p className="text-[13px] sm:text-sm font-medium leading-tight truncate">
                          {i.product.name}
                        </p>
                        {i.product.merchant?.company && (
                          <div className="mt-0.5 flex items-center gap-1.5">
                            {i.product.merchant.logo && (
                              <div className="relative h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0">
                                <Image
                                  src={i.product.merchant.logo}
                                  alt={`${i.product.merchant.company} logo`}
                                  fill
                                  sizes="20px"
                                  className="object-contain rounded-sm"
                                />
                              </div>
                            )}
                            <p className="text-[11px] sm:text-xs text-red-800 truncate">
                              Vendor: {i.product.merchant.company}
                            </p>
                          </div>
                        )}
                        {/* price */}
                        <p className="mt-1 text-[13px] sm:text-sm font-semibold">
                          {formatNaira(i.product.price)}
                        </p>
                      </div>

                      {/* Right controls: qty stepper + delete */}
                      <div className="flex items-center gap-2 justify-self-end">
                        <div className="inline-flex items-center rounded-md border bg-muted/60">
                          <button
                            type="button"
                            onClick={() => decrement(i.product.id)}
                            aria-controls={qtyId}
                            aria-label={`Decrease quantity of ${i.product.name}`}
                            className="h-7 w-7 sm:h-8 sm:w-8 grid place-items-center text-gray-600 hover:text-foreground"
                          >
                            −
                          </button>
                          <output
                            id={qtyId}
                            aria-live="polite"
                            className="min-w-6 text-center text-[12px] sm:text-sm font-medium"
                          >
                            {i.quantity}
                          </output>
                          <button
                            type="button"
                            onClick={() => increment(i.product.id)}
                            aria-label={`Increase quantity of ${i.product.name}`}
                            className="h-7 w-7 sm:h-8 sm:w-8 grid place-items-center text-gray-800 hover:text-foreground"
                          >
                            +
                          </button>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground hover:text-red-600"
                          onClick={() => remove(i.product.id)}
                          aria-label={`Remove ${i.product.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Line total under row on very small screens (optional) */}
                      <div className="col-span-4 sm:hidden flex items-center justify-between pt-1">
                        <span className="text-xs text-muted-foreground">
                          Total
                        </span>
                        <span className="font-semibold text-sm">
                          {formatNaira(lineTotal)}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* Row actions */}
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between pt-2">
                <Button
                  asChild
                  variant="link"
                  className="px-0 h-auto text-[#0F3D73] hover:text-[#0F3D73]/80"
                >
                  <Link href="/store" className="text-sm">
                    Continue shopping
                  </Link>
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={clear}>
                    Clear cart
                  </Button>
                </div>
              </div>
            </div>

            {/* Summary */}
            <aside className="rounded-xl border bg-card shadow-sm p-4 h-fit lg:sticky lg:top-24">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="font-bold text-base">
                  {formatNaira(total)}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Taxes and shipping calculated at checkout.
              </p>
              <div className="mt-4">
                <Button
                  asChild
                  className="w-full h-10 bg-blue-900 hover:bg-blue-800"
                >
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
              </div>
              <div className="mt-2">
                <Button asChild variant="outline" className="w-full h-10">
                  <Link href="/store">Add more items</Link>
                </Button>
              </div>
            </aside>
          </div>
        )}

        {/* Recommended Products Section */}
        {items.length > 0 &&
          recommendedProducts &&
          recommendedProducts.length > 0 && (
            <div className="mt-12">
              <CrossSellProducts
                title="Complete Your Purchase"
                description="Products you might also need"
                products={recommendedProducts}
                isLoading={recommendedLoading}
              />
            </div>
          )}
      </section>
    </LayoutShell>
  );
}
