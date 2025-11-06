export type Product = {
  id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
};

export type CartItem = {
  productId: string;
  qty: number;
};

export type CartLine = {
  product: Product;
  qty: number;
  lineTotal: number;
};

export type CartSummary = {
  items: CartLine[];
  total: number;
};

export type CheckoutRequest = {
  name?: string;
  email?: string;
  cartItems?: CartItem[];
};

export type Receipt = {
  id: string;
  total: number;
  items: CartLine[];
  timestamp: string;
  customer?: { name?: string; email?: string };
};
