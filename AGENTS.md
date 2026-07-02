# AGENTS.md

This repository is the Next.js frontend for RoleFit.

## Mandatory Rules

- You must read and follow [`Rules.md`](./Rules.md) before making changes.
- If an instruction here conflicts with `Rules.md`, follow `Rules.md` unless the user explicitly says otherwise.
- Use Next.js App Router patterns and keep TypeScript strict.
- Prefer Server Components by default and push `'use client'` down to interactive leaves.

## Issue-based Workflow

- Work must be based on a GitHub Issue.
- Before coding, identify the issue number and scope.
- Branch names must include the issue number, for example `feat/18-ai-interview-screen`.
- Pull requests must link the issue with `Closes #<number>` or `Refs #<number>`.
- Do not mix unrelated issues in one PR.

## Verification

Before claiming work is complete, run the relevant checks once scripts exist:

```bash
npm run lint
npm run test
npm run build
```

If UI changed, include screenshots or a short manual QA note in the PR.
