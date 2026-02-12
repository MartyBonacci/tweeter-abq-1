# Tasks: Build Complete Tweeter Application

## Task Dependency Graph

```
T001 (scaffold) → T002 (db) → T003 (auth utils) → T004 (signup) → T005 (signin) → T006 (signout)
                                                                                         ↓
T007 (validation schemas) ──────────────────────────────────────────────────→ T008 (home/feed)
                                                                                         ↓
                                                                              T009 (tweet card + compose)
                                                                                         ↓
                                                                              T010 (like/delete actions)
                                                                                         ↓
                                                                              T011 (profile view)
                                                                                         ↓
                                                                              T012 (profile edit + cloudinary)
                                                                                         ↓
                                                                              T013 (layout + nav)
                                                                                         ↓
                                                                              T014 (styling + responsive)
```

---

### T001: Scaffold React Router v7 Project
- **Priority**: Critical
- **Dependencies**: None
- **Estimated effort**: Medium

**Description**: Initialize the React Router v7 framework mode project with TypeScript strict mode.

**Acceptance Criteria**:
- [ ] React Router v7 project created with framework mode
- [ ] TypeScript configured in strict mode
- [ ] All production dependencies installed (react-router, tailwindcss, flowbite, flowbite-react, zod, remix-hook-form, @hookform/resolvers, postgres, uuidv7, @node-rs/argon2, cloudinary)
- [ ] Tailwind CSS v4 configured with `@tailwindcss/vite` plugin
- [ ] Flowbite plugin configured in Tailwind
- [ ] `.env.example` created with DATABASE_URL, SESSION_SECRET, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
- [ ] Basic `app/routes.ts` with empty route config
- [ ] Project builds and runs with `npm run dev`

---

### T002: Database Setup & Migration
- **Priority**: Critical
- **Dependencies**: T001
- **Estimated effort**: Small

**Description**: Create the database migration SQL and the postgres client utility.

**Acceptance Criteria**:
- [ ] `migrations/001-initial-schema.sql` created with profiles, tweets, likes tables
- [ ] All constraints: PKs, FKs, UNIQUE on username/email, composite PK on likes
- [ ] `app/utils/db.server.ts` exports a postgres client with camelCase transform
- [ ] Database URL read from `DATABASE_URL` environment variable

---

### T003: Authentication Utilities
- **Priority**: Critical
- **Dependencies**: T002
- **Estimated effort**: Medium

**Description**: Build the session and auth server utilities.

**Acceptance Criteria**:
- [ ] `app/utils/auth.server.ts` created
- [ ] `createCookieSessionStorage` configured with SESSION_SECRET env var
- [ ] `signup` function: hash password with argon2, insert profile, set session cookie
- [ ] `signin` function: find by email, verify password with argon2, set session cookie
- [ ] `signout` function: destroy session cookie
- [ ] `requireAuth` function: get session → get profileId → fetch profile → redirect to /signin if missing
- [ ] `getOptionalUser` function: like requireAuth but returns null instead of redirecting
- [ ] `getSession` / `commitSession` / `destroySession` exported
- [ ] All IDs generated with uuidv7

---

### T004: Signup Route
- **Priority**: Critical
- **Dependencies**: T003, T007
- **Estimated effort**: Medium

**Description**: Build the `/signup` route with form, validation, and action.

**Acceptance Criteria**:
- [ ] Route component at `app/routes/signup.tsx`
- [ ] Loader: redirect to `/` if already authenticated
- [ ] Action: Zod validation → check username/email uniqueness → create profile → set session → redirect to `/`
- [ ] Form: username, email, password fields using remix-hook-form
- [ ] Validation errors displayed inline below each field
- [ ] Link to /signin for existing users
- [ ] Route registered in `app/routes.ts`

---

### T005: Signin Route
- **Priority**: Critical
- **Dependencies**: T003, T007
- **Estimated effort**: Medium

**Description**: Build the `/signin` route with form, validation, and action.

