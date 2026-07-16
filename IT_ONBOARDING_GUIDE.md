# Desire Lab — IT Onboarding Guide

| Field | Value |
|---|---|
| **Document purpose** | Guide Unilever IT/infrastructure teams in adopting, hosting, securing, and scaling this application |
| **Repository package** | `desire-lab` (npm) |
| **Application version** | `0.6.0` (from `package.json`) |
| **Primary audience** | Unilever IT, DevOps, security, and platform owners |
| **Related product docs** | `docs/PRD.md`, `docs/AGENT_GUIDE.md`, `docs/VERSION_HISTORY.md`, `docs/ROLLBACK.md` |
| **Document generated from** | Repository scan of source, config, schema, and scripts — claims below are evidenced in-repo unless marked **Not yet implemented** |

---

## 1. Executive Summary

**Desire Lab** is an internal Unilever web platform for discovering R&D / packaging digital tools, requesting training, and asking an AI assistant grounded in the tool catalog. It evolved from the “AI Hub Digital Tools Repository” / “AI Hub Tool Guide” concept described in `docs/PRD.md`.

| Dimension | Current state (evidenced) |
|---|---|
| **Who it is for** | Internal Unilever employees (Head Office / India hubs — Mumbai and Bangalore per `src/lib/content/desire-lab.ts`); admins manage catalog and bookings via `/admin` |
| **What it does** | Lab navigation (Packaging Lab phases/stages/tools), tool detail pages, training booking requests, admin CMS (tools/categories/bookings), floating chatbot with RAG over catalog |
| **Architecture style** | Single **Next.js full-stack monolith** (UI + API routes + Server Actions in one deployable app) |
| **Data** | **PostgreSQL** via **Prisma ORM**; optional graceful fallbacks when DB URL is unset |
| **Auth today** | **Admin-only** shared password + HTTP-only cookie; **no end-user SSO**; public catalog/chat/booking are unauthenticated |
| **Hosting today** | Prototype/MVP on **Vercel**; Postgres historically via **Supabase** (Vercel env integration documented in `.env.example`); local Postgres via `docker-compose.yml` |
| **Maturity** | **MVP / production-prototype** — version `0.6.0`; PRD and roadmap still list Azure AD SSO and Unilever Azure production deploy as future (Phase 5 / v1.0) |

**Out of scope today (Not yet implemented):** Microsoft Entra ID (Azure AD) SSO for employees or admins; Microsoft Graph calendar; ServiceNow / license provisioning; application Dockerfile; corporate CI/CD pipelines in-repo; dedicated microservice per tool.

---

## 2. Tech Stack Overview

Versions are taken from `package.json` (exact pins where present; caret ranges shown as declared).

| Technology | Version (declared) | Purpose |
|---|---|---|
| **Next.js** | `16.2.0` | App Router framework — pages, API routes, middleware, production server |
| **React** / **React DOM** | `19.2.4` | UI library |
| **TypeScript** | `^5` (dev) | Typed application code |
| **Node.js** | LTS expected (not pinned in repo) | Runtime for `next dev` / `next start` / build |
| **Tailwind CSS** | `^4` (dev) | Utility CSS |
| **`@tailwindcss/postcss`** | `^4` (dev) | PostCSS integration for Tailwind 4 |
| **Prisma** / **`@prisma/client`** | `^7.5.0` | ORM, migrations, client generation |
| **`@prisma/adapter-pg`** | `^7.5.0` | Prisma driver adapter for `pg` |
| **`pg`** | `^8.20.0` | PostgreSQL connection pool |
| **Zod** | `^4.3.6` | Request/form validation |
| **Resend** | `^6.14.0` | Transactional email for training booking notifications |
| **GSAP** | `^3.15.0` | Front-end animation |
| **lucide-react** | `^0.577.0` | Icons |
| **clsx** / **tailwind-merge** | `^2.1.1` / `^3.5.0` | Class name utilities |
| **ESLint** + **eslint-config-next** | `^9` / `16.2.0` | Linting |
| **tsx** | `^4.19.3` (dev) | Run Prisma seed (`prisma/seed.ts`) |
| **dotenv** | `^16.4.7` (dev) | Load `.env` / `.env.local` for Prisma config |
| **PostgreSQL** | `16-alpine` (Docker image in `docker-compose.yml`) | Primary database |
| **npm** | Lockfile present (`package-lock.json`) | Package manager (not Yarn/pnpm) |

