# Design System & UX Specification

## AI Hub Digital Tools Repository

| Field | Value |
|---|---|
| **Version** | 0.1.0 |
| **Last updated** | 2026-06-25 |
| **Status** | Phase 0 — Documentation |
| **Companion** | [PRD.md](./PRD.md) |

---

## 1. Design Principles

1. **Clarity over decoration** — Employees need answers fast; minimize visual noise.
2. **Unilever brand fidelity** — Deep blue, white, clean typography; logo used as provided.
3. **Enterprise trust** — Professional layout, consistent patterns, accessible contrast.
4. **Action-oriented** — Every tool page drives toward: open tool, book training, or ask chatbot.
5. **Admin efficiency** — CMS forms are dense but scannable; tables support quick edits.

---

## 2. Brand Identity

### 2.1 Logo Usage

- **Asset path:** `public/assets/unilever-logo.png`
- **On dark backgrounds (nav, footer):** White logo on Unilever blue
- **On light backgrounds:** Blue logo variant if available; otherwise use full-color on white card with padding
- **Minimum clear space:** Height of the "U" symbol on all sides
- **Do not:** Stretch, recolor arbitrarily, or recreate the script "Unilever" wordmark in CSS

### 2.2 Color Palette

| Token | Hex | RGB | Usage |
|---|---|---|---|
| `--unilever-blue` | `#001E62` | 0, 30, 98 | Primary brand, header, footer, primary buttons |
| `--unilever-blue-light` | `#0033A0` | 0, 51, 160 | Hover states, active nav, links on white |
| `--unilever-blue-dark` | `#001448` | 0, 20, 72 | Pressed states, dark accents |
| `--white` | `#FFFFFF` | 255, 255, 255 | Backgrounds, text on blue |
| `--surface` | `#F5F7FA` | 245, 247, 250 | Page background, card hover |
| `--surface-elevated` | `#FFFFFF` | 255, 255, 255 | Cards, modals, dropdowns |
| `--text-primary` | `#1A1A1A` | 26, 26, 26 | Headings, body text |
| `--text-secondary` | `#5C5C5C` | 92, 92, 92 | Captions, meta, placeholders |
| `--text-on-blue` | `#FFFFFF` | 255, 255, 255 | Nav links, footer text |
| `--border` | `#E2E8F0` | 226, 232, 240 | Card borders, dividers |
| `--accent-green` | `#00A651` | 0, 166, 81 | Success, active status badge |
| `--accent-amber` | `#F5A623` | 245, 166, 35 | Beta status badge |
| `--accent-red` | `#D32F2F` | 211, 47, 47 | Error, deprecated badge |
| `--focus-ring` | `#0033A0` | 0, 51, 160 | Keyboard focus outline |

### 2.3 CSS Custom Properties (implement in `src/styles/theme.css`)

```css
:root {
  --unilever-blue: #001E62;
  --unilever-blue-light: #0033A0;
  --unilever-blue-dark: #001448;
  --white: #FFFFFF;
  --surface: #F5F7FA;
  --surface-elevated: #FFFFFF;
  --text-primary: #1A1A1A;
  --text-secondary: #5C5C5C;
  --text-on-blue: #FFFFFF;
  --border: #E2E8F0;
  --accent-green: #00A651;
  --accent-amber: #F5A623;
  --accent-red: #D32F2F;
  --focus-ring: #0033A0;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --shadow-sm: 0 1px 2px rgba(0, 30, 98, 0.06);
  --shadow-md: 0 4px 12px rgba(0, 30, 98, 0.08);
  --shadow-lg: 0 8px 24px rgba(0, 30, 98, 0.12);
}
```

### 2.4 Tailwind Extension (for agents)

Map tokens in `tailwind.config` or CSS `@theme`:

```css
@theme {
  --color-brand: #001E62;
  --color-brand-light: #0033A0;
  --color-brand-dark: #001448;
  --color-surface: #F5F7FA;
  --color-success: #00A651;
  --color-warning: #F5A623;
  --color-danger: #D32F2F;
}
```

---

## 3. Typography

### 3.1 Font Stack

