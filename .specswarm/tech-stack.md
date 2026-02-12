# Tech Stack

## Project
- **Name**: tweeter
- **Created**: 2026-02-11
- **Auto-detected**: No (greenfield project, configured from README spec)

---

## Core Technologies

### Framework
- **React Router v7** (framework mode)
  - Loaders and actions for data flow
  - Programmatic routes via `app/routes.ts` with `RouteConfig[]`
  - NOT file-based routing

### Language
- **TypeScript** (strict mode)
  - Functional programming patterns only
  - No classes or OOP

### Build Tool
- React Router v7 built-in (Vite-based)

### Runtime
- **Node.js**

---

## Frontend

### UI Framework
- **Tailwind CSS** — utility-first styling
- **Flowbite** — component library built on Tailwind

### Forms
- **Remix hook forms** — form handling with React Router v7
- **Zod** — schema validation for forms

### Routing
- **React Router v7** programmatic routes
- Route config in `app/routes.ts`

---

## Backend

### API Style
- **REST APIs** via React Router v7 loaders/actions

### Authentication
- **@node-rs/argon2** — password hashing
- Session-based auth (React Router v7 sessions)

### Validation
- **Zod** — request validation on all endpoints

---

## Database

### Primary Database
- **PostgreSQL** via **Neon** (serverless)
- **postgres** npm package (not an ORM)
  - camelCase (JS) ↔ snake_case (DB) mapping
- **uuidv7** for all primary keys

### Schema
- Tables: `profiles`, `tweets`, `likes`
- `likes` uses composite primary key `(tweet_id, profile_id)`

---

## External Services

### File Storage
- **Cloudinary** — profile avatar uploads

---

## Testing

### Unit Testing
- Vitest (recommended, not yet configured)

### E2E Testing
- Playwright (recommended, not yet configured)

---

## Approved Libraries

### Validation
- Zod (runtime type validation + form validation)

### Auth
- @node-rs/argon2 (password hashing)

### Database
- postgres (PostgreSQL client with camelCase mapping)

### IDs
- uuidv7 (time-sortable unique identifiers)

### File Upload
- Cloudinary SDK

---

## Prohibited Patterns

### Architecture
- No file-based routing (use programmatic `RouteConfig[]`)
- No classes or OOP patterns (functional only)
- No `useEffect` for data fetching (use loaders)
- No client-side fetch for mutations (use actions)

### Libraries
- No ORMs (Prisma, Drizzle, TypeORM) — use raw postgres with parameterized queries
- No Redux or MobX — use React Router v7 loader data
- No Moment.js — use date-fns if date manipulation needed
- No PropTypes — use TypeScript
- No `any` types — use `unknown` + Zod narrowing

### Security
- No plain text passwords — always argon2
- No string concatenation in SQL — always parameterized queries
- No secrets in code — use environment variables

---

## Notes

- Configured from README specification (greenfield project)
- Update this file when adding new technologies
- Run `/specswarm:init` again to refresh after adding package.json
