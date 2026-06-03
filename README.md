# Spur Live Chat

A lightweight AI-powered support chat demo built with TypeScript (backend) and React + Vite (frontend).

## Overview

This project demonstrates a simple local chat application featuring:
- **Backend**: Express server with TypeScript
- **Frontend**: React application with Vite
- **Data Persistence**: JSON-based storage
- **AI Integration**: Optional OpenAI integration with built-in fallback responses

## Prerequisites

- Node.js 18+
- npm

## Quick Start

### 1. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment

Create and configure the backend environment file:

```bash
cd backend
cp .env.example .env  # or: Copy-Item .env.example .env (Windows PowerShell)
```

Then edit `backend/.env` and set your OpenAI API key (optional):
```
OPENAI_API_KEY=sk-...
```

**Note**: If `OPENAI_API_KEY` is not set, the backend will use safe fallback responses for common support questions.

### 3. Run the Application

Open two terminal windows and run:

**Terminal 1 (Backend)**:
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend)**:
```bash
cd frontend
npm run dev
```

Alternatively, run both from the workspace root:
```bash
npm --prefix backend run dev
npm --prefix frontend run dev
```

The frontend will be available at `http://localhost:4173` and the backend API at `http://localhost:4000`.

## How It Works

### Backend
- `backend/src/index.ts`: Exposes REST API routes for session history and message posting
- `backend/src/llm.ts`: Handles OpenAI API calls with a local fallback generator when no API key is configured

### Frontend
- `frontend/src/App.tsx`: Chat UI, local storage session persistence, and API integration

## Environment Variables

| Variable | Location | Purpose |
|----------|----------|---------|
| `OPENAI_API_KEY` | `backend/.env` | Optional; enables full OpenAI-powered responses |
| `VITE_API_BASE_URL` | `frontend/.env` | Override backend URL (defaults to `http://localhost:4000`) |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "I'm running in fallback mode..." message | Add your OpenAI API key to `backend/.env` and restart the backend |
| `EADDRINUSE` port error | Stop the process using that port or change `PORT` in `backend/.env` |
| Dependencies fail to install | Verify Node.js 18+ is installed and run `npm install` again in both directories |
| TypeScript warnings about `moduleResolution` | Project uses NodeNext configuration; ensure your tsconfig is compatible |

## Future Enhancements

- Replace JSON store with a real database (SQLite, Postgres, MongoDB)
- Add user authentication and authorization
- Implement conversation lists and message search
- Enhance prompt engineering or add FAQ retrieval for more consistent answers
- Add Docker support for easier deployment

## License

MIT - This project is provided as-is for demonstration purposes.
