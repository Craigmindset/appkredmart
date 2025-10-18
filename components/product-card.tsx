"use client";

import { useState } from "react";
import { Eye, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import he from "he";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/store/cart-store";
import { useToast } from "@/hooks/use-toast";
import { formatNaira } from "@/lib/currency";
import { GetProductDto } from "@/lib/services/products/products";

export default function ProductCard({
  product,
  showDealBadge = false,
}: {
  product: GetProductDto;
  showDealBadge?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [mainImg, setMainImg] = useState(
    product.images?.[0] ?? product.image ?? "/placeholder.svg"
  );
  const add = useCart((s) => s.add);
  const { toast } = useToast();

  const onAdd = (q = 1) => {
    add(product as any, q);
    toast({ title: "Added to cart", description: product.name });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  // Reset added state when modal closes
  const handleOpenChange = (v: boolean) => {
    setOpen(v);
    if (!v) setAdded(false);
    if (!v)
      setMainImg(product.images?.[0] ?? product.image ?? "/placeholder.svg");
  };

  return (
    <>
      {/* Product tile */}
      <div className="group relative rounded-lg border bg-card">
        <div className="relative">
          {/* Show 2% badge if showDealBadge is true */}
          {showDealBadge && (
            <Badge
              className="absolute right-2 top-2 z-20 bg-red-600 text-white px-2 py-1 text-xs font-bold shadow-md"
              variant="default"
            >
              -2%
            </Badge>
          )}
          {product.label && (
            <Badge
              className={`absolute left-2 top-2 z-10 ${
                product.label === "Kredmart deals"
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : ""
              }`}
              variant={
                product.label === "Kredmart deals" ? "default" : "secondary"
              }
            >
              {product.label}
            </Badge>
          )}

          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={400}
            height={300}
            className="h-32 w-full sm:h-48 md:h-60 rounded-t-lg object-contain cursor-pointer"
            onClick={() => onAdd(1)}
          />

          {/* Hover actions */}
          <div className="absolute inset-0 hidden items-center justify-center gap-2 bg-black/30 group-hover:flex">
            <Button
              size="icon"
              variant="secondary"
              onClick={() => onAdd(1)}
              aria-label="Add to cart"
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              onClick={() => setOpen(true)}
              aria-label="Preview"
            >
              <Eye className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="p-3">
          <div className="text-sm text-muted-foreground">{product.brand}</div>
          <div className="line-clamp-1 font-medium text-sm">{product.name}</div>
          <div className="mt-1 font-semibold text-blue-600 text-sm">
            {formatNaira(product.price)}
          </div>
        </div>
      </div>

      {/* Modal */}
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="w-full max-w-[400px] md:max-w-4xl p-0 px-4 md:px-0 overflow-hidden justify-center rounded-2xl bg-white shadow-2xl border-0 my-8 max-h-[80vh] mx-0 md:mx-0">
          <div className="flex flex-col md:flex-row min-h-[340px] max-h-[75vh] overflow-y-auto">
            {/* Left: Main Image + Thumbnails */}
            <div
              className="md:w-1/2 bg-gray-50 flex flex-col items-center justify-center p-4 md:p-6 md:sticky md:top-0 md:self-start"
              style={{ zIndex: 1 }}
            >
              <Image
                src={mainImg}
                alt={product.name + " main"}
                width={350}
                height={350}
                className="rounded-lg object-contain w-full h-60 md:h-72 bg-white"
                priority
              />
              <div className="flex gap-2 mt-3">
                {(product.images ?? [product.image])
                  .filter(Boolean)
                  .slice(0, 3)
                  .map((img, i) => (
                    <Image
                      key={i}
                      src={img || "/placeholder.svg"}
                      alt={"Gallery " + (i + 1)}
                      width={70}
                      height={70}
                      className={`rounded-lg object-cover w-16 h-16 border border-gray-200 bg-white cursor-pointer hover:ring-2 hover:ring-blue-500 transition ${
                        mainImg === img ? "ring-2 ring-blue-500" : ""
                      }`}
                      onClick={() => setMainImg(img)}
                    />
                  ))}
              </div>
            </div>

            {/* Right: Details */}
            <div className="md:w-1/2 p-4 md:p-6 flex flex-col justify-between pb-4 md:pb-6">
              <div>
                {/* Optional header (kept for accessibility / structure) */}
                <DialogHeader className="p-0 mb-1">
                  <DialogTitle className="sr-only">{product.name}</DialogTitle>
                </DialogHeader>

                <h2 className="text-base md:text-lg font-bold text-gray-900 mb-2">
                  {product.name}
                </h2>

                {/* Wallet Loan Banner (exact text per your request) */}
                <div className="bg-blue-50 border border-blue-200 text-blue-700 text-xs rounded-md px-2 py-1 mb-2">
                  Need a Wallet Loan to purchase?{" "}
                  <a
                    href="#"
                    className="font-semibold underline hover:text-blue-900 transition"
                    onClick={(e) => {
                      e.preventDefault();
                      const user =
                        require("@/store/auth-store").useAuth.getState().user;
                      window.location.href = user
                        ? "/dashboard/loan-request"
                        : "/sign-in";
                    }}
                  >
                    clickhere
                  </a>
                </div>

                {/* Price */}
                <div className="text-lg font-semibold text-blue-600 mb-3">
                  {formatNaira(product.price)}
                </div>

                {/* Description */}
                {product.description && (
                  <div
                    className="text-xs text-gray-500 mb-3 leading-snug"
                    dangerouslySetInnerHTML={{
                      __html: he.decode(product.description),
                    }}
                  />
                )}

                {/* Key Features / Specs */}
                {Array.isArray(product?.specs) && product.specs.length > 0 && (
                  <div className="mb-3">
                    <h4 className="text-xs font-semibold text-gray-800 mb-1">
                      Key Features
                    </h4>
                    <ul className="list-disc list-inside text-xs text-gray-500 space-y-1">
                      {product.specs.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Qty + Add to Cart */}
              <div className="flex items-center gap-2 mt-4">
                <span className="text-xs text-gray-700">Qty</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-8 h-8 p-0 text-lg"
                  aria-label="Decrease quantity"
                  onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
                >
                  −
                </Button>
                <Input
                  type="number"
                  min={1}
                  value={qty}
                  onChange={(e) =>
                    setQty(Math.max(1, Number(e.target.value || 1)))
                  }
                  className="w-14 h-8 text-xs text-center"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="w-8 h-8 p-0 text-lg"
                  aria-label="Increase quantity"
                  onClick={() => setQty(qty + 1)}
                >
                  +
                </Button>
                <Button
                  className={`ml-auto px-3 py-1.5 text-xs rounded-md transition-colors ${
                    added ? "bg-green-600 hover:bg-green-700 text-white" : ""
                  }`}
                  onClick={() => onAdd(qty)}
                >
                  {added
                    ? "Added!"
                    : "Add to cart — " + formatNaira(qty * product.price)}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
