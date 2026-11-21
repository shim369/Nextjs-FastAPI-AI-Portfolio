# Nextjs-FastAPI-AI-Portfolio

English | [日本語](README.ja.md)

The portfolio site of Shinpei Ohtani. One page brings together his background, skills, projects, Jamstack builds, blog and how the site works, and an AI chat on the page answers questions about his career.

**Site: https://nextjs-fastapi-ai-portfolio.vercel.app**

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
| Jamstack | A black-lacquer band comparing five microCMS sites built with different frameworks, switched with View Transitions |
| Blog | The latest three posts from the TECH BLOG (fetched from microCMS, ISR) |
| Architecture | Diagram and design notes for this site |
| Contact | Contact form protected by reCAPTCHA v3 |

### Jamstack sites

All five use the same microCMS (`blogs` endpoint), so you can compare how a content update reaches each site.

| Site | Framework | Delivery | Repository |
|---|---|---|---|
| NUXT BASE | Nuxt 4 | SSR | [Nuxtjs-TypeScript-Gsap-MicroCMS-Site](https://github.com/shim369/Nuxtjs-TypeScript-Gsap-MicroCMS-Site) |
| ASTRO BASE | Astro 7 | SSG | [Astro-MicroCMS-Site](https://github.com/shim369/Astro-MicroCMS-Site) |
| SVELTE BASE | SvelteKit 3 | SSG | [SvelteKit-TypeScript-MicroCMS-Site](https://github.com/shim369/SvelteKit-TypeScript-MicroCMS-Site) |
| NEXT BASE | Next.js 16 | ISR (webhook revalidation) | [Nextjs-TypeScript-MicroCMS-Site](https://github.com/shim369/Nextjs-TypeScript-MicroCMS-Site) |
| GATSBY BASE | Gatsby 5 | SSG | [Gatsby-TypeScript-Threejs-MicroCMS-Site](https://github.com/shim369/Gatsby-TypeScript-Threejs-MicroCMS-Site) |

The list and copy live in `JAMSTACK` in `frontend/lib/config.ts`, the screenshots (each demo's first view) in `frontend/public/images/jamstack/`, and the AI chat data in `backend/app/data/profile.json`. Keep all three in sync when a site changes.

### Shared UI

The page also has a vertical side nav (a bottom bar on phones), a top bar with the Tokyo time and language switch, a ⌘K / Ctrl+K palette for asking the AI or jumping to a section, and an AI chat panel that slides in from the right. Japanese and English are supported; Japanese is the default.

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
├─ .vercelignore          # keeps .env files and design references out of CLI uploads
├─ .github/workflows/     # CI (backend: Ruff, Mypy, pytest / frontend: lint, type check, build)
├─ backend/               # FastAPI: app/ (agent.py, llm.py, tools.py, blog.py, contact.py …) and tests/
│                         #   app/data/profile.json … career data the AI chat answers from
└─ frontend/              # Next.js: app/, components/ (chrome / sections / svg), lib/, styles/ (SCSS partials)
                          #   lib/config.ts … page data, lib/messages.ts … Japanese / English copy
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
cp .env.example .env.local  # fill in the values (.env also works)
npm install
npm run dev
```

Checks:

```bash
cd backend  && uv run ruff check . && uv run mypy && uv run pytest
cd frontend && npm run lint && npm run typecheck && npm run build
```

## Environment variables

Never put the values in code or commits. Use `backend/.env` and `frontend/.env.local` (or `frontend/.env`) locally and Vercel's Environment Variables in production (`.env.example` lists the names only).

- The backend does not read `.env` by itself, so start it with `uv run --env-file .env`.
- Do not put spaces in values (write a Gmail app password without its spaces). A space stops the whole `.env` from loading.
- The two microCMS values are used by both the Blog section (frontend) and the chat tool (backend), so locally they go in both `.env` files. On Vercel, one setting is read by both.

| Variable | Used by | Required | Purpose |
|---|---|---|---|
| `GEMINI_API_KEY` | backend | yes | Gemini API key (AI chat) |
| `GEMINI_MODEL` | backend | | Model name (default in `app/config.py`) |
| `CONTACT_TO_EMAIL` / `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | backend | yes | Contact form recipient and SMTP (use an app password for Gmail) |
| `RECAPTCHA_SECRET_KEY` | backend | yes | reCAPTCHA v3 secret (verification is skipped when empty) |
| `MICROCMS_SERVICE_DOMAIN` / `MICROCMS_API_KEY` | frontend, backend | yes | TECH BLOG's microCMS (Blog section and the chat's `get_blog_posts`). Use a key with GET access only |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | frontend | yes | reCAPTCHA v3 site key, from the same key pair as `RECAPTCHA_SECRET_KEY` (falls back to the default in `lib/config.ts`). It is embedded at build time, so set it on Vercel too and redeploy after changing it |
| `NEXT_PUBLIC_SITE_URL` | frontend | | Production URL (OGP and canonical) |

See `backend/.env.example` for rate limits, timeouts and other tuning values.

## Deploying to Vercel

1. Import this repository in Vercel. The `services` in the root `vercel.json` build frontend and backend as two services.
2. Set the environment variables above for Production (and Preview).
3. In the reCAPTCHA admin console, make sure the key type is **v3**, and add the production domain, `localhost` and `127.0.0.1` (the last two count as different domains).
4. With the Vercel GitHub integration, every push to `main` deploys to production. GitHub Actions (`.github/workflows/nextjs-fastapi-ai-portfolio.yml`) runs Ruff, Mypy and pytest for the backend, and lint, type check and build for the frontend.

## Notes

- **Jamstack screenshots**: on Vercel Services, Next.js image optimization (`/_next/image`) returns 404, so `next/image` uses `unoptimized` and serves pre-shrunk webp files as they are.
- **Design references**: the HTML design files go in `.local/`. `.gitignore` and `.vercelignore` exclude it, so it reaches neither GitHub nor Vercel.
- **Debugging the contact form**: the backend logs `contact_failed` with a reason code (e.g. `recaptcha_failed`, `browser-error`). Names, email addresses and messages are never logged.

The AI chat runs on the Gemini API free tier, so, as its terms require, it is not offered in the EEA, Switzerland or the UK (`backend/app/region.py`).
