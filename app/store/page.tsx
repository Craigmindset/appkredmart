import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import React from "react";
import StorePage from "./page-client";
import { getProducts } from "@/lib/services/products/use-get-products";
import { getQueryClient } from "@/lib/query-client";

const Page = async () => {
  const queryClient = getQueryClient();
  const params = { offset: 0, limit: 20 };
  await queryClient.prefetchQuery({
    queryKey: ["PRODUCTS", params],
    queryFn: async () => await getProducts(params),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StorePage />
    </HydrationBoundary>
  );
};

export default Page;