### External services called by the app

| Service | How used | Configuration |
|---|---|---|
| **PostgreSQL** (local Docker or hosted e.g. Supabase) | Persist categories, tools, training docs, bookings | `POSTGRES_PRISMA_URL` / `DATABASE_URL` / `POSTGRES_URL` (+ non-pooling URL for migrations) |
| **Groq** (`https://api.groq.com/openai/v1`) | Chat completions + optional embeddings (prototype LLM) | `GROQ_API_KEY`, `GROQ_MODEL`, `GROQ_EMBEDDING_MODEL`, `LLM_PROVIDER` |
| **Azure OpenAI** | Production-target LLM + embeddings (when configured) | `AZURE_OPENAI_*` vars; `LLM_PROVIDER=azure` |
| **Resend** | Email POC on new booking | `RESEND_API_KEY`, `RESEND_FROM_EMAIL` |
| **SharePoint** (URL links only) | Training materials deep links | `NEXT_PUBLIC_SHAREPOINT_TRAINING_BASE` (optional; code has Unilever SharePoint default path) |
| **Active Workspace** (URL link only) | Specifications section CTA | `NEXT_PUBLIC_ACTIVE_WORKSPACE_URL` / `ACTIVE_WORKSPACE_URL` |

**Not present in repo:** Redis, Elasticsearch, Kafka, separate Nest/Express service, Kubernetes manifests, Terraform, GitHub Actions workflows, application `Dockerfile`.

---

## 3. Architecture & Folder Structure

### 3.1 Runtime architecture (current)

```
Browser
  │
  ├─ Next.js pages (SSR/RSC) ──► Prisma ──► PostgreSQL
  │
  ├─ POST /api/bookings ───────► Prisma + Resend
  │
  ├─ POST /api/chat ───────────► RAG (DB/static tool text) ──► Groq or Azure OpenAI
  │                              (or keyword fallback if LLM unset)
  │
  └─ /admin/* ── middleware cookie check ──► Server Actions (CMS)
```

- **One process / one deployable:** Next.js serves UI and APIs.
- **Middleware** (`src/middleware.ts`) protects `/admin` routes only (except `/admin/login`).
- **Server Actions** under `src/lib/actions/*` mutate tools, categories, bookings, and admin session.
- **Static/content modules** under `src/lib/content/*` define Packaging Lab phases, stages, and several tool definitions used by UI/RAG alongside DB records.

### 3.2 Annotated repository tree

```
RND/                          # Repository root (Desire Lab)
├── package.json              # Scripts, dependencies, version 0.6.0
├── package-lock.json         # npm lockfile
├── next.config.ts            # Next.js config (Turbopack root)
├── tsconfig.json             # TypeScript (path alias @/* → src/*)
├── postcss.config.mjs        # PostCSS / Tailwind
├── eslint.config.mjs         # ESLint
├── prisma.config.ts          # Prisma 7 config + DB URL resolution
├── docker-compose.yml        # Local PostgreSQL 16 only (not the app)
├── .env.example              # Documented env var names (no secrets)
├── docs/                     # Product/engineering docs (PRD, design, rollback)
├── prisma/
│   ├── schema.prisma         # Data model
│   ├── seed.ts               # Seed categories/tools
│   └── migrations/           # SQL migrations
├── public/                   # Static assets (logos, lab background images)
├── scripts/                  # Optional Python helper for logo position extraction
└── src/
    ├── middleware.ts         # Admin session gate
    ├── app/                  # Next.js App Router
    │   ├── page.tsx          # Home / lab entry
    │   ├── about/            # About / hub transition
    │   ├── ai-hub/           # Legacy hub route
    │   ├── tools/[slug]/    # Tool detail by slug
    │   ├── labs/             # Lab hubs (pack-lab, formulation, consumer, science)
    │   ├── admin/            # CMS (login, tools, categories, bookings)
    │   └── api/
    │       ├── chat/route.ts
    │       └── bookings/route.ts
    ├── components/           # UI (layout, catalog, labs, chat, booking, admin)
    └── lib/
        ├── db.ts / env.ts / pg-adapter.ts   # DB connectivity
        ├── auth/             # Admin cookie/HMAC helpers
        ├── actions/          # Server Actions
        ├── validations/      # Zod schemas
        ├── llm/              # Groq / Azure OpenAI provider layer
        ├── rag.ts            # Retrieval for chatbot
        ├── email.ts          # Resend booking mail
        ├── tools.ts          # Tool queries + fallbacks
        └── content/          # Lab/structure/content constants
```

