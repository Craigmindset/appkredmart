/**
 * Generate a URL-friendly slug from product name and ID
 * Example: "Samsung Galaxy S24 Ultra 256GB" + "690f3f94" -> "samsung-galaxy-s24-ultra-256gb-690f3f94"
 */
export function generateProductSlug(productName: string, productId: string): string {
  const nameSlug = productName
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .substring(0, 60); // Limit length

  // Append last 8 characters of ID for uniqueness
  const shortId = productId.slice(-8);
  
  return `${nameSlug}-${shortId}`;
}

/**
 * Extract product ID from slug
 * Example: "samsung-galaxy-s24-ultra-256gb-690f3f94" -> "690f3f94" (or full ID if stored)
 */
export function extractIdFromSlug(slug: string): string {
  // Get the last segment after the final hyphen (the short ID)
  const parts = slug.split("-");
  return parts[parts.length - 1];
}

/**
 * Parse product slug to get full ID
 * Since we only store the last 8 chars in the slug, you'll need to:
 * 1. Search products by the short ID suffix
 * 2. Or maintain a slug-to-ID mapping
 * 3. Or use the full ID in the slug (longer but guaranteed unique)
 */
export function parseProductSlug(slug: string): { shortId: string; nameSlug: string } {
  const parts = slug.split("-");
  const shortId = parts[parts.length - 1];
  const nameSlug = parts.slice(0, -1).join("-");
  
  return { shortId, nameSlug };
}
