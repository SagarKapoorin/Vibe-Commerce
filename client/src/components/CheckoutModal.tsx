import { useState } from 'react';
import type { Receipt } from '../types';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string, email: string) => Promise<Receipt>;
};

export default function CheckoutModal({ open, onClose, onSubmit }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const r = await onSubmit(name, email);
      setReceipt(r);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Checkout failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const close = () => {
    setName('');
    setEmail('');
    setReceipt(null);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Checkout</h3>
          <button onClick={close} className="text-gray-500 hover:text-black">✕</button>
        </div>

        {!receipt ? (
          <form onSubmit={handleSubmit} className="p-4 space-y-3">
            <div>
              <label className="block text-sm mb-1">Name</label>
              <input
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="john@example.com"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="pt-2 flex justify-end gap-2">
              <button type="button" onClick={close} className="px-4 py-2 text-sm rounded-md border">
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm rounded-md bg-black text-white disabled:opacity-60"
              >
                {loading ? 'Processing…' : 'Place Order'}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-4 space-y-3">
            <h4 className="font-medium">Receipt</h4>
            <div className="text-sm text-gray-700">ID: {receipt.id}</div>
            <div className="text-sm text-gray-700">Date: {new Date(receipt.timestamp).toLocaleString()}</div>
            <ul className="mt-2 space-y-1">
              {receipt.items.map((it) => (
                <li key={it.product.id} className="flex justify-between text-sm">
                  <span>
                    {it.product.name} × {it.qty}
                  </span>
                  <span>${it.lineTotal.toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between font-semibold pt-2 border-t">
              <span>Total</span>
              <span>${receipt.total.toFixed(2)}</span>
            </div>
            <div className="pt-2 flex justify-end">
              <button onClick={close} className="px-4 py-2 text-sm rounded-md bg-black text-white">
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

