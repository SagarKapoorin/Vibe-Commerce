Mock E-Com Cart API (TypeScript)

Overview
- Basic shopping cart backend for screening.
- Stack: Node.js, Express, TypeScript. In-memory cart; easy to swap to DB later.

Quick Start
- Prereqs: Node 18+ and npm.
- Install: `npm install`
- Dev: `npm run dev` (watches TS)
- Build: `npm run build`
- Start: `npm start`

Endpoints
- `GET /api/products` — Returns 5–10 mock products.
- `POST /api/cart` — Add/increment item. Body: `{ "productId": string, "qty": integer (non-zero) }`. Returns cart summary.
- `GET /api/cart` — Returns current cart `{ items, total }`.
- `DELETE /api/cart/:id` — Removes an item by product id. Returns cart summary.
- `POST /api/checkout` — Optional body: `{ cartItems?: {productId, qty}[], name?, email? }`. Returns receipt `{ id, total, items, timestamp }`. If `cartItems` omitted, uses in-memory cart then clears it.

Notes
- Validation: basic checks for product existence and integer qty.
- Currency: totals rounded to 2 decimals.
- Persistence: in-memory single-user cart for simplicity. Add a DB layer by swapping `cartStore` implementation.

Project Structure
- `src/index.ts` — App wiring and middleware.
- `src/routes/*` — Route handlers for products, cart, checkout.
- `src/data/products.ts` — Mock product list.
- `src/store/cartStore.ts` — In-memory cart store.
- `src/utils/cart.ts` — Cart summarization helpers.
- `src/types.ts` — Shared TypeScript types.

DB (Bonus, not implemented)
- Replace `cartStore` with a repository (Mongo/Mongoose or native driver).
- Add a `userId` (mock user) and persist cart per-user.

Testing With curl
- `curl http://localhost:4000/api/products`
- `curl -X POST http://localhost:4000/api/cart -H "Content-Type: application/json" -d '{"productId":"p1","qty":2}'`
- `curl http://localhost:4000/api/cart`
- `curl -X DELETE http://localhost:4000/api/cart/p1`
- `curl -X POST http://localhost:4000/api/checkout -H "Content-Type: application/json" -d '{"name":"Alex","email":"a@b.com"}'`