**Acceptance Criteria**:
- [ ] Route component at `app/routes/signin.tsx`
- [ ] Loader: redirect to `/` if already authenticated
- [ ] Action: Zod validation → find by email → verify password → set session → redirect to `/`
- [ ] Form: email, password fields using remix-hook-form
- [ ] Display "Invalid email or password" error (not field-specific for security)
- [ ] Link to /signup for new users
- [ ] Route registered in `app/routes.ts`

---

### T006: Signout Route
- **Priority**: Critical
- **Dependencies**: T003
- **Estimated effort**: Small

**Description**: Build the `/signout` action-only route.

**Acceptance Criteria**:
- [ ] Route component at `app/routes/signout.tsx`
- [ ] Action: destroy session → redirect to `/`
- [ ] No loader or UI needed (action-only)
- [ ] Route registered in `app/routes.ts`

---

### T007: Shared Validation Schemas
- **Priority**: Critical
- **Dependencies**: T001
- **Estimated effort**: Small

**Description**: Create all shared Zod validation schemas.

**Acceptance Criteria**:
- [ ] `app/utils/validation.ts` created
- [ ] `signupSchema`: username (3-20 chars, alphanumeric + underscores), email (valid), password (min 8)
- [ ] `signinSchema`: email (valid), password (non-empty)
- [ ] `tweetSchema`: content (1-140 chars, trimmed)
- [ ] `profileEditSchema`: bio (0-160 chars)
- [ ] All schemas export inferred TypeScript types via `z.infer<>`

---

### T008: Home Route (Landing + Feed)
- **Priority**: Critical
- **Dependencies**: T003, T006
- **Estimated effort**: Large

**Description**: Build the `/` route that shows landing page for visitors and tweet feed for authenticated users.