| Role | Primary | Fallback (MVP) | Notes |
|---|---|---|---|
| **Headings & UI** | DIN Pro | [Barlow](https://fonts.google.com/specimen/Barlow) | Unilever uses proprietary DIN; use Barlow until brand font is licensed |
| **Body** | Unilever custom sans | [Inter](https://fonts.google.com/specimen/Inter) | 16px base, 1.5 line-height |
| **Monospace** | — | `ui-monospace, monospace` | Code snippets, booking IDs |

**Google Fonts import (MVP):**

```html
<link href="https://fonts.googleapis.com/css2?family=Barlow:wght@500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
```

```css
--font-heading: 'Barlow', system-ui, sans-serif;
--font-body: 'Inter', system-ui, sans-serif;
```

### 3.2 Type Scale

| Element | Font | Size | Weight | Line height |
|---|---|---|---|---|
| H1 (page title) | Barlow | 32px / 2rem | 700 | 1.2 |
| H2 (section) | Barlow | 24px / 1.5rem | 600 | 1.3 |
| H3 (card title) | Barlow | 18px / 1.125rem | 600 | 1.4 |
| Body | Inter | 16px / 1rem | 400 | 1.5 |
| Small / meta | Inter | 14px / 0.875rem | 400 | 1.4 |
| Caption | Inter | 12px / 0.75rem | 500 | 1.3 |
| Button | Barlow | 14px / 0.875rem | 600 | 1 |
| Nav link | Barlow | 15px / 0.9375rem | 500 | 1 |

---

## 4. Spacing & Layout

### 4.1 Grid

- **Max content width:** 1280px (`max-w-7xl`)
- **Page padding:** 24px mobile, 32px desktop
- **Card grid:** 1 col (mobile) → 2 col (tablet) → 3 col (desktop)
- **Gutter:** 24px between cards

### 4.2 Spacing Scale (8px base)

| Token | Value |
|---|---|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-6` | 24px |
| `--space-8` | 32px |
| `--space-12` | 48px |
| `--space-16` | 64px |

---

## 5. Component Library

All components live in `src/components/`. Use shadcn/ui as base primitives; theme with Unilever tokens.

### 5.1 Global Components

#### `SiteHeader`

```
┌─────────────────────────────────────────────────────────────────────┐
│ [Logo]  AI Hub Tool Guide    [  Search tools...  ]    [?] [Book]   │
│         (nav links)                                                 │
└─────────────────────────────────────────────────────────────────────┘
```

- Background: `--unilever-blue`
- Height: 64px
- Logo: 120px wide max, left aligned
- Search: centered, white input on blue (or light surface pill)
- Right actions: Chatbot icon, "Book Training" outline button

#### `SiteFooter`

- Background: `--unilever-blue-dark`
- Text: `--text-on-blue`, small
- Links: Privacy (internal), Contact AI Hub, version number

#### `SearchBar`

- Full-width on mobile; max 480px on desktop
- Icon: magnifying glass left
- Debounced search (300ms)
- Placeholder: "Search tools by name, purpose, or tag…"

#### `CategoryFilter`

- Horizontal chip row below hero
- Chips: rounded-full, border; active = filled `--unilever-blue` + white text
- "All" chip always first

### 5.2 Catalog Components

#### `ToolCard`

```
┌──────────────────────────────┐
│ [Category chip]    [Status]  │
│                              │
│ Tool Name                    │
│ One-line purpose text that   │
│ truncates at two lines...    │
│                              │
│ POC: Jane Smith        [→]   │
└──────────────────────────────┘
```

- Background: white, border `--border`, radius `--radius-lg`, shadow `--shadow-sm`
- Hover: shadow `--shadow-md`, translateY -2px
- Entire card clickable → `/tools/[slug]`
- Status badge top-right: Active (green), Beta (amber), Deprecated (red, hidden from grid)

#### `ToolGrid`

- Responsive CSS grid of `ToolCard`
- Empty state: illustration + "No tools match your search"

#### `StatusBadge`

| Status | Background | Text |
|---|---|---|
| Active | `#E8F5E9` | `--accent-green` |
| Beta | `#FFF8E1` | `#E65100` |
| Deprecated | `#FFEBEE` | `--accent-red` |

### 5.3 Tool Detail Components

#### `PocCard`

```
┌─────────────────────────┐
│  Point of Contact       │
│  ─────────────────────  │
│  Jane Smith             │
│  AI Platform Team       │
│  jane.smith@unilever.com│
│  [Email POC]            │
└─────────────────────────┘
```

- Sticky on desktop (right column)
- Primary CTA below: "Book Training Session"

#### `TrainingDocList`

- List of links with type icon (document, video, slides)
- Each row: title (link), type badge
- Empty: "No training docs yet — book a session to get started"

#### `ToolDetailLayout`

Two-column on desktop (60/40), single column on mobile:

```
┌────────────────────────────────┬──────────────────┐
│ [Status] [Category]            │   POC Card       │
│ # Tool Name                    │                  │
│ Purpose line                   │   Training Docs  │
│                                │                  │
│ Description (rich text)        │   [Book Training]│
│                                │   [Open Tool]    │
│ Tags: chip chip chip           │                  │
│ Prerequisites                  │                  │
│ Last updated: date             │                  │
└────────────────────────────────┴──────────────────┘
```

### 5.4 Booking Components

#### `BookingModal` (Outlook-inspired)

```
┌─────────────────────────────────────────────┐
│  Book Training Session                  [×] │
│  ─────────────────────────────────────────  │
│  Tool: [Copilot Studio        ] (readonly)  │
│                                             │
│  Your name *        Your email *            │
│  [____________]     [____________]          │
│                                             │
│  Date *             Time *       Duration * │
│  [📅 pick date]     [🕐 pick]    [30 min ▾] │
│                                             │
│  Subject *                                  │
│  [Training request: Copilot Studio        ] │
│                                             │
│  Message / agenda                           │
│  [________________________________]         │
│  [________________________________]         │
│                                             │
│              [Cancel]  [Send Request]       │
└─────────────────────────────────────────────┘
```

- Modal overlay: `rgba(0, 30, 98, 0.5)`
- Panel: white, `--radius-lg`, `--shadow-lg`, max-width 560px
- Primary button: `--unilever-blue` background
- Date/time: native inputs styled to match; consider `react-day-picker` for calendar UX
- Success state: checkmark + booking reference ID + "POC will contact you via email"

#### `BookingConfirmation`

- Green check icon
- "Request sent to {pocName}"
- Booking ID for reference
- "What happens next" bullet list

### 5.5 Chatbot Components

#### `ChatWidget`

- **Collapsed:** Floating button bottom-right, 56px circle, `--unilever-blue`, chat icon
- **Expanded:** 380px × 520px panel above button
- Header: "AI Hub Assistant" + minimize/close
- Message area: user bubbles right (blue), assistant bubbles left (gray surface)
- Input: text field + send button at bottom
- Citations: assistant messages include linked tool names (`/tools/[slug]`)
- Typing indicator during stream

### 5.6 Admin Components

#### `AdminLayout`

```
┌──────────┬────────────────────────────────────┐
│ [Logo]   │  Page Title              [Logout]  │
│          ├────────────────────────────────────┤
│ Tools    │                                    │
│ Categories│  Main content area                │
│ Bookings │                                    │
│ Settings │                                    │
└──────────┴────────────────────────────────────┘
```

- Sidebar: 240px, `--unilever-blue` background, white text
- Active nav item: `--unilever-blue-light` background
- Content: white background, padded

#### `AdminToolForm`

- Two-column form on desktop
- Sections: Basic info, POC, Links & docs, Tags & status
- Slug auto-generated from name (editable)
- Training docs: repeatable row (title, url, type dropdown)
- Actions: Save, Cancel, Delete (with confirm dialog)

#### `AdminDataTable`

- Sortable columns: name, category, status, last updated
- Row actions: Edit, Deprecate
- Search filter above table
- Pagination: 20 rows per page

---

## 6. Page Specifications

### 6.1 Home — `/`

**Purpose:** Tool discovery and search entry point

**Sections:**

1. **Hero** — `--unilever-blue` background band (optional) or clean white with blue accent
   - H1: "AI Hub Digital Tools"
   - Subtitle: "Discover, learn, and get support for every tool at Unilever Head Office"
   - Centered `SearchBar`

2. **Category filters** — `CategoryFilter` chip row

3. **Tool grid** — `ToolGrid` with result count ("12 tools")

4. **Empty/search zero state** — Friendly message + clear filters CTA

**SEO/meta:** Title = "AI Hub Tool Guide | Unilever", description from PRD vision

### 6.2 Tool Detail — `/tools/[slug]`

**Purpose:** Full tool information and action CTAs

**Layout:** `ToolDetailLayout` (see 5.3)

**404:** If slug not found or deprecated-only without direct link — "Tool not found" with link home

### 6.3 Admin Tools List — `/admin/tools`

**Purpose:** CMS overview

- "Add Tool" primary button top-right
- `AdminDataTable` of all tools (including deprecated)

### 6.4 Admin Tool Form — `/admin/tools/new` and `/admin/tools/[id]/edit`

**Purpose:** Create/edit tool entries

- `AdminToolForm` full page

### 6.5 Admin Bookings — `/admin/bookings`

**Purpose:** Training request inbox (Phase 3)

- Table: date, tool, requester, status, actions
- Status dropdown: Pending → Contacted → Completed / Cancelled

### 6.6 Admin Login — `/admin/login`

**Purpose:** MVP gate (Phase 2)

- Centered card, password field, submit
- Unilever logo above form

---

## 7. Interaction & Motion

| Interaction | Behavior |
|---|---|
| Card hover | `transition: box-shadow 200ms, transform 200ms` |
| Button hover | Background lightens 10%; `transition 150ms` |
| Modal open | Fade overlay 200ms; scale panel 0.95→1 |
| Chat widget expand | Slide up 250ms ease-out |
| Page navigation | Instant (Next.js); optional subtle fade on route change |
| Focus visible | 2px `--focus-ring` outline, 2px offset |

**Avoid:** Parallax, heavy animations, auto-playing media

---

## 8. Accessibility (WCAG 2.1 AA)

| Requirement | Implementation |
|---|---|
| Color contrast | Blue `#001E62` on white = 12.6:1 ✓; body text `#1A1A1A` on white = 16.1:1 ✓ |
| Focus indicators | Visible on all interactive elements; never `outline: none` without replacement |
| Keyboard nav | Tab order: header → main → footer; modal traps focus; Esc closes modals |
| Screen readers | `aria-label` on icon buttons; `role="dialog"` on modals; live region for chatbot responses |
| Form labels | Every input has visible `<label>` or `aria-labelledby` |
| Skip link | "Skip to main content" as first focusable element |

---

## 9. Responsive Breakpoints

| Breakpoint | Width | Layout changes |
|---|---|---|
| Mobile | < 640px | Single column; hamburger nav; full-width cards |
| Tablet | 640–1024px | 2-column card grid; collapsed sidebar admin |
| Desktop | > 1024px | 3-column grid; sticky POC card; full admin sidebar |

---

## 10. Iconography

- **Library:** [Lucide React](https://lucide.dev) (consistent with shadcn/ui)
- **Style:** Outlined, 20px default, 1.5px stroke
- **Common icons:**
  - Search: `Search`
  - External link: `ExternalLink`
  - Book training: `Calendar`
  - Chat: `MessageCircle`
  - Document: `FileText`
  - Video: `PlayCircle`
  - Email: `Mail`
  - Admin: `Settings`

---

## 11. Wireframe Reference (ASCII)

### Home Page (Desktop)

```
╔══════════════════════════════════════════════════════════════════╗
║ [U Logo]  AI Hub Tool Guide         [Search...]     [Chat][Book] ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║              AI Hub Digital Tools                                  ║
║    Discover, learn, and get support for every tool               ║
║              [      Search tools...           ]                    ║
║                                                                  ║
║  [All] [Consumer Insights (CMI)] [Formulation]                   ║
║                                                                  ║
║  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              ║
║  │ Tool Card 1 │  │ Tool Card 2 │  │ Tool Card 3 │              ║
║  └─────────────┘  └─────────────┘  └─────────────┘              ║
║  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              ║
║  │ Tool Card 4 │  │ Tool Card 5 │  │ Tool Card 6 │              ║
║  └─────────────┘  └─────────────┘  └─────────────┘              ║
║                                                                  ║
╠══════════════════════════════════════════════════════════════════╣
║  © Unilever AI Hub  ·  Contact  ·  v0.1.0                        ║
╚══════════════════════════════════════════════════════════════════╝
                                                      [Chat bubble]
```

---

## 12. Design Deliverables Checklist (for agents)

When implementing each phase, verify:

- [ ] All colors use CSS tokens (no hardcoded hex in components)
- [ ] Barlow + Inter fonts loaded
- [ ] Logo in header uses `public/assets/unilever-logo.png`
- [ ] Status badges match color table (Section 5.2)
- [ ] Focus states visible on keyboard tab
- [ ] Mobile layout tested at 375px width
- [ ] Admin sidebar matches `AdminLayout` spec

---

## 13. Related Documents

- [PRD.md](./PRD.md) — Functional requirements
- [AGENT_GUIDE.md](./AGENT_GUIDE.md) — Implementation conventions
- [VERSION_HISTORY.md](./VERSION_HISTORY.md) — Design change log
