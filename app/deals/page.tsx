import LayoutShell from "@/components/layout-shell"
import ProductsGrid from "@/components/products-grid"
import { products } from "@/lib/products"

export default function DealsPage() {
  const deals = products.filter((p) => p.deal || p.label === "Hot Deal")
  return (
    <LayoutShell>
      <ProductsGrid
        title="KredMart Deals"
        description={"Exclusive offers and limited-time discounts. Don’t miss out."}
        items={deals}
      />
    </LayoutShell>
  )
}
