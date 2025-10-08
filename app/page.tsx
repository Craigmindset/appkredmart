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
import { ProductDeals } from "./page-client";

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
        <div className="hidden md:block bg-black">
          <HeroSlider />
        </div>
      </div>
      <BrandCarousel />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductDeals />
      </HydrationBoundary>
      <AdBanner />
      <ThreeColumnAd />
      <TestimonialGrid />
      <Newsletter />
      <Chat />
    </LayoutShell>
  );
}

export const revalidate = 60;
