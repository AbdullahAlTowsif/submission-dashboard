# Project Submission & Review Dashboard

A full-stack web app where **students submit their projects** and **mentors review them**. Students send a repository and a live link; mentors approve or reject each submission, leave feedback, and track progress on a dashboard.

Built for the Associate Web Instructor hiring task.

---

## Features

**Students**
- Sign up and log in (signing up logs you in automatically)
- Submit a project: name, GitHub repository URL, live link, description
- Strict validation on the client and the server, with errors shown next to the field
- Duplicate protection: the same repository can't be submitted twice (also with URL variations like `.git` or a trailing slash)
- Rate limiting to prevent spam
- "My submissions" list with status badges (Pending, Approved, Rejected) and mentor feedback

**Mentors**
- Statistics cards: Total, Pending, Approved, Rejected (click a card to filter)
- Paginated data table
- **Server-side** status filter (All / Pending / Approved / Rejected) and search
- Approve or reject a submission with an optional feedback comment
- Filters and page number live in the URL, so a refresh or a shared link keeps the same view

**Authentication and access control**
- JWT-based role-based access control (`STUDENT`, `MENTOR`)
- Access and refresh tokens stored in `httpOnly` cookies
- Role-protected API routes and role-aware page redirects

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript |
| Frontend | Next.js 16 (App Router), Tailwind CSS v4, shadcn/ui, TanStack Query |
| Backend | Express.js |
| Database | PostgreSQL via Prisma ORM v7 (multi-file schema) |
| Validation | Zod (frontend and backend) |
| Auth | JWT (access + refresh), bcrypt, role-based access control |
| Rate limiting | express-rate-limit |

---

## Live Demo

| | URL |
|---|---|
| Frontend | `https://submission-dashboard-five.vercel.app/` |
| Backend API | `https://submission-dashboard-backend.onrender.com/api/v1` |
| Repository | `https://github.com/AbdullahAlTowsif/submission-dashboard` |

### Demo credentials

