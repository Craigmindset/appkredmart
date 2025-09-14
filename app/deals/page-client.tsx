"use client";
import ProductsGrid from "@/components/products-grid";
import DealsBanner from "@/components/deals-banner";
import DealsAds from "@/components/deals-ads";
import React from "react";
// import { products } from "@/lib/products";
import { useInfiniteProducts } from "@/lib/services/products/use-infinite-products";

const PageClient = () => {
  //   const deals = products.filter((p) => p.deal || p.label === "Hot Deal");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteProducts({ limit: 20, deals: true });

  const products = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <>
      <DealsBanner />
      <DealsAds />
      <div className="w-full flex justify-center">
        <div className="w-full max-w-6xl text-center  bg-[#001F4D] py-2">
          <h2 className="text-lg md:text-2xl font-bold text-white">
            KredMart Deals
          </h2>
          <p className="text-sm md:text-base text-white">
            {" "}
            Exclusive offers and limited-time discounts. Don’t miss out.
          </p>
        </div>
      </div>
      <div className="w-full flex justify-center mt-0">
        <div className="w-full max-w-6xl text-center">
          <ProductsGrid
            items={products}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        </div>
      </div>
    </>
  );
};

export default PageClient;
