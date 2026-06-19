# Codemate — Backend

Express + MongoDB REST API for **Codemate**. See the [root README](../README.md) for the full project overview, tech stack, and combined setup instructions.

## Quick start

```bash
npm install
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, CORS_ORIGIN
npm run dev            # http://localhost:3000
```

## Scripts

- `npm run dev` — start with nodemon (auto-restart)
- `npm start` — plain node start
- `npm test` — run Jest + Supertest tests against an in-memory MongoDB
- `npm run seed:users` — sign up 200 mock users against a running backend (see [Sample Data](#sample-data) below)

## Authentication

Most routes require a valid session. On login/signup, a JWT is issued and set as an **HTTP-only cookie**; the `userAuth` middleware reads this cookie on protected routes and attaches the logged-in user to `req.user`.

## API Reference

All routes are relative to the server base URL (default `http://localhost:3000`).

### Auth — `/`

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/signup` | No | Create a new account (hashes password with bcrypt) |
| POST | `/login` | No | Log in with email + password, sets JWT cookie |
| POST | `/logout` | No | Clears the JWT cookie |

### Profile — `/profile`

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/profile/view` | Yes | Get the logged-in user's profile |
| POST | `/profile/photo` | Yes | Upload a profile picture (`multipart/form-data`, field `photo`; JPEG/PNG/WEBP, max 5MB) |
| PATCH | `/profile/edit` | Yes | Edit profile fields (name, age, gender, interests, about me, etc.) |
| PATCH | `/profile/password` | Yes | Change password |

### Connection Requests — `/request`

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/request/send/:status/:receiverId` | Yes | Send a connection request. `status` is `interested` or `ignored` |

Accepting/rejecting incoming requests updates the request `status` to `accepted` or `rejected` (see route source for the exact endpoint and payload).

### Users / Feed — `/user`

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/user/matches` | Yes | Get all accepted connections (mutual matches) |
| GET | `/user/feed` | Yes | Paginated feed of users not yet interacted with (`?page=&limit=`) |
| GET | `/user/feed/cursor` | Yes | Cursor-paginated feed (`?cursor=&limit=`) |

### Health — `/health`

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/health` | No | Health check for uptime/monitoring |

### Connection request status values

`interested`, `ignored`, `accepted`, `rejected`

> See [`APIList.md`](APIList.md) for the original quick-reference list this table was derived from.

## Sample Data

The [`scripts/`](scripts) folder contains a generator and a runner for seeding mock users so you don't have to manually sign up accounts to test the feed/matching flow:

- [`scripts/mockUsers.js`](scripts/mockUsers.js) — exports `generateMockUsers(count)`, which builds an array of randomized user objects (name, email, password, age, gender, interests, about me) using built-in name/interest pools. Emails are unique per run (`firstname.lastname<n>@codemate-mock.dev`), and passwords (`Mock<n>Pass`) satisfy the signup strength rules.
- [`scripts/seedUsers.js`](scripts/seedUsers.js) — calls `generateMockUsers` and signs each one up via `POST /signup` against a running backend, in batches of 10 with a short delay between batches.

### Usage

Make sure the backend is running first (`npm run dev`), then:

```bash
npm run seed:users
# or with custom count / target URL:
node scripts/seedUsers.js 200 http://localhost:3000
```

This inserts real documents into whatever database your `MONGO_URI` points to — point it at a local/test database rather than production if you just want throwaway sample data.

## Environment Variables

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JWTs — use a long random string |
| `PORT` | Port the server listens on (default `3000`) |
| `CORS_ORIGIN` | Frontend origin allowed to make requests (e.g. `http://localhost:5173`) |
| `NODE_ENV` | `development` / `production` |

## Testing

Tests live in `src/__tests__` and run against `mongodb-memory-server` (no real database needed):

```bash
npm test
```
