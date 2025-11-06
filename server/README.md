Commerce API (TypeScript + MongoDB)

Overview
- Basic shopping cart backend for screening.
- Stack: Node.js, Express, TypeScript, MongoDB (Mongoose), sessions.

Quick Start
- Prereqs: Node 18+ and npm; MongoDB running locally or in the cloud.
- Install: `npm install`
- Configure env: copy `.env.example` to `.env` and set values.
- Dev: `npm run dev` (build then run)
- Build: `npm run build`
- Start: `npm start`

Environment
- PORT (default 3000)
- MONGODB_URI (include database, e.g. `mongodb://localhost:27017/mock_ecom`)
- SESSION_SECRET (any random string for dev)

Endpoints
- GET `/api/products` — Returns list of products.
- POST `/api/cart` — Add/increment item. Body: `{ "productId": string, "qty": integer (non-zero) }`. Returns cart summary.
- GET `/api/cart` — Returns current cart `{ items, total }`.
- DELETE `/api/cart/:id` — Removes an item by product id. Returns cart summary.
- POST `/api/checkout` — Optional body: `{ cartItems?: {productId, qty}[], name?, email? }`. Returns receipt `{ id, total, items, timestamp }`. If `cartItems` omitted, uses session cart then clears it.

Notes
- Validation: basic checks for product existence and integer qty.
- Currency: totals rounded to 2 decimals.
- Persistence: cart is stored per-session in MongoDB (via connect-mongo).
- Products are seeded on first start from `src/data/products.ts` if the collection is empty.

Testing With curl
- `curl http://localhost:3000/api/products`
- `curl -X POST http://localhost:3000/api/cart -H "Content-Type: application/json" -d '{"productId":"p1","qty":2}'`
- `curl http://localhost:3000/api/cart`
- `curl -X DELETE http://localhost:3000/api/cart/p1`
- `curl -X POST http://localhost:3000/api/checkout -H "Content-Type: application/json" -d '{"name":"Alex","email":"a@b.com"}'`

Manual Testing (Postman/Insomnia)
- Create a collection (cookies are managed automatically by the client).
- GET `http://localhost:3000/api/products` — confirm list.
- POST `http://localhost:3000/api/cart` with body `{ "productId": "p1", "qty": 2 }` — expect cart summary with one line and total.
- GET `http://localhost:3000/api/cart` — shows same cart (session persisted).
- POST `http://localhost:3000/api/cart` with body `{ "productId": "p2", "qty": 1 }` — adds second item.
- DELETE `http://localhost:3000/api/cart/p1` — removes the first item.
- POST `http://localhost:3000/api/checkout` with body `{ "name": "Test User", "email": "t@e.st" }` — expect a receipt.
- GET `http://localhost:3000/api/cart` — should be empty (session cart cleared).
- Checkout without session: POST `http://localhost:3000/api/checkout` with body `{ "cartItems": [{"productId":"p1","qty":2}] }`
