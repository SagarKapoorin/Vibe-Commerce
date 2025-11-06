import type { Product } from '../types';

type Props = {
  product: Product;
  onAdd: (id: string) => void;
};

export default function ProductCard({ product, onAdd }: Props) {
  return (
    <div className="group rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden">
      {product.image ? (
        <div className="overflow-hidden aspect-[4/3] w-full bg-slate-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      ) : (
        <div className="aspect-[4/3] w-full bg-gradient-to-br from-slate-100 to-slate-200 grid place-items-center text-slate-400">
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <span className="text-sm">No Image</span>
          </div>
        </div>
      )}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-slate-700 transition-colors">{product.name}</h3>
        {product.description && (
          <p className="text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">{product.description}</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-4 gap-3">
          <span className="text-xl font-bold text-slate-900">${product.price.toFixed(2)}</span>
          <button
            onClick={() => onAdd(product.id)}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 text-white px-4 py-2.5 text-sm font-medium hover:bg-slate-800 active:bg-slate-950 transition-colors shadow-sm hover:shadow-md"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
            </svg>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

