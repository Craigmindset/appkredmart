import { NextResponse } from "next/server";
import { productsService } from "@/lib/services/products/products";

// GET /api/products/recommendations?categories=accessories,power
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const categoriesParam = url.searchParams.get("categories") || "";
    const categories = categoriesParam
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    let results: any[] = [];

    if (categories.length === 0) {
      // no categories specified, return empty
      return NextResponse.json({ data: [] });
    }

    try {
      // Try to fetch by category using existing productsService.getProducts
      for (const c of categories) {
        const resp = await productsService.getProducts({ category: c });
        if (resp && Array.isArray((resp as any).data)) {
          results = results.concat((resp as any).data);
        }
      }
    } catch (err) {
      // If the backend doesn't support category query, fallback to fetching all and filter server-side
      const all = await productsService.getAllProducts();
      for (const p of all) {
        const cats = (p.category || []).map((x: string) => x.toLowerCase());
        if (categories.some((c) => cats.includes(c.toLowerCase()))) {
          results.push(p);
        }
      }
    }

    // dedupe by product id
    const dedup: Record<string, any> = {};
    for (const r of results) dedup[r.id] = r;
    const data = Object.values(dedup);

    return NextResponse.json({ data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ data: [] }, { status: 500 });
  }
}
