# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # start dev server (Next.js with --webpack)
npm run build    # prisma generate + migrate deploy + next build --webpack
npm run start    # production server
npx prisma migrate dev --name <name>   # create a new migration (dev only)
npx prisma studio                      # open DB browser
```

No test runner or lint configuration is set up.

The project uses `--webpack` explicitly in all Next.js commands because of the custom webpack `@` alias in [next.config.ts](next.config.ts). Do not remove that flag or switch to Turbopack until the alias is migrated.

## Architecture

"Bob" is a French-language group voting app where a session host invites guests to rate food, movies, or activities (1–5 stars). Results surface a consensus pick.

### App Router layout

```
app/
  page.tsx                   # login
  auth/verify/page.tsx       # OTP entry
  dashboard/page.tsx         # main hub (4 views via searchParams)
  host/[sessionId]/page.tsx  # host controls + people list
  join/[sessionId]/page.tsx  # join a session
  vote/[sessionId]/page.tsx  # voter interface
  admin/page.tsx             # admin panel (ADMIN_EMAILS guard)
  api/unsplash/              # proxy to Unsplash image search
```

`searchParams` in every page is a **`Promise`** (Next.js 16 breaking change) and must be awaited before use.

### Data layer

Prisma 7 with a LibSQL adapter (SQLite). The generated client lives in `generated/prisma/` — import it from `@/generated/prisma`, not `@prisma/client`. The singleton is in [lib/prisma.ts](lib/prisma.ts). Configuration uses [prisma.config.ts](prisma.config.ts) (Prisma 7's new pattern, not `.prisma/.env`).

Key schema facts:
- `Dish` rows are **global** (not session-scoped). `topic` field (`"food"` | `"movies"` | `"activities"`) separates them. `authorsJson` is a serialised `string[]` of contributor names.
- `Vote` is unique per `(userId, dishId)`. Rating 1–5.
- Sessions group users; membership is in `SessionMember`.

### Server actions

All mutations are in `actions/` with `"use server"`. They receive `FormData` or typed arguments, perform auth checks via `getCurrentUser()` from [lib/session.ts](lib/session.ts), and call `revalidatePath()` after writes.

### Auth

Email-only OTP flow: user submits email → `sendOtpAction` creates an `OtpCode` row (10-min TTL) and sends a 6-digit code via SMTP (nodemailer). Successful verification sets a `userId` cookie (30-day, httpOnly). No middleware — each page/action calls `getCurrentUser()` directly and redirects if unauthenticated.

Admin access is gated by `isAdminEmail()` in [lib/admin.ts](lib/admin.ts), which checks against the `ADMIN_EMAILS` env var (comma-separated).

### Topics

`TOPIC_CONFIG` in [lib/presets/index.ts](lib/presets/index.ts) is the single source of truth for topic metadata (labels, placeholders, UI copy — all French). `getPresetForTopic(topic)` returns the preset dish/movie/activity list. When adding a new topic, update `TOPIC_CONFIG`, add a preset file, and add a case to both helper functions in that file.

### Styling

Tailwind CSS v4 via `@tailwindcss/postcss`. Use `@import "tailwindcss"` in CSS (not the old `@tailwind` directives). Custom utilities are defined in [app/globals.css](app/globals.css): `glass-card`, `hero-gradient`, `scrollbar-hide`, and CSS custom properties for brand colours (primary `#e85d04`).

Use `cn()` from [lib/utils.ts](lib/utils.ts) (`clsx` + `tailwind-merge`) for all dynamic class composition.

### Animations

Framer Motion is wrapped in `MotionProvider` (in [components/motion/](components/motion/)) for SSR safety. Use `PageTransition` for route-level transitions and the shared `variants.ts` for consistent motion values.

### Environment variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | LibSQL connection string (`file:./dev.db` locally) |
| `NEXT_PUBLIC_APP_URL` | Base URL for share links |
| `ADMIN_EMAILS` | Comma-separated admin emails |
| `SMTP_HOST/PORT/SECURE/USER/PASS` | Nodemailer SMTP config |
| `EMAIL_FROM` | Sender address/name |
