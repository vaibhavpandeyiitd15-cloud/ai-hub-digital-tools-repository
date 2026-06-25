# Agent Implementation Guide

## AI Hub Digital Tools Repository

Playbook for AI coding agents (Cursor, Copilot, etc.) implementing this project. **Read this file after PRD and DESIGN.**

| Field | Value |
|---|---|
| **Version** | 0.1.0 |
| **Last updated** | 2026-06-25 |

---

## 1. Required Reading Order

Before writing any code, read these documents in order:

1. **[PRD.md](./PRD.md)** — What to build, user stories, data model, phase gates
2. **[DESIGN.md](./DESIGN.md)** — How it should look, components, tokens, layouts
3. **[VERSION_HISTORY.md](./VERSION_HISTORY.md)** — Current version, roadmap, decision log
4. **This file** — Stack, conventions, folder structure, agent rules

**Do not skip.** The decision log in VERSION_HISTORY contains settled choices — do not re-propose alternatives already decided.

---

## 2. Project Summary

| Item | Value |
|---|---|
| **Product** | Internal tool catalog for Unilever AI Hub (Head Office) |
| **Display name** | AI Hub Tool Guide |
| **Workspace** | `C:\Users\user\Documents\Startup_products\RND` |
| **Current phase** | 0 complete (v0.1.1) → next: Phase 1 scaffold |
| **Logo** | `public/assets/unilever-logo.png` |

---

## 3. Tech Stack

| Layer | Technology | Version guidance |
|---|---|---|
| Framework | Next.js (App Router) | 16.x |
| Language | TypeScript | ^5 |
| Runtime | Node.js LTS | Latest LTS |
| Styling | Tailwind CSS | ^4 |
| Components | shadcn/ui | Latest compatible with Next 16 |
| Icons | lucide-react | Latest |
| Database | PostgreSQL | Hosted (Supabase, Neon, or local Docker) |
| ORM | Prisma | ^7.x |
| Validation | Zod | ^4.x |
| Email | Resend | Phase 3 — confirmed for MVP |
| Hosting | Vercel | MVP prototype — confirmed |
| AI / Chatbot | Azure OpenAI + embeddings | Phase 4 |
| Auth (future) | Microsoft Entra ID | Phase 5 |

Reference implementation patterns exist in sibling project: `C:\Users\user\Documents\Startup_products\Network`

---

## 4. Folder Structure

```
RND/
├── docs/
│   ├── PRD.md
│   ├── DESIGN.md
│   ├── VERSION_HISTORY.md
│   └── AGENT_GUIDE.md              # This file
├── prisma/
│   ├── schema.prisma                 # Tool, Category, TrainingDoc, Booking
│   └── seed.ts                       # Seed categories + example tools
├── public/
│   └── assets/
│       └── unilever-logo.png
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Root layout, fonts, theme
│   │   ├── page.tsx                  # Catalog home
│   │   ├── tools/
│   │   │   └── [slug]/
│   │   │       └── page.tsx          # Tool detail
│   │   ├── admin/
│   │   │   ├── layout.tsx            # Admin sidebar layout
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── tools/
│   │   │   │   ├── page.tsx          # Tool list
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── edit/
│   │   │   │           └── page.tsx
│   │   │   ├── categories/
│   │   │   │   └── page.tsx
│   │   │   └── bookings/
│   │   │       └── page.tsx          # Phase 3
│   │   └── api/
│   │       ├── tools/
│   │       │   └── route.ts
│   │       ├── bookings/
│   │       │   └── route.ts          # Phase 3
│   │       └── chat/
│   │           └── route.ts            # Phase 4
│   ├── components/
│   │   ├── layout/
│   │   │   ├── SiteHeader.tsx
│   │   │   └── SiteFooter.tsx
│   │   ├── catalog/
│   │   │   ├── ToolCard.tsx
│   │   │   ├── ToolGrid.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   └── CategoryFilter.tsx
│   │   ├── tool/
│   │   │   ├── PocCard.tsx
│   │   │   ├── TrainingDocList.tsx
│   │   │   └── StatusBadge.tsx
│   │   ├── booking/
│   │   │   ├── BookingModal.tsx
│   │   │   └── BookingConfirmation.tsx
│   │   ├── chat/
│   │   │   └── ChatWidget.tsx
│   │   └── admin/
│   │       ├── AdminToolForm.tsx
│   │       └── AdminDataTable.tsx
│   ├── lib/
│   │   ├── db.ts                     # Prisma client singleton
│   │   ├── actions/                  # Server actions
│   │   │   ├── tools.ts
│   │   │   ├── categories.ts
│   │   │   └── bookings.ts
│   │   ├── email.ts                  # Phase 3
│   │   ├── azure-openai.ts           # Phase 4
│   │   └── rag.ts                    # Phase 4
│   └── styles/
│       └── theme.css                 # Unilever CSS tokens
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

---

## 5. Phase Gates

**Do not start Phase N+1 until Phase N acceptance criteria in PRD Section 10 are met.**

| Phase | Version | Gate (summary) |
|---|---|---|
| 0 | 0.1.0 | All docs created; logo in `public/assets/` |
| 1 | 0.2.0 | App runs locally; themed nav; Prisma schema migrated; seed works |
| 2 | 0.3.0 | Admin can CRUD tools; catalog + detail pages render data |
| 3 | 0.4.0 | Booking form submits; email sent; admin inbox shows requests |
| 4 | 0.5.0 | Chatbot answers tool questions with citations |
| 5 | 1.0.0 | SSO + production deployment |

After completing each phase:

1. Update `docs/VERSION_HISTORY.md` with release entry
2. Move roadmap item status to **Complete**
3. Add any new decisions to the decision log

---

## 6. Coding Conventions

### 6.1 General

- **TypeScript strict mode** — no `any` unless unavoidable with comment
- **Server Components by default** — use `"use client"` only when needed (interactivity, hooks)
- **Server Actions** for mutations — prefer over API routes for admin CRUD
- **API routes** for chatbot streaming and external webhooks
- **Zod** for all form and API input validation

### 6.2 Naming

| Item | Convention | Example |
|---|---|---|
| React components | PascalCase | `ToolCard.tsx` |
| Files (non-component) | kebab-case or camelCase | `azure-openai.ts` |
| Database models | PascalCase (Prisma) | `Tool`, `TrainingDoc` |
| URL slugs | kebab-case | `copilot-studio` |
| Env vars | SCREAMING_SNAKE | `DATABASE_URL` |

### 6.3 Styling

- Use CSS tokens from `src/styles/theme.css` — **never hardcode `#001E62` in components**
- Tailwind utility classes preferred; extract repeated patterns to components
- Match component specs in DESIGN.md Section 5

### 6.4 Database

- Prisma schema is source of truth for data model (see PRD Section 7)
- Run `npx prisma migrate dev` for schema changes
- Include seed script with default categories and 3–5 placeholder tools
- Use `slug` for public URLs, not database `id`

### 6.5 Error Handling

- User-facing errors: friendly message, no stack traces
- Log server errors with context (tool slug, booking ID)
- Form validation errors: inline below fields

---

## 7. Environment Variables

Create `.env.example` (never commit `.env.local`):

```bash
# Database
DATABASE_URL="postgresql://..."

# Admin (MVP gate)
ADMIN_PASSWORD="change-me"

# Email (Phase 3 — Resend)
RESEND_API_KEY=""
RESEND_FROM_EMAIL="aihub@unilever.com"

# Azure OpenAI (Phase 4)
AZURE_OPENAI_ENDPOINT=""
AZURE_OPENAI_API_KEY=""
AZURE_OPENAI_DEPLOYMENT=""
AZURE_OPENAI_EMBEDDING_DEPLOYMENT=""
```

---

## 8. Agent Rules

### Must Do

- Read PRD → DESIGN → VERSION_HISTORY before coding
- Follow phase gates; complete one phase before starting the next
- Update VERSION_HISTORY on phase completion
- Use Unilever theme tokens and logo asset
- Validate all user input with Zod
- Cite tool name and `/tools/[slug]` link in chatbot responses
- Keep changes focused — no unrelated refactors

### Must Not Do

- Hardcode secrets or API keys in source code
- Skip admin auth on `/admin/*` routes (even MVP password gate)
- Implement SSO or Microsoft Graph before Phase 5 unless user explicitly requests
- Re-create the Unilever script wordmark in CSS — use logo image
- Delete entries from the decision log in VERSION_HISTORY
- Edit the plan file in `.cursor/plans/`

### When Uncertain

- Check the decision log first
- If not covered, follow PRD open questions — use documented defaults
- Do not guess Azure OpenAI deployment names; use env vars

---

## 9. Key Implementation Notes by Phase

### Phase 1 — Scaffold

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir
npm install prisma @prisma/client zod
npx prisma init
```

- Copy theme tokens from DESIGN.md into `src/styles/theme.css`
- Load Barlow + Inter via `next/font/google`
- Root layout: `SiteHeader` + children + `SiteFooter`

### Phase 2 — Catalog + Admin

- Home page: fetch tools server-side, pass to `ToolGrid`
- Search/filter: client component with URL search params (`?q=&category=`)
- Admin: middleware or layout check for `ADMIN_PASSWORD` session cookie
- Slug: auto-generate with `slugify(name)`, allow override in form

### Phase 3 — Booking

- `BookingModal` opens from tool detail CTA
- `POST /api/bookings` → validate → Prisma create → `sendBookingEmail(pocEmail, booking)`
- Email body: all form fields + link to admin booking view
- Admin bookings page: table with status update dropdown

### Phase 4 — Chatbot

- Build embedding index on tool save (or nightly rebuild)
- `POST /api/chat` → embed user message → retrieve top-k tool chunks → Azure OpenAI chat
- System prompt template:

```
You are the AI Hub assistant for Unilever Head Office.
Answer ONLY using the provided tool context.
Always cite the tool name and include its path as /tools/{slug}.
If the question is not about AI Hub tools, politely decline.
If you don't know, say so and suggest contacting the POC.
```

- `ChatWidget`: client component, streams response via `ReadableStream`

---

## 10. Seed Data (Confirmed)

**Categories:**

| Name | Slug | Sort order |
|---|---|---|
| Consumer Insights (CMI) | `consumer-insights-cmi` | 1 |
| Formulation | `formulation` | 2 |

**Launch tools:**

| Name | Slug | Category | Status | Purpose (placeholder — update in CMS) |
|---|---|---|---|---|
| Innovation Navigator | `innovation-navigator` | Consumer Insights (CMI) | ACTIVE | Navigate innovation insights and opportunities |
| Boltchat.AI | `boltchat-ai` | Consumer Insights (CMI) | ACTIVE | AI-powered conversational insights platform |
| Convotrack | `convotrack` | Consumer Insights (CMI) | ACTIVE | Track and analyze consumer conversations |
| RView | `rview` | Formulation | ACTIVE | Review and collaboration for formulation research |
| Insight GPT | `insight-gpt` | Consumer Insights (CMI) | ACTIVE | GPT assistant for consumer insights workflows |
| Beauty Vault | `beauty-vault` | Formulation | ACTIVE | Knowledge repository for beauty and formulation |
| Trajaan.io | `trajaan-io` | Consumer Insights (CMI) | ACTIVE | Market and consumer trend intelligence |
| Innoflex GPT | `innoflex-gpt` | Formulation | ACTIVE | GPT assistant for formulation and innovation |

**Placeholder fields for seed script** (POC names and links added later via admin CMS):

- `pocName`: "TBD"
- `pocEmail`: "aihub@unilever.com"
- `toolUrl`: `#` (empty link until provided)
- `description`: Same as purpose column until detailed copy is provided

**Slug generation:** Use table above; do not auto-slug Trajaan.io to `trajaanio` — use `trajaan-io`.

---

## 11. Testing Checklist (per phase)

### Phase 1
- [ ] `npm run dev` starts without errors
- [ ] Nav shows logo and Unilever blue background
- [ ] `npx prisma db seed` populates categories

### Phase 2
- [ ] Home shows tool cards from DB
- [ ] Search filters results
- [ ] `/tools/[slug]` renders all fields
- [ ] Admin login blocks unauthenticated access
- [ ] Admin can create/edit/delete (deprecate) tools

### Phase 3
- [ ] Booking modal validates required fields
- [ ] Submit creates DB record
- [ ] POC receives email (or logs in dev)
- [ ] Admin sees booking in inbox

### Phase 4
- [ ] Chatbot opens/closes via floating button
- [ ] "What is Microsoft Copilot?" returns grounded answer with link
- [ ] Off-topic question is declined politely

---

## 12. Related Documents

- [PRD.md](./PRD.md)
- [DESIGN.md](./DESIGN.md)
- [VERSION_HISTORY.md](./VERSION_HISTORY.md)

---

## 13. Quick Context Prompt

Copy into a new agent chat to restore context:

```
Project: AI Hub Tool Guide (Unilever Head Office AI Hub)
Workspace: C:\Users\user\Documents\Startup_products\RND
Read: docs/PRD.md, docs/DESIGN.md, docs/VERSION_HISTORY.md, docs/AGENT_GUIDE.md
Current phase: Check VERSION_HISTORY roadmap table (next: Phase 1 scaffold v0.2.0)
Stack: Next.js 16, TypeScript, Tailwind, Prisma, PostgreSQL, Vercel, Resend, Azure OpenAI (Phase 4)
Categories: Consumer Insights (CMI), Formulation
Tools: Innovation Navigator, Boltchat.AI, Convotrack, RView, Insight GPT, Beauty Vault, Trajaan.io, Innoflex GPT
Branding: Unilever blue #001E62, Barlow + Inter fonts, logo at public/assets/unilever-logo.png
Do not edit .cursor/plans/ files. Update VERSION_HISTORY on phase completion.
```
