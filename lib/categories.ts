import { allCategories, products } from "@/lib/products"

export function slugifyCategory(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-")
}

export function getCategoryFromSlug(slug: string) {
  const found = allCategories.find((c) => slugifyCategory(c) === slug)
  return found || null
}

export function getCategoryBrands(category: string) {
  const brands = new Set(products.filter((p) => p.category === category).map((p) => p.brand))
  return Array.from(brands).sort()
}
