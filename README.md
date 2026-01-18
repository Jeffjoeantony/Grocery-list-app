# Grocery List — Fullstack App

A simple grocery list app with per-user data isolation. Built with modern frontend and backend stacks and a cloud-managed database + auth provider (Supabase or MongoDB). This README documents how the project is organized, how to run it locally, the database schema, environment variables, JWT validation, and example API requests.

> Note: This README covers two possible backend stacks (FastAPI or Express) and two DB options (Supabase Postgres or MongoDB). If you use Supabase (recommended for this project), follow the Supabase/Postgres sections — otherwise see the MongoDB notes.

---

## Table of contents

- Project overview
- Tech stack
- Why Supabase/Postgres (recommended)
- Folder structure (typical)
- Run locally (frontend & backend)
- Environment variables (.env.example)
- Database schema / collection structure
- Row-level security (RLS) policies (Supabase)
- JWT validation (how backend verifies auth)
- API endpoints (examples + curl)
- Testing & security checks
- Frequently asked / next steps

---

## Project overview

This project provides:

- A frontend (React or Next.js) where users can:
  - Sign in and add grocery items
  - See only their own items (most recent first)
  - Mark items purchased and remove items
- A backend (Express or FastAPI) exposing secure REST APIs to read / create / update / delete items. Backend enforces authentication and trust boundaries.
- A managed DB (Supabase Postgres or MongoDB) storing items per user.
- Auth handled by Supabase Auth (recommended) or by custom JWT provider.

---

## Tech stack

- Frontend: React or Next.js
- Backend (choose one): Express (Node.js) OR FastAPI (Python)
- Database:
  - Recommended: Supabase (Postgres) — includes Auth + RLS
  - Alternative: MongoDB (Atlas)
- Auth: Supabase Auth (recommended) or Custom JWT (if using MongoDB)

Why Supabase? It provides Auth + Postgres + Row Level Security (RLS) in one managed service, which simplifies per-user data protection and client-side usage.

---

## Folder structure (typical)

- frontend/
  - src/
    - pages/ or routes/
    - components/
    - styles/
    - lib/supabaseClient.js
- backend/
  - src/
    - controllers/
    - routes/
    - middleware/
  - package.json or pyproject.toml
- README.md
- .env.example

---

## Run locally

Prerequisites:
- Node.js (16+) and npm/yarn
- Python 3.9+ (if using FastAPI)
- Supabase project (recommended) or MongoDB Atlas
- Environment variables set (see `.env.example` below)

Frontend (React or Next):
1. cd frontend
2. Install deps:
   - npm install
3. Create `.env` from `.env.example` and fill values (see below).
4. Start dev server:
   - React: npm run dev (or npm start)
   - Next: npm run dev
5. Open http://localhost:3000 (or port configured)

Backend (Express):
1. cd backend
2. npm install
3. Create `.env` from `.env.example` and fill values.
4. Start server:
   - npm run dev (nodemon) or npm start
5. API available at http://localhost:4000 (example)

Backend (FastAPI):
1. cd backend
2. python -m venv venv && source venv/bin/activate
3. pip install -r requirements.txt
4. Create `.env` from `.env.example` and fill values.
5. Start server:
   - uvicorn backend.main:app --reload --port 8000
6. API available at http://localhost:8000

---

## Environment variables (.env.example)

Place frontend vars in the frontend `.env` and backend vars in backend `.env` (server only).

Example `.env.example`:

# Frontend (client-side)
NEXT_PUBLIC_SUPABASE_URL=https://xyzcompany.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=public-anon-key

# Backend (server-side)
SUPABASE_URL=https://xyzcompany.supabase.co
SUPABASE_ANON_KEY=public-anon-key
SUPABASE_SERVICE_ROLE_KEY=service-role-secret   # keep on server only
DATABASE_URL=postgres://user:pass@host:5432/dbname  # if using Postgres directly
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname  # if using MongoDB
PORT=4000

Notes:
- Never commit `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL` or `MONGODB_URI` to git.
- Frontend uses only the `NEXT_PUBLIC_*` (public) keys.

---

## Database schema / collection structure

### Supabase (Postgres) — recommended

Run these SQL commands in Supabase SQL editor:

Create profiles (you already have this — included for reference):
```sql
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text unique,
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;

create policy "Users can read own profile"
on public.profiles
for select
using (auth.uid() = id);

create policy "Users can insert own profile"
on public.profiles
for insert
with check (auth.uid() = id);
```

Create items table:
```sql
create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  quantity text,
  note text,
  purchased boolean default false,
  created_at timestamptz default now()
);

create index if not exists idx_items_user_created on public.items (user_id, created_at desc);
```

RLS policies (see next section).

---

### MongoDB (alternative)

Collection: `items`

Example document:
```json
{
  "_id": "ObjectId(...)",
  "user_id": "string_user_id",      // store auth UID
  "name": "Tomato",
  "quantity": "2",
  "note": "fresh",
  "purchased": false,
  "created_at": "2026-01-18T04:26:28Z"
}
```

If using MongoDB with custom auth, your backend must verify JWT and apply `user_id` filters on every query. MongoDB does not provide RLS — implement checks server-side.

---

## Row Level Security (RLS) policies (Supabase Postgres)

Enable RLS and create these policies so each user can only operate on their own items:

