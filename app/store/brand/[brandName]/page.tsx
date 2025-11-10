import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React from "react";
import { Metadata } from "next";
import BrandPage from "./page-client";
import { getProducts } from "@/lib/services/products/use-get-products";
import { getQueryClient } from "@/lib/query-client";

const BRANDS = [
  "APPLE",
  "Samsung",
  "JBL",
  "Sony",
  "HP",
  "Dell",
  "Nike",
  "Adidas",
  "Canon",
  "Infinix",
  "Tecno",
  "Oraimo",
];

type Props = {
  params: Promise<{ brandName: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brandName } = await params;

  // Match the URL slug to the actual brand name (case-insensitive)
  const displayBrand =
    BRANDS.find(
      (b) => b.toLowerCase().replace(/\s+/g, "-") === brandName.toLowerCase()
    ) ||
    brandName
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  return {
    title: `${displayBrand} Products - Shop ${displayBrand} | Kredmart`,
    description: `Browse all ${displayBrand} products at Kredmart. Find authentic ${displayBrand} electronics, phones, accessories and more. Shop with flexible payment options and fast delivery.`,
    keywords: [
      `${displayBrand} products`,
      `buy ${displayBrand} online`,
      `${displayBrand} Nigeria`,
      "Kredmart",
      "online shopping",
      `${displayBrand} store`,
    ],
    openGraph: {
      title: `${displayBrand} Products - Shop ${displayBrand} | Kredmart`,
      description: `Browse all ${displayBrand} products at Kredmart. Shop with flexible payment options and fast delivery.`,
      type: "website",
      url: `https://kredmart.com/store/brand/${brandName}`,
      siteName: "Kredmart",
    },
    twitter: {
      card: "summary_large_image",
      title: `${displayBrand} Products - Shop ${displayBrand} | Kredmart`,
      description: `Browse all ${displayBrand} products at Kredmart.`,
    },
    alternates: {
      canonical: `https://kredmart.com/store/brand/${brandName}`,
    },
  };
}

const Page = async ({ params }: Props) => {
  const { brandName } = await params;
  const queryClient = getQueryClient();

  // Match the URL slug to the actual brand name (case-insensitive)
  const actualBrand =
    BRANDS.find(
      (b) => b.toLowerCase().replace(/\s+/g, "-") === brandName.toLowerCase()
    ) ||
    brandName
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const queryParams = { limit: 20, page: 1, brand: actualBrand };

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["PRODUCTS", queryParams],
    queryFn: ({ pageParam = 1 }) =>
      getProducts({ ...queryParams, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => {
      const { page, pageSize, total } = lastPage;
      const totalPages = Math.ceil(total / pageSize);
      return page < totalPages ? page + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BrandPage brandName={brandName} />
    </HydrationBoundary>
  );
};

export default Page;

// Enable ISR (Incremental Static Regeneration)
export const revalidate = 3600; // Revalidate every hour
