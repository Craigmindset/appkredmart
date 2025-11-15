"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/store/cart-store";
import { useToast } from "@/hooks/use-toast";
import { formatNaira } from "@/lib/currency";
import { GetProductDto } from "@/lib/services/products/products";
import LayoutShell from "@/components/layout-shell";
import CrossSellProducts from "@/components/cross-sell-products";
import { useRelatedProducts } from "@/lib/services/products/use-related-products";
import { useFrequentlyBoughtTogether } from "@/lib/services/products/use-frequently-bought-together";

interface ProductDetailClientProps {
  product: GetProductDto;
}

export default function ProductDetailClient({
  product,
}: ProductDetailClientProps) {
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(
    product.images?.[0] || product.image || "/placeholder.svg"
  );
  const [added, setAdded] = useState(false);
  const add = useCart((s) => s.add);
  const { toast } = useToast();

  // Fetch cross-sell products
  const { data: relatedProducts, isLoading: relatedLoading } =
    useRelatedProducts(product.id);
  const { data: frequentlyBought, isLoading: frequentlyLoading } =
    useFrequentlyBoughtTogether(product.id);

  // Debug: Check what's being returned
  console.log("Product ID:", product.id);
  console.log("Related Products:", relatedProducts);
  console.log("Related Loading:", relatedLoading);
  console.log("Frequently Bought:", frequentlyBought);
  console.log("Frequently Loading:", frequentlyLoading);

  const handleAddToCart = () => {
    add(product, qty);
    toast({
      title: "Added to cart",
      description: `${qty} x ${product.name}`,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} on Kredmart`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Product link copied to clipboard",
      });
    }
  };

  const images = product.images || [product.image].filter(Boolean);
  const isInStock = product.status === "Active" && product.quantity > 0;

  return (
    <LayoutShell>
      {/* Breadcrumb Navigation */}
      <nav
        className="container mx-auto px-6 md:px-12 py-4"
        aria-label="Breadcrumb"
      >
        <ol
          className="flex items-center gap-2 text-sm text-muted-foreground"
          itemScope
          itemType="https://schema.org/BreadcrumbList"
        >
          <li
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            <Link
              href="/"
              className="hover:text-foreground transition-colors"
              itemProp="item"
            >
              <span itemProp="name">Home</span>
            </Link>
            <meta itemProp="position" content="1" />
          </li>
          <ChevronRight className="h-4 w-4" />
          <li
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            <Link
              href="/store"
              className="hover:text-foreground transition-colors"
              itemProp="item"
            >
              <span itemProp="name">Store</span>
            </Link>
            <meta itemProp="position" content="2" />
          </li>
          <ChevronRight className="h-4 w-4" />
          <li
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            <Link
              href={`/store/${product.category
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
              className="hover:text-foreground transition-colors"
              itemProp="item"
            >
              <span itemProp="name">{product.category}</span>
            </Link>
            <meta itemProp="position" content="3" />
          </li>
          <ChevronRight className="h-4 w-4" />
          <li
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
            className="font-medium text-foreground"
          >
            <span itemProp="name">{product.name}</span>
            <meta itemProp="position" content="4" />
          </li>
        </ol>
      </nav>

      <section className="container mx-auto px-6 md:px-12 py-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column: Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-lg border bg-gray-50 overflow-hidden">
              <Image
                src={selectedImage}
                alt={product.name}
                fill
                className="object-contain p-4"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {product.label && (
                <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                  {product.label}
                </Badge>
              )}
              {!isInStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Badge variant="destructive" className="text-lg px-6 py-2">
                    Out of Stock
                  </Badge>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.slice(0, 4).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative aspect-square rounded-lg border-2 overflow-hidden transition-all ${
                      selectedImage === img
                        ? "border-blue-600 ring-2 ring-blue-200"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} - Image ${idx + 1}`}
                      fill
                      className="object-contain p-2"
                      sizes="(max-width: 768px) 25vw, 12.5vw"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Info */}
          <div className="space-y-6">
            {/* Brand */}
            {product.brand && (
              <div className="text-sm text-muted-foreground">
                Brand:{" "}
                <span className="font-medium text-foreground">
                  {product.brand}
                </span>
              </div>
            )}

            {/* Product Name */}
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {product.name}
            </h1>

            {/* SKU */}
            <div className="text-sm text-muted-foreground">
              SKU: <span className="font-mono">{product.sku}</span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold text-blue-600">
                {formatNaira(product.price)}
              </div>
              {product.discount > 0 && (
                <div className="flex items-center gap-3">
                  <span className="text-lg text-muted-foreground line-through">
                    {formatNaira(product.price / (1 - product.discount / 100))}
                  </span>
                  <Badge variant="destructive">-{product.discount}%</Badge>
                </div>
              )}
            </div>

            <Separator />

            {/* Description */}
            {product.description && (
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Description</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Specifications */}
            {product.specs && product.specs.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Specifications</h2>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {product.specs.map((spec, idx) => (
                    <li key={idx}>{spec}</li>
                  ))}
                </ul>
              </div>
            )}

            <Separator />

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label htmlFor="quantity" className="font-medium">
                  Quantity:
                </label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max={product.quantity}
                  value={qty}
                  onChange={(e) =>
                    setQty(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-24"
                  disabled={!isInStock}
                />
                {isInStock && (
                  <span className="text-sm text-muted-foreground">
                    {product.quantity} available
                  </span>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={!isInStock || added}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {added ? "Added!" : "Add to Cart"}
                </Button>
                <Button size="lg" variant="outline" onClick={handleShare}>
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50">
                <Truck className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <div className="font-medium text-sm">Fast Delivery</div>
                  <div className="text-xs text-muted-foreground">
                    2-5 business days
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50">
                <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <div className="font-medium text-sm">Secure Payment</div>
                  <div className="text-xs text-muted-foreground">
                    100% protected
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50">
                <RefreshCw className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <div className="font-medium text-sm">Easy Returns</div>
                  <div className="text-xs text-muted-foreground">
                    7-day return policy
                  </div>
                </div>
              </div>
            </div>

            {/* Merchant Info */}
            {product.merchant?.company && (
              <div className="pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Sold by:{" "}
                  <span className="font-medium text-foreground">
                    {product.merchant.company}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Frequently Bought Together Section */}
      {frequentlyBought && frequentlyBought.length > 0 && (
        <section className="container mx-auto px-6 md:px-12">
          <CrossSellProducts
            title="Frequently Bought Together"
            description="Customers who bought this item also bought"
            products={frequentlyBought}
            isLoading={frequentlyLoading}
          />
        </section>
      )}

      {/* Related Products Section */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="container mx-auto px-6 md:px-12">
          <CrossSellProducts
            title="You May Also Like"
            description="Similar products you might be interested in"
            products={relatedProducts}
            isLoading={relatedLoading}
          />
        </section>
      )}
    </LayoutShell>
  );
}
