import { Router } from "express";
import { ProductModel } from "../models/Product.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const docs = await ProductModel.find({}).lean();
    const list = docs.map((p) => ({
      id: p._id,
      name: p.name,
      price: p.price,
      image: p.image,
      description: p.description,
    }));
    res.json(list);
  } catch (err) {
    next(err);
  }
});

export default router;
