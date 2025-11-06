import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { products } from "../data/products.js";
import { cartStore } from "../store/cartStore.js";
import { CheckoutRequest, Receipt } from "../types.js";
import { computeCartSummary } from "../utils/cart.js";

const router = Router();

router.post("/", (req, res) => {
  const body: CheckoutRequest = req.body ?? {};

  const items = Array.isArray(body.cartItems) ? body.cartItems : cartStore.toArray();
  const summary = computeCartSummary(items, products);

  if (summary.items.length === 0) {
    return res.status(400).json({ error: "Cart is empty" });
  }

  const receipt: Receipt = {
    id: uuidv4(),
    total: summary.total,
    items: summary.items,
    timestamp: new Date().toISOString(),
    customer: body.name || body.email ? { name: body.name, email: body.email } : undefined,
  };

  // Clear in-memory cart only if we used it
  if (!Array.isArray(body.cartItems)) {
    cartStore.clear();
  }

  res.status(201).json(receipt);
});

export default router;

