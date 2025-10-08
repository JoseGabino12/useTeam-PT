# useTeam PT - Real-Time Collaborative Kanban Board

This repository contains the final deliverable for the technical challenge: a Trello-like Kanban board with real-time collaboration and backlog export using n8n. The codebase is split into two independent applications:

- `frontend/`: React + Vite + Zustand + Socket.io client.
- `backend/`: NestJS + MongoDB + Socket.io server + n8n integration.

## High-level architecture

- The frontend is rendered with Vite, handles drag & drop through `@dnd-kit`, and talks to the REST API plus the websocket layer.
- The backend exposes REST endpoints, Socket.io events, and orchestrates the backlog export workflow.
- MongoDB stores users, boards, columns, cards, and comments.
- n8n receives export requests and emails the resulting CSV file.

## Prerequisites

- Node.js >= 20.x (developed and tested with Node 20).
- pnpm >= 9 (lockfiles for both apps are checked in).
- MongoDB (Atlas or a local instance reachable by the backend).
- Docker (optional) to spin up n8n quickly.
- Free ports: 3000 (API + websockets), 5173 (frontend), 5678 (n8n).

## Environment variables

Use the root `.env.example` as a template and create service-specific `.env` files before running anything.

### Backend (`backend/.env`)

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/useTeamPT
MONGO_DB_NAME=useTeamPT
JWT_SECRET=replace_me
JWT_EXPIRES_IN=1h
N8N_WEBHOOK_URL=http://localhost:5678/webhook/export-backlog
```

- `MONGO_URI` can target an Atlas cluster; adjust TLS flags if required.
- `N8N_WEBHOOK_URL` must match the webhook exposed by your n8n workflow.

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:3000/api
```

- Update this value if the backend runs on a different host or port.

> Tip: copy `.env.example` into `backend/.env` and `frontend/.env`, then keep only the keys each service needs.

## Installing dependencies

Install packages for each app independently because they do not share `node_modules`:

```bash
cd backend
pnpm install

cd ../frontend
pnpm install
```

You can use npm or yarn if you prefer, but pnpm is recommended to stay aligned with the lockfiles.

## Running locally

1. Make sure MongoDB is reachable (local instance, Docker container, or Atlas).
2. **Backend (NestJS):**

   ```bash
   cd backend
   pnpm start:dev
   ```

   - REST API: `http://localhost:3000/api`
   - Websocket endpoint: `ws://localhost:3000`
   - Dev mode sets `NODE_OPTIONS=--openssl-legacy-provider` for backward compatibility with some dependencies.

3. **Frontend (React + Vite):**

   ```bash
   cd frontend
   pnpm dev
   ```

   - UI: `http://localhost:5173`

Run each service in its own terminal. Vite and Nest both reload automatically on source changes.

### Core user flows

- `POST /api/auth/register`: sign up new users (`{"name": "...", "email": "...", "password": "..."}`).
- `POST /api/auth/login`: returns a JWT plus user information.
- `GET /api/boards/:userId`: lists boards belonging to a user.
- `GET /api/boards/detail/:boardId`: fetches board detail including columns, cards, and comments.
- `POST /api/boards/:userId`: creates a board using `CreateBoardDto`.
- `POST /api/boards/add-member/:boardId/:userId`: adds a member with role `editor` or `viewer`.
- Socket.io events: clients should emit `joinBoard`, `cardCreated`, `cardMoved`, and `commentAdded` to broadcast changes in real time.

### Backlog export workflow

- Endpoint: `POST /api/export/backlog` with payload `{"boardId": "...", "email": "recipient@example.com"}`.
- The backend validates the board and triggers `N8N_WEBHOOK_URL` with `boardId` and `email`.
- Ensure the webhook responds with a 2xx status so the request is considered accepted.

## Automating exports with n8n

1. Launch n8n (Docker is the fastest path):

   ```bash
   docker run -it --rm \
     --name n8n \
     -p 5678:5678 \
     -v ~/.n8n:/home/node/.n8n \
     n8nio/n8n:latest
   ```

2. From the UI (`http://localhost:5678`), create or import a workflow that:
   - Exposes a webhook matching `N8N_WEBHOOK_URL`.
   - Calls the API (`GET /api/boards/detail/:boardId`) to gather board data.
   - Transforms the result into CSV (id, title, description, column, createdAt).
   - Emails the CSV to the requested recipient.
3. Export the workflow and store it inside `n8n/` if you want it versioned with the project.

If n8n runs behind HTTPS or a tunnel, update `N8N_WEBHOOK_URL` accordingly.

## Useful scripts

### Backend

- `pnpm start:dev`: development mode with hot reload.
- `pnpm start:prod`: runs the built application.
- `pnpm build`: compiles code into `dist/`.
- `pnpm test`, `pnpm test:watch`, `pnpm test:cov`: unit tests.
- `pnpm lint`: runs ESLint.
- `pnpm format`: applies Prettier.

### Frontend

- `pnpm dev`: development server.
- `pnpm build`: production build in `dist/`.
- `pnpm preview`: serve the production build locally.
- `pnpm lint`: run ESLint.

## Repository structure

```
useTeam-PT/
├── backend/        # NestJS API and websocket gateway
├── frontend/       # React UI with Socket.io client
├── .env.example    # shared template for environment variables
└── n8n/            # optional workflows for the export feature
```

## Delivery checklist

- Confirm backend and frontend run without errors and real-time updates work end-to-end.
- Trigger `/api/export/backlog` to validate the n8n integration.
- Update this README if you change setup or execution steps.
- Invite the reviewers provided by the challenge once everything is ready, then avoid further commits.