### 3.3 Database models (Prisma)

| Model | Role |
|---|---|
| **Category** | Tool grouping; `lab` enum `PACK` \| `FORMULATION` |
| **Tool** | Catalog entry (slug, purpose, description, POC, URL, tags, status) |
| **TrainingDoc** | Per-tool training resource links |
| **Booking** | Training session requests + status workflow |

Enums: `ToolStatus` (ACTIVE / BETA / DEPRECATED), `BookingStatus` (PENDING / CONTACTED / COMPLETED / CANCELLED), `TrainingDocType`, `LabType`.

Indexes exist on `Tool.categoryId`, `Tool.status`, `Booking.toolId`, `Booking.status`.

---

## 4. Data Flow & API Structure

### 4.1 How requests move

| Path | Flow |
|---|---|
| **Public pages** | Browser → Next.js Server Components → Prisma (if configured) and/or static content modules → HTML |
| **Training booking** | Client form → `POST /api/bookings` → validate (Zod) → create `Booking` → email POC via Resend (or log to console if key missing) |
| **Chatbot** | Client widget → `POST /api/chat` → retrieve catalog chunks (`rag.ts`) → Groq/Azure stream or JSON; if LLM not configured → keyword **fallback** answer |
| **Admin CMS** | Browser → middleware checks `admin_session` cookie → Server Actions write via Prisma |

### 4.2 HTTP API routes (only routes found)

#### `POST /api/bookings`

| Item | Detail |
|---|---|
| **Purpose** | Create a training booking and notify tool POC |
| **Auth** | None (public) |
| **Request body** (Zod `bookingSchema`) | `toolId`, `requesterName`, `requesterEmail`, `preferredDate`, `preferredTime`, `durationMinutes` (`30` \| `60`), `subject`, optional `message` |
| **Success response** | `{ id, message: "Training request sent to POC" }` |
| **Errors** | `400` validation; `404` tool not found; `500` create failure |

#### `POST /api/chat`

| Item | Detail |
|---|---|
| **Purpose** | Answer questions about Packaging Lab / tools with citations |
| **Auth** | None (public) |
| **Request body** (Zod `chatRequestSchema`) | `message` (max 2000), optional `history` (max 10 messages, each content max 4000) |
| **Accept header** | `text/event-stream` → SSE (`citations`, `token`, `done`, `error` events); otherwise JSON |
| **JSON success** | `{ answer, citations, mode, notice }` where `mode` is LLM provider name or `"fallback"` |
| **Errors** | `400` validation; `500` processing failure |

**Note:** Older docs (`docs/AGENT_GUIDE.md`) mention `api/tools` routes; **those routes are not present** in the current `src/app/api` tree. Catalog mutations go through **Server Actions**, not REST.

### 4.3 Server Actions (admin / CMS)

| Module | Actions (names) | Purpose |
|---|---|---|
| `src/lib/actions/auth.ts` | `loginAction`, `logoutAction` | Admin password login / clear session |
| `src/lib/actions/tools.ts` | `createToolAction`, `updateToolAction`, `deprecateToolAction` | Tool CMS |
| `src/lib/actions/categories.ts` | `createCategoryAction`, `updateCategoryAction`, `deleteCategoryAction` | Category CMS |
| `src/lib/actions/bookings.ts` | `updateBookingStatusAction` | Booking inbox status updates |

