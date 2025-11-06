import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { CheckoutRequest, Receipt } from '../types.js';
import { computeCartSummary } from '../utils/cart.js';
import { ProductModel } from '../models/Product.js';
import { clearCart, getCartSummary } from '../services/cartService.js';
import { badRequest } from '../errors.js';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const body: CheckoutRequest = req.body ?? {};
    const items = Array.isArray(body.cartItems) ? body.cartItems : undefined;
    //console.log("checkout hit")
    let summary;
    if (items) {
      const productIds = items.map((i) => i.productId);
      const products = await ProductModel.find({ _id: { $in: productIds } }).lean();
      const productList = products.map((p) => ({
        id: p._id,
        name: p.name,
        price: p.price,
        image: p.image,
        description: p.description,
      }));
      summary = computeCartSummary(items, productList);
    } else {
      const userId = req.session.userId!;
      summary = await getCartSummary(userId);
    }

    if (summary.items.length === 0) {
      throw badRequest('Cart is empty');
    }
    // console.log("summary", summary);
    const receipt: Receipt = {
      id: uuidv4(),
      total: summary.total,
      items: summary.items,
      timestamp: new Date().toISOString(),
      customer: body.name || body.email ? { name: body.name, email: body.email } : undefined,
    };

    if (!items) {
      const userId = req.session.userId!;
      await clearCart(userId);
    }

    res.status(201).json(receipt);
  } catch (err) {
    next(err);
  }
});

export default router;
