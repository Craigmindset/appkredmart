import AdBanner from "@/components/AdBanner2";
import Chat from "@/components/Chat";
import TestimonialGrid from "@/components/TestimonialGrid";
import ThreeColumnAd from "@/components/ThreeColumnAd";
import BrandCarousel from "@/components/brand-carousel";
import HeroMobile from "@/components/hero-mobile";
import HeroSlider from "@/components/hero-slider";
import LayoutShell from "@/components/layout-shell";
import Newsletter from "@/components/newsletter";
import { getQueryClient } from "@/lib/query-client";
import { getProducts } from "@/lib/services/products/use-get-products";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next";
import { ProductDeals } from "./page-client";

export const metadata: Metadata = {
  title:
    "Kredmart - Shop Smart, Live Better | Online Shopping with Flexible Payments",
  description:
    "Shop the latest products at Kredmart with flexible payment options. Find electronics, fashion, home goods, and more. Enjoy fast delivery and secure payments. Shop now!",
  keywords: [
    "online shopping",
    "Kredmart",
    "buy now pay later",
    "flexible payments",
    "electronics",
    "fashion",
    "home goods",
    "e-commerce Nigeria",
    "wallet loans",
  ],
  openGraph: {
    title: "Kredmart - Shop Smart, Live Better",
    description:
      "Shop the latest products at Kredmart with flexible payment options. Enjoy fast delivery and secure payments.",
    type: "website",
    url: "https://kredmart.com",
    siteName: "Kredmart",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kredmart - Shop Smart, Live Better",
    description:
      "Shop the latest products at Kredmart with flexible payment options. Enjoy fast delivery and secure payments.",
  },
  alternates: {
    canonical: "https://kredmart.com",
  },
};

export default async function Page() {
  const queryClient = getQueryClient();
  const params = { offset: 0, limit: 6, page: 1 };
  await queryClient.prefetchQuery({
    queryKey: ["PRODUCTS", params],
    queryFn: async () => await getProducts(params),
    staleTime: 1000 * 60 * 5,
  });
  return (
    <LayoutShell>
      <div>
        <div className="block md:hidden">
          <HeroMobile />
        </div>
        <div className="hidden md:block ">
          <HeroSlider />
        </div>
      </div>
      <BrandCarousel />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductDeals />
      </HydrationBoundary>
      <div className="hidden md:block">
        <AdBanner />
      </div>
      <ThreeColumnAd />
      <TestimonialGrid />
      <Newsletter />
      <Chat />
    </LayoutShell>
  );
}

export const revalidate = 60;