**Acceptance Criteria**:
- [ ] Route component at `app/routes/home.tsx`
- [ ] Loader: `getOptionalUser` — if null, return landing data; if user, fetch global feed (tweets with author info, like counts, user's liked tweet IDs)
- [ ] Visitor view: hero section with app description, sign up and sign in buttons
- [ ] Authenticated view: compose box at top + tweet timeline (newest first)
- [ ] Feed query joins tweets with profiles, aggregates like counts, checks current user's likes
- [ ] Route registered in `app/routes.ts` at path `/`

---

### T009: Tweet Card & Compose Box Components
- **Priority**: High
- **Dependencies**: T008
- **Estimated effort**: Medium

**Description**: Build the reusable tweet display card and compose box components.

**Acceptance Criteria**:
- [ ] `app/components/tweet-card.tsx`: displays avatar (initials fallback), username (link to profile), content, relative timestamp, like button with count, delete button (own tweets only)
- [ ] `app/components/compose-box.tsx`: textarea with 140-char limit, live character counter (changes color at 20/0 remaining), submit button
- [ ] `app/components/initials-avatar.tsx`: colored circle with first letter of username, color deterministic from username
- [ ] `app/components/delete-confirm-modal.tsx`: Flowbite modal asking "Delete this tweet?" with Cancel/Delete buttons
- [ ] Like button is a form submission (progressive enhancement)
- [ ] Delete button triggers modal, modal submit is a form submission

---

### T010: Tweet Actions (Like, Delete)
- **Priority**: High
- **Dependencies**: T009
- **Estimated effort**: Medium

**Description**: Implement the like toggle and tweet delete actions on the home route.

**Acceptance Criteria**:
- [ ] Like action on `/`: receives tweetId, toggles like (insert if not exists, delete if exists)
- [ ] Delete action on `/`: receives tweetId, verify current user owns tweet, delete tweet and its likes
- [ ] Both actions use intent field to distinguish (`_action: "like"` vs `_action: "delete"`)
- [ ] After action, redirect back to current page
- [ ] Parameterized SQL queries for all database operations

---

### T011: Profile View Route
- **Priority**: High
- **Dependencies**: T009
- **Estimated effort**: Medium

**Description**: Build the `/profile/:username` route to view any user's profile.

**Acceptance Criteria**:
- [ ] Route component at `app/routes/profile.tsx`
- [ ] Loader: requireAuth → fetch profile by username → 404 if not found → fetch user's tweets with like counts
- [ ] UI: profile header with avatar (or initials), username, bio, join date, tweet count
- [ ] Tweet list below profile header (reuse tweet-card component)
- [ ] If viewing own profile, show "Edit Profile" link
- [ ] Like/delete actions work on profile page tweets too
- [ ] Route registered in `app/routes.ts`

---

### T012: Profile Edit Route & Cloudinary Upload
- **Priority**: High
- **Dependencies**: T011
- **Estimated effort**: Medium

**Description**: Build the `/profile/edit` route with bio editing and avatar upload.

**Acceptance Criteria**:
- [ ] `app/utils/cloudinary.server.ts`: upload function that accepts a File, uploads to Cloudinary, returns URL
- [ ] Route component at `app/routes/profile-edit.tsx`
- [ ] Loader: requireAuth → fetch current user's profile
- [ ] Action: parse multipart form data → validate bio with Zod → if avatar file present, upload to Cloudinary → update profile in DB → redirect to `/profile/:username`
- [ ] UI: form with bio textarea (160 char counter), avatar file input with current avatar preview
- [ ] Route registered in `app/routes.ts`

---

### T013: Root Layout & Navigation
- **Priority**: High
- **Dependencies**: T008
- **Estimated effort**: Medium

**Description**: Build the root layout with responsive navbar.

**Acceptance Criteria**:
- [ ] `app/root.tsx`: root layout with Tailwind CSS, meta tags, Flowbite scripts
- [ ] Navbar: "Tweeter" logo/brand, conditional links based on auth state
- [ ] Authenticated nav: Home, Profile (links to /profile/:username), Sign Out (form post to /signout)
- [ ] Visitor nav: Sign In, Sign Up buttons
- [ ] Mobile responsive: hamburger menu on small screens (Flowbite navbar)
- [ ] Main content area centered with max-width

---

### T014: Styling Polish & Mobile Responsive
- **Priority**: Medium
- **Dependencies**: T013
- **Estimated effort**: Medium

**Description**: Apply the classic Twitter aesthetic and ensure mobile responsiveness.

**Acceptance Criteria**:
- [ ] Twitter blue (#1DA1F2) as primary color throughout
- [ ] Clean card-based tweet display with subtle borders/shadows
- [ ] Proper spacing, typography hierarchy
- [ ] Landing page hero is visually appealing with CTA buttons
- [ ] Forms are clean with proper error styling
- [ ] Mobile: single column layout, proper tap target sizes, no horizontal scroll
- [ ] Desktop: centered content column (max ~600px like old Twitter)
- [ ] Loading states on form submissions (button disabled while submitting)

---

## Summary

| Task | Description | Priority | Dependencies | Effort |
|------|-------------|----------|--------------|--------|
| T001 | Scaffold React Router v7 project | Critical | None | Medium |
| T002 | Database setup & migration | Critical | T001 | Small |
| T003 | Authentication utilities | Critical | T002 | Medium |
| T004 | Signup route | Critical | T003, T007 | Medium |
| T005 | Signin route | Critical | T003, T007 | Medium |
| T006 | Signout route | Critical | T003 | Small |
| T007 | Shared validation schemas | Critical | T001 | Small |
| T008 | Home route (landing + feed) | Critical | T003, T006 | Large |
| T009 | Tweet card & compose components | High | T008 | Medium |
| T010 | Tweet actions (like, delete) | High | T009 | Medium |
| T011 | Profile view route | High | T009 | Medium |
| T012 | Profile edit + Cloudinary | High | T011 | Medium |
| T013 | Root layout & navigation | High | T008 | Medium |
| T014 | Styling polish & responsive | Medium | T013 | Medium |
