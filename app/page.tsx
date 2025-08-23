import AdBannerGrid from "@/components/ad-banner-grid";
import BrandCarousel from "@/components/brand-carousel";
import HeroSlider from "@/components/hero-slider";
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
      <AdBannerGrid />
      <TestimonialsSlider />
      <Newsletter />
    </LayoutShell>
  );
}
