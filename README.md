# RoleFit Frontend

Next.js frontend for **롤핏**, an AI-based job discovery and recommendation platform.

## Role

The frontend owns the user journey from landing to onboarding, AI interview, resume upload, recommendation comparison, and report presentation.

## Planned Stack

- Framework: Next.js App Router
- UI: React + TypeScript
- Styling / UI: Tailwind CSS + shadcn/ui
- Server state: TanStack Query where client-side caching/mutations are needed
- Client state: Zustand for small, explicit app/flow state
- Data fetching: Server Components first; Client Components only for interaction
- Forms: React Hook Form + schema validation, or equivalent
- Testing: Vitest / Testing Library / Playwright as needed

## MVP Screens

```text
Landing
Login / Signup
Onboarding
AI Job Interview
Resume Upload
Resume Analysis Result
Job Candidate Comparison
RoleFit Report
My Page
```

## Suggested Initial Setup

```bash
npx create-next-app@latest frontend   --ts   --eslint   --app   --src-dir   --import-alias "@/*"

cd frontend
npm run dev
npm run lint
npm run build
```

## Frontend Library Rules

- Use shadcn/ui as the default UI primitive layer.
- Use Zustand for client-only flow state such as interview progress, temporary selections, and UI preferences.
- Use TanStack Query for client-side server state, cache invalidation, and mutations when Server Components are not enough.
- Do not duplicate server state into Zustand.

## Next.js Rules

- Prefer Server Components by default.
- Push `'use client'` down to interactive leaf components.
- In Next.js 15+, `params` and `searchParams` are Promise types; always await them.
- Do not expose backend secrets or AI provider keys to the browser.
- Recommendation UI must show reasons, missing skills, and next actions.

## Environment

Create `.env.local` locally. Do not commit secrets.

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

## Repository Workflow

1. Start from a GitHub Issue.
2. Keep PRs small and tied to one user flow or component area.
3. Include screenshots or local verification output in PRs.
4. Use the organization PR template.