```sql
alter table public.items enable row level security;

create policy "Select own items" on public.items
  for select
  using (user_id = auth.uid());

create policy "Insert own items" on public.items
  for insert
  with check (user_id = auth.uid());

create policy "Update own items" on public.items
  for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Delete own items" on public.items
  for delete
  using (user_id = auth.uid());
```

Important:
- `auth.uid()` is derived from the JWT. It prevents clients from inserting/updating rows with a different `user_id`.
- The `service_role` key bypasses RLS — keep it server-only.

---

## How JWT validation is implemented

Two recommended validation approaches for Supabase Auth:

1. Server uses the Supabase Admin client (service_role key) to verify a token and fetch the user:
   - Pros: simple, server-side validation using Supabase APIs
   - Cons: requires service_role key on server (must be kept secret)

   Example (Express/Node.js using `@supabase/supabase-js`):
   ```js
   import { createClient } from '@supabase/supabase-js';
   const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

   // middleware to get user from access token
   async function authMiddleware(req, res, next) {
     const auth = req.headers.authorization || '';
     const token = auth.split(' ')[1];
     if (!token) return res.status(401).send('Missing token');
     const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
     if (error || !user) return res.status(401).send('Invalid token');
     req.user = user;
     next();
   }
   ```

2. Verify JWT signature locally (recommended for performance / no extra RPC):
   - Fetch JWKS (JSON Web Key Set) from your Supabase project's `.well-known/jwks.json` endpoint and verify the token using a JWT library or `jwks-rsa`.
   - Use libraries like `jsonwebtoken` + `jwks-rsa` (Node) or `python-jose` (FastAPI).

   Example (Express with `express-jwt` + `jwks-rsa`):
   ```js
   import jwt from 'express-jwt';
   import jwksRsa from 'jwks-rsa';

   const checkJwt = jwt({
     secret: jwksRsa.expressJwtSecret({
       cache: true,
       rateLimit: true,
       jwksRequestsPerMinute: 5,
       jwksUri: `https://<project>.supabase.co/auth/v1/.well-known/jwks.json`
     }),
     audience: '<your-supabase-audience-if-set>',
     issuer: `https://<project>.supabase.co`,
     algorithms: ['RS256']
   });

   app.use('/api', checkJwt, (req,res)=>{ /* req.user present */ });
   ```

Notes:
- For Supabase, you can also call `supabase.auth.getUser(token)` on the server to validate and retrieve user profile info.
- MongoDB + custom auth: Validate your JWT using your chosen identity provider's keys / JWKs.

---

## Example API endpoints (secure)

Assume backend base URL is `https://api.local:4000` (Express) or `http://localhost:8000` (FastAPI).

Headers:
```
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json
```

### Get all current user's items
- Method: GET
- URL: /api/items
- Response: list of items (only the ones belonging to the authenticated user)

curl:
```bash
curl -H "Authorization: Bearer <ACCESS_TOKEN>" \
     -H "apikey: <ANON_KEY>" \
     "http://localhost:4000/api/items"
```

### Add an item
- Method: POST
- URL: /api/items
- Body:
```json
{ "name": "Tomato", "quantity": "2", "note": "ripe" }
```
- Server must set `user_id` using the authenticated user's id (from JWT) OR require client pass `user_id` equal to auth user when using Supabase direct insert.

curl (Express example that uses server user info):
```bash
curl -X POST "http://localhost:4000/api/items" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Tomato","quantity":"2","note":"ripe"}'
```

### Update item (toggle purchased)
- Method: PATCH
- URL: /api/items/:id
- Body: `{ "purchased": true }`

curl:
```bash
curl -X PATCH "http://localhost:4000/api/items/<ITEM_ID>" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"purchased": true}'
```

### Delete item
- Method: DELETE
- URL: /api/items/:id

curl:
```bash
curl -X DELETE "http://localhost:4000/api/items/<ITEM_ID>" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

Important: With Supabase + RLS, if you call Supabase REST (PostgREST) from the client, include the user's access token in the `Authorization` header. Supabase will enforce RLS policies.

---

## How to implement per-user restriction (summary)

- Use a `user_id` column in `items` referencing `auth.users(id)` (Postgres).
- Enable RLS and add the SELECT/INSERT/UPDATE/DELETE policies that check `user_id = auth.uid()`.
- On the client:
  - Option A (safe): call your backend API (`/api/items`) — the backend extracts the user id from the validated JWT and performs DB operations server-side (preferred).
  - Option B: client inserts directly into Supabase `items` table — the client must include `user_id` equal to the logged-in user's id, and RLS will ensure they cannot set another user id.
- Never expose `service_role` key on the client.

---

## Manual test checklist (verify security)

1. Create two test users: A and B (use Supabase Auth)
2. Sign in as A, add item `apple`. Confirm item appears for A.
3. Sign in as B, confirm `apple` is not visible.
4. Attempt malicious insert via curl using B's access token but setting `user_id` to A's id — should be rejected (403).
5. Attempt to fetch a specific item id belonging to A with B's token — should return empty / no data.
6. Attempt to update or delete A's item with B's token — should be rejected.
7. Admin (service_role) can read all rows from server — expected.

Example malicious curl (should fail):
```bash
curl -X POST "https://<project>.supabase.co/rest/v1/items" \
  -H "apikey: <ANON_KEY>" \
  -H "Authorization: Bearer <USER_B_ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"user_id":"<USER_A_UUID>","name":"malicious"}'
```

---