### 4.4 Key page routes (App Router)

| Route pattern | Purpose |
|---|---|
| `/` | Desire Lab home |
| `/about` | About / hub messaging |
| `/ai-hub` | Legacy AI Hub entry |
| `/tools/[slug]` | Tool detail |
| `/labs/pack-lab`, `/labs/pack-lab/[section]`, `/labs/pack-lab/[section]/[tool]` | Packaging Lab hub, stages, tools |
| `/labs/pack-lab/workflow`, `/labs/pack-lab/specifications` | Workflow CTA / specifications |
| `/labs/formulation-lab` | Formulation placeholder |
| `/labs/consumer-focused/...`, `/labs/science-focused/...` | Additional lab shells |
| `/admin/login`, `/admin/tools`, `/admin/categories`, `/admin/bookings` | CMS |

---

## 5. Authentication & Access Control

### 5.1 Current state (implemented)

| Area | Status |
|---|---|
| **End-user login / SSO** | **Not yet implemented** — catalog, chat, and booking are publicly reachable at the application layer |
| **Admin authentication** | Shared secret `ADMIN_PASSWORD`; successful login sets HTTP-only cookie `admin_session` (HMAC-SHA256 token derived from password) |
| **Session lifetime** | Cookie `maxAge` = 7 days; `secure` in production; `sameSite: lax` |
| **Route protection** | Next.js middleware redirects unauthenticated `/admin/*` (except login) to `/admin/login` |
| **RBAC / roles** | **Not yet implemented** — single admin gate only (no role matrix, no per-lab permissions) |
| **API auth on `/api/chat` and `/api/bookings`** | **Not yet implemented** |

PRD explicitly defers **Microsoft Entra ID (Azure AD) SSO** to v1.0 / Phase 5.

### 5.2 What Unilever IT should plan to integrate

| Requirement | Guidance |
|---|---|
| **Employee access** | Place the app behind corporate network / reverse proxy / App Proxy **and/or** implement Entra ID OIDC/SAML at the app (or edge) so only authenticated Unilever identities reach pages and APIs |
| **Admin access** | Replace shared `ADMIN_PASSWORD` with Entra ID groups (e.g. Desire Lab Admins) mapped to app roles; retire shared password before wide production use |
| **Service accounts** | Prefer managed identity / Key Vault for Azure OpenAI and DB credentials rather than long-lived keys in plain env dashboards |
| **Chat / booking abuse** | Today unauthenticated; IT should require SSO or network restriction before exposing to broad intranet, plus rate limiting at edge/WAF |
| **Audit** | **Not yet implemented** in-app — plan SIEM logging of admin mutations and booking/chat traffic at infrastructure layer |

---

## 6. Environment & Configuration

### 6.1 How config is loaded

| Mechanism | Usage |
|---|---|
| **`.env.local` / `.env`** | Local development; Prisma config loads via `dotenv` in `prisma.config.ts` |
| **Runtime `process.env`** | Next.js server reads vars at runtime (and build-time for `NEXT_PUBLIC_*`) |
| **Vercel env pull** | `.env.example` documents `npx vercel env pull .env.local` for Supabase-linked vars |

**Never commit secret values.** Use corporate secret stores (Azure Key Vault, Vercel encrypted env, HashiCorp Vault, etc.).

### 6.2 Environment variables (names only)

#### Database

| Variable | Required for | Notes |
|---|---|---|
| `POSTGRES_PRISMA_URL` | App runtime DB (preferred on Vercel/Supabase) | Pooled URL typical |
| `POSTGRES_URL_NON_POOLING` | Migrations / seed | Direct connection |
| `DATABASE_URL` | Fallback | Used if Prisma/Postgres-specific names unset |
| `POSTGRES_URL` | Fallback | Same |

