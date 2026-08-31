# SkillBridge — Technical Documentation

## 1. Overview

SkillBridge is a full-stack career portal implemented as two applications:

- **Backend** — a stateless REST API (Node.js + Express + MongoDB) issuing JWTs.
- **Frontend** — a single-page application (React + TypeScript + Tailwind CSS) built with Vite.

They communicate over HTTP/JSON. In development the Vite dev server proxies `/api` to the backend.

```
┌────────────┐     /api (JSON + JWT)     ┌──────────────┐     Mongoose     ┌──────────┐
│  React SPA │  ───────────────────────► │  Express API │  ──────────────► │ MongoDB  │
│ (Vite/TS)  │  ◄─────────────────────── │  (Node.js)   │  ◄────────────── │          │
└────────────┘                           └──────────────┘                  └──────────┘
```

## 2. Data Models

### User
| Field      | Type       | Notes                                       |
| ---------- | ---------- | ------------------------------------------- |
| name       | String     | required                                    |
| email      | String     | required, unique, lowercased                |
| password   | String     | bcrypt-hashed, `select:false`               |
| role       | Enum       | `student` \| `recruiter` \| `admin`         |
| headline, bio, location | String | profile fields                        |
| skills     | [String]   | profile skills                              |
| resumeUrl  | String     | uploaded resume path                        |
| savedJobs  | [ObjectId] | bookmarked jobs                             |

Passwords are hashed in a Mongoose `pre('save')` hook. `comparePassword()` verifies logins.

### Job
`title, company, location, type, category, description, requirements[], skills[], salaryMin,
salaryMax, experience, postedBy (→User), isActive`. A text index powers keyword search.

### Application
`job (→Job), applicant (→User), status, coverLetter, resumeUrl`. A unique compound index on
`{ job, applicant }` prevents duplicate applications. Status ∈ `Applied, Reviewing, Shortlisted,
Rejected, Hired`.

## 3. Authentication & Authorization

- **JWT** — On register/login the API signs a token `{ id: userId }` with `JWT_SECRET`, expiring
  in `JWT_EXPIRES_IN` (default 7d). The frontend stores it in `localStorage` and attaches it as
  `Authorization: Bearer <token>` via an Axios interceptor.
- **`protect` middleware** — verifies the token and loads `req.user`.
- **`authorize(...roles)` middleware** — enforces Role-Based Access Control (RBAC). Example:
  `router.post('/', protect, authorize('recruiter', 'admin'), createJob)`.
- **Frontend guard** — `<ProtectedRoute roles={[...]}>` redirects unauthenticated users to
  `/login` and users with the wrong role to `/`.

Self-registration is limited to `student`/`recruiter`; `admin` cannot be self-assigned.

## 4. Key Flows

**Search / Filter / Pagination** — `GET /api/jobs` accepts `search`, `type`, `category`,
`location`, `page`, `limit`, `sort`. The server builds a Mongo filter, runs a paginated
`find()` + `countDocuments()` in parallel, and returns `{ jobs, pagination }`.

**Apply to a job** — Students `POST /api/applications { jobId, coverLetter }`. The unique index
blocks duplicates (409). Recruiters view applicants per job and `PATCH` their status.

**Resume upload** — `POST /api/users/resume` uses `multer` disk storage (PDF/DOC/DOCX, ≤5 MB),
saving to `/uploads` served statically.

**Admin analytics** — `GET /api/admin/stats` aggregates totals, applications-by-status, and
jobs-by-type using MongoDB aggregation pipelines.

## 5. Frontend Architecture

- **Routing** — `react-router-dom` v6, routes declared in `App.tsx`.
- **State/Context** — `AuthContext` (session, login/register/logout) and `ThemeContext`
  (dark mode via a `class` on `<html>`, persisted to `localStorage`).
- **API layer** — a single Axios instance (`src/api/client.ts`) with request/response interceptors.
- **Styling** — Tailwind CSS with reusable component classes (`.btn`, `.card`, `.input`) and a
  `brand` color scale. Fully responsive (mobile-first) with a collapsible mobile nav.

## 6. Environment Variables

**Backend** (`backend/.env`)
```
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=              # empty → in-memory MongoDB (auto-seeded)
JWT_SECRET=...
JWT_EXPIRES_IN=7d
```

**Frontend** (`frontend/.env`)
```
VITE_API_URL=           # empty in dev (proxied); set to deployed API URL in prod
```

## 7. Local Development

```bash
# Terminal 1
cd backend && npm install && npm run dev

# Terminal 2
cd frontend && npm install && npm run dev
```

Open http://localhost:5173. Demo accounts (password `password123`):
`student@`, `recruiter@`, `admin@` `skillbridge.dev`.

To seed a real database instead of the in-memory one:
```bash
cd backend
MONGO_URI="mongodb://127.0.0.1:27017/skillbridge" npm run seed
```

## 8. Deployment

- **Frontend → Vercel** — framework Vite, output `dist`, `vercel.json` rewrites all routes to
  `index.html`. Set `VITE_API_URL` to the deployed backend URL.
- **Backend → Render/Railway** — see `render.yaml`. Provide a `MONGO_URI` (e.g. MongoDB Atlas)
  and set `CLIENT_URL` to the deployed frontend origin for CORS.
- **Docker** — `docker compose up --build` runs MongoDB + backend + Nginx-served frontend.

## 9. CI/CD

`.github/workflows/ci.yml` runs on every push/PR to `main`:
1. **backend** — installs deps and smoke-tests the `/api/health` endpoint.
2. **frontend** — type-checks (`tsc`) and builds.
3. **docker** — builds both container images.

## 10. Security Notes

- Passwords are never returned (schema `select:false` + `toJSON` strip).
- API is rate-limited (`express-rate-limit`).
- CORS restricted to `CLIENT_URL`.
- Ownership checks on job/application mutations; admin override where appropriate.
