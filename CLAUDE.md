# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tweeter is a simplified Twitter clone styled after the 140-character era. Built with React Router v7 in framework mode, PostgreSQL via Neon, and Cloudinary for avatar storage.

## Tech Stack

- **Frontend**: React Router v7 (framework mode with loaders/actions), TypeScript strict, Tailwind CSS v4 + Flowbite, Zod validation
- **Backend**: REST APIs via React Router v7 loaders/actions, TypeScript, Zod validation
- **Database**: PostgreSQL (Neon), `postgres` npm package with camelCase-to-snake_case mapping, uuidv7 for IDs
- **Auth**: @node-rs/argon2 for password hashing, cookie session storage
- **Storage**: Cloudinary for profile avatars

## Architecture Conventions

- **Functional programming only** — no classes or OOP patterns
- **Programmatic routes** via `app/routes.ts` using `RouteConfig[]` — NOT file-based routing
- **Zod** for both frontend UX validation and backend security validation
- **Server-first data flow** — loaders for reads, actions for mutations (no useEffect for data, no client-side fetch)
- **No ORMs** — raw parameterized SQL via the `postgres` tagged template literal

## Key Files

- `app/routes.ts` — all route definitions (programmatic, not file-based)
- `app/root.tsx` — root layout with navbar, loads user via `getOptionalUser`
- `app/utils/auth.server.ts` — session management, signup/signin/signout, requireAuth/getOptionalUser
- `app/utils/db.server.ts` — postgres client with camelCase transform
- `app/utils/validation.ts` — shared Zod schemas (signup, signin, tweet, profileEdit)
- `app/utils/cloudinary.server.ts` — avatar upload to Cloudinary
- `migrations/001-initial-schema.sql` — database DDL (profiles, tweets, likes)

## Route Types Pattern

Each route imports its types from the auto-generated `+types` directory:
```typescript
import type { Route } from "./+types/routename";
export async function loader({ request }: Route.LoaderArgs) { ... }
export async function action({ request }: Route.ActionArgs) { ... }
export default function Component({ loaderData }: Route.ComponentProps) { ... }
```

Run `npx react-router typegen` to regenerate types after changing routes.

## Development Commands

```bash
npm run dev        # start dev server (port 5173)
npm run build      # production build
npm run start      # start production server
npm run typecheck  # generate types + type check
```

## Database Schema

Three tables: `profiles`, `tweets`, `likes`. The `likes` table uses a composite primary key `(tweet_id, profile_id)`. All IDs are uuidv7. See `migrations/001-initial-schema.sql`.

## Environment Variables

Requires `.env` file (not committed). See `.env.example` for required variables:
- `DATABASE_URL` — Neon PostgreSQL connection string
- `SESSION_SECRET` — cookie session encryption key
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — avatar uploads
