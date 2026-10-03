# Dynamic Wedding Invitation Platform

A modern digital wedding invitation platform built with the **Eventify Stack**:
- **Frontend**: Vue 3 (Vite + TypeScript + Vue Router)
- **Backend**: Express + TypeScript
- **Runtime / Deployment**: Cloudflare Workers (`wrangler`)
- **Database & ORM**: Neon PostgreSQL + Drizzle ORM
- **Authentication**: Better Auth (Google OAuth)

---

## Project Structure

```text
Wedding/
├── client/                     # Vue 3 Frontend (Vite + TS)
│   ├── src/
│   │   ├── components/         # UI & Invitation widgets
│   │   ├── pages/
│   │   │   ├── Dashboard.vue   # Organizer dashboard
│   │   │   ├── WeddingEditor.vue # Wedding details & events editor
│   │   │   └── Invitation.vue  # Public invitation experience (/w/:slug)
│   │   ├── router/             # Vue Router configuration
│   │   ├── App.vue
│   │   └── main.ts
│   ├── package.json
│   └── vite.config.ts          # Configured with proxy to Express backend
│
├── server/                     # Express Backend (TypeScript)
│   ├── src/
│   │   ├── db/
│   │   │   ├── schema.ts       # Drizzle schema (weddings, events, memories, gallery, auth)
│   │   │   └── index.ts        # Neon database client
│   │   ├── routes/
│   │   │   ├── public.ts       # GET /api/public/weddings/:slug
│   │   │   ├── weddings.ts     # /api/weddings CRUD
│   │   │   ├── events.ts       # /api/events CRUD
│   │   │   ├── memories.ts     # /api/memories CRUD
│   │   │   └── gallery.ts      # /api/gallery CRUD
│   │   ├── middleware/
│   │   │   └── auth.ts         # Better Auth session guard
│   │   ├── auth.ts             # Better Auth configuration
│   │   ├── app.ts              # Express app setup
│   │   ├── index.ts            # Local development entrypoint
│   │   └── worker.ts           # Cloudflare Workers adapter
│   ├── drizzle.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── wrangler.toml               # Cloudflare Workers configuration
├── .env.example                # Environment variables template
├── package.json                # Monorepo orchestration scripts
└── README.md
```

---

## 🚀 Getting Started Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your `DATABASE_URL` (Neon PostgreSQL) and Google OAuth keys.

### 3. Run Development Servers
To run both backend Express server and Vue frontend simultaneously:
```bash
npm run dev
```

Or individually:
```bash
# Terminal 1: Backend (Express on http://localhost:5000)
npm run dev:server

# Terminal 2: Frontend (Vite on http://localhost:5173)
npm run dev:client
```

### 4. Build & Cloudflare Workers
```bash
# Build both frontend and backend
npm run build

# Cloudflare Workers local preview
npm run cf:dev

# Deploy to Cloudflare Workers
npm run cf:deploy
```
