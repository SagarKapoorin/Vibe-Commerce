import type { Product } from '../types';

type Props = {
  product: Product;
  onAdd: (id: string) => void;
};

export default function ProductCard({ product, onAdd }: Props) {
  return (
    <div className="rounded-lg border bg-white shadow-sm flex flex-col">
      {product.image ? (
        <img
          src={product.image}
          alt={product.name}
          className="aspect-[4/3] w-full object-cover rounded-t-lg"
        />
      ) : (
        <div className="aspect-[4/3] w-full bg-gray-100 rounded-t-lg grid place-items-center text-gray-400">
          No Image
        </div>
      )}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        {product.description && (
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-base font-medium">${product.price.toFixed(2)}</span>
          <button
            onClick={() => onAdd(product.id)}
            className="inline-flex items-center rounded-md bg-black text-white px-3 py-1.5 text-sm hover:bg-gray-800"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

