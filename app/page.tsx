import BrandCarousel from "@/components/brand-carousel";
import HeroSlider from "@/components/hero-slider";
import AdBanner from "@/components/AdBanner2";
import TestimonialGrid from "@/components/TestimonialGrid";
import ThreeColumnAd from "@/components/ThreeColumnAd";
import LayoutShell from "@/components/layout-shell";
import Newsletter from "@/components/newsletter";
import TestimonialsSlider from "@/components/testimonials-slider";
import { ProductDeals } from "./page-client";

export default function Page() {
  return (
    <LayoutShell>
      <HeroSlider />
      <BrandCarousel />
      <ProductDeals />
      <AdBanner />
      <ThreeColumnAd />
      <TestimonialGrid />
      <Newsletter />
    </LayoutShell>
  );
}
