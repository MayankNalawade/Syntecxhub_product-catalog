# Product Catalog Management

Simple REST API for a product catalog. Covers search, pagination, MongoDB aggregation, JWT-protected writes, and input validation.

## Setup

```bash
cp .env.example .env
npm install
```

**Option A — no MongoDB install (demo):** uses an in-memory database and seeds sample products on start.

```bash
npm run start:demo
```

**Option B — local MongoDB:** install and start MongoDB, then:

```bash
npm run seed
npm start
```

API: `http://localhost:3000`

Seeded login (Option B): `admin@example.com` / `admin123`

## Endpoints

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | No | Create an account |
| POST | `/api/auth/login` | No | Get a JWT |
| GET | `/api/products` | No | List / search with pagination |
| GET | `/api/products/stats` | No | Category stats (aggregation) |
| GET | `/api/products/:id` | No | Get one product |
| POST | `/api/products` | Yes | Create a product |
| PUT | `/api/products/:id` | Yes | Update a product |
| DELETE | `/api/products/:id` | Yes | Delete a product |

Search and pagination query params:

- `name` — case-insensitive name match
- `category` — case-insensitive category match
- `minPrice`, `maxPrice`
- `page` (default 1), `limit` (default 10, max 50)

Examples:

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Mayank","email":"mayank@example.com","password":"secret1"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Search + pagination
curl "http://localhost:3000/api/products?name=mouse&page=1&limit=5"
curl "http://localhost:3000/api/products?category=Electronics"

# Create (replace TOKEN)
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"name":"USB-C Hub","category":"Electronics","price":1299,"stock":15}'
```
