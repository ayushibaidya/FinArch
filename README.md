# FinArch

Personal finance project split into separate backend and frontend folders.

## Repository Layout

- `backend/`: Express + PostgreSQL API (auth, CRUD, analytics, tests, Docker)
- `frontend/`: static UI prototype (Auth & Session screens)

## Current Status

- Backend is the primary runnable app.
- Frontend is scaffolded and includes auth/session UI logic, but it is not yet wired with its own build tooling or production deployment flow.

## Quick Start (Backend)

```bash
cd backend
npm install
npm run migrate
npm start
```

API runs on `http://localhost:3000`.

## Frontend Notes

- Frontend files live in `frontend/`.
- Main entry: `frontend/index.html`.
- API base URL is configured in `frontend/src/shared/lib/config.js`.
- If frontend is served from a different origin than backend, enable CORS in backend or use a same-origin proxy.
