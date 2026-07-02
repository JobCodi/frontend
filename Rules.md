# RollFit Frontend Rules

This document defines the default frontend structure and TypeScript conventions for the RollFit Next.js project.

## 1. Project Structure

Use the Next.js App Router with route groups and feature-oriented UI modules.

```text
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── (marketing)/
│   │   ├── page.tsx                 # landing
│   │   └── _components/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── (app)/
│   │   ├── onboarding/
│   │   ├── diagnosis/
│   │   ├── resume/
│   │   ├── recommend/
│   │   ├── report/
│   │   ├── roadmap/
│   │   └── mypage/
│   └── api/                         # route handlers only when needed
├── components/
│   ├── ui/                          # shadcn/ui primitives
│   ├── layout/
│   └── feedback/
├── features/
│   ├── onboarding/
│   ├── job-interview/
│   ├── resume-analysis/
│   ├── recommendation/
│   └── report/
├── lib/
│   ├── api/
│   ├── auth/
│   ├── config/
│   ├── query/                       # TanStack Query client/options
│   ├── schemas/
│   └── utils/
├── store/                           # Zustand stores
├── styles/
└── types/
```

### Feature folder shape

```text
features/<feature>/
├── components/
├── hooks/
├── queries/                         # feature TanStack Query hooks/options
├── schemas/
├── services/
├── stores/                          # feature-local Zustand stores when needed
├── types.ts
└── index.ts
```

### Routing rules

- Use Server Components by default.
- Add `'use client'` only for interactive leaf components.
- Keep route files thin; move complex UI to `_components` or `features/*`.
- In Next.js 15+, `params` and `searchParams` are Promise types and must be awaited.
- Wrap client components using `useSearchParams`, `useParams`, or `useRouter` with `Suspense` when they can affect static rendering.

## 2. TypeScript Conventions

### Strictness

- `strict` must stay enabled.
- Do not use `any`. Use `unknown`, typed schemas, or explicit interfaces.
- Do not use `@ts-ignore` or broad type assertions.
- Avoid non-null assertions (`!`). Use explicit guards.
- Prefer `interface` for component props and shared object shapes.
- Prefer `type` for unions, utility types, and discriminated UI states.

### React conventions

- Component files: PascalCase for exported components, kebab-case for route/helper files.
- Public component props should be named `<ComponentName>Props`.
- Extend native props when wrapping HTML elements:

```ts
interface ButtonProps extends React.ComponentProps<'button'> {
  variant?: 'primary' | 'secondary';
}
```

- Keep client state local unless shared across distant components.
- Shared client state belongs in `store/` or feature-owned stores.
- Do not fetch application data in `useEffect` when a Server Component can fetch it.

### State, query, and UI library rules

- shadcn/ui is the default component primitive system. Do not create custom primitives before checking whether shadcn/ui already covers the need.
- TanStack Query owns client-side server state: queries, mutations, retries, optimistic updates, and invalidation.
- Zustand owns client-only state: wizard progress, temporary interview answers, UI preferences, and cross-component local state.
- Do not store API response caches in Zustand. Use TanStack Query for that.
- Keep query keys typed and colocated under `lib/query` or `features/*/queries`.
- Keep Zustand stores small and feature-scoped unless state is truly global.

### API/data rules

- Browser code must not access secrets or AI provider keys.
- Keep API clients in `lib/api` or `features/*/services`.
- Validate external API responses at the boundary when shape matters.
- Recommendation UI must show reasons, missing skills, and next actions, not only a score.

### Styling

- Prefer design tokens and reusable UI primitives.
- Do not hardcode one-off colors repeatedly.
- Components must remain responsive from mobile to desktop.
- Key flows must be accessible: semantic buttons/links, visible focus states, sufficient contrast.

### Testing

- Complex UI logic should have unit/component tests.
- Critical user flows should have e2e tests once Playwright is introduced.
- PRs must include verification evidence: `npm run lint`, `npm run build`, tests, or screenshots.

## 3. Issue-based Workflow

- Do not start implementation without a GitHub Issue.
- Branch names should reference the issue: `feat/<issue-number>-short-name`, `fix/<issue-number>-short-name`.
- PRs must link the issue with `Closes #<number>` or `Refs #<number>`.
- Keep each PR scoped to one issue and one user-visible flow or component area.
