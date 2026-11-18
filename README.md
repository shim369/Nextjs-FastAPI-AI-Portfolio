# Nextjs-FastAPI-AI-Portfolio

English | [日本語](README.ja.md)

The portfolio site of Shinpei Ohtani. One page brings together his background, skills, projects, Jamstack builds, blog and how the site works, and an AI chat on the page answers questions about his career.

- Frontend: Next.js (App Router, TypeScript), a single page themed on Japanese typesetting
- API: FastAPI (Python) for the AI chat (a hand-written agent loop with Gemini function calling) and the contact form
- Hosting: one Vercel project running two services, frontend and backend
- The AI chat and contact form are carried over from [Python-AI-Chat-Portfolio](https://github.com/shim369/Python-AI-Chat-Portfolio)

## Page sections

| Section | Contents |
|---|---|
| Hero | Signature, headline and a question bar for the AI, beside an ink plum branch that grows and blossoms; a band of three things I do |
| Skills | Python as the featured panel with "what I do with Python" (four areas; each opens a dialog of matching projects); the rest as a four-column "foundations" grid |
| Works | Three featured projects with a diagram, why I built them and what I worked on, followed by the other projects |
| Jamstack | A black-lacquer band comparing six microCMS sites built with different frameworks, switched with View Transitions |
| Blog | The latest three posts from the TECH BLOG (fetched from microCMS, ISR) |
| Architecture | Diagram and design notes for this site |
| Contact | Contact form protected by reCAPTCHA v3 |

Shared UI: a vertical side nav (a bottom bar on phones), a top bar with the Tokyo time and language switch, a ⌘K / Ctrl+K palette for asking the AI or jumping to a section, and an AI chat panel that slides in from the right. Japanese and English are supported; Japanese is the default.

## Architecture

```
Browser
  │
  ▼
Vercel (one project)
  ├─ /api/*  → backend service (FastAPI, backend/app/main.py)
  │             ├─ POST /api/chat     … agent loop ⇄ Gemini API
  │             │                       tools: profile.json / blog (microCMS)
  │             ├─ POST /api/contact  … verify reCAPTCHA v3 → send via SMTP
  │             └─ GET  /api/health
  └─ /*      → frontend service (Next.js, frontend/)
                └─ Blog section: fetches microCMS (blogs) on the server, served with ISR (60s)
```

```
.
├─ vercel.json            # services (frontend / backend) and rewrites (/api/* → backend)
├─ backend/               # FastAPI: app/ (agent.py, llm.py, tools.py, blog.py, contact.py …) and tests/
└─ frontend/              # Next.js: app/, components/ (chrome / sections / svg), lib/, styles/ (SCSS partials)
```

## Running locally

Requirements: [uv](https://docs.astral.sh/uv/) (it provides Python 3.14) and Node.js 24.

```bash
# 1. backend (http://127.0.0.1:8000)
cd backend
cp .env.example .env        # fill in the values (see "Environment variables")
uv sync
uv run --env-file .env uvicorn app.main:app --reload --port 8000

# 2. frontend (http://127.0.0.1:3000). In development, /api/* is proxied to FastAPI on port 8000
cd frontend
cp .env.example .env.local  # fill in the values
npm install
npm run dev
```

Checks:

```bash
cd backend  && uv run ruff check . && uv run mypy && uv run pytest
cd frontend && npm run lint && npm run typecheck && npm run build
```

## Environment variables

Never put the values in code or commits. Use `backend/.env` and `frontend/.env.local` locally and Vercel's Environment Variables in production (`.env.example` lists the names only). The backend does not read `.env` by itself, so start it with `uv run --env-file .env`. Do not put spaces in values (write a Gmail app password without its spaces).

| Variable | Used by | Required | Purpose |
|---|---|---|---|
| `GEMINI_API_KEY` | backend | yes | Gemini API key (AI chat) |
| `GEMINI_MODEL` | backend | | Model name (default in `app/config.py`) |
| `CONTACT_TO_EMAIL` / `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | backend | yes | Contact form recipient and SMTP (use an app password for Gmail) |
| `RECAPTCHA_SECRET_KEY` | backend | yes | reCAPTCHA v3 secret (verification is skipped when empty) |
| `MICROCMS_SERVICE_DOMAIN` / `MICROCMS_API_KEY` | frontend, backend | yes | TECH BLOG's microCMS (Blog section and the chat's `get_blog_posts`). Use a key with GET access only |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | frontend | | reCAPTCHA v3 site key (falls back to the default in `lib/config.ts`) |
| `NEXT_PUBLIC_SITE_URL` | frontend | | Production URL (OGP and canonical) |

See `backend/.env.example` for rate limits, timeouts and other tuning values.

## Deploying to Vercel

1. Import this repository in Vercel. The `services` in the root `vercel.json` build frontend and backend as two services.
2. Set the environment variables above for Production (and Preview).
3. Add the production domain to the site key in the reCAPTCHA admin console.
4. Pushing to `main` deploys the site. GitHub Actions (`.github/workflows/nextjs-fastapi-ai-portfolio.yml`) runs Ruff, Mypy and pytest for the backend, and lint, type check and build for the frontend.

The AI chat runs on the Gemini API free tier, so, as its terms require, it is not offered in the EEA, Switzerland or the UK (`backend/app/region.py`).