#### Admin

| Variable | Required for | Notes |
|---|---|---|
| `ADMIN_PASSWORD` | Admin CMS login | Shared secret — replace with SSO for production |

#### Email (Resend)

| Variable | Required for | Notes |
|---|---|---|
| `RESEND_API_KEY` | Sending booking emails | If unset, email body is logged server-side only |
| `RESEND_FROM_EMAIL` | From address | Optional; code has a default |

#### LLM / chatbot

| Variable | Required for | Notes |
|---|---|---|
| `LLM_PROVIDER` | Provider selection | `auto` \| `groq` \| `azure` \| `fallback` |
| `GROQ_API_KEY` | Groq chat/embeddings | Prototype path |
| `GROQ_MODEL` | Model name | Optional default in code |
| `GROQ_EMBEDDING_MODEL` | Embeddings model | Set to `off` to disable Groq embeddings |
| `AZURE_OPENAI_ENDPOINT` | Azure OpenAI | Production target |
| `AZURE_OPENAI_API_KEY` | Azure OpenAI | |
| `AZURE_OPENAI_DEPLOYMENT` | Chat deployment name | |
| `AZURE_OPENAI_EMBEDDING_DEPLOYMENT` | Embedding deployment | |
| `AZURE_OPENAI_API_VERSION` | API version | Optional; default `2024-08-01-preview` in code |

#### Content / integrations (URLs)

| Variable | Required for | Notes |
|---|---|---|
| `NEXT_PUBLIC_SHAREPOINT_TRAINING_BASE` | Override SharePoint training base URL | Optional |
| `NEXT_PUBLIC_ACTIVE_WORKSPACE_URL` | Specifications CTA | Optional |
| `ACTIVE_WORKSPACE_URL` | Same (server-side alias) | Optional |

#### Node / framework

| Variable | Notes |
|---|---|
| `NODE_ENV` | Set by Next/host (`production` enables secure admin cookie) |

### 6.3 Secrets management recommendations (corporate)

1. Store all `*_API_KEY`, `ADMIN_PASSWORD`, and DB URLs in an approved vault; inject at deploy time.
2. Prefer **Azure OpenAI** + private networking over public Groq for production R&D traffic.
3. Separate **non-pooling** migration credentials from runtime pooled URLs; limit who can run migrations.
4. Rotate `ADMIN_PASSWORD` immediately if SSO is not yet ready; restrict `/admin` by IP/VPN as interim control.
5. Treat `NEXT_PUBLIC_*` as **non-secret** (embedded in client bundles).

---

## 7. Local Setup & Deployment Instructions

### 7.1 Prerequisites

- **Node.js** LTS (compatible with Next.js 16)
- **npm** (lockfile is npm)
- **Docker** (optional but recommended for local Postgres via `docker-compose.yml`)
- Access to required env values (see §6)

### 7.2 Local install & run (as configured in repo)

```bash
# 1. Install dependencies (also runs prisma generate via postinstall)
npm install

# 2. Start local PostgreSQL (maps host 5433 → container 5432)
docker compose up -d

# 3. Create .env.local from .env.example and set at least:
#    DATABASE_URL or POSTGRES_PRISMA_URL / POSTGRES_URL_NON_POOLING
#    Example shape for docker-compose defaults (password is for local only):
#    postgresql://aihub:aihub@localhost:5433/aihub_tool_guide

# 4. Migrate + seed
npm run db:setup
# equivalents: npm run db:migrate && npm run db:seed

# 5. Development server
npm run dev

# 6. Production-like local run
npm run build
npm start
```

Useful scripts from `package.json`:

| Script | Command purpose |
|---|---|
| `dev` | `next dev` |
| `build` | `next build` |
| `start` | `next start` |
| `lint` | `eslint` |
| `db:migrate` | `prisma migrate dev` |
| `db:seed` | `prisma db seed` |
| `db:setup` | migrate + seed |
| `db:studio` | Prisma Studio |

