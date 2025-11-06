import type { CartSummary, CheckoutRequest, Product, Receipt } from './types';

const RAW_BASE = (import.meta).env?.VITE_API_BASE_URL as string | undefined;

function joinUrl(base: string | undefined, path: string) {
  if (!base) return path;
  try {
    return new URL(path, base).toString();
  } catch {
    const b = base.endsWith('/') ? base.slice(0, -1) : base;
    const p = path.startsWith('/') ? path : `/${path}`;
    return `${b}${p}`;
  }
}
async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const url = joinUrl(RAW_BASE, path);
  const isJson = !!init?.body;
  // console.log(`HTTP ${init?.method || 'GET'} ${url}`);
  const res = await fetch(url, {
    credentials: 'include',
    headers: {
      ...(isJson ? { 'Content-Type': 'application/json' } : {}),
      ...(init?.headers || {}),
    },
    ...init,
  });
  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await res.json() : undefined;
  // console.log(`Response from ${url}:`, data);
  if (!res.ok) {
    const message = (data && (data.error || data.message)) || res.statusText;
    throw new Error(message);
  }
  return data as T;
}

export const api = {
  getProducts(): Promise<Product[]> {
    return http<Product[]>('/api/products');
  },
  getCart(): Promise<CartSummary> {
    return http<CartSummary>('/api/cart');
  },
  addToCart(productId: string, qty: number): Promise<CartSummary> {
    return http<CartSummary>('/api/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, qty }),
    });
  },
  removeFromCart(productId: string): Promise<CartSummary> {
    return http<CartSummary>(`/api/cart/${productId}`, { method: 'DELETE' });
  },
  checkout(payload: CheckoutRequest): Promise<Receipt> {
    return http<Receipt>('/api/checkout', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
