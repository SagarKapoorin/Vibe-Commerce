import { CartItem, CartLine, CartSummary, Product } from "../types.js";

export function computeCartSummary(cartItems: CartItem[], products: Product[]): CartSummary {
  const productMap = new Map(products.map((p) => [p.id, p] as const));
  const lines: CartLine[] = [];
  for (const item of cartItems) {
    const product = productMap.get(item.productId);
    if (!product) {
      continue;
    }
    const qty = Math.max(0, Math.floor(item.qty));
    if (qty <= 0) continue;
    const lineTotal = roundCurrency(product.price * qty);
    lines.push({ product, qty, lineTotal });
  }
  const total = roundCurrency(lines.reduce((sum, l) => sum + l.lineTotal, 0));
  return { items: lines, total };
}

export function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

