# Spur Live Chat

**An AI-powered customer support chatbot** – full-stack TypeScript demo with Express backend, React/Vite frontend, and optional OpenAI integration.

Perfect for learning how to build:
- Real-time chat interfaces with session persistence
- OpenAI API integration with graceful fallbacks
- Full-stack TypeScript applications
- Local-first development workflows

## Features

- 🤖 AI-powered responses (OpenAI) with fallback support
- 💾 Automatic conversation persistence (JSON store)
- ⚡ Real-time chat UI with Vite
- 📱 Responsive design
- 🔧 Easy local setup with npm

## Quick Start

**Prerequisites:** Node.js 18+

```bash
# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Configure (optional OpenAI key)
cd backend
cp .env.example .env
# Edit .env and add OPENAI_API_KEY if desired

# Run both servers
npm --prefix backend run dev
npm --prefix frontend run dev
```

Open `http://localhost:4173` in your browser.

## How It Works

- **Backend** (`Express + TypeScript`): REST API for chat sessions and messages, with optional OpenAI replies
- **Frontend** (`React + Vite`): Chat UI with session persistence via localStorage
- **Storage** (`JSON`): Simple file-based store; easily swap for SQLite or PostgreSQL

## Environment

- `OPENAI_API_KEY` (backend) – enable AI replies; fallback responses work without it
- `VITE_API_BASE_URL` (frontend) – backend URL (defaults to `http://localhost:4000`)

## Troubleshooting

- **Fallback mode?** Add `OPENAI_API_KEY` to `backend/.env` and restart
- **Port conflict?** Change `PORT` in `backend/.env` (default: 4000)
- **Dependencies?** Ensure Node 18+ with `node --version`

## Next Steps

- Upgrade to SQLite/PostgreSQL
- Add multi-conversation UI and search
- Implement authentication & user profiles
- Fine-tune prompts or add FAQ retrieval
- Deploy with Docker

---

**License:** MIT
