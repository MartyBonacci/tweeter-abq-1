# Project Constitution

## Project
- **Name**: tweeter
- **Description**: A simplified Twitter clone styled like the 140-character era
- **Created**: 2026-02-11

## Governing Principles

### 1. Functional Programming Only
- No classes, no OOP patterns
- Pure functions, composition, and immutable data transformations
- Factory functions over constructors when state encapsulation is needed

### 2. Programmatic Routes
- All routes defined in `app/routes.ts` using `RouteConfig[]`
- No file-based routing conventions
- Explicit route configuration over convention-based discovery

### 3. Zod Validation Everywhere
- Frontend: Zod schemas for form validation (UX)
- Backend: Zod schemas for request validation (security)
- Shared schemas where possible to avoid duplication

### 4. Server-First Data Flow
- React Router v7 loaders for data fetching (no useEffect for data)
- React Router v7 actions for mutations (no client-side fetch for writes)
- Progressive enhancement — forms work without JavaScript

### 5. Type Safety End-to-End
- TypeScript strict mode
- Zod inferred types (`z.infer<typeof schema>`) over manual interfaces
- No `any` types — use `unknown` and narrow with Zod when needed

## Decision Authority

- **Architecture decisions**: Documented in this constitution and tech-stack.md
- **Feature scope**: Defined in feature spec.md files
- **Quality gates**: Enforced by quality-standards.md

## Amendment Process

Update this file when project principles evolve. Run `/specswarm:constitution` to regenerate.
