# SkillBridge — Full-Stack Career Portal

> Explore jobs & internships, track applications, and manage your professional profile — all in one modern, responsive dashboard.

SkillBridge is a full-stack career platform for students and freshers. It provides job listings,
role-based access for students and recruiters, JWT authentication, application tracking, resume
management, an admin analytics dashboard, and a responsive UI with dark mode.

---

## ✨ Features

- 🔐 **User Authentication with JWT** (register / login, bcrypt-hashed passwords)
- 👥 **Role-Based Access** — Student / Recruiter / Admin
- 💼 **Job & Internship Listings**
- 📊 **Application Tracking Dashboard** — interactive stat cards that filter applications by status (In Review / Shortlisted) or jump to Saved Jobs
- 📄 **Resume Upload & Profile Management**
- 🔎 **Search, Filter & Pagination**
- 🛠️ **Admin Dashboard** with platform analytics
- 🌙 **Responsive UI with Dark Mode**

## 🧱 Tech Stack

| Layer          | Technology                              |
| -------------- | --------------------------------------- |
| Frontend       | React.js, TypeScript, Tailwind CSS, Vite |
| Backend        | Node.js, Express.js, TypeScript         |
| Database       | MongoDB (Mongoose)                      |
| Authentication | JWT, bcrypt                             |
| Deployment     | Vercel (frontend) + Render/Railway (backend) |
| DevOps         | GitHub Actions, Docker                  |

---

## 📁 Project Structure

```
major project2/
├── backend/                 # Express REST API (TypeScript)
│   ├── src/
│   │   ├── config/db.tsx        # Mongo connection (+ in-memory fallback)
│   │   ├── models/              # User, Job, Application (typed schemas)
│   │   ├── controllers/         # Route handlers
│   │   ├── routes/              # /auth /jobs /applications /users /admin
│   │   ├── types/               # Express Request augmentation
│   │   ├── utils/               # token, seed data, async handler
│   │   ├── app.tsx              # Express app
│   │   └── server.tsx           # Entry point
│   ├── tsconfig.json            # TypeScript config (compiles to dist/)
│   ├── Dockerfile
│   └── package.json
├── frontend/                # React + TypeScript + Tailwind SPA
│   ├── src/
│   │   ├── api/                 # Axios client
│   │   ├── context/            # Auth + Theme (dark mode) providers
│   │   ├── components/         # Navbar, JobCard, ProtectedRoute, ...
│   │   ├── pages/              # Home, Jobs, Dashboard, Admin, ...
│   │   └── App.tsx             # Routes
│   ├── Dockerfile
│   └── package.json
├── docs/                    # Technical documentation
├── .github/workflows/ci.yml # CI pipeline (install, typecheck, build)
├── docker-compose.yml       # MongoDB + backend + frontend
├── render.yaml              # Backend deployment blueprint (Render)
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- (Optional) MongoDB — if you don't set one, the backend spins up an **in-memory MongoDB**
  automatically and seeds demo data, so you can run everything with **zero database setup**.

### 1. Backend

```bash
cd backend
cp .env.example .env      # optional: set MONGO_URI / JWT_SECRET
npm install
npm run dev               # http://localhost:5000  (tsx watch, auto-restart)
```

On first start with an empty database, demo data is seeded automatically.

For a production build, compile the TypeScript and run the output:

```bash
npm run build             # tsc -> dist/
npm start                 # node dist/server.js
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev               # http://localhost:5173
```

The Vite dev server proxies `/api` to the backend, so no extra config is needed.

> Both apps use the **same command** — run `npm run dev` in each folder (two terminals).
> The backend also supports `npm start` (plain `node`, no auto-restart) for production.

### 🔑 Demo Accounts (password: `password123`)

| Role      | Email                       |
| --------- | --------------------------- |
| Student   | student@skillbridge.dev     |
| Recruiter | recruiter@skillbridge.dev   |
| Admin     | admin@skillbridge.dev       |

---

## 🐳 Run with Docker

```bash
docker compose up --build
```

- Frontend → http://localhost:5173
- Backend → http://localhost:5000
- MongoDB → mongodb://localhost:27017

---

## 🔌 API Overview

Base URL: `/api`

| Method | Endpoint                         | Access            | Description                    |
| ------ | -------------------------------- | ----------------- | ------------------------------ |
| POST   | `/auth/register`                 | Public            | Register (student/recruiter)   |
| POST   | `/auth/login`                    | Public            | Login, returns JWT             |
| GET    | `/auth/me`                       | Auth              | Current user                   |
| GET    | `/jobs`                          | Public            | List jobs (search/filter/page) |
| GET    | `/jobs/:id`                      | Public            | Job details                    |
| POST   | `/jobs`                          | Recruiter/Admin   | Create job                     |
| PUT    | `/jobs/:id`                      | Owner/Admin       | Update job                     |
| DELETE | `/jobs/:id`                      | Owner/Admin       | Delete job                     |
| POST   | `/applications`                  | Student           | Apply to a job                 |
| GET    | `/applications/mine`             | Student           | My applications                |
| GET    | `/applications/job/:jobId`       | Recruiter/Admin   | Applicants for a job           |
| PATCH  | `/applications/:id/status`       | Recruiter/Admin   | Update application status      |
| PUT    | `/users/profile`                 | Auth              | Update profile                 |
| POST   | `/users/resume`                  | Auth              | Upload resume                  |
| POST   | `/users/saved/:jobId`            | Auth              | Save / unsave a job            |
| GET    | `/admin/stats`                   | Admin             | Platform analytics             |
| GET    | `/admin/users`                   | Admin             | List / manage users            |

See [`docs/TECHNICAL.md`](docs/TECHNICAL.md) for full documentation.

---

## 📦 Deliverables

- ✅ Live full-stack application (frontend + backend)
- ✅ GitHub-ready repository with CI/CD
- ✅ Technical documentation (`docs/`)
- ✅ Docker & GitHub Actions DevOps setup

## 🎯 Learning Outcomes

- Build production-grade full-stack applications
- Work with React, TypeScript, Node.js and databases
- Implement authentication and protected routes (JWT + RBAC)
- Deploy applications using CI/CD pipelines
- Gain real-world software development experience

---

## 📄 License

MIT