Local Docker DB defaults (`docker-compose.yml`): user `aihub`, database `aihub_tool_guide`, port **5433** on host. Treat as **dev-only** credentials.

### 7.3 Current hosting / deployment (evidenced)

| Item | Evidence |
|---|---|
| **Host** | Vercel (documented in `.env.example`, `docs/*`, `docs/ROLLBACK.md`) |
| **App Dockerfile** | **Not yet implemented** |
| **`vercel.json`** | **Not present** in repo |
| **CI/CD workflows** (GitHub Actions etc.) | **Not present** in repo |
| **Rollback** | Documented via git tags + Vercel redeploy (`docs/ROLLBACK.md`) |

Typical prototype deploy pattern used by the project team (documented operationally, not as an in-repo pipeline):

1. Push to Git remote  
2. `npx vercel --prod` (or Git integration auto-deploy)  
3. Ensure production env vars are set in the Vercel project  
4. Run migrations against production using the **non-pooling** URL from a trusted CI/admin machine  

**Corporate target (roadmap, not implemented):** Unilever Azure hosting + Entra ID (`docs/VERSION_HISTORY.md` Phase 5).

---

## 8. Unilever Ecosystem Integration Requirements

IT should evaluate and provide the following before enterprise-wide rollout.

### 8.1 Internal network / firewall / domain

| Topic | IT action |
|---|---|
| **Hostname** | Decide production FQDN (e.g. desire-lab under unilever.com / approved subdomain) and TLS certificates |
| **Ingress** | Prefer App Gateway / Front Door / API Management / reverse proxy with WAF in front of the Node/Next app |
| **Egress allowlist** | If LLM stays external: allow Azure OpenAI endpoint (preferred) and/or Groq; allow Resend API; allow Postgres endpoint; allow SharePoint if users follow training links |
| **Inbound exposure** | Restrict to Unilever network / Zscaler / VPN / Private Link; do not leave public internet open while APIs lack auth |
| **SharePoint / Active Workspace** | Confirm deep-link bases and that users already have access to those systems (app only links out) |

### 8.2 SSO / Azure AD (Entra ID) integration points

| Integration point | Current gap | Recommended target |
|---|---|---|
| **Employee authentication** | None | Entra ID OIDC; protect all routes |
| **Admin authorization** | Shared password | App roles / security groups for CMS |
| **Chat & booking APIs** | Open | Same session/token as UI; reject anonymous |
| **Email identity** | Free-text email on booking form | Prefill/verify from Entra profile claims |
| **Azure OpenAI** | Env API key pattern | Private endpoint + managed identity where policy requires |

### 8.3 Data residency / compliance (R&D)

| Data class | Where it lives today | IT considerations |
|---|---|---|
| **Tool catalog metadata** | PostgreSQL (POC names/emails, descriptions, URLs) | Low–medium sensitivity; still internal |
| **Training bookings** | PostgreSQL + email to POC | Contains employee name/email and intent — treat as personal data under Unilever privacy policy |
| **Chat messages** | Processed in request path; sent to Groq/Azure when configured | **Do not** send confidential formulation/IP in prompts until DLP review; prefer Azure OpenAI in approved region |
| **RAG context** | Built from DB + static Packaging Lab content | Ensure prod DB region matches residency requirements (`.env.example` notes Mumbai Supabase for Vercel prototype) |

**Not yet implemented:** in-app data retention policies, chat transcript storage, DLP scrubbing, customer-managed encryption keys beyond what the DB host provides.

### 8.4 CI/CD recommendations (corporate DevOps)

Repo currently has **no** pipeline definitions. Recommended minimum for Unilever:

| Stage | Recommendation |
|---|---|
| **Build** | `npm ci` → `npm run lint` → `npm run build` on every PR |
| **Migrate** | Separate gated job: `prisma migrate deploy` using non-pooling URL; never auto-migrate from untrusted PRs |
| **Deploy** | Azure App Service / Container Apps / AKS **or** approved PaaS; promote `dev` → `uat` → `prod` |
| **Secrets** | Key Vault references; no secrets in Git |
| **Artifacts** | Immutable image or Vercel deployment ID; document rollback (see `docs/ROLLBACK.md`) |
| **Quality gates** | Add smoke tests for `/api/bookings` validation and `/api/chat` fallback before scale-out |

