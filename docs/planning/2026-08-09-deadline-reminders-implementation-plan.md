# 마감 임박 인앱 리마인더 Implementation Plan

> **For Hermes:** Implement each production behavior with the TDD red-green-refactor cycle. No production code before a failure caused by the missing behavior is observed.

**Goal:** 로그인 사용자가 D-3 이내의 검토/지원 예정 공고를 header에서 확인하고 지원 관리로 이동하게 한다.

**Architecture:** Backend `UserJobApplicationService`가 user-scoped, deadline-window 결과를 계산한다. 얇은 controller가 `GET /applications/reminders`로 노출한다. Frontend는 TanStack Query로 해당 목록을 조회하고 authenticated `AppHeader`에 popover를 렌더한다. 발송/읽음 row를 만들지 않는다.

**Tech Stack:** NestJS + MikroORM + Jest, Next.js 16 + React + TanStack Query + Zod.

---

### Task 1: Backend deadline selection contract

**Files:**
- Test: `backend/src/modules/job-applications/tests/user-job-application.service.spec.ts`
- Modify: `backend/src/modules/job-applications/user-job-application.service.ts`

1. `listDeadlineReminders(userId, now)`의 기대 API를 테스트로 작성한다. `reviewing/planned`, `closesAt > now`, `closesAt <= now + 3일`만 반환하는지 검증한다.
2. `corepack pnpm jest --runInBand src/modules/job-applications/tests/user-job-application.service.spec.ts`를 실행한다. 메서드 부재로 RED를 확인한다.
3. MikroORM query로 user scope·status `$in`·deadline window·마감일 오름차순을 구현한다.
4. 같은 명령이 GREEN인지 확인한다.

### Task 2: Backend controller contract

**Files:**
- Test: `backend/src/modules/job-applications/tests/user-job-application.controller.spec.ts`
- Modify: `backend/src/modules/job-applications/user-job-application.controller.ts`
- Modify: `backend/docs/api/rest-api.md`

1. 인증 user id를 전달하고 `{ reminders }` envelope를 반환하는 controller 테스트를 먼저 추가한다.
2. targeted Jest가 RED인지 확인한다.
3. `GET /applications/reminders` endpoint를 추가하고 DTO projection을 명확히 한다.
4. targeted Jest GREEN 후 API A/E/X 표를 문서화한다.

### Task 3: Frontend response schema/query

**Files:**
- Create: `frontend/src/lib/schemas/reminder.ts`
- Modify: `frontend/src/lib/query/keys.ts`
- Create: `frontend/src/features/job-applications/queries/use-deadline-reminders.ts`

1. Zod schema의 valid/invalid parsing 단위 테스트를 작성한다. 프로젝트에 test runner가 없으면 schema 자체는 typecheck/build와 실제 API E2E에서 검증한다.
2. `deadlineReminders()` query key와 `GET /applications/reminders` hook을 추가한다.
3. typecheck를 실행한다.

### Task 4: Header reminder popover

**Files:**
- Create: `frontend/src/features/job-applications/components/deadline-reminder-menu.tsx`
- Modify: `frontend/src/components/layout/app-header.tsx`

1. 상태가 없는 예시 helper 또는 component test를 먼저 작성한다. 리마인더 수 배지, empty text, 지원 관리 link가 결과로 표현돼야 한다.
2. failing test를 확인한다.
3. Bell button, count badge, keyboard-accessible list, empty/error fallback을 최소로 구현한다.
4. lint/typecheck/build를 확인한다.

### Task 5: Full-stack proof and delivery

1. local PostgreSQL migration pending을 확인한다(새 migration 없음).
2. 실제 backend/frontend를 함께 기동한다.
3. authenticated browser에서 D-3 test application을 만들거나 기존 항목을 조정하고, header badge → 팝오버 → 지원 관리 이동을 검증한다.
4. console error가 없는지 확인하고 QA server를 종료한다.
5. Backend/Frontend 각 Issue-first branch에서 Korean conventional commit, PR, CI 통과, squash merge를 실행한다.
6. Notion 카드 상태와 Issue/PR 링크를 Done으로 동기화한다.
