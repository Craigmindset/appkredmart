# Cross-Selling Implementation Guide for KredMart

## Overview

This document outlines the complete implementation of cross-selling features for the KredMart e-commerce platform.

## Implementation Strategies

### 1. Related Products (Basic - Category-based)

**Use Case:** Show similar products from the same or complementary categories
**Complexity:** Low
**Data Required:** Product categories only

#### Backend Endpoint

```
GET /products/:productId/related?limit=6
```

#### Backend Implementation (Node.js/NestJS example)

```typescript
async getRelatedProducts(productId: string, limit: number = 6) {
  const product = await this.productsRepository.findOne({
    where: { id: productId }
  });

  if (!product) {
    throw new NotFoundException('Product not found');
  }

  // Define complementary categories
  const categoryMap = {
    'Phones and Tablets': ['Accessories', 'Electronics'],
    'Computing': ['Accessories', 'Electronics', 'Phones and Tablets'],
    'Electronics': ['Accessories', 'Home & Kitchen'],
    'Accessories': ['Phones and Tablets', 'Computing', 'Electronics'],
  };

  const relatedCategories = [
    product.category,
    ...(categoryMap[product.category] || [])
  ];

  return this.productsRepository.find({
    where: {
      category: In(relatedCategories),
      id: Not(productId),
      status: 'Active',
      quantity: MoreThan(0)
    },
    relations: ['merchant'],
    take: limit,
    order: {
      createdAt: 'DESC'
    }
  });
}
```

### 2. Frequently Bought Together (Medium - Order History)

**Use Case:** Show products commonly purchased together
**Complexity:** Medium
**Data Required:** Order history tracking

#### Database Schema

```sql
-- Track product combinations from orders
CREATE TABLE product_combinations (
  id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_a_id VARCHAR(36) NOT NULL,
  product_b_id VARCHAR(36) NOT NULL,
  purchase_count INT DEFAULT 1,
  confidence_score DECIMAL(3,2), -- How often bought together
  last_purchased TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT unique_combination UNIQUE(product_a_id, product_b_id),
  CONSTRAINT fk_product_a FOREIGN KEY (product_a_id) REFERENCES products(id) ON DELETE CASCADE,
  CONSTRAINT fk_product_b FOREIGN KEY (product_b_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE INDEX idx_product_a ON product_combinations(product_a_id, purchase_count DESC);
CREATE INDEX idx_product_b ON product_combinations(product_b_id, purchase_count DESC);
CREATE INDEX idx_confidence ON product_combinations(confidence_score DESC);
```

#### Backend Implementation

```typescript
// Call this when order is completed
async trackProductCombinations(orderId: string) {
  const order = await this.ordersRepository.findOne({
    where: { id: orderId },
    relations: ['items', 'items.product']
  });

  const productIds = order.items.map(item => item.product.id);

  // Create or update combinations for each product pair
  for (let i = 0; i < productIds.length; i++) {
    for (let j = i + 1; j < productIds.length; j++) {
      await this.upsertProductCombination(productIds[i], productIds[j]);
    }
  }
}

async upsertProductCombination(productAId: string, productBId: string) {
  // Ensure consistent ordering (smaller id first)
  const [firstId, secondId] = [productAId, productBId].sort();

  await this.connection.query(`
    INSERT INTO product_combinations (product_a_id, product_b_id, purchase_count)
    VALUES ($1, $2, 1)
    ON CONFLICT (product_a_id, product_b_id)
    DO UPDATE SET
      purchase_count = product_combinations.purchase_count + 1,
      last_purchased = NOW(),
      updated_at = NOW()
  `, [firstId, secondId]);
}

async getFrequentlyBoughtTogether(productId: string, limit: number = 4) {
  const results = await this.connection.query(`
    SELECT
      p.*,
      pc.purchase_count,
      pc.confidence_score,
      m.company as "merchant_company"
    FROM product_combinations pc
    JOIN products p ON (
      p.id = CASE
        WHEN pc.product_a_id = $1 THEN pc.product_b_id
        WHEN pc.product_b_id = $1 THEN pc.product_a_id
      END
    )
    LEFT JOIN merchants m ON p.merchant_id = m.id
    WHERE (pc.product_a_id = $1 OR pc.product_b_id = $1)
      AND p.status = 'Active'
      AND p.quantity > 0
    ORDER BY pc.purchase_count DESC, pc.confidence_score DESC
    LIMIT $2
  `, [productId, limit]);

  return results.rows.map(row => ({
    ...row,
    merchant: { company: row.merchant_company }
  }));
}
```