---

## 9. Scalability & Production Readiness Plan

**Target load (IT planning assumption for this document):** up to **200+ independent tools/modules** under the platform and up to **~1000 concurrent users**.

Current codebase is a **monolithic Next.js app** with a **shared Postgres** catalog — suitable for tens of tools and modest concurrency, **not** yet optimized for 200 tools × 1000 concurrent users without infrastructure and some application changes.

### 9.1 Architectural changes needed (current → target)

| Gap | Current evidence | Change for 200 tools / 1000 users |
|---|---|---|
| **Tool registration** | Mix of DB CMS + static content modules (`pack-lab-tools.ts`, stages) | Standardize on DB (or CMS API) as source of truth; treat static files as seed only; versioned tool metadata schema |
| **AuthN/Z** | Admin password only | Entra ID + RBAC; authenticate APIs |
| **Chat RAG** | In-process retrieval over tool text; optional embeddings via Groq/Azure | Dedicated search/index (Azure AI Search / pgvector) with incremental indexing as tools grow; cache embeddings |
| **LLM dependency** | Synchronous call per chat request | Queue / timeout / circuit breaker; token budgets; Azure OpenAI PTU or rate-limit aware capacity |
| **Booking email** | Sync Resend call in API path | Async job/queue for email; idempotent booking writes |
| **Horizontal scale** | Stateless Next possible, but Prisma `pg` Pool per instance (`pg-adapter.ts`) | External connection pooler (PgBouncer / Supabase pooler / Azure); tune pool size per instance |
| **Microservices** | Not required initially | Split only when needed: (1) catalog API, (2) booking/notifications, (3) chat/RAG — keep UI as BFF |

### 9.2 Caching strategy

| Layer | Recommendation |
|---|---|
| **Static assets** (`public/`, JS/CSS) | CDN (Azure Front Door / CloudFront / Vercel Edge) with long cache + hashed filenames |
| **Catalog reads** | Short TTL HTTP cache or Redis for `getActiveTools` / category lists; invalidate on CMS write |
| **Chat** | Do **not** cache personalized answers by default; cache **retrieval index** and embedding vectors |
| **SSR pages** | Use ISR/revalidation for tool pages once catalog is DB-authoritative |

### 9.3 Load balancing & horizontal scaling

| Component | Approach |
|---|---|
| **Next.js app** | Run N identical Node instances behind L7 load balancer; sticky sessions **not** required if admin session stays cookie-HMAC (or move to Entra tokens) |
| **WebSockets** | Not used; chat uses HTTP/SSE — ensure LB idle timeouts allow streaming |
| **LLM** | Scale app instances separately from model capacity; protect with concurrency limits |
| **Admin CMS** | Low traffic; can share same pool with stricter auth |

### 9.4 Database scaling (Postgres is in use)

| Concern | Guidance |
|---|---|
| **Connection pooling** | Mandatory at 1000 users; use pooled runtime URL + limited `pg` Pool size per pod |
| **Read replicas** | Add when read-heavy catalog browsing dominates; keep bookings on primary |
| **Indexing** | Existing indexes on status/category/toolId; add full-text / GIN on name/description/tags before 200 tools |
| **Migrations** | Expand-contract pattern; run in maintenance window |
| **Backups** | PITR + tested restore; RPO/RTO set by IT |

### 9.5 Monitoring, logging, alerting

| Signal | Recommendation |
|---|---|
| **Uptime** | Synthetic checks on `/`, `/admin/login`, `POST /api/chat` health (fallback mode OK) |
| **Errors** | Centralize Next.js/server logs; alert on 5xx rate and Prisma connection errors |
| **LLM** | Track latency, error rate, provider fallback rate, token usage cost |
| **Bookings** | Count creates/day; alert on email send failures |
| **Per-tool analytics** | **Not yet implemented** in-app — add page-view / launch events (Application Insights / GA4 internal) keyed by tool slug |
| **Security** | Alert on admin login failures; WAF anomalies on `/api/*` |

