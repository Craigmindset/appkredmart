"use client";
import ProductsGrid from "@/components/products-grid";
import React from "react";
// import { products } from "@/lib/products";
import { useInfiniteProducts } from "@/lib/services/products/use-infinite-products";

const PageClient = () => {
  //   const deals = products.filter((p) => p.deal || p.label === "Hot Deal");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteProducts({ limit: 20, deals: true });

  const products = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <ProductsGrid
      title="KredMart Deals"
      description={
        "Exclusive offers and limited-time discounts. Don’t miss out."
      }
      items={products}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
    />
  );
};

export default PageClient;
