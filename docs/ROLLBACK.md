# Rollback Guide

## AI Hub era (before Desire Lab restructure)

| Item | Value |
|---|---|
| **Tag** | `v0.5.1-ai-hub` |
| **Version** | 0.5.1 |
| **Description** | AI Hub Tool Guide — flat catalog, 8 tools, Groq chatbot |

### Restore locally

```bash
git fetch --tags
git checkout v0.5.1-ai-hub
npm install
npm run build
```

### Return to latest Desire Lab

```bash
git checkout main
```

### Redeploy a rollback on Vercel

1. Checkout tag: `git checkout v0.5.1-ai-hub`
2. Deploy: `npx vercel --prod --yes`
3. Return to main when done: `git checkout main`

> **Note:** Database seed data may differ after Desire Lab migration. Rollback restores **code** only; run `npm run db:seed` if you need the old catalog shape in a fresh DB.
