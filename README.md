# Spur-LiveChat--Home-assessment
A small AI-powered support chat demo with a TypeScript backend and React frontend.

## Local setup

### Backend
1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env`
4. Set `OPENAI_API_KEY` in `.env`
5. `npm run dev`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`
4. Open the Vite app URL printed by the frontend server.

## Environment variables

- `backend/.env.example`
  - `OPENAI_API_KEY=your_openai_api_key_here`
- `frontend/.env.example`
  - `VITE_API_BASE_URL=http://localhost:4000`

## Database

The backend uses a simple JSON-backed store at `backend/chat.json`.
The data layer is persisted automatically on startup and supports conversations with multiple messages.

## Architecture overview

- `backend/`
  - `src/index.ts`: Express server and chat routes.
  - `src/db.ts`: SQLite persistence layer for conversations and messages.
  - `src/llm.ts`: OpenAI integration and reply generation.
- `frontend/`
  - `src/main.tsx`: React application entrypoint.
  - `src/App.tsx`: chat UI, history loading, and session persistence.
  - `src/styles.css`: chat styling and responsive layout.

## LLM notes

- Provider: OpenAI
- Prompt: the AI acts as a friendly support agent for a fictional e-commerce store with a 30-day return policy, 3-5 day shipping, and support hours Monday–Friday, 9am–6pm.
- History: the backend includes recent conversation history so the conversation stays contextual.
- Cost controls: `max_tokens` is capped at 250 and the temperature is set to 0.5.

## Trade-offs / If I had more time

- Add typed request validation with `zod`.
- Add a conversation list and message search.
- Add a deployment-ready Docker configuration.
- Improve prompt engineering and FAQ retrieval.
