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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/products";
import { useCart } from "@/store/cart-store";
import { useToast } from "@/hooks/use-toast";
import { formatNaira } from "@/lib/currency";

export default function ProductCard({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const add = useCart((s) => s.add);
  const { toast } = useToast();

  const onAdd = (q = 1) => {
    add(product, q);
    toast({ title: "Added to cart", description: product.title });
  };

  return (
    <>
      <div className="group relative rounded-lg border bg-card">
        <div className="relative">
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
            alt={product.title}
            width={400}
            height={300}
            className="h-48 w-full rounded-t-lg object-cover cursor-pointer"
            onClick={() => onAdd(1)}
          />
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
          <div className="line-clamp-1 font-medium">{product.title}</div>
          <div className="mt-1 font-semibold">{formatNaira(product.price)}</div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{product.title}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Image
                src={product.images?.[0] ?? product.image}
                alt={product.title + " main"}
                width={600}
                height={400}
                className="h-64 w-full rounded-md object-cover"
              />
              <div className="grid grid-cols-3 gap-2">
                {(product.images ?? [product.image])
                  .slice(0, 3)
                  .map((img, i) => (
                    <Image
                      key={i}
                      src={img || "/placeholder.svg"}
                      alt={"Gallery " + (i + 1)}
                      width={200}
                      height={120}
                      className="h-20 w-full rounded-md object-cover"
                    />
                  ))}
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-muted-foreground">{product.description}</p>
              <div>
                <h4 className="mb-2 text-sm font-medium">Specifications</h4>
                <ul className="list-inside list-disc text-sm text-muted-foreground">
                  {product.specs.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Qty</span>
                <Input
                  type="number"
                  min={1}
                  value={qty}
                  onChange={(e) =>
                    setQty(Math.max(1, Number(e.target.value || 1)))
                  }
                  className="w-20"
                />
              </div>
              <Button className="w-full" onClick={() => onAdd(qty)}>
                {"Add to cart — " + formatNaira(qty * product.price)}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
