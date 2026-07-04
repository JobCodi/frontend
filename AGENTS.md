# AGENTS.md

This repository is the Next.js frontend for JobCodi.

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

## Notion Kanban Workflow

- Before starting work, create or update a card in the JobCodi Notion `개발 작업 DB` Kanban board.
- Each Notion work card should include the task title, scope, status, priority, sprint, related GitHub Issue/PR link, repository link, owner/agent, and completion criteria when available.
- Move the Notion card through the workflow as the task progresses: `Backlog` or `Ready` → `In Progress` → `Review` when a PR is open → `Done` after merge and verification.
- Add concise progress notes to the Notion card for key transitions, implementation summary, blockers, PR links, and verification results.
- If GitHub Issue or PR links are created after the Notion card, write those links back to the Notion card.
- Do not expose Notion tokens or credentials in issues, PRs, commits, logs, or documentation.

## Commit Messages

- Commit messages must be written in Korean.
- Keep the conventional type prefix when useful, but write the subject itself in Korean, for example `docs: 온보딩 IA 문서 추가`.
- PR titles and bodies may include English technical terms when clearer, but commit subjects should remain Korean by default.

## Verification

Before claiming work is complete, run the relevant checks once scripts exist:

```bash
npm run lint
npm run test
npm run build
```

If UI changed, include screenshots or a short manual QA note in the PR.
