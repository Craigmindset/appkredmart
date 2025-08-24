"use client";
import ProductsGrid from "@/components/products-grid";
import { useGetProducts } from "@/lib/services/products/use-get-products";

export const ProductDeals = () => {
  const { data } = useGetProducts({ limit: 5 });
  return (
    <ProductsGrid
      title="KredMart Deals"
      description={
        "get started with KredMart, a shopping experience that gives you the flexibility to shop more"
      }
      items={data?.data || []}
    />
  );
};
