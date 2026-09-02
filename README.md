# Notification Management System

A personal notifications dashboard. Users register, log in, and manage
notifications categorised as INFO, WARNING or ERROR. Recent undismissed
notifications appear as banners on the dashboard; INFO banners expire
automatically after 90 seconds.

Rebuilt from a reference Angular + Express application. This is a rewrite,
not a port — see [Differences from the reference app](#differences-from-the-reference-app).

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, React Router, axios, Bootstrap 5 |
| Backend | NestJS 12, TypeScript |
| Database | MongoDB (Atlas) with Mongoose |
| Auth | JWT via Passport |
| Password hashing | bcrypt |
| Validation | class-validator + global ValidationPipe |
| Tests | Jest with @swc/jest |

## Prerequisites

- **Node.js** 20 or newer (developed on Node 26)
- **npm** 10 or newer
- **MongoDB** — a free MongoDB Atlas cluster, or a local instance on port 27017

## Project structure

```
notification_management_system/
├── backend/              NestJS API
│   └── src/
│       ├── auth/         JWT strategy, guard, @CurrentUser decorator
│       ├── users/        Registration and login
│       ├── notifications/ Notifications CRUD
│       └── main.ts
├── frontend/             React application
│   └── src/
│       ├── components/   Reusable UI
│       ├── context/      Auth and notifications providers
│       ├── hooks/        useAuth, useNotifications
│       ├── models/       Shared TypeScript types
│       ├── pages/        Route-level views
│       ├── services/     API layer (axios instance + interceptors)
│       └── utils/
└── README.md
```

## Installation

Clone the repository, then install both halves separately.

```bash
cd backend
npm install
```

```bash
cd frontend
npm install
```

## Environment variables

Both apps read a `.env` file that is **not** committed. Each has a
`.env.example` listing the required keys.

### `backend/.env`

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string, including the database name |
| `JWT_SECRET` | Secret used to sign and verify JWTs. Use a long random string |
| `PORT` | Port the API listens on (default `3000`) |
| `FRONTEND_URL` | Origin allowed by CORS (default `http://localhost:5173`) |

### `frontend/.env`

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API, e.g. `http://localhost:3000` |

> Vite bakes `VITE_`-prefixed variables into the client bundle, where anyone
> can read them. Never put secrets in the frontend `.env`.

## Running the app

Two terminals.

**Backend:**

```bash
cd backend
npm run start:dev
```

**Frontend:**

```bash
cd frontend
npm run dev
```

The API runs on `http://localhost:3000` and the app on `http://localhost:5173`.

## Running tests

```bash
cd backend
npm test
```

Unit tests cover `NotificationsService.create`, using a mocked Mongoose model
so no database is required.

## API

All `/notifications` routes require an `Authorization: Bearer <token>` header.

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/users/register` | No | Create an account. 409 if the username is taken |
| POST | `/users/login` | No | Returns a JWT and the user profile. 401 on bad credentials |
| GET | `/users/me` | Yes | Returns the authenticated user's token payload |
| GET | `/notifications` | Yes | The caller's notifications, newest first |
| GET | `/notifications/:id` | Yes | A single notification the caller owns |
| POST | `/notifications` | Yes | Create a notification |
| PUT | `/notifications/:id` | Yes | Update a notification the caller owns |
| DELETE | `/notifications/:id` | Yes | Delete a notification the caller owns |

## Security decisions

- **Passwords** are hashed with bcrypt (cost factor 10) on the server. The
  hash is excluded from queries by default via Mongoose `select: false`, and
  responses are built from an explicit whitelist, so it can never be returned.
- **Login failures** return an identical 401 whether the username is unknown
  or the password is wrong, to prevent username enumeration.
- **Ownership** is enforced inside the query, not checked afterwards: every
  by-ID operation filters on both `_id` and the authenticated `userId`. Another
  user's notification returns **404, not 403**, so the API does not confirm
  that the record exists. This prevents IDOR.
- **`userId`, `date` and `isClosed`** are set by the server on create and are
  absent from the create DTO, so a client cannot supply them.
- **`forbidNonWhitelisted`** rejects any request containing undeclared
  properties, preventing mass assignment.
- **CORS** allows only the configured frontend origin, not a wildcard.
- **Invalid ObjectIds** return 404 rather than surfacing a Mongoose cast error.

## Differences from the reference app

| Reference app | This implementation |
|---|---|
| No backend authentication; `userId` taken from the URL | JWT verified on every protected route |
| MD5 hashed in the browser | bcrypt hashed on the server |
| `findOne(req.body)` — NoSQL injection | DTOs whitelist known fields |
| Password hash returned on login | Never leaves the server |
| Errors ignored in callbacks | Typed exceptions with correct status codes |
| INFO expiry held in a browser timer only | Derived from a server timestamp, and persisted |
| Local array update was a no-op | State replaced immutably via `map` |

## Known limitations

- No refresh tokens. The JWT lasts 24 hours; when it expires the user is
  returned to the login page.
- The JWT is stored in `localStorage`, which is readable by JavaScript and so
  vulnerable to XSS. An `httpOnly` cookie would resist XSS but requires CSRF
  protection in return. `localStorage` was chosen for simplicity.
- No rate limiting on the login endpoint.
- Test coverage is limited to `NotificationsService.create`.
- The frontend uses a const-object union rather than a TypeScript `enum`
  because Vite's template enables `erasableSyntaxOnly`. The backend uses a
  real enum.