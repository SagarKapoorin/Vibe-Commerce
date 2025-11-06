import { CartModel } from '../models/Cart.js';
import { ProductModel } from '../models/Product.js';
import { CartItem, CartSummary, Product } from '../types.js';
import { computeCartSummary } from '../utils/cart.js';

async function getOrCreateCart(userId: string) {
  let cart = await CartModel.findOne({ userId }).lean();
  if (!cart) {
    cart = (await CartModel.create({ userId, items: [] })).toObject();
  }
  return cart;
}

export async function getCartSummary(userId: string): Promise<CartSummary> {
  // console.log("getCartSummary called for userId:", userId);
  const cart = await getOrCreateCart(userId);
  const productIds = cart.items.map((i) => i.productId);
  const products = await ProductModel.find({ _id: { $in: productIds } }).lean();
  const productList: Product[] = products.map((p) => ({
    id: p._id,
    name: p.name,
    price: p.price,
    image: p.image,
    description: p.description,
  }));
  const items: CartItem[] = cart.items.map((i) => ({ productId: i.productId, qty: i.qty }));
  return computeCartSummary(items, productList);
}

export async function addToCart(
  userId: string,
  productId: string,
  qty: number,
): Promise<CartSummary> {
  const cart = await getOrCreateCart(userId);
  const existing = cart.items.find((i) => i.productId === productId);
  if (existing) {
    existing.qty += qty;
    if (existing.qty <= 0) {
      cart.items = cart.items.filter((i) => i.productId !== productId);
    }
  } else if (qty > 0) {
    cart.items.push({ productId, qty });
  }
  await CartModel.updateOne({ userId }, { $set: { items: cart.items } }, { upsert: true });
  return getCartSummary(userId);
}

export async function removeFromCart(userId: string, productId: string): Promise<CartSummary> {
  await CartModel.updateOne({ userId }, { $pull: { items: { productId } } });
  return getCartSummary(userId);
}

export async function clearCart(userId: string): Promise<void> {
  await CartModel.updateOne({ userId }, { $set: { items: [] } }, { upsert: true });
}
