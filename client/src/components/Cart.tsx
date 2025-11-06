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
    <div className="rounded-lg border bg-white shadow-sm p-4 sticky top-4">
      <h2 className="text-xl font-semibold mb-3">Your Cart</h2>
      {(!cart || cart.items.length === 0) && <p className="text-sm text-gray-600">Cart is empty.</p>}
      {cart && cart.items.length > 0 && (
        <ul className="space-y-3">
          {cart.items.map((line) => (
            <li key={line.product.id} className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="font-medium truncate">{line.product.name}</div>
                <div className="text-xs text-gray-500">${line.product.price.toFixed(2)}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onDec(line.product.id)}
                  className="h-7 w-7 rounded border grid place-items-center hover:bg-gray-50"
                  disabled={updating}
                  aria-label={`Decrease ${line.product.name}`}
                >
                  −
                </button>
                <span className="w-6 text-center text-sm">{line.qty}</span>
                <button
                  onClick={() => onInc(line.product.id)}
                  className="h-7 w-7 rounded border grid place-items-center hover:bg-gray-50"
                  disabled={updating}
                  aria-label={`Increase ${line.product.name}`}
                >
                  +
                </button>
              </div>
              <div className="text-sm font-medium w-16 text-right">${line.lineTotal.toFixed(2)}</div>
              <button
                onClick={() => onRemove(line.product.id)}
                className="text-xs text-red-600 hover:underline"
                disabled={updating}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex items-center justify-between">
        <span className="text-base font-semibold">Total</span>
        <span className="text-base font-semibold">${(cart?.total ?? 0).toFixed(2)}</span>
      </div>
      <button
        onClick={onCheckout}
        disabled={!cart || cart.items.length === 0 || updating}
        className="mt-4 w-full rounded-md bg-black text-white px-4 py-2 text-sm disabled:opacity-60"
      >
        Checkout
      </button>
    </div>
  );
}