#### Backend Endpoint

```
GET /products/:productId/frequently-bought-together?limit=4
```

### 3. Smart Recommendations (Advanced - ML/AI)

**Use Case:** Personalized recommendations based on multiple factors
**Complexity:** High
**Data Required:** User behavior, product attributes, purchase history

#### Backend Implementation (Simple Algorithm)

```typescript
async getSmartRecommendations(productId: string, userId?: string, limit: number = 6) {
  const product = await this.productsRepository.findOne({
    where: { id: productId }
  });

  // Get candidate products
  const candidates = await this.productsRepository.find({
    where: {
      id: Not(productId),
      status: 'Active',
      quantity: MoreThan(0)
    },
    relations: ['merchant']
  });

  // Score each candidate
  const scored = candidates.map(candidate => {
    let score = 0;

    // Same category: +50 points
    if (candidate.category === product.category) {
      score += 50;
    }

    // Same brand: +30 points
    if (candidate.brand && candidate.brand === product.brand) {
      score += 30;
    }

    // Same merchant: +20 points
    if (candidate.merchant?.id === product.merchant?.id) {
      score += 20;
    }

    // Similar price range (+/- 30%): +25 points
    const priceDiff = Math.abs(candidate.price - product.price) / product.price;
    if (priceDiff <= 0.3) {
      score += 25 * (1 - priceDiff);
    }

    // Popular products (high sales): +15 points
    // Assuming you track sales_count
    if (candidate.sales_count > 100) {
      score += 15;
    }

    // Recently added: +10 points
    const daysSinceCreated = Math.floor(
      (Date.now() - new Date(candidate.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceCreated <= 30) {
      score += 10;
    }

    return { product: candidate, score };
  });

  // Sort by score and return top N
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.product);
}
```

## Frontend Implementation

### Components Created

1. **CrossSellProducts** (`components/cross-sell-products.tsx`)

   - Reusable component for displaying cross-sell products
   - Horizontal scrolling on mobile
   - Navigation arrows on desktop
   - Loading states

2. **Hooks Created**
   - `useRelatedProducts` - Fetch category-based recommendations
   - `useFrequentlyBoughtTogether` - Fetch order history-based recommendations

### Usage Examples

#### Product Detail Page

```tsx
import CrossSellProducts from "@/components/cross-sell-products";
import { useRelatedProducts } from "@/lib/services/products/use-related-products";
import { useFrequentlyBoughtTogether } from "@/lib/services/products/use-frequently-bought-together";

export default function ProductDetailClient({ product }) {
  const { data: relatedProducts, isLoading: relatedLoading } =
    useRelatedProducts(product.id);

  const { data: frequentlyBought, isLoading: frequentlyLoading } =
    useFrequentlyBoughtTogether(product.id);

  return (
    <>
      {/* Product details... */}

      {/* Frequently Bought Together */}
      <CrossSellProducts
        title="Frequently Bought Together"
        products={frequentlyBought || []}
        isLoading={frequentlyLoading}
      />

      {/* Related Products */}
      <CrossSellProducts
        title="You May Also Like"
        products={relatedProducts || []}
        isLoading={relatedLoading}
      />
    </>
  );
}
```

#### Cart Page

