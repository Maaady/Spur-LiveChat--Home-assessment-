# Spur Live Chat

Lightweight AI-powered support chat demo (TypeScript backend + React + Vite frontend).

This repository contains a simple local chat app that demonstrates:
- a small Express + TypeScript backend
- a React + Vite frontend
- basic persistence using a JSON store
- optional OpenAI integration (fallback responses included)

## Quick start (local)

Prerequisites
- Node.js 18+ and npm

1) Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

2) Configure environment

Copy and edit the backend env file:

```bash
cd backend
copy .env.example .env   # Windows PowerShell: Copy-Item .env.example .env
# then open backend/.env and set OPENAI_API_KEY (optional)
```

Notes:
- If `OPENAI_API_KEY` is not set, the backend will return safe fallback replies for common support questions.
- To enable full AI replies, set `OPENAI_API_KEY=sk-...` in `backend/.env`.

3) Run servers (separate terminals)

Backend (terminal A):
```powershell
cd backend
npm run dev
```

Frontend (terminal B):
```powershell
cd frontend
npm run dev
```

You can also run both from the workspace root:

```powershell
npm --prefix backend run dev
npm --prefix frontend run dev
```

The frontend Vite server prints the local URL (default: `http://localhost:4173`). The backend listens on `http://localhost:4000` by default.

## How it works (short)

- Backend: `backend/src/index.ts` exposes routes for session history and posting messages. `backend/src/llm.ts` handles OpenAI calls and now includes a small local fallback generator when the API key is missing. `backend/src/db.ts` persists messages to `backend/chat.json`.
- Frontend: `frontend/src/App.tsx` handles the chat UI, session persistence (localStorage), and API calls to the backend.

## Environment variables

- `backend/.env` (create from `.env.example`)
  - `OPENAI_API_KEY` — optional; set to get full OpenAI-powered replies.
- `frontend/.env` / `VITE_API_BASE_URL` — override backend URL if needed (defaults to `http://localhost:4000`).

## Troubleshooting

- If the frontend shows: "I’m running in fallback mode because OPENAI_API_KEY is not configured": add your key to `backend/.env` and restart the backend.
- If TypeScript reports deprecation warnings about `moduleResolution` or similar, ensure you are using Node-compatible `tsconfig` settings; the project includes configuration adjusted for NodeNext.
- If `EADDRINUSE` appears, stop the process using that port or change `PORT` in `backend/.env`.

## What you can change

- Swap the JSON store for a real database (SQLite, Postgres).
- Add authentication, conversation lists, or message search.
- Improve prompt engineering or add FAQ retrieval for more deterministic answers.

## License

This project is provided as-is for demonstration purposes.

---
If you want, I can commit this README and open a branch for you. Tell me if you'd like that.
*** End Patch
