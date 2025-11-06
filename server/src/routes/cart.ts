import { Router } from "express";
import { products, getProductById } from "../data/products.js";
import { cartStore } from "../store/cartStore.js";
import { CartItem } from "../types.js";
import { computeCartSummary } from "../utils/cart.js";

const router = Router();

router.get("/", (_req, res) => {
  const summary = computeCartSummary(cartStore.toArray(), products);
  res.json(summary);
});

router.post("/", (req, res) => {
  const { productId, qty } = req.body ?? {};

  if (typeof productId !== "string" || productId.trim() === "") {
    return res.status(400).json({ error: "productId is required" });
  }
  const product = getProductById(productId);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  const parsedQty = Number(qty);
  if (!Number.isFinite(parsedQty) || Math.floor(parsedQty) !== parsedQty) {
    return res.status(400).json({ error: "qty must be an integer" });
  }
  if (parsedQty === 0) {
    return res.status(400).json({ error: "qty cannot be 0" });
  }

  cartStore.add(productId, parsedQty);
  const summary = computeCartSummary(cartStore.toArray(), products);
  res.status(201).json(summary);
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  const product = getProductById(id);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  cartStore.remove(id);
  const summary = computeCartSummary(cartStore.toArray(), products);
  res.json(summary);
});

export default router;

