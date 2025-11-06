import express from "express";
import cors from "cors";
import productsRoute from "./routes/products.js";
import cartRoute from "./routes/cart.js";
import checkoutRoute from "./routes/checkout.js";

const app = express();

app.use(cors());
app.use(express.json());

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
  console.error(err);
  const status = typeof err?.status === "number" ? err.status : 500;
  res.status(status).json({ error: err?.message || "Internal Server Error" });
});

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

