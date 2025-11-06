import type { CartSummary } from '../types';

type Props = {
  cart?: CartSummary;
  updating: boolean;
  onInc: (productId: string) => void;
  onDec: (productId: string) => void;
  onRemove: (productId: string) => void;
  onCheckout: () => void;
};

export default function Cart({ cart, updating, onInc, onDec, onRemove, onCheckout }: Props) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-lg p-6 sticky top-24">
      <div className="flex items-center gap-2 mb-5">
        <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
        </svg>
        <h2 className="text-xl font-bold text-slate-900">Your Cart</h2>
      </div>
      {(!cart || cart.items.length === 0) && (
        <div className="py-8 text-center">
          <svg className="w-16 h-16 mx-auto text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
          </svg>
          <p className="text-sm text-slate-500">Your cart is empty</p>
        </div>
      )}
      {cart && cart.items.length > 0 && (
        <ul className="space-y-4 mb-5">
          {cart.items.map((line) => (
            <li key={line.product.id} className="pb-4 border-b border-slate-100 last:border-0 last:pb-0">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-slate-900 truncate">{line.product.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">${line.product.price.toFixed(2)} each</div>
                </div>
                <div className="text-base font-semibold text-slate-900">${line.lineTotal.toFixed(2)}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onDec(line.product.id)}
                    className="h-8 w-8 rounded-lg border border-slate-300 grid place-items-center hover:bg-slate-50 hover:border-slate-400 active:bg-slate-100 transition-colors disabled:opacity-40"
                    disabled={updating}
                    aria-label={`Decrease ${line.product.name}`}
                  >
                    <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4"/>
                    </svg>
                  </button>
                  <span className="w-8 text-center text-sm font-medium text-slate-900">{line.qty}</span>
                  <button
                    onClick={() => onInc(line.product.id)}
                    className="h-8 w-8 rounded-lg border border-slate-300 grid place-items-center hover:bg-slate-50 hover:border-slate-400 active:bg-slate-100 transition-colors disabled:opacity-40"
                    disabled={updating}
                    aria-label={`Increase ${line.product.name}`}
                  >
                    <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/>
                    </svg>
                  </button>
                </div>
                <button
                  onClick={() => onRemove(line.product.id)}
                  className="text-xs font-medium text-red-600 hover:text-red-700 hover:underline transition-colors disabled:opacity-40"
                  disabled={updating}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
)}

      <div className="pt-5 border-t border-slate-200">
        <div className="flex items-center justify-between mb-5">
          <span className="text-lg font-bold text-slate-900">Total</span>
          <span className="text-2xl font-bold text-slate-900">${(cart?.total ?? 0).toFixed(2)}</span>
        </div>
        <button
          onClick={onCheckout}
          disabled={!cart || cart.items.length === 0 || updating}
          className="w-full rounded-lg bg-slate-900 text-white px-4 py-3.5 text-sm font-semibold hover:bg-slate-800 active:bg-slate-950 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
          </svg>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

