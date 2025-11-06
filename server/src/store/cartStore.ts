import { CartItem } from "../types.js";

class CartStore {
  private items = new Map<string, number>();

  add(productId: string, qty: number) {
    const current = this.items.get(productId) ?? 0;
    const next = current + qty;
    if (next <= 0) {
      this.items.delete(productId);
    } else {
      this.items.set(productId, next);
    }
  }

  remove(productId: string) {
    this.items.delete(productId);
  }

  set(productId: string, qty: number) {
    if (qty <= 0) {
      this.items.delete(productId);
    } else {
      this.items.set(productId, qty);
    }
  }

  clear() {
    this.items.clear();
  }

  toArray(): CartItem[] {
    return Array.from(this.items.entries()).map(([productId, qty]) => ({ productId, qty }));
  }
}

export const cartStore = new CartStore();