### 9.6 Phased infrastructure investment

#### Phase A — ~10 tools / ~50 users (near-current)

| Need | Enough? |
|---|---|
| Single Next.js deploy (Vercel or small Azure App Service) | Yes |
| Single Postgres (managed) | Yes |
| Admin password + VPN restriction | Interim only |
| Groq **or** Azure OpenAI with low quotas | Yes |
| Resend or corporate SMTP relay | Yes |
| Basic uptime monitor | Yes |

#### Phase B — ~50 tools / ~200–300 users

| Add |
|---|
| Entra ID SSO (all users) |
| Azure OpenAI in approved region; disable external LLM if policy requires |
| Connection pooler; CDN for static assets |
| Catalog caching; CMS audit log |
| Staging environment + automated build pipeline |
| Rate limits on `/api/chat` and `/api/bookings` |

#### Phase C — ~200 tools / ~1000 concurrent users

| Add |
|---|
| Horizontal app scale-out (3+ instances) + autoscaling |
| Search index for RAG/catalog; async email/jobs |
| Read replica; query/index tuning |
| Full observability (APM, dashboards per tool) |
| Formal DR/BCP; capacity test (load test chat + browse) |
| Optional split of chat service if LLM latency dominates Node event loop |

---

## 10. Open Questions / Decisions Needed From IT

- **Production hosting platform:** remain on Vercel, move to Unilever Azure (App Service / Container Apps / AKS), or other approved PaaS?
- **Production domain / DNS / TLS** ownership and naming standards?
- **Network model:** internet-facing with Entra, private-only (VPN/Zscaler), or hybrid?
- **Entra ID tenant details:** app registration, redirect URIs, required security groups for Admins vs Readers?
- **Database:** continue managed Postgres (Supabase/Neon/Azure Database for PostgreSQL); region/residency; who operates backups?
- **LLM policy:** approve Azure OpenAI only, or allow Groq for non-prod? Data classification rules for chat prompts?
- **Email:** continue Resend, or mandate corporate Exchange/SMTP / Microsoft Graph send mail?
- **SharePoint / Active Workspace** official URLs and link governance for training materials?
- **Secrets platform:** Key Vault vs host-native secrets; rotation owners?
- **CI/CD ownership:** which pipeline product (Azure DevOps, GitHub Enterprise) and promotion rules for migrations?
- **Budget-dependent choices:** managed DB SKU, Azure OpenAI PTU vs pay-as-you-go, WAF/Front Door tier, APM tooling?
- **Compliance:** DPIA / R&D data handling sign-off before storing bookings and chat traffic?
- **SLA / support model:** who is L1/L2 for Desire Lab vs underlying tool POCs?
- **Timeline for retiring shared `ADMIN_PASSWORD`** before broad employee rollout?

---

## Appendix A — Security posture snapshot (as implemented)

| Control | Status |
|---|---|
| HTTPS | Expected at host (Vercel); not configured in-app |
| Admin cookie HttpOnly | Yes |
| Timing-safe admin token compare | Yes (`timingSafeEqual`) |
| Input validation (Zod) on chat/booking | Yes |
| Public API auth | No |
| CSRF hardening for Server Actions | Relies on Next.js defaults — validate under SSO design |
| DB TLS | `pg` adapter sets `ssl: { rejectUnauthorized: false }` — **review for corporate hardening** |
| Dependency scanning / SBOM in CI | **Not yet implemented** in repo |

## Appendix B — Quick reference commands

```bash
npm install
docker compose up -d
npm run db:setup
npm run dev          # development
npm run build && npm start   # production mode locally
npm run db:studio    # DB browser
```

---

*End of IT Onboarding Guide. For product behaviour and UX requirements, see `docs/PRD.md`. For engineer/agent implementation conventions, see `docs/AGENT_GUIDE.md`.*
