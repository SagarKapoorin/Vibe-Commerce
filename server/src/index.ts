import express from "express";
import cors from "cors";
import productsRoute from "./routes/products.js";
import cartRoute from "./routes/cart.js";
import checkoutRoute from "./routes/checkout.js";
import dotenv from "dotenv";
import { connectDB } from "./db/mongoose.js";
import { sessionMiddleware } from "./middleware/session.js";
import { HttpError } from "./errors.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// DB & sessions
const [sessionHandler, ensureUserId] = sessionMiddleware();
app.use(sessionHandler);
app.use(ensureUserId);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/products", productsRoute);
app.use("/api/cart", cartRoute);
app.use("/api/checkout", checkoutRoute);

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  // eslint-disable-next-line no-console
  console.error(err);
  const status = err instanceof HttpError && err.status ? err.status : 500;
  const message = err instanceof HttpError ? err.message : "Internal Server Error";
  const payload: any = { error: message };
  if (err instanceof HttpError && err.details) payload.details = err.details;
  res.status(status).json(payload);
});

const PORT = Number(process.env.PORT) || 3000;
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });
