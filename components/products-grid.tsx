import type { Product } from "@/lib/products"
import ProductCard from "./product-card"

export default function ProductsGrid({
  title,
  description,
  items,
}: {
  title?: string
  description?: string
  items: Product[]
}) {
  return (
    <section className="container mx-auto px-4 py-10">
      {(title || description) && (
        <div className="mb-6">
          {title && <h2 className="text-xl md:text-2xl font-semibold tracking-tight">{title}</h2>}
          {description && <p className="text-sm md:text-base text-muted-foreground mt-1">{description}</p>}
        </div>
      )}
      {/* Keep generic grid for shared usage; category page uses its own 3/5 layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}
