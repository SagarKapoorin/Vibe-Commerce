import { Router } from 'express';
import { ProductModel } from '../models/Product.js';
import { cacheGetRedis } from '../middleware/cache.js';

const router = Router();

router.get('/', cacheGetRedis({ prefix: 'products', ttlSeconds: 60*60*24*7 }), async (_req, res, next) => {
  try {
    // console.log("Products route hit");
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
