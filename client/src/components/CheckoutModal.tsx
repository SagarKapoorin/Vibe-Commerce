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
  // console.log('CheckoutModal render, open=', open); 
  if (!open) return null;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const r = await onSubmit(name, email);
      // console.log('Received receipt:', r);
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
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
          <h3 className="text-xl font-bold text-slate-900">Checkout</h3>
          <button
            onClick={close}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>


        {!receipt ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
              <input
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="john@example.com"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-start gap-2">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={close}
                className="flex-1 px-4 py-3 text-sm font-medium rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-3 text-sm font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                    </svg>
                    <span>Place Order</span>
                  </>
                )}
              </button>
            </div>
          </form>
) : (
          <div className="p-6 space-y-5">
            <div className="text-center pb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-1">Order Confirmed!</h4>
              <p className="text-sm text-slate-600">Thank you for your purchase</p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Order ID</span>
                <span className="font-mono font-medium text-slate-900">{receipt.id.slice(0, 8)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Date</span>
                <span className="font-medium text-slate-900">{new Date(receipt.timestamp).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Time</span>
                <span className="font-medium text-slate-900">{new Date(receipt.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>

            <div>
              <h5 className="text-sm font-semibold text-slate-700 mb-3">Order Items</h5>
              <ul className="space-y-2">
                {receipt.items.map((it) => (
                  <li key={it.product.id} className="flex justify-between text-sm py-2 border-b border-slate-100 last:border-0">
                    <span className="text-slate-700">
                      {it.product.name} <span className="text-slate-500">× {it.qty}</span>
                    </span>
                    <span className="font-semibold text-slate-900">${it.lineTotal.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-between items-center pt-3 border-t-2 border-slate-200">
              <span className="text-lg font-bold text-slate-900">Total</span>
              <span className="text-2xl font-bold text-slate-900">${receipt.total.toFixed(2)}</span>
            </div>

            <button
              onClick={close}
              className="w-full px-4 py-3 text-sm font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-md hover:shadow-lg"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


