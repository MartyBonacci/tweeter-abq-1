# Feature Specification: Build Complete Tweeter Application

## Overview

Build the full Tweeter application from scratch — a simplified Twitter clone styled after the 140-character era. This is a greenfield React Router v7 (framework mode) application with PostgreSQL, session-based auth, and Cloudinary avatar uploads.

## User Stories

### Authentication
- **US-1**: As a visitor, I can sign up with a username, email, and password so I can create an account
- **US-2**: As a visitor, I can sign in with email and password so I can access my account
- **US-3**: As a user, I can sign out so I can end my session
- **US-4**: As a visitor, I am redirected to sign in if I try to access authenticated routes

### Tweet Feed
- **US-5**: As a user, I can see a timeline of all tweets (newest first) on the home page
- **US-6**: As a user, I can compose and post a tweet (max 140 characters) from the home page
- **US-7**: As a user, I can see a character counter that shows remaining characters while composing
- **US-8**: As a user, I can delete my own tweets (not other users' tweets)

### Likes
- **US-9**: As a user, I can like a tweet by clicking a heart/like button
- **US-10**: As a user, I can unlike a tweet I previously liked
- **US-11**: As a user, I can see the total like count on each tweet
- **US-12**: As a user, I can see which tweets I have liked (visual indicator)

### User Profiles
- **US-13**: As a user, I can view my own profile showing my bio, avatar, and tweets
- **US-14**: As a user, I can edit my profile bio (max 160 characters)
- **US-15**: As a user, I can upload a profile avatar image (via Cloudinary)
- **US-16**: As a user, I can view other users' profiles and their tweets

### Landing Page
- **US-17**: As a visitor (not signed in), I see a landing page with sign up / sign in options

## Routes

All routes defined programmatically in `app/routes.ts` using `RouteConfig[]`:

| Path | Purpose | Auth Required |
|------|---------|---------------|
| `/` | Landing page (visitor) OR home feed with compose box (authenticated) | No |
| `/signup` | Registration form | No (redirect if authed) |
| `/signin` | Login form | No (redirect if authed) |
| `/signout` | Sign out action | Yes |
| `/profile/:username` | Any user's profile and their tweets | Yes |
| `/profile/edit` | Edit own profile (bio, avatar) | Yes |

## Database Schema

### profiles
| Column | Type | Constraints |
|--------|------|-------------|
| id | text | PK, uuidv7 |
| username | text | UNIQUE, NOT NULL |
| email | text | UNIQUE, NOT NULL |
| password_hash | text | NOT NULL |
| bio | text | nullable, max 160 |
| avatar_url | text | nullable |
| created_at | timestamptz | NOT NULL, DEFAULT now() |

### tweets
| Column | Type | Constraints |
|--------|------|-------------|
| id | text | PK, uuidv7 |
| profile_id | text | FK → profiles.id, NOT NULL |
| content | text | NOT NULL, max 140 |
| created_at | timestamptz | NOT NULL, DEFAULT now() |

### likes
| Column | Type | Constraints |
|--------|------|-------------|
| tweet_id | text | FK → tweets.id, NOT NULL |
| profile_id | text | FK → profiles.id, NOT NULL |
| created_at | timestamptz | NOT NULL, DEFAULT now() |
| | | PK (tweet_id, profile_id) |

## Validation Schemas (Zod)

### Signup
- username: 3-20 chars, alphanumeric + underscores only
- email: valid email format
- password: min 8 chars

### Signin
- email: valid email
- password: non-empty string

### Tweet
- content: 1-140 chars, trimmed

### Profile Edit
- bio: 0-160 chars
- avatar: optional file upload (image/jpeg, image/png, image/webp, max 2MB)

## Architecture

### Data Flow
- **Loaders**: Fetch data server-side (profiles, tweets, likes) — no useEffect
- **Actions**: Handle mutations (signup, signin, tweet, like, profile edit) — no client-side fetch
- **Sessions**: Cookie-based session using React Router v7 `createCookieSessionStorage`

### Database Access
- `app/utils/db.server.ts` — postgres client with camelCase mapping
- `app/utils/queries.server.ts` — parameterized SQL query functions
- All IDs generated with uuidv7

### Authentication
- `app/utils/auth.server.ts` — signup, signin, signout, getSession, requireAuth
- Passwords hashed with @node-rs/argon2
- Session stores profile ID in cookie

### File Upload
- `app/utils/cloudinary.server.ts` — upload avatar to Cloudinary
- Accept image files up to 2MB
- Return Cloudinary URL for storage in profiles table

## UI Design Direction

Classic Twitter aesthetic from the 140-character era:
- Blue (#1DA1F2) and white color scheme
- Clean sans-serif typography
- Timeline feed layout with compose box at top
- Profile sidebar or header with avatar, bio, stats
- Heart icon for likes with count
- Mobile responsive (single column on small screens)
- Flowbite components where applicable (buttons, forms, cards, navbar)

## Environment Variables

```
DATABASE_URL=postgresql://user:pass@host/dbname?sslmode=require
SESSION_SECRET=your-session-secret-here
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Clarification Decisions

1. **Landing/Home route**: `/` serves both — landing page for visitors, home feed for authenticated users (no separate `/home` route)
2. **Tweet deletion**: Confirm dialog — click delete, then confirm in a modal before removing
3. **Feed scope**: Global feed — shows all tweets from all users (no follow system)
4. **Default avatar**: Initials avatar — colored circle with user's first letter, generated client-side

## Non-Functional Requirements

- All forms work with progressive enhancement (no JS required for basic function)
- Semantic HTML with proper accessibility attributes
- Mobile responsive via Tailwind breakpoints
- Parameterized SQL queries only (no string concatenation)
- Server-side validation on every mutation (Zod)
