import LayoutShell from "@/components/layout-shell"
import HeroSlider from "@/components/hero-slider"
import BrandCarousel from "@/components/brand-carousel"
import ProductsGrid from "@/components/products-grid"
import AdBannerGrid from "@/components/ad-banner-grid"
import TestimonialsSlider from "@/components/testimonials-slider"
import Newsletter from "@/components/newsletter"
import { products } from "@/lib/products"

export default function Page() {
  const deals = products.filter((p) => p.deal).slice(0, 5)
  return (
    <LayoutShell>
      <HeroSlider />
      <BrandCarousel />
      <ProductsGrid
        title="KredMart Deals"
        description={"get started with KredMart, a shopping experience that gives you the flexibility to shop more"}
        items={deals}
      />
      <AdBannerGrid />
      <TestimonialsSlider />
      <Newsletter />
    </LayoutShell>
  )
}
