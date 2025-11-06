Nexora Cart — Full Stack (React + Node)

More
- Client guide: `client/README.md`
- Server guide: `server/README.md`

Overview
- Mock e-commerce cart with a React frontend and an Express/TypeScript backend.
- Tech: React 19 + Vite + Tailwind (client) and Node.js + Express + MongoDB + Redis (server).

Repo Structure
- `client/` — React SPA (Vite)
- `server/` — Express API (TypeScript)

Prerequisites
- Node.js 18+ and npm
- MongoDB and Redis running locally or in the cloud

Quick Start
- Backend
  - `cd server`
  - Copy env: `cp .env.example .env` (Windows: `copy .env.example .env`)
  - Ensure values:
    - `PORT=3000`
    - `MONGODB_URI=mongodb://localhost:27017/mock_ecom`
    - `REDIS_URL=redis://localhost:6379`
    - `SESSION_SECRET=change-me`
    - `CORS_ORIGIN=http://localhost:5173`
  - Install: `npm install`
  - Dev: `npm run dev` (build then run)
  - Prod: `npm run build` then `npm start`
- Frontend
  - `cd client`
  - Copy env: `cp .env.example .env` (Windows: `copy .env.example .env`)
  - Ensure: `VITE_API_BASE_URL=http://localhost:3000`
  - Install: `npm install`
  - Dev: `npm run dev` (opens `http://localhost:5173`)

Default URLs
- API: `http://localhost:3000`
- Web: `http://localhost:5173`

API Endpoints (summary)
- GET `/api/products` — List products
- POST `/api/cart` — Add/increment item `{ productId, qty }`
- GET `/api/cart` — Get cart `{ items, total }`
- DELETE `/api/cart/:id` — Remove item
- POST `/api/checkout` — Checkout, returns receipt

Notes
- Sessions are stored in MongoDB (connect-mongo); requests include cookies, so CORS must allow the frontend origin.
- Products seed into MongoDB on first run if collection is empty.
- Rate limiting is enabled via Redis (100 req / 5 min per IP by default).
