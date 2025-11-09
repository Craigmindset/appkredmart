import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React from "react";
import { Metadata } from "next";
import StorePage from "./page-client";
import { getProducts } from "@/lib/services/products/use-get-products";
import { getQueryClient } from "@/lib/query-client";

export const metadata: Metadata = {
  title: "Store - Shop All Products | Kredmart",
  description:
    "Browse our complete collection of products at Kredmart. Find electronics, fashion, home goods, and more. Shop with flexible payment options and fast delivery.",
  keywords: [
    "online shopping",
    "Kredmart store",
    "buy products online",
    "electronics",
    "fashion",
    "home goods",
    "e-commerce Nigeria",
  ],
  openGraph: {
    title: "Store - Shop All Products | Kredmart",
    description:
      "Browse our complete collection of products at Kredmart. Shop with flexible payment options and fast delivery.",
    type: "website",
    url: "https://kredmart.com/store",
    siteName: "Kredmart",
  },
  twitter: {
    card: "summary_large_image",
    title: "Store - Shop All Products | Kredmart",
    description:
      "Browse our complete collection of products at Kredmart. Shop with flexible payment options and fast delivery.",
  },
  alternates: {
    canonical: "https://kredmart.com/store",
  },
};

const Page = async () => {
  const queryClient = getQueryClient();
  const params = { limit: 20, page: 1 };

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["PRODUCTS", params],
    queryFn: ({ pageParam = 1 }) => getProducts({ ...params, page: pageParam }),
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
      <StorePage />
    </HydrationBoundary>
  );
};

export default Page;
