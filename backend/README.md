# FinArch

Versioned REST API for personal finance built with Node.js, Express, and PostgreSQL.

## Features

- JWT authentication (`/api/v1/auth/register`, `/api/v1/auth/login`)
- Versioned APIs:
  - `v1`: CRUD for accounts/categories, transaction create/list
  - `v2`: analytics endpoints
- ACID-safe transaction creation with account balance updates
- SQL migrations and normalized PostgreSQL schema
- Input validation, auth middleware, centralized error handling
- Jest + Supertest tests for key endpoints
- Dockerized app + PostgreSQL via `docker-compose`

## Repository Context

This README is for the backend app in `backend/`.
Frontend lives separately at `../frontend`.

## Project Structure

```text
src/
  config/
  controllers/
  middleware/
  repositories/
  routes/v1/
  routes/v2/
  services/
  utils/
  validators/
migrations/
scripts/
tests/
```

## Prerequisites

- Node.js 20+
- PostgreSQL 16+ (or Docker)

## Environment Variables

Copy `.env.example` to `.env` and update values:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@db:5432/finarch
JWT_SECRET=replace_with_strong_secret
JWT_EXPIRES_IN=1d
```

## Run Locally

```bash
cd backend
npm install
npm run migrate
npm start
```

## Run Tests

```bash
cd backend
npm test
```

## Docker

```bash
cd backend
docker compose up --build
```

App: `http://localhost:3000`

## API Endpoints

### v1

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/accounts`
- `GET /api/v1/accounts`
- `GET /api/v1/accounts/:id`
- `PUT /api/v1/accounts/:id`
- `PATCH /api/v1/accounts/:id`
- `DELETE /api/v1/accounts/:id`
- `POST /api/v1/categories`
- `GET /api/v1/categories`
- `POST /api/v1/transactions`
- `GET /api/v1/transactions?page=1&limit=10&type=expense&startDate=2026-01-01&endDate=2026-01-31`

### v2

- `GET /api/v2/analytics/monthly-summary?from=2026-01-01&to=2026-12-31`
- `GET /api/v2/analytics/category-breakdown?from=2026-01-01&to=2026-12-31`
