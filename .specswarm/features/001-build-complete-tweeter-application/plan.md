# Implementation Plan: Build Complete Tweeter Application

## Phase 1: Project Scaffold & Infrastructure

### 1.1 Initialize React Router v7 Project
- Scaffold React Router v7 framework mode project with TypeScript
- Configure `tsconfig.json` for strict mode
- Install all dependencies:
  - `react-router` (v7, framework mode)
  - `tailwindcss`, `@tailwindcss/vite`, `flowbite`, `flowbite-react`
  - `zod`, `remix-hook-form`, `@hookform/resolvers`
  - `postgres` (PostgreSQL client)
  - `uuidv7`
  - `@node-rs/argon2`
  - `cloudinary` (v2 SDK)
- Configure Tailwind CSS with Flowbite plugin
- Create `.env.example` with all required environment variables

### 1.2 Database Setup
- Create SQL migration script (`migrations/001-initial-schema.sql`)
- Define tables: profiles, tweets, likes with constraints
- Create `app/utils/db.server.ts` — postgres client factory with camelCase transform

### 1.3 Core Utilities
- `app/utils/auth.server.ts` — session management, password hashing, auth helpers
- `app/utils/cloudinary.server.ts` — avatar upload utility
- `app/utils/validation.ts` — shared Zod schemas (signup, signin, tweet, profile)

## Phase 2: Authentication

### 2.1 Session Infrastructure
- Create cookie session storage with `createCookieSessionStorage`
- Implement `getSession`, `commitSession`, `destroySession`
- Implement `requireAuth` — redirect to `/signin` if no session
- Implement `getOptionalUser` — return user or null (for `/` route)

### 2.2 Signup Route
- Route: `/signup`
- Loader: redirect to `/` if already authenticated
- Action: validate with Zod → check uniqueness → hash password → create profile → set session → redirect to `/`
- UI: form with username, email, password fields + validation errors

### 2.3 Signin Route
- Route: `/signin`
- Loader: redirect to `/` if already authenticated
- Action: validate with Zod → find user by email → verify password → set session → redirect to `/`
- UI: form with email, password fields + validation errors

### 2.4 Signout
- Route: `/signout` (action only)
- Action: destroy session → redirect to `/`

## Phase 3: Tweet Feed (Home Page)

### 3.1 Home Route (`/`)
- Loader: check auth — if not authenticated, return landing page data; if authenticated, fetch global feed (all tweets with author info and like counts, ordered newest first), fetch current user profile
- UI (visitor): landing page with hero, sign up / sign in CTAs
- UI (authenticated): compose box + tweet timeline

### 3.2 Tweet Compose
- Form at top of feed with textarea (140 char limit)
- Character counter showing remaining chars (color changes near limit)
- Action: validate content with Zod → create tweet with uuidv7 → redirect to `/`

### 3.3 Tweet Card Component
- Display: avatar (initials if none), username, content, timestamp, like button + count, delete button (own tweets only)
- Like button: Form submission to toggle like (action on `/`)
- Delete button: Shows confirmation dialog, then submits form to delete

### 3.4 Tweet Actions
- Like action: insert or delete from likes table (toggle based on current state)
- Delete action: verify ownership → delete tweet → redirect to `/`

## Phase 4: User Profiles

### 4.1 Profile View Route (`/profile/:username`)
- Loader: requireAuth → fetch profile by username → fetch user's tweets with like counts → check if current user likes each tweet
- UI: profile header (avatar, username, bio, join date) + tweet list

### 4.2 Profile Edit Route (`/profile/edit`)
- Loader: requireAuth → fetch current user's profile
- Action: validate bio with Zod → if avatar file, upload to Cloudinary → update profile → redirect to `/profile/:username`
- UI: form with bio textarea (160 char limit) + avatar file upload with preview

### 4.3 Initials Avatar Component
- Generate colored circle with first letter of username
- Color derived from username hash (deterministic)
- Used as fallback when avatar_url is null

## Phase 5: Layout & Navigation

### 5.1 Root Layout
- Navbar: logo, home link, profile link, sign out button (when authenticated)
- Responsive: hamburger menu on mobile
- Flowbite navbar component

### 5.2 Programmatic Routes
- `app/routes.ts` — define all routes using `RouteConfig[]`
- Route components in `app/routes/` directory
- Root layout wrapping all routes

## Phase 6: Polish & Responsive Design

### 6.1 Styling
- Classic Twitter blue (#1DA1F2) color scheme
- Clean card-based tweet display
- Responsive layout: single column mobile, centered content desktop
- Flowbite components for buttons, forms, cards, navbar, modal

### 6.2 Mobile Responsive
- Tailwind responsive breakpoints
- Touch-friendly tap targets
- Proper form sizing on mobile

## File Structure

```
app/
├── routes.ts                    # Programmatic route config
├── root.tsx                     # Root layout
├── routes/
│   ├── home.tsx                 # / route (landing + feed)
│   ├── signup.tsx               # /signup
│   ├── signin.tsx               # /signin
│   ├── signout.tsx              # /signout (action only)
│   ├── profile.tsx              # /profile/:username
│   └── profile-edit.tsx         # /profile/edit
├── components/
│   ├── tweet-card.tsx           # Tweet display component
│   ├── compose-box.tsx          # Tweet compose form
│   ├── initials-avatar.tsx      # Default avatar component
│   ├── delete-confirm-modal.tsx # Delete confirmation dialog
│   └── landing-hero.tsx         # Landing page hero
├── utils/
│   ├── db.server.ts             # Database client
│   ├── auth.server.ts           # Auth utilities
│   ├── cloudinary.server.ts     # Cloudinary upload
│   └── validation.ts            # Zod schemas
migrations/
├── 001-initial-schema.sql       # Database DDL
.env.example                     # Environment template
```

## Dependencies

### Production
- `react-router` (^7)
- `@react-router/node` / `@react-router/serve`
- `tailwindcss` (^4)
- `flowbite` + `flowbite-react`
- `zod`
- `remix-hook-form` + `@hookform/resolvers`
- `postgres` (PostgreSQL client)
- `uuidv7`
- `@node-rs/argon2`
- `cloudinary`

### Development
- `typescript`
- `@types/react`, `@types/react-dom`
- `@tailwindcss/vite`

## Risk Considerations

- **Neon cold starts**: First query may be slow on serverless Postgres — consider connection pooling
- **Cloudinary SDK size**: Only import what's needed to keep bundle small
- **Session secret rotation**: Use strong random secret, document in .env.example
