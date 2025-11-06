# Nexora Frontend (React + Vite)

- React 19 + TypeScript + Vite + Tailwind CSS
- Connects to the backend in `../server` for products, cart and checkout

## Prerequisites
- Node.js 18+

## Setup
- Copy env: `cp .env.example .env` (Windows: `copy .env.example .env`)
- Edit `.env` and set the API base URL, e.g. `VITE_API_BASE_URL=http://localhost:3000`
- Install deps: `npm install`

## Run
- Dev server: `npm run dev` (defaults to `http://localhost:5173`)
- Build: `npm run build`
- Preview build: `npm run preview`
- Lint: `npm run lint`

## Environment
- `VITE_API_BASE_URL` must point to the running backend (default `http://localhost:3000`).
- The app sends `credentials: 'include'` on requests for session cookies. Ensure the backend `CORS_ORIGIN` includes the frontend origin (e.g. `http://localhost:5173`).

## Troubleshooting
- CORS errors: confirm backend `CORS_ORIGIN` matches the dev URL and that `VITE_API_BASE_URL` is correct.
- 429 Too Many Requests: backend rate limiter may be active; slow down or raise limits server-side.

## Project Structure
- `src/api.ts` — API client (uses `VITE_API_BASE_URL`)
- `src/components/*` — UI components (Products, Cart, Checkout)
- `src/App.tsx` — App shell
