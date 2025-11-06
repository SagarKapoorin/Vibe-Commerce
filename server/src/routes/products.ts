import { Router } from "express";
import { products } from "../data/products.js";

const router = Router();

router.get("/", (_req, res) => {
  res.json(products);
});

export default router;