```tsx
export default function CartPage() {
  const items = useCart((s) => s.items);
  const firstProductId = items[0]?.product.id;

  const { data: recommendedProducts } = useRelatedProducts(
    firstProductId || "",
    6,
    !!firstProductId
  );

  return (
    <>
      {/* Cart items... */}

      {/* Cross-sell at bottom of cart */}
      {recommendedProducts && (
        <CrossSellProducts
          title="Complete Your Purchase"
          products={recommendedProducts}
        />
      )}
    </>
  );
}
```

## Implementation Phases

### Phase 1: Basic (Week 1)

✅ Create CrossSellProducts component
✅ Create useRelatedProducts hook
✅ Implement category-based recommendations on backend
✅ Add to product detail page
✅ Add to cart page

### Phase 2: Medium (Week 2-3)

- Create product_combinations table
- Implement order completion tracking
- Create useFrequentlyBoughtTogether hook
- Implement backend endpoint for frequently bought together
- Add to product detail page

### Phase 3: Advanced (Week 4+)

- Implement ML-based recommendations
- Add user behavior tracking
- Personalized recommendations based on browsing history
- A/B testing for different recommendation strategies
- Analytics dashboard for cross-sell performance

## Performance Optimization

### Caching Strategy

```typescript
// Frontend
staleTime: 10 * 60 * 1000, // 10 minutes for related products
staleTime: 30 * 60 * 1000, // 30 minutes for frequently bought together

// Backend (Redis)
const cacheKey = `related:${productId}:${limit}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);

const results = await this.getRelatedProducts(productId, limit);
await redis.setex(cacheKey, 600, JSON.stringify(results)); // 10 min cache
return results;
```

### Database Optimization

- Index on category, brand, status fields
- Index on product_combinations for fast lookups
- Periodic cleanup of old combination data
- Materialized views for popular products

## Analytics & Metrics

### Track These Metrics

1. **Cross-sell Click Rate**: % of users clicking recommended products
2. **Cross-sell Conversion**: % of clicked items added to cart
3. **Average Order Value**: Impact on AOV from cross-sells
4. **Revenue Attribution**: Revenue from cross-sell recommendations

### Implementation

```typescript
// Track click events
const handleProductClick = (productId: string, source: string) => {
  analytics.track("cross_sell_click", {
    source_product_id: currentProductId,
    recommended_product_id: productId,
    recommendation_type: source, // 'related' | 'frequently_bought'
    position: index,
  });
};

// Track add to cart from cross-sell
const handleAddToCart = (product: Product, source: string) => {
  add(product, 1);
  analytics.track("cross_sell_conversion", {
    product_id: product.id,
    recommendation_type: source,
    price: product.price,
  });
};
```

## Testing Checklist

- [ ] Related products display correctly on product pages
- [ ] Frequently bought together shows relevant items
- [ ] Cross-sell section on cart page works
- [ ] Mobile scrolling works smoothly
- [ ] Desktop navigation arrows work
- [ ] Loading states display correctly
- [ ] Empty states handled gracefully
- [ ] Products can be added to cart from cross-sell
- [ ] Analytics tracking fires correctly
- [ ] Performance benchmarks met (<100ms query time)

## Future Enhancements

1. **Email Recommendations**: Send personalized product suggestions via email
2. **"Complete the Look" bundles**: Create curated product bundles
3. **Personalization**: User-specific recommendations based on history
4. **Dynamic Pricing**: Bundle discounts for cross-sell items
5. **Social Proof**: "X customers also viewed/bought this"
6. **Wishlist Integration**: Recommend items from wishlists
7. **Seasonal Recommendations**: Holiday-specific suggestions
8. **Inventory Awareness**: Prioritize items needing stock clearance

## Support & Maintenance

- Monitor recommendation quality monthly
- Update category mappings quarterly
- Retrain ML models monthly (if implemented)
- Review analytics dashboard weekly
- Clean up old combination data monthly
