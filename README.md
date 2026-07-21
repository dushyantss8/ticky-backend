# Ticky

A support ticket management REST API built with Node.js, Express 5, TypeScript, and MySQL.

Ticky provides the backend foundation for a support desk: user authentication with JWT, support tasks/tickets, and promotional banners. It ships with a lightweight, home-grown SQL migration runner (no ORM).

## Features

- User registration and login with hashed passwords (`bcrypt`)
- Stateless authentication via JWT access tokens
- MySQL data layer using `mysql2` connection pooling
- Simple, versioned SQL migrations with a locking migration runner
- Structured logging with `pino`
- Centralized error handling and `404` handling
- Health check endpoint

## Tech Stack

| Concern         | Choice                     |
| --------------- | -------------------------- |
| Runtime         | Node.js                    |
| Language        | TypeScript                 |
| Web framework   | Express 5                  |
| Database        | MySQL (`mysql2`)           |
| Auth            | `jsonwebtoken`, `bcrypt`   |
| Logging         | `pino` / `pino-pretty`     |
| Dev runner      | `tsx`                      |

## Project Structure

```
src/
  app.ts               # Express app setup (middleware, routes)
  server.ts            # Entry point, starts the HTTP server
  config/env.ts        # Environment variable loading & validation
  lib/                 # db pool, jwt, logger
  middlewares/         # error handler, not-found handler
  repositories/        # data access (SQL queries)
  services/            # business logic
  routes/              # route definitions
  types/               # shared types
  errors/AppError.ts   # typed application error
  scripts/migrate.ts   # migration runner
migrations/            # versioned .sql files
```

## Getting Started

### Prerequisites

- Node.js (18+ recommended)
- A running MySQL instance

### Installation

```bash
npm install
```

### Configuration

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

| Variable              | Description                                  | Example                                             |
| --------------------- | -------------------------------------------- | --------------------------------------------------- |
| `PORT`                | Port the server listens on                   | `5010`                                              |
| `NODE_ENV`            | Environment mode                             | `development`                                        |
| `LOG_LEVEL`           | Pino log level                               | `info`                                              |
| `DATABASE_URL`        | MySQL connection string                      | `mysql://user:password@localhost:3306/ticky_nodejs_db` |
| `JWT_SECRET`          | Secret used to sign JWTs                      | `a_long_random_string`                              |
| `JWT_EXPIRATION_TIME` | Access token lifetime                         | `1h`                                                |

> `DATABASE_URL`, `JWT_SECRET`, and `JWT_EXPIRATION_TIME` are required — the app throws on startup if any are missing.

### Database Setup

Create the database referenced in `DATABASE_URL`, then run the migrations:

```bash
npm run migrate
```

This applies any pending files from the `migrations/` folder (users, support tasks, and banners tables).

## Running the App

```bash
# Development (auto-reload)
npm run dev

# Production build
npm run build
npm start
```

## Scripts

| Script            | Description                                  |
| ----------------- | -------------------------------------------- |
| `npm run dev`     | Start the server in watch mode with `tsx`    |
| `npm run build`   | Compile TypeScript to `dist/`                |
| `npm start`       | Run the compiled server from `dist/`         |
| `npm run migrate` | Apply pending SQL migrations                 |

## API

Base URL: `/api/v1`

| Method | Endpoint         | Description              | Auth |
| ------ | ---------------- | ------------------------ | ---- |
| GET    | `/health`        | Health check             | No   |
| POST   | `/auth/register` | Register a new user      | No   |
| POST   | `/auth/login`    | Log in, returns a token  | No   |

### Register

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secret123"
}
```

### Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secret123"
}
```

Response:

```json
{
  "success": true,
  "data": { "accessToken": "<jwt>" }
}
```

## License

ISC
