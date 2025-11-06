import express from 'express';
import cors from 'cors';
import productsRoute from './routes/products.js';
import cartRoute from './routes/cart.js';
import checkoutRoute from './routes/checkout.js';
import dotenv from 'dotenv';
import { connectDB } from './db/mongoose.js';
import { sessionMiddleware } from './middleware/session.js';
import { HttpError, type JsonValue } from './errors.js';
import { getRedisClient } from './db/redis.js';
import { rateLimitRedis } from './middleware/rateLimit.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
const [sessionHandler, ensureUserId] = sessionMiddleware();
app.use(sessionHandler);
app.use(ensureUserId);
app.use(rateLimitRedis());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/products', productsRoute);
app.use('/api/cart', cartRoute);
app.use('/api/checkout', checkoutRoute);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err: Error | HttpError, _req: express.Request, res: express.Response) => {
   
  console.error(err);
  const status = err instanceof HttpError && err.status ? err.status : 500;
  const message = err instanceof HttpError ? err.message : 'Internal Server Error';
  const payload: { error: string; details?: JsonValue } = { error: message };
  if (err instanceof HttpError && err.details) payload.details = err.details;
  res.status(status).json(payload);
});

const PORT = Number(process.env.PORT) || 3000;
Promise.all([connectDB(), getRedisClient()])
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });
