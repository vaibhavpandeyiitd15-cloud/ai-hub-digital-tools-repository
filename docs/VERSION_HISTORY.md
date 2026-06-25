# Version History

## AI Hub Digital Tools Repository

Living changelog and roadmap. **All implementation agents must update this file** when completing a phase, merging a feature, or making a significant architectural decision.

| Field | Value |
|---|---|
| **Current version** | 0.2.0 |
| **Last updated** | 2026-06-25 |

---

## How to Update This File

1. Add entries under `[Unreleased]` while work is in progress.
2. On phase/version completion, move items to a new version section with date.
3. Add architectural decisions to the **Decision Log** (do not delete old decisions).
4. Update the **Roadmap** table status column.

**Commit message convention:** `chore(docs): release v0.x.x — brief description`

---

## [Unreleased]

### Planned

- Phase 2: Admin CMS (tool CRUD, category management)
- Phase 3: Training booking mock + Resend email notifications
- Phase 4: Azure OpenAI chatbot (RAG)
- Phase 5: Azure AD SSO + Unilever Azure production deployment

---

## [0.2.0] — 2026-06-25 — App Scaffold + Catalog

### Added

- Next.js 16 + TypeScript + Tailwind CSS 4 application
- Prisma schema: Category, Tool, TrainingDoc, Booking models
- Initial migration SQL (`prisma/migrations/20250625000000_init`)
- Seed script: 2 categories, 8 launch tools
- Unilever theme (Barlow + Inter, brand colors)
- `SiteHeader` with logo and site title **AI Hub Tool Guide**
- `SiteFooter`
- Home page: search, category filters, tool card grid
- Tool detail pages at `/tools/[slug]`
- `docker-compose.yml` for local PostgreSQL (port 5433)
- `.env.example` with DATABASE_URL, Resend, Azure OpenAI placeholders
- Database setup banner when `DATABASE_URL` is not configured

### Technical

- Lazy Prisma client initialization (build works without DB)
- Vercel-ready dynamic routes

---

## [0.1.1] — 2026-06-25 — Product Configuration

### Changed

- Site display name confirmed: **AI Hub Tool Guide**
- Categories confirmed: **Consumer Insights (CMI)**, **Formulation**
- Launch tool catalog: 8 tools (Innovation Navigator, Boltchat.AI, Convotrack, RView, Insight GPT, Beauty Vault, Trajaan.io, Innoflex GPT)
- Deployment: **Vercel** prototype for MVP
- Email: **Resend** for booking notifications

---

## [0.1.0] — 2026-06-25 — Documentation Foundation

### Added

- `docs/PRD.md` — Product requirements, user stories, data model, phased acceptance criteria
- `docs/DESIGN.md` — Unilever brand tokens, typography, component specs, page wireframes
- `docs/VERSION_HISTORY.md` — This changelog and roadmap
- `docs/AGENT_GUIDE.md` — Implementation playbook for AI coding agents
- `public/assets/unilever-logo.png` — Official Unilever logo asset

### Decisions

- MVP without SSO; Azure AD deferred to v1.0
- Training booking uses Outlook-style UI mock with email to POC (no Microsoft Graph)
- Admin CMS built into the app (not headless CMS or git-based content)
- Chatbot powered by Azure OpenAI with RAG over tool catalog

---

## Roadmap

| Version | Phase | Scope | Status |
|---|---|---|---|
| **0.1.1** | 0 | Product configuration (name, tools, categories, Vercel, Resend) | **Complete** |
| **0.2.0** | 1 | Next.js scaffold, Prisma DB, Unilever theme, catalog pages | **Complete** |
| **0.3.0** | 2 | Admin CMS (CRUD tools/categories) | Planned |
| **0.4.0** | 3 | Outlook-style booking modal, email to POC, admin booking inbox | Planned |
| **0.5.0** | 4 | Floating chatbot widget, Azure OpenAI RAG integration | Planned |
| **1.0.0** | 5 | Azure AD SSO, production deploy (Unilever Azure), optional Graph calendar | Future |

---

## Decision Log

Record of settled architectural and product decisions. **Do not re-debate these without explicit user approval.**

| Date | Decision | Rationale | Alternatives considered |
|---|---|---|---|
| 2026-06-25 | Internal audience; MVP without SSO | Faster iteration; SSO requires IT integration | Azure AD from day one |
| 2026-06-25 | Outlook-style booking UI mock | Delivers UX value without Graph API approval | Real Microsoft Graph integration; external booking link |
| 2026-06-25 | Admin CMS in-app | AI Hub team manages content without developers | Markdown in git; spreadsheet import; headless CMS |
| 2026-06-25 | Azure OpenAI for chatbot | Aligns with Unilever enterprise AI stack | OpenAI API direct; rules/FAQ-only bot |
| 2026-06-25 | Next.js 16 + TypeScript + Tailwind + Prisma | Proven stack from sibling Network project | Plain React SPA; Python/Django |
| 2026-06-25 | PostgreSQL for persistence | Relational model fits tools, bookings, categories | SQLite (too limited for production); MongoDB |
| 2026-06-25 | Barlow + Inter fonts for MVP | DIN Pro is proprietary; close geometric sans fallback | System fonts only |
| 2026-06-25 | Env-based admin password for MVP | Simple gate until SSO in v1.0 | Named admin accounts; Clerk auth |
| 2026-06-25 | Site name: AI Hub Tool Guide | Product owner confirmation | AI Hub Tools Hub |
| 2026-06-25 | Categories: CMI + Formulation | Matches AI Hub tool portfolio | Generic 5-category default |
| 2026-06-25 | Vercel for MVP deployment | Fast prototype iteration | Unilever Azure from day one |
| 2026-06-25 | Resend for booking emails | Simple API, good DX for MVP | M365 SMTP |
| 2026-06-25 | POC names and tool URLs deferred | Add via admin CMS when ready; placeholders for Phase 1 seed | Collect before Phase 1 |

---

## Open Items (from PRD)

Track resolution of TBD items here as they are decided.

| # | Item | Status | Resolution |
|---|---|---|---|
| 1 | Initial tool list for seed data | **Resolved** | 8 tools — see PRD Section 12.1 |
| 2 | Deployment target (Azure vs Vercel) | **Resolved** | Vercel prototype for MVP |
| 3 | Email provider (M365 SMTP vs Resend) | **Resolved** | Resend |
| 4 | Azure OpenAI deployment details | **Open** | — |
| 5 | Site display name | **Resolved** | AI Hub Tool Guide |
| 6 | Category list confirmation | **Resolved** | Consumer Insights (CMI), Formulation |
| 7 | Admin user model | **Open** | Default: shared env password |
| 8 | Per-tool POC, URL, purpose | **Deferred** | Add later via admin CMS; placeholders in seed |

---

## Template for Future Entries

Copy and fill when releasing a new version:

```markdown
## [0.x.0] — YYYY-MM-DD — Brief title

### Added
- New features

### Changed
- Modifications to existing behavior

### Fixed
- Bug fixes

### Removed
- Deprecated features

### Technical
- Infrastructure, dependency, or schema changes
```

---

## Related Documents

- [PRD.md](./PRD.md) — Requirements and acceptance criteria per phase
- [DESIGN.md](./DESIGN.md) — Visual design system
- [AGENT_GUIDE.md](./AGENT_GUIDE.md) — Agent implementation rules
