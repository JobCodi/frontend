# 지원 관리 보드 Implementation Plan

> **For Hermes:** Use TDD to implement each task test-first; do not add production behavior before its failing test is observed.

**Goal:** 관심 공고를 사용자별 지원 파이프라인 항목으로 전환하고 `/applications`에서 상태·일정·메모를 관리한다.

**Architecture:** Backend에 `JobApplicationsModule`을 독립 추가하고 `user_job_application`을 사용자+공고 유일 데이터로 둔다. Frontend는 authenticated API client와 TanStack Query를 이용해 보드를 렌더링한다. Feed는 작은 “지원 관리에 추가” mutation만 연결한다.

**Tech Stack:** NestJS 11, MikroORM/PostgreSQL, Zod, Next.js 16, React, TanStack Query, Vitest/Jest.

---

### Task 1: Backend application 도메인 RED/GREEN

**Files:**
- Create `backend/src/modules/job-applications/entities/user-job-application.entity.ts`
- Create `backend/src/modules/job-applications/user-job-application.service.ts`
- Test `backend/src/modules/job-applications/tests/user-job-application.service.spec.ts`

1. `addToBoard()`가 같은 사용자·공고의 기존 row를 재사용하고 saved preference를 보장한다는 실패 테스트를 작성한다.
2. `corepack pnpm jest --runInBand src/modules/job-applications/tests/user-job-application.service.spec.ts`가 feature 부재로 실패함을 확인한다.
3. 최소 entity/service를 구현한다.
4. 동일 명령이 통과함을 확인한다.

### Task 2: Backend update/ownership API RED/GREEN

**Files:**
- Create controller/module and migration
- Modify `backend/src/app.module.ts`, ORM config, `backend/docs/api/rest-api.md`, `backend/docs/architecture/data-model.md`
- Test controller/service tests

1. applied 자동 날짜, 1000자 제한, 타 사용자 404를 실패 테스트로 작성한다.
2. 실패를 확인한 뒤 GET/PUT/PATCH endpoint와 migration을 구현한다.
3. targeted/full test, lint, typecheck, build, migration pending check를 실행한다.

### Task 3: Frontend client/schema/query RED/GREEN

**Files:**
- Create `frontend/src/lib/schemas/application.ts`
- Create `frontend/src/features/job-applications/queries/*`
- Modify `frontend/src/lib/query/keys.ts`, Feed card
- Test schemas/helpers

1. board response 및 update payload parsing 실패 테스트를 작성한다.
2. test failure 확인 후 schema/client/query를 구현한다.
3. typecheck를 통과한다.

### Task 4: Board UX RED/GREEN

**Files:**
- Create `frontend/src/app/(flow)/applications/page.tsx`
- Create `frontend/src/features/job-applications/components/*`
- Modify `frontend/src/components/layout/app-header.tsx`

1. 빈 상태, 4 status 그룹, applied 상태 표시의 렌더 테스트를 작성한다.
2. 실패를 확인한 뒤 반응형 board, inline editing, Feed 추가 CTA를 구현한다.
3. lint/typecheck/build와 browser E2E를 실행한다.

### Task 5: Delivery

1. Backend/Frontend Issue를 생성하고 Notion 카드를 In Progress로 둔다.
2. Korean conventional commits, PR label/assignee/reviewer를 적용한다.
3. CI pass 후 squash merge, main 재검증, Notion Done으로 동기화한다.