The mentor account is created automatically when the backend starts (from `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `backend/.env`).

| Role | Email | Password |
|---|---|---|
| Mentor | `mentor@example.com` | `Mentor@12345` |
| Student | Create one on the **Sign up** page | your choice (min. 6 characters) |

> These are demo values from `backend/.env.example`. Change them for any real deployment.

---

## Getting Started

### Prerequisites
- Node.js 20.9 or newer (required by Next.js 16)
- npm
- A running PostgreSQL database (v14 or newer)

### 1. Clone the repository

```bash
git clone <repository-url>
cd submission-dashboard
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create the environment file (macOS/Linux: `cp`, Windows: `copy`):

```bash
cp .env.example .env
```

Open `.env` and set `DATABASE_URL` to an **empty PostgreSQL database** you created (for example `submission_dashboard`), and replace the two JWT secrets with long random strings.

Generate the Prisma client and apply the migrations:

```bash
npx prisma generate
npx prisma migrate deploy
```

Start the API:

```bash
npm run dev
```

The API runs on `http://localhost:5000`. On startup it creates the mentor account if it doesn't exist yet. Check `http://localhost:5000/health` or the startup log.

### 3. Set up the frontend

Open a second terminal:

```bash
cd frontend
npm install
cp .env.example .env.local
```

`JWT_ACCESS_SECRET` in `frontend/.env.local` **must be identical** to `JWT_ACCESS_SECRET` in `backend/.env`.

```bash
npm run dev
```

Open `http://localhost:3000`.

### 4. Try it out

1. Click **Sign up** and create a student account. You land on the student dashboard.
2. Submit a project (use a GitHub URL such as `https://github.com/username/repo`).
3. Log out, then log in as the mentor with the demo credentials above.
4. Open the review dashboard, filter, search, and approve or reject the submission with feedback.
5. Log back in as the student to see the new status and the mentor's feedback.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|---|---|---|
| `NODE_ENV` | `development` or `production` | `development` |
| `PORT` | API port | `4000` |
| `FRONTEND_URL` | Frontend origin allowed by CORS | `http://localhost:3000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:password@localhost:5432/submission_dashboard` |
| `JWT_ACCESS_SECRET` | Secret for access tokens | long random string |
| `JWT_ACCESS_EXPIRES` | Access token lifetime | `1h` |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens (different from the access secret) | long random string |
| `JWT_REFRESH_EXPIRES` | Refresh token lifetime | `7d` |
| `BCRYPT_SALT_ROUND` | bcrypt cost factor | `10` |
| `ADMIN_EMAIL` | Seeded mentor email | `mentor@example.com` |
| `ADMIN_PASSWORD` | Seeded mentor password | `Mentor@12345` |

### Frontend (`frontend/.env.local`)

| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_BASE_API_URL` | Backend API base URL | `http://localhost:5000/api/v1` |
| `JWT_ACCESS_SECRET` | Same value as the backend. Server-side only, used for role-based redirects | same as backend |

---

## Project Structure

```
submission-dashboard/
├── backend/
│   ├── prisma/
│   │   ├── schema/              # multi-file Prisma schema
│   │   │   ├── schema.prisma    # generator + datasource
│   │   │   ├── user.prisma
│   │   │   ├── submission.prisma
│   │   │   └── feedback.prisma
│   │   └── migrations/
│   ├── prisma7.config.ts
│   └── src/
│       ├── app.ts / server.ts
│       └── app/
│           ├── config/          # validated environment variables
│           ├── middlewares/     # auth (RBAC), validateRequest, rateLimiter, error handlers
│           ├── modules/
│           │   ├── auth/        # login, refresh, logout, me
│           │   ├── user/        # student signup
│           │   ├── submission/  # student: create and list own submissions
│           │   └── mentor/      # stats, paginated list, review
│           ├── routes/
│           └── utils/           # ApiError, catchAsync, sendResponse, prisma, seedAdmin
└── frontend/
    └── src/
        ├── proxy.ts             # route protection + silent token refresh
        ├── app/
        │   ├── (commonLayout)/  # landing, login, signup
        │   └── (dashboardLayout)/
        │       ├── student/
        │       └── mentor/
        ├── components/
        │   ├── modules/         # Auth, Student, Mentor feature components
        │   ├── shared/          # Navbar, Skeletons, StatusBadge, TablePagination...
        │   └── ui/              # shadcn/ui
        ├── lib/                 # server-fetch, jwtHandlers, auth-utils, zodValidator...
        ├── services/            # server actions that call the backend
        ├── types/
        └── zod/                 # form validation schemas
```

---

## API Overview

Base URL: `/api/v1`. All responses use the same envelope:

```json
{ "success": true, "message": "...", "meta": { "page": 1, "limit": 10, "total": 25, "totalPages": 3 }, "data": {} }
```

Errors return `{ "success": false, "message": "...", "error": ... }`, where `error` is a list of `{ path, message }` for validation failures.

### Auth

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/signup` | Public | Create a student account and log in |
| POST | `/auth/login` | Public | Log in |
| POST | `/auth/refresh-token` | Refresh cookie | Issue new access and refresh tokens |
| POST | `/auth/logout` | Public | Clear the auth cookies |
| GET | `/auth/me` | Student, Mentor | Current user |

### Student

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/submissions` | Student | Submit a project |
| GET | `/submissions/mine` | Student | List my submissions with feedback |

### Mentor

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/mentor/stats` | Mentor | Total, pending, approved, rejected counts |
| GET | `/mentor/submissions` | Mentor | Paginated list |
| PATCH | `/mentor/submissions/:id/status` | Mentor | Approve or reject, with optional feedback |

`GET /mentor/submissions` query parameters:

| Param | Description |
|---|---|
| `page` | Page number (default 1) |
| `limit` | Page size (default 10, maximum 100) |
| `status` | `PENDING`, `APPROVED` or `REJECTED` (omit for all) |
| `search` | Matches project name, student name or student email |
| `sortBy` | `createdAt` (default), `reviewedAt`, `projectName`, `status` |
| `sortOrder` | `desc` (default) or `asc` |

Example review request:

```http
PATCH /api/v1/mentor/submissions/<id>/status
{ "status": "APPROVED", "comment": "Nice work, clean structure." }
```

### Status codes used

| Code | Meaning |
|---|---|
| 400 | Validation failed |
| 401 | Not authenticated (missing, invalid or expired token) |
| 403 | Authenticated, but the role is not allowed |
| 404 | Resource not found |
| 409 | Duplicate submission, or submission already reviewed |
| 429 | Rate limit exceeded |

---

## Requirements Checklist

| Requirement | Where it is implemented |
|---|---|
| Submission form with project name, repo URL, live link, description | `frontend/src/components/modules/Student/SubmissionForm.tsx` |
| Robust validation | Zod on the frontend (`zod/`) and backend (`submission.validation.ts`), plus URL normalization |
| Prevent duplicate submissions | Unique constraint `(studentId, repoUrl)` in Prisma, a friendly 409 check, and normalized repo URLs |
| Basic rate limit | `middlewares/rateLimiter.ts` |
| Paginated data table | `Mentor/SubmissionsTable.tsx` + `GET /mentor/submissions` |
| Approve and reject actions | `Mentor/ReviewDialog.tsx` + `PATCH /mentor/submissions/:id/status` |
| Server-side Approved/Rejected filter | `status` query parameter handled in `mentor.service.ts` |
| Aggregated statistics | `Mentor/StatsCards.tsx` + `GET /mentor/stats` (Prisma `groupBy`) |
| Login and student signup pages | `frontend/src/app/(commonLayout)/login` and `/signup` |
| Admin seeded in the database | `backend/src/app/utils/seedAdmin.ts` |
| JWT-based RBAC | `middlewares/auth.ts`, `frontend/src/proxy.ts` |

---

## Design Decisions and Assumptions

The task left some requirements open on purpose. These are the decisions I made.

**Roles and accounts**
- There is one seeded mentor account. Public signup creates **students only**; the role is set on the server and is never read from the request, so nobody can sign up as a mentor.

**Duplicate submissions**
- A duplicate means the **same student submitting the same repository twice**. Repository URLs are normalized before saving (lowercase, no `.git`, no trailing slash, no query string), so `https://GitHub.com/Name/Repo.git/` and `https://github.com/name/repo` count as the same.
- The database unique constraint is the real guard. The friendly 409 check only gives a clearer message, and a race between two identical requests is still rejected by the constraint.
- Only `github.com/<owner>/<repo>` URLs are accepted for the repository. Live links must be public `http(s)` URLs (no `localhost`, private IP ranges, or embedded credentials).

**Rate limiting**
- 5 project submissions per 10 minutes per logged-in user.
- 10 login or signup attempts per 15 minutes per IP address.
- The limiter keeps its counters in memory, so they reset when the server restarts and are not shared across multiple server instances. A shared store such as Redis would be the next step for a scaled deployment.

**Reviewing**
- Only `PENDING` submissions can be reviewed, and a decision is final in this version (a second attempt returns 409).
- The review update only matches rows that are still `PENDING`, so two mentors acting at the same moment cannot both succeed.
- The mentor's role is checked against the **database** at review time, not only in the token. Reads trust the signed token for speed, while this sensitive write re-checks the source of truth.
- Feedback is optional. When a comment is written it is stored as a `Feedback` record.

**Authentication**
- Access token: 1 hour. Refresh token: 7 days. Both are `httpOnly` cookies.
- The Next.js server logs in through server actions and stores the cookies on the frontend's own domain. Calls to the API go through `serverFetch`, which attaches the token. `proxy.ts` verifies the token on each navigation and silently refreshes it when it has expired.
- Wrong credentials return the same status and message whether the email exists or not, so account existence is not revealed.
- Route protection on the frontend is for user experience. **Every API request is authorized again by the backend**, so the frontend secret is only used to decide where to redirect.

**Frontend data flow**
- Pages are server-first (Next.js App Router with Cache Components). Anything that reads cookies or search params sits inside `<Suspense>` with matching skeletons.
- The mentor dashboard uses TanStack Query with server actions as fetchers, `keepPreviousData` while paging, and cache invalidation after every review.

---

## Security Notes

- Passwords are hashed with bcrypt and never returned by the API.
- Tokens are `httpOnly` cookies, so JavaScript on the page cannot read them.
- All inputs are validated with Zod. Unknown fields (for example a `role` or `status` sent by a client) are stripped.
- `helmet` and a CORS allow-list (`FRONTEND_URL`) protect the API.
- Secrets live in `.env` files that are not committed. Only `.env.example` files are in the repository.

---

## Deployment Notes

Suggested setup: PostgreSQL on Neon (or any managed Postgres), backend on Render or Railway, frontend on Vercel.

- Backend: set every variable from the table above, with `NODE_ENV=production` and `FRONTEND_URL` set to the deployed frontend origin. Run `npx prisma migrate deploy` as part of the release step. Behind a proxy, enable `app.set("trust proxy", 1)` so rate limiting sees real client IPs.
- Frontend: set `NEXT_PUBLIC_BASE_API_URL` to the deployed API URL, and `JWT_ACCESS_SECRET` to the same value as the backend.
- After deploying, fill in the URLs in the **Live Demo** section above.

---

## Troubleshooting

| Problem | Likely cause |
|---|---|
| Every login redirects back to `/login` | `JWT_ACCESS_SECRET` differs between `backend/.env` and `frontend/.env.local` |
| `PrismaClient` import errors | Run `npx prisma generate` in `backend/` |
| CORS or "cookie not set" errors | `FRONTEND_URL` in the backend must exactly match the frontend origin (`http://localhost:3000`) |
| Cannot connect to the database | Check `DATABASE_URL`, and that the database exists and PostgreSQL is running |
| Mentor cannot log in | Check `ADMIN_EMAIL` / `ADMIN_PASSWORD`, then restart the backend so the seed runs |
| Port already in use | Change `PORT` in `backend/.env` (and the API URL in the frontend env file) |

---

## Scripts

**Backend** (`backend/`)

| Command | Description |
|---|---|
| `npm run dev` | Start the API in watch mode |
| `npm run start` | Start the API |
| `npm run typecheck` | Type-check without emitting |
| `npx prisma migrate dev` | Create and apply a migration during development |
| `npx prisma migrate deploy` | Apply existing migrations |
| `npx prisma studio` | Browse the database |

**Frontend** (`frontend/`)

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Lint |

---

## Video Lessons

Two short Bengali video lessons accompany this project:

| Category | Topic | Link |
|---|---|---|
| Theoretical | 1C: Authentication vs. Authorization (RBAC) | `https://drive.google.com/file/d/1_ksIfFW_eh6PbC_6lIm2e4EmKM8p__Df/view?usp=sharing` |
| Hands-on coding | 2A: Securing a Route | `https://drive.google.com/file/d/1powujFWvcvTbJJUfTBdiLz36VdnnQFCn/view?usp=sharing` |
