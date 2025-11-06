import { Router } from 'express';
import { ProductModel } from '../models/Product.js';
import { addToCart, getCartSummary, removeFromCart } from '../services/cartService.js';
import { badRequest, notFound } from '../errors.js';
import { cacheGetRedis, invalidateCache } from '../middleware/cache.js';

const router = Router();
router.get('/', cacheGetRedis({
  prefix: 'cart',
  ttlSeconds: 60,
  keyGenerator: (req) => req.session.userId!,
}), async (req, res, next) => {
  try {
    // console.log("hit1")
    const userId = req.session.userId!;
    const summary = await getCartSummary(userId);
    // console.log(summary)
    res.json(summary);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { productId, qty } = req.body ?? {};
    if (typeof productId !== 'string' || productId.trim() === '') {
      throw badRequest('productId is required');
    }
    const product = await ProductModel.findById(productId).lean();
    if (!product) {
      throw notFound('Product not found');
    }
    const parsedQty = Number(qty);
    if (!Number.isFinite(parsedQty) || Math.floor(parsedQty) !== parsedQty) {
      throw badRequest('qty must be an integer');
    }
    if (parsedQty === 0) {
      throw badRequest('qty cannot be 0');
    }
    const userId = req.session.userId!;
    const summary = await addToCart(userId, productId, parsedQty);
    await invalidateCache('cart', userId);
    // console.log(userId+" "+summary)
    res.status(201).json(summary);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    // console.log(id)
    const product = await ProductModel.findById(id).lean();
    if (!product) {
      throw notFound('Product not found');
    }
    const userId = req.session.userId!;
    const summary = await removeFromCart(userId, id);
    await invalidateCache('cart', userId);
    res.json(summary);
  } catch (err) {
    next(err);
  }
});

export default router;
