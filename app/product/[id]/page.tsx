import { Metadata } from "next";
import { notFound } from "next/navigation";
import { productsService } from "@/lib/services/products/products";
import { extractIdFromSlug, generateProductSlug } from "@/lib/product-slug";
import ProductDetailClient from "./page-client";

type Props = {
  params: Promise<{ id: string }>;
};

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id: slugOrId } = await params;

  // Extract ID from slug if it's a slug, otherwise use as-is
  const productId = slugOrId.includes("-")
    ? extractIdFromSlug(slugOrId)
    : slugOrId;

  try {
    // Try to find product by the short ID (last 8 chars)
    // Note: You may need to update the API to support partial ID search
    const product = await productsService.getProductById(productId);

    // Generate proper slug for canonical URL
    const productSlug = generateProductSlug(product.name, product.id);

    const productTitle = `${product.name} - ${product.brand || "Kredmart"}`;
    const productDescription = product.description
      ? product.description.substring(0, 160)
      : `Buy ${product.name} at the best price. ${
          product.brand ? `Brand: ${product.brand}. ` : ""
        }Category: ${
          product.category?.[0] || "Products"
        }. Shop now on Kredmart!`;

    const productImage =
      product.image || product.images?.[0] || "/placeholder.svg";

    return {
      title: productTitle,
      description: productDescription,
      keywords: [
        product.name,
        product.brand || "",
        ...(product.category || []),
        "buy online",
        "Kredmart",
        "e-commerce",
        "shop",
      ].filter((keyword) => keyword !== ""),
      openGraph: {
        title: productTitle,
        description: productDescription,
        type: "website",
        url: `https://kredmart.com/product/${productSlug}`,
        images: [
          {
            url: productImage,
            width: 800,
            height: 600,
            alt: product.name,
          },
        ],
        siteName: "Kredmart",
      },
      twitter: {
        card: "summary_large_image",
        title: productTitle,
        description: productDescription,
        images: [productImage],
      },
      robots: {
        index: product.status === "Active",
        follow: true,
      },
      alternates: {
        canonical: `https://kredmart.com/product/${productSlug}`,
      },
    };
  } catch (error) {
    return {
      title: "Product Not Found - Kredmart",
      description: "The product you are looking for could not be found.",
    };
  }
}

export default async function ProductPage({ params }: Props) {
  const { id: slugOrId } = await params;

  // Extract ID from slug if it's a slug
  const productId = slugOrId.includes("-")
    ? extractIdFromSlug(slugOrId)
    : slugOrId;

  let product;
  try {
    product = await productsService.getProductById(productId);
  } catch (error) {
    notFound();
  }

  // Generate proper slug
  const productSlug = generateProductSlug(product.name, product.id);

  // Generate JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || `${product.name} available at Kredmart`,
    image: product.images || [product.image],
    brand: product.brand
      ? {
          "@type": "Brand",
          name: product.brand,
        }
      : undefined,
    sku: product.sku,
    offers: {
      "@type": "Offer",
      url: `https://kredmart.com/product/${productSlug}`,
      priceCurrency: "NGN",
      price: product.price,
      availability:
        product.status === "Active" && product.quantity > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: product.merchant?.company || "Kredmart",
      },
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    },
    category: product.category?.[0] || "Products",
  };

  return (
    <>
      {/* Add JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://kredmart.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Store",
                item: "https://kredmart.com/store",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: product.category?.[0] || "Products",
                item: `https://kredmart.com/store/${(
                  product.category?.[0] || "all"
                )
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`,
              },
              {
                "@type": "ListItem",
                position: 4,
                name: product.name,
                item: `https://kredmart.com/product/${productSlug}`,
              },
            ],
          }),
        }}
      />

      <ProductDetailClient product={product} />
    </>
  );
}

// Enable ISR (Incremental Static Regeneration)
export const revalidate = 3600; // Revalidate every hour
