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
    <div className="min-h-dvh bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Vibe Commerce</h1>
          <div className="flex items-center gap-2">
            <button
              className={`text-sm font-medium px-4 py-2 rounded-lg border transition-all duration-200 ${
                view === 'products'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
              }`}
              onClick={() => setView('products')}
            >
              Products
            </button>
            <button
              className={`text-sm font-medium px-4 py-2 rounded-lg border flex items-center gap-2 transition-all duration-200 ${
                view === 'cart'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
              }`}
              onClick={() => setView('cart')}
            >
              <span>Cart</span>
              <span className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full text-xs font-semibold px-1.5 transition-colors ${
                view === 'cart' ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'
              }`}>
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800 shadow-sm animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-12 w-12 rounded-full border-4 border-slate-200 border-t-slate-900 animate-spin"></div>
            <p className="mt-4 text-slate-600 font-medium">Loading products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <section className={`lg:col-span-2 ${view === 'cart' ? 'hidden lg:block' : ''}`}>
              <h2 className="sr-only">Products</h2>
              {products.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-500">No products found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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

