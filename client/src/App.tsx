import { useEffect, useMemo, useState } from 'react';
import { api } from './api';
import type { CartSummary, Product } from './types';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import CheckoutModal from './components/CheckoutModal';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartSummary | undefined>();
  const [loading, setLoading] = useState(true);
  const [updatingCart, setUpdatingCart] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [view, setView] = useState<'products' | 'cart'>('products');
// console.log('App render, view=', view, 'cart=', cart);
  const cartCount = useMemo(() => cart?.items.reduce((sum, i) => sum + i.qty, 0) ?? 0, [cart]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [p, c] = await Promise.all([api.getProducts(), api.getCart()]);
        if (!alive) return;
        setProducts(p);
        setCart(c);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load');
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  async function add(id: string) {
    setUpdatingCart(true);
    setError(null);
    try {
      const updated = await api.addToCart(id, 1);
      setCart(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update cart');
    } finally {
      setUpdatingCart(false);
    }
  }
  async function inc(id: string) {
    return add(id);
  }
  async function dec(id: string) {
    setUpdatingCart(true);
    setError(null);
    try {
      const updated = await api.addToCart(id, -1);
      setCart(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update cart');
    } finally {
      setUpdatingCart(false);
    }
  }
  async function remove(id: string) {
    setUpdatingCart(true);
    setError(null);
    try {
      const updated = await api.removeFromCart(id);
      setCart(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove item');
    } finally {
      setUpdatingCart(false);
    }
  }

  async function handleCheckout(name: string, email: string) {
    const receipt = await api.checkout({ name, email });
    const refreshed = await api.getCart();
    setCart(refreshed);
    return receipt;
  }

  return (
    <div className="min-h-dvh bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Vibe Commerce - Mock E-Com Cart</h1>
          <div className="flex items-center gap-3">
            <button
              className={`text-sm px-3 py-1.5 rounded-md border ${view === 'products' ? 'bg-black text-white border-black' : ''}`}
              onClick={() => setView('products')}
            >
              Products
            </button>
<button
              className={`text-sm px-3 py-1.5 rounded-md border flex items-center gap-2 ${view === 'cart' ? 'bg-black text-white border-black' : ''}`}
              onClick={() => setView('cart')}
            >
  <span>Cart</span>
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-black text-white text-xs px-1">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </header>

              <main className="mx-auto max-w-6xl px-4 py-6">
        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

{loading ? (
          <div className="text-center text-gray-600">Loading…</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <section className={`lg:col-span-2 ${view === 'cart' ? 'hidden lg:block' : ''}`}>
              <h2 className="sr-only">Products</h2>
              {products.length === 0 ? (
                <p className="text-sm text-gray-600">No products found.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {products.map((p) => (
                    <ProductCard key={p.id} product={p} onAdd={add} />
                  ))}
                </div>
              )}
            </section>
 <aside className={`${view === 'products' ? 'hidden lg:block' : ''}`}>
              <Cart
                cart={cart}
                updating={updatingCart}
                onInc={inc}
                onDec={dec}
                onRemove={remove}
                onCheckout={() => setShowCheckout(true)}
              />
            </aside>
          </div>
        )}
      </main>
      <CheckoutModal
        open={showCheckout}
        onClose={() => setShowCheckout(false)}
        onSubmit={handleCheckout}
      />
    </div>
  );
}

